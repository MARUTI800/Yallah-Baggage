import { NextResponse } from "next/server";
import {
  estimateDrivingKm,
  estimateDurationMins,
  haversineKm,
  type LatLng,
} from "@/lib/distance";

function extractCountry(
  result: { address_components?: { short_name: string; types: string[] }[] },
): string | null {
  const comp = result.address_components?.find((c: { types: string[] }) =>
    c.types.includes("country"),
  );
  return comp?.short_name ?? null;
}

function parseDurationSeconds(duration: unknown): number {
  if (typeof duration !== "string") return 0;
  const normalized = duration.endsWith("s") ? duration.slice(0, -1) : duration;
  const seconds = Number(normalized);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
}

function haversineFallback(origin: LatLng, dest: LatLng) {
  const straightLineKm = haversineKm(origin, dest);
  const distanceKm = estimateDrivingKm(straightLineKm);
  return {
    distanceKm,
    durationMins: estimateDurationMins(distanceKm),
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const origin = searchParams.get("origin")?.trim();
    const destination = searchParams.get("destination")?.trim();

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

    const geocode = async (address: string) => {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&region=ae`,
      );
      const data = await res.json();
      if (data.status !== "OK" || !data.results?.length) return null;
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

    const originCoords = { lat: originGeo.lat, lng: originGeo.lng };
    const destCoords = { lat: destGeo.lat, lng: destGeo.lng };

    const isInternational =
      originGeo.country !== null &&
      destGeo.country !== null &&
      originGeo.country !== destGeo.country;

    let distanceKm = 0;
    let durationMins = 0;

    // 1) Distance Matrix (reliable with standard Maps API key)
    try {
      const matrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originGeo.lat},${originGeo.lng}&destinations=${destGeo.lat},${destGeo.lng}&mode=driving&key=${apiKey}`;
      const matrixRes = await fetch(matrixUrl);
      const matrixData = await matrixRes.json();
      const element = matrixData.rows?.[0]?.elements?.[0];
      if (matrixData.status === "OK" && element?.status === "OK") {
        distanceKm = (element.distance?.value || 0) / 1000;
        durationMins = Math.max(1, Math.ceil((element.duration?.value || 0) / 60));
      }
    } catch {
      // fall through
    }

    // 2) Routes API
    if (distanceKm <= 0) {
      try {
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
            }),
          },
        );
        const routesData = await routesRes.json();
        if (routesData.routes?.length > 0) {
          const route = routesData.routes[0];
          distanceKm = (route.distanceMeters || 0) / 1000;
          const seconds = parseDurationSeconds(route.duration);
          durationMins = seconds > 0 ? Math.max(1, Math.ceil(seconds / 60)) : 0;
        }
      } catch {
        // fall through
      }
    }

    // 3) Haversine estimate (always works if geocoded)
    if (distanceKm <= 0) {
      const fallback = haversineFallback(originCoords, destCoords);
      distanceKm = fallback.distanceKm;
      durationMins = fallback.durationMins;
    }

    if (durationMins <= 0) {
      durationMins = estimateDurationMins(distanceKm);
    }

    return NextResponse.json({
      distanceKm,
      durationText: `${durationMins} mins`,
      durationMins,
      isInternational,
      originCountry: originGeo.country,
      destCountry: destGeo.country,
      originCoords,
      destCoords,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unexpected error." },
      { status: 500 },
    );
  }
}
