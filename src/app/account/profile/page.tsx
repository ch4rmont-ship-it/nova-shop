import {getCurrentProfile} from "@/lib/auth";
import {ProfileForm} from "@/components/account/profile-form";
export default async function ProfilePage({searchParams}:{searchParams:Promise<{error?:string;message?:string}>}){const[p,q]=await Promise.all([getCurrentProfile(),searchParams]);return <><p className="eyebrow">Миний NOVA / Профайл</p><h1 className="mb-7 mt-3 text-3xl font-black tracking-tight sm:text-4xl">Таны тухай.</h1><ProfileForm name={p?.full_name||""} phone={p?.phone||""} email={p?.email||""} error={q.error} message={q.message}/></>}
