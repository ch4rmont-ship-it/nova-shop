"use client";
import {SlidersHorizontal,Search,X} from "lucide-react";
import {useMemo,useState} from "react";
import {ProductGrid} from "./product-grid";
import {formatMoney} from "@/lib/utils";
import type {Category,Product} from "@/types";
import type {Locale} from "@/lib/i18n";

const words={
 mn:{filters:"Нэмэлт шүүлтүүр",close:"Шүүлтүүр хаах",category:"Ангилал",allCategories:"Бүх ангилал",status:"Барааны төлөв",all:"Бүгд",stock:"Бэлэн",preorder:"Захиалгаар",out:"Дууссан",max:"Дээд үнэ",clear:"Шүүлтүүр цэвэрлэх",search:"Нэр, брэндээр хайх",sort:"Эрэмбэлэх",newest:"Шинээр нэмэгдсэн",asc:"Үнэ: багаас их",desc:"Үнэ: ихээс бага",popular:"Онцлох",count:"бараа",more:"Цааш үзэх"},
 zh:{filters:"更多筛选",close:"收起筛选",category:"分类",allCategories:"全部分类",status:"库存状态",all:"全部",stock:"现货",preorder:"预购",out:"缺货",max:"最高价格",clear:"清除筛选",search:"搜索商品或品牌",sort:"排序",newest:"最新上架",asc:"价格从低到高",desc:"价格从高到低",popular:"精选",count:"件商品",more:"加载更多"},
 en:{filters:"More filters",close:"Hide filters",category:"Categories",allCategories:"All products",status:"Availability",all:"All",stock:"In stock",preorder:"Preorder",out:"Out of stock",max:"Maximum price",clear:"Clear filters",search:"Search products or brands",sort:"Sort by",newest:"Newest",asc:"Price: low to high",desc:"Price: high to low",popular:"Featured",count:"products",more:"Show more"}
} as const;

export function ShopClient({products,categories,initialQuery="",initialSort="newest",locale="mn"}:{products:Product[];categories:Category[];initialQuery?:string;initialSort?:string;locale?:Locale}){
 const s=words[locale];
 const ceiling=Math.max(100000,...products.map(p=>Math.ceil((p.salePriceCents??p.priceCents)/100/5000)*5000));
 const [query,setQuery]=useState(initialQuery);
 const [category,setCategory]=useState("all");
 const [stock,setStock]=useState("all");
 const [sort,setSort]=useState(initialSort);
 const [maxPrice,setMaxPrice]=useState(ceiling);
 const [show,setShow]=useState(false);
 const [visible,setVisible]=useState(16);

 const filtered=useMemo(()=>{
  const q=query.trim().toLowerCase();
  return products.filter(p=>
   (!q||[p.brand,p.name,p.description,...(p.searchTerms||[])].join(" ").toLowerCase().includes(q))
   &&(category==="all"||p.categoryId===category)
   &&(stock==="all"||(stock==="in"?p.stock>0:stock==="preorder"?p.preorder:!p.preorder&&p.stock===0))
   &&(p.salePriceCents??p.priceCents)<=maxPrice*100
  ).sort((a,b)=>sort==="price-asc"?(a.salePriceCents??a.priceCents)-(b.salePriceCents??b.priceCents):sort==="price-desc"?(b.salePriceCents??b.priceCents)-(a.salePriceCents??a.priceCents):sort==="popular"?Number(b.bestseller)-Number(a.bestseller):+new Date(b.createdAt)-+new Date(a.createdAt));
 },[products,query,category,stock,sort,maxPrice]);

 function clear(){
  setQuery("");setCategory("all");setStock("all");setMaxPrice(ceiling);setVisible(16);
 }
 return <div className="shop-layout">
  <div className="shop-results">
   <div className="surface flex flex-col gap-4 p-4 sm:p-5">
    <div className="flex flex-wrap items-center gap-3">
     <label className="relative min-w-[180px] flex-[2_1_320px]">
      <span className="sr-only">{s.search}</span>
      <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
      <input className="input w-full pl-11 text-sm" placeholder={s.search} value={query} onChange={e=>{setQuery(e.target.value);setVisible(16);}}/>
     </label>
     <select aria-label={s.sort} className="input min-w-0 flex-[1_1_190px] text-sm sm:max-w-60" value={sort} onChange={e=>setSort(e.target.value)}>
      <option value="newest">{s.newest}</option>
      <option value="price-asc">{s.asc}</option>
      <option value="price-desc">{s.desc}</option>
      <option value="popular">{s.popular}</option>
     </select>
     <button type="button" aria-controls="catalog-advanced-filters" className="btn-secondary shrink-0 text-sm" onClick={()=>setShow(v=>!v)} aria-expanded={show}>
      {show?<X size={16}/>:<SlidersHorizontal size={16}/>}
      {show?s.close:s.filters}
     </button>
     <p role="status" className="ml-auto whitespace-nowrap text-sm font-bold text-indigo-700">{filtered.length} {s.count}</p>
    </div>
    <nav aria-label={s.category} className="flex w-full gap-2 overflow-x-auto pb-1">
     {[{id:"all",name:s.allCategories},...categories].map(c=><button type="button" key={c.id} onClick={()=>{setCategory(c.id);setVisible(16);}} aria-pressed={category===c.id} className={"shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-xs font-bold transition "+(category===c.id?"border-indigo-700 bg-indigo-700 text-white":"border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700")}>{c.name}</button>)}
    </nav>
    {show&&<aside id="catalog-advanced-filters" className="shop-filters grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] lg:items-end">
     <label className="block">
      <span className="label">{s.status}</span>
      <select className="input text-sm" value={stock} onChange={e=>{setStock(e.target.value);setVisible(16);}}>
       <option value="all">{s.all}</option><option value="in">{s.stock}</option><option value="preorder">{s.preorder}</option><option value="out">{s.out}</option>
      </select>
     </label>
     <label className="block">
      <span className="label">{s.max}: {formatMoney(maxPrice*100)}</span>
      <input aria-label={s.max} className="mt-3 w-full accent-indigo-600" type="range" min={0} max={ceiling} step={5000} value={maxPrice} onChange={e=>{setMaxPrice(Number(e.target.value));setVisible(16);}}/>
     </label>
     <button type="button" onClick={clear} className="btn-secondary text-sm">{s.clear}</button>
    </aside>}
   </div>
   <div className="mt-6">
    <ProductGrid locale={locale} products={filtered.slice(0,visible)}/>
   </div>
   {visible<filtered.length&&<button className="btn-secondary mt-6 w-full" onClick={()=>setVisible(n=>n+16)}>{s.more}</button>}
  </div>
 </div>;
}
