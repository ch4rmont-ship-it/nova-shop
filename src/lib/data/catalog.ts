import { unstable_rethrow } from "next/navigation";
import { supabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/types";
import {getLocale} from "@/lib/i18n-server";
import {localizeCategory,localizeProduct} from "@/lib/catalog/catalog-localize";
import type {Locale} from "@/lib/i18n";

function mapCategory(row: Record<string, unknown>,locale:Locale): Category {
  return {
    id: String(row.id),
    name: localizeCategory(String(row.slug),String(row.name),locale),
    slug: String(row.slug),
    description: String(row.description||""),
    imageUrl: String(row.image_url || "/categories/drive.svg"),
    active: Boolean(row.active)
  };
}

function mapProduct(row: Record<string, unknown>,locale:Locale): Product {
  const translated=localizeProduct({name:String(row.name),short_description:String(row.short_description||""),description:String(row.description||""),specifications:row.specifications},locale);
  const imageRows = Array.isArray(row.product_images) ? row.product_images as Array<Record<string, unknown>> : [];
  return {
    id: String(row.id),
    categoryId: String(row.category_id),
    brand: String(row.brand || "SmartShop Select"),
    name: translated.name,
    slug: String(row.slug),
    sku: String(row.sku),
    shortDescription: translated.short,
    description: translated.description,
    priceCents: Number(row.price_cents),
    salePriceCents: row.sale_price_cents == null ? null : Number(row.sale_price_cents),
    stock: Number(row.stock),
    preorder: Boolean(row.preorder),
    sourceUrl: row.source_public_url ? String(row.source_public_url) : undefined,
    featured: Boolean(row.featured),
    bestseller: Boolean(row.bestseller),
    active: Boolean(row.active),
    rating: Number(row.rating || 0),
    reviewCount: Number(row.review_count || 0),
    specifications: translated.visible,
    searchTerms: translated.searchTerms,
    isPreview: translated.isPreview,
    images: imageRows.length ? imageRows.sort((a,b)=>(Number(Boolean(b.is_primary))-Number(Boolean(a.is_primary))) || Number(a.sort_order)-Number(b.sort_order)).map((i)=>String(i.url)) : ["/catalog-images/fallback.svg"],
    createdAt: String(row.created_at || new Date(0).toISOString())
  };
}

export async function getCategories(): Promise<Category[]> {
  if (!supabaseConfigured()) return [];
  try {
    const [supabase,locale] = await Promise.all([createClient(),getLocale()]);
    const { data, error } = await supabase.from("categories").select("*").eq("active", true).order("name");
    if (error) throw new Error(error.message);
    return (data || []).map((row) => mapCategory(row as Record<string, unknown>,locale));
  } catch (error) { unstable_rethrow(error); console.error("SmartShop catalog categories failed", error); return []; }
}

export async function getProducts(): Promise<Product[]> {
  if (!supabaseConfigured()) return [];
  try {
    const [supabase,locale] = await Promise.all([createClient(),getLocale()]);
    const { data, error } = await supabase
      .from("products")
      .select("*, product_images(id,url,sort_order,is_primary)")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((row) => mapProduct(row as unknown as Record<string, unknown>,locale));
  } catch (error) { unstable_rethrow(error); console.error("SmartShop catalog products failed", error); return []; }
}

export async function getProductBySlug(slug: string) {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) || null;
}

export async function getCategoryBySlug(slug: string) {
  const all = await getCategories();
  return all.find((c) => c.slug === slug) || null;
}
