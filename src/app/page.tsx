import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from "lucide-react";
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
      <div className="relative min-h-[540px] overflow-hidden rounded-[32px] bg-[#dfe8e2] p-6 sm:p-10 lg:p-14">
        <div className="relative z-10 flex min-h-[450px] max-w-2xl flex-col justify-end">
          <p className="eyebrow mb-4">Autumn edit · 2026</p>
          <h1 className="max-w-2xl text-5xl font-black leading-[.92] tracking-[-.055em] sm:text-7xl lg:text-[92px]">Less noise.<br/>Better things.</h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#36433b]">A focused collection of apparel, technology and home essentials selected for everyday usefulness.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link className="btn-primary" href="/shop">Shop the collection <ArrowRight size={17}/></Link><Link className="btn-secondary bg-white/70" href="#categories">Explore categories</Link></div>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-24 size-[420px] rounded-full border-[80px] border-[#214f3c]/10 sm:size-[560px]"/>
        <div className="pointer-events-none absolute right-[8%] top-[20%] hidden h-72 w-52 rotate-6 rounded-[42px] bg-[#214f3c]/15 lg:block"/>
      </div>
    </section>

    <section id="categories" className="container-shell py-12">
      <SectionHeading eyebrow="Browse" title="Shop by category" href="/shop"/>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{categories.map((category)=><Link key={category.id} href={`/category/${category.slug}`} className="group overflow-hidden rounded-[22px] border border-[#dedbd3] bg-white"><div className="relative aspect-[4/3]"><Image src={category.imageUrl} fill alt={category.name} className="object-cover transition duration-500 group-hover:scale-[1.03]"/></div><div className="p-4"><div className="font-bold">{category.name}</div><p className="mt-1 text-xs leading-5 text-[#6d716b]">{category.description}</p></div></Link>)}</div>
    </section>

    <section className="container-shell py-12"><SectionHeading eyebrow="New season" title="Featured products" href="/shop"/><ProductGrid products={featured}/></section>

    <section className="container-shell py-12"><div className="overflow-hidden rounded-[30px] bg-[#171816] px-6 py-12 text-white sm:px-10 lg:px-14"><div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end"><div><p className="eyebrow !text-white/50">NOVA membership</p><h2 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Keep the good stuff close.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-white/60">Create an account to save favorites, manage addresses and keep every order in one place.</p></div><div className="lg:text-right"><Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black">Create account <ArrowRight size={16}/></Link></div></div></div></section>

    <section className="container-shell py-12"><SectionHeading eyebrow="Just in" title="New arrivals" href="/shop"/><ProductGrid products={newest}/></section>

    <section className="container-shell py-12"><SectionHeading eyebrow="Community favorites" title="Best sellers" href="/shop?sort=popular"/><ProductGrid products={best}/></section>

    <section className="container-shell py-10"><div className="grid gap-4 md:grid-cols-3">{[[Truck,"Fast delivery","Tracked shipping with transparent rates."],[RotateCcw,"30-day returns","Straightforward returns on eligible products."],[ShieldCheck,"Secure checkout","Server-validated pricing and Stripe payments."]].map(([Icon,title,body])=>{const I=Icon as typeof Truck;return <div key={String(title)} className="surface p-6"><I size={22}/><h3 className="mt-5 font-bold">{String(title)}</h3><p className="muted mt-2 text-sm leading-6">{String(body)}</p></div>})}</div></section>

  </>;
}
