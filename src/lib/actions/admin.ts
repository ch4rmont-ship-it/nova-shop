"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";
import { getStripe } from "@/lib/stripe";

function moneyToCents(value: FormDataEntryValue | null) {
  const number = Number(value || 0);
  if (!Number.isFinite(number) || number < 0) throw new Error("Invalid price");
  return Math.round(number * 100);
}

function specsFromText(value: string) {
  const result: Record<string,string> = {};
  value.split("\n").map((line)=>line.trim()).filter(Boolean).forEach((line)=>{
    const i=line.indexOf(":");
    if(i>0) result[line.slice(0,i).trim()]=line.slice(i+1).trim();
  });
  return result;
}

async function uploadImages(files: File[], productId: string) {
  const admin=createAdminClient();
  const rows: Array<{product_id:string;url:string;storage_path:string;alt_text:string;sort_order:number;is_primary:boolean}> = [];
  for(let i=0;i<files.length;i++){
    const file=files[i];
    if(!file.size) continue;
    if(file.size>8*1024*1024) throw new Error("Each image must be under 8 MB.");
    if(!file.type.startsWith("image/")) throw new Error("Only image files are allowed.");
    const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,"-");
    const path=`${productId}/${crypto.randomUUID()}-${safe}`;
    const{error}=await admin.storage.from("product-images").upload(path,file,{contentType:file.type,upsert:false});
    if(error) throw new Error(error.message);
    const{data}=admin.storage.from("product-images").getPublicUrl(path);
    rows.push({product_id:productId,url:data.publicUrl,storage_path:path,alt_text:"",sort_order:i,is_primary:false});
  }
  return rows;
}

export async function saveProductAction(formData:FormData){
  await requireAdmin();const admin=createAdminClient();
  const existingId=String(formData.get("id")||"");
  const name=String(formData.get("name")||"").trim();
  if(name.length<2) throw new Error("Product name is required.");
  const price=moneyToCents(formData.get("price"));
  const saleRaw=String(formData.get("salePrice")||"").trim();
  const sale=saleRaw?moneyToCents(saleRaw):null;
  if(sale!==null&&sale>=price) throw new Error("Sale price must be lower than the normal price.");
  const payload={
    category_id:String(formData.get("categoryId")||""),name,slug:slugify(String(formData.get("slug")||name)),sku:String(formData.get("sku")||"").trim().toUpperCase(),
    short_description:String(formData.get("shortDescription")||"").trim(),description:String(formData.get("description")||"").trim(),price_cents:price,sale_price_cents:sale,
    stock:Math.max(0,Math.floor(Number(formData.get("stock")||0))),featured:formData.get("featured")==="on",bestseller:formData.get("bestseller")==="on",active:formData.get("active")==="on",
    specifications:specsFromText(String(formData.get("specifications")||"")),
    brand:String(formData.get("brand")||"NOVA Select").trim() || "NOVA Select",
    source_marketplace:String(formData.get("sourceMarketplace")||"").trim() || null,
    source_title:String(formData.get("sourceTitle")||"").trim() || null,
    source_url:String(formData.get("sourceUrl")||"").trim() || null,
    source_cost_cny:formData.get("sourceCostCny") ? Number(formData.get("sourceCostCny")) : null,
    markup_percent:formData.get("markupPercent") ? Number(formData.get("markupPercent")) : null
  };
  let productId=existingId;
  if(existingId){const{error}=await admin.from("products").update(payload).eq("id",existingId);if(error)throw new Error(error.message);}else{const{data,error}=await admin.from("products").insert(payload).select("id").single();if(error||!data)throw new Error(error?.message||"Could not create product");productId=data.id;}

  const removeIds=formData.getAll("removeImageId").map(String).filter(Boolean);
  if(removeIds.length){const{data:old}=await admin.from("product_images").select("id,storage_path").in("id",removeIds).eq("product_id",productId);const paths=(old||[]).map(r=>r.storage_path).filter(Boolean) as string[];if(paths.length)await admin.storage.from("product-images").remove(paths);await admin.from("product_images").delete().in("id",removeIds).eq("product_id",productId);}

  const primaryImageId=String(formData.get("primaryImageId")||"");
  const files=formData.getAll("images").filter((v):v is File=>v instanceof File&&v.size>0);
  const rows=await uploadImages(files,productId);
  if(rows.length){const{count}=await admin.from("product_images").select("id",{count:"exact",head:true}).eq("product_id",productId);if(!count)rows[0].is_primary=true;const{error}=await admin.from("product_images").insert(rows);if(error)throw new Error(error.message);}
  const { data: remainingImages } = await admin.from("product_images").select("id,is_primary").eq("product_id", productId).order("sort_order");
  if (remainingImages?.length) {
    const chosen = remainingImages.find((image)=>image.id===primaryImageId);
    if (chosen) { await admin.from("product_images").update({is_primary:false}).eq("product_id",productId); await admin.from("product_images").update({is_primary:true}).eq("id",chosen.id); }
    else if (!remainingImages.some((image)=>image.is_primary)) await admin.from("product_images").update({is_primary:true}).eq("id",remainingImages[0].id);
  }
  revalidatePath("/admin/products");revalidatePath("/shop");redirect(`/admin/products/${productId}?message=Saved`);
}

