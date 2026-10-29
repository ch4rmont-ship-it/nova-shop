import Link from "next/link";
import {ArrowUpRight,BarChart3,ChartNoAxesCombined,CircleDollarSign,ShoppingBag,TrendingUp,Users} from "lucide-react";
import {createAdminClient} from "@/lib/supabase/admin";
import {getLocale} from "@/lib/i18n-server";
import {formatMoney} from "@/lib/utils";
import {t,type Locale} from "@/lib/i18n";
export const dynamic="force-dynamic";

const extra={
 mn:{sub:"Сүүлийн 1000 захиалгын төлөв ба бодит орлогын шинжилгээ.",paid:"Төлөгдсөн захиалга",aov:"Дундаж төлөгдсөн захиалга",paidShare:"Төлөгдсөн хувь",monthly:"Сүүлийн 6 сарын бодит орлого",top:"Шилдэг бүтээгдэхүүн (төлөгдсөн)",noTop:"Төлөгдсөн бүтээгдэхүүний борлуулалт алга.",statuses:"Захиалгын төлөв",method:"Зөвхөн payment_status=paid төлөвтэй захиалгыг орлогод тооцно. Энэ нь цэвэр ашиг биш. Өгөгдлийн хүрээ: сүүлийн 1000 захиалга; түүнээс өмнөхийг хамрахгүй.",note:"Хоосон сард 0 гэж харуулна. Буцаалт, шимтгэл, татварыг хасаагүй.",back:"Админ самбар",per:"ш"},
 zh:{sub:"分析最近1000笔订单的状态与实际已支付收入。",paid:"已支付订单",aov:"已支付客单价",paidShare:"付款转化占比",monthly:"最近六个月的已支付营收",top:"热销商品（已支付）",noTop:"暂无已支付商品销售记录。",statuses:"订单状态",method:"只有 payment_status=paid 的订单被计入收入。这不等于净利润。最多读取最新1000笔订单，旧订单不在此范围。",note:"没有销售的月份显示0。未扣除退款、手续费与税费。",back:"返回管理后台",per:"件"},
 en:{sub:"Real paid sales and statuses from the latest 1,000 orders.",paid:"Paid orders",aov:"Average paid order value",paidShare:"Paid order ratio",monthly:"Paid revenue: last six months",top:"Top products (paid)",noTop:"No paid product sales yet.",statuses:"Order status",method:"Revenue includes payment_status=paid only. It is not net profit. The latest 1,000 orders are included; older orders are outside this report.",note:"Months with no paid sales show zero. Refunds, fees and taxes are not deducted.",back:"Back to dashboard",per:"units"}
} as const;
export default async function AnalyticsPage(){
 const locale:Locale=await getLocale();
 const l=extra[locale];
 const db=await createAdminClient();
 const {data:orders,error}=await db.from("orders").select("id,total_cents,payment_status,status,created_at").order("created_at",{ascending:false}).limit(1000);
 if(error)throw new Error("Analytics query failed: "+error.message);
 const all=orders||[];
 const paid=all.filter(o=>o.payment_status==="paid");
 const revenue=paid.reduce((sum,o)=>sum+Number(o.total_cents||0),0);
 const avg=paid.length?Math.round(revenue/paid.length):0;
 const paidShare=all.length?100*paid.length/all.length:0;
 const months=Array.from({length:6},(_,i)=>{const now=new Date();const date=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth()-5+i,1));return {key:date.toISOString().slice(0,7),label:date.toLocaleString(locale==="zh"?"zh-CN":locale==="en"?"en-US":"mn-MN",{month:"short",year:"2-digit",timeZone:"UTC"}),value:0};});
 const monthly=new Map(months.map((x,i)=>[x.key,i]));
 paid.forEach(o=>{const index=monthly.get(String(o.created_at).slice(0,7));if(index!==undefined)months[index].value+=Number(o.total_cents||0);});
 const highest=Math.max(1,...months.map(x=>x.value));
 const paidIds=paid.map(o=>o.id);
 const lines:{product_name_snapshot:string;quantity:number}[]=[];
 if(paidIds.length){const {data,error:lineError}=await db.from("order_items").select("product_name_snapshot,quantity").in("order_id",paidIds);if(lineError)throw new Error("Order items query failed: "+lineError.message);lines.push(...(data||[]));}
 const counts=new Map<string,number>();
 lines.forEach(row=>counts.set(row.product_name_snapshot,(counts.get(row.product_name_snapshot)||0)+Number(row.quantity)));
 const best=[...counts].sort((a,b)=>b[1]-a[1]).slice(0,5);
 const statusCounts=new Map<string,number>();all.forEach(row=>statusCounts.set(row.status,(statusCounts.get(row.status)||0)+1));
 const stats=[
  {label:t(locale,"paidRevenue"),value:formatMoney(revenue),Icon:CircleDollarSign},
  {label:t(locale,"orders"),value:String(all.length),Icon:ShoppingBag},
  {label:l.paid,value:String(paid.length),Icon:Users},
  {label:l.aov,value:formatMoney(avg),Icon:TrendingUp}
 ];
 return <div className="space-y-7">
  <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="brand-eyebrow">SMARTSHOP AI / SALES INTELLIGENCE</p><h1 className="mt-2 text-3xl font-black text-slate-950">{t(locale,"analyticsTitle")}</h1><p className="mt-3 text-sm leading-6 text-slate-500">{l.sub}</p></div><Link className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-bold text-indigo-700" href="/admin/finance"><BarChart3 size={17}/>{t(locale,"toolFinance")}<ArrowUpRight size={15}/></Link></div>
  <section className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">{stats.map(({label,value,Icon})=><div className="brand-kpi-card rounded-2xl border bg-white p-5" key={label}><div className="flex items-center justify-between gap-3"><p className="text-xs font-bold text-slate-500">{label}</p><span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-700"><Icon size={19}/></span></div><p className="mt-4 break-all text-2xl font-black text-slate-950">{value}</p></div>)}</section>
  <section className="grid gap-5 xl:grid-cols-[1.5fr_1fr]"><div className="rounded-3xl border bg-white p-5 sm:p-7"><h2 className="text-lg font-black">{l.monthly}</h2>{months.some(m=>m.value>0)?<><div role="img" aria-label={l.monthly} className="mt-7 flex h-56 items-end gap-3 border-b border-slate-100 sm:gap-5">{months.map(m=><div key={m.key} className="flex h-full min-w-0 flex-1 items-end"><div className="w-full rounded-t-xl bg-gradient-to-t from-indigo-700 to-violet-400" style={{height:(m.value===0?0:Math.max(4,Math.round(100*m.value/highest)))+"%"}} title={m.key+": "+formatMoney(m.value)}/></div>)}</div><div className="mt-3 flex gap-3 text-center text-xs text-slate-500 sm:gap-5">{months.map(m=><span className="min-w-0 flex-1" key={m.key}>{m.label}</span>)}</div><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{months.map(m=><div key={m.key} className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{m.key}</p><p className="mt-2 text-sm font-bold">{formatMoney(m.value)}</p></div>)}</div></>:<div className="mt-7 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-6 text-center"><ChartNoAxesCombined size={33} className="text-indigo-400"/><p className="mt-3 text-sm font-bold">{t(locale,"noPaid")}</p></div>}</div>
  <div className="space-y-5"><section className="rounded-3xl border bg-white p-6"><h2 className="text-lg font-black">{l.statuses}</h2><div className="mt-5 flex items-center justify-between rounded-xl bg-indigo-50 p-4"><span className="text-sm">{l.paidShare}</span><strong>{paidShare.toFixed(1)}%</strong></div><div className="mt-4 space-y-3">{[...statusCounts].sort((a,b)=>b[1]-a[1]).map(([status,n])=><div key={status} className="flex items-center justify-between gap-4 text-sm"><span className="capitalize">{status}</span><strong>{n}</strong></div>)}{statusCounts.size===0&&<p className="text-sm text-slate-500">{t(locale,"noData")}</p>}</div></section><section className="rounded-3xl border bg-white p-6"><h2 className="text-lg font-black">{l.top}</h2><div className="mt-4 space-y-3">{best.map(([name,n])=><div key={name} className="flex justify-between gap-3 border-b pb-3 text-sm"><span className="min-w-0 truncate">{name}</span><strong>{n} {l.per}</strong></div>)}{best.length===0&&<p className="text-sm text-slate-500">{l.noTop}</p>}</div></section></div></section>
  <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-5 text-xs leading-7 text-indigo-900"><p>{l.method}</p><p className="mt-2">{l.note}</p></div><Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-700">← {l.back}</Link>
 </div>;
}
