export interface PricingParams {
  distanceKm?: number;
  pickupDate: string;
  deliveryDate: string;
  regularBags?: number;
  oddSizedItems?: number;
  isSurge?: boolean;
  isInternational?: boolean;
  promoDiscount?: number;
  hasChauffeur?: boolean;
  hasLuggage?: boolean;
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
  promoDiscount: number;
  bagDiscount: number;
  chauffeurCharge: number;
}

// ── Pricing Constants (single source of truth) ──
export const REGULAR_BAG_PRICE = 24;   // AED per bag (one-time)
export const ODD_ITEM_PRICE = 59;      // AED per item (one-time)
export const LOCAL_BASE_FEE = 40;      // AED flat base for local deliveries
export const LOCAL_PER_KM = 2;         // AED per km for local deliveries
export const INTERNATIONAL_FLAT_RATE = 200; // AED flat rate for cross-country shipping
export const CHAUFFEUR_ADDON_PRICE = 150;   // AED flat rate for chauffeur
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
    promoDiscount = 0,
    hasChauffeur = false,
    hasLuggage = true,
  } = params;

  // If distanceKm is not yet provided by the live API, mark as not ready
  const resolvedDistance = distanceKm ?? 0;
  const distanceReady = distanceKm !== undefined && distanceKm > 0;

  // Day difference calculation (kept for display purposes)
  const start = pickupDate ? new Date(pickupDate) : new Date();
  const end = deliveryDate ? new Date(deliveryDate) : new Date();
  const diffTime = Math.max(0, end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  // ── Delivery fee (distance-based or international flat rate) ──
  let deliveryFee: number;
  if (!hasLuggage) {
    deliveryFee = 0;
  } else if (isInternational) {
    deliveryFee = INTERNATIONAL_FLAT_RATE;
  } else if (!distanceReady) {
    // Wait for live distance — avoid showing misleading base-only fee (e.g. AED 40)
    deliveryFee = 0;
  } else {
    deliveryFee = LOCAL_BASE_FEE + resolvedDistance * LOCAL_PER_KM;
  }

  // Use actual counts based on hasLuggage flag
  const actualRegularBags = hasLuggage ? regularBags : 0;
  const actualOddSizedItems = hasLuggage ? oddSizedItems : 0;

  // ── Bag charges: one-time per bag / per item ──
  const bagCharges =
    actualRegularBags * REGULAR_BAG_PRICE + actualOddSizedItems * ODD_ITEM_PRICE;

  // ── Chauffeur add-on ──
  const chauffeurCharge = hasChauffeur ? CHAUFFEUR_ADDON_PRICE : 0;

  let total = deliveryFee + bagCharges + chauffeurCharge;

  // Peak Hours surcharge
  if (isSurge) {
    total *= SURGE_MULTIPLIER;
  }

  // ── 4 or more bags gives a 10% discount on the total bill ──
  const totalBags = actualRegularBags + actualOddSizedItems;
  const bagDiscount = totalBags >= 4 ? Math.round(total * 0.10) : 0;
  total = Math.max(0, total - bagDiscount);

  // Apply promo discount
  total = Math.max(0, total - promoDiscount);

  return {
    distanceKm: resolvedDistance,
    distanceReady,
    basePrice: Math.round(total + promoDiscount),
    total: Math.round(total),
    isPeak: isSurge,
    diffDays,
    isInternational,
    deliveryFee: Math.round(deliveryFee),
    bagCharges: Math.round(bagCharges),
    promoDiscount: Math.round(promoDiscount),
    bagDiscount: Math.round(bagDiscount),
    chauffeurCharge: Math.round(chauffeurCharge),
  };
}
