import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/product/product-grid";
import { getCategoryBySlug, getProducts } from "@/lib/data/catalog";
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) { const {slug}=await params; const [category,products]=await Promise.all([getCategoryBySlug(slug),getProducts()]); if(!category) notFound(); const filtered=products.filter(p=>p.categoryId===category.id); return <section className="container-shell py-10"><p className="eyebrow">Category</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">{category.name}</h1><p className="muted mb-9 mt-3 max-w-2xl">{category.description}</p><ProductGrid products={filtered}/></section>; }
