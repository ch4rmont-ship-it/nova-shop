"use client";
import {Heart,ShoppingBag} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";
import {useStore} from "@/components/store-provider";
import type {Locale} from "@/lib/i18n";
const labels={
 mn:{quantity:"Тоо ширхэг",add:"Сагсанд нэмэх",out:"Дууссан",order:"Захиалах",favorite:"Хадгалах",unverified:"Нөөц баталгаажаагүй"},
 zh:{quantity:"数量",add:"加入购物车",out:"缺货",order:"立即下单",favorite:"收藏",unverified:"库存尚未核实"},
 en:{quantity:"Quantity",add:"Add to cart",out:"Out of stock",order:"Order now",favorite:"Favorite",unverified:"Stock unverified"}
};
export function ProductDetailActions({productId,stock,preorder=false,isPreview=false,locale="mn"}:{productId:string;stock:number;preorder?:boolean;isPreview?:boolean;locale?:Locale}){
 const router=useRouter();const{addToCart,favorites,toggleFavorite}=useStore();const[qty,setQty]=useState(1);const fav=favorites.includes(productId);const l=labels[locale];const available=!isPreview&&(preorder||stock>0);const max=preorder?99:Math.max(1,stock);
 return <div className="space-y-3"><div className="flex items-center gap-3"><label className="text-sm font-bold">{l.quantity}</label><div className="flex items-center rounded-full border bg-white"><button type="button" aria-label="Decrease quantity" className="px-4 py-2" onClick={()=>setQty(Math.max(1,qty-1))}>−</button><span className="min-w-8 text-center text-sm font-bold">{qty}</span><button type="button" aria-label="Increase quantity" disabled={!available||qty>=max} className="px-4 py-2 disabled:opacity-40" onClick={()=>setQty(Math.min(max,qty+1))}>+</button></div></div><div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"><button type="button" disabled={!available} onClick={()=>addToCart(productId,qty)} className="btn-primary disabled:opacity-40"><ShoppingBag size={17}/>{isPreview?l.unverified:available?l.add:l.out}</button><button type="button" disabled={!available} onClick={()=>{addToCart(productId,qty);router.push("/checkout")}} className="btn-secondary disabled:opacity-40">{l.order}</button><button type="button" onClick={()=>toggleFavorite(productId)} aria-label={l.favorite} className="btn-secondary px-4"><Heart size={18} fill={fav?"currentColor":"none"}/></button></div></div>;
}
