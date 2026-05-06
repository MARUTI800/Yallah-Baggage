import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const placeId = searchParams.get("place_id")

    if (!placeId) {
      return NextResponse.json({ error: "place_id is required" }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API Key not configured." }, { status: 500 })
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,name,formatted_address&key=${apiKey}`

    const res = await fetch(url)
    const data = await res.json()

    if (data.status !== "OK") {
      console.error("Google Places Details error:", data)
      return NextResponse.json({ error: data.error_message || "Places API error" }, { status: 400 })
    }

    const result = data.result
    const lat = result?.geometry?.location?.lat
    const lon = result?.geometry?.location?.lng
    const name = result?.name || result?.formatted_address

    return NextResponse.json({ lat, lon, name })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 }
    )
  }
}
