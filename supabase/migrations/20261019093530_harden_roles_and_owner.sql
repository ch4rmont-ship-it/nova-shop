-- Keep role lookup behind RLS without an exposed SECURITY DEFINER endpoint.
alter function public.is_admin() set schema private;
grant usage on schema private to anon;
revoke all on function private.is_admin() from public;
grant execute on function private.is_admin() to anon,authenticated;
create function public.is_admin() returns boolean language sql stable security invoker set search_path='' as $$ select private.is_admin(); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon,authenticated;

-- Owner is bound to the connected GitHub account email, and must prove email
-- ownership through Supabase Auth. Neither user_metadata nor a client argument
-- can choose the admin identity.
create function private.claim_shop_owner() returns boolean language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null then return false; end if;
 if not exists(select 1 from auth.users where id=auth.uid() and lower(email)='ch4rmont@gmail.com' and email_confirmed_at is not null) then return false; end if;
 update public.profiles set role='admin' where id=auth.uid();
 return true;
end; $$;
revoke all on function private.claim_shop_owner() from public,anon;
grant execute on function private.claim_shop_owner() to authenticated;
create function public.claim_shop_owner() returns boolean language sql security invoker set search_path='' as $$ select private.claim_shop_owner(); $$;
revoke all on function public.claim_shop_owner() from public,anon;
grant execute on function public.claim_shop_owner() to authenticated;
