import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bot, ChartNoAxesCombined, Check, ChevronRight, CircleHelp, CreditCard, Layers3, Megaphone, PackagePlus, ScanSearch, ShieldCheck, ShoppingBag, Sparkles, WandSparkles, Zap } from "lucide-react";
import { getProducts } from "@/lib/data/catalog";
import { ProductGrid } from "@/components/product/product-grid";

const features = [
 {href:"/ai-studio",Icon:WandSparkles,title:"AI 商品文案",en:"Product content studio",desc:"Бүтээгдэхүүний тайлбар, SEO болон сурталчилгааны текст үүсгэх. Live AI нь API холболтын дараа ажиллана.",tag:"AI READY",tagColor:"bg-indigo-50 text-indigo-700"},
 {href:"/support",Icon:Bot,title:"智能客服",en:"Customer support",desc:"Бодит каталогийн үнэ, үлдэгдэлд суурилсан хэрэглэгчийн туслах. Одоогоор дүрмийн горим.",tag:"RULE-BASED",tagColor:"bg-sky-50 text-sky-700"},
 {href:"/admin/analytics",Icon:ChartNoAxesCombined,title:"销售数据分析",en:"Sales intelligence",desc:"Төлөгдсөн захиалга, борлуулалтын хандлага болон бүтээгдэхүүний үзүүлэлтийг нэг дор.",tag:"LIVE DATA",tagColor:"bg-emerald-50 text-emerald-700"},
 {href:"/admin/product-selection",Icon:ScanSearch,title:"智能选品",en:"Product selection",desc:"Бараа харьцуулах, өртөг ба боломжит gross margin тооцоолох. Админ эрх шаардлагатай.",tag:"ADMIN",tagColor:"bg-violet-50 text-violet-700"},
 {href:"/admin/marketing",Icon:Megaphone,title:"营销助手",en:"Marketing assistant",desc:"Сурталчилгааны загвар контентыг платформ тус бүрээр бэлтгэж, засварлах.",tag:"TEMPLATE DEMO",tagColor:"bg-amber-50 text-amber-700"},
 {href:"/admin",Icon:Layers3,title:"智能运营后台",en:"Business workspace",desc:"Бараа, үнэ, нөөц, захиалга болон үйлчлүүлэгчийн удирдлага.",tag:"ADMIN",tagColor:"bg-violet-50 text-violet-700"}
] as const;

