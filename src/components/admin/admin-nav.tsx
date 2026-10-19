import Link from "next/link";
import { Boxes, LayoutDashboard, ListTree, PackageCheck, Users } from "lucide-react";
const links=[[LayoutDashboard,"Хяналтын самбар","/admin"],[Boxes,"Бараа","/admin/products"],[ListTree,"Ангилал","/admin/categories"],[PackageCheck,"Захиалгууд","/admin/orders"],[Users,"Хэрэглэгчид","/admin/users"],[Boxes,"Өртөг / эх сурвалж","/admin/sourcing"]] as const;
export function AdminNav(){return <aside><p className="eyebrow mb-4">Удирдлага</p><nav className="grid gap-1">{links.map(([Icon,label,href])=><Link key={href} href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold hover:bg-white"><Icon size={17}/>{label}</Link>)}</nav><Link href="/" className="mt-6 inline-block px-3 text-xs font-bold underline">Дэлгүүр рүү</Link></aside>}
