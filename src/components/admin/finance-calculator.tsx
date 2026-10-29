"use client";
import {useMemo,useState} from "react";
import {Calculator,FlaskConical,RotateCcw,TrendingDown,TrendingUp} from "lucide-react";
import {calculateFinance,type FinanceInput} from "@/lib/finance";
import {t,type Locale} from "@/lib/i18n";

const labels={
 mn:{price:"Борлуулах үнэ (₮)",cost:"Барааны худалдан авах өртөг (₮)",ship:"Нэгж хүргэлт (₮)",pack:"Нэгж савлагаа (₮)",fee:"Төлбөрийн шимтгэл (%)",marketing:"Маркетингийн хувь (%)",fixed:"Сарын тогтмол зардал (₮)",units:"Сард борлуулах ширхэг",revenue:"Тооцоолсон орлого",total:"Нийт зардал",net:"Цэвэр ашиг/алдагдал",contribution:"Нэгжийн үлдэх дүн",gross:"Нэгжийн gross margin",breakEven:"Зардлаа нөхөх тоо",roi:"Тооцоолсон ROI",never:"Энэ нөхцөлд зардлаа нөхөх боломжгүй",unitsLabel:"ширхэг",clear:"Тэглэх",demo:"Жишээ утга оруулах",note:"Зөвхөн өөрийн оруулсан тоогоор тооцно. Татвар, буцаалт, ханшийн хэлбэлзэл зэрэг тусгай зардлыг оруулаагүй бол дүн дотор орохгүй. Энэ нь бизнесийн баталгаатай ашиг биш."},
 zh:{price:"销售单价 (₮)",cost:"采购成本 / 件 (₮)",ship:"运费 / 件 (₮)",pack:"包装费 / 件 (₮)",fee:"支付手续费 (%)",marketing:"营销成本率 (%)",fixed:"每月固定成本 (₮)",units:"预计月销量",revenue:"预计营业额",total:"总成本",net:"预计净利润/亏损",contribution:"单件贡献利润",gross:"商品毛利率",breakEven:"盈亏平衡销量",roi:"预计投资回报率",never:"单位贡献利润不为正，无法盈亏平衡",unitsLabel:"件",clear:"清空数据",demo:"载入示例",note:"只使用输入值计算。未列入的税收、退货、汇率变化等费用不包含在结果里。本工具不能保证实际利润。"},
 en:{price:"Selling price / unit (₮)",cost:"Purchase cost / unit (₮)",ship:"Shipping / unit (₮)",pack:"Packaging / unit (₮)",fee:"Payment processing (%)",marketing:"Marketing spend (%)",fixed:"Monthly fixed expenses (₮)",units:"Expected units / month",revenue:"Projected revenue",total:"Total costs",net:"Projected net profit/loss",contribution:"Contribution / unit",gross:"Product gross margin",breakEven:"Break-even units",roi:"Estimated ROI",never:"Cannot break even with nonpositive unit contribution",unitsLabel:"units",clear:"Reset values",demo:"Load example values",note:"Calculations use only the inputs you provide. Taxes, refunds, exchange-rate changes and other omitted expenses are not included. Actual profit is not guaranteed."}
} as const;
const zero:FinanceInput={sellingPrice:0,purchaseCost:0,shippingPerUnit:0,packagingPerUnit:0,commissionPct:0,marketingPct:0,fixedMonthlyCost:0,expectedUnits:0};
const example:FinanceInput={sellingPrice:99000,purchaseCost:54000,shippingPerUnit:7000,packagingPerUnit:2000,commissionPct:2.5,marketingPct:6,fixedMonthlyCost:600000,expectedUnits:40};
const money=(n:number)=>new Intl.NumberFormat("en-US",{maximumFractionDigits:0}).format(n)+"₮";
export function FinanceCalculator({locale}:{locale:Locale}){
 const [form,setForm]=useState<FinanceInput>(zero);
 const [demo,setDemo]=useState(false);
 const l=labels[locale];
 const result=useMemo(()=>{try{return calculateFinance(form);}catch{return null;}},[form]);
 const fields=[
  ["sellingPrice",l.price],["purchaseCost",l.cost],["shippingPerUnit",l.ship],["packagingPerUnit",l.pack],
  ["commissionPct",l.fee],["marketingPct",l.marketing],["fixedMonthlyCost",l.fixed],["expectedUnits",l.units]
 ] as const;
 return <div className="space-y-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="brand-eyebrow">SMARTSHOP AI / FINANCE</p><h1 className="mt-2 text-3xl font-black">{t(locale,"financeTitle")}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{t(locale,"simulation")}</p></div><span className="grid size-14 place-items-center rounded-2xl bg-indigo-100 text-indigo-700"><Calculator size={28}/></span></div>
 <div className="flex flex-wrap gap-3"><button onClick={()=>{setForm(example);setDemo(true);}} type="button" className="inline-flex items-center gap-2 rounded-xl border border-violet-300 bg-violet-50 px-4 py-2.5 text-sm font-bold text-violet-800"><FlaskConical size={17}/>{l.demo}</button><button type="button" className="inline-flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-bold" onClick={()=>{setForm(zero);setDemo(false);}}><RotateCcw size={16}/>{l.clear}</button></div>
 {demo&&<p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">DEMO / 演示数据 — жишээ утгууд зохиомол бөгөөд бодит борлуулалт биш.</p>}
 <div className="grid min-w-0 gap-5 xl:grid-cols-[1fr_1.1fr]"><section className="rounded-3xl border bg-white p-5 sm:p-7"><h2 className="text-lg font-black">{locale==="zh"?"输入成本参数":locale==="en"?"Scenario inputs":"Зардлын үзүүлэлтүүд"}</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{fields.map(([field,label])=><label className="block text-xs font-semibold text-slate-600" key={field}>{label}<input type="number" inputMode="decimal" min={0} max={field.endsWith("Pct")?100:field==="expectedUnits"?1000000:10000000000} step={field==="expectedUnits"?"1":"any"} value={form[field]} onChange={e=>{const max=field.endsWith("Pct")?100:field==="expectedUnits"?1000000:10000000000;const v=Math.max(0,Math.min(max,Number(e.target.value)||0));setForm(old=>({...old,[field]:field==="expectedUnits"?Math.floor(v):v}));setDemo(false);}} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-bold text-slate-900 focus:border-indigo-500 focus:outline-none"/></label>)}</div></section>
 <section className="rounded-3xl border bg-white p-5 sm:p-7"><h2 className="text-lg font-black">{locale==="zh"?"实时计算结果":locale==="en"?"Live calculations":"Тооцооны үр дүн"}</h2>{result&&<><div className="mt-6 grid gap-3 sm:grid-cols-2">{[
  [l.revenue,money(result.revenue),false],[l.total,money(result.totalCost),false],[l.net,money(result.netProfit),true],[l.contribution,money(result.unitContribution),false],
  [l.gross,result.grossMarginPct===null?"—":result.grossMarginPct.toFixed(1)+"%",false],[l.roi,result.roiPct===null?"—":result.roiPct.toFixed(1)+"%",false]
 ].map(([label,value,emphasize])=><div className={"rounded-2xl p-4 "+(emphasize?(result.netProfit>=0?"bg-emerald-50 text-emerald-900":"bg-rose-50 text-rose-900"):"bg-slate-50")} key={String(label)}><p className="text-xs opacity-75">{label}</p><p className="mt-3 break-all text-xl font-black">{value}</p></div>)}</div>
 <div className="mt-4 rounded-2xl bg-indigo-50 p-5 text-indigo-950"><div className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-lg bg-white text-indigo-700">{result.unitContribution>0?<TrendingUp size={18}/>:<TrendingDown size={18}/>}</span><h3 className="font-black">{l.breakEven}</h3></div><p className="mt-3 text-2xl font-black">{result.breakEvenUnits===null?l.never:new Intl.NumberFormat("en-US").format(result.breakEvenUnits)+" "+l.unitsLabel}</p>{result.breakEvenRevenue!==null&&<p className="mt-2 text-xs">≈ {money(result.breakEvenRevenue)}</p>}</div></>}</section></div>
 <p className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 text-xs leading-7 text-indigo-900">{l.note}</p>
 </div>;
}
