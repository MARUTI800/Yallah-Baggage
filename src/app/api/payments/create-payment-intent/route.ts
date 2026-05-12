import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe secret key not configured" },
      { status: 500 },
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServer();
    const { data: booking, error: dbError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (dbError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Use the actual total price from the booking (calculated by frontend)
    const amount = (booking.total_price || 0) * 100; // Convert to fils/cents

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Invalid booking amount" },
        { status: 400 },
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "aed",
      metadata: {
        bookingId: booking.id,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
