import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/components/store-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: { default: "NOVA — Modern essentials", template: "%s · NOVA" },
  description: "A premium modern store for considered everyday essentials.",
  openGraph: { title: "NOVA", description: "Modern essentials, thoughtfully edited.", type: "website" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><StoreProvider><Header/><main>{children}</main><Footer/></StoreProvider></body></html>;
}
