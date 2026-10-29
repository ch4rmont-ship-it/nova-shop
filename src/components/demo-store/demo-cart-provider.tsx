"use client";
import {createContext,useContext,useEffect,useState} from "react";
import {demoProducts} from "@/lib/demo/catalog";
export type DemoCartLine={id:string;qty:number};
type DemoCartContext={lines:DemoCartLine[];ready:boolean;count:number;add:(id:string)=>void;setQty:(id:string,qty:number)=>void;remove:(id:string)=>void;clear:()=>void};
const Context=createContext<DemoCartContext|null>(null);
const KEY="smartshop_demo_cart_v1";
function normalize(value:unknown):DemoCartLine[]{
 if(!Array.isArray(value))return [];
 const output:DemoCartLine[]=[];
 for(const row of value){
  if(!row||typeof row.id!=="string"||typeof row.qty!=="number")continue;
  const product=demoProducts.find(p=>p.id===row.id);
  if(!product)continue;
  if(!Number.isFinite(row.qty)||row.qty<1)continue;
  output.push({id:row.id,qty:Math.min(product.stock,Math.floor(row.qty),9)});
 }
 return output.slice(0,8);
}
export function DemoCartProvider({children}:{children:React.ReactNode}){
 const [lines,setLines]=useState<DemoCartLine[]>([]);
 const [ready,setReady]=useState(false);
 useEffect(()=>{
  const timer=window.setTimeout(()=>{
   try{setLines(normalize(JSON.parse(window.localStorage.getItem(KEY)||"[]")));}catch{setLines([]);}
   setReady(true);
  },0);
  return()=>window.clearTimeout(timer);
 },[]);
 const update=(next:DemoCartLine[])=>{
  setLines(next);
  try{window.localStorage.setItem(KEY,JSON.stringify(next));}catch{/* storage disabled: keep transient cart */}
 };
 const add=(id:string)=>{
  const p=demoProducts.find(x=>x.id===id);
  if(!p||!ready)return;
  const current=lines.find(x=>x.id===id);
  const qty=Math.min(p.stock,9,(current?.qty||0)+1);
  update(current?lines.map(x=>x.id===id?{...x,qty}:x):[...lines,{id,qty}]);
 };
 const setQty=(id:string,qty:number)=>{
  const p=demoProducts.find(x=>x.id===id);
  if(!p||!ready)return;
  if(!Number.isFinite(qty)||qty<1){update(lines.filter(x=>x.id!==id));return;}
  update(lines.map(x=>x.id===id?{...x,qty:Math.min(p.stock,9,Math.floor(qty))}:x));
 };
 const remove=(id:string)=>update(lines.filter(x=>x.id!==id));
 const clear=()=>update([]);
 const count=lines.reduce((n,x)=>n+x.qty,0);
 return <Context.Provider value={{lines,ready,count,add,setQty,remove,clear}}>{children}</Context.Provider>;
}
export function useDemoCart(){
 const value=useContext(Context);
 if(!value)throw new Error("DemoCartProvider is required");
 return value;
}
