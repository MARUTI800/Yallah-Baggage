import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import { getSupabaseServer } from "@/lib/supabase/server";
import { isCodPayment } from "@/lib/booking-payment";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe secret key not configured" },
      { status: 500 },
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook secret not configured" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Webhook Error: ${error.message}` },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Webhook Error: Unknown error" },
      { status: 400 },
    );
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const bookingId = paymentIntent.metadata.bookingId;

    if (bookingId) {
      const supabase = getSupabaseServer();

      // Only update if still pending — the confirm-payment API may have already
      // set it to "confirmed". This webhook acts as a safety net / backup.
      const { data: booking } = await supabase
        .from("bookings")
        .select("status, payment_method")
        .eq("id", bookingId)
        .single();

      // Don't process webhook for COD bookings
      if (booking && isCodPayment(booking.payment_method)) {
        return NextResponse.json({ received: true });
      }

      if (booking && booking.status === "pending_payment") {
        // Generate tracking code as a backup if it hasn't been done yet
        const { count } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true });

        const nextId = (count || 0) + 1;
        const trackingCode = `YB-${String(nextId).padStart(3, "0")}`;

        const { error } = await supabase
          .from("bookings")
          .update({
            status: "confirmed",
            paid_at: new Date().toISOString(),
            tracking_code: trackingCode,
          })
          .eq("id", bookingId);

        if (error) {
          // Silently fail - webhook is a backup mechanism
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
