import { ShopClient } from "@/components/product/shop-client";
import { getCategories, getProducts } from "@/lib/data/catalog";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string }> }) {
  const [{ q = "", sort = "newest" }, products, categories] = await Promise.all([searchParams, getProducts(), getCategories()]);
  return <section className="container-shell py-10"><p className="eyebrow">Collection</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Shop everything</h1><p className="muted mb-10 mt-3 max-w-2xl">A concise edit of useful products across apparel, footwear, technology, home and beauty.</p><ShopClient products={products} categories={categories} initialQuery={q} initialSort={sort}/></section>;
}
