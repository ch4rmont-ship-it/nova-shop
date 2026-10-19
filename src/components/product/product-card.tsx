"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useStore } from "@/components/store-provider";
import { discountPercent, effectivePrice, formatMoney } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, favorites, toggleFavorite } = useStore();
  const current = effectivePrice(product.priceCents, product.salePriceCents);
  const discount = discountPercent(product.priceCents, product.salePriceCents);
  const favorite = favorites.includes(product.id);
  return <article className="group min-w-0">
    <div className="relative overflow-hidden rounded-[22px] border border-[#dedbd3] bg-white">
      <Link href={`/product/${product.slug}`} className="block aspect-[4/5]"><Image src={product.images[0]} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-[1.025]" sizes="(max-width: 760px) 50vw, 25vw"/></Link>
      <div className="absolute left-3 top-3 flex gap-2">{discount ? <span className="rounded-full bg-[#171816] px-2.5 py-1 text-[10px] font-bold text-white">-{discount}%</span>:null}{product.bestseller ? <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold">Bestseller</span>:null}</div>
      <button aria-label="Toggle favorite" onClick={()=>toggleFavorite(product.id)} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 shadow-sm"><Heart size={17} fill={favorite ? "currentColor" : "none"}/></button>
      <button disabled={product.stock<=0} onClick={()=>addToCart(product.id)} className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-[#171816] text-white opacity-0 shadow-lg transition group-hover:opacity-100 disabled:opacity-40 sm:grid"><ShoppingBag size={17}/></button>
    </div>
    <div className="pt-3">
      <div className="flex items-start justify-between gap-3"><Link href={`/product/${product.slug}`} className="min-w-0 text-sm font-bold leading-5 hover:underline">{product.name}</Link><div className="shrink-0 text-sm font-bold">{formatMoney(current)}</div></div>
      <div className="mt-1 flex items-center justify-between gap-2 text-xs text-[#6d716b]"><span>{product.sku}</span><span className="flex items-center gap-1"><Star size={12} fill="currentColor"/> {product.rating.toFixed(1)}</span></div>
      {product.salePriceCents ? <div className="mt-1 text-xs text-[#6d716b] line-through">{formatMoney(product.priceCents)}</div>:null}
    </div>
  </article>;
}
