import { FavoritesClient } from "@/components/product/favorites-page";
import { getProducts } from "@/lib/data/catalog";
export default async function FavoritesPage(){const products=await getProducts();return <section className="container-shell py-10"><p className="eyebrow">Saved</p><h1 className="mb-8 mt-2 text-4xl font-black">Favorites</h1><FavoritesClient products={products}/></section>}
