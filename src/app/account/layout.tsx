import { getCurrentProfile, requireUser } from "@/lib/auth";
import {AccountNav} from "@/components/account/account-nav";
export const dynamic = "force-dynamic";
export default async function AccountLayout({children}:{children:React.ReactNode}){await requireUser();const profile=await getCurrentProfile();return <section className="container-shell py-6 sm:py-10"><div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10"><AccountNav name={profile?.full_name||""} email={profile?.email||""} admin={profile?.role==="admin"}/><div className="min-w-0">{children}</div></div></section>}
