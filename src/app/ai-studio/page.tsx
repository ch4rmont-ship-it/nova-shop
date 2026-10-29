"use client";
import { useState } from "react";
import Link from "next/link";

export default function AIStudio() {
  const [name, setName] = useState("Ухаалаг ширээний гэрэл");
  const [features, setFeatures] = useState("USB-C цэнэглэлт, 3 гэрлийн горим, авсаархан");
  const [audience, setAudience] = useState("Оюутан, гэрээсээ ажилладаг хүн");
  const [language, setLanguage] = useState<"中文" | "Монгол" | "English">("中文");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function generate() {
    setError(""); setResult(""); setLoading(true);
    try {
      const res = await fetch("/api/ai/product-copy", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, features, audience, language })
      });
      const data: { content?: string; error?: string } = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.content || "");
    } catch (e) { setError(e instanceof Error ? e.message : "AI request failed"); }
    finally { setLoading(false); }
  }
  return <main className="container-shell space-y-7 py-10">
    <div><p className="text-sm font-bold text-violet-700">SMARTSHOP AI · AI商品文案生成</p><h1 className="mt-2 text-3xl font-black">AI Product Studio</h1><p className="mt-3 max-w-2xl text-slate-600">Админд зориулсан AI бүтээгдэхүүний контент үүсгэгч. OPENAI_API_KEY серверт тохируулаагүй бол AI ажиллахгүй; хуурамч үр дүн харуулахгүй.</p></div>
    <div className="grid gap-6 md:grid-cols-2">
      <section className="space-y-4 rounded-2xl border bg-white p-6">
        <label className="block text-sm font-medium">Барааны нэр<input className="mt-2 w-full rounded-lg border p-3" maxLength={120} value={name} onChange={e=>setName(e.target.value)}/></label>
        <label className="block text-sm font-medium">Онцлог<textarea className="mt-2 w-full rounded-lg border p-3" rows={4} maxLength={1500} value={features} onChange={e=>setFeatures(e.target.value)}/></label>
        <label className="block text-sm font-medium">Зорилтот хэрэглэгч<input className="mt-2 w-full rounded-lg border p-3" maxLength={200} value={audience} onChange={e=>setAudience(e.target.value)}/></label>
        <label className="block text-sm font-medium">Үүсгэх хэл<select className="mt-2 w-full rounded-lg border p-3" value={language} onChange={e=>setLanguage(e.target.value as typeof language)}><option>中文</option><option>Монгол</option><option>English</option></select></label>
        <button disabled={loading || !name.trim() || !features.trim()} onClick={generate} className="w-full rounded-xl bg-violet-700 px-5 py-3 font-bold text-white disabled:opacity-50">{loading?"AI үүсгэж байна…":"AI контент үүсгэх"}</button>
      </section>
      <section className="rounded-2xl border bg-white p-6"><h2 className="font-bold">Үүсгэсэн контент</h2>{error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}{result ? <><p className="mt-3 text-xs text-amber-700">AI output · Нийтлэхээс өмнө бүх баримт, үзүүлэлтийг шалгана уу.</p><textarea aria-label="Контентыг засварлах" className="mt-3 min-h-80 w-full rounded-lg border p-3 text-sm leading-7" value={result} onChange={e=>setResult(e.target.value)}/><button className="mt-4 rounded-lg border px-4 py-2 text-sm" onClick={()=>navigator.clipboard?.writeText(result)}>Хуулах</button></> : !error && <p className="mt-5 text-sm text-slate-500">Мэдээллээ оруулаад AI контент үүсгэнэ үү.</p>}</section>
    </div><Link href="/admin" className="inline-block text-sm font-bold text-violet-700">← Админ самбар</Link>
  </main>;
}
