-- Dedicated NOVA only. Uses existing identities; all changes roll back.
begin;
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"dce2598f-8c4c-4e22-9724-13ccc115346c","role":"authenticated"}',true);
do $$
#variable_conflict use_variable
declare id uuid; denied boolean:=false; payload jsonb:='{"category_id":"22222222-2222-4222-8222-222222222222","brand":"TEST","name":"QA rollback product","slug":"qa-rollback-product","sku":"QA-ROLLBACK","short_description":"test","description":"test","price_cents":1000000,"sale_price_cents":null,"stock":3,"preorder":false,"featured":false,"bestseller":false,"active":true,"specifications":{}}';
begin
 if not public.is_admin() then raise exception 'Owner admin access failed';end if;
 if not exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin') then raise exception 'Owner role not readable';end if;
 id:=public.admin_save_catalog_product(null,payload,'{"marketplace":"QA","markup_percent":35}','[{"url":"https://example.test/photo.jpg","storage_path":"uploads/qa.jpg"}]','{}',null);
 if not exists(select 1 from public.product_images where product_id=id and is_primary) then raise exception 'Primary image not created';end if;
 perform public.admin_save_catalog_product(id,payload||'{"price_cents":1500000,"stock":7}'::jsonb,'{"marketplace":"QA","markup_percent":35}','[]','{}',null);
 if not exists(select 1 from public.products where products.id=id and price_cents=1500000 and stock=7) then raise exception 'Price or stock update failed';end if;
 begin
  perform public.admin_save_catalog_product(id,payload||'{"price_cents":1900000}'::jsonb,'{"marketplace":"QA","cost_cny":"invalid"}','[]','{}',null);
 exception when others then denied:=true;end;
 if not denied or not exists(select 1 from public.products where products.id=id and price_cents=1500000) then raise exception 'Failed save was not atomic';end if;
 update public.products set active=false where products.id=id;
 if not exists(select 1 from public.products where products.id=id and not active) then raise exception 'Archive failed';end if;
 update public.products set active=true where products.id=id;
 perform set_config('request.jwt.claims','{"sub":"91000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
 denied:=false;
 begin perform public.admin_save_catalog_product(id,payload,'{}','[]','{}',null);exception when others then denied:=true;end;
 if not denied then raise exception 'Customer gained catalog write access';end if;
 update public.products set price_cents=1 where products.id=id;
 if found then raise exception 'Customer updated price';end if;
end; $$;
reset role;
select 'PASS: actual owner access, product create/edit, price/stock, primary image, rollback atomicity, archive/restore, customer denial' as result;
rollback;
