-- NOVA only. Apply after initial_schema on a dedicated, empty NOVA project.
alter table public.products add column if not exists brand text not null default 'NOVA Select';
alter table public.products add column if not exists preorder boolean not null default false;
alter table public.products add column if not exists source_public_url text;
alter table public.orders alter column currency set default 'mnt';
alter table public.orders add column if not exists payment_method text not null default 'cod';
alter table public.orders add column if not exists request_id uuid;
create unique index if not exists orders_idempotency on public.orders(user_id,request_id);
alter table public.order_items add column if not exists reserved_quantity integer not null default 0 check(reserved_quantity>=0);
alter table public.order_items add column if not exists preorder_snapshot boolean not null default false;
alter table public.profiles add column if not exists email text not null default '';
revoke update on public.profiles from anon,authenticated;
grant update(full_name,phone,avatar_url) on public.profiles to authenticated;
revoke update on public.orders from anon,authenticated;

create table if not exists public.product_sourcing (
 product_id uuid primary key references public.products(id) on delete cascade,
 marketplace text, title text, url text, cost_cny numeric check(cost_cny>=0),
 markup_percent numeric default 35 check(markup_percent>=0),
 estimates jsonb not null default '{}', checked_at date
);
alter table public.product_sourcing enable row level security;
create policy "admin sourcing" on public.product_sourcing for all to authenticated
using(public.is_admin()) with check(public.is_admin());
grant select,insert,update,delete on public.product_sourcing to authenticated;
revoke all on public.product_sourcing from anon;

create schema if not exists private;
grant usage on schema private to authenticated;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,full_name,email) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),coalesce(new.email,''));
 return new;
end; $$;

create or replace function private.place_order(p_items jsonb,p_address jsonb,p_request_id uuid)
returns table(order_id uuid,order_number text) language plpgsql security definer set search_path='' as $$
declare
 uid uuid:=auth.uid(); oid uuid; ono text; item record; prod public.products%rowtype;
 subtotal integer:=0; shipping integer; qty integer; unit integer;
begin
 if uid is null then raise exception 'Нэвтрэх шаардлагатай'; end if;
 if p_request_id is null then raise exception 'Invalid request ID'; end if;
 -- Serialize this customer's requests: retries return one order and reserve once.
 perform pg_advisory_xact_lock(hashtextextended(uid::text,0));
 select o.id,o.order_number into oid,ono from public.orders o where o.user_id=uid and o.request_id=p_request_id;
 if found then return query select oid,ono; return; end if;
 if (select count(*) from public.orders o where o.user_id=uid and o.created_at>now()-interval '1 hour')>=10 then
  raise exception 'Дараа дахин оролдоно уу';
 end if;
 if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) not between 1 and 100 then raise exception 'Сагс хоосон байна'; end if;
 if jsonb_typeof(p_address) is distinct from 'object' or length(coalesce(p_address->>'fullName','')) not between 2 and 120
 or coalesce(p_address->>'phone','') !~ '^[0-9]{8}$' or length(coalesce(p_address->>'city',''))<1
 or length(coalesce(p_address->>'addressLine1',''))<3 then raise exception 'Хүргэлтийн мэдээллээ шалгана уу'; end if;
 if exists(select 1 from jsonb_array_elements(p_items) x where (x->>'quantity')::numeric<>trunc((x->>'quantity')::numeric) or coalesce((x->>'quantity')::integer,0) not between 1 and 99) then raise exception 'Тоо ширхэг буруу'; end if;
 -- Aggregate duplicate IDs and lock in stable order to avoid overselling/deadlocks.
 for item in select (x->>'product_id')::uuid pid,sum((x->>'quantity')::integer)::integer quantity from jsonb_array_elements(p_items) x group by 1 order by 1 loop
  qty:=item.quantity;
  if qty not between 1 and 99 then raise exception 'Тоо ширхэг буруу'; end if;
  select * into prod from public.products p where p.id=item.pid and p.active for update;
  if not found then raise exception 'Бараа олдсонгүй'; end if;
  if not prod.preorder and prod.stock<qty then raise exception 'Барааны үлдэгдэл хүрэлцэхгүй'; end if;
  unit:=coalesce(prod.sale_price_cents,prod.price_cents);
  subtotal:=subtotal+unit*qty;
 end loop;
 shipping:=case when subtotal>=15000000 then 0 else 1200000 end;
 insert into public.orders(user_id,customer_email,shipping_address,subtotal_cents,shipping_cents,total_cents,currency,payment_method,request_id)
 values(uid,coalesce(auth.jwt()->>'email',''),p_address,subtotal,shipping,subtotal+shipping,'mnt','cod',p_request_id)
 returning id,public.orders.order_number into oid,ono;
 for item in select (x->>'product_id')::uuid pid,sum((x->>'quantity')::integer)::integer quantity from jsonb_array_elements(p_items) x group by 1 order by 1 loop
  select * into prod from public.products p where p.id=item.pid;
  insert into public.order_items(order_id,product_id,product_name_snapshot,sku_snapshot,unit_price_cents,quantity,reserved_quantity,preorder_snapshot)
  values(oid,prod.id,prod.name,prod.sku,coalesce(prod.sale_price_cents,prod.price_cents),item.quantity,case when prod.preorder then 0 else item.quantity end,prod.preorder);
  if not prod.preorder then update public.products set stock=stock-item.quantity where id=prod.id; end if;
 end loop;
 return query select oid,ono;
