import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { code, bookingAmount } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 });
    }

    const adminApiBase = process.env.YALLAH_ADMIN_API_URL?.replace(/\/+$/, "");
    if (adminApiBase) {
      const adminResponse = await fetch(`${adminApiBase}/api/public/coupons/validate`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          code: String(code).toUpperCase(),
          bookingAmount,
        }),
      });
      const adminJson = await adminResponse.json();
      if (adminResponse.ok) {
        return NextResponse.json({
          success: true,
          discount_type: adminJson.discount_type,
          discount_value: adminJson.discount_value,
          code: adminJson.code ?? String(code).toUpperCase(),
        });
      }
      return NextResponse.json(
        { error: adminJson.error ?? "Invalid promo code" },
        { status: adminResponse.status || 400 },
      );
    }

    const supabase = getSupabaseServer();

    const { data: promo, error } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !promo) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });
    }

    // Check expiration
    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return NextResponse.json({ error: "Promo code has expired" }, { status: 400 });
    }

    // Check usage limits
    if (promo.max_uses && promo.uses_count >= promo.max_uses) {
      return NextResponse.json({ error: "Promo code usage limit reached" }, { status: 400 });
    }

    // Check minimum booking amount
    if (bookingAmount && bookingAmount < promo.min_booking_amount) {
      return NextResponse.json(
        { error: `Minimum booking amount of AED ${promo.min_booking_amount} required` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      code: promo.code,
    });
  } catch (error) {
    console.error("Promo validation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