export default async function HomePage() {
 const products=await getProducts();
 return <div className="min-w-0 overflow-hidden">
  <section className="relative isolate overflow-hidden bg-[#0b1025] text-white">
   <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-64 size-[660px] rounded-full bg-indigo-700/30 blur-[110px]"/>
   <div aria-hidden="true" className="pointer-events-none absolute -bottom-72 left-1/4 size-[600px] rounded-full bg-violet-700/25 blur-[110px]"/>
   <div aria-hidden="true" className="brand-grid absolute inset-0 opacity-25"/>
   <div className="container-shell relative grid items-center gap-14 py-20 lg:grid-cols-[1fr_1fr] lg:gap-16 lg:py-28">
    <div className="relative z-10">
     <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.08] px-4 py-2 text-xs font-semibold tracking-wide text-indigo-100"><span className="size-2 rounded-full bg-emerald-400"/> SMARTSHOP AI / NEXT-GEN COMMERCE</p>
     <h1 className="mt-8 max-w-2xl text-[clamp(2.7rem,5.2vw,5.25rem)] font-black leading-[1.1] tracking-tight">Таны бизнесийн <span className="brand-gradient-text">ухаалаг</span> шинэ үе.</h1>
     <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">一个人，也能运营一家智能电商公司</p>
     <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">Нэг хүн дэлгүүрийнхээ бараа, захиалга, маркетинг, борлуулалтыг нэг цэгээс удирдах SmartShop AI платформ.</p>
     <div className="mt-9 flex flex-wrap gap-3">
      <Link href="/demo" className="brand-btn-solid inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold">Төслийн demo үзэх <ArrowUpRight size={17}/></Link>
      <Link href="/shop" className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/[.07] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/15">Дэлгүүрт зочлох <ArrowRight size={17}/></Link>
     </div>
     <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-7">
      <div><p className="text-2xl font-black sm:text-3xl">3</p><p className="mt-1 text-xs text-slate-400">Хэлний зорилт</p></div>
      <div><p className="text-2xl font-black sm:text-3xl">2</p><p className="mt-1 text-xs text-slate-400">Нэгдсэн орчин</p></div>
      <div><p className="text-2xl font-black sm:text-3xl">1</p><p className="mt-1 text-xs text-slate-400">Бизнес эзэн</p></div>
     </div>
    </div>
    <div className="relative mx-auto w-full max-w-[575px]">
     <div aria-hidden="true" className="absolute inset-x-8 -inset-y-8 rounded-[46px] bg-indigo-500/30 blur-3xl"/>
     <div className="brand-display relative overflow-hidden rounded-[28px] border border-white/20 bg-[#f8f9ff] text-slate-900 shadow-[0_35px_100px_rgba(0,0,0,.4)]">
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-5 py-4 sm:px-6"><div className="flex items-center gap-2"><div className="grid size-9 place-items-center rounded-xl bg-indigo-700 text-white"><Sparkles size={19}/></div><div><p className="text-sm font-black tracking-tight">SmartShop <span className="text-indigo-700">AI</span></p><p className="text-[10px] text-slate-500">Business workspace · UI preview</p></div></div><div className="flex gap-1.5"><span className="size-2 rounded-full bg-rose-300"/><span className="size-2 rounded-full bg-amber-300"/><span className="size-2 rounded-full bg-emerald-300"/></div></div>
      <div className="p-5 sm:p-7">
       <div className="flex items-start justify-between gap-2"><div><p className="text-xs font-medium text-slate-500">Business overview</p><h2 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">Өсөлтөө нэг дор удирд.</h2></div><span className="rounded-full bg-indigo-50 px-3 py-1.5 text-[10px] font-bold text-indigo-700">INTERFACE PREVIEW</span></div>
       <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm"><div className="grid size-9 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><ShoppingBag size={18}/></div><p className="mt-3 text-xs font-semibold">Бүтээгдэхүүн</p><p className="mt-2 text-2xl font-black">{products.length}</p><p className="mt-1 text-[10px] text-slate-500">Одоогийн нийтлэгдсэн каталог</p></div>
        <div className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm"><div className="grid size-9 place-items-center rounded-xl bg-violet-50 text-violet-700"><ShieldCheck size={18}/></div><p className="mt-3 text-xs font-semibold">AI статус</p><p className="mt-2 text-lg font-black">API-ready</p><p className="mt-1 text-[10px] text-slate-500">Бодит AI дараа нь холбогдоно</p></div>
       </div>
       <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between"><span className="text-sm font-bold">Business workflow</span><span className="text-[10px] text-slate-400">DESIGN PREVIEW · NOT SALES DATA</span></div>
        <div className="grid grid-cols-3 gap-2">{[{label:"Бараа",Icon:PackagePlus},{label:"AI хэрэгсэл",Icon:WandSparkles},{label:"Захиалга",Icon:CreditCard}].map(({label,Icon},i)=><div className="text-center" key={label}><div className="mx-auto grid h-16 w-full place-items-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-700"><Icon size={24}/></div><p className="mt-3 text-[11px] font-bold text-slate-700">{label}</p><p className="mt-1 text-[10px] text-slate-400">STEP {i+1}</p></div>)}</div>
       </div>
       <div className="mt-4 flex items-center gap-3 rounded-xl bg-indigo-50 p-3 text-xs text-indigo-900"><Zap size={17} className="shrink-0"/><span>Нэг платформ · Дэлгүүр + AI бэлэн удирдлага</span><Check size={15} className="ml-auto shrink-0"/></div>
      </div>
     </div>
     <div className="absolute -bottom-5 -left-2 hidden rounded-2xl border border-white/30 bg-white p-4 shadow-2xl sm:flex sm:items-center sm:gap-3 lg:-left-10"><span className="grid size-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Check size={21}/></span><div><p className="text-xs font-extrabold text-slate-900">Өгөгдөлд суурилсан</p><p className="mt-1 text-[11px] text-slate-500">Нийтлэгдсэн бараа · Бодит захиалга</p></div></div>
    </div>
   </div>
  </section>

  <section className="border-b border-slate-200 bg-white py-7"><div className="container-shell grid grid-cols-2 gap-5 text-center sm:grid-cols-4"><div className="text-xs font-bold tracking-wide text-slate-500">NEXT.JS 16</div><div className="text-xs font-bold tracking-wide text-slate-500">SUPABASE</div><div className="text-xs font-bold tracking-wide text-slate-500">VERCEL</div><div className="text-xs font-bold tracking-wide text-slate-500">AI-READY WORKFLOWS</div></div></section>

  <section className="container-shell py-20 sm:py-24">
   <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="brand-eyebrow">ONE PLATFORM. EVERY TOOL.</p><h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Нэг дэлгүүр. <span className="text-indigo-700">Бүх боломж.</span></h2><p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">Энгийн онлайн дэлгүүрээс эхлээд AI-д бэлэн бизнесийн удирдлагын хэрэгсэл хүртэл.</p></div><Link href="/pricing" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700">Үнийн загвар <ArrowUpRight size={16}/></Link></div>
   <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{features.map(({href,Icon,title,en,desc,tag,tagColor})=><Link href={href} key={href} className="brand-feature-card group relative flex flex-col rounded-[24px] border border-slate-200 bg-white p-6 sm:p-7"><div className="flex items-start justify-between gap-3"><span className="grid size-13 place-items-center rounded-2xl bg-indigo-50 text-indigo-700 transition group-hover:bg-indigo-700 group-hover:text-white"><Icon size={24}/></span><span className={"rounded-full px-3 py-1.5 text-[10px] font-bold "+tagColor}>{tag}</span></div><h3 className="mt-7 text-xl font-extrabold text-slate-950">{title}</h3><p className="mt-1 text-xs font-semibold tracking-wide text-indigo-700">{en}</p><p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{desc}</p><span className="mt-6 inline-flex items-center gap-2 text-xs font-black text-indigo-700">Нээх <ArrowUpRight size={16} className="transition group-hover:translate-x-1"/></span></Link>)}</div>
  </section>

  <section className="bg-[#0f1633] py-20 text-white"><div className="container-shell grid items-center gap-10 lg:grid-cols-[.9fr_1.1fr]"><div><p className="text-xs font-bold tracking-[.2em] text-indigo-300">FROM TASKS TO SYSTEM</p><h2 className="mt-4 max-w-lg text-3xl font-black leading-tight sm:text-4xl">Борлуулалтад төвлөр. Давтагдах ажлаа хөнгөвчил.</h2><p className="mt-5 max-w-xl text-sm leading-8 text-slate-300">SmartShop AI нь хэрэглэгчид болон дэлгүүрийн эздэд зориулсан хоёр тусдаа орчныг нэг дор нэгтгэнэ.</p><Link href="/demo" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950">8 минутын танилцуулга <ArrowRight size={17}/></Link></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-3xl border border-white/15 bg-white/10 p-7"><ShoppingBag size={27} className="text-indigo-200"/><h3 className="mt-6 text-lg font-bold">Storefront</h3><p className="mt-3 text-sm leading-7 text-slate-300">Хэрэглэгч бараа хайж, сагсанд нэмээд захиалга өгөх боломжтой.</p><Link className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-indigo-200" href="/shop">Дэлгүүр нээх <ChevronRight size={15}/></Link></div><div className="rounded-3xl border border-white/15 bg-white/10 p-7"><Layers3 size={27} className="text-indigo-200"/><h3 className="mt-6 text-lg font-bold">Business Dashboard</h3><p className="mt-3 text-sm leading-7 text-slate-300">Админ бараа, захиалга болон борлуулалтын мэдээллээ удирдана.</p><Link className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-indigo-200" href="/admin">Dashboard нээх <ChevronRight size={15}/></Link></div></div></div></section>

  <section className="container-shell py-20 sm:py-24"><div className="flex items-end justify-between gap-4"><div><p className="brand-eyebrow">SMARTSHOP MARKETPLACE</p><h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Шинэ бүтээгдэхүүнүүд</h2><p className="mt-3 text-sm text-slate-600">Зөвхөн нийтлэгдсэн, бодит мэдээлэлтэй бараа.</p></div><Link href="/shop" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-indigo-700">Бүгдийг харах <ArrowUpRight size={17}/></Link></div>{products.length?<div className="mt-9"><ProductGrid products={products.slice(0,12)}/></div>:<div className="mt-9 grid gap-8 overflow-hidden rounded-[28px] border border-dashed border-indigo-200 bg-gradient-to-br from-white to-indigo-50 p-7 sm:grid-cols-[1fr_auto] sm:items-center sm:p-12"><div><div className="grid size-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-700"><PackagePlus size={28}/></div><h3 className="mt-5 text-2xl font-black text-slate-950">Шинэ каталогоо эхлүүлэхэд бэлэн</h3><p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">Хуучин барааг цэвэрлэсэн тул одоогоор нийтлэгдсэн бүтээгдэхүүн байхгүй. Админ бодит мэдээлэлтэй шинэ бараа нэмсний дараа энд автоматаар харагдана.</p></div><Link href="/admin/products/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-800">Бараа нэмэх <ArrowUpRight size={17}/></Link></div>}</section>

  <section className="container-shell pb-20"><div className="flex flex-wrap items-center justify-between gap-6 rounded-[28px] bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-900 p-8 text-white sm:p-12"><div><p className="text-xs font-bold tracking-widest text-indigo-100">YOUR NEXT STEP</p><h2 className="mt-3 max-w-2xl text-2xl font-black sm:text-3xl">SmartShop AI-г багшид үзүүлэх demo</h2><p className="mt-3 max-w-xl text-sm leading-7 text-indigo-100">Хятад хэл дээрх төслийн танилцуулга, бизнесийн загвар, одоо ажиллаж буй хэрэгслүүд.</p></div><Link href="/demo" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-indigo-900">查看演示 <ArrowUpRight size={17}/></Link></div></section>
  <div className="container-shell pb-10"><p className="flex items-start gap-2 text-xs leading-6 text-slate-500"><CircleHelp size={16} className="mt-0.5 shrink-0"/> AI түлхүүр холбогдоогүй үед AI контент үүсгэх боломж идэвхгүй; Rule-based болон demo хэсгийг бодит AI гэж танилцуулахгүй.</p></div>
 </div>;
}
