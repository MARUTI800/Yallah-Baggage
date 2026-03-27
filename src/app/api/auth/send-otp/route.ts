import { NextResponse } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = body.email?.trim()

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 })
    }

    const supabase = getSupabaseServer()

    // Dispatch the 6-digit OTP to the user's email via Supabase Auth
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // Auto-create user if they don't exist
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 },
    )
  }
}
