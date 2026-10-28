"use server";
import {revalidatePath} from "next/cache";
import {unstable_rethrow} from "next/navigation";
import {z} from "zod";
import {createAdminClient} from "@/lib/supabase/admin";
import {slugify} from "@/lib/utils";
function refresh(){revalidatePath("/","layout");}
const price=z.coerce.number().finite().min(0).max(20000000);
const stock=z.coerce.number().int().min(0).max(1000000);
function message(e:unknown){unstable_rethrow(e);if(e instanceof z.ZodError)return "Нэр, ангилал, үнэ болон үлдэгдлээ зөв оруулна уу.";const m=e instanceof Error?e.message:"Хадгалж чадсангүй. Дахин оролдоно уу.";return m.includes("duplicate key")?"Барааны код эсвэл холбоос давхардсан байна. Өөр утга оруулна уу.":m;}
export async function saveCatalogProduct(form:FormData):Promise<{error?:string;id?:string}>{
 try{const db=await createAdminClient();const id=String(form.get("id")||"")||null;if(id)z.string().uuid().parse(id);
 const name=z.string().trim().min(2).max(200).parse(form.get("name"));const normal=Math.round(price.parse(form.get("price"))*100);const saleRaw=String(form.get("salePrice")||"").trim();const sale=saleRaw?Math.round(price.parse(saleRaw)*100):null;if(sale!==null&&sale>=normal)throw new Error("Хямдарсан үнэ үндсэн үнээс бага байх ёстой.");
 const slug=slugify(String(form.get("slug")||name))||`nova-${crypto.randomUUID().slice(0,12)}`;const sku=String(form.get("sku")||"").trim().toUpperCase()||`NV-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
 const sourceUrl=String(form.get("sourceUrl")||"").trim();if(sourceUrl&&!/^https?:\/\//.test(sourceUrl))throw new Error("Эх сурвалжийн холбоос http:// эсвэл https:// байх ёстой.");
 const specs:Record<string,string>={};String(form.get("specifications")||"").split("\n").forEach(line=>{const n=line.indexOf(":");if(n>0)specs[line.slice(0,n).trim()]=line.slice(n+1).trim()});
 const product={category_id:z.string().uuid().parse(form.get("categoryId")),name,slug,sku,brand:String(form.get("brand")||"NOVA Select").trim(),short_description:String(form.get("shortDescription")||"").slice(0,500),description:String(form.get("description")||"").slice(0,20000),price_cents:normal,sale_price_cents:sale,stock:stock.parse(form.get("stock")),preorder:form.get("preorder")==="on",featured:form.get("featured")==="on",bestseller:form.get("bestseller")==="on",active:form.get("active")==="on",specifications:specs,source_public_url:sourceUrl||null};
 const source={marketplace:String(form.get("sourceMarketplace")||""),title:String(form.get("sourceTitle")||""),url:sourceUrl,cost_cny:form.get("sourceCostCny")?price.parse(form.get("sourceCostCny")):null,markup_percent:price.parse(form.get("markupPercent")||35)};
 const uploads=z.array(z.object({path:z.string().regex(/^uploads\/[a-f0-9-]+\.(jpg|png|webp)$/)})).max(10).parse(JSON.parse(String(form.get("uploadedImages")||"[]")));
 const images=uploads.map(({path})=>({storage_path:path,url:db.storage.from("product-images").getPublicUrl(path).data.publicUrl}));
 const remove=z.array(z.string().uuid()).max(10).parse(form.getAll("removeImageId").map(String));const primary=String(form.get("primaryImageId")||"")||null;if(primary)z.string().uuid().parse(primary);
 const{data,error}=await db.rpc("admin_save_catalog_product",{p_id:id,p_product:product,p_source:source,p_images:images,p_remove:remove,p_primary:primary});if(error)throw new Error(error.message);refresh();return{id:String(data)};
 }catch(e){return{error:message(e)}}
}
export async function quickUpdateProduct(form:FormData):Promise<{error?:string;success?:string}>{try{const db=await createAdminClient();const id=z.string().uuid().parse(form.get("id"));const p=Math.round(price.parse(form.get("price"))*100);const{data:old,error:readError}=await db.from("products").select("sale_price_cents").eq("id",id).single();if(readError)throw new Error(readError.message);if(old.sale_price_cents!==null&&old.sale_price_cents>=p)throw new Error("Шинэ үнэ хямдарсан үнээс их байх ёстой. Засах хэсгээс хямдралыг өөрчилнө үү.");const{error}=await db.from("products").update({price_cents:p,stock:stock.parse(form.get("stock"))}).eq("id",id).select("id").single();if(error)throw new Error(error.message);refresh();return{success:"Үнэ, үлдэгдэл хадгалагдлаа."}}catch(e){return{error:message(e)}}}
export async function setCatalogVisibility(form:FormData):Promise<{error?:string;success?:string}>{try{const db=await createAdminClient();const id=z.string().uuid().parse(form.get("id"));const active=form.get("active")==="true";const{error}=await db.from("products").update({active}).eq("id",id).select("id").single();if(error)throw new Error(error.message);refresh();return{success:active?"Барааг дэлгүүрт гаргалаа.":"Барааг дэлгүүрээс нуусан. Захиалгын түүх хэвээр."}}catch(e){return{error:message(e)}}}
