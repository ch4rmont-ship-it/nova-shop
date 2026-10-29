import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Item={
 id:string;name:string;slug:string|null;priceMnt:number;landedCostMnt:number|null;
 estimatedGrossProfitMnt:number|null;estimatedGrossMarginPct:number|null;
 stock:number;preorder:boolean;unitsSold:number;sample:boolean;costVerified:boolean;
};
function toItem(row:{id:string;name:string;slug:string|null;price_cents:number;sale_price_cents:number|null;stock:number;preorder:boolean},cost:number|null,units:number,sample=false):Item {
 const rawPrice=row.sale_price_cents!=null && row.sale_price_cents<row.price_cents?row.sale_price_cents:row.price_cents;
 const priceMnt=Math.round(rawPrice/100);
 const validCost=typeof cost==="number" && Number.isFinite(cost) && cost>0 ? cost : null;
 const gross=validCost===null?null:priceMnt-validCost;
 return {id:row.id,name:row.name,slug:row.slug,priceMnt,landedCostMnt:validCost,estimatedGrossProfitMnt:gross,estimatedGrossMarginPct:gross===null||priceMnt<=0?null:Math.round(gross/priceMnt*1000)/10,stock:row.stock,preorder:row.preorder,unitsSold:units,sample,costVerified:false};
}
const demo: Item[]=[
 toItem({id:"demo-desk",name:"演示：USB-C Desk Lamp",slug:null,price_cents:8900000,sale_price_cents:null,stock:0,preorder:true},61000,12,true),
 toItem({id:"demo-bag",name:"演示：Travel Organizer",slug:null,price_cents:6900000,sale_price_cents:null,stock:14,preorder:false},42000,8,true),
 toItem({id:"demo-holder",name:"演示：Laptop Stand",slug:null,price_cents:11900000,sale_price_cents:null,stock:3,preorder:false},89000,5,true)
];
function json(data:unknown,status=200){return NextResponse.json(data,{status,headers:{"Cache-Control":"no-store"}});}
export async function GET(request:NextRequest){
 const user=await getCurrentUser();
 if(!user)return json({error:"Authentication required"},401);
 const db=await createClient();
 const {data:profile,error:profileError}=await db.from("profiles").select("role").eq("id",user.id).maybeSingle();
 if(profileError || profile?.role!=="admin")return json({error:"Admin only"},403);
 if(request.nextUrl.searchParams.get("mode")==="demo")return json({
  mode:"demo",items:demo,currency:"MNT",disclaimer:"演示数据 / DEMO ONLY: all figures, costs, and sales are invented solely for classroom demonstrations. No real market demand is claimed.",scope:"fictional classroom scenario"
 });
 try {
 const {data:products,error:productError}=await db.from("products").select("id,name,slug,price_cents,sale_price_cents,stock,preorder").eq("active",true).order("created_at",{ascending:false}).limit(200);
 if(productError)throw productError;
 const ids=(products||[]).map(p=>p.id);
 if(!ids.length)return json({mode:"live",currency:"MNT",items:[],scope:"first 200 active products and latest 500 paid orders",disclaimer:"No products in the live catalog. Add products using the admin panel."});
 const [{data:sourcing,error:sourceError},{data:orders,error:orderError}]=await Promise.all([
  db.from("product_sourcing").select("product_id,estimates").in("product_id",ids),
  db.from("orders").select("id").eq("payment_status","paid").order("created_at",{ascending:false}).limit(500)
 ]);
 if(sourceError||orderError)throw sourceError||orderError;
 const paidIds=(orders||[]).map(o=>o.id);
 let lines:{product_id:string|null;quantity:number}[]=[];
 if(paidIds.length){
  const {data,error}=await db.from("order_items").select("product_id,quantity").in("order_id",paidIds);
  if(error)throw error;
  lines=data||[];
 }
 const counts=new Map<string,number>();
 for(const line of lines){if(line.product_id)counts.set(line.product_id,(counts.get(line.product_id)||0)+line.quantity);}
 const costs=new Map<string,number>();
 for(const row of sourcing||[]){
  const estimates=row.estimates as {landedMntEstimate?:unknown}|null;
  const cost=Number(estimates?.landedMntEstimate);
  if(estimates?.landedMntEstimate!=null && Number.isFinite(cost) && cost>0)costs.set(row.product_id,cost);
 }
 const items=(products||[]).map(p=>toItem(p,costs.get(p.id)??null,counts.get(p.id)||0));
 return json({mode:"live",items,currency:"MNT",scope:"up to 200 active products and latest 500 paid orders",disclaimer:"Estimated gross profit = listed sale price minus estimated landed cost. Does not include operating costs, taxes, returns, ads or payment fees. Missing costs and market demand are not guessed."});
 }catch{
  return json({error:"Product analysis could not load. No fictional live values were substituted."},503);
 }
}
