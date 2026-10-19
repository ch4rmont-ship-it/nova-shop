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
    <div className="relative overflow-hidden rounded-[24px] border border-[#dedbd3] bg-white shadow-[0_12px_35px_rgba(25,31,27,.05)]">
      <Link href={`/product/${product.slug}`} className="block aspect-[4/5]"><Image src={product.images[0]} alt={product.name} fill className="object-contain p-3 transition duration-500 group-hover:scale-[1.025]" sizes="(max-width: 760px) 50vw, 25vw"/></Link>
      <div className="absolute left-3 top-3 flex gap-2">{discount ? <span className="rounded-full bg-[#171816] px-2.5 py-1 text-[10px] font-bold text-white">-{discount}%</span>:null}{product.bestseller ? <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold shadow-sm">Хит</span>:null}</div>
      <button aria-label="Хадгалах" onClick={()=>toggleFavorite(product.id)} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/95 shadow-sm"><Heart size={17} fill={favorite ? "currentColor" : "none"}/></button>
      <button aria-label="Сагсанд нэмэх" disabled={!product.preorder&&product.stock<=0} onClick={()=>addToCart(product.id)} className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-[#171816] text-white shadow-lg transition sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-40"><ShoppingBag size={17}/></button>
    </div>
    <div className="pt-3">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[.15em] text-[#6d716b]">{product.brand}</p>
      <div className="flex flex-col items-start justify-between gap-1 sm:flex-row sm:gap-3"><Link href={`/product/${product.slug}`} className="min-w-0 text-sm font-bold leading-5 hover:underline">{product.name}</Link><div className="shrink-0 text-sm font-black">{formatMoney(current)}</div></div>
      <div className="mt-1 flex items-center justify-between gap-2 text-xs text-[#6d716b]"><span>{product.preorder ? "Захиалгаар · 10–21 хоног" : product.stock > 0 ? (product.stock <= 7 ? `Үлдэгдэл ${product.stock}` : "Бэлэн") : "Дууссан"}</span>{product.reviewCount>0?<span className="flex items-center gap-1"><Star size={12} fill="currentColor"/> {product.rating.toFixed(1)}</span>:<span>Шинэ</span>}</div>
      {product.salePriceCents ? <div className="mt-1 text-xs text-[#6d716b] line-through">{formatMoney(product.priceCents)}</div>:null}
    </div>
  </article>;
}
