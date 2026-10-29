import { NextResponse } from "next/server";
import { z } from "zod";
import { getProducts } from "@/lib/data/catalog";
import { effectivePrice, formatMoney } from "@/lib/utils";
import type { Product } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const schema = z.object({
  message: z.string().trim().min(1).max(500),
  language: z.enum(["mn", "zh", "en"]).default("mn"),
  intent: z.enum(["auto", "products", "price", "stock", "shipping", "returns", "order"]).default("auto"),
  productId: z.string().uuid().optional()
}).strict();
type Language = "mn" | "zh" | "en";
type Intent = "auto" | "products" | "price" | "stock" | "shipping" | "returns" | "order";
type Recommendation = { id: string; name: string; slug: string; price: string; availability: string };

const translations = {
 mn: {
  empty: "Одоогоор нийтлэгдсэн бараа алга. Админ шинэ бараа нэмсний дараа бодит каталогийн зөвлөгөө гарна.",
  intro: "Би одоогоор AI биш, мэдээлэлд суурилсан туслах горимд ажиллаж байна. Бараа, үнэ, үлдэгдлийн тухай асуугаарай.",
  shipping: "Хүргэлтийн эцсийн үнэ, хугацаа баталгаажсан бодлого энд холбогдоогүй байна. Захиалга өгөх үед дэлгэц дээр гарсан хүргэлтийн төлбөрийг шалгана уу. Нэмэлт нөхцөлийг дэлгүүрээс лавлаарай.",
  returns: "Буцаалт, баталгааны албан ёсны бодлого баталгаажуулагдаж энэ туслахад холбогдоогүй. Баталгаагүй хугацаа, нөхцөл амлах боломжгүй; дэлгүүрийн админтай холбогдоно уу.",
  order: "Захиалгын хувийн мэдээллийг энэ нээлттэй чатад харуулахгүй. Өөрийн бүртгэлээр нэвтэрч /account/orders хуудаснаас харна уу.",
  notfound: "Тухайн барааг нийтлэгдсэн каталогоос олсонгүй. Өөр бараа сонгох эсвэл нэрийг тодорхой бичнэ үү.",
  list: "Нийтлэгдсэн каталогоос дараах бараанууд байна. Барааны дэлгэрэнгүйг нээгээд мэдээллээ шалгана уу.",
  price: "Каталогт бүртгэгдсэн үнийн мэдээлэл:",
  stock: "Каталогт бүртгэгдсэн үлдэгдлийн мэдээлэл:",
  preorder: "Захиалгаар (бодит үлдэгдэл баталгаажаагүй)",
  instock: "Бэлэн: ",
  outstock: "Үлдэгдэлгүй",
  ask: "Барааны нэр эсвэл асуултын төрлөө сонгоорой. Одоогоор энэ нь бодит AI-ийн чөлөөт яриа биш.",
  noMatch: "Таны бичсэн асуултад яг тохирох бараа олдсонгүй. Нийтлэгдсэн бараанаас харууллаа."
 },
 zh: {
  empty: "目前商品目录为空。管理员添加真实商品后，我才能提供商品推荐与库存信息。",
  intro: "当前是基于规则与商品数据的客服模式，并非实时AI。您可以查询商品、价格或库存。",
  shipping: "目前未配置经过确认的配送时效与完整政策。请以下单页面实际显示的运费为准，并向店铺核实配送条件。",
  returns: "退换货及保修正式政策尚未接入。请联系店铺管理员确认，不能承诺未经核实的条件。",
  order: "这里不会公开您的订单详情。请登录后前往 /account/orders 查看订单。",
  notfound: "在已发布商品中没有找到该商品。请修改名称或重新选择。",
  list: "以下是当前已发布的商品，详情以商品页面为准。",
  price: "当前已发布的商品价格：",
  stock: "当前商品库存信息：",
  preorder: "预购（现货库存未确认）",
  instock: "现货：",
  outstock: "缺货",
  ask: "请选择查询类型或提供具体商品名称。这不是实时AI自由对话。",
  noMatch: "未找到与问题精确对应的商品，下面是现有商品。"
 },
 en: {
  empty: "There are no published products yet. Recommendations will use the real catalog after the admin adds products.",
  intro: "This is a rule-based catalog assistant, not live AI. Ask about listed products, prices, and stock.",
  shipping: "Confirmed delivery timelines and full shipping policy are not available to this assistant. Check the shipping amount at checkout and confirm conditions with the store.",
  returns: "A verified returns and warranty policy is not connected. Please contact the store for exact terms; no unverified promise can be made.",
  order: "Private order details are not shown in public chat. Sign in and visit /account/orders to view your orders.",
  notfound: "That product was not found in the published catalog. Try another item or a more specific name.",
  list: "These products are published in the catalog. Please check each product page for details.",
  price: "Current listed product prices:",
  stock: "Current listed inventory:",
  preorder: "Preorder (no verified stock)",
  instock: "In stock: ",
  outstock: "Out of stock",
  ask: "Choose a question type or enter a product name. This is not a free-form live AI conversation.",
  noMatch: "No exact product matched your question. Showing currently listed items instead."
 }
};
function decide(message: string): Intent {
 const q=message.toLowerCase();
 if (/(захиалга|миний захиалга|订单|物流单号|where is my order|tracking|order status)/i.test(q)) return "order";
 if (/(буцаалт|буцаах|солих|退货|退款|return|refund|warranty)/i.test(q)) return "returns";
 if (/(хүргэлт|тээвэр|配送|运费|快递|shipping|delivery)/i.test(q)) return "shipping";
 if (/(үлдэгдэл|нөөц|бэлэн|有货|库存|现货|stock|available)/i.test(q)) return "stock";
 if (/(үнэ|хэд вэ|多少钱|价格|price|cost)/i.test(q)) return "price";
 if (/(бараа|санал|商品|推荐|products|recommend|catalog)/i.test(q)) return "products";
 return "auto";
}
function relevance(product: Product, words: string[]) {
 const text = [product.name,product.brand,product.shortDescription,product.slug].join(" ").toLowerCase();
 return words.reduce((n,w)=>n+(text.includes(w)?1:0),0);
}
export async function POST(request: Request) {
 const size = Number(request.headers.get("content-length") || 0);
 if(size > 4096) return NextResponse.json({error:"Request too large"}, {status:413});
 let input: unknown;
 try {input=await request.json();} catch {return NextResponse.json({error:"Invalid JSON"}, {status:400});}
 const parsed=schema.safeParse(input);
 if(!parsed.success) return NextResponse.json({error:"Invalid request"}, {status:400});
 const {message,language,productId}=parsed.data;
 const t=translations[language as Language];
 const intent=parsed.data.intent==="auto"?decide(message):parsed.data.intent;
 if(intent==="shipping" || intent==="returns" || intent==="order")
  return NextResponse.json({mode:"rules",reply:t[intent],products:[],catalog:"live"}, {headers:{"Cache-Control":"no-store"}});
 try {
  const products=await getProducts();
  if(!products.length) return NextResponse.json({mode:"rules",reply:t.empty,products:[],catalog:"live"}, {headers:{"Cache-Control":"no-store"}});
  const selected=productId?products.find(p=>p.id===productId):undefined;
  if(productId && !selected) return NextResponse.json({mode:"rules",reply:t.notfound,products:[],catalog:"live"});
  const words=message.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w=>w.length>=3).slice(0,12);
  const ranked=products.map(p=>({p,score:relevance(p,words)})).sort((a,b)=>b.score-a.score);
  const matching=ranked.filter(x=>x.score>0).map(x=>x.p);
  const found=selected?[selected]:(matching.length?matching:products).slice(0,4);
  const display:Recommendation[]=found.map(p=>({id:p.id,name:p.name,slug:p.slug,price:formatMoney(effectivePrice(p.priceCents,p.salePriceCents)),availability:p.preorder?t.preorder:p.stock>0?t.instock+p.stock:t.outstock}));
  const summary=display.map(p=>`• ${p.name} — ${intent==="stock"?p.availability:p.price+" · "+p.availability}`).join("\n");
  const lead=intent==="price"?t.price:intent==="stock"?t.stock:intent==="auto" && !matching.length?t.ask:intent==="auto"?t.noMatch:t.list;
  return NextResponse.json({mode:"rules",reply:lead+"\n"+summary,products:display,catalog:"live"}, {headers:{"Cache-Control":"no-store"}});
 }catch {
  return NextResponse.json({error:"Catalog is temporarily unavailable. Please try again."},{status:503});
 }
}
