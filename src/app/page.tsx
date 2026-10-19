import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCategories, getProducts } from "@/lib/data/catalog";

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const featured = products.filter((p)=>p.featured).slice(0,8);
  const best = products.filter((p)=>p.bestseller).slice(0,4);
  const newest = [...products].sort((a,b)=>+new Date(b.createdAt)-+new Date(a.createdAt)).slice(0,4);
  return <>
    <section className="container-shell py-6 sm:py-10">
      <div className="relative min-h-[560px] overflow-hidden rounded-[34px] bg-[#dfe8e2] p-6 sm:p-10 lg:p-14">
        <div className="relative z-10 flex min-h-[470px] max-w-2xl flex-col justify-end">
          <p className="eyebrow mb-4">NOVA · Everyday essentials</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[.9] tracking-[-.055em] sm:text-7xl lg:text-[92px]">Өдөр бүр хэрэгтэй.<br/>Илүү цэгцтэй.</h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#36433b]">Машин, ширээ, гэр, аялалд зориулсан practical бараануудыг Хятадын том marketplace-уудын бодит reference үнээс сонгон curated байдлаар орууллаа.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link className="btn-primary" href="/shop">Бараа үзэх <ArrowRight size={17}/></Link><Link className="btn-secondary bg-white/70" href="#categories">Ангиллаар үзэх</Link></div>
        </div>
        <div className="pointer-events-none absolute -right-24 -top-24 size-[440px] rounded-full border-[84px] border-[#214f3c]/10 sm:size-[600px]"/>
        <div className="pointer-events-none absolute right-[8%] top-[18%] hidden h-80 w-56 rotate-6 rounded-[44px] bg-[#214f3c]/15 lg:block"/>
        <div className="pointer-events-none absolute right-[27%] top-[28%] hidden size-28 -rotate-6 rounded-[28px] bg-white/45 lg:block"/>
      </div>
    </section>

    <section id="categories" className="container-shell py-12">
      <SectionHeading eyebrow="Ангилал" title="Өдөр тутмын хэрэгцээгээр" href="/shop"/>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map((category)=><Link key={category.id} href={`/category/${category.slug}`} className="group overflow-hidden rounded-[24px] border border-[#dedbd3] bg-white shadow-[0_12px_35px_rgba(25,31,27,.04)]"><div className="relative aspect-[4/3]"><Image src={category.imageUrl} fill alt={category.name} className="object-cover transition duration-500 group-hover:scale-[1.03]"/></div><div className="p-5"><div className="text-lg font-black tracking-tight">{category.name.toUpperCase()}</div><p className="mt-2 text-xs leading-5 text-[#6d716b]">{category.description}</p></div></Link>)}</div>
    </section>

    <section className="container-shell py-12"><SectionHeading eyebrow="NOVA pick" title="Онцлох бараанууд" href="/shop"/><ProductGrid products={featured}/></section>

    <section className="container-shell py-12"><div className="overflow-hidden rounded-[32px] bg-[#171816] px-6 py-12 text-white sm:px-10 lg:px-14"><div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end"><div><p className="eyebrow !text-white/50">Яагаад NOVA?</p><h2 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Үнэ нь ойлгомжтой. Сонголт нь цөөн. Хэрэглээ нь бодит.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-white/60">Marketplace reference үнэ, source record, stock болон order history-г admin талаас хянадаг бүтэцтэй. Demo review, хиймэл хямдрал ашиглахгүй.</p></div><div className="grid gap-3 text-sm text-white/75"><div className="flex items-center gap-3"><BadgeCheck size={18}/> Source мэдээлэл admin-д хадгалагдана</div><div className="flex items-center gap-3"><PackageCheck size={18}/> Stock checkout дээр дахин шалгагдана</div><div className="flex items-center gap-3"><ShieldCheck size={18}/> Үнэ client-ээс биш server-ээс баталгаажна</div></div></div></div></section>

    <section className="container-shell py-12"><SectionHeading eyebrow="Шинэ" title="Сүүлд нэмэгдсэн" href="/shop"/><ProductGrid products={newest}/></section>
    <section className="container-shell py-12"><SectionHeading eyebrow="Хит" title="Эхний collection" href="/shop?sort=popular"/><ProductGrid products={best}/></section>

    <section className="container-shell py-10"><div className="grid gap-4 md:grid-cols-3">{[[Truck,"Хүргэлт","₮150,000-аас дээш захиалгад хүргэлт үнэгүй."],[PackageCheck,"Бодит stock","Checkout эхлэхэд үлдэгдлийг server/database түвшинд дахин шалгана."],[ShieldCheck,"Аюулгүй төлбөр","Payment key холбогдсоны дараа төлбөр зөвхөн server талд үүснэ."]].map(([Icon,title,body])=>{const I=Icon as typeof Truck;return <div key={String(title)} className="surface p-6"><I size={22}/><h3 className="mt-5 font-bold">{String(title)}</h3><p className="muted mt-2 text-sm leading-6">{String(body)}</p></div>})}</div></section>
  </>;
}
