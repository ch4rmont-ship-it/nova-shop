import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error("Server Supabase credentials are not configured.");
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
}

// Interactive administration uses the signed-in session and database RLS.
export async function createAdminClient() {
  const { requireAdmin } = await import("@/lib/auth");
  await requireAdmin();
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}
