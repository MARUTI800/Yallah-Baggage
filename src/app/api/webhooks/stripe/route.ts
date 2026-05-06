import { NextResponse } from "next/server"
import Stripe from "stripe"
import { headers } from "next/headers"
import { getSupabaseServer } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Webhook signature verification failed.", error.message)
      return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
    }
    return NextResponse.json({ error: "Webhook Error: Unknown error" }, { status: 400 })
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const bookingId = paymentIntent.metadata.bookingId

    if (bookingId) {
      const supabase = getSupabaseServer()

      // Only update if still pending — the confirm-payment API may have already
      // set it to "confirmed". This webhook acts as a safety net / backup.
      const { data: booking } = await supabase
        .from("bookings")
        .select("status")
        .eq("id", bookingId)
        .single()

      if (booking && booking.status === "pending_payment") {
        const { error } = await supabase
          .from("bookings")
          .update({
            status: "confirmed",
            paid_at: new Date().toISOString(),
            payment_reference: paymentIntent.id,
          })
          .eq("id", bookingId)

        if (error) {
          console.error("Failed to update booking status in DB:", error)
        }
      } else if (booking && booking.status === "confirmed") {
        // Already confirmed by the client-side call; just store the Stripe reference
        const { error } = await supabase
          .from("bookings")
          .update({ payment_reference: paymentIntent.id })
          .eq("id", bookingId)

        if (error) {
          console.error("Failed to store Stripe payment reference:", error)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
