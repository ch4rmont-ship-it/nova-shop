import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { createAdminClient } from "@/lib/supabase/admin";
export default async function EditProductPage({params}:{params:Promise<{id:string}>}){const{id}=await params;const admin=createAdminClient();const[{data:product},{data:categories}]=await Promise.all([admin.from("products").select("*,product_images(id,url,alt_text,sort_order,is_primary)").eq("id",id).maybeSingle(),admin.from("categories").select("id,name").order("name")]);if(!product)notFound();return <div><p className="eyebrow">Catalog</p><h1 className="mb-8 mt-2 text-4xl font-black">Edit product</h1><ProductForm categories={categories||[]} product={product}/></div>}
