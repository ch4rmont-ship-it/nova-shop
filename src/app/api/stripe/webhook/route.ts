import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook secret missing" }, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  const body = await request.text();
  let event: Stripe.Event;
  try { event = getStripe().webhooks.constructEvent(body, signature, secret); }
  catch { return NextResponse.json({ error: "Invalid Stripe signature" }, { status: 400 }); }
  const admin = createServiceClient();

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    if (orderId) {
      const { data: order } = await admin.from("orders").select("total_cents").eq("id", orderId).maybeSingle();
      if (order && session.amount_total === order.total_cents) await admin.rpc("mark_order_paid", { p_order_id: orderId, p_stripe_session_id: session.id, p_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null });
    }
  }
  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const paymentIntentId = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
    if (paymentIntentId) {
      const { data: order } = await admin.from("orders").select("id").eq("stripe_payment_intent_id", paymentIntentId).maybeSingle();
      if (order) await admin.rpc("refund_order_and_restore_stock", { p_order_id: order.id });
    }
  }
  if (event.type === "checkout.session.expired" || event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;
    if (orderId) await admin.rpc("release_order_stock", { p_order_id: orderId, p_reason: event.type });
  }
  return NextResponse.json({ received: true });
}
