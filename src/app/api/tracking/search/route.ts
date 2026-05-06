import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const rawEmail = body.email?.trim()
    const rawPhone = body.phone?.trim()
    const rawTracking = body.trackingCode?.trim()

    if (!rawEmail || !rawPhone || !rawTracking) {
      return NextResponse.json(
        { error: "Email, phone, and tracking code are required." },
        { status: 400 },
      )
    }

    // Sanitize inputs for robust matching
    const email = rawEmail.toLowerCase()
    
    // Ensure phone only contains digits and a leading plus
    const phone = rawPhone.replace(/[^\d+]/g, '')

    // Extract alphanumeric characters only, force uppercase
    let trackingCode = rawTracking.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    // If it starts with YB but doesn't have a hyphen, insert it. If it doesn't start with YB, prepend it.
    if (trackingCode.startsWith('YB')) {
      trackingCode = 'YB-' + trackingCode.substring(2)
    } else {
      trackingCode = 'YB-' + trackingCode
    }

    const supabase = getSupabaseServer()

    // Fetch the booking that exactly matches all three fields
    const { data: booking, error: dbError } = await supabase
      .from("bookings")
      .select("*")
      .eq("email", email)
      .eq("phone", phone)
      .eq("tracking_code", trackingCode)
      .single()

    if (dbError || !booking) {
      return NextResponse.json(
        { error: "No order found matching these details. Please check your tracking code." },
        { status: 404 },
      )
    }

    // Return sanitized booking details
    const sanitized = {
      id: booking.id,
      status: booking.status,
      pickupLocation: booking.pickup_location,
      dropoffLocation: booking.dropoff_location,
      pickupDate: booking.pickup_date,
      pickupTime: booking.pickup_time,
      deliveryDate: booking.delivery_date,
      deliveryTime: booking.delivery_time,
      numberOfBags: booking.number_of_bags,
      firstName: booking.first_name,
      lastName: booking.last_name,
      trackingCode: booking.tracking_code,
      createdAt: booking.created_at,
      paidAt: booking.paid_at,
    }

    return NextResponse.json({ ok: true, booking: sanitized })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 },
    )
  }
}