export async function archiveProductAction(formData:FormData){await requireAdmin();const id=String(formData.get("id")||"");const admin=createAdminClient();await admin.from("products").update({active:false}).eq("id",id);revalidatePath("/admin/products");revalidatePath("/shop");}

export async function saveCategoryAction(formData:FormData){await requireAdmin();const admin=createAdminClient();const id=String(formData.get("id")||"");const name=String(formData.get("name")||"").trim();let imageUrl=String(formData.get("existingImage")||"");let imagePath=String(formData.get("existingPath")||"");const file=formData.get("image");if(file instanceof File&&file.size){if(!file.type.startsWith("image/"))throw new Error("Category image must be an image.");const path=`categories/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,"-")}`;const{error}=await admin.storage.from("category-images").upload(path,file,{contentType:file.type});if(error)throw new Error(error.message);const{data}=admin.storage.from("category-images").getPublicUrl(path);if(imagePath)await admin.storage.from("category-images").remove([imagePath]);imageUrl=data.publicUrl;imagePath=path;}
  const payload={name,slug:slugify(String(formData.get("slug")||name)),description:String(formData.get("description")||""),image_url:imageUrl||null,image_path:imagePath||null,active:formData.get("active")==="on"};
  if(id){const{error}=await admin.from("categories").update(payload).eq("id",id);if(error)throw new Error(error.message);}else{const{error}=await admin.from("categories").insert(payload);if(error)throw new Error(error.message);}revalidatePath("/admin/categories");revalidatePath("/");redirect("/admin/categories?message=Saved");}

export async function deactivateCategoryAction(formData:FormData){await requireAdmin();const admin=createAdminClient();await admin.from("categories").update({active:false}).eq("id",String(formData.get("id")||""));revalidatePath("/admin/categories");}

export async function deleteCategoryAction(formData:FormData){await requireAdmin();const id=String(formData.get("id")||"");const admin=createAdminClient();const[{count},{data:category}]=await Promise.all([admin.from("products").select("id",{count:"exact",head:true}).eq("category_id",id),admin.from("categories").select("image_path").eq("id",id).maybeSingle()]);if(count&&count>0)redirect("/admin/categories?error="+encodeURIComponent("Move or archive products in this category before deleting it."));if(category?.image_path)await admin.storage.from("category-images").remove([category.image_path]);const{error}=await admin.from("categories").delete().eq("id",id);if(error)redirect("/admin/categories?error="+encodeURIComponent(error.message));revalidatePath("/admin/categories");revalidatePath("/");}

export async function updateOrderStatusAction(formData:FormData){await requireAdmin();const admin=createAdminClient();const id=String(formData.get("id")||"");const status=String(formData.get("status")||"");const allowed=["paid","processing","shipped","delivered"];
  if(status==="cancelled"){const{data:order}=await admin.from("orders").select("payment_status").eq("id",id).single();if(order?.payment_status==="paid")throw new Error("Paid orders must be refunded, not cancelled.");await admin.rpc("release_order_stock",{p_order_id:id,p_reason:"admin_cancelled"});}
  else if(allowed.includes(status)){const{error}=await admin.from("orders").update({status}).eq("id",id);if(error)throw new Error(error.message);}else throw new Error("Unsupported order status");
  revalidatePath(`/admin/orders/${id}`);revalidatePath("/admin/orders");}

export async function refundOrderAction(formData:FormData){await requireAdmin();const id=String(formData.get("id")||"");const admin=createAdminClient();const{data:order,error}=await admin.from("orders").select("stripe_payment_intent_id,payment_status").eq("id",id).single();if(error||!order)throw new Error("Order not found");if(order.payment_status!=="paid"||!order.stripe_payment_intent_id)throw new Error("This order is not eligible for an automated refund.");const stripe=getStripe();await stripe.refunds.create({payment_intent:order.stripe_payment_intent_id,metadata:{order_id:id}});const{error:rpcError}=await admin.rpc("refund_order_and_restore_stock",{p_order_id:id});if(rpcError)throw new Error(rpcError.message);revalidatePath(`/admin/orders/${id}`);revalidatePath("/admin/orders");}
