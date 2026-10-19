import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/cart/checkout-form";
import { getProducts } from "@/lib/data/catalog";
export default async function CheckoutPage(){const user=await getCurrentUser();if(!user)redirect("/login?next=/checkout");const products=await getProducts();return <section className="container-shell py-10"><CheckoutForm products={products}/></section>}
