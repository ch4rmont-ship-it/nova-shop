import { FavoritesClient } from "@/components/product/favorites-page";
import { getProducts } from "@/lib/data/catalog";
export default async function AccountFavoritesPage(){const products=await getProducts();return <div><p className="eyebrow">Saved</p><h1 className="mb-8 mt-2 text-4xl font-black">Хадгалсан</h1><FavoritesClient products={products}/></div>}
