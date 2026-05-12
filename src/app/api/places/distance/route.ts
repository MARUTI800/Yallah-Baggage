import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");

    if (!origin || !destination) {
      return NextResponse.json(
        { error: "Origin and destination are required" },
        { status: 400 },
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Google Maps API Key not configured." },
        { status: 500 },
      );
    }

    // Use Distance Matrix API
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      origin,
    )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "OK") {
      return NextResponse.json(
        { error: data.error_message || "Distance Matrix API error" },
        { status: 400 },
      );
    }

    const element = data.rows[0].elements[0];
    if (element.status !== "OK") {
      return NextResponse.json(
        { error: "Could not calculate distance between these locations" },
        { status: 400 },
      );
    }

    // distance.value is in meters
    const distanceKm = element.distance.value / 1000;
    const durationText = element.duration.text;

    return NextResponse.json({ distanceKm, durationText });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 },
    );
  }
}
