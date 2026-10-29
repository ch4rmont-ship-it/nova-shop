import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/store-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "SmartShop AI — Ухаалаг онлайн худалдаа", template: "%s · SmartShop AI" },
  description: "SmartShop AI — AI туслахтай онлайн худалдааны платформ, нэг хүний дэлгүүрийн удирдлагын шийдэл.",
  openGraph: { title: "SmartShop AI", description: "AI-powered commerce studio and storefront.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="mn"><body><StoreProvider><Header/><main>{children}</main><Footer/></StoreProvider></body></html>;
}
