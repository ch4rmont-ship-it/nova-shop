-- NOVA Commerce initial production schema
create extension if not exists pgcrypto;

create type public.user_role as enum ('customer','admin');
create type public.order_status as enum ('pending','paid','processing','shipped','delivered','cancelled','refunded');
create type public.payment_status as enum ('pending','paid','failed','refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  avatar_url text,
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  image_url text,
  image_path text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  sku text not null unique,
  short_description text not null default '',
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  sale_price_cents integer check (sale_price_cents is null or (sale_price_cents >= 0 and sale_price_cents < price_cents)),
  stock integer not null default 0 check (stock >= 0),
  featured boolean not null default false,
  bestseller boolean not null default false,
  active boolean not null default true,
  specifications jsonb not null default '{}'::jsonb check (jsonb_typeof(specifications)='object'),
  rating numeric(3,2) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  storage_path text,
  alt_text text not null default '',
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create unique index product_primary_image_unique on public.product_images(product_id) where is_primary;
create index product_images_product_idx on public.product_images(product_id, sort_order);
create index products_category_idx on public.products(category_id) where active;
create index products_active_created_idx on public.products(active, created_at desc);
create index products_featured_idx on public.products(featured) where active and featured;
create index products_bestseller_idx on public.products(bestseller) where active and bestseller;
create index products_name_search_idx on public.products using gin (to_tsvector('simple', name || ' ' || short_description || ' ' || description));

create table public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.cart_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null check (quantity between 1 and 99),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home',
  full_name text not null,
  phone text not null default '',
  country text not null,
  city text not null,
  state text not null default '',
  address_line1 text not null,
  postal_code text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index addresses_user_idx on public.addresses(user_id);
create unique index one_default_address_per_user on public.addresses(user_id) where is_default;

create sequence public.order_number_seq start 1;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  user_id uuid references auth.users(id) on delete set null,
  customer_email text not null,
  shipping_address jsonb not null check (jsonb_typeof(shipping_address)='object'),
  subtotal_cents integer not null check (subtotal_cents >= 0),
  shipping_cents integer not null default 0 check (shipping_cents >= 0),
  discount_cents integer not null default 0 check (discount_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'usd' check (currency = lower(currency) and length(currency)=3),
  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'pending',
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  stock_released boolean not null default false,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_user_idx on public.orders(user_id, created_at desc);
create index orders_status_idx on public.orders(status, created_at desc);
create index orders_payment_status_idx on public.orders(payment_status, created_at desc);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  sku_snapshot text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);
create index order_items_order_idx on public.order_items(order_id);
create index order_items_product_idx on public.order_items(product_id);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  title text not null check (char_length(title) between 2 and 120),
  comment text not null check (char_length(comment) between 3 and 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, product_id)
);
create index reviews_product_idx on public.reviews(product_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
create trigger products_updated_at before update on public.products for each row execute function public.set_updated_at();
create trigger cart_items_updated_at before update on public.cart_items for each row execute function public.set_updated_at();
create trigger addresses_updated_at before update on public.addresses for each row execute function public.set_updated_at();
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
create trigger reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at();

create or replace function public.set_order_number()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.order_number is null or new.order_number = '' then
    new.order_number := 'ORD-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.order_number_seq')::text, 6, '0');
  end if;
  return new;
end;
$$;
create trigger orders_number before insert on public.orders for each row execute function public.set_order_number();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'::public.user_role);
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Product rating stays derived from reviews.
create or replace function public.refresh_product_rating()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target uuid := coalesce(new.product_id, old.product_id);
begin
  update public.products p
  set rating = coalesce((select round(avg(r.rating)::numeric, 2) from public.reviews r where r.product_id = target), 0),
      review_count = (select count(*) from public.reviews r where r.product_id = target)
  where p.id = target;
  return coalesce(new, old);
end;
$$;
revoke all on function public.refresh_product_rating() from public, anon, authenticated;
create trigger reviews_refresh_rating after insert or update or delete on public.reviews for each row execute function public.refresh_product_rating();

