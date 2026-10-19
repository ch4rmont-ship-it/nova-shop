import { CartPageClient } from "@/components/cart/cart-page";
import { getProducts } from "@/lib/data/catalog";
export default async function CartPage(){const products=await getProducts();return <section className="container-shell py-10"><CartPageClient products={products}/></section>;}
