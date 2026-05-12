import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    if (!date || !time) {
      return NextResponse.json(
        { error: "Missing date or time" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServer();

    // Fetch bookings for the requested date
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("pickup_time")
      .eq("pickup_date", date)
      // Exclude canceled/failed bookings if you have a status column (assuming 'pending_payment' and 'paid')
      .not("status", "eq", "canceled");

    if (error) {
      return NextResponse.json({ isSurge: false, count: 0 }, { status: 500 });
    }

    // Parse the requested time
    // Example format: "10:00 AM"
    const reqTimeMatch = time.match(/(\d+):(\d+)\s(AM|PM)/);
    if (!reqTimeMatch) {
      return NextResponse.json({ isSurge: false, count: 0 });
    }

    let reqH = parseInt(reqTimeMatch[1]);
    const reqM = parseInt(reqTimeMatch[2]);
    const reqIsPM = reqTimeMatch[3] === "PM";
    if (reqIsPM && reqH !== 12) reqH += 12;
    if (!reqIsPM && reqH === 12) reqH = 0;

    const reqMinutes = reqH * 60 + reqM;

    // Count bookings within a +/- 1 hour window (60 minutes)
    let overlappingCount = 0;

    if (bookings) {
      for (const b of bookings) {
        if (!b.pickup_time) continue;

        const bTimeMatch = b.pickup_time.match(/(\d+):(\d+)(?::\d+)?(?:\s(AM|PM))?/);
        if (!bTimeMatch) continue;

        let bH = parseInt(bTimeMatch[1]);
        const bM = parseInt(bTimeMatch[2]);
        const bIsPM = bTimeMatch[3] === "PM";
        
        if (bTimeMatch[3]) {
          // 12-hour format with AM/PM
          if (bIsPM && bH !== 12) bH += 12;
          if (!bIsPM && bH === 12) bH = 0;
        }
        // If no AM/PM, it's already in 24-hour format

        const bMinutes = bH * 60 + bM;

        // Difference in minutes
        const diff = Math.abs(reqMinutes - bMinutes);

        // If within 60 minutes
        if (diff <= 60) {
          overlappingCount++;
        }
      }
    }

    // Threshold logic: If there are 3 or more bookings within this window, trigger surge
    const SURGE_THRESHOLD = 3;
    const isSurge = overlappingCount >= SURGE_THRESHOLD;

    return NextResponse.json({ isSurge, count: overlappingCount });
  } catch {
    return NextResponse.json({ isSurge: false, count: 0 }, { status: 500 });
  }
}
