"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export async function updateProfileAction(formData: FormData) {
  const user = await requireUser();
  const fullName = String(formData.get("fullName") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  if (fullName.length < 2) redirect("/account?error=Name%20is%20too%20short");
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ full_name: fullName, phone }).eq("id", user.id);
  if (error) redirect(`/account?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/account");
  redirect("/account?message=Profile%20updated");
}

export async function saveAddressAction(formData: FormData) {
  const user = await requireUser();
  const row = {
    user_id: user.id,
    label: String(formData.get("label") || "Home").trim() || "Home",
    full_name: String(formData.get("fullName") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    country: String(formData.get("country") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    state: String(formData.get("state") || "").trim(),
    address_line1: String(formData.get("addressLine1") || "").trim(),
    postal_code: String(formData.get("postalCode") || "").trim(),
    is_default: formData.get("isDefault") === "on"
  };
  if (!row.full_name || !row.country || !row.city || !row.address_line1 || !row.postal_code) redirect("/account/addresses?error=Complete%20all%20required%20fields");
  const supabase = await createClient();
  if (row.is_default) await supabase.from("addresses").update({ is_default: false }).eq("user_id", user.id);
  const { error } = await supabase.from("addresses").insert(row);
  if (error) redirect(`/account/addresses?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/account/addresses");
  redirect("/account/addresses?message=Address%20saved");
}

export async function deleteAddressAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const supabase = await createClient();
  await supabase.from("addresses").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/account/addresses");
}
