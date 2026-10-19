"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { safeSiteUrl } from "@/lib/utils";
import { supabaseConfigured } from "@/lib/env";

function fail(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  if (!supabaseConfigured()) fail("/login", "Supabase is not configured yet.");
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/account");
  if (!email || !password) fail("/login", "Email and password are required.");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) fail("/login", error.message);
  revalidatePath("/", "layout");
  redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/account");
}

export async function registerAction(formData: FormData) {
  if (!supabaseConfigured()) fail("/register", "Supabase is not configured yet.");
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (fullName.length < 2 || !email || password.length < 8) fail("/register", "Use a valid name, email and a password with at least 8 characters.");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName }, emailRedirectTo: `${safeSiteUrl()}/auth/confirm?next=/account` }
  });
  if (error) fail("/register", error.message);
  if (data.session) redirect("/account");
  redirect(`/login?message=${encodeURIComponent("Check your email to confirm your account.")}`);
}

export async function forgotPasswordAction(formData: FormData) {
  if (!supabaseConfigured()) fail("/forgot-password", "Supabase is not configured yet.");
  const email = String(formData.get("email") || "").trim();
  if (!email) fail("/forgot-password", "Enter your email address.");
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${safeSiteUrl()}/auth/confirm?next=/reset-password` });
  if (error) fail("/forgot-password", error.message);
  redirect(`/forgot-password?message=${encodeURIComponent("Password reset link sent.")}`);
}

export async function resetPasswordAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (password.length < 8) fail("/reset-password", "Password must be at least 8 characters.");
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) fail("/reset-password", error.message);
  redirect(`/login?message=${encodeURIComponent("Password updated. Sign in with your new password.")}`);
}

export async function logoutAction() {
  if (supabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/");
}
