import Link from "next/link";
import { Heart, House, MapPin, Package, Settings, UserRound } from "lucide-react";
import { getCurrentProfile, requireUser } from "@/lib/auth";
export const dynamic = "force-dynamic";
const links=[[House,"Тойм","/account"],[UserRound,"Профайл","/account#profile"],[Package,"Захиалгууд","/account/orders"],[MapPin,"Хаягууд","/account/addresses"],[Heart,"Хадгалсан","/account/favorites"],[Settings,"Тохиргоо","/account/settings"]] as const;
export default async function AccountLayout({children}:{children:React.ReactNode}){await requireUser();const profile=await getCurrentProfile();return <section className="container-shell py-10"><div className="grid gap-8 lg:grid-cols-[220px_1fr]"><aside><p className="eyebrow mb-4">Миний бүртгэл</p><nav className="grid gap-1">{links.map(([Icon,label,href])=><Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold hover:bg-white"><Icon size={17}/>{label}</Link>)}</nav>{profile?.role==="admin"?<Link href="/admin" className="btn-primary mt-4 w-full">Удирдлага</Link>:null}</aside><div>{children}</div></div></section>}
