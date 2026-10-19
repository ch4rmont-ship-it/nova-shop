import { categories as seedCategories, products as seedProducts } from "@/data/catalog";
import { supabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/types";

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    brand: String(row.brand || "NOVA Select"),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description || ""),
    imageUrl: String(row.image_url || "/categories/drive.svg"),
    active: Boolean(row.active)
  };
}

function mapProduct(row: Record<string, unknown>): Product {
  const imageRows = Array.isArray(row.product_images) ? row.product_images as Array<Record<string, unknown>> : [];
  return {
    id: String(row.id),
    categoryId: String(row.category_id),
    brand: String(row.brand || "NOVA Select"),
    name: String(row.name),
    slug: String(row.slug),
    sku: String(row.sku),
    shortDescription: String(row.short_description || ""),
    description: String(row.description || ""),
    priceCents: Number(row.price_cents),
    salePriceCents: row.sale_price_cents == null ? null : Number(row.sale_price_cents),
    stock: Number(row.stock),
    featured: Boolean(row.featured),
    bestseller: Boolean(row.bestseller),
    active: Boolean(row.active),
    rating: Number(row.rating || 0),
    reviewCount: Number(row.review_count || 0),
    specifications: (row.specifications || {}) as Record<string, string>,
    images: imageRows.length ? imageRows.sort((a,b)=>(Number(Boolean(b.is_primary))-Number(Boolean(a.is_primary))) || Number(a.sort_order)-Number(b.sort_order)).map((i)=>String(i.url)) : ["/products/magnetic-car-mount.svg"],
    createdAt: String(row.created_at || new Date(0).toISOString())
  };
}

export async function getCategories(): Promise<Category[]> {
  if (!supabaseConfigured()) return seedCategories;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("categories").select("*").eq("active", true).order("name");
    if (error || !data?.length) return seedCategories;
    return data.map((row) => mapCategory(row as Record<string, unknown>));
  } catch { return seedCategories; }
}

export async function getProducts(): Promise<Product[]> {
  if (!supabaseConfigured()) return seedProducts;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(id,url,sort_order,is_primary)")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error || !data?.length) return seedProducts;
    return data.map((row) => mapProduct(row as unknown as Record<string, unknown>));
  } catch { return seedProducts; }
}

export async function getProductBySlug(slug: string) {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) || null;
}

export async function getCategoryBySlug(slug: string) {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) || null;
}
