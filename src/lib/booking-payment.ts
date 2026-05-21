export type StoredPaymentMethod = "cod" | "card";

/** Normalize client values to what we store in Supabase (cod | card). */
export function normalizePaymentMethod(raw?: string): StoredPaymentMethod {
  const value = (raw ?? "").trim().toLowerCase();
  if (
    value === "cod" ||
    value === "cash" ||
    value === "cash_on_delivery" ||
    value === "cash on delivery"
  ) {
    return "cod";
  }
  return "card";
}

export function isCodPayment(method?: string | null): boolean {
  return normalizePaymentMethod(method ?? undefined) === "cod";
}
