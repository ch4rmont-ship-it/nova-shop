import Link from "next/link";

export function Footer() {
  return <footer className="mt-24 border-t border-[#dedbd3] bg-[#171816] text-white">
    <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
      <div><div className="text-2xl font-black tracking-[.18em]">NOVA</div><p className="mt-4 max-w-sm text-sm leading-6 text-white/60">Everyday objects, edited down to the ones worth keeping.</p></div>
      <div><h3 className="mb-4 text-sm font-bold">Shop</h3><div className="grid gap-2 text-sm text-white/65"><Link href="/shop">All products</Link><Link href="/#categories">Categories</Link><Link href="/favorites">Favorites</Link></div></div>
      <div><h3 className="mb-4 text-sm font-bold">Account</h3><div className="grid gap-2 text-sm text-white/65"><Link href="/account">Profile</Link><Link href="/account/orders">Orders</Link><Link href="/account/addresses">Addresses</Link></div></div>
      <div><h3 className="mb-4 text-sm font-bold">Help</h3><div className="grid gap-2 text-sm text-white/65"><span>Shipping & returns</span><span>support@example.com</span><span>Mon–Fri, 9–5</span></div></div>
    </div>
    <div className="border-t border-white/10"><div className="container-shell flex flex-col gap-2 py-5 text-xs text-white/45 sm:flex-row sm:justify-between"><span>© 2026 NOVA Commerce</span><span>Secure checkout · Privacy-first</span></div></div>
  </footer>;
}
