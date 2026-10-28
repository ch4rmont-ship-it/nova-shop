import { redirect } from "next/navigation";
import { supabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  if (!supabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      if (error.name !== "AuthSessionMissingError") console.warn("NOVA session verification failed:", error.code || error.name);
      return null;
    }
    return data.user;
  } catch { return null; }
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("id,full_name,phone,avatar_url,role,created_at").eq("id", user.id).maybeSingle();
  return data ? { ...data, email: user.email || "" } : { id: user.id, full_name: user.user_metadata?.full_name || "", phone: "", avatar_url: null, role: "customer", created_at: user.created_at, email: user.email || "" };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (error) throw new Error("Admin эрхийг шалгаж чадсангүй. Дахин оролдоно уу.");
  if (data?.role !== "admin") redirect("/admin-access");
  return user;
}
