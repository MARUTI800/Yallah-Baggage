import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

type CreateBookingBody = {
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string
  pickupTime: string
  deliveryDate: string
  deliveryTime: string
  firstName: string
  lastName: string
  email: string
  phone: string
  numberOfBags: number
  cabinBags?: number
  largeBags?: number
  additionalItems?: string[]
  notes?: string
  serviceType?: string
  totalPrice?: number
  adults?: number
  children?: number
  childrenAges?: string[]
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateBookingBody>

    const pickupLocation = body.pickupLocation?.trim()
    const dropoffLocation = body.dropoffLocation?.trim()
    const pickupDate = body.pickupDate?.trim()
    const pickupTime = body.pickupTime?.trim()
    const deliveryDate = body.deliveryDate?.trim()
    const deliveryTime = body.deliveryTime?.trim()
    const firstName = body.firstName?.trim()
    const lastName = body.lastName?.trim()
    const email = body.email?.trim()
    const phone = body.phone?.trim()
    const numberOfBags = typeof body.numberOfBags === "number" ? body.numberOfBags : NaN

    if (
      !pickupLocation ||
      !dropoffLocation ||
      !pickupDate ||
      !pickupTime ||
      !deliveryDate ||
      !deliveryTime ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !Number.isFinite(numberOfBags) ||
      numberOfBags <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid booking details." },
        { status: 400 },
      )
    }

    const supabase = getSupabaseServer()

    const basicPayload = {
      pickup_location: pickupLocation,
      dropoff_location: dropoffLocation,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      delivery_date: deliveryDate,
      delivery_time: deliveryTime,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      number_of_bags: numberOfBags,
      status: "pending_payment",
    }

    // Try to insert with advanced fields first
    let res = await supabase
      .from("bookings")
      .insert({
        ...basicPayload,
        cabin_bags: body.cabinBags ?? 0,
        large_bags: body.largeBags ?? 0,
        additional_items: body.additionalItems ?? [],
        notes: body.notes ?? "",
        service_type: body.serviceType ?? "Standard",
        total_price: body.totalPrice ?? 0,
        adults: body.adults ?? 1,
        children: body.children ?? 0,
        children_ages: body.childrenAges ?? [],
      })
      .select("id")
      .single()

    // If it fails (likely due to missing columns in DB), fallback to basic payload
    if (res.error && res.error.message.toLowerCase().includes("could not find the")) {
      console.warn("Advanced columns missing in DB, falling back to basic insert.")
      res = await supabase
        .from("bookings")
        .insert(basicPayload)
        .select("id")
        .single()
    }

    if (res.error) {
      return NextResponse.json(
        { error: res.error.message ?? "Failed to create booking." },
        { status: 400 },
      )
    }

    return NextResponse.json({ bookingId: res.data.id })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 },
    )
  }
}

