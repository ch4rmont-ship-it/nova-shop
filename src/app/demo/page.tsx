import Link from "next/link";
const sections=[
 ["01","市场痛点","个人电商创业者经常需要独自完成选品、商品文案、客户咨询、库存管理和销售分析。"],
 ["02","解决方案","SmartShop AI 将在线商店与智能运营工作台整合，帮助个人商家降低重复劳动。"],
 ["03","AI技术逻辑","商品数据与商家输入 → 服务器校验和权限检查 → AI模型接口 → 商家审核内容。接入密钥后才能使用实时AI生成。"],
 ["04","商品文案生成","输入商品名称、特点和目标客户，生成商品标题、介绍与宣传文案。当前需要API密钥启用实时生成。"],
 ["05","智能客服","计划通过真实商品数据库回答常见问题。没有数据库依据时不能编造价格、库存、物流或售后政策。"],
 ["06","销售分析","按实际已支付订单计算营业额，并展示趋势与热销商品；不把待付款订单算成收入。"],
 ["07","商业模式","实验性SaaS订阅模型：Free ¥0、Pro ¥49、Enterprise ¥199 / 月。尚未验证定价与付费转化。"],
 ["08","融资设想","以下数据均属于项目假设；需通过用户调研与试运营验证获客成本、留存率和盈利能力。"],
 ["09","团队分工","CEO：商业方向；Project Manager：进度；Designer：交互设计；Engineer：系统开发；Tester：测试与质量。"]
];
export default function DemoPage(){return <main className="container-shell space-y-9 py-12"><div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-violet-800 to-blue-700 p-8 text-white sm:p-12"><p className="text-sm text-indigo-200">大学创业项目 · 8分钟演示</p><h1 className="mt-4 text-4xl font-black">SmartShop AI</h1><p className="mt-3 text-2xl font-bold">一个人，也能运营一家智能电商公司</p><p className="mt-4 text-sm text-indigo-100">真实系统功能与演示/规划中的AI功能分别标注；不将示例数据视为实际销售。</p></div><div className="grid gap-5 md:grid-cols-2">{sections.map(([n,title,description])=><section className="rounded-2xl border bg-white p-6" key={n}><p className="text-xs font-bold text-violet-700">PART {n}</p><h2 className="mt-2 text-xl font-bold">{title}</h2><p className="mt-3 text-sm leading-7 text-slate-600">{description}</p></section>)}</div><div className="flex flex-wrap gap-4"><Link className="rounded-xl bg-indigo-700 px-5 py-3 font-bold text-white" href="/ai-studio">商品文案工具 →</Link><Link className="rounded-xl border px-5 py-3 font-bold" href="/pricing">商业定价 →</Link><Link className="rounded-xl border px-5 py-3 font-bold" href="/admin/analytics">销售分析（需管理员登录） →</Link></div></main>}
