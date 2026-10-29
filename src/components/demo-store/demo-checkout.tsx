"use client";
import {useState} from "react";
import Link from "next/link";
import {ArrowLeft,CheckCircle2,LockKeyhole,PackageCheck} from "lucide-react";
import {demoLabels,demoProducts,moneyMnt} from "@/lib/demo/catalog";
import type {Locale} from "@/lib/i18n";
import {useDemoCart} from "./demo-cart-provider";
type Receipt={reference:string;total:number;count:number};
export function DemoCheckout({locale}:{locale:Locale}){
 const s=demoLabels[locale];
 const {lines,ready,clear}=useDemoCart();
 const [receipt,setReceipt]=useState<Receipt|null>(null);
 const rows=lines.flatMap(line=>{const p=demoProducts.find(p=>p.id===line.id);return p?[{...line,p}]:[];});
 const total=rows.reduce((n,row)=>n+row.p.priceMnt*row.qty,0);
 function confirm(){
  if(!ready||rows.length===0||receipt)return;
  const reference="DEMO-"+Date.now().toString(36).toUpperCase();
  setReceipt({reference,total,count:rows.reduce((n,row)=>n+row.qty,0)});
  clear(); // local browser only: no API call, no payment, no Supabase writes
 }
 return <main className="container-shell max-w-5xl py-10">
 <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><LockKeyhole size={23}/></span><div><p className="brand-eyebrow">SIMULATION · NO PAYMENT</p><h1 className="mt-1 text-3xl font-black">{s.checkout}</h1></div></div>
 <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">{s.fiction} {s.notReal}</p>
 {receipt?<div role="status" className="mt-8 rounded-3xl border bg-white p-8 text-center"><CheckCircle2 className="mx-auto text-emerald-600" size={52}/><h2 className="mt-5 text-2xl font-black">{s.success}</h2><p className="mt-3 text-sm text-slate-600">{s.demoOrder}: <strong>{receipt.reference}</strong> · DEMO ONLY</p><p className="mt-3 text-xl font-black">{moneyMnt(receipt.total)}</p><p className="mt-2 text-sm">{receipt.count} {s.items}</p><p className="mt-5 text-sm text-amber-800">{s.notReal}</p><Link href="/demo-store" className="mt-6 inline-flex rounded-xl bg-indigo-700 px-5 py-3 text-sm font-bold text-white">{s.continue}</Link></div>:!ready?<p role="status" className="mt-8">...</p>:rows.length===0?<div className="mt-8 rounded-3xl border bg-white p-8"><p className="font-bold">{s.empty}</p><Link className="mt-4 inline-flex text-indigo-700" href="/demo-store/cart">{s.cart}</Link></div>:<section className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><div className="rounded-3xl border bg-white p-6"><h2 className="flex items-center gap-2 text-lg font-black"><PackageCheck className="text-indigo-700" size={21}/>{s.summary}</h2><div className="mt-5 divide-y">{rows.map(row=><div key={row.id} className="flex justify-between gap-4 py-4 text-sm"><div><strong>{row.p.name[locale]}</strong><p className="mt-1 text-xs text-slate-500">{s.quantity}: {row.qty}</p></div><strong>{moneyMnt(row.p.priceMnt*row.qty)}</strong></div>)}</div></div><div className="h-fit rounded-3xl border bg-white p-6"><p className="text-sm text-slate-500">{s.total}</p><p className="mt-3 text-3xl font-black text-indigo-700">{moneyMnt(total)}</p><button type="button" onClick={confirm} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 p-4 text-sm font-bold text-white"><CheckCircle2 size={19}/>{s.confirm}</button><p className="mt-4 text-xs leading-6 text-amber-800">{s.notReal}</p></div></section>}
 <Link href="/demo-store/cart" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-indigo-700"><ArrowLeft size={16}/>{s.cart}</Link>
 </main>;
}
