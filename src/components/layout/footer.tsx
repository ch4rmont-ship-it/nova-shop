import Link from "next/link";
import {ArrowUpRight, Bot, Code2, Layers3, Sparkles} from "lucide-react";
const store=[["Бүтээгдэхүүн","/shop"],["Сагс","/cart"],["Профайл","/account"],["Хэрэглэгчийн туслах","/support"]];
const business=[["Dashboard","/admin"],["AI Product Studio","/ai-studio"],["Analytics","/admin/analytics"],["Product Selection","/admin/product-selection"],["Marketing","/admin/marketing"]];
const about=[["Үнийн загвар","/pricing"],["中文 Demo","/demo"],["GitHub repository","https://github.com/ch4rmont-ship-it/nova-shop"]];
export function Footer(){return <footer className="bg-[#0b1025] text-white">
 <div className="container-shell grid gap-10 py-16 lg:grid-cols-[1.65fr_1fr_1fr_1fr]">
  <div><Link href="/" className="inline-flex items-center gap-3 text-xl font-black"><span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600"><Sparkles size={23}/></span>SmartShop <span className="-ml-2 text-violet-300">AI</span></Link><p className="mt-5 max-w-sm text-sm leading-8 text-slate-400">一个人，也能运营一家智能电商公司。Онлайн худалдаа болон бизнесийн ухаалаг удирдлагын нэгдсэн платформ.</p><p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-[11px] text-slate-300"><ShieldCheck size={14}/> Demo / Live AI status clearly labeled</p></div>
  <div><p className="text-sm font-bold text-white">Marketplace</p><div className="mt-5 grid gap-3">{store.map(([n,h])=><Link className="text-sm text-slate-400 hover:text-white" href={h} key={h}>{n}</Link>)}</div></div>
  <div><p className="text-sm font-bold text-white">Smart workspace</p><div className="mt-5 grid gap-3">{business.map(([n,h])=><Link className="text-sm text-slate-400 hover:text-white" href={h} key={h}>{n}</Link>)}</div></div>
  <div><p className="text-sm font-bold text-white">Project</p><div className="mt-5 grid gap-3">{about.map(([n,h])=><Link className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white" href={h} key={h}>{n}{h.startsWith("https:")?<ArrowUpRight size={13}/>:null}</Link>)}</div><div className="mt-6 flex gap-2 text-indigo-300"><Layers3 size={17}/><Bot size={17}/><Code2 size={17}/></div></div>
 </div>
 <div className="border-t border-white/10"><div className="container-shell flex flex-col gap-2 py-6 text-xs text-slate-500 sm:flex-row sm:justify-between"><span>© 2026 SmartShop AI · University startup project</span><span>Demo functions and real transaction data are labeled separately.</span></div></div>
 </footer>;}
