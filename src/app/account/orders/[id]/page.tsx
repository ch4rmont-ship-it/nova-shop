import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";
import { formatMoney } from "@/lib/utils";

type OrderItemRow = { id:string; product_name_snapshot:string; unit_price_cents:number; quantity:number };
type AddressSnapshot = { fullName?:string; addressLine1?:string; city?:string; state?:string; postalCode?:string; country?:string };

export default async function OrderDetailPage({params}:{params:Promise<{id:string}>}){
  const user=await requireUser();const{id}=await params;const supabase=await createClient();
  const{data:order}=await supabase.from("orders").select("*, order_items(id,product_name_snapshot,unit_price_cents,quantity)").eq("id",id).eq("user_id",user.id).maybeSingle();
  if(!order)notFound();
  const steps=["pending","paid","processing","shipped","delivered"];
  const idx=steps.indexOf(order.status);
  const items=(order.order_items||[]) as OrderItemRow[];
  const address=(order.shipping_address||{}) as AddressSnapshot;
  return <div><p className="eyebrow">Order</p><h1 className="mt-2 text-3xl font-black">{order.order_number}</h1><div className="surface mt-7 p-6"><div className="grid gap-4 sm:grid-cols-5">{steps.map((s,i)=><div key={s}><div className={`h-2 rounded-full ${i<=idx?"bg-[#1f4d3a]":"bg-[#dedbd3]"}`}/><p className="mt-2 text-xs font-bold capitalize">{s}</p></div>)}</div></div><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]"><div className="surface p-6"><h2 className="font-bold">Items</h2><div className="mt-4 divide-y divide-[#dedbd3]">{items.map((item)=><div key={item.id} className="flex justify-between gap-3 py-4 text-sm"><div><div className="font-bold">{item.product_name_snapshot}</div><div className="muted mt-1">Qty {item.quantity}</div></div><strong>{formatMoney(item.unit_price_cents*item.quantity)}</strong></div>)}</div></div><aside className="surface p-6"><h2 className="font-bold">Summary</h2><div className="mt-4 space-y-3 text-sm"><Row label="Subtotal" value={formatMoney(order.subtotal_cents)}/><Row label="Shipping" value={formatMoney(order.shipping_cents)}/><Row label="Discount" value={`-${formatMoney(order.discount_cents)}`}/><div className="border-t border-[#dedbd3] pt-3"><Row label="Total" value={formatMoney(order.total_cents)} bold/></div></div><h3 className="mt-7 font-bold">Delivery</h3><p className="muted mt-2 text-sm leading-6">{address.fullName}<br/>{address.addressLine1}<br/>{address.city}{address.state?`, ${address.state}`:""} {address.postalCode}<br/>{address.country}</p></aside></div></div>
}
function Row({label,value,bold}:{label:string;value:string;bold?:boolean}){return <div className={`flex justify-between gap-3 ${bold?"font-black":""}`}><span>{label}</span><span>{value}</span></div>}
