"use client";
import Link from "next/link";
import { useStore } from "@/components/store-provider";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/types";
export function FavoritesClient({products}:{products:Product[]}){const{favorites}=useStore();const liked=products.filter(p=>favorites.includes(p.id));return <>{liked.length?<ProductGrid products={liked}/>:<div className="surface px-6 py-14 text-center"><div className="mx-auto grid size-16 place-items-center rounded-full bg-[#edf1ed] text-3xl text-[#1f4d3a]">♡</div><h2 className="mt-5 text-xl font-bold">Өөрийн сонголтоо бүрдүүлээрэй.</h2><p className="muted mx-auto mt-3 max-w-sm text-sm leading-6">Бараан дээрх зүрхийг дарвал энд хадгалагдана. Дараа нь эргэж олоход амархан.</p><Link className="btn-primary mt-6 text-sm" href="/shop">Бараа сонирхох</Link></div>}</>}
