import {createAdminClient} from "@/lib/supabase/admin";
import {CatalogTable} from "@/components/admin/catalog-table";
export default async function AdminProducts(){const db=await createAdminClient();const{data,error}=await db.from("products").select("id,brand,name,slug,sku,price_cents,sale_price_cents,stock,active,preorder,product_images(url,is_primary)").order("created_at",{ascending:false});if(error)throw new Error(error.message);return <CatalogTable products={data||[]}/>}
