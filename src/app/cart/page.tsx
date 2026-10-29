import { CartPageClient } from "@/components/cart/cart-page";
import { getProducts } from "@/lib/data/catalog";
import {getLocale} from "@/lib/i18n-server";
export default async function CartPage(){const [products,locale]=await Promise.all([getProducts(),getLocale()]);return <section className="container-shell py-10"><CartPageClient products={products} locale={locale}/></section>;}
