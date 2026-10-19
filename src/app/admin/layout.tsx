import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";
export const dynamic="force-dynamic";
export default async function AdminLayout({children}:{children:React.ReactNode}){await requireAdmin();return <section className="container-shell py-10"><div className="grid gap-8 lg:grid-cols-[220px_1fr]"><AdminNav/><div className="min-w-0">{children}</div></div></section>}
