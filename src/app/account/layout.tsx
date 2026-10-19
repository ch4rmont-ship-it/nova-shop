import Link from "next/link";
import { Heart, House, MapPin, Package, Settings, UserRound } from "lucide-react";
import { requireUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
const links=[[House,"Overview","/account"],[UserRound,"Profile","/account#profile"],[Package,"Orders","/account/orders"],[MapPin,"Addresses","/account/addresses"],[Heart,"Favorites","/account/favorites"],[Settings,"Settings","/account/settings"]] as const;
export default async function AccountLayout({children}:{children:React.ReactNode}){await requireUser();return <section className="container-shell py-10"><div className="grid gap-8 lg:grid-cols-[220px_1fr]"><aside><p className="eyebrow mb-4">My account</p><nav className="grid gap-1">{links.map(([Icon,label,href])=><Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold hover:bg-white"><Icon size={17}/>{label}</Link>)}</nav></aside><div>{children}</div></div></section>}
