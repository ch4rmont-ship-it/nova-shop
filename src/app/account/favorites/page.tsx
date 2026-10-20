import { FavoritesClient } from "@/components/product/favorites-page";
import { getProducts } from "@/lib/data/catalog";
export default async function AccountFavoritesPage(){const products=await getProducts();return <div><p className="eyebrow">Миний NOVA / Сонголтууд</p><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Танд таалагдсан.</h1><p className="muted mb-7 mt-3 text-sm">Хэрэг болох зүйлсээ хадгалаад, хүссэн үедээ эргэж хараарай.</p><FavoritesClient products={products}/></div>}
