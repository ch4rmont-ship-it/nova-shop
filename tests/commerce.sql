-- Run only against the dedicated NOVA project. Every fixture rolls back.
begin;
insert into auth.users(id,email,raw_user_meta_data) values
 ('90000000-0000-4000-8000-000000000001','nova-test-customer@example.test','{}'),
 ('90000000-0000-4000-8000-000000000002','nova-test-admin@example.test','{}'),
 ('90000000-0000-4000-8000-000000000003','nova-test-other@example.test','{}');
update public.profiles set role='admin' where id='90000000-0000-4000-8000-000000000002';
update public.products set stock=2,preorder=false where id='00000000-0000-4000-8000-000000000001';
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"90000000-0000-4000-8000-000000000001","role":"authenticated","email":"nova-test-customer@example.test"}',true);
do $$
declare o record; first_id uuid; c integer; blocked boolean:=false; before_stock integer;
begin
 if public.claim_shop_owner() then raise exception 'Customer claimed owner role'; end if;
 if public.is_admin() then raise exception 'Customer became admin'; end if;
 if has_column_privilege('authenticated','public.profiles','role','UPDATE') then raise exception 'Role column writable'; end if;
 if exists(select 1 from public.product_sourcing) then raise exception 'Sourcing costs leaked'; end if;
 select * into o from public.place_order('[{"product_id":"00000000-0000-4000-8000-000000000001","quantity":1}]','{"fullName":"Test Customer","phone":"99112233","city":"УБ","addressLine1":"Test address"}','80000000-0000-4000-8000-000000000001');
 first_id:=o.order_id;
 select stock into c from public.products where id='00000000-0000-4000-8000-000000000001';
 if c<>1 then raise exception 'Stock not reserved'; end if;
 select * into o from public.place_order('[{"product_id":"00000000-0000-4000-8000-000000000001","quantity":1}]','{"fullName":"Test Customer","phone":"99112233","city":"УБ","addressLine1":"Test address"}','80000000-0000-4000-8000-000000000001');
 if o.order_id<>first_id then raise exception 'Retry duplicated order'; end if;
 select stock into c from public.products where id='00000000-0000-4000-8000-000000000001';
 if c<>1 then raise exception 'Retry reserved twice'; end if;
 begin
  perform public.place_order('[{"product_id":"00000000-0000-4000-8000-000000000001","quantity":1},{"product_id":"00000000-0000-4000-8000-000000000001","quantity":1}]','{"fullName":"Test Customer","phone":"99112233","city":"УБ","addressLine1":"Test address"}',gen_random_uuid());
 exception when others then blocked:=true; end;
 if not blocked then raise exception 'Duplicate lines oversold stock'; end if;
 blocked:=false;
 begin perform public.admin_order_action(first_id,'paid');exception when others then blocked:=true;end;
 if not blocked then raise exception 'Customer changed payment status'; end if;
 if not exists(select 1 from public.orders where id=first_id and currency='mnt' and shipping_cents=1200000 and payment_status='pending') then raise exception 'Order total or payment status incorrect'; end if;
 perform set_config('request.jwt.claims','{"sub":"90000000-0000-4000-8000-000000000003","role":"authenticated"}',true);
 if exists(select 1 from public.orders where id=first_id) then raise exception 'Other customer can read order'; end if;
 perform set_config('request.jwt.claims','{"sub":"90000000-0000-4000-8000-000000000002","role":"authenticated"}',true);
 if not public.is_admin() then raise exception 'Admin role check failed'; end if;
 perform public.admin_order_action(first_id,'cancelled');
 perform public.admin_order_action(first_id,'cancelled');
 select stock into c from public.products where id='00000000-0000-4000-8000-000000000001';
 if c<>2 then raise exception 'Cancel did not restore exactly once'; end if;
 perform set_config('request.jwt.claims','{"sub":"90000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
 select stock into before_stock from public.products where id='00000000-0000-4000-8000-000000000002';
 select * into o from public.place_order('[{"product_id":"00000000-0000-4000-8000-000000000002","quantity":3}]','{"fullName":"Test Customer","phone":"99112233","city":"УБ","addressLine1":"Test address"}',gen_random_uuid());
 select stock into c from public.products where id='00000000-0000-4000-8000-000000000002';
 if c<>before_stock then raise exception 'Preorder changed on-hand inventory'; end if;
 perform set_config('request.jwt.claims','{"sub":"90000000-0000-4000-8000-000000000002","role":"authenticated"}',true);
 perform public.admin_order_action(o.order_id,'cancelled');
 select stock into c from public.products where id='00000000-0000-4000-8000-000000000002';
 if c<>before_stock then raise exception 'Preorder cancellation created fake stock'; end if;
end; $$;
reset role;
select 'PASS: ownership, RLS, idempotency, duplicate-line overselling, cancellation and preorder inventory' as result;
rollback;
