import type {Metadata} from "next";
import {getLocale} from "@/lib/i18n-server";
import {DemoBanner} from "@/components/demo-store/demo-banner";
import {DemoStorefront} from "@/components/demo-store/demo-storefront";
export const metadata:Metadata={title:"Demo Store · SmartShop AI",description:"Eight fictional classroom products with illustrated sample prices; no real checkout."};
export default async function DemoStorePage(){const locale=await getLocale();return <><DemoBanner locale={locale}/><DemoStorefront locale={locale}/></>;}
