import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { isCodPayment } from "@/lib/booking-payment";
import { Resend } from "resend";
import * as React from "react";
import { BookingConfirmedEmail } from "@/components/emails/booking-confirmed-email";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function cleanDate(dateStr: string) {
  if (!dateStr) return "—";
  const justDate = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  try {
    const parts = justDate.split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }
    }
  } catch {
    // fallback
  }
  return justDate;
}

function cleanTime(timeStr: string) {
  if (!timeStr) return "—";
  const match = timeStr.match(/^(\d{2}):(\d{2})/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  }
  return timeStr;
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const bookingId = id;
    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing booking id." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServer();

    // Verify the booking exists and is in pending_payment status
    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: 404 },
      );
    }

    if (booking.status !== "pending_payment") {
      if (booking.status === "confirmed") {
        return NextResponse.json({
          ok: true,
          status: "confirmed",
          trackingCode: booking.tracking_code ?? null,
        });
      }
      return NextResponse.json(
        { error: `Booking is already ${booking.status}.` },
        { status: 400 },
      );
    }

    // Generate a sequential tracking code if one doesn't exist yet
    let trackingCode = booking.tracking_code;

    if (!trackingCode) {
      // Get the total number of bookings to create a sequential ID (e.g. YB-001)
      const { count } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true });

      const sequentialId = (count || 0) + 1;
      // Pad with zeroes (e.g., 001, 002, ..., 015, ..., 1500)
      trackingCode = `YB-${sequentialId.toString().padStart(3, "0")}`;
    }

    // Build the update payload
    const updatePayload: Record<string, unknown> = {
      status: "confirmed",
      tracking_code: trackingCode,
    };

    // Only mark as paid for card payments; COD stays confirmed but unpaid
    if (!isCodPayment(booking.payment_method)) {
      updatePayload.paid_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("bookings")
      .update(updatePayload)
      .eq("id", bookingId);

    if (error) {
      return NextResponse.json(
        { error: error.message ?? "Failed to confirm payment." },
        { status: 400 },
      );
    }

    // Send confirmation email with tracking details via Resend
    if (resend && booking.email) {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "https://yallahbaggage.com";
        const trackingUrl = `${baseUrl}/track?email=${encodeURIComponent(booking.email)}`;

        await resend!.emails.send({
          from: "Yallah Baggage <support@yallahbaggage.com>",
          to: [booking.email],
          subject: `✅ Booking Confirmed — ${booking.pickup_location} → ${booking.dropoff_location}`,
          // eslint-disable-next-line react/no-children-prop
          react: React.createElement(BookingConfirmedEmail, {
            firstName: booking.first_name,
            trackingCode: trackingCode || "—",
            pickupLocation: booking.pickup_location,
            dropoffLocation: booking.dropoff_location,
            pickupDate: cleanDate(booking.pickup_date),
            pickupTime: cleanTime(booking.pickup_time),
            deliveryDate: cleanDate(booking.delivery_date),
            deliveryTime: cleanTime(booking.delivery_time),
            numberOfBags: booking.number_of_bags,
            regularBags: booking.regular_bags ?? 0,
            oddSizedItems: booking.odd_sized_items ?? 0,
            adults: booking.adults ?? 1,
            children: booking.children ?? 0,
            totalPrice: booking.total_price ?? 0,
            trackingUrl: trackingUrl,
            hasLuggage: booking.service_type?.includes("Luggage"),
            hasChauffeur: booking.service_type?.includes("Chauffeur"),
            bagDiscount: booking.bag_discount ?? 0,
            promoDiscount: booking.promo_discount ?? 0,
          }),
        });
      } catch (emailErr) {
        console.error("Failed to send booking confirmation email:", emailErr);
        // Don't fail the request — payment is already confirmed
      }
    }

    return NextResponse.json({ ok: true, status: "confirmed", trackingCode });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 },
    );
  }
}
