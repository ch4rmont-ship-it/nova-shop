"use client";
import {useState} from "react";
import {Languages} from "lucide-react";
import {type Locale} from "@/lib/i18n";
export function LanguageSwitcher({locale,light=false}:{locale:Locale;light?:boolean}){
 const [busy,setBusy]=useState(false);
 const [value,setValue]=useState<Locale>(locale);
 async function change(next:Locale){
  setValue(next);setBusy(true);
  try{
   const r=await fetch("/api/locale",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({locale:next})});
   if(!r.ok)throw new Error("Failed to save language");
   window.location.reload();
  }catch{setValue(locale);setBusy(false);}
 }
 return <label className={"inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold "+(light?"border-white/20 text-white":"border-slate-200 bg-white text-slate-700")}>
  <Languages size={15}/><span className="sr-only">Language / Хэл / 语言</span>
  <select aria-label="Language / Хэл / 语言" value={value} disabled={busy} onChange={e=>void change(e.target.value as Locale)} className="max-w-24 cursor-pointer bg-transparent text-inherit outline-none disabled:opacity-50"><option className="text-slate-900" value="mn">Монгол</option><option className="text-slate-900" value="zh">中文</option><option className="text-slate-900" value="en">English</option></select>
 </label>;
}
