import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.trim();
    const token = body.token?.trim();

    if (!email || !token) {
      return NextResponse.json(
        { error: "Email and 6-digit code are required." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServer();

    // Verify the OTP via Supabase Auth
    const { data: sessionData, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Success
    return NextResponse.json({ ok: true, user: sessionData.user });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 },
    );
  }
}
