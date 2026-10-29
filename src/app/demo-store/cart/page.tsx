import type {Metadata} from "next";
import {getLocale} from "@/lib/i18n-server";
import {DemoBanner} from "@/components/demo-store/demo-banner";
import {DemoCartPage} from "@/components/demo-store/demo-cart-page";
export const metadata:Metadata={title:"Demo Cart · SmartShop AI",robots:{index:false,follow:false}};
export default async function DemoCartRoute(){const locale=await getLocale();return <><DemoBanner locale={locale}/><DemoCartPage locale={locale}/></>;}