-- Atomic stock reservation + order creation. Service role only.
create or replace function public.create_pending_order(
  p_user_id uuid,
  p_customer_email text,
  p_shipping_address jsonb,
  p_items jsonb,
  p_shipping_cents integer
)
returns table(order_id uuid, order_number text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
  v_unit integer;
  v_subtotal integer := 0;
begin
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;
  if p_shipping_cents < 0 then raise exception 'Invalid shipping'; end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item ->> 'quantity')::integer;
    if v_qty is null or v_qty < 1 or v_qty > 99 then raise exception 'Invalid quantity'; end if;
    select * into v_product from public.products
      where id = (v_item ->> 'product_id')::uuid and active = true
      for update;
    if not found then raise exception 'Product unavailable'; end if;
    if v_product.stock < v_qty then raise exception 'Insufficient stock for %', v_product.name; end if;
    v_unit := case when v_product.sale_price_cents is not null and v_product.sale_price_cents < v_product.price_cents then v_product.sale_price_cents else v_product.price_cents end;
    v_subtotal := v_subtotal + (v_unit * v_qty);
    update public.products set stock = stock - v_qty where id = v_product.id;
  end loop;

  insert into public.orders(user_id, customer_email, shipping_address, subtotal_cents, shipping_cents, discount_cents, total_cents)
  values (p_user_id, lower(trim(p_customer_email)), p_shipping_address, v_subtotal, p_shipping_cents, 0, v_subtotal + p_shipping_cents)
  returning id, public.orders.order_number into v_order_id, v_order_number;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item ->> 'quantity')::integer;
    select * into v_product from public.products where id = (v_item ->> 'product_id')::uuid;
    v_unit := case when v_product.sale_price_cents is not null and v_product.sale_price_cents < v_product.price_cents then v_product.sale_price_cents else v_product.price_cents end;
    insert into public.order_items(order_id, product_id, product_name_snapshot, sku_snapshot, unit_price_cents, quantity)
    values (v_order_id, v_product.id, v_product.name, v_product.sku, v_unit, v_qty);
  end loop;

  return query select v_order_id, v_order_number;
end;
$$;
revoke all on function public.create_pending_order(uuid,text,jsonb,jsonb,integer) from public, anon, authenticated;
grant execute on function public.create_pending_order(uuid,text,jsonb,jsonb,integer) to service_role;

