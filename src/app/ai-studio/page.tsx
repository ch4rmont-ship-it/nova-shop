"use client";

import { useState } from "react";
import Link from "next/link";

export default function AIStudio() {
  const [name, setName] = useState("Ухаалаг ширээний гэрэл");
  const [category, setCategory] = useState("Гэр ахуй");
  const [features, setFeatures] = useState("USB-C цэнэглэлт, 3 гэрлийн горим");
  const [audience, setAudience] = useState("Оюутан");
  const [specifications, setSpecifications] = useState("");
  const [language, setLanguage] = useState<"zh" | "mn" | "en">("zh");
  const [tone, setTone] = useState<"professional" | "friendly" | "premium">("professional");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    setError(""); setOutput(""); setLoading(true);
    try {
      const response = await fetch("/api/ai/product", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category, features, audience, specifications, language, tone })
      });
      const data: { output?: string; error?: string; message?: string } = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || "Generation failed");
      setOutput(data.output || "");
    } catch (e) { setError(e instanceof Error ? e.message : "Generation failed"); }
    finally { setLoading(false); }
  }

  return <div className="container-shell py-10 space-y-7">
    <div><p className="text-sm font-bold text-violet-700">SMARTSHOP AI · LIVE API</p>
      <h1 className="mt-2 text-3xl font-black">AI Product Generator · AI商品文案生成</h1>
      <p className="mt-3 text-slate-600">Админд зориулсан AI контент үүсгэгч. API түлхүүр тохируулаагүй үед контент зохиомлоор үүсгэхгүй. Үүсгэсэн текстийг нийтлэхээс өмнө шалгана.</p></div>
    <div className="grid gap-6 md:grid-cols-2">
      <section className="space-y-4 rounded-2xl border bg-white p-6">
        <label className="block text-sm font-medium">Product name<input className="mt-2 w-full rounded-lg border p-3" maxLength={120} value={name} onChange={e => setName(e.target.value)} /></label>
        <label className="block text-sm font-medium">Category<input className="mt-2 w-full rounded-lg border p-3" maxLength={100} value={category} onChange={e => setCategory(e.target.value)} /></label>
        <label className="block text-sm font-medium">Features<textarea className="mt-2 w-full rounded-lg border p-3" rows={3} maxLength={1800} value={features} onChange={e => setFeatures(e.target.value)} /></label>
        <label className="block text-sm font-medium">Target audience<input className="mt-2 w-full rounded-lg border p-3" maxLength={400} value={audience} onChange={e => setAudience(e.target.value)} /></label>
        <label className="block text-sm font-medium">Verified specifications<textarea className="mt-2 w-full rounded-lg border p-3" rows={2} maxLength={1200} value={specifications} onChange={e => setSpecifications(e.target.value)} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium">Language<select className="mt-2 w-full rounded-lg border p-3" value={language} onChange={e => setLanguage(e.target.value as typeof language)}><option value="zh">中文</option><option value="mn">Монгол</option><option value="en">English</option></select></label>
          <label className="block text-sm font-medium">Tone<select className="mt-2 w-full rounded-lg border p-3" value={tone} onChange={e => setTone(e.target.value as typeof tone)}><option value="professional">Professional</option><option value="friendly">Friendly</option><option value="premium">Premium</option></select></label>
        </div>
        <button type="button" disabled={loading || name.trim().length < 2 || features.trim().length < 3} onClick={generate} className="w-full rounded-xl bg-violet-700 px-5 py-3 font-bold text-white disabled:opacity-50">{loading ? "Generating…" : "Generate with AI"}</button>
      </section>
      <section className="rounded-2xl border bg-white p-6 space-y-4">
        <h2 className="font-bold">Generated content</h2>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        {output ? <><textarea aria-label="Edit generated content" className="min-h-80 w-full rounded-lg border p-3 text-sm leading-7" value={output} onChange={e => setOutput(e.target.value)} /><button type="button" className="rounded-lg border px-4 py-2 text-sm" onClick={() => navigator.clipboard?.writeText(output)}>Copy text</button></> : <p className="text-sm text-slate-500">Generated text will appear here when a configured AI provider responds successfully.</p>}
      </section>
    </div>
    <Link href="/admin" className="inline-block text-sm font-bold text-violet-700">← Admin dashboard</Link>
  </div>;
}
