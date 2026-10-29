import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/store-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
 metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
 title:{default:"SmartShop AI — Ухаалаг онлайн худалдаа",template:"%s · SmartShop AI"},
 description:"SmartShop AI — AI-д бэлэн, олон хэлний онлайн худалдааны бизнесийн платформ.",
 openGraph:{title:"SmartShop AI",description:"AI-ready commerce and business management.",type:"website"}
};
export default async function RootLayout({children}:{children:React.ReactNode}){
 const locale=await getLocale();
 return <html lang={locale}><body><StoreProvider><Header locale={locale}/><main>{children}</main><Footer locale={locale}/></StoreProvider></body></html>;
}
