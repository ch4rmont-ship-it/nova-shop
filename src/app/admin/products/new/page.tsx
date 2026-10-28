import {ProductForm} from "@/components/admin/product-form";
import {createAdminClient} from "@/lib/supabase/admin";
export default async function NewProductPage(){const db=await createAdminClient();const{data,error}=await db.from("categories").select("id,name").eq("active",true).order("name");if(error)throw new Error(error.message);return <div><p className="eyebrow">NOVA / Барааны удирдлага</p><h1 className="mb-6 mt-2 text-3xl font-black">Шинэ бараа нэмэх</h1><ProductForm categories={data||[]}/></div>}
