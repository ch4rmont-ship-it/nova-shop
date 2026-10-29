import type {Metadata} from "next";
import {CustomerSupport} from "@/components/ai/customer-support";
import {getLocale} from "@/lib/i18n-server";
export const metadata:Metadata={title:"Customer Service · SmartShop AI",description:"Rule-based catalog support; live AI not configured"};
export const dynamic="force-dynamic";
export default async function SupportPage(){return <main className="container-shell py-10"><CustomerSupport initialLanguage={await getLocale()}/></main>;}
