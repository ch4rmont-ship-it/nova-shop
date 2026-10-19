"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductGrid } from "./product-grid";
import type { Category, Product } from "@/types";

export function ShopClient({ products, categories, initialQuery = "", initialSort = "newest" }: { products: Product[]; categories: Category[]; initialQuery?: string; initialSort?: string }) {
  const [query,setQuery]=useState(initialQuery);
  const [category,setCategory]=useState("all");
  const [stock,setStock]=useState("all");
  const [sort,setSort]=useState(initialSort);
  const [maxPrice,setMaxPrice]=useState(250);
  const [drawer,setDrawer]=useState(false);
  const [visible,setVisible]=useState(12);
  useEffect(()=>setVisible(12),[query,category,stock,sort,maxPrice]);
  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    const result=products.filter((p)=>(!q || `${p.name} ${p.description} ${p.shortDescription}`.toLowerCase().includes(q)) && (category==="all"||p.categoryId===category) && (stock==="all"||(stock==="in"?p.stock>0:p.stock===0)) && ((p.salePriceCents ?? p.priceCents)/100<=maxPrice));
    result.sort((a,b)=> sort==="price-asc" ? (a.salePriceCents??a.priceCents)-(b.salePriceCents??b.priceCents) : sort==="price-desc" ? (b.salePriceCents??b.priceCents)-(a.salePriceCents??a.priceCents) : sort==="rating" ? b.rating-a.rating : sort==="popular" ? b.reviewCount-a.reviewCount : +new Date(b.createdAt)-+new Date(a.createdAt));
    return result;
  },[products,query,category,stock,sort,maxPrice]);

  const filters=<div className="space-y-6"><div><label className="label">Category</label><select className="input" value={category} onChange={(e)=>setCategory(e.target.value)}><option value="all">All categories</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label className="label">Availability</label><select className="input" value={stock} onChange={(e)=>setStock(e.target.value)}><option value="all">All products</option><option value="in">In stock</option><option value="out">Out of stock</option></select></div><div><label className="label">Max price · ${maxPrice}</label><input className="w-full accent-[#1f4d3a]" type="range" min="25" max="250" step="5" value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value))}/></div><button className="text-sm font-bold underline underline-offset-4" onClick={()=>{setQuery("");setCategory("all");setStock("all");setMaxPrice(250)}}>Reset filters</button></div>;
  return <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
    <aside className="hidden lg:block">{filters}</aside>
    <div><div className="mb-6 flex flex-col gap-3 sm:flex-row"><><input className="input" list="product-suggestions" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search products..."/><datalist id="product-suggestions">{products.slice(0,30).map((p)=><option key={p.id} value={p.name}/>)}</datalist></><select className="input sm:max-w-[220px]" value={sort} onChange={(e)=>setSort(e.target.value)}><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="popular">Most popular</option><option value="rating">Highest rated</option></select><button className="btn-secondary lg:hidden" onClick={()=>setDrawer(true)}><SlidersHorizontal size={16}/> Filters</button></div><p className="muted mb-5 text-sm">{filtered.length} products</p><ProductGrid products={filtered.slice(0,visible)}/>{visible<filtered.length?<div className="mt-8 text-center"><button className="btn-secondary" onClick={()=>setVisible(v=>v+12)}>Load more</button></div>:null}</div>
    {drawer?<div className="fixed inset-0 z-50 bg-black/30 lg:hidden" onClick={()=>setDrawer(false)}><div className="ml-auto h-full w-[88%] max-w-sm bg-[#f7f5f0] p-6" onClick={(e)=>e.stopPropagation()}><div className="mb-8 flex items-center justify-between"><h2 className="text-xl font-bold">Filters</h2><button onClick={()=>setDrawer(false)} aria-label="Close filters"><X/></button></div>{filters}</div></div>:null}
  </div>;
}
