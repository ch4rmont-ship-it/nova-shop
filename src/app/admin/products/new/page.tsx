import { ProductForm } from "@/components/admin/product-form";
import { createAdminClient } from "@/lib/supabase/admin";
export default async function NewProductPage(){const admin=await createAdminClient();const{data:categories}=await admin.from("categories").select("id,name").eq("active",true).order("name");return <div><p className="eyebrow">Catalog</p><h1 className="mb-8 mt-2 text-4xl font-black">New product</h1><ProductForm categories={categories||[]}/></div>}
