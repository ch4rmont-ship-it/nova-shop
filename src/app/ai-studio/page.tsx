"use client";
import {useState} from "react";
import Link from "next/link";
export default function AIStudio(){
 const [name,setName]=useState("Ухаалаг ширээний гэрэл");
 const [features,setFeatures]=useState("USB-C цэнэглэлт, 3 гэрлийн горим, авсаархан");
 const [audience,setAudience]=useState("Оюутан, гэрээсээ ажилладаг хүн");
 const [result,setResult]=useState("");
 function generate(){
  const product=name.trim(), details=features.trim(), target=audience.trim();
  if(!product)return;
  setResult(`🛍️ ${product}\n\n${target||"Өдөр тутмын хэрэглэгч"}-д зориулсан практик сонголт.\n\n✨ Онцлог: ${details||"Бүтээгдэхүүний мэдээллийг нэмнэ үү."}\n\n📣 Сурталчилгаа: ${product} — өдөр тутмын хэрэгцээнд тань тохирох ухаалаг сонголт!\n\n⚠️ Үнэ, нөөц, техникийн үзүүлэлтийг нийтлэхээс өмнө баталгаажуулна уу.`);
 }
 return <div className="container-shell py-10 space-y-7"><div><p className="text-sm font-bold text-violet-700">SMARTSHOP AI · DEMO</p><h1 className="mt-2 text-3xl font-black">AI Commerce Studio</h1><p className="mt-3 max-w-2xl text-slate-600">Нэг хүний онлайн дэлгүүрийн ажлыг хялбарчлах бүтээгдэхүүний тайлбарын прототип. Энэ хувилбар нь API холбогдоогүй, загварт суурилсан demo юм.</p></div><div className="grid gap-6 md:grid-cols-2"><section className="space-y-4 rounded-2xl border bg-white p-6"><h2 className="font-bold">Бүтээгдэхүүний мэдээлэл</h2><label className="block text-sm font-medium">Нэр<input className="mt-2 w-full rounded-lg border p-3" value={name} onChange={e=>setName(e.target.value)} /></label><label className="block text-sm font-medium">Онцлог<textarea className="mt-2 w-full rounded-lg border p-3" rows={3} value={features} onChange={e=>setFeatures(e.target.value)} /></label><label className="block text-sm font-medium">Зорилтот хэрэглэгч<input className="mt-2 w-full rounded-lg border p-3" value={audience} onChange={e=>setAudience(e.target.value)} /></label><button onClick={generate} className="w-full rounded-xl bg-violet-700 px-5 py-3 font-bold text-white">Тайлбар үүсгэх</button></section><section className="rounded-2xl border bg-white p-6"><h2 className="font-bold">Үүсгэсэн контент</h2>{result?<><pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7">{result}</pre><button className="mt-5 rounded-lg border px-4 py-2 text-sm" onClick={()=>navigator.clipboard?.writeText(result)}>Хуулах</button></>:<p className="mt-5 text-sm text-slate-500">Мэдээллээ оруулаад тайлбар үүсгэнэ үү.</p>}</section></div><Link href="/" className="inline-block text-sm font-bold text-violet-700">← Дэлгүүр рүү буцах</Link></div>;
}