end; $$;
revoke all on function private.place_order(jsonb,jsonb,uuid) from public,anon;
grant execute on function private.place_order(jsonb,jsonb,uuid) to authenticated;
create or replace function public.place_order(p_items jsonb,p_address jsonb,p_request_id uuid)
returns table(order_id uuid,order_number text) language sql security invoker set search_path=''
as $$ select * from private.place_order(p_items,p_address,p_request_id); $$;
revoke all on function public.place_order(jsonb,jsonb,uuid) from public,anon;
grant execute on function public.place_order(jsonb,jsonb,uuid) to authenticated;

create or replace function private.admin_order_action(p_id uuid,p_action text) returns void
language plpgsql security definer set search_path='' as $$
declare o public.orders%rowtype; item record;
begin
 if auth.uid() is null or not public.is_admin() then raise exception 'Admin required'; end if;
 select * into o from public.orders where id=p_id for update;
 if not found then raise exception 'Order not found'; end if;
 if p_action=o.status::text then return; end if;
 if o.status in ('cancelled','refunded','delivered') then raise exception 'Захиалга хаагдсан'; end if;
 if p_action='paid' then
  if o.payment_method<>'cod' then raise exception 'Use verified payment provider'; end if;
  update public.orders set payment_status='paid',status=case when status='pending' then 'paid'::public.order_status else status end where id=p_id;
 elsif p_action='cancelled' then
  if o.payment_status='paid' then raise exception 'Төлбөрийг эхлээд буцаана уу'; end if;
  if not o.stock_released then
   for item in select product_id,reserved_quantity from public.order_items where order_id=p_id order by product_id loop
    update public.products set stock=stock+item.reserved_quantity where id=item.product_id;
   end loop;
  end if;
  update public.orders set stock_released=true,status='cancelled',payment_status='failed',cancellation_reason='admin_cancelled' where id=p_id;
 elsif (p_action='processing' and o.status in ('pending','paid')) or (p_action='shipped' and o.status='processing') or (p_action='delivered' and o.status='shipped' and o.payment_status='paid') then
  update public.orders set status=p_action::public.order_status where id=p_id;
 else raise exception 'Захиалгын төлөвийн шилжилт буруу'; end if;
end; $$;
revoke all on function private.admin_order_action(uuid,text) from public,anon;
grant execute on function private.admin_order_action(uuid,text) to authenticated;
create or replace function public.admin_order_action(p_id uuid,p_action text) returns void
language sql security invoker set search_path='' as $$ select private.admin_order_action(p_id,p_action); $$;
revoke all on function public.admin_order_action(uuid,text) from public,anon;
grant execute on function public.admin_order_action(uuid,text) to authenticated;

-- Block bypassing the protected order functions even when default grants differ.
revoke insert,update,delete on public.orders,public.order_items from anon,authenticated;
create index if not exists favorites_product_idx on public.favorites(product_id);
create index if not exists cart_product_idx on public.cart_items(product_id);
create index if not exists reviews_user_idx on public.reviews(user_id);
