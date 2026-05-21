import { NextResponse } from "next/server";

// Helper: extract country code from a Geocoding API result
function extractCountry(
  result: { address_components?: { short_name: string; types: string[] }[] }
): string | null {
  const comp = result.address_components?.find((c: { types: string[] }) =>
    c.types.includes("country")
  );
  return comp?.short_name ?? null;
}

function parseDurationSeconds(duration: unknown): number {
  if (typeof duration !== "string") return 0;
  const normalized = duration.endsWith("s") ? duration.slice(0, -1) : duration;
  const seconds = Number(normalized);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
}

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

    // ── Step 1: Geocode both addresses to get coords + country ──
    const geocode = async (address: string) => {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
      );
      const data = await res.json();
      if (data.status !== "OK" || !data.results || data.results.length === 0)
        return null;
      const result = data.results[0];
      return {
        lat: result.geometry.location.lat as number,
        lng: result.geometry.location.lng as number,
        country: extractCountry(result),
        formatted: result.formatted_address as string,
      };
    };

    const [originGeo, destGeo] = await Promise.all([
      geocode(origin),
      geocode(destination),
    ]);

    if (!originGeo || !destGeo) {
      return NextResponse.json(
        { error: "Could not geocode one or both locations" },
        { status: 400 },
      );
    }

    const isInternational =
      originGeo.country !== null &&
      destGeo.country !== null &&
      originGeo.country !== destGeo.country;

    // ── Step 2: Try Routes API for precise driving distance ──
    let distanceKm: number;
    let durationMins: number;

    const routesRes = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
        },
        body: JSON.stringify({
          origin: { address: origin },
          destination: { address: destination },
          travelMode: "DRIVE",
          computeAlternativeRoutes: true,
        }),
      },
    );

    const routesData = await routesRes.json();

    if (
      !routesData.error &&
      routesData.routes &&
      routesData.routes.length > 0
    ) {
      // Routes API succeeded - always pick one route (never aggregate).
      const bestRoute = routesData.routes.reduce(
        (
          currentBest: { distanceMeters?: number; duration?: string } | null,
          candidate: { distanceMeters?: number; duration?: string },
        ) => {
          const currentBestSeconds = parseDurationSeconds(currentBest?.duration);
          const candidateSeconds = parseDurationSeconds(candidate.duration);

          if (!currentBest) return candidate;
          if (candidateSeconds === 0) return currentBest;
          if (currentBestSeconds === 0) return candidate;
          return candidateSeconds < currentBestSeconds ? candidate : currentBest;
        },
        null,
      );

      const bestDurationSeconds = parseDurationSeconds(bestRoute?.duration);
      distanceKm = ((bestRoute?.distanceMeters as number) || 0) / 1000;
      durationMins = Math.max(1, Math.ceil(bestDurationSeconds / 60));
    } else {
      // ── Fallback: Haversine from geocoded coords ──
      console.warn(
        "Routes API unavailable, using Haversine approximation.",
      );
      const R = 6371;
      const dLat =
        (destGeo.lat - originGeo.lat) * (Math.PI / 180);
      const dLon =
        (destGeo.lng - originGeo.lng) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(originGeo.lat * (Math.PI / 180)) *
          Math.cos(destGeo.lat * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const straightLineKm = R * c;

      distanceKm = straightLineKm * 1.3; // driving approximation
      durationMins = Math.round((distanceKm / 40) * 60);
    }

    const durationText = `${durationMins} mins`;

    return NextResponse.json({
      distanceKm,
      durationText,
      durationMins,
      isInternational,
      originCountry: originGeo.country,
      destCountry: destGeo.country,
      originCoords: { lat: originGeo.lat, lng: originGeo.lng },
      destCoords: { lat: destGeo.lat, lng: destGeo.lng },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 },
    );
  }
}
