import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"
import { Resend } from "resend"
import * as React from "react"
import { BookingConfirmedEmail } from "@/components/emails/booking-confirmed-email"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const bookingId = id
    if (!bookingId) {
      return NextResponse.json({ error: "Missing booking id." }, { status: 400 })
    }

    const supabase = getSupabaseServer()

    // Verify the booking exists and is in pending_payment status
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 })
    }

    if (booking.status !== "pending_payment") {
      return NextResponse.json(
        { error: `Booking is already ${booking.status}.` },
        { status: 400 },
      )
    }

    // Generate a sequential tracking code if one doesn't exist yet
    let trackingCode = booking.tracking_code;
    
    if (!trackingCode) {
      // Get the total number of bookings to create a sequential ID (e.g. YB-001)
      const { count } = await supabase
        .from("bookings")
        .select("*", { count: 'exact', head: true });
        
      const sequentialId = (count || 0) + 1;
      // Pad with zeroes (e.g., 001, 002, ..., 015, ..., 1500)
      trackingCode = `YB-${sequentialId.toString().padStart(3, "0")}`;
    }

    // Build the update payload
    const updatePayload: Record<string, unknown> = {
      status: "confirmed",
      paid_at: new Date().toISOString(),
      tracking_code: trackingCode,
    }

    const { error } = await supabase
      .from("bookings")
      .update(updatePayload)
      .eq("id", bookingId)

    if (error) {
      return NextResponse.json(
        { error: error.message ?? "Failed to confirm payment." },
        { status: 400 },
      )
    }

    // Send confirmation email with tracking details via Resend
    if (process.env.RESEND_API_KEY && booking.email) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://yallahbaggage.com"
        const trackingUrl = `${baseUrl}/track?email=${encodeURIComponent(booking.email)}`

        await resend.emails.send({
          from: "Yallah Baggage <support@yallahbaggage.com>",
          to: [booking.email],
          subject: `✅ Booking Confirmed — ${booking.pickup_location} → ${booking.dropoff_location}`,
          react: BookingConfirmedEmail({
            firstName: booking.first_name,
            trackingCode: trackingCode || "—",
            pickupLocation: booking.pickup_location,
            dropoffLocation: booking.dropoff_location,
            pickupDate: booking.pickup_date,
            pickupTime: booking.pickup_time,
            deliveryDate: booking.delivery_date,
            deliveryTime: booking.delivery_time,
            numberOfBags: booking.number_of_bags,
            cabinBags: booking.cabin_bags ?? 0,
            largeBags: booking.large_bags ?? 0,
            adults: booking.adults ?? 1,
            children: booking.children ?? 0,
            serviceType: booking.service_type ?? "Standard",
            additionalItems: booking.additional_items ?? [],
            totalPrice: booking.total_price ?? 0,
            trackingUrl,
          }) as React.ReactElement,
        })
      } catch (emailError) {
        // Log but don't fail the request — payment is already confirmed
        console.error("Failed to send confirmation email:", emailError)
      }
    }

    return NextResponse.json({ ok: true, status: "confirmed", trackingCode })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 },
    )
  }
}
