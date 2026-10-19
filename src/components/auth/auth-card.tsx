import Link from "next/link";

export function AuthCard({ title, subtitle, children, footer }: { title:string; subtitle:string; children:React.ReactNode; footer?:React.ReactNode }) {
  return <div className="surface mx-auto max-w-md p-6 sm:p-8"><Link href="/" className="text-lg font-black tracking-[.18em]">NOVA</Link><h1 className="mt-8 text-3xl font-black tracking-tight">{title}</h1><p className="muted mt-2 text-sm leading-6">{subtitle}</p><div className="mt-7">{children}</div>{footer?<div className="muted mt-6 text-center text-sm">{footer}</div>:null}</div>;
}
export function Notice({ error, message }: { error?:string; message?:string }) { if(!error&&!message)return null; return <div className={`mb-5 rounded-2xl p-3 text-sm font-semibold ${error?"bg-red-50 text-red-700":"bg-emerald-50 text-emerald-800"}`}>{error||message}</div>; }
