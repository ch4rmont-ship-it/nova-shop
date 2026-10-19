import Link from "next/link";

export function Footer() {
  return <footer className="mt-24 border-t border-[#dedbd3] bg-[#171816] text-white">
    <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
      <div><div className="text-2xl font-black tracking-[.18em]">NOVA</div><p className="mt-4 max-w-sm text-sm leading-6 text-white/60">Машин, ширээ, гэр, аялалд өдөр бүр хэрэг болох цөөн боловч зөв сонгосон practical essentials.</p></div>
      <div><h3 className="mb-4 text-sm font-bold">Дэлгүүр</h3><div className="grid gap-2 text-sm text-white/65"><Link href="/shop">Бүх бараа</Link><Link href="/#categories">Ангилал</Link><Link href="/favorites">Хадгалсан</Link></div></div>
      <div><h3 className="mb-4 text-sm font-bold">Миний NOVA</h3><div className="grid gap-2 text-sm text-white/65"><Link href="/account">Профайл</Link><Link href="/account/orders">Захиалгууд</Link><Link href="/account/addresses">Хаяг</Link></div></div>
      <div><h3 className="mb-4 text-sm font-bold">Тусламж</h3><div className="grid gap-2 text-sm text-white/65"><span>УБ болон орон нутагт хүргэлт</span><span>Хүргэлтийн мэдээлэл checkout дээр</span><span>Secure checkout</span></div></div>
    </div>
    <div className="border-t border-white/10"><div className="container-shell flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:justify-between"><span>© 2026 NOVA Commerce</span><span>Үнэ серверээр баталгаажна · Privacy-first</span></div></div>
  </footer>;
}