create or replace function public.mark_order_paid(p_order_id uuid, p_stripe_session_id text, p_payment_intent_id text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_order public.orders%rowtype;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.payment_status = 'paid' then return; end if;
  if v_order.stock_released then raise exception 'Order stock was already released'; end if;
  update public.orders set payment_status='paid', status='paid', stripe_session_id=p_stripe_session_id, stripe_payment_intent_id=p_payment_intent_id where id=p_order_id;
end;
$$;
revoke all on function public.mark_order_paid(uuid,text,text) from public, anon, authenticated;
grant execute on function public.mark_order_paid(uuid,text,text) to service_role;

create or replace function public.release_order_stock(p_order_id uuid, p_reason text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_order public.orders%rowtype; v_item public.order_items%rowtype;
begin
  select * into v_order from public.orders where id = p_order_id for update;
  if not found then return; end if;
  if v_order.stock_released or v_order.payment_status = 'paid' then return; end if;
  for v_item in select * from public.order_items where order_id = p_order_id loop
    if v_item.product_id is not null then update public.products set stock = stock + v_item.quantity where id = v_item.product_id; end if;
  end loop;
  update public.orders set stock_released=true, status='cancelled', payment_status='failed', cancellation_reason=left(coalesce(p_reason,'cancelled'),250) where id=p_order_id;
end;
$$;
revoke all on function public.release_order_stock(uuid,text) from public, anon, authenticated;
grant execute on function public.release_order_stock(uuid,text) to service_role;

-- RLS: every exposed public table is protected.
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.favorites enable row level security;
alter table public.cart_items enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;

create policy "profiles read own or admin" on public.profiles for select to authenticated using ((select auth.uid()) = id or public.is_admin());
create policy "profiles update own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "active categories public read" on public.categories for select to anon, authenticated using (active or public.is_admin());
create policy "admin categories insert" on public.categories for insert to authenticated with check (public.is_admin());
create policy "admin categories update" on public.categories for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin categories delete" on public.categories for delete to authenticated using (public.is_admin());

create policy "active products public read" on public.products for select to anon, authenticated using (active or public.is_admin());
create policy "admin products insert" on public.products for insert to authenticated with check (public.is_admin());
create policy "admin products update" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin products delete" on public.products for delete to authenticated using (public.is_admin());

create policy "product images public read" on public.product_images for select to anon, authenticated using (exists(select 1 from public.products p where p.id=product_id and (p.active or public.is_admin())));
create policy "admin product images write" on public.product_images for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "favorites own read" on public.favorites for select to authenticated using ((select auth.uid())=user_id);
create policy "favorites own insert" on public.favorites for insert to authenticated with check ((select auth.uid())=user_id);
create policy "favorites own delete" on public.favorites for delete to authenticated using ((select auth.uid())=user_id);

create policy "cart own read" on public.cart_items for select to authenticated using ((select auth.uid())=user_id);
create policy "cart own insert" on public.cart_items for insert to authenticated with check ((select auth.uid())=user_id);
create policy "cart own update" on public.cart_items for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "cart own delete" on public.cart_items for delete to authenticated using ((select auth.uid())=user_id);

create policy "addresses own read" on public.addresses for select to authenticated using ((select auth.uid())=user_id);
create policy "addresses own insert" on public.addresses for insert to authenticated with check ((select auth.uid())=user_id);
create policy "addresses own update" on public.addresses for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "addresses own delete" on public.addresses for delete to authenticated using ((select auth.uid())=user_id);

create policy "orders own or admin read" on public.orders for select to authenticated using ((select auth.uid())=user_id or public.is_admin());
create policy "admin orders update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "order items own or admin read" on public.order_items for select to authenticated using (exists(select 1 from public.orders o where o.id=order_id and (o.user_id=(select auth.uid()) or public.is_admin())));

create policy "reviews public read" on public.reviews for select to anon, authenticated using (true);
create policy "verified buyer reviews insert" on public.reviews for insert to authenticated
with check ((select auth.uid())=user_id and exists(
  select 1 from public.order_items oi join public.orders o on o.id=oi.order_id
  where oi.product_id=reviews.product_id and o.user_id=(select auth.uid()) and o.payment_status='paid'
));
create policy "reviews own update" on public.reviews for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "reviews own delete" on public.reviews for delete to authenticated using ((select auth.uid())=user_id or public.is_admin());

-- Explicit API grants. RLS still applies to every row operation.
grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products, public.product_images, public.reviews to anon, authenticated;
grant select on public.profiles, public.favorites, public.cart_items, public.addresses, public.orders, public.order_items to authenticated;
grant insert, update, delete on public.favorites, public.cart_items, public.addresses, public.reviews to authenticated;
grant update(full_name, phone, avatar_url) on public.profiles to authenticated;
grant insert, update, delete on public.categories, public.products, public.product_images to authenticated;
grant update on public.orders to authenticated;

-- Public media buckets; writes remain admin-only through storage RLS.
insert into storage.buckets (id, name, public) values ('product-images','product-images',true), ('category-images','category-images',true)
on conflict (id) do update set public=excluded.public;

create policy "public shop media read" on storage.objects for select to anon, authenticated using (bucket_id in ('product-images','category-images'));
create policy "admin shop media insert" on storage.objects for insert to authenticated with check (bucket_id in ('product-images','category-images') and public.is_admin());
create policy "admin shop media update" on storage.objects for update to authenticated using (bucket_id in ('product-images','category-images') and public.is_admin()) with check (bucket_id in ('product-images','category-images') and public.is_admin());
create policy "admin shop media delete" on storage.objects for delete to authenticated using (bucket_id in ('product-images','category-images') and public.is_admin());

create or replace function public.refund_order_and_restore_stock(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare v_order public.orders%rowtype; v_item public.order_items%rowtype;
begin
  select * into v_order from public.orders where id=p_order_id for update;
  if not found then raise exception 'Order not found'; end if;
  if v_order.payment_status='refunded' then return; end if;
  if v_order.payment_status<>'paid' then raise exception 'Only paid orders can be refunded'; end if;
  if not v_order.stock_released then
    for v_item in select * from public.order_items where order_id=p_order_id loop
      if v_item.product_id is not null then update public.products set stock=stock+v_item.quantity where id=v_item.product_id; end if;
    end loop;
  end if;
  update public.orders set payment_status='refunded',status='refunded',stock_released=true where id=p_order_id;
end;
$$;
revoke all on function public.refund_order_and_restore_stock(uuid) from public, anon, authenticated;
grant execute on function public.refund_order_and_restore_stock(uuid) to service_role;

alter table public.reviews add column if not exists author_name text not null default 'Verified customer';
