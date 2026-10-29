"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, BarChart3, Boxes, FlaskConical, PackagePlus, ScanSearch } from "lucide-react";

type Product={id:string;name:string;slug:string|null;priceMnt:number;landedCostMnt:number|null;estimatedGrossProfitMnt:number|null;estimatedGrossMarginPct:number|null;stock:number;preorder:boolean;unitsSold:number;sample:boolean};
type Analysis={mode:"live"|"demo";items:Product[];scope:string;disclaimer:string;currency:string};
function money(n:number|null){return n===null?"—":new Intl.NumberFormat("en-US",{maximumFractionDigits:0}).format(n)+"₮";}
export default function ProductSelectionPage(){
 const [mode,setMode]=useState<"live"|"demo">("live");
 const [analysis,setAnalysis]=useState<Analysis|null>(null);
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(true);
 const [chosen,setChosen]=useState<string[]>([]);
 useEffect(()=>{
  let active=true;
  const load=async()=>{
   setLoading(true);setError("");setChosen([]);
   try {
    const response=await fetch("/api/admin/product-selection?mode="+mode,{cache:"no-store"});
    const data=await response.json() as Analysis&{error?:string};
    if(!response.ok)throw new Error(data.error||"Unable to load product analysis");
    if(active)setAnalysis(data);
   }catch(e){if(active){setError(e instanceof Error?e.message:"Unknown error");setAnalysis(null);}}
   finally{if(active)setLoading(false);}
  };
  void load();
  return()=>{active=false;};
 },[mode]);
 const items=analysis?.items||[];
 const selected=items.filter(p=>chosen.includes(p.id));
 return <div className="space-y-6">
  <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="brand-eyebrow">SMARTSHOP AI · AI智能选品</p><h1 className="mt-2 text-3xl font-black text-slate-950">Product Selection</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">Барааны үнэ, нөөц, өртөг, төлөгдсөн захиалгын мэдээлэлд суурилсан харьцуулалт. API key шаардахгүй.</p></div><Link href="/admin/products/new" className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white"><PackagePlus size={17}/>Шинэ бараа</Link></header>
  <div className="flex flex-wrap gap-3"><button type="button" onClick={()=>setMode("live")} className={mode==="live"?"flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white":"flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-bold"}><Boxes size={17}/>Бодит каталог</button><button type="button" onClick={()=>setMode("demo")} className={mode==="demo"?"flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-bold text-white":"flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-bold"}><FlaskConical size={17}/>演示数据 · Demo</button></div>
  {mode==="demo"&&<p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">演示数据 — Бараа, өртөг, борлуулалтын тоонууд нь зөвхөн хичээлийн зохиомол жишээ. Бодит зах зээлийн мэдээлэл биш.</p>}
  {loading&&<p role="status" className="rounded-xl bg-white p-5 text-sm">Мэдээлэл ачаалж байна...</p>}
  {error&&<p role="alert" className="rounded-xl bg-red-50 p-5 text-sm text-red-700">{error}</p>}
  {!loading&&!error&&analysis&&<>
   <p className="text-xs text-slate-500">{analysis.scope}</p>
   {items.length===0?<div className="rounded-3xl border border-dashed border-indigo-200 bg-white p-10 text-center"><ScanSearch className="mx-auto text-indigo-600" size={36}/><h2 className="mt-4 text-xl font-black">Шинжлэх бараа алга</h2><p className="mt-3 text-sm text-slate-500">Хуучин каталог цэвэрлэгдсэн. Админ шинэ бараа нэмж эсвэл demo горимыг сонгож болно.</p><button type="button" onClick={()=>setMode("demo")} className="mt-5 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-bold text-white">Demo үзэх</button></div>:<>
    <div className="grid gap-4 sm:grid-cols-3">{[["Барааны тоо",items.length],["Өртөг бүртгэсэн",items.filter(p=>p.landedCostMnt!==null).length],["Борлуулсан ширхэг",items.reduce((n,p)=>n+p.unitsSold,0)]].map(([label,num])=><div key={label} className="rounded-2xl border bg-white p-5"><p className="text-xs text-slate-500">{label}</p><p className="mt-3 text-3xl font-black text-indigo-800">{num}</p></div>)}</div>
    <section className="overflow-hidden rounded-3xl border bg-white"><div className="flex flex-wrap items-center justify-between gap-4 border-b p-5"><h2 className="flex items-center gap-2 text-lg font-bold"><BarChart3 className="text-indigo-700" size={20}/>Бүтээгдэхүүн харьцуулах</h2><span className="text-xs text-slate-500">2 хүртэл бараа сонгоно уу</span></div><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-indigo-50/40 text-xs text-slate-600"><tr>{["Сонголт","Бараа","Үнэ","Өртөг (таамаг)","Зөрүү","Gross margin","Борлуулсан","Нөөц"].map(x=><th className="p-4" key={x}>{x}</th>)}</tr></thead><tbody>{items.map(p=><tr key={p.id} className="border-t border-slate-100"><td className="p-4"><input type="checkbox" aria-label={p.name+" сонгох"} checked={chosen.includes(p.id)} onChange={e=>setChosen(old=>e.target.checked?[...old,p.id].slice(-2):old.filter(id=>id!==p.id))}/></td><td className="p-4 font-bold">{p.slug&&!p.sample?<Link className="text-indigo-700 underline" href={"/product/"+p.slug}>{p.name}</Link>:p.name}</td><td className="p-4">{money(p.priceMnt)}</td><td className="p-4">{money(p.landedCostMnt)}</td><td className="p-4">{money(p.estimatedGrossProfitMnt)}</td><td className="p-4">{p.estimatedGrossMarginPct===null?"—":p.estimatedGrossMarginPct+"%"}</td><td className="p-4">{p.unitsSold}</td><td className="p-4">{p.preorder?"Preorder":p.stock}</td></tr>)}</tbody></table></div></section>
    <section className="rounded-3xl border bg-white p-6"><h2 className="text-lg font-black">Сонгосон хоёр бараа</h2>{selected.length<2?<p className="mt-3 text-sm text-slate-500">Дээрх хүснэгтээс харьцуулах 2 бараа сонгоорой.</p>:<div className="mt-4 grid gap-4 sm:grid-cols-2">{selected.map(p=><div className="rounded-2xl bg-indigo-50 p-5" key={p.id}><h3 className="font-bold">{p.name}</h3><p className="mt-3 text-sm">Үнэ: {money(p.priceMnt)}</p><p className="mt-2 text-sm">Өртөг: {money(p.landedCostMnt)}</p><p className="mt-2 text-sm">Margin: {p.estimatedGrossMarginPct===null?"—":p.estimatedGrossMarginPct+"%"}</p></div>)}</div>}</section>
   </>}
   <p className="rounded-xl bg-slate-100 p-4 text-xs leading-6 text-slate-600">{analysis.disclaimer} Gross margin нь бүх зардлыг тооцсон цэвэр ашиг биш.</p>
  </>}
  <Link href="/demo" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700">Багшийн demo <ArrowUpRight size={16}/></Link>
 </div>;
}
