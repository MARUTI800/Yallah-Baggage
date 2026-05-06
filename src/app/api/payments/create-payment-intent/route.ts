import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getSupabaseServer } from "@/lib/supabase/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json()

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 })
    }

    const supabase = getSupabaseServer()
    const { data: booking, error: dbError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (dbError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 })
    }

    // Default pricing logic: 40 AED per bag. Change this as needed!
    const PRICE_PER_BAG = 40
    const amount = booking.number_of_bags * PRICE_PER_BAG * 100 // Convert to fils/cents

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "aed",
      metadata: {
        bookingId: booking.id,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Stripe error:", error)
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}
