import type { Product } from "@/types";
import { ProductCard } from "./product-card";

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <div className="surface p-12 text-center"><h3 className="text-lg font-bold">No products found</h3><p className="muted mt-2 text-sm">Try changing your search or filters.</p></div>;
  return <div className="grid-auto">{products.map((p)=><ProductCard key={p.id} product={p}/>)}</div>;
}
