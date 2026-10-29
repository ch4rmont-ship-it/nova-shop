import type {Product} from "@/types";
import type {Locale} from "@/lib/i18n";
import {ProductCard} from "./product-card";
const empty={mn:["Бараа олдсонгүй","Хайлт болон шүүлтүүрээ өөрчилж үзээрэй."],zh:["暂无商品","请调整搜索条件或筛选项。"],en:["No products found","Try changing your search or filters."]} as const;
export function ProductGrid({products,locale="mn"}:{products:Product[];locale?:Locale}){
 if(!products.length)return <div className="surface p-12 text-center"><h3 className="text-lg font-bold">{empty[locale][0]}</h3><p className="muted mt-2 text-sm">{empty[locale][1]}</p></div>;
 return <div className="grid-auto">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div>;
}
