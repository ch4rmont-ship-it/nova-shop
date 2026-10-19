import { CheckoutForm } from "@/components/cart/checkout-form";
import { getProducts } from "@/lib/data/catalog";
export default async function CheckoutPage(){const products=await getProducts();return <section className="container-shell py-10"><CheckoutForm products={products}/></section>}
