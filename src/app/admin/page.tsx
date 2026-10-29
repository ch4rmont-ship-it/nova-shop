import {getLocale} from "@/lib/i18n-server";
import {t} from "@/lib/i18n";
import Link from "next/link";
import { Activity, Calculator, ArrowRight, ArrowUpRight, Boxes, Bot, ChartNoAxesCombined, CircleDollarSign, CreditCard, Megaphone, PackagePlus, PackageSearch, ShoppingBag, Sparkles, Users, WandSparkles } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatMoney } from "@/lib/utils";

export const dynamic="force-dynamic";

const tools = [
 {name:"AI Product Studio",subtitle:"商品文案生成",href:"/ai-studio",Icon:WandSparkles,color:"bg-violet-50 text-violet-700",status:"AI KEY LATER"},
 {name:"Customer Service",subtitle:"智能客服",href:"/support",Icon:Bot,color:"bg-sky-50 text-sky-700",status:"RULE-BASED"},
 {name:"Product Selection",subtitle:"智能选品",href:"/admin/product-selection",Icon:PackageSearch,color:"bg-indigo-50 text-indigo-700",status:"DATA / DEMO"},
 {name:"Marketing Studio",subtitle:"营销助手",href:"/admin/marketing",Icon:Megaphone,color:"bg-rose-50 text-rose-700",status:"TEMPLATE DEMO"},
 {name:"Finance Calculator",subtitle:"利润与成本",href:"/admin/finance",Icon:Calculator,color:"bg-emerald-50 text-emerald-700",status:"NO API KEY"}
] as const;

