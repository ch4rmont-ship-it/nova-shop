import type {Metadata} from "next";
import {getLocale} from "@/lib/i18n-server";
import {DemoBanner} from "@/components/demo-store/demo-banner";
import {DemoCheckout} from "@/components/demo-store/demo-checkout";
export const metadata:Metadata={title:"Simulated Checkout · SmartShop AI",robots:{index:false,follow:false}};
export default async function DemoCheckoutRoute(){const locale=await getLocale();return <><DemoBanner locale={locale}/><DemoCheckout locale={locale}/></>;}
