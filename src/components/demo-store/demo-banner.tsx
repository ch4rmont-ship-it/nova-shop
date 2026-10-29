import Link from "next/link";
import {FlaskConical,ShoppingCart,ArrowLeft} from "lucide-react";
import {demoLabels} from "@/lib/demo/catalog";
import type {Locale} from "@/lib/i18n";
import {DemoCartLink} from "./demo-cart-link";
export function DemoBanner({locale}:{locale:Locale}){
 const s=demoLabels[locale];
 return <div className="border-b border-amber-200 bg-amber-50"><div className="container-shell flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-amber-950"><span className="flex items-center gap-2 font-bold"><FlaskConical size={16}/>{s.demo} · {s.fiction}</span><div className="flex items-center gap-4"><Link href="/demo" className="inline-flex items-center gap-1 font-bold"><ArrowLeft size={14}/>中文 Demo</Link><DemoCartLink locale={locale}/></div></div></div>;
}
