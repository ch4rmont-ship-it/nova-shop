"use client";
import {createContext,useCallback,useContext,useEffect,useMemo,useRef,useState} from "react";
import type {CartLine} from "@/types";
type StoreContextValue={cart:CartLine[];favorites:string[];cartCount:number;addToCart:(id:string,quantity?:number)=>void;setQuantity:(id:string,quantity:number)=>void;removeFromCart:(id:string)=>void;clearCart:()=>void;toggleFavorite:(id:string)=>void};
const StoreContext=createContext<StoreContextValue|null>(null);
const CART_KEY="nova_cart_v2",FAVORITES_KEY="nova_favorites_v2";
function read(key:string):unknown{try{return JSON.parse(localStorage.getItem(key)||"[]")}catch{return []}}
function write(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value))}catch{/* Browsers may disable local persistence. */}}
export function StoreProvider({children}:{children:React.ReactNode}){
 const[cart,setCart]=useState<CartLine[]>([]),[favorites,setFavorites]=useState<string[]>([]);
 const cartRef=useRef<CartLine[]>([]),favoritesRef=useRef<string[]>([]),cartDirty=useRef(false),favoritesDirty=useRef(false);
 const syncQueue=useRef<Promise<unknown>>(Promise.resolve());
 const saveCart=useCallback((next:CartLine[],sync=true)=>{cartRef.current=next;setCart(next);write(CART_KEY,next);if(sync){cartDirty.current=true;syncQueue.current=syncQueue.current.catch(()=>undefined).then(()=>fetch("/api/cart",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({items:next})})).catch(()=>undefined)}},[]);
 const saveFavorites=useCallback((next:string[])=>{favoritesRef.current=next;setFavorites(next);write(FAVORITES_KEY,next)},[]);
 useEffect(()=>{
  let active=true;
  queueMicrotask(()=>{
   if(!active)return;
   const raw=read(CART_KEY),saved=read(FAVORITES_KEY);
   const local=Array.isArray(raw)?raw.filter((r):r is CartLine=>Boolean(r&&typeof r.productId==="string"&&Number.isInteger(r.quantity)&&r.quantity>0&&r.quantity<=99)):[];
   const localFavorites=Array.isArray(saved)?saved.filter((v):v is string=>typeof v==="string"):[];
   saveCart(local,false);saveFavorites(localFavorites);
   void fetch("/api/cart",{cache:"no-store"}).then(async r=>{if(!r.ok)return;const body=await r.json();if(!active||cartDirty.current||!Array.isArray(body.items))return;const merged=new Map<string,number>();[...body.items,...cartRef.current].forEach((i:CartLine)=>merged.set(i.productId,Math.max(merged.get(i.productId)||0,i.quantity)));saveCart(Array.from(merged,([productId,quantity])=>({productId,quantity})));}).catch(()=>undefined);
   void fetch("/api/favorites",{cache:"no-store"}).then(async r=>{if(!r.ok)return;const body=await r.json();if(!active||favoritesDirty.current||!Array.isArray(body.productIds))return;const merged=Array.from(new Set<string>([...body.productIds,...favoritesRef.current]));saveFavorites(merged);for(const id of localFavorites.filter(id=>!body.productIds.includes(id)))void fetch("/api/favorites",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({productId:id})}).catch(()=>undefined);}).catch(()=>undefined);
  });
  return()=>{active=false};
 },[saveCart,saveFavorites]);
 const addToCart=useCallback((id:string,quantity=1)=>{const q=Math.min(99,Math.max(1,Math.floor(quantity)));const prev=cartRef.current;saveCart(prev.some(i=>i.productId===id)?prev.map(i=>i.productId===id?{...i,quantity:Math.min(99,i.quantity+q)}:i):[...prev,{productId:id,quantity:q}]);},[saveCart]);
 const setQuantity=useCallback((id:string,q:number)=>saveCart(q<=0?cartRef.current.filter(i=>i.productId!==id):cartRef.current.map(i=>i.productId===id?{...i,quantity:Math.min(99,Math.max(1,Math.floor(q)))}:i)),[saveCart]);
 const removeFromCart=useCallback((id:string)=>setQuantity(id,0),[setQuantity]);
 const clearCart=useCallback(()=>saveCart([]),[saveCart]);
 const toggleFavorite=useCallback((id:string)=>{favoritesDirty.current=true;const exists=favoritesRef.current.includes(id);saveFavorites(exists?favoritesRef.current.filter(v=>v!==id):[...favoritesRef.current,id]);void fetch("/api/favorites",{method:exists?"DELETE":"POST",headers:{"content-type":"application/json"},body:JSON.stringify({productId:id})}).catch(()=>undefined)},[saveFavorites]);
 const value=useMemo(()=>({cart,favorites,cartCount:cart.reduce((s,i)=>s+i.quantity,0),addToCart,setQuantity,removeFromCart,clearCart,toggleFavorite}),[cart,favorites,addToCart,setQuantity,removeFromCart,clearCart,toggleFavorite]);
 return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export function useStore(){const value=useContext(StoreContext);if(!value)throw new Error("StoreProvider required");return value}
