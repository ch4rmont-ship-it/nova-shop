"use client";
import {useEffect,useState} from "react";
import {Clipboard,FileText,Megaphone,Save,Trash2,WandSparkles} from "lucide-react";
import {t,type Locale} from "@/lib/i18n";
type SavedDraft={id:string;name:string;channel:string;text:string;created:string};
type Template="intro"|"launch"|"question";
const copy={
 mn:{product:"Барааны нэр",audience:"Зорилтот хэрэглэгч",facts:"Баталгаатай онцлог / мэдээлэл",channel:"Суваг",template:"Контентын загвар",cta:"Уриалах үйлдэл",generate:"Ноорог үүсгэх",output:"Маркетингийн ноорог",save:"Энэ браузерт хадгалах",copy:"Хуулах",saved:"Хадгалсан нооргууд",none:"Хадгалсан ноорог алга",delete:"Устгах",loaded:"Ачаалах",intro:"Танилцуулга",launch:"Шинээр танилцуулах",question:"Асуулт / сонирхол",preview:"Энэ нь дүрмийн загвар бөгөөд AI генераци биш. Үнэ, хүргэлт, баталгаа, нөөцийн тухай баталгаагүй мэдэгдэл нэмэхгүй.",local:"Ноорог зөвхөн энэ браузерт хадгалагдана. Нийтийн компьютерт хувийн мэдээлэл оруулахгүй.",required:"Барааны нэр оруулна уу.",placeholder:"Жишээ: USB-C цэнэглэлт, 3 горим (баталгаатай бол)",ctaDefault:"Дэлгэрэнгүй мэдээллийг бүтээгдэхүүний хуудаснаас хараарай."},
 zh:{product:"商品名称",audience:"目标客户",facts:"经核实的商品特点",channel:"营销渠道",template:"内容类型",cta:"行动引导",generate:"生成模板草稿",output:"营销文案草稿",save:"保存到此浏览器",copy:"复制",saved:"已保存的草稿",none:"暂无保存的草稿",delete:"删除",loaded:"载入",intro:"商品介绍",launch:"新品介绍",question:"互动问答",preview:"这是规则模板演示，不是实时AI生成。不会编造价格、配送、库存或保证。",local:"草稿只保存在当前浏览器，请勿在公共设备输入敏感数据。",required:"请输入商品名称。",placeholder:"例如：USB-C充电、三档亮度（需核实）",ctaDefault:"请前往商品页面查看已核实的详情。"},
 en:{product:"Product name",audience:"Target audience",facts:"Verified product features",channel:"Channel",template:"Template",cta:"Call to action",generate:"Generate template draft",output:"Marketing draft",save:"Save in this browser",copy:"Copy",saved:"Saved drafts",none:"No saved drafts",delete:"Delete",loaded:"Load",intro:"Product introduction",launch:"New arrival",question:"Question / engagement",preview:"This is a deterministic template, not live AI. Prices, shipping, inventory and guarantees are never invented.",local:"Drafts stay only in this browser. Avoid sensitive data on shared devices.",required:"Enter a product name.",placeholder:"e.g. USB-C charging, three modes (only if verified)",ctaDefault:"Check the product page for verified details."}
} as const;
const STORAGE="smartshop_marketing_drafts_v1";
function draftText(locale:Locale,template:Template,p:string,a:string,f:string,c:string,channel:string){
 const facts=f.trim() || (locale==="zh"?"具体功能请以商品详情为准":locale==="en"?"See the product page for verified specifications.":"Баталгаатай үзүүлэлтүүдийг барааны дэлгэрэнгүйгээс харна уу.");
 const audience=a.trim();
 const cta=c.trim()||copy[locale].ctaDefault;
 if(locale==="zh"){
  if(template==="launch")return "【新品介绍 · "+p+"】\n"+(audience?"为"+audience+"准备的商品介绍。":"了解这款商品。")+"\n已提供的特点："+facts+"\n"+cta+"\n渠道："+channel+"\n#新品分享 #智能购物";
  if(template==="question")return "你正在寻找「"+p+"」吗？\n"+(audience?"如果你是"+audience+"，欢迎了解商品详情。":"欢迎了解商品详情。")+"\n提供的信息："+facts+"\n"+cta+"\n渠道："+channel;
  return "【"+p+"】\n"+(audience?"适合关注"+audience+"需求的顾客了解。":"商品介绍")+"\n商品信息："+facts+"\n"+cta+"\n渠道："+channel;
 }
 if(locale==="en"){
  if(template==="launch")return "NEW PRODUCT SPOTLIGHT: "+p+"\n"+(audience?"For people interested in "+audience+".\n":"")+"Verified input: "+facts+"\n"+cta+"\nChannel: "+channel;
  if(template==="question")return "Looking into "+p+"?\n"+(audience?"Exploring options for "+audience+"?\n":"")+"Provided information: "+facts+"\n"+cta+"\nChannel: "+channel;
  return p+"\n"+(audience?"Audience: "+audience+"\n":"")+"Provided product facts: "+facts+"\n"+cta+"\nChannel: "+channel;
 }
 if(template==="launch")return "ШИНЭ ТАНИЛЦУУЛГА: "+p+"\n"+(audience?"Хэнд: "+audience+"\n":"")+"Баталгаажуулсан мэдээлэл: "+facts+"\n"+cta+"\nСуваг: "+channel;
 if(template==="question")return p+"-ийг сонирхож байна уу?\n"+(audience?"Хэрэглэгчид: "+audience+"\n":"")+"Мэдээлэл: "+facts+"\n"+cta+"\nСуваг: "+channel;
 return "【"+p+"】\n"+(audience?"Зорилтот хэрэглэгч: "+audience+"\n":"")+"Онцлог: "+facts+"\n"+cta+"\nСуваг: "+channel;
}
export function MarketingStudio({locale}:{locale:Locale}){
 const l=copy[locale];
 const [product,setProduct]=useState("");
 const [audience,setAudience]=useState("");
 const [facts,setFacts]=useState("");
 const [channel,setChannel]=useState("Facebook");
 const [template,setTemplate]=useState<Template>("intro");
 const [cta,setCta]=useState("");
 const [draft,setDraft]=useState("");
 const [saved,setSaved]=useState<SavedDraft[]>([]);
 const [ready,setReady]=useState(false);
 useEffect(()=>{try{const parsed=JSON.parse(localStorage.getItem(STORAGE)||"[]");if(Array.isArray(parsed))setSaved(parsed.filter(x=>x && typeof x.id==="string"&&typeof x.text==="string").slice(0,15));}catch{}setReady(true);},[]);
 const generate=()=>{if(product.trim())setDraft(draftText(locale,template,product.trim(),audience,facts,cta,channel));};
 const save=()=>{if(!draft.trim())return;const newDraft:SavedDraft={id:crypto.randomUUID(),name:product.trim()||"Draft",channel,text:draft.slice(0,5000),created:new Date().toISOString()};const next=[newDraft,...saved].slice(0,15);try{localStorage.setItem(STORAGE,JSON.stringify(next));setSaved(next);}catch{}};
 const remove=(id:string)=>{const next=saved.filter(d=>d.id!==id);try{localStorage.setItem(STORAGE,JSON.stringify(next));setSaved(next);}catch{}};
 return <div className="space-y-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="brand-eyebrow">SMARTSHOP AI · MARKETING</p><h1 className="mt-2 text-3xl font-black">{t(locale,"marketingTitle")}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{l.preview}</p></div><span className="grid size-14 place-items-center rounded-2xl bg-violet-100 text-violet-700"><Megaphone size={26}/></span></div><p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900">TEMPLATE DEMO / 非AI生成 / Бодит AI биш</p>
 <div className="grid gap-5 xl:grid-cols-2"><section className="rounded-3xl border bg-white p-5 sm:p-7"><h2 className="text-lg font-black">{locale==="zh"?"创建营销内容":locale==="en"?"Campaign inputs":"Контентын тохиргоо"}</h2><div className="mt-6 grid gap-4">
  <label className="text-sm font-semibold">{l.product}<input maxLength={120} value={product} onChange={e=>setProduct(e.target.value)} className="input mt-2" required/></label>
  <label className="text-sm font-semibold">{l.audience}<input maxLength={200} value={audience} onChange={e=>setAudience(e.target.value)} className="input mt-2"/></label>
  <label className="text-sm font-semibold">{l.facts}<textarea maxLength={1200} rows={3} value={facts} onChange={e=>setFacts(e.target.value)} placeholder={l.placeholder} className="input mt-2"/></label>
  <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">{l.channel}<select className="input mt-2" value={channel} onChange={e=>setChannel(e.target.value)}>{["Facebook","Instagram","小红书","微信"].map(x=><option key={x}>{x}</option>)}</select></label><label className="text-sm font-semibold">{l.template}<select className="input mt-2" value={template} onChange={e=>setTemplate(e.target.value as Template)}><option value="intro">{l.intro}</option><option value="launch">{l.launch}</option><option value="question">{l.question}</option></select></label></div>
  <label className="text-sm font-semibold">{l.cta}<input maxLength={200} value={cta} onChange={e=>setCta(e.target.value)} placeholder={l.ctaDefault} className="input mt-2"/></label><button type="button" disabled={!product.trim()} onClick={generate} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white disabled:opacity-40"><WandSparkles size={17}/>{l.generate}</button>
 </div></section><section className="rounded-3xl border bg-white p-5 sm:p-7"><div className="flex items-center justify-between gap-3"><h2 className="text-lg font-black">{l.output}</h2><span className="text-xs text-slate-400">{draft.length}/5000</span></div><textarea value={draft} onChange={e=>setDraft(e.target.value.slice(0,5000))} maxLength={5000} rows={13} aria-label={l.output} className="input mt-5 min-h-72 resize-y leading-7"/><div className="mt-4 flex flex-wrap gap-2"><button disabled={!draft.trim()} type="button" onClick={()=>void navigator.clipboard?.writeText(draft)} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold disabled:opacity-40"><Clipboard size={16}/>{l.copy}</button><button disabled={!draft.trim()||!ready} type="button" onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 disabled:opacity-40"><Save size={16}/>{l.save}</button></div><p className="mt-4 text-xs leading-6 text-slate-500">{l.local}</p></section></div>
 <section className="rounded-3xl border bg-white p-5 sm:p-7"><h2 className="flex items-center gap-2 text-lg font-black"><FileText size={20} className="text-indigo-700"/>{l.saved}</h2><div className="mt-5 grid gap-3">{saved.length?saved.map(item=><div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="min-w-0"><p className="truncate text-sm font-bold">{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.channel} · {new Date(item.created).toLocaleDateString(locale==="zh"?"zh-CN":locale==="en"?"en-US":"mn-MN")}</p></div><div className="flex gap-2"><button onClick={()=>setDraft(item.text)} className="rounded-lg border bg-white px-3 py-2 text-xs font-bold">{l.loaded}</button><button onClick={()=>remove(item.id)} aria-label={l.delete} className="rounded-lg border bg-white p-2 text-red-700"><Trash2 size={16}/></button></div></div>):<p className="text-sm text-slate-500">{l.none}</p>}</div></section></div>;
}
