import Link from "next/link";
import {redirect} from "next/navigation";
import {ShieldAlert} from "lucide-react";
import {getCurrentProfile} from "@/lib/auth";
import {logoutAction} from "@/lib/actions/auth";
export default async function AdminAccess(){const p=await getCurrentProfile();if(!p)redirect("/login?next=/admin");if(p.role==="admin")redirect("/admin");return <section className="container-shell py-16"><div className="surface mx-auto max-w-lg p-8"><ShieldAlert className="text-orange-600" size={36}/><h1 className="mt-5 text-2xl font-black">Энэ бүртгэл admin эрхгүй байна</h1><p className="muted mt-4 text-sm leading-7">Одоо нэвтэрсэн бүртгэл: <strong className="break-all text-slate-900">{p.email}</strong>. Дэлгүүрийн удирдлагад эрхтэй бүртгэлээрээ нэвтэрнэ үү. Бараа, үнэ болон зураг өөрчлөх эрхийг зөвхөн admin-д олгодог.</p><form action={logoutAction}><button className="btn-primary mt-6">Гараад өөр бүртгэлээр нэвтрэх</button></form><Link className="mt-5 block text-sm underline" href="/account">Миний бүртгэл рүү</Link></div></section>}
