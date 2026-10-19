"use client";

import Link from "next/link";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/store-provider";

const links = [["Нүүр","/"],["Дэлгүүр","/shop"],["Ангилал","/categories"]] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { cartCount, favorites } = useStore();
  return <>
    <div className="bg-[#171816] px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[.16em] text-white sm:text-[11px]">₮150,000-аас дээш захиалгад хүргэлт үнэгүй · УБ болон орон нутагт хүргэнэ</div>
    <header className="sticky top-0 z-40 border-b border-[#dedbd3]/80 bg-[#f7f5f0]/95 backdrop-blur">
      <div className="container-shell flex h-17 items-center justify-between gap-4">
        <button className="lg:hidden" aria-label="Цэс нээх" onClick={() => setOpen(true)}><Menu size={22}/></button>
        <Link href="/" className="text-xl font-black tracking-[.18em]">NOVA</Link>
        <nav className="hidden items-center gap-7 lg:flex">{links.map(([label,href])=><Link key={href} href={href} className="text-sm font-semibold hover:opacity-60">{label}</Link>)}</nav>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/search" aria-label="Хайх"><Search size={20}/></Link>
          <Link href="/favorites" aria-label="Хадгалсан" className="relative"><Heart size={20}/>{favorites.length ? <span className="absolute -right-2 -top-2 rounded-full bg-[#1f4d3a] px-1.5 text-[9px] text-white">{favorites.length}</span>:null}</Link>
          <Link href="/cart" aria-label="Сагс" className="relative"><ShoppingBag size={20}/>{cartCount ? <span className="absolute -right-2 -top-2 rounded-full bg-[#1f4d3a] px-1.5 text-[9px] text-white">{cartCount}</span>:null}</Link>
          <Link href="/account" aria-label="Бүртгэл"><User size={20}/></Link>
        </div>
      </div>
    </header>
    {open ? <div className="fixed inset-0 z-50 bg-black/30 lg:hidden" onClick={() => setOpen(false)}><div className="h-full w-[85%] max-w-sm bg-[#f7f5f0] p-5" onClick={(e)=>e.stopPropagation()}>
      <div className="mb-10 flex items-center justify-between"><span className="text-xl font-black tracking-[.18em]">NOVA</span><button aria-label="Цэс хаах" onClick={()=>setOpen(false)}><X/></button></div>
      <nav className="grid gap-1">{links.map(([label,href])=><Link onClick={()=>setOpen(false)} key={href} href={href} className="rounded-xl px-3 py-4 text-lg font-bold hover:bg-white">{label}</Link>)}<Link onClick={()=>setOpen(false)} href="/account" className="rounded-xl px-3 py-4 text-lg font-bold hover:bg-white">Миний бүртгэл</Link></nav>
    </div></div>:null}
  </>;
}
