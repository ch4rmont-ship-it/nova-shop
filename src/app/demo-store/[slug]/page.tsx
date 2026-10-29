import {notFound} from "next/navigation";
import type {Metadata} from "next";
import {getLocale} from "@/lib/i18n-server";
import {getDemoProduct} from "@/lib/demo/catalog";
import {DemoBanner} from "@/components/demo-store/demo-banner";
import {DemoProductDetail} from "@/components/demo-store/demo-product-detail";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const product=getDemoProduct(slug);return {title:product?product.name.en+" — Demo Store":"Demo item not found",robots:{index:false,follow:false}};}
export default async function DemoDetailPage({params}:{params:Promise<{slug:string}>}){const [{slug},locale]=await Promise.all([params,getLocale()]);const product=getDemoProduct(slug);if(!product)notFound();return <><DemoBanner locale={locale}/><DemoProductDetail locale={locale} product={product}/></>;}
