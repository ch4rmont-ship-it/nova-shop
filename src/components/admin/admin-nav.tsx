"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ArrowUpRight,BarChart3,Bot,Boxes,Calculator,ChevronRight,LayoutDashboard,ListTree,Megaphone,PackageCheck,ScanSearch,Settings2,Sparkles,Users,WandSparkles} from "lucide-react";
import {t,type Locale} from "@/lib/i18n";
export function AdminNav({locale}:{locale:Locale}){
 const path=usePathname();
 const groups=[
  {name:"WORKSPACE",links:[["dashboard","/admin",LayoutDashboard],["adminItems","/admin/products",Boxes],["adminCategories","/admin/categories",ListTree],["adminOrders","/admin/orders",PackageCheck],["adminUsers","/admin/users",Users]]},
  {name:"AI & INTELLIGENCE",links:[["toolCopy","/ai-studio",WandSparkles],["toolSupport","/support",Bot],["toolAnalytics","/admin/analytics",BarChart3],["toolSelection","/admin/product-selection",ScanSearch],["toolMarketing","/admin/marketing",Megaphone],["toolFinance","/admin/finance",Calculator]]},
  {name:"MANAGEMENT",links:[["adminSourcing","/admin/sourcing",Settings2],["demo","/demo",ArrowUpRight]]}
 ] as const;
 return <aside className="min-w-0 xl:sticky xl:top-40 xl:self-start"><div className="rounded-3xl bg-gradient-to-br from-indigo-950 to-violet-800 p-5 text-white"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-white/15"><Sparkles size={21}/></span><div><p className="text-[10px] font-bold tracking-[.2em] text-indigo-200">SMARTSHOP AI</p><p className="mt-1 text-base font-black">Business Hub</p></div></div><p className="mt-5 text-xs text-indigo-100">{t(locale,"workspace")}</p></div><nav className="mt-4 flex gap-2 overflow-x-auto pb-2 xl:grid xl:gap-4 xl:overflow-visible" aria-label={t(locale,"menu")}>{groups.map(group=><div key={group.name} className="flex shrink-0 gap-1.5 rounded-2xl border bg-white p-2 xl:grid"><p className="hidden px-3 pt-2 text-[10px] font-black tracking-widest text-slate-400 xl:block">{group.name}</p>{group.links.map(([key,href,Icon])=>{const active=path===href || (href!=="/admin" && path.startsWith(href+"/"));return <Link href={href} key={href} aria-current={active?"page":undefined} className={active?"flex shrink-0 items-center gap-2.5 rounded-xl bg-indigo-700 px-3.5 py-3 text-xs font-bold text-white":"flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-3 text-xs font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-800"}><Icon size={17}/><span className="whitespace-nowrap">{t(locale,key)}</span>{active?<ChevronRight size={14} className="ml-auto hidden xl:block"/>:null}</Link>;})}</div>)}</nav><Link href="/" className="mt-4 hidden items-center justify-between gap-2 rounded-xl border bg-white p-4 text-xs font-bold text-indigo-700 xl:flex">{t(locale,"home")}<ArrowUpRight size={16}/></Link></aside>;
}
