import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/utils";
export const dynamic = "force-dynamic";
export default async function AnalyticsPage() {
 const db=await createAdminClient();
 const {data:orders,error}=await db.from("orders").select("id,total_cents,payment_status,status,created_at").order("created_at",{ascending:false}).limit(1000);
 if(error) throw new Error("Analytics unavailable: "+error.message);
 const all=orders||[];
 const paid=all.filter(o=>o.payment_status==="paid");
 const revenue=paid.reduce((n,o)=>n+Number(o.total_cents||0),0);
 const monthly=new Map<string,number>();
 paid.forEach(o=>{const month=String(o.created_at).slice(0,7);monthly.set(month,(monthly.get(month)||0)+Number(o.total_cents||0));});
 const months=[...monthly.entries()].sort((a,b)=>a[0].localeCompare(b[0])).slice(-6);
 const max=Math.max(1,...months.map(([,v])=>v));
 const ids=paid.map(o=>o.id);
 const {data:items,error:itemError}=ids.length?await db.from("order_items").select("order_id,product_name_snapshot,quantity").in("order_id",ids):{data:[],error:null};
 if(itemError) throw new Error("Product analytics unavailable.");
 const counts=new Map<string,number>();
 (items||[]).forEach(i=>counts.set(i.product_name_snapshot,(counts.get(i.product_name_snapshot)||0)+Number(i.quantity||0)));
 const best=[...counts].sort((a,b)=>b[1]-a[1]).slice(0,5);
 return <div className="space-y-7"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-700">SMARTSHOP AI / SALES INTELLIGENCE</p><h1 className="mt-2 text-3xl font-black">销售数据分析 · Борлуулалтын шинжилгээ</h1><p className="mt-2 text-sm text-slate-500">Бодит өгөгдөл · Сүүлийн 1000 захиалга. Орлого нь зөвхөн төлбөр төлөгдсөн захиалгуудын дүн.</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[["Төлөгдсөн орлого",formatMoney(revenue)],["Захиалгын тоо",String(all.length)],["Төлөгдсөн захиалга",String(paid.length)],["Дундаж захиалга",formatMoney(paid.length?Math.round(revenue/paid.length):0)]].map(([k,v])=><div key={k} className="rounded-2xl border bg-white p-5"><p className="text-xs text-slate-500">{k}</p><p className="mt-3 text-2xl font-black text-indigo-900">{v}</p></div>)}</div><section className="rounded-2xl border bg-white p-6"><h2 className="font-bold">Сарын орлогын хандлага</h2>{months.length?<div className="mt-5 flex h-56 items-end gap-3" role="img" aria-label="Сүүлийн зургаан сарын төлөгдсөн орлого">{months.map(([month,value])=><div key={month} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px]">{formatMoney(value)}</span><div className="w-full max-w-20 rounded-t-lg bg-indigo-500" style={{height:Math.max(3,Math.round(value/max*170))}}/><span className="text-xs text-slate-500">{month}</span></div>)}</div>:<p className="mt-4 text-sm text-slate-500">Төлөгдсөн борлуулалтын мэдээлэл хараахан алга.</p>}</section><section className="rounded-2xl border bg-white p-6"><h2 className="font-bold">Шилдэг бүтээгдэхүүн (төлөгдсөн захиалга)</h2>{best.length?<div className="mt-4 space-y-3">{best.map(([name,quantity])=><div key={name} className="flex justify-between gap-3 border-b pb-3 text-sm"><span>{name}</span><strong>{quantity} ширхэг</strong></div>)}</div>:<p className="mt-4 text-sm text-slate-500">Одоогоор бодит борлуулалт алга.</p>}</section><p className="text-xs text-slate-500">Анхаар: Захиалгын тоо 1000-аас давбал энэ хуудсыг pagination/aggregate query болгон өргөтгөх шаардлагатай. Ашгийн тооцоонд бодит өртгийн баталгаажсан мэдээлэл хэрэгтэй.</p><Link href="/admin" className="text-sm font-bold text-indigo-700">← Удирдлагын самбар</Link></div>;
}
