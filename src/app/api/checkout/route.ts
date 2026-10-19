import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { serverSupabaseConfigured } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { safeSiteUrl } from "@/lib/utils";

const schema = z.object({
  items: z.array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(99) })).min(1).max(100),
  address: z.object({
    fullName: z.string().min(2).max(120), email: z.string().email(), phone: z.string().min(5).max(40), country: z.string().min(2).max(80),
    city: z.string().min(1).max(100), state: z.string().max(100).default(""), addressLine1: z.string().min(3).max(200), postalCode: z.string().min(2).max(30)
  })
});

export async function POST(request: Request) {
  if (!serverSupabaseConfigured()) return NextResponse.json({ error: "Checkout needs Supabase server credentials. Add them to .env.local." }, { status: 503 });
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY." }, { status: 503 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the cart and delivery information." }, { status: 400 });

  const admin = createAdminClient();
  const ids = parsed.data.items.map((i) => i.productId);
  const { data: products, error: productError } = await admin.from("products").select("id,name,slug,price_cents,sale_price_cents,stock,active").in("id", ids);
  if (productError || !products || products.length !== new Set(ids).size) return NextResponse.json({ error: "One or more products are unavailable." }, { status: 409 });

  const productMap = new Map(products.map((p) => [p.id, p]));
  let subtotal = 0;
  for (const item of parsed.data.items) {
    const product = productMap.get(item.productId);
    if (!product || !product.active || product.stock < item.quantity) return NextResponse.json({ error: `${product?.name || "A product"} does not have enough stock.` }, { status: 409 });
    const unit = product.sale_price_cents && product.sale_price_cents < product.price_cents ? product.sale_price_cents : product.price_cents;
    subtotal += unit * item.quantity;
  }
  const shippingCents = subtotal >= 10000 ? 0 : 1200;

  let userId: string | null = null;
  try { const supabase = await createClient(); const { data } = await supabase.auth.getUser(); userId = data.user?.id || null; } catch { userId = null; }

  const rpcItems = parsed.data.items.map((item) => ({ product_id: item.productId, quantity: item.quantity }));
  const { data: created, error: orderError } = await admin.rpc("create_pending_order", {
    p_user_id: userId,
    p_customer_email: parsed.data.address.email,
    p_shipping_address: parsed.data.address,
    p_items: rpcItems,
    p_shipping_cents: shippingCents
  });
  if (orderError || !created) return NextResponse.json({ error: orderError?.message || "Could not reserve stock." }, { status: 409 });

  const order = Array.isArray(created) ? created[0] : created;
  const orderId = order.order_id as string;
  try {
    const stripe = getStripe();
    const lineItems = parsed.data.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const unit = product.sale_price_cents && product.sale_price_cents < product.price_cents ? product.sale_price_cents : product.price_cents;
      return { quantity: item.quantity, price_data: { currency: "usd", unit_amount: unit, product_data: { name: product.name, metadata: { product_id: product.id } } } };
    });
    if (shippingCents) lineItems.push({ quantity: 1, price_data: { currency: "usd", unit_amount: shippingCents, product_data: { name: "Standard tracked shipping", metadata: { product_id: "shipping" } } } });
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: parsed.data.address.email,
      line_items: lineItems,
      success_url: `${safeSiteUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${safeSiteUrl()}/checkout/cancel?order_id=${orderId}`,
      client_reference_id: orderId,
      metadata: { order_id: orderId, order_number: String(order.order_number) },
      payment_intent_data: { metadata: { order_id: orderId } }
    });
    await admin.from("orders").update({ stripe_session_id: session.id }).eq("id", orderId);
    return NextResponse.json({ url: session.url, orderNumber: order.order_number });
  } catch (error) {
    await admin.rpc("release_order_stock", { p_order_id: orderId, p_reason: "stripe_session_creation_failed" });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Stripe checkout could not be created." }, { status: 500 });
  }
}
