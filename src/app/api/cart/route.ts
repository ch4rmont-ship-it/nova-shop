import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const payloadSchema = z.object({ items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(99) })).max(100) });

async function authClient() {
  if (!supabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ? { supabase, user: data.user } : null;
}

export async function GET() {
  const auth = await authClient();
  if (!auth) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const { data, error } = await auth.supabase.from("cart_items").select("product_id,quantity").eq("user_id", auth.user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items: (data || []).map((row) => ({ productId: row.product_id, quantity: row.quantity })) });
}

export async function POST(request: Request) {
  const auth = await authClient();
  if (!auth) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart payload" }, { status: 400 });
  const { error: deleteError } = await auth.supabase.from("cart_items").delete().eq("user_id", auth.user.id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 400 });
  if (parsed.data.items.length) {
    const { error } = await auth.supabase.from("cart_items").insert(parsed.data.items.map((item) => ({ user_id: auth.user.id, product_id: item.productId, quantity: item.quantity })));
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
