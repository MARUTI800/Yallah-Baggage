import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * POST /api/auth/check-email
 * Checks if an email has already been verified via a previous booking.
 * If a booking exists with this email, we consider the email pre-verified
 * and skip the OTP flow on subsequent bookings.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.trim()?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServer();

    // Check if this email has any existing bookings (meaning they've verified before)
    const { data, error } = await supabase
      .from("bookings")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (error) {
      // If the table query fails, default to requiring OTP (safe fallback)
      return NextResponse.json({ verified: false });
    }

    const hasExistingBooking = data && data.length > 0;

    return NextResponse.json({ verified: hasExistingBooking });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 },
    );
  }
}
