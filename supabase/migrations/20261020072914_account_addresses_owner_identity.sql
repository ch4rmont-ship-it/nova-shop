-- Pin the already verified NOVA owner to their existing identity before allowing
-- unconfirmed customer registrations. Email alone must never grant admin rights.
update public.profiles p set role='admin'
where p.id='dce2598f-8c4c-4e22-9724-13ccc115346c'
and exists(select 1 from auth.users u where u.id=p.id and lower(u.email)='ch4rmont@gmail.com' and u.email_confirmed_at is not null);
create or replace function private.claim_shop_owner() returns boolean language sql stable security invoker set search_path='' as $$
 select auth.uid()='dce2598f-8c4c-4e22-9724-13ccc115346c'::uuid and exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin');
$$;

create or replace function public.save_my_address(p_id uuid,p_address jsonb) returns uuid
language plpgsql security invoker set search_path='' as $$
declare uid uuid:=auth.uid(); target uuid; make_default boolean;
begin
 if uid is null then raise exception 'Нэвтэрнэ үү'; end if;
 perform pg_advisory_xact_lock(hashtextextended(uid::text||':addresses',0));
 if length(coalesce(p_address->>'full_name','')) not between 2 and 120 or coalesce(p_address->>'phone','')!~'^[0-9]{8}$'
 or coalesce(p_address->>'country','')<>'Mongolia' or length(coalesce(p_address->>'city','')) not between 1 and 100
 or length(coalesce(p_address->>'state','')) not between 1 and 100 or length(coalesce(p_address->>'address_line1','')) not between 3 and 200 then raise exception 'Хаягийн мэдээллээ бүрэн оруулна уу'; end if;
 if p_id is not null and not exists(select 1 from public.addresses where id=p_id and user_id=uid) then raise exception 'Хаяг олдсонгүй'; end if;
 if p_id is null and (select count(*) from public.addresses where user_id=uid)>=10 then raise exception '10 хүртэл хаяг хадгална'; end if;
 make_default:=coalesce((p_address->>'is_default')::boolean,false) or not exists(select 1 from public.addresses where user_id=uid and is_default and id is distinct from p_id);
 if make_default then update public.addresses set is_default=false where user_id=uid and is_default; end if;
 if p_id is null then
  insert into public.addresses(user_id,label,full_name,phone,country,city,state,address_line1,postal_code,is_default)
  values(uid,left(coalesce(nullif(p_address->>'label',''),'Гэр'),60),p_address->>'full_name',p_address->>'phone','Mongolia',p_address->>'city',p_address->>'state',p_address->>'address_line1',left(coalesce(p_address->>'postal_code',''),30),make_default) returning id into target;
 else
  update public.addresses set label=left(coalesce(nullif(p_address->>'label',''),'Гэр'),60),full_name=p_address->>'full_name',phone=p_address->>'phone',country='Mongolia',city=p_address->>'city',state=p_address->>'state',address_line1=p_address->>'address_line1',postal_code=left(coalesce(p_address->>'postal_code',''),30),is_default=make_default where id=p_id and user_id=uid returning id into target;
 end if;
 return target;
end; $$;
revoke all on function public.save_my_address(uuid,jsonb) from public,anon;
grant execute on function public.save_my_address(uuid,jsonb) to authenticated;

create or replace function public.set_my_default_address(p_id uuid) returns void
language plpgsql security invoker set search_path='' as $$
declare uid uuid:=auth.uid();
begin
 if uid is null then raise exception 'Нэвтэрнэ үү'; end if;
 perform pg_advisory_xact_lock(hashtextextended(uid::text||':addresses',0));
 if not exists(select 1 from public.addresses where id=p_id and user_id=uid) then raise exception 'Хаяг олдсонгүй'; end if;
 update public.addresses set is_default=false where user_id=uid and is_default;
 update public.addresses set is_default=true where user_id=uid and id=p_id;
end; $$;
revoke all on function public.set_my_default_address(uuid) from public,anon;
grant execute on function public.set_my_default_address(uuid) to authenticated;
