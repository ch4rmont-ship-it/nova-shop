-- All fixtures and address writes are rolled back; NOVA only.
begin;
insert into auth.users(id,email,raw_user_meta_data) values
 ('92000000-0000-4000-8000-000000000001','nova-address-test@example.test','{}'),
 ('92000000-0000-4000-8000-000000000002','nova-address-other@example.test','{}');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"92000000-0000-4000-8000-000000000001","role":"authenticated","email":"ch4rmont@gmail.com"}',true);
do $$
declare a uuid;b uuid;blocked boolean:=false;v jsonb:='{"label":"Гэр","full_name":"Test Customer","phone":"99112233","country":"Mongolia","city":"Улаанбаатар","state":"Хан-Уул","address_line1":"Тест хаяг 123","is_default":false}';
begin
 if public.claim_shop_owner() or public.is_admin() then raise exception 'Email spoof gained admin';end if;
 a:=public.save_my_address(null,v);
 if not exists(select 1 from public.addresses where id=a and is_default) then raise exception 'First address not default';end if;
 b:=public.save_my_address(null,v||'{"label":"Ажил"}'::jsonb);
 if (select count(*) from public.addresses where is_default)<>1 then raise exception 'Duplicate defaults';end if;
 perform public.set_my_default_address(b);
 perform public.save_my_address(b,v||'{"address_line1":"Шинэ тест хаяг"}'::jsonb);
 if not exists(select 1 from public.addresses where id=b and is_default and address_line1='Шинэ тест хаяг') then raise exception 'Address edit failed';end if;
 insert into public.favorites(user_id,product_id) values(auth.uid(),'00000000-0000-4000-8000-000000000001');
 if not exists(select 1 from public.favorites where user_id=auth.uid()) then raise exception 'Favorite not saved';end if;
 perform set_config('request.jwt.claims','{"sub":"92000000-0000-4000-8000-000000000002","role":"authenticated"}',true);
 if exists(select 1 from public.addresses where id=a) or exists(select 1 from public.favorites) then raise exception 'Private account data leaked';end if;
 begin perform public.set_my_default_address(a);exception when others then blocked:=true;end;
 if not blocked then raise exception 'Other user changed default';end if;
 blocked:=false;
 begin perform public.save_my_address(b,v);exception when others then blocked:=true;end;
 if not blocked then raise exception 'Other user edited address';end if;
end; $$;
reset role;
select 'PASS: address create/edit/default, favorites, RLS and owner identity' as result;
rollback;
