"use client";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {ArrowLeft,Check,ShoppingCart} from "lucide-react";
import {demoCategories,demoLabels,moneyMnt,type DemoProduct} from "@/lib/demo/catalog";
import {useDemoCart} from "./demo-cart-provider";
import type {Locale} from "@/lib/i18n";
export function DemoProductDetail({product:p,locale}:{product:DemoProduct;locale:Locale}){
 const s=demoLabels[locale];
 const {add,ready}=useDemoCart();
 const [added,setAdded]=useState(false);
 return <main className="container-shell py-10"><Link className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700" href="/demo-store"><ArrowLeft size={17}/>{s.back}</Link><div className="mt-6 grid gap-8 lg:grid-cols-2 lg:items-start">
 <div className="relative aspect-square overflow-hidden rounded-[32px] border border-indigo-100 bg-indigo-50"><Image src={p.image} alt={p.name[locale]+" — "+s.illustration} fill priority sizes="(max-width:1024px) 100vw,50vw" className="object-cover"/><span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-black text-indigo-700">DEMO / 演示</span></div>
 <div className="rounded-[28px] border bg-white p-6 sm:p-9"><p className="brand-eyebrow">{demoCategories.find(c=>c.id===p.category)?.name[locale]}</p><h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">{p.name[locale]}</h1><p className="mt-5 text-3xl font-black text-indigo-700">{moneyMnt(p.priceMnt)}</p><p className="mt-1 text-xs font-bold text-amber-700">DEMO PRICE / 模拟价格</p><p className="mt-6 text-sm leading-8 text-slate-600">{p.description[locale]}</p><div className="mt-6 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-950">{s.stock}: <strong>{p.stock}</strong> · {s.illustration}</div><h2 className="mt-8 text-lg font-bold">{s.specs}</h2><ul className="mt-4 grid gap-3">{p.highlights[locale].map(x=><li key={x} className="flex items-start gap-3 text-sm text-slate-700"><Check size={17} className="shrink-0 text-indigo-700"/>{x}</li>)}</ul><div className="mt-8 flex flex-wrap gap-3"><button type="button" disabled={!ready} onClick={()=>{add(p.id);setAdded(true);}} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white disabled:opacity-50"><ShoppingCart size={18}/>{s.add}</button><Link href="/demo-store/cart" className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-bold text-indigo-800">{added?"✓ ":""}{s.cart}</Link></div></div></div><div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5 text-xs leading-7 text-amber-950">{s.fiction} {s.notReal}</div></main>;
}
