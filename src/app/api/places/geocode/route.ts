import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "address is required" }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API Key not configured." }, { status: 500 })
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&components=country:ae|country:gb`

    const res = await fetch(url)
    const data = await res.json()

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Google Geocoding error:", data)
      return NextResponse.json({ error: data.error_message || "Geocoding API error" }, { status: 400 })
    }

    if (data.results && data.results.length > 0) {
      const result = data.results[0]
      const lat = result.geometry.location.lat
      const lon = result.geometry.location.lng
      const name = result.formatted_address

      return NextResponse.json({ lat, lon, name })
    }

    return NextResponse.json({ error: "No location found" }, { status: 404 })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 }
    )
  }
}
