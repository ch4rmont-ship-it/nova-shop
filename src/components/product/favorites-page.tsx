"use client";
import Link from "next/link";
import { useStore } from "@/components/store-provider";
import { ProductGrid } from "@/components/product/product-grid";
import type { Product } from "@/types";
export function FavoritesClient({products}:{products:Product[]}){const{favorites}=useStore();const liked=products.filter(p=>favorites.includes(p.id));return <>{liked.length?<ProductGrid products={liked}/>:<div className="surface p-12 text-center"><h2 className="text-2xl font-black">Nothing saved yet</h2><p className="muted mt-2">Tap the heart on a product to keep it here.</p><Link className="btn-primary mt-6" href="/shop">Discover products</Link></div>}</>}
