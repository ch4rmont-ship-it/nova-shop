"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutDashboard, Menu, Search, ShoppingCart, UserRound, X, Sparkles, ChevronDown, ArrowUpRight, Bot } from "lucide-react";
import { useEffect, useState } from "react";
import { useStore } from "@/components/store-provider";

const navigation = [
 {name:"Нүүр",href:"/"},
 {name:"Дэлгүүр",href:"/shop"},
 {name:"AI үйлчилгээ",href:"/support"},
 {name:"Бизнесийн хэрэгсэл",href:"/ai-studio"},
 {name:"Үнийн загвар",href:"/pricing"},
 {name:"中文 Demo",href:"/demo"}
];
export function Header(){
 const [open,setOpen]=useState(false);
 const [toolsOpen,setToolsOpen]=useState(false);
 const pathname=usePathname();
 const {cartCount,favorites}=useStore();
 useEffect(()=>{setOpen(false);setToolsOpen(false);},[pathname]);
 return <>
  <div className="bg-[#0b1025] text-white"><div className="container-shell flex items-center justify-between gap-3 py-2.5 text-[11px]"><span className="flex items-center gap-2 font-medium text-slate-200"><Sparkles size={13} className="text-violet-300"/> SmartShop AI · 智能电商平台</span><span className="hidden font-medium text-slate-400 sm:inline">Startup Demo · AI functions clearly labeled</span></div></div>
  <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
   <div className="container-shell flex flex-wrap items-center gap-3 py-3.5 lg:gap-6">
    <button type="button" onClick={()=>setOpen(true)} className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-50 lg:hidden" aria-label="Нээх цэс"><Menu size={21}/></button>
    <Link href="/" className="mr-auto inline-flex items-center gap-2.5 whitespace-nowrap text-lg font-black tracking-tight text-slate-950 sm:text-xl" aria-label="SmartShop AI нүүр хуудас">
     <span className="grid size-10 place-items-center rounded-[13px] bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-[0_5px_15px_rgba(79,70,229,.22)]"><Sparkles size={21}/></span><span>SmartShop<span className="ml-1 text-indigo-700">AI</span></span>
    </Link>
    <form action="/shop" role="search" className="order-last flex w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-within:border-indigo-400 focus-within:bg-white lg:order-none lg:ml-2 lg:max-w-lg lg:flex-1"><label className="sr-only" htmlFor="site-search">Бараа хайх</label><input id="site-search" type="search" name="q" placeholder="Бараа хайх · 搜索商品" className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm outline-none"/><button aria-label="Хайх" className="grid w-12 place-items-center bg-indigo-700 text-white transition hover:bg-indigo-800"><Search size={18}/></button></form>
    <div className="flex items-center gap-1 sm:gap-2">
     <Link href="/account" className="brand-header-icon" title="Профайл" aria-label="Профайл"><UserRound size={20}/></Link>
     <Link href="/favorites" className="brand-header-icon relative" title="Хадгалсан бараа" aria-label="Хадгалсан бараа"><Heart size={20}/>{favorites.length>0&&<span className="market-count">{favorites.length}</span>}</Link>
     <Link href="/cart" className="brand-header-icon relative" title="Сагс" aria-label="Сагс"><ShoppingCart size={20}/>{cartCount>0&&<span className="market-count">{cartCount}</span>}</Link>
     <Link href="/admin" className="ml-1 hidden items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-800 xl:inline-flex"><LayoutDashboard size={16}/> Dashboard</Link>
    </div>
   </div>
   <div className="hidden border-t border-slate-100 lg:block"><nav className="container-shell flex items-center gap-7 py-3 text-xs font-bold text-slate-600" aria-label="Үндсэн цэс">{navigation.map(n=><Link key={n.href} href={n.href} aria-current={pathname===n.href?"page":undefined} className={pathname===n.href?"text-indigo-700":"transition hover:text-indigo-700"}>{n.name}</Link>)}<div className="relative ml-auto"><button className="inline-flex items-center gap-1 text-indigo-700" type="button" onClick={()=>setToolsOpen(x=>!x)} aria-expanded={toolsOpen}>Smart tools <ChevronDown size={14}/></button>{toolsOpen&&<div className="absolute right-0 top-8 z-50 w-60 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">{[["AI Studio","/ai-studio"],["AI Analytics","/admin/analytics"],["Product Selection","/admin/product-selection"],["Marketing Studio","/admin/marketing"],["Admin Dashboard","/admin"]].map(([n,h])=><Link className="block rounded-lg px-3 py-2.5 text-xs text-slate-800 hover:bg-indigo-50" key={h} href={h}>{n}</Link>)}</div>}</div></nav></div>
  </header>
  {open&&<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm lg:hidden" onClick={()=>setOpen(false)}><div role="dialog" aria-modal="true" aria-label="Үндсэн цэс" onClick={e=>e.stopPropagation()} className="h-full w-[min(90vw,390px)] overflow-y-auto bg-white p-6 shadow-2xl"><div className="flex items-center justify-between"><span className="flex items-center gap-2 font-black text-indigo-800"><Sparkles size={20}/> SmartShop AI</span><button type="button" aria-label="Цэс хаах" className="grid size-10 place-items-center rounded-xl border" onClick={()=>setOpen(false)}><X size={21}/></button></div><p className="mt-6 text-xs font-bold tracking-widest text-slate-400">EXPLORE</p><nav className="mt-3 grid gap-1">{navigation.map(n=><Link className={pathname===n.href?"rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700":"rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"} key={n.href} href={n.href}>{n.name}</Link>)}</nav><p className="mt-6 text-xs font-bold tracking-widest text-slate-400">WORKSPACE</p><div className="mt-3 grid gap-2">{[["AI Product Studio","/ai-studio"],["Product Selection","/admin/product-selection"],["Sales Analytics","/admin/analytics"],["Marketing Studio","/admin/marketing"]].map(([name,href])=><Link className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold text-slate-800" key={href} href={href}>{name}<ArrowUpRight size={16}/></Link>)}</div><Link href="/admin" className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 py-3 text-sm font-bold text-white"><LayoutDashboard size={17}/> Admin Dashboard</Link><Link href="/support" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700"><Bot size={17}/> Customer Service</Link></div></div>}
 </>;
}