export default async function AdminDashboard() {
 const locale=await getLocale();
 const db = await createAdminClient();
 const [
  productResult,customerResult,orderCountResult,paidCountResult,ordersResult,lowResult
 ]=await Promise.all([
  db.from("products").select("id",{count:"exact",head:true}),
  db.from("profiles").select("id",{count:"exact",head:true}).eq("role","customer"),
  db.from("orders").select("id",{count:"exact",head:true}),
  db.from("orders").select("id",{count:"exact",head:true}).eq("payment_status","paid"),
  db.from("orders").select("id,order_number,total_cents,status,payment_status,created_at").order("created_at",{ascending:false}).limit(1000),
  db.from("products").select("id,name,stock,slug").eq("active",true).eq("preorder",false).lte("stock",5).order("stock",{ascending:true}).limit(5)
 ]);
 const error=[productResult.error,customerResult.error,orderCountResult.error,paidCountResult.error,ordersResult.error,lowResult.error].find(Boolean);
 if(error) throw new Error("Admin dashboard data could not load: "+error.message);
 const orders=ordersResult.data||[];
 const paid=orders.filter(o=>o.payment_status==="paid");
 const revenue=paid.reduce((sum,o)=>sum+Number(o.total_cents||0),0);
 const paidIds=paid.map(o=>o.id);
 const {data:sold,error:soldError}=paidIds.length?await db.from("order_items").select("product_name_snapshot,quantity").in("order_id",paidIds):{data:[],error:null};
 if(soldError) throw new Error("Top product analytics unavailable.");
 const totals=new Map<string,number>();
 (sold||[]).forEach(p=>totals.set(p.product_name_snapshot,(totals.get(p.product_name_snapshot)||0)+Number(p.quantity)));
 const top=[...totals].sort((a,b)=>b[1]-a[1]).slice(0,4);
 const now=new Date();
 const months=Array.from({length:6},(_,i)=>{
  const date=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-(5-i),1));
  return {id:date.toISOString().slice(0,7),label:date.toLocaleDateString("en-US",{month:"short",timeZone:"UTC"}),amount:0};
 });
 paid.forEach(o=>{const id=String(o.created_at).slice(0,7);const month=months.find(x=>x.id===id);if(month)month.amount+=Number(o.total_cents||0);});
 const maxAmount=Math.max(1,...months.map(x=>x.amount));
 const hasSales=months.some(x=>x.amount>0);
 const stats=[
  {label:t(locale,"paidRevenue"),value:formatMoney(revenue),hint:"Сүүлийн 1000 захиалгад",Icon:CircleDollarSign,accent:"text-indigo-700 bg-indigo-50"},
  {label:t(locale,"orders"),value:String(orderCountResult.count||0),hint:"Өгөгдлийн сан дахь нийт",Icon:ShoppingBag,accent:"text-blue-700 bg-blue-50"},
  {label:t(locale,"customers"),value:String(customerResult.count||0),hint:"Customer профайлууд",Icon:Users,accent:"text-violet-700 bg-violet-50"},
  {label:t(locale,"products"),value:String(productResult.count||0),hint:"Каталог дахь нийт",Icon:Boxes,accent:"text-teal-700 bg-teal-50"}
 ];
 return <div className="space-y-7 sm:space-y-9">
  <div className="flex flex-wrap items-start justify-between gap-4">
   <div><p className="brand-eyebrow">SMARTSHOP AI / OVERVIEW</p><h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{t(locale,"adminTitle")} <span aria-hidden="true">✦</span></h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{t(locale,"adminSubtitle")}</p></div>
   <Link href="/admin/products/new" className="brand-btn-solid inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold"><PackagePlus size={18}/> Шинэ бараа</Link>
  </div>

  <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-4 sm:p-5"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-indigo-700 shadow-sm"><Sparkles size={19}/></span><div className="min-w-0 flex-1"><p className="text-sm font-bold text-indigo-950">SmartShop AI Workspace</p><p className="mt-1 text-xs leading-6 text-indigo-800/80">{t(locale,"honestNotice")}</p></div></div></div>

  <section aria-label="Бизнесийн үзүүлэлтүүд" className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">{stats.map(({label,value,hint,Icon,accent})=><article className="brand-kpi-card rounded-2xl border border-slate-200 bg-white p-5 sm:p-6" key={label}><div className="flex items-start justify-between gap-3"><p className="text-xs font-bold tracking-wide text-slate-500">{label}</p><span className={"grid size-11 shrink-0 place-items-center rounded-2xl "+accent}><Icon size={21}/></span></div><p className="mt-3 break-words text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{value}</p><p className="mt-2 text-xs text-slate-400">{hint}</p></article>)}</section>

  <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
   <section className="brand-panel rounded-[24px] border border-slate-200 bg-white p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold tracking-wide text-indigo-700">REVENUE TRENDS</p><h2 className="mt-2 text-lg font-black text-slate-950">{t(locale,"revenueTrend")}</h2><p className="mt-2 text-xs leading-5 text-slate-500">Сүүлийн 6 сар, зөвхөн төлбөр төлөгдсөн захиалгууд</p></div><Link href="/admin/analytics" className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">Analytics <ArrowUpRight size={15}/></Link></div>
    {hasSales?<div className="mt-8"><div className="flex h-52 items-end gap-3 border-b border-slate-100 pb-2 sm:gap-5">{months.map(m=><div className="flex h-full min-w-0 flex-1 flex-col justify-end gap-2" key={m.id}><div className="flex h-full items-end"><div className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-violet-400" style={{height:Math.max(m.amount>0?6:0,Math.round(m.amount/maxAmount*100))+"%"}} title={m.label+": "+formatMoney(m.amount)}/></div></div>)}</div><div className="mt-3 flex gap-3 sm:gap-5">{months.map(m=><span key={m.id} className="min-w-0 flex-1 text-center text-[10px] font-semibold text-slate-500">{m.label}</span>)}</div></div>:<div className="mt-7 flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-6 text-center"><ChartNoAxesCombined className="text-indigo-400" size={33}/><p className="mt-4 text-sm font-bold text-slate-800">{t(locale,"noPaid")}</p><p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">Бодит захиалга орж, төлбөр баталгаажмагц график автоматаар шинэчлэгдэнэ. Худал demo орлого харуулахгүй.</p></div>}
   </section>
   <section className="brand-panel rounded-[24px] border border-slate-200 bg-white p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="text-xs font-bold tracking-wide text-indigo-700">QUICK ACTIONS</p><h2 className="mt-2 text-lg font-black">{t(locale,"quickActions")}</h2></div><span className="grid size-10 place-items-center rounded-xl bg-slate-50 text-indigo-700"><Activity size={19}/></span></div><div className="mt-5 grid gap-3">{[
    {name:"Бүтээгдэхүүн нэмэх",desc:"Каталог, зураг, үнэ",href:"/admin/products/new",Icon:PackagePlus},
    {name:"Захиалга шалгах",desc:"Төлөв ба хүргэлт",href:"/admin/orders",Icon:CreditCard},
    {name:"AI туслах шалгах",desc:"Rule-based customer service",href:"/support",Icon:Bot}
   ].map(({name,desc,href,Icon})=><Link href={href} key={href} className="group flex items-center gap-3 rounded-2xl border border-slate-100 p-3.5 transition hover:border-indigo-200 hover:bg-indigo-50/40"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-indigo-700"><Icon size={19}/></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold text-slate-900">{name}</span><span className="mt-1 block text-xs text-slate-500">{desc}</span></span><ArrowRight className="text-slate-400 group-hover:text-indigo-700" size={18}/></Link>)}</div><p className="mt-5 text-xs text-slate-400">Төлөгдсөн захиалга: {paidCountResult.count||0}</p></section>
  </div>

  <section><div className="flex items-center justify-between gap-3"><div><p className="brand-eyebrow">SMART TOOLS</p><h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">{t(locale,"adminTools")}</h2></div><Link href="/demo" className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700">中文 Demo <ArrowUpRight size={15}/></Link></div><div className="mt-5 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">{tools.map(({name,subtitle,href,Icon,color,status})=><Link href={href} key={href} className="brand-feature-card flex flex-col rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between gap-2"><span className={"grid size-11 place-items-center rounded-xl "+color}><Icon size={21}/></span><span className="text-[9px] font-black tracking-wide text-slate-400">{status}</span></div><h3 className="mt-5 text-sm font-extrabold text-slate-950">{name}</h3><p className="mt-1 text-xs text-slate-500">{subtitle}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-indigo-700">Нээх <ArrowUpRight size={15}/></span></Link>)}</div></section>

  <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
   <section className="brand-panel overflow-hidden rounded-[24px] border border-slate-200 bg-white"><div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6"><div><h2 className="text-lg font-black text-slate-950">{t(locale,"latestOrders")}</h2><p className="mt-1 text-xs text-slate-500">Нийт {orderCountResult.count||0} захиалга</p></div><Link className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700" href="/admin/orders">Бүгд <ArrowUpRight size={15}/></Link></div><div className="divide-y divide-slate-100">{orders.slice(0,6).map(o=><Link href={"/admin/orders/"+o.id} className="flex items-center justify-between gap-4 p-5 transition hover:bg-indigo-50/40 sm:px-6" key={o.id}><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-950">#{o.order_number}</p><p className="mt-1 text-xs text-slate-500">{new Date(o.created_at).toLocaleDateString("mn-MN")} · {o.status}</p></div><div className="text-right"><p className="text-sm font-black text-slate-950">{formatMoney(o.total_cents)}</p><p className={"mt-1 text-xs font-semibold "+(o.payment_status==="paid"?"text-emerald-700":"text-amber-700")}>{o.payment_status==="paid"?"Төлөгдсөн":"Төлөгдөөгүй"}</p></div></Link>)}</div>{orders.length===0&&<div className="px-6 py-14 text-center"><ShoppingBag size={29} className="mx-auto text-indigo-300"/><p className="mt-3 text-sm font-bold text-slate-800">{t(locale,"noOrders")}</p><p className="mt-2 text-xs text-slate-500">Хэрэглэгч захиалга хиймэгц энд харагдана.</p></div>}</section>
   <div className="space-y-5"><section className="brand-panel rounded-[24px] border border-slate-200 bg-white p-6"><h2 className="text-lg font-black">{t(locale,"lowStock")}</h2><p className="mt-1 text-xs text-slate-500">Бэлэн бүтээгдэхүүний үлдэгдэл 5 болон түүнээс бага</p>{lowResult.data?.length?<div className="mt-5 space-y-3">{lowResult.data.map(p=><Link key={p.id} href={"/admin/products/"+p.id} className="flex justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm"><span className="min-w-0 truncate">{p.name}</span><strong className="text-rose-700">{p.stock}</strong></Link>)}</div>:<p className="mt-5 rounded-xl bg-emerald-50 p-4 text-xs leading-6 text-emerald-900">Бага нөөцтэй бэлэн бараа бүртгэгдээгүй.</p>}</section><section className="brand-panel rounded-[24px] border border-slate-200 bg-white p-6"><h2 className="text-lg font-black">{t(locale,"topProducts")}</h2><p className="mt-1 text-xs text-slate-500">Сүүлийн төлөгдсөн захиалгуудаас</p>{top.length?<div className="mt-5 space-y-3">{top.map(([name,qty])=><div className="flex justify-between gap-3 text-sm" key={name}><span className="min-w-0 truncate">{name}</span><strong>{qty} ш</strong></div>)}</div>:<p className="mt-5 text-xs text-slate-500">Борлуулалтын мэдээлэл алга.</p>}</section></div>
  </div>
  <p className="text-xs leading-6 text-slate-400">Орлогын тойм нь сүүлийн 1000 захиалгаас тооцсон дүн. Их хэмжээний борлуулалтад серверийн aggregate query ашиглах шаардлагатай.</p>
 </div>;
}
