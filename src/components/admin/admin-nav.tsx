"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ArrowUpRight, BarChart3, Bot, Boxes, ChevronRight, CircleHelp, LayoutDashboard, ListTree, Megaphone, PackageCheck, ScanSearch, Settings2, Sparkles, Users, WandSparkles} from "lucide-react";
const groups=[
 {name:"WORKSPACE",links:[
  {title:"Ерөнхий тойм",href:"/admin",Icon:LayoutDashboard},
  {title:"Бараа, үнэ, зураг",href:"/admin/products",Icon:Boxes},
  {title:"Ангилал",href:"/admin/categories",Icon:ListTree},
  {title:"Захиалгууд",href:"/admin/orders",Icon:PackageCheck},
  {title:"Хэрэглэгчид",href:"/admin/users",Icon:Users}
 ]},
 {name:"AI & INTELLIGENCE",links:[
  {title:"AI Product Studio",href:"/ai-studio",Icon:WandSparkles},
  {title:"Customer Service",href:"/support",Icon:Bot},
  {title:"Sales Analytics",href:"/admin/analytics",Icon:BarChart3},
  {title:"Product Selection",href:"/admin/product-selection",Icon:ScanSearch},
  {title:"Marketing Studio",href:"/admin/marketing",Icon:Megaphone}
 ]},
 {name:"MANAGEMENT",links:[
  {title:"Өртөг / эх сурвалж",href:"/admin/sourcing",Icon:Settings2},
  {title:"Багшийн Demo",href:"/demo",Icon:CircleHelp}
 ]}
] as const;
export function AdminNav(){
 const pathname=usePathname();
 return <aside className="min-w-0 xl:sticky xl:top-40 xl:self-start" aria-label="Админ цэс">
  <div className="overflow-hidden rounded-[24px] bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-800 p-5 text-white shadow-[0_14px_35px_rgba(38,33,95,.14)]">
   <div className="flex items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/15"><Sparkles size={22}/></span><div><p className="text-[10px] font-bold tracking-[.2em] text-indigo-200">SMARTSHOP AI</p><p className="mt-1 text-base font-black">Business Hub</p></div></div>
   <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/15 bg-white/[.08] px-3 py-2.5 text-xs text-indigo-100"><span className="size-2 shrink-0 rounded-full bg-emerald-400"/>Admin workspace<span className="ml-auto text-[10px] text-indigo-200">SECURE</span></div>
  </div>
  <nav className="mt-4 flex gap-2 overflow-x-auto pb-2 xl:grid xl:gap-4 xl:overflow-visible" aria-label="Удирдлагын цэс">
   {groups.map(group=><div className="flex shrink-0 gap-1.5 rounded-2xl border border-slate-200 bg-white p-2 xl:grid" key={group.name}>
    <p className="hidden px-3 pt-2 text-[10px] font-black tracking-[.16em] text-slate-400 xl:block">{group.name}</p>
    {group.links.map(({title,href,Icon})=>{
     const current=pathname===href || (href!=="/admin" && pathname.startsWith(href+"/"));
     return <Link key={href} href={href} title={title} aria-current={current?"page":undefined} className={current?"flex shrink-0 items-center gap-2.5 rounded-xl bg-indigo-700 px-3.5 py-3 text-xs font-bold text-white shadow-md xl:shadow-none":"flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-3 text-xs font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-800"}><Icon size={17} className="shrink-0"/><span className="whitespace-nowrap">{title}</span>{current?<ChevronRight size={14} className="ml-auto hidden xl:block"/>:null}</Link>;
    })}
   </div>)}
  </nav>
  <Link href="/" className="mt-4 hidden items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 xl:flex">Дэлгүүрт буцах <ArrowUpRight size={16}/></Link>
 </aside>;
}
