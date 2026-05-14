import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { calculateBookingPrice } from "@/lib/pricing";

type CreateBookingBody = {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numberOfBags: number;
  regularBags?: number;
  oddSizedItems?: number;
  notes?: string;
  totalPrice?: number;
  adults?: number;
  children?: number;
  childrenAges?: string[];
  paymentMethod?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateBookingBody>;

    const pickupLocation = body.pickupLocation?.trim();
    const dropoffLocation = body.dropoffLocation?.trim();
    const pickupDate = body.pickupDate?.trim();
    const pickupTime = body.pickupTime?.trim();
    const deliveryDate = body.deliveryDate?.trim();
    const deliveryTime = body.deliveryTime?.trim();
    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim()?.toLowerCase();
    const phone = body.phone?.trim();
    const numberOfBags =
      typeof body.numberOfBags === "number" ? body.numberOfBags : NaN;

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
      );
    }

    const supabase = getSupabaseServer();

    // Securely calculate distance and surge server-side
    let distanceKm = 0; // no hardcoded fallback — distance must come from live API
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (apiKey) {
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
          pickupLocation,
        )}&destinations=${encodeURIComponent(dropoffLocation)}&key=${apiKey}`;
        const res = await fetch(url);
        const distanceData = await res.json();
        if (
          distanceData.status === "OK" &&
          distanceData.rows[0].elements[0].status === "OK"
        ) {
          distanceKm = distanceData.rows[0].elements[0].distance.value / 1000;
        }
      }
    } catch (err) {
      console.error("Failed to calculate live distance server-side:", err);
    }

    let isSurge = false;
    try {
      // Basic server-side surge check (hitting own endpoint or logic)
      const res = await fetch(
        `${req.headers.get("origin") || "http://localhost:3000"}/api/bookings/surge?date=${encodeURIComponent(pickupDate)}&time=${encodeURIComponent(pickupTime)}`
      );
      if (res.ok) {
        const surgeData = await res.json();
        isSurge = surgeData.isSurge;
      }
    } catch (err) {
      console.error("Failed to fetch surge status server-side:", err);
    }

    const pricing = calculateBookingPrice({
      distanceKm,
      pickupDate,
      deliveryDate,
      regularBags: body.regularBags ?? 0,
      oddSizedItems: body.oddSizedItems ?? 0,
      isSurge,
    });

    const secureTotalPrice = pricing.total;

    const { data, error } = await supabase
      .from("bookings")
      .insert({
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
        regular_bags: body.regularBags ?? 0,
        odd_sized_items: body.oddSizedItems ?? 0,
        notes: body.notes ?? "",
        service_type: "Standard",
        total_price: secureTotalPrice,
        adults: body.adults ?? 1,
        children: body.children ?? 0,
        children_ages: body.childrenAges ?? [],
        payment_method: body.paymentMethod ?? "stripe",
        status: "pending_payment",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message ?? "Failed to create booking." },
        { status: 400 },
      );
    }

    return NextResponse.json({ bookingId: data.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 },
    );
  }
}
