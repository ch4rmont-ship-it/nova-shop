"use client";
export default function AdminError({reset}:{reset:()=>void}){return <div className="surface p-8"><h1 className="text-xl font-bold">Мэдээлэл ачаалж чадсангүй</h1><p className="muted mt-3 text-sm">Холболтоо шалгаад дахин оролдоно уу. Хадгалаагүй өөрчлөлт орсон гэж үзэхгүй.</p><button onClick={reset} className="btn-primary mt-5">Дахин ачаалах</button></div>}
