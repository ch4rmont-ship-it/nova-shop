import Link from "next/link";
import { Boxes, LayoutDashboard, ListTree, PackageCheck, Users } from "lucide-react";
const links=[[LayoutDashboard,"Dashboard","/admin"],[Boxes,"Products","/admin/products"],[ListTree,"Categories","/admin/categories"],[PackageCheck,"Orders","/admin/orders"],[Users,"Users","/admin/users"]] as const;
export function AdminNav(){return <aside><p className="eyebrow mb-4">Admin console</p><nav className="grid gap-1">{links.map(([Icon,label,href])=><Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold hover:bg-white"><Icon size={17}/>{label}</Link>)}</nav><Link href="/" className="mt-6 inline-block px-3 text-xs font-bold underline">Back to store</Link></aside>}
