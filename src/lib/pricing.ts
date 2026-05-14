export interface PricingParams {
  distanceKm?: number;
  pickupDate: string;
  deliveryDate: string;
  regularBags?: number;
  oddSizedItems?: number;
  isSurge?: boolean;
  isInternational?: boolean;
}

export interface PricingResult {
  distanceKm: number;
  distanceReady: boolean;
  basePrice: number;
  total: number;
  isPeak: boolean;
  diffDays: number;
  isInternational: boolean;
  deliveryFee: number;
  bagCharges: number;
}

// ── Pricing Constants (single source of truth) ──
export const REGULAR_BAG_PRICE = 24;   // AED per bag (one-time)
export const ODD_ITEM_PRICE = 59;      // AED per item (one-time)
export const LOCAL_BASE_FEE = 40;      // AED flat base for local deliveries
export const LOCAL_PER_KM = 2;         // AED per km for local deliveries
export const INTERNATIONAL_FLAT_RATE = 200; // AED flat rate for cross-country shipping
export const SURGE_MULTIPLIER = 1.1;   // 10% surge during peak hours

export function calculateBookingPrice(params: PricingParams): PricingResult {
  const {
    distanceKm,
    pickupDate,
    deliveryDate,
    regularBags = 0,
    oddSizedItems = 0,
    isSurge = false,
    isInternational = false,
  } = params;

  // If distanceKm is not yet provided by the live API, mark as not ready
  const resolvedDistance = distanceKm ?? 0;
  const distanceReady = distanceKm !== undefined && distanceKm > 0;

  // Day difference calculation (kept for display purposes)
  const start = new Date(pickupDate);
  const end = new Date(deliveryDate);
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  // ── Delivery fee (distance-based or international flat rate) ──
  let deliveryFee: number;
  if (isInternational) {
    deliveryFee = INTERNATIONAL_FLAT_RATE;
  } else {
    deliveryFee = LOCAL_BASE_FEE + resolvedDistance * LOCAL_PER_KM;
  }

  // ── Bag charges: one-time per bag / per item ──
  const bagCharges =
    regularBags * REGULAR_BAG_PRICE + oddSizedItems * ODD_ITEM_PRICE;

  let total = deliveryFee + bagCharges;

  // Peak Hours surcharge
  if (isSurge) {
    total *= SURGE_MULTIPLIER;
  }

  return {
    distanceKm: resolvedDistance,
    distanceReady,
    basePrice: Math.round(total),
    total: Math.round(total),
    isPeak: isSurge,
    diffDays,
    isInternational,
    deliveryFee: Math.round(deliveryFee),
    bagCharges: Math.round(bagCharges),
  };
}
