import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { calculateBookingPrice } from "@/lib/pricing";
import { normalizePaymentMethod } from "@/lib/booking-payment";

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
  hasChauffeur?: boolean;
  hasLuggage?: boolean;
  promoDiscount?: number;
  isInternational?: boolean;
  distanceKm?: number;
  isSurge?: boolean;
  promoCode?: string;
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
    // Fallback to client-provided distance if server-side calculation fails or returns 0
    let distanceKm = typeof body.distanceKm === "number" ? body.distanceKm : 0;
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
          const calculatedDistance = distanceData.rows[0].elements[0].distance.value / 1000;
          if (calculatedDistance > 0) {
            distanceKm = calculatedDistance;
          }
        }
      }
    } catch (err) {
      console.error("Failed to calculate live distance server-side:", err);
    }

    // Determine surge status: query DB directly to avoid localhost loopback fetch failure in serverless env,
    // and fall back to the client-submitted surge status if needed.
    let isSurge = typeof body.isSurge === "boolean" ? body.isSurge : false;
    try {
      const { data: bookings, error: surgeDbError } = await supabase
        .from("bookings")
        .select("pickup_time")
        .eq("pickup_date", pickupDate)
        .not("status", "eq", "canceled");

      if (!surgeDbError && bookings) {
        const reqTimeMatch = pickupTime.match(/(\d+):(\d+)\s(AM|PM)/);
        if (reqTimeMatch) {
          let reqH = parseInt(reqTimeMatch[1]);
          const reqM = parseInt(reqTimeMatch[2]);
          const reqIsPM = reqTimeMatch[3] === "PM";
          if (reqIsPM && reqH !== 12) reqH += 12;
          if (!reqIsPM && reqH === 12) reqH = 0;
          const reqMinutes = reqH * 60 + reqM;

          let overlappingCount = 0;
          for (const b of bookings) {
            if (!b.pickup_time) continue;
            const bTimeMatch = b.pickup_time.match(/(\d+):(\d+)(?::\d+)?(?:\s(AM|PM))?/);
            if (!bTimeMatch) continue;

            let bH = parseInt(bTimeMatch[1]);
            const bM = parseInt(bTimeMatch[2]);
            if (bTimeMatch[3]) {
              const bIsPM = bTimeMatch[3] === "PM";
              if (bIsPM && bH !== 12) bH += 12;
              if (!bIsPM && bH === 12) bH = 0;
            }
            const bMinutes = bH * 60 + bM;
            const diff = Math.abs(reqMinutes - bMinutes);
            if (diff <= 60) {
              overlappingCount++;
            }
          }
          const SURGE_THRESHOLD = 3;
          isSurge = overlappingCount >= SURGE_THRESHOLD;
        }
      }
    } catch (err) {
      console.error("Failed to query surge status directly server-side:", err);
    }

    // Securely calculate promo discount server-side using promo_codes table (same DB as admin panel)
    let promoDiscount = 0;
    let appliedPromo: { code: string; uses_count: number } | null = null;
    const cleanPromoCode = body.promoCode?.trim()?.toUpperCase();
    if (cleanPromoCode) {
      try {
        const { data: promo } = await supabase
          .from("promo_codes")
          .select("*")
          .eq("code", cleanPromoCode)
          .eq("is_active", true)
          .single();

        if (promo) {
          const isExpired = promo.expires_at && new Date(promo.expires_at) < new Date();
          const isUsageLimitReached = promo.max_uses && promo.uses_count >= promo.max_uses;

          if (!isExpired && !isUsageLimitReached) {
            const prePromoPricing = calculateBookingPrice({
              distanceKm,
              pickupDate,
              deliveryDate,
              regularBags: body.regularBags ?? 0,
              oddSizedItems: body.oddSizedItems ?? 0,
              isSurge,
              hasChauffeur: !!body.hasChauffeur,
              promoDiscount: 0,
              isInternational: !!body.isInternational,
            });

            if (prePromoPricing.total >= (promo.min_booking_amount || 0)) {
              if (promo.discount_type === "amount") {
                promoDiscount = promo.discount_value;
              } else if (promo.discount_type === "percentage") {
                promoDiscount = Math.round(prePromoPricing.total * (promo.discount_value / 100));
              }
              if (promoDiscount > 0) {
                appliedPromo = { code: promo.code, uses_count: promo.uses_count ?? 0 };
              }
            }
          }
        }
      } catch (err) {
        console.error("Failed to verify promo code server-side:", err);
      }
    }

    const pricing = calculateBookingPrice({
      distanceKm,
      pickupDate,
      deliveryDate,
      regularBags: body.regularBags ?? 0,
      oddSizedItems: body.oddSizedItems ?? 0,
      isSurge,
      hasChauffeur: !!body.hasChauffeur,
      promoDiscount,
      isInternational: !!body.isInternational,
    });

    const secureTotalPrice = pricing.total;
    const paymentMethod = normalizePaymentMethod(body.paymentMethod);

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
        service_type: `${body.hasLuggage ? "Luggage" : ""}${body.hasLuggage && body.hasChauffeur ? " + " : ""}${body.hasChauffeur ? "Chauffeur" : ""}`,
        total_price: secureTotalPrice,
        adults: body.adults ?? 1,
        children: body.children ?? 0,
        children_ages: body.childrenAges ?? [],
        payment_method: paymentMethod,
        status: "pending_payment",
        promo_code: cleanPromoCode || null,
        promo_discount: pricing.promoDiscount || 0,
        bag_discount: pricing.bagDiscount || 0,
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message ?? "Failed to create booking." },
        { status: 400 },
      );
    }

    if (appliedPromo) {
      await supabase
        .from("promo_codes")
        .update({ uses_count: appliedPromo.uses_count + 1 })
        .eq("code", appliedPromo.code);
    }

    return NextResponse.json({ bookingId: data.id });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 },
    );
  }
}
