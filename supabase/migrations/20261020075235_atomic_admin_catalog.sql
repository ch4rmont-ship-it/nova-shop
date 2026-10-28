-- Atomic catalog writes. RLS stays active and the role is checked server-side.
create or replace function public.admin_save_catalog_product(p_id uuid,p_product jsonb,p_source jsonb,p_images jsonb,p_remove uuid[],p_primary uuid)
returns uuid language plpgsql security invoker set search_path='' as $$
declare target uuid:=coalesce(p_id,gen_random_uuid()); image jsonb; chosen uuid; ordinal integer;
begin
 if auth.uid() is null or not private.is_admin() then raise exception 'Admin эрх шаардлагатай';end if;
 if p_id is not null then
  perform 1 from public.products where id=p_id for update;
  if not found then raise exception 'Бараа олдсонгүй';end if;
 end if;
 if jsonb_typeof(p_images)<>'array' or jsonb_array_length(p_images)>10 then raise exception '10 хүртэл зураг оруулна';end if;
 insert into public.products(id,category_id,brand,name,slug,sku,short_description,description,price_cents,sale_price_cents,stock,preorder,featured,bestseller,active,specifications,source_public_url)
 values(target,(p_product->>'category_id')::uuid,p_product->>'brand',p_product->>'name',p_product->>'slug',p_product->>'sku',p_product->>'short_description',p_product->>'description',(p_product->>'price_cents')::integer,(p_product->>'sale_price_cents')::integer,(p_product->>'stock')::integer,(p_product->>'preorder')::boolean,(p_product->>'featured')::boolean,(p_product->>'bestseller')::boolean,(p_product->>'active')::boolean,p_product->'specifications',p_product->>'source_public_url')
 on conflict(id) do update set category_id=excluded.category_id,brand=excluded.brand,name=excluded.name,slug=excluded.slug,sku=excluded.sku,short_description=excluded.short_description,description=excluded.description,price_cents=excluded.price_cents,sale_price_cents=excluded.sale_price_cents,stock=excluded.stock,preorder=excluded.preorder,featured=excluded.featured,bestseller=excluded.bestseller,active=excluded.active,specifications=excluded.specifications,source_public_url=excluded.source_public_url;
 insert into public.product_sourcing(product_id,marketplace,title,url,cost_cny,markup_percent)
 values(target,p_source->>'marketplace',p_source->>'title',p_source->>'url',(p_source->>'cost_cny')::numeric,(p_source->>'markup_percent')::numeric)
 on conflict(product_id) do update set marketplace=excluded.marketplace,title=excluded.title,url=excluded.url,cost_cny=excluded.cost_cny,markup_percent=excluded.markup_percent;
 delete from public.product_images where product_id=target and id=any(coalesce(p_remove,'{}'::uuid[]));
 select coalesce(max(sort_order),-1)+1 into ordinal from public.product_images where product_id=target;
 for image in select value from jsonb_array_elements(p_images) loop
  insert into public.product_images(product_id,url,storage_path,alt_text,is_primary,sort_order)
  values(target,image->>'url',image->>'storage_path',p_product->>'name',false,ordinal);
  ordinal:=ordinal+1;
 end loop;
 if (select count(*) from public.product_images where product_id=target)>10 then raise exception 'Нэг бараанд 10 хүртэл зураг хадгална';end if;
 select id into chosen from public.product_images where product_id=target order by (id=p_primary) desc nulls last,is_primary desc,sort_order,id limit 1;
 update public.product_images set is_primary=false where product_id=target and is_primary;
 update public.product_images set is_primary=true where product_id=target and id=chosen;
 return target;
end; $$;
revoke all on function public.admin_save_catalog_product(uuid,jsonb,jsonb,jsonb,uuid[],uuid) from public,anon;
grant execute on function public.admin_save_catalog_product(uuid,jsonb,jsonb,jsonb,uuid[],uuid) to authenticated;
update storage.buckets set file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp'] where id='product-images';
