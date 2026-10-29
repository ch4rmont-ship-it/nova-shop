"use client";
import {useState} from "react";
import Link from "next/link";
import {Clipboard,Info,Sparkles} from "lucide-react";
import {type Locale} from "@/lib/i18n";
const tr={
 mn:{title:"AI контентын студи",intro:"Барааны мэдээлэл оруулж, серверийн AI API холбогдсоны дараа контент үүсгэнэ. Одоогоор API key идэвхгүй; дүрмийн загварыг бодит AI гэж харуулахгүй.",name:"Барааны нэр",features:"Баталгаатай онцлог",audience:"Зорилтот хэрэглэгч",language:"Контентын хэл",generate:"AI контент үүсгэх",busy:"AI хүсэлт илгээж байна...",result:"Үүсгэсэн контент",copy:"Хуулах",empty:"Барааныхаа мэдээллийг оруулна уу.",review:"AI-ийн бичсэн мэдээллийг нийтлэхээс өмнө гараар шалгана.",offline:"AI API холбогдоогүй байна. Үүсгэгч дараа нь идэвхжинэ.",back:"Админ самбар"},
 zh:{title:"AI 商品文案工作台",intro:"填写真实商品资料。接入服务器端AI API密钥后才能生成内容。目前不把模板冒充AI。",name:"商品名称",features:"经核实的产品特点",audience:"目标客户",language:"输出语言",generate:"生成AI文案",busy:"正在请求AI...",result:"生成内容",copy:"复制",empty:"请先填写商品资料。",review:"发布前必须人工审核全部AI内容。",offline:"AI API尚未接入，生成器将在最后阶段启用。",back:"返回管理后台"},
 en:{title:"AI Product Studio",intro:"Enter verified product facts. Real AI generation requires a server-side key, which will be connected last. Templates are not presented as AI.",name:"Product name",features:"Verified features",audience:"Target audience",language:"Output language",generate:"Generate with AI",busy:"Requesting AI...",result:"Generated content",copy:"Copy",empty:"Enter the product details to begin.",review:"Review every AI claim before publishing.",offline:"AI API is not connected yet. Generation will be enabled at the final stage.",back:"Back to dashboard"}
} as const;
export function ProductStudio({locale}:{locale:Locale}){
 const l=tr[locale];
 const [name,setName]=useState("");
 const [features,setFeatures]=useState("");
 const [audience,setAudience]=useState("");
 const [language,setLanguage]=useState<"中文"|"Монгол"|"English">(locale==="zh"?"中文":locale==="en"?"English":"Монгол");
 const [result,setResult]=useState("");
 const [error,setError]=useState("");
 const [loading,setLoading]=useState(false);
 async function generate(){
  setError("");setResult("");setLoading(true);
  try{
   const response=await fetch("/api/ai/product-copy",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,features,audience,language})});
   const data=await response.json() as {content?:string;error?:string};
   if(!response.ok)throw new Error(response.status===503?l.offline:data.error||"AI request failed");
   setResult(data.content||"");
  }catch(e){setError(e instanceof Error?e.message:"Unable to generate");}
  finally{setLoading(false);}
 }
 return <main className="container-shell space-y-7 py-10"><div><p className="brand-eyebrow">SMARTSHOP AI / CONTENT STUDIO</p><h1 className="mt-3 text-3xl font-black">{l.title}</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{l.intro}</p></div>
  <p className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><Info size={17}/>{l.offline}</p>
  <div className="grid gap-5 lg:grid-cols-2"><section className="space-y-4 rounded-3xl border bg-white p-6"><label className="block text-sm font-semibold">{l.name}<input maxLength={120} value={name} onChange={e=>setName(e.target.value)} className="input mt-2"/></label><label className="block text-sm font-semibold">{l.features}<textarea maxLength={1500} rows={5} value={features} onChange={e=>setFeatures(e.target.value)} className="input mt-2"/></label><label className="block text-sm font-semibold">{l.audience}<input maxLength={200} value={audience} onChange={e=>setAudience(e.target.value)} className="input mt-2"/></label><label className="block text-sm font-semibold">{l.language}<select value={language} onChange={e=>setLanguage(e.target.value as typeof language)} className="input mt-2"><option>中文</option><option>Монгол</option><option>English</option></select></label><button type="button" disabled={loading||name.trim().length<2||features.trim().length<3} onClick={()=>void generate()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-700 p-3 font-bold text-white disabled:opacity-40"><Sparkles size={18}/>{loading?l.busy:l.generate}</button></section><section className="rounded-3xl border bg-white p-6"><h2 className="text-lg font-black">{l.result}</h2>{error&&<p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}{result?<><p className="mt-4 text-xs text-amber-800">{l.review}</p><textarea rows={14} value={result} onChange={e=>setResult(e.target.value)} className="input mt-4 w-full leading-7" aria-label={l.result}/><button type="button" onClick={()=>void navigator.clipboard?.writeText(result)} className="mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold"><Clipboard size={16}/>{l.copy}</button></>:!error&&<p className="mt-5 text-sm text-slate-500">{l.empty}</p>}</section></div><Link href="/admin" className="inline-block text-sm font-bold text-indigo-700">← {l.back}</Link>
 </main>;
}
