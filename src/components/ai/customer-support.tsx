"use client";
import { useState } from "react";
import Link from "next/link";
import { Bot, Send, RotateCcw, ShoppingBag, ShieldCheck } from "lucide-react";
type Language="mn"|"zh"|"en";
type Intent="products"|"price"|"stock"|"shipping"|"returns"|"order";
type Item={name:string;slug:string;price:string;availability:string;id:string};
type Message={role:"assistant"|"user";content:string;products?:Item[];error?:boolean};
const labels={
 mn:{title:"Ухаалаг хэрэглэгчийн үйлчилгээ",status:"Дүрэмд суурилсан туслах · AI хараахан холбогдоогүй",start:"Сайн байна уу! Дэлгүүрийн бараа, үнэ, үлдэгдэл эсвэл захиалгын талаар асуугаарай.",placeholder:"Асуултаа бичих...",send:"Илгээх",reset:"Шинэ яриа",empty:"Каталог одоогоор хоосон байж болно. Хариулт бодит өгөгдөлд үндэслэнэ.",error:"Сүлжээний алдаа гарлаа. Дахин оролдоно уу.",buttons:["Бараа","Үнэ","Нөөц","Хүргэлт","Буцаалт","Захиалга"]},
 zh:{title:"智能客服",status:"规则式客服 · 尚未连接实时AI",start:"您好！您可以咨询商品、价格、库存、配送或订单。",placeholder:"请输入您的问题...",send:"发送",reset:"清空对话",empty:"商品目录可能为空，所有商品回答仅基于真实数据。",error:"请求失败，请重试。",buttons:["商品","价格","库存","配送","退货","订单"]},
 en:{title:"Smart Customer Service",status:"Rule-based assistant · Live AI not connected",start:"Hi! Ask about products, prices, inventory, shipping or orders.",placeholder:"Ask a question...",send:"Send",reset:"New chat",empty:"The catalog may be empty. Product facts come only from actual store data.",error:"Request failed. Please try again.",buttons:["Products","Price","Stock","Shipping","Returns","Order"]}
} as const;
const intents:Intent[]=["products","price","stock","shipping","returns","order"];
export function CustomerSupport(){
 const [language,setLanguage]=useState<Language>("zh");
 const [draft,setDraft]=useState("");
 const [messages,setMessages]=useState<Message[]>([]);
 const [busy,setBusy]=useState(false);
 const t=labels[language];
 async function send(question:string,intent:"auto"|Intent="auto"){
  if(busy || !question.trim())return;
  setDraft("");
  setMessages(prev=>[...prev,{role:"user",content:question}]);
  setBusy(true);
  try{
   const res=await fetch("/api/support",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:question,language,intent})});
   const data: {reply?:string;products?:Item[];error?:string}=await res.json();
   if(!res.ok)throw new Error(data.error||t.error);
   setMessages(prev=>[...prev,{role:"assistant",content:data.reply||t.error,products:data.products}]);
  }catch(e){setMessages(prev=>[...prev,{role:"assistant",content:e instanceof Error?e.message:t.error,error:true}]);}
  finally{setBusy(false);}
 }
 return <div className="mx-auto max-w-5xl space-y-6">
  <div className="rounded-3xl bg-gradient-to-r from-indigo-950 to-violet-800 p-7 text-white sm:p-10"><div className="flex items-center gap-3"><Bot size={34}/><p className="text-xs font-bold tracking-widest text-indigo-200">SMARTSHOP AI · CUSTOMER SERVICE</p></div><h1 className="mt-4 text-3xl font-black">{t.title}</h1><p className="mt-3 text-sm text-indigo-100">{t.status}</p></div>
  <div className="flex flex-wrap items-center justify-between gap-3"><label className="text-sm font-semibold">Language / 语言 <select className="ml-3 rounded-lg border bg-white px-3 py-2" value={language} onChange={e=>setLanguage(e.target.value as Language)}><option value="zh">中文</option><option value="mn">Монгол</option><option value="en">English</option></select></label><button onClick={()=>{setMessages([]);setDraft("");}} className="inline-flex gap-2 rounded-lg border bg-white px-4 py-2 text-sm"><RotateCcw size={16}/>{t.reset}</button></div>
  <div className="rounded-3xl border bg-white p-4 sm:p-7"><div aria-live="polite" aria-relevant="additions" className="h-[370px] space-y-4 overflow-y-auto pr-1">
    <div className="max-w-[90%] whitespace-pre-wrap rounded-2xl bg-indigo-50 p-4 text-sm leading-7 text-indigo-950">{t.start}</div>
    {messages.map((m,i)=><div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}><div className={`max-w-[90%] rounded-2xl p-4 text-sm leading-7 ${m.role==="user"?"bg-indigo-700 text-white":m.error?"bg-red-50 text-red-700":"bg-slate-100 text-slate-800"}`}><p className="whitespace-pre-wrap">{m.content}</p>{Boolean(m.products?.length)&&<div className="mt-3 grid gap-2">{m.products?.map(p=><Link href={`/product/${p.slug}`} key={p.id} className="rounded-lg border border-indigo-100 bg-white p-3 text-slate-900 hover:border-indigo-400"><span className="flex gap-2 font-semibold"><ShoppingBag size={15}/>{p.name}</span><span className="mt-1 block text-xs">{p.price} · {p.availability}</span></Link>)}</div>}</div></div>)}
    {busy&&<p className="text-sm text-slate-500" role="status">...</p>}
  </div><div className="mt-5 flex flex-wrap gap-2">{intents.map((intent,i)=><button disabled={busy} key={intent} className="rounded-full border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-800 disabled:opacity-50" onClick={()=>send(t.buttons[i],intent)}>{t.buttons[i]}</button>)}</div>
   <form className="mt-5 flex gap-2" onSubmit={e=>{e.preventDefault();void send(draft);}}><label htmlFor="support-question" className="sr-only">Question</label><input id="support-question" maxLength={500} value={draft} onChange={e=>setDraft(e.target.value)} placeholder={t.placeholder} className="min-w-0 flex-1 rounded-xl border p-3 outline-indigo-500"/><button disabled={busy||!draft.trim()} className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white disabled:opacity-50"><Send size={17}/><span className="hidden sm:inline">{t.send}</span></button></form>
  </div><p className="flex gap-2 text-xs leading-6 text-slate-500"><ShieldCheck size={17} className="shrink-0"/> {t.empty} Хувийн захиалгын мэдээлэл чатад харагдахгүй; энэ хуудсан дахь яриа серверт хадгалагдахгүй.</p>
 </div>;
}
