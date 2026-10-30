import {ShopClient} from "@/components/product/shop-client";
import {getCategories,getProducts} from "@/lib/data/catalog";
import {getLocale} from "@/lib/i18n-server";
import {t} from "@/lib/i18n";
export const dynamic="force-dynamic";
export default async function ShopPage({searchParams}:{searchParams:Promise<{q?:string;sort?:string}>}){
 const [{q="",sort="newest"},products,categories,locale]=await Promise.all([searchParams,getProducts(),getCategories(),getLocale()]);
 const titles={mn:"Барааны каталог",zh:"商品商城",en:"Product marketplace"};
 const results={mn:"хайлтын үр дүн",zh:"搜索结果",en:"search results"};
 return <section className="shop-fullwidth py-8 sm:py-10"><p className="brand-eyebrow">SMARTSHOP AI / MARKETPLACE</p><h1 className="mt-3 break-words text-3xl font-black sm:text-4xl">{q?"“"+q+"” "+results[locale]:titles[locale]}</h1><p className="mb-7 mt-3 text-sm text-slate-500">{t(locale,"toolsDesc")}</p><ShopClient key={q+"-"+sort+"-"+locale} locale={locale} products={products} categories={categories} initialQuery={q} initialSort={sort}/></section>;
}
