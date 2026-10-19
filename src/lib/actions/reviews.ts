"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export async function saveReviewAction(formData: FormData) {
  const user = await requireUser();
  const productId = String(formData.get("productId") || "");
  const slug = String(formData.get("slug") || "");
  const rating = Math.floor(Number(formData.get("rating") || 0));
  const title = String(formData.get("title") || "").trim();
  const comment = String(formData.get("comment") || "").trim();
  if (!productId || rating < 1 || rating > 5 || title.length < 2 || comment.length < 3) redirect(`/product/${slug}?reviewError=${encodeURIComponent("Complete the rating, title and comment.")}`);
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
  const author = (profile?.full_name || "Verified customer").trim().split(/\s+/).slice(0, 2).join(" ").slice(0, 80) || "Verified customer";
  const { error } = await supabase.from("reviews").upsert({ user_id: user.id, product_id: productId, rating, title, comment, author_name: author }, { onConflict: "user_id,product_id" });
  if (error) redirect(`/product/${slug}?reviewError=${encodeURIComponent(error.message)}`);
  revalidatePath(`/product/${slug}`);
  redirect(`/product/${slug}?reviewMessage=${encodeURIComponent("Review saved.")}#reviews`);
}
