export type LatLng = { lat: number; lng: number };

/** Straight-line distance in km between two coordinates. */
export function haversineKm(origin: LatLng, destination: LatLng): number {
  const R = 6371;
  const dLat = ((destination.lat - origin.lat) * Math.PI) / 180;
  const dLon = ((destination.lng - origin.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((origin.lat * Math.PI) / 180) *
      Math.cos((destination.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Approximate driving distance from straight-line km. */
export function estimateDrivingKm(straightLineKm: number): number {
  return Math.max(1, Math.round(straightLineKm * 1.3 * 10) / 10);
}

export function estimateDurationMins(distanceKm: number): number {
  return Math.max(30, Math.round((distanceKm / 40) * 60));
}
