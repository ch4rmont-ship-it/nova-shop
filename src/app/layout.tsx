import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/store-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "NOVA — Modern essentials", template: "%s · NOVA" },
  description: "Монголд зориулсан smart everyday essentials — машин, ширээ, гэр, аяллын practical бараанууд.",
  openGraph: { title: "NOVA", description: "Smart everyday essentials, selected for Mongolia.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="mn"><body><StoreProvider><Header/><main>{children}</main><Footer/></StoreProvider></body></html>;
}
