import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";
export const dynamic="force-dynamic";
export default async function AdminLayout({children}:{children:React.ReactNode}){
 await requireAdmin();
 return <div className="container-shell min-w-0 py-7 sm:py-10"><div className="grid min-w-0 gap-6 xl:grid-cols-[260px_minmax(0,1fr)] xl:items-start xl:gap-8"><AdminNav/><main className="min-w-0">{children}</main></div></div>;
}
