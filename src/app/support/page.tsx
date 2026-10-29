import type { Metadata } from "next";
import { CustomerSupport } from "@/components/ai/customer-support";
export const metadata: Metadata = {title:"Smart Customer Service · SmartShop AI",description:"Catalog-based customer support with clearly marked non-AI demo mode"};
export default function SupportPage() {return <main className="container-shell py-10"><CustomerSupport/></main>;}
