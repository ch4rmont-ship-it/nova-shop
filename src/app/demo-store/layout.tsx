import {DemoCartProvider} from "@/components/demo-store/demo-cart-provider";
export default function DemoStoreLayout({children}:{children:React.ReactNode}){return <DemoCartProvider>{children}</DemoCartProvider>;}
