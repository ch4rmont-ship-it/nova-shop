import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/cart/checkout-form";
import { getProducts } from "@/lib/data/catalog";
import {createClient} from "@/lib/supabase/server";
export default async function CheckoutPage(){const user=await getCurrentUser();if(!user)redirect("/login?next=/checkout");const db=await createClient();const[products,{data:addresses},{data:profile}]=await Promise.all([getProducts(),db.from("addresses").select("id,label,full_name,phone,country,city,state,address_line1,postal_code").eq("user_id",user.id).order("is_default",{ascending:false}),db.from("profiles").select("full_name,phone").eq("id",user.id).maybeSingle()]);return <section className="container-shell py-10"><CheckoutForm products={products} addresses={addresses||[]} email={user.email||""} fullName={profile?.full_name||""} phone={profile?.phone||""}/></section>}
