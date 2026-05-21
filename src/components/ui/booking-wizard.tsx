"use client";

import React, {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
);
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Navigation2,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Minus,
  Plus,
  Loader2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Luggage,
  Bike,
  CreditCard,
  Banknote,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/navigation";
import { getDubaiTime } from "@/lib/utils";

type Step = 1 | 2 | 3 | 4;

type BookingDraft = {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  deliveryDate: string;
  deliveryTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numberOfBags: number; // kept for total sum if needed
  regularBags: number;
  oddSizedItems: number;
  notes: string;
  adults: number;
  children: number;
  childrenAges: string[];
  isSurge?: boolean;
  paymentMethod?: "card" | "cod";
  distanceKm?: number;
  durationMins?: number;
  isInternational?: boolean;
  originCoords?: { lat: number; lng: number };
  destCoords?: { lat: number; lng: number };
  promoCode?: string;
  promoDiscount?: number;
  hasLuggage: boolean;
  hasChauffeur: boolean;
};

interface GooglePrediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

const defaultDraft: BookingDraft = {
  pickupLocation: "",
  dropoffLocation: "",
  pickupDate: "",
  pickupTime: "",
  deliveryDate: "",
  deliveryTime: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  numberOfBags: 1,
  regularBags: 1,
  oddSizedItems: 0,
  notes: "",
  adults: 1,
  children: 0,
  childrenAges: [],
  paymentMethod: "card",
  promoCode: "",
  promoDiscount: 0,
  hasLuggage: true,
  hasChauffeur: false,
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Pricing & Distance Utilities ──────────────────────────────────
import { calculateBookingPrice, REGULAR_BAG_PRICE, ODD_ITEM_PRICE } from "@/lib/pricing";

// ── Location Autocomplete ──────────────────────────────────────────
function LocationInput({
  label,
  icon: Icon,
  value,
  onChange,
  onPin,
  placeholder,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (val: string) => void;
  onPin?: (lat: string, lon: string, name: string) => void;
  placeholder: string;
}) {
  const t = useTranslations("BookingWizard");
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<GooglePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search google places
  useEffect(() => {
    if (confirmed || query.length < 3) {
      setResults([]);
      return;
    }
    const tid = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        if (data.predictions) {
          setResults(data.predictions);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(tid);
  }, [query, confirmed]);

  // Sync external value resets
  useEffect(() => {
    if (!value) {
      setQuery("");
      setConfirmed(false);
    }
  }, [value]);

  const select = useCallback(
    async (loc: GooglePrediction) => {
      // loc.description contains the full exact address or place name with context (e.g., "Villa 12, Street 5, Dubai, UAE")
      const fullText = loc.description;
      setQuery(fullText);
      onChange(fullText);
      setConfirmed(true);
      setResults([]);

      try {
        const res = await fetch(`/api/places/details?place_id=${loc.place_id}`);
        const data = await res.json();
        if (data.lat && data.lon) {
          onPin?.(
            data.lat.toString(),
            data.lon.toString(),
            data.name || fullText,
          );
        }
      } catch (err) {
        console.error("Failed to fetch place details:", err);
      }
    },
    [onChange, onPin],
  );

  const geocodeCustomAddress = async (searchQuery: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/places/geocode?address=${encodeURIComponent(searchQuery)}`,
      );
      const data = await res.json();

      // We always preserve the exact text the user typed for custom searches
      setQuery(searchQuery);
      onChange(searchQuery);
      setConfirmed(true);
      setResults([]);

      if (data.lat && data.lon) {
        onPin?.(data.lat.toString(), data.lon.toString(), searchQuery);
      }
    } catch (err) {
      console.error("Geocoding failed", err);
      setConfirmed(true);
    } finally {
      setLoading(false);
    }
  };

  const showDropdown = focused && !confirmed && query.length >= 3;

  return (
    <div ref={containerRef} className="relative group w-full">
      <div
        className={`w-full bg-[#F7F5F0] border rounded-xl px-5 pt-3 pb-3 transition-all duration-200 ${
          focused
            ? "border-[#1E5BD7] bg-white shadow-[0_0_0_3px_rgba(30,91,215,0.08)]"
            : "border-transparent hover:bg-[#F0EEE9]"
        }`}
      >
        <label
          className={`text-[10px] font-semibold tracking-[0.15em] uppercase block mb-1 transition-colors ${
            focused ? "text-[#1E5BD7]" : "text-[#8B7280]"
          }`}
        >
          {label}
        </label>
        <div className="flex items-center gap-2 pr-6">
          <input
            type="text"
            value={query}
            placeholder={placeholder}
            className="w-full text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none placeholder-[#8B7280]/40 tracking-tight"
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 350)}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange(e.target.value);
              setConfirmed(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (!confirmed && query.length >= 3) {
                  if (results.length > 0) {
                    select(results[0]);
                  } else {
                    geocodeCustomAddress(query);
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Status icon */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        {loading ? (
          <Loader2 className="w-4 h-4 text-[#8B7280] animate-spin" />
        ) : confirmed ? (
          <Check className="w-4 h-4 text-[#1E5BD7]" />
        ) : (
          <Icon className="w-4 h-4 text-[#8B7280]/40" />
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full mt-2 left-0 right-0 bg-white border border-[#E5E5E5] rounded-xl py-1 z-[100] shadow-[0_8px_30px_rgba(10,46,109,0.12)] overflow-hidden"
          >
            {results.length > 0 ? (
              results.map((loc) => {
                const mainText =
                  loc.structured_formatting?.main_text ||
                  loc.description.split(",")[0];
                const sub =
                  loc.structured_formatting?.secondary_text ||
                  loc.description.split(",").slice(1).join(", ");
                return (
                  <div
                    key={loc.place_id}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      select(loc);
                    }}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-[#F6F2EA] cursor-pointer group/item transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F6F2EA] flex items-center justify-center flex-shrink-0 transition-all">
                      <MapPin className="w-3.5 h-3.5 text-[#0A2E6D]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[#0A2E6D] text-sm font-medium truncate tracking-tight">
                        {mainText}
                      </span>
                      {sub && (
                        <span className="text-[#8B7280] text-xs truncate">
                          {sub}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : !loading ? (
              <div
                onPointerDown={(e) => {
                  e.preventDefault();
                  geocodeCustomAddress(query);
                }}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[#F6F2EA] cursor-pointer group/item transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F6F2EA] flex items-center justify-center flex-shrink-0 transition-all">
                  <MapPin className="w-3.5 h-3.5 text-[#0A2E6D]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[#0A2E6D] text-sm font-medium truncate tracking-tight">
                    {t("searchFor")} &quot;{query}&quot;
                  </span>
                  <span className="text-[#8B7280] text-xs truncate">
                    {t("useCustomLocation")}
                  </span>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Styled Field wrapper (for non-location fields) ────────────────
const Field = ({
  label,
  icon: Icon,
  children,
  className = "",
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`relative group w-full ${className}`}>
    <div className="w-full bg-[#F7F5F0] border border-transparent rounded-xl focus-within:border-[#1E5BD7] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,91,215,0.08)] transition-all duration-200">
      <label className="px-5 pt-3.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block mb-0.5 group-focus-within:text-[#1E5BD7] transition-colors">
        {label}
      </label>
      <div className="relative">
        {children}
        {Icon && (
          <Icon className="absolute right-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8B7280]/40 pointer-events-none group-focus-within:text-[#1E5BD7] transition-colors duration-200" />
        )}
      </div>
    </div>
  </div>
);

// ── Step dots ─────────────────────────────────────────────────────
const StepDots = ({ step }: { step: Step }) => {
  const t = useTranslations("BookingWizard");
  return (
    <div className="flex items-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            s < step
              ? "w-8 bg-[#1E5BD7]"
              : s === step
                ? "w-8 bg-[#0A2E6D]"
                : "w-4 bg-[#E5E5E5]"
          }`}
        />
      ))}
      <span className="ml-2 text-[#8B7280] text-xs font-medium tracking-widest uppercase">
        {t("stepDots", { current: Math.min(step, 3) })}
      </span>
    </div>
  );
};

// ── Date / Time Picker ────────────────────────────────────────────
const generateDates = () => {
  const dates: Date[] = [];
  const now = getDubaiTime();
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

const getComparableDate = (dStr: string, tStr: string) => {
  const dates = generateDates();
  const matched = dates.find((d) => fmtDate(d) === dStr);
  if (!matched) return new Date(0);

  const match = tStr.match(/(\d+):(\d+)\s(AM|PM)/);
  if (!match) return new Date(0);
  let h = parseInt(match[1]);
  const m = parseInt(match[2]);
  const isPM = match[3] === "PM";
  if (isPM && h !== 12) h += 12;
  if (!isPM && h === 12) h = 0;

  const finalDate = new Date(matched);
  finalDate.setHours(h, m, 0, 0);
  return finalDate;
};

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

function DateTimePicker({
  label,
  dateVal,
  timeVal,
  onDateChange,
  onTimeChange,
  minDateTime,
  isOpen,
  setIsOpen,
}: {
  label: string;
  dateVal: string;
  timeVal: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
  minDateTime?: Date;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const t = useTranslations("BookingWizard");
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
  }, []);

  const availableTimesList = useMemo(
    () =>
      Array.from({ length: 29 }, (_, i) => {
        const totalMins = 8 * 60 + i * 30;
        const h = Math.floor(totalMins / 60);
        const m = totalMins % 60;
        const period = h >= 12 ? "PM" : "AM";
        return `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${m.toString().padStart(2, "0")} ${period}`;
      }),
    [],
  );

  // parse dateVal or use today
  const selectedDate = useMemo(() => {
    const today = hasMounted ? getDubaiTime() : new Date();
    if (!dateVal) return today;
    const match = generateDates().find((d) => fmtDate(d) === dateVal);
    return match || today;
  }, [dateVal, hasMounted]);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
  );

  const nextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };
  const prevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const daysInMonth = getDaysInMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );
  const firstDay = getFirstDayOfMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div
      className={`relative flex flex-col w-full group transition-all duration-200 ${isOpen ? "z-50" : "z-10"}`}
    >
      <div
        className={`bg-[#F7F5F0] border rounded-xl px-5 py-3.5 cursor-pointer transition-all duration-200 ${
          isOpen
            ? "border-[#1E5BD7] bg-white shadow-[0_0_0_3px_rgba(30,91,215,0.08)]"
            : "border-transparent hover:bg-[#F0EEE9]"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
            <Calendar className="w-5 h-5 text-[#0A2E6D]" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block mb-1">
              {label}
            </span>
            <div className="text-[15px] font-medium text-[#0A2E6D] tracking-tight">
              {dateVal
                ? `${dateVal} at ${timeVal || "Pick time"}`
                : "Pick Date & Time"}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 w-[calc(100%-24px)] sm:w-[320px] bg-white border border-[#E5E5E5] rounded-2xl shadow-[0_12px_40px_rgba(10,46,109,0.15)] z-[100] p-4 origin-top overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold text-[#0A2E6D]">
                {monthName}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F6F2EA] text-[#0A2E6D] transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F6F2EA] text-[#0A2E6D] transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {weekDays.map((wd) => (
                <div
                  key={wd}
                  className="text-[10px] font-bold text-[#8B7280] text-center mb-1"
                >
                  {wd}
                </div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {daysInMonth.map((day) => {
                const isSelected =
                  day.toDateString() === selectedDate.toDateString();
                const isToday =
                  day.toDateString() === getDubaiTime().toDateString();

                const todayDateOnly = getDubaiTime();
                todayDateOnly.setHours(0, 0, 0, 0);

                const minDateOnly = minDateTime
                  ? new Date(minDateTime)
                  : new Date(todayDateOnly);
                minDateOnly.setHours(0, 0, 0, 0);

                const isPast = day < minDateOnly;

                return (
                  <button
                    key={day.toString()}
                    type="button"
                    onClick={() => {
                      if (!isPast) onDateChange(fmtDate(day));
                    }}
                    disabled={isPast}
                    className={`w-7 h-7 mx-auto flex items-center justify-center rounded-full text-xs font-medium transition-all mb-1 ${
                      isPast
                        ? "text-[#8B7280]/40 cursor-not-allowed"
                        : isSelected
                          ? "bg-[#1E5BD7] text-white shadow-md font-bold"
                          : isToday
                            ? "text-[#1E5BD7] font-bold hover:bg-[#1E5BD7]/10"
                            : "text-[#0A2E6D] hover:bg-[#F6F2EA]"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Time Selector */}
            <div className="mt-3 pt-3 border-t border-[#E5E5E5]">
              <div className="flex items-center gap-2 mb-2 px-1">
                <Clock className="w-4 h-4 text-[#8B7280]" />
                <span className="text-xs font-bold text-[#0A2E6D]">
                  {t("time")}
                </span>
              </div>
              <div className="flex overflow-x-auto pb-1 gap-2 snap-x scrollbar-hide no-scrollbar">
                <style
                  dangerouslySetInnerHTML={{
                    __html: `.no-scrollbar::-webkit-scrollbar { display: none; }`,
                  }}
                />
                {availableTimesList.map((timeSlot) => {
                  let isTimeDisabled = false;
                  const match = timeSlot.match(/(\d+):(\d+)\s(AM|PM)/);
                  let h = 0, m = 0;
                  if (match) {
                    h = parseInt(match[1]);
                    m = parseInt(match[2]);
                    const isPM = match[3] === "PM";
                    if (isPM && h !== 12) h += 12;
                    if (!isPM && h === 12) h = 0;
                  }

                  const tDate = new Date(selectedDate);
                  tDate.setHours(h, m, 0, 0);

                  // Prevent selecting times that have already passed in Dubai
                  const currentDubaiTime = hasMounted ? getDubaiTime() : new Date();
                  if (tDate.getTime() <= currentDubaiTime.getTime()) {
                    isTimeDisabled = true;
                  }

                  // Enforce minDateTime (e.g., delivery must be after pickup)
                  if (!isTimeDisabled && minDateTime) {
                    if (tDate.getTime() < minDateTime.getTime()) {
                      isTimeDisabled = true;
                    }
                  }

                  return (
                    <button
                      key={timeSlot}
                      type="button"
                      disabled={isTimeDisabled}
                      onClick={() => {
                        if (!isTimeDisabled) {
                          onTimeChange(timeSlot);
                          if (!dateVal) {
                            onDateChange(fmtDate(selectedDate));
                          }
                          setIsOpen(false);
                        }
                      }}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all snap-start ${
                        isTimeDisabled
                          ? "bg-[#F6F2EA]/50 text-[#8B7280]/40 cursor-not-allowed"
                          : timeVal === timeSlot
                            ? "bg-[#1E5BD7] text-white shadow-md font-bold"
                            : "bg-[#F6F2EA] text-[#0A2E6D] hover:bg-[#E5E5E5]"
                      }`}
                    >
                      {timeSlot}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Stripe Payment Form ───────────────────────────────────────────
function StripePaymentForm({
  onSuccess,
  isSubmitting,
  setIsSubmitting,
}: {
  onSuccess: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (s: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("BookingWizard");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message ?? t("completePaymentDetails"));
      setIsSubmitting(false);
      return;
    }

    const { error: paymentError } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (paymentError) {
      setError(paymentError.message ?? t("paymentFailed"));
      setIsSubmitting(false);
    } else {
      onSuccess();
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement options={{ layout: "tabs" }} />
      {error && (
        <div className="mt-3 text-red-500 text-sm font-medium">{error}</div>
      )}
      <button
        disabled={isSubmitting || !stripe || !elements}
        type="submit"
        className="w-full h-14 mt-6 rounded-xl flex items-center justify-center gap-3 text-base font-semibold tracking-tight transition-all bg-[#0A2E6D] text-white hover:bg-[#0D3A8A] active:scale-[0.98] duration-200 disabled:opacity-40"
      >
        {isSubmitting ? (
          <span className="animate-pulse">{t("processing")}</span>
        ) : (
          t("confirmAndPay")
        )}
      </button>
    </form>
  );
}

// ── Main Wizard ───────────────────────────────────────────────────
export function BookingWizard({
  onLocationPin,
  onRouteUpdate,
  initialDraft = {},
}: {
  onLocationPin?: (lat: string, lon: string, name: string) => void;
  onRouteUpdate?: (
    originStr: string | null,
    destStr: string | null,
    coords?: {
      origin?: { lat: number; lng: number };
      dest?: { lat: number; lng: number };
    } | null,
  ) => void;
  initialDraft?: Partial<BookingDraft>;
}) {
  const t = useTranslations("BookingWizard");
  const pt = useTranslations("Promo");
  const lt = useTranslations("Legal");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [step, setStep] = useState<Step>(1);
  const [activePicker, setActivePicker] = useState<
    "pickup" | "delivery" | null
  >(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [draft, setDraft] = useState<BookingDraft>({
    ...defaultDraft,
    ...initialDraft,
  });
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [trackingOtp, setTrackingOtp] = useState<string | null>(null);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [distanceError, setDistanceError] = useState<string | null>(null);
  const [deliveryManuallyEdited, setDeliveryManuallyEdited] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Fetch real distance from API when both locations are confirmed
  useEffect(() => {
    const pickup = draft.pickupLocation.trim();
    const dropoff = draft.dropoffLocation.trim();

    if (pickup.length < 5 || dropoff.length < 5) {
      onRouteUpdate?.(null, null, null);
      setDistanceError(null);
      return;
    }
    setDeliveryManuallyEdited(false);

    setDistanceLoading(true);
    setDistanceError(null);
    setDraft((d) => ({
      ...d,
      distanceKm: undefined,
      durationMins: undefined,
      isInternational: undefined,
      originCoords: undefined,
      destCoords: undefined,
    }));
    // Labels only until geocoded coords arrive (avoids broken address-based embed zoom)
    onRouteUpdate?.(pickup, dropoff, null);

    let cancelled = false;

    const fetchDistance = async () => {
      try {
        const res = await fetch(
          `/api/places/distance?origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(dropoff)}`,
        );
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setDistanceError(
            data.error || "Could not calculate delivery distance. Please check both addresses.",
          );
          return;
        }

        const km =
          typeof data.distanceKm === "number" && data.distanceKm > 0
            ? data.distanceKm
            : null;
        if (!km) {
          setDistanceError("Could not calculate route distance. Try re-selecting both locations.");
          return;
        }

        setDraft((d) => ({
          ...d,
          distanceKm: km,
          durationMins:
            data.durationMins || Math.max(30, Math.round(km * 1.5)),
          isInternational: !!data.isInternational,
          originCoords: data.originCoords,
          destCoords: data.destCoords,
        }));

        if (data.originCoords && data.destCoords) {
          onRouteUpdate?.(pickup, dropoff, {
            origin: data.originCoords,
            dest: data.destCoords,
          });
        } else {
          onRouteUpdate?.(pickup, dropoff, null);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch distance:", err);
          setDistanceError("Network error while calculating distance. Please try again.");
        }
      } finally {
        if (!cancelled) setDistanceLoading(false);
      }
    };

    const tid = setTimeout(fetchDistance, 500);
    return () => {
      cancelled = true;
      clearTimeout(tid);
      setDistanceLoading(false);
    };
  }, [draft.pickupLocation, draft.dropoffLocation, onRouteUpdate]);

  const pickupDateTime = useMemo(
    () => getComparableDate(draft.pickupDate, draft.pickupTime),
    [draft.pickupDate, draft.pickupTime],
  );

  useEffect(() => {
    if (!hasMounted) return;
    const currentDubaiTime = getDubaiTime();
    
    // If pickupDate/Time are empty, or if they represent a time in the past
    if (pickupDateTime.getTime() <= currentDubaiTime.getTime()) {
      const newDDT = new Date(currentDubaiTime.getTime() + 60 * 60 * 1000); // 1 hr buffer
      
      const newDateStr = fmtDate(newDDT);
      let h = newDDT.getHours();
      let m = newDDT.getMinutes();
      m = m <= 30 ? 30 : 0;
      if (m === 0) h += 1;

      const period = h >= 12 ? "PM" : "AM";
      const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const newTimeStr = `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;
      
      if (draft.pickupDate !== newDateStr || draft.pickupTime !== newTimeStr) {
        setDraft((d) => ({ ...d, pickupDate: newDateStr, pickupTime: newTimeStr }));
      }
    }
  }, [pickupDateTime, hasMounted, draft.pickupDate, draft.pickupTime]);

  const minDeliveryDateTime = useMemo(() => {
    const duration = draft.durationMins || 30;
    const roundedDuration = Math.ceil(duration / 30) * 30;
    return new Date(pickupDateTime.getTime() + roundedDuration * 60 * 1000);
  }, [pickupDateTime, draft.durationMins]);

  // Fetch surge status when pickup date/time changes
  useEffect(() => {
    if (!draft.pickupDate || !draft.pickupTime) return;

    const fetchSurge = async () => {
      try {
        const res = await fetch(
          `/api/bookings/surge?date=${encodeURIComponent(draft.pickupDate)}&time=${encodeURIComponent(draft.pickupTime)}`,
        );
        const data = await res.json();
        if (data.isSurge !== undefined && data.isSurge !== draft.isSurge) {
          setDraft((d) => ({ ...d, isSurge: data.isSurge }));
        }
      } catch (err) {
        console.error("Failed to fetch surge status:", err);
      }
    };

    fetchSurge();
  }, [draft.pickupDate, draft.pickupTime, draft.isSurge]);

  useEffect(() => {
    if (!draft.pickupDate || !draft.pickupTime) return;
    const ddt = getComparableDate(draft.deliveryDate, draft.deliveryTime);
    const shouldSyncToMin =
      ddt.getTime() < minDeliveryDateTime.getTime() || !deliveryManuallyEdited;
    if (shouldSyncToMin) {
      const newDDT = new Date(minDeliveryDateTime.getTime());

      const newDateStr = fmtDate(newDDT);
      let h = newDDT.getHours();
      let m = newDDT.getMinutes();
      m = m <= 30 ? 30 : 0;
      if (m === 0) h += 1;

      const period = h >= 12 ? "PM" : "AM";
      const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const newTimeStr = `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;

      setDraft((d) => ({
        ...d,
        deliveryDate: newDateStr,
        deliveryTime: newTimeStr,
      }));
    }
  }, [
    minDeliveryDateTime,
    draft.deliveryDate,
    draft.deliveryTime,
    draft.pickupDate,
    draft.pickupTime,
    deliveryManuallyEdited,
  ]);

  // Automated Service Type Selection removed

  const canGoToStep2 =
    draft.pickupLocation.trim().length > 0 &&
    draft.dropoffLocation.trim().length > 0 &&
    draft.pickupDate.trim().length > 0 &&
    draft.pickupTime.trim().length > 0 &&
    draft.deliveryDate.trim().length > 0 &&
    draft.deliveryTime.trim().length > 0;

  const validateStep1 = () => {
    if (!draft.pickupLocation.trim()) return t("errors.pickupRequired");
    if (!draft.dropoffLocation.trim()) return t("errors.dropoffRequired");
    if (!draft.pickupDate.trim()) return t("errors.pickupDateRequired");
    if (!draft.pickupTime.trim()) return t("errors.pickupTimeRequired");
    if (!draft.deliveryDate.trim()) return t("errors.deliveryDateRequired");
    if (!draft.deliveryTime.trim()) return t("errors.deliveryTimeRequired");

    const pickupDT = getComparableDate(draft.pickupDate, draft.pickupTime);
    const dropoffDT = getComparableDate(draft.deliveryDate, draft.deliveryTime);

    // Delivery must be at least 30 mins after pickup
    const diffMins = (dropoffDT.getTime() - pickupDT.getTime()) / (1000 * 60);
    if (diffMins < 30) {
      return t("errors.deliveryAfterPickup");
    }

    return null;
  };

  const validateStep2 = () => {
    if (!draft.firstName.trim()) return t("errors.firstNameRequired");
    if (!draft.lastName.trim()) return t("errors.lastNameRequired");
    if (!draft.email.trim() || !isValidEmail(draft.email))
      return t("errors.emailRequired");
    if (!draft.phone.trim()) return t("errors.phoneRequired");
    if (draft.numberOfBags < 1) return t("errors.bagsRequired");
    if (draft.hasLuggage && !draft.isInternational) {
      if (distanceLoading) {
        return "Delivery distance is still calculating. Please wait a moment.";
      }
      if (distanceError) return distanceError;
      if (!draft.distanceKm || draft.distanceKm <= 0) {
        return "Please select both locations from the address list so we can calculate the delivery fee.";
      }
    }
    if (draft.children > 0) {
      if (
        draft.childrenAges.length !== draft.children ||
        draft.childrenAges.some((age) => !age)
      ) {
        return t("errors.childrenAges");
      }
    }
    return null;
  };

  const submitBooking = async () => {
    if (draft.hasLuggage && !draft.isInternational) {
      if (distanceLoading) {
        setError("Delivery distance is still calculating. Please wait a moment.");
        return;
      }
      if (distanceError) {
        setError(distanceError);
        return;
      }
      if (!draft.distanceKm || draft.distanceKm <= 0) {
        setError(
          "Please select both locations from the address list so we can calculate the delivery fee.",
        );
        return;
      }
    }
    setError(null);
    setIsSubmitting(true);
    try {
      // Convert UI dates ("Mon, Mar 30") into standard database format (YYYY-MM-DD)
      const parseDate = (dStr: string) => {
        const dates = generateDates();
        const matched = dates.find((d) => fmtDate(d) === dStr);
        if (!matched) return dStr;
        // Extract local date
        const offset = matched.getTimezoneOffset();
        const local = new Date(matched.getTime() - offset * 60 * 1000);
        return local.toISOString().split("T")[0];
      };

      // Convert UI times ("02:30 PM") into standard time format (HH:mm:00)
      const parseTime = (tStr: string) => {
        const match = tStr.match(/(\d+):(\d+)\s(AM|PM)/);
        if (!match) return tStr;
        let h = parseInt(match[1]);
        const m = parseInt(match[2]);
        const isPM = match[3] === "PM";
        if (isPM && h !== 12) h += 12;
        if (!isPM && h === 12) h = 0;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`;
      };

      const { total } = calculateBookingPrice(draft);

      const payload = {
        ...draft,
        pickupDate: parseDate(draft.pickupDate),
        pickupTime: parseTime(draft.pickupTime),
        deliveryDate: parseDate(draft.deliveryDate),
        deliveryTime: parseTime(draft.deliveryTime),
        regularBags: draft.regularBags,
        oddSizedItems: draft.oddSizedItems,
        notes: draft.notes,
        totalPrice: total,
        adults: draft.adults,
        children: draft.children,
        childrenAges: draft.childrenAges,
        paymentMethod: draft.paymentMethod || "card",
        hasLuggage: draft.hasLuggage,
        hasChauffeur: draft.hasChauffeur,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { bookingId?: string; error?: string };
      if (!res.ok || !json.bookingId)
        throw new Error(json.error ?? "Failed to create booking.");
      setBookingId(json.bookingId);

      // For COD, confirm immediately (pass id — state may not have updated yet)
      if (draft.paymentMethod === "cod") {
        await handlePaymentSuccess(json.bookingId);
        return;
      }

      // Card: load Stripe payment form on step 3
      const piRes = await fetch("/api/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: json.bookingId }),
      });
      const piJson = await piRes.json();
      if (!piRes.ok || !piJson.clientSecret) {
        throw new Error("Failed to initialize payment gateway.");
      }
      setClientSecret(piJson.clientSecret);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewAndPayClick = async () => {
    const err = validateStep2();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      // Check if this email has already been verified via a previous booking
      const checkRes = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: draft.email }),
      });
      const checkJson = await checkRes.json();

      if (checkJson.verified) {
        // Email already verified — go to step 3 to choose payment method
        setBookingId(null);
        setClientSecret(null);
        setStep(3);
        return;
      }

      // New email — send OTP for verification
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: draft.email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("errors.failedSendOtp"));

      setOtpError(null);
      setShowOtpModal(true);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtpAndSubmit = async () => {
    if (otpCode.length < 6) {
      setOtpError(t("errors.enterOtp"));
      return;
    }
    setOtpError(null);
    setIsVerifyingOtp(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: draft.email, token: otpCode }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("errors.invalidOtp"));

      setTrackingOtp(otpCode);
      setShowOtpModal(false);
      setBookingId(null);
      setClientSecret(null);
      setStep(3);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setOtpError(e.message);
      } else {
        setOtpError("Invalid code.");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const resendOtp = async () => {
    setOtpError(null);
    setIsResending(true);
    setResendSuccess(false);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: draft.email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("errors.failedResend"));

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setOtpError(e.message);
      } else {
        setOtpError("Failed to resend.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handlePaymentSuccess = async (bookingIdOverride?: string) => {
    // Ignore accidental click/event objects passed as the first argument
    const id =
      typeof bookingIdOverride === "string" && bookingIdOverride.length > 0
        ? bookingIdOverride
        : bookingId;
    if (!id) {
      setError("Booking not found. Please try again.");
      return;
    }

    setError(null);
    setIsConfirmingOrder(true);
    try {
      const res = await fetch(`/api/bookings/${id}/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to confirm order.");
      if (json.trackingCode) {
        setTrackingOtp(json.trackingCode);
      }
      setStep(4);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to confirm order after payment.",
      );
    } finally {
      setIsConfirmingOrder(false);
    }
  };

  if (!hasMounted)
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0A2E6D] animate-spin" />
      </div>
    );

  return (
    <div className="w-full">
      {step < 4 && <StepDots step={step} />}

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 px-5 py-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ── STEP 1: Locations + Schedule ─── */}
        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2E6D] leading-tight mb-1">
                {t("pickup")}
              </h2>
              <p className="text-[#8B7280] text-base">{t("pickupDateTime")}</p>
            </div>

            {/* Location inputs with Nominatim autocomplete */}
            <div className="space-y-3">
              <LocationInput
                label={t("pickupLocation")}
                icon={MapPin}
                value={draft.pickupLocation}
                onChange={(v) => setDraft((d) => ({ ...d, pickupLocation: v }))}
                onPin={(lat, lon, name) => {
                  onLocationPin?.(lat, lon, name);
                }}
                placeholder={t("pickupLocationPlaceholder")}
              />
              <LocationInput
                label={t("dropoffLocation")}
                icon={Navigation2}
                value={draft.dropoffLocation}
                onChange={(v) =>
                  setDraft((d) => ({ ...d, dropoffLocation: v }))
                }
                onPin={(lat, lon, name) => {
                  onLocationPin?.(lat, lon, name);
                }}
                placeholder={t("dropoffLocationPlaceholder")}
              />
            </div>

            {/* Pick-up schedule */}
            <div className="relative">
              <DateTimePicker
                label={t("pickupDateTimeLabel")}
                isOpen={activePicker === "pickup"}
                setIsOpen={(v) => setActivePicker(v ? "pickup" : null)}
                dateVal={draft.pickupDate}
                timeVal={draft.pickupTime}
                onDateChange={(v) => setDraft((d) => ({ ...d, pickupDate: v }))}
                onTimeChange={(v) => setDraft((d) => ({ ...d, pickupTime: v }))}
              />
            </div>

            {/* Delivery schedule */}
            <div className="relative">
              <DateTimePicker
                label={t("deliveryDateTimeLabel")}
                isOpen={activePicker === "delivery"}
                setIsOpen={(v) => setActivePicker(v ? "delivery" : null)}
                dateVal={draft.deliveryDate}
                timeVal={draft.deliveryTime}
                onDateChange={(v) => {
                  setDeliveryManuallyEdited(true);
                  setDraft((d) => ({ ...d, deliveryDate: v }));
                }}
                onTimeChange={(v) => {
                  setDeliveryManuallyEdited(true);
                  setDraft((d) => ({ ...d, deliveryTime: v }));
                }}
                minDateTime={minDeliveryDateTime}
              />
            </div>

            <button
              onClick={() => {
                const err = validateStep1();
                if (err) {
                  setError(err);
                  return;
                }
                setError(null);
                setStep(2);
              }}
              disabled={!canGoToStep2}
              className="w-full h-14 rounded-xl flex items-center justify-center gap-3 text-base font-semibold tracking-tight transition-all bg-[#0A2E6D] text-white hover:bg-[#0D3A8A] active:scale-[0.98] duration-200 disabled:opacity-30 disabled:hover:scale-100"
            >
              {t("continue")}{" "}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        )}

        {/* ── STEP 2: Guest Details ─── */}
        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2E6D] leading-tight mb-1">
                {t("reviewAndPay")}
              </h2>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label={t("firstName")} icon={User}>
                  <input
                    type="text"
                    value={draft.firstName}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, firstName: e.target.value }))
                    }
                    placeholder="Jane"
                    autoComplete="given-name"
                    className="w-full px-5 pb-3.5 text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none placeholder-[#8B7280]/40 tracking-tight rounded-b-xl"
                  />
                </Field>
                <Field label={t("lastName")}>
                  <input
                    type="text"
                    value={draft.lastName}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, lastName: e.target.value }))
                    }
                    placeholder="Doe"
                    autoComplete="family-name"
                    className="w-full px-5 pb-3.5 text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none placeholder-[#8B7280]/40 tracking-tight rounded-b-xl"
                  />
                </Field>
              </div>

              <Field label={t("email")} icon={Mail}>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, email: e.target.value }))
                  }
                  placeholder="jane@example.com"
                  autoComplete="email"
                  className="w-full px-5 pb-3.5 text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none placeholder-[#8B7280]/40 tracking-tight rounded-b-xl"
                />
              </Field>

              <div className="relative group w-full">
                <div className="w-full bg-[#F7F5F0] border border-transparent rounded-xl focus-within:border-[#1E5BD7] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,91,215,0.08)] transition-all duration-200">
                  <label className="px-5 pt-3.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block mb-0.5 group-focus-within:text-[#1E5BD7] transition-colors">
                    {t("phoneNumber")}
                  </label>
                  <div className="relative flex items-center pr-5">
                    <PhoneInput
                      international
                      defaultCountry="AE"
                      value={draft.phone}
                      onChange={(val) =>
                        setDraft((d) => ({ ...d, phone: val || "" }))
                      }
                      className="w-full px-5 pb-3.5 text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none"
                    />
                    <Phone className="absolute right-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8B7280]/40 pointer-events-none group-focus-within:text-[#1E5BD7] transition-colors duration-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Service Type Selection */}
            <div className="space-y-3">
              <label className="text-[10px] font-black tracking-[0.15em] uppercase text-[#8B7280] block mb-2 pl-1">
                Service Selection
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    draft.hasLuggage
                      ? "border-[#1E5BD7] bg-[#1E5BD7]/5 shadow-sm"
                      : "border-[#E5E5E5] bg-white hover:border-[#1E5BD7]/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <Luggage className={`w-5 h-5 ${draft.hasLuggage ? "text-[#1E5BD7]" : "text-[#8B7280]"}`} />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${draft.hasLuggage ? "bg-[#1E5BD7] border-[#1E5BD7]" : "border-[#E5E5E5]"}`}>
                      {draft.hasLuggage && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#0A2E6D]">Luggage Transfer</p>
                  <p className="text-[10px] text-[#8B7280] font-medium leading-tight mt-0.5">Door-to-door</p>
                </button>
                <button
                  onClick={() => {
                    const nextValue = !draft.hasChauffeur;
                    setDraft({ ...draft, hasChauffeur: nextValue });
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    draft.hasChauffeur
                      ? "border-[#1E5BD7] bg-[#1E5BD7]/5 shadow-sm"
                      : "border-[#E5E5E5] bg-white hover:border-[#1E5BD7]/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <User className={`w-5 h-5 ${draft.hasChauffeur ? "text-[#1E5BD7]" : "text-[#8B7280]"}`} />
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${draft.hasChauffeur ? "bg-[#1E5BD7] border-[#1E5BD7]" : "border-[#E5E5E5]"}`}>
                      {draft.hasChauffeur && <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />}
                    </div>
                  </div>
                  <p className="text-sm font-bold text-[#0A2E6D]">Chauffeur Service</p>
                  <p className="text-[10px] text-[#8B7280] font-medium leading-tight mt-0.5">Luxury ride</p>
                </button>
              </div>
              <p className="text-[11px] text-[#8B7280] pl-1">
                Luggage transfer is mandatory. Chauffeur service is optional.
              </p>
            </div>

            {/* Luggage Counters - ONLY if Luggage selected */}
            {draft.hasLuggage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3 pt-2"
              >
                <label className="text-[10px] font-black tracking-[0.15em] uppercase text-[#8B7280] block pl-1">
                  Luggage Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Regular Bags */}
                  <div className="bg-[#F6F2EA]/60 border border-[#E5E5E5] rounded-xl px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] mb-0.5">
                        {t("regular")}
                      </p>
                      <p className="text-[#8B7280] text-[10px] leading-tight max-w-[120px]">{t("regularDesc")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setDraft((d) => ({ ...d, regularBags: Math.max(0, d.regularBags - 1), numberOfBags: Math.max(1, d.regularBags - 1 + d.oddSizedItems) }))}
                        className="w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-lg font-semibold text-[#0A2E6D] w-5 text-center tabular-nums">
                        {draft.regularBags}
                      </span>
                      <button
                        onClick={() => setDraft((d) => ({ ...d, regularBags: d.regularBags + 1, numberOfBags: d.regularBags + 1 + d.oddSizedItems }))}
                        className="w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  {/* Odd-sized */}
                  <div className="bg-[#F6F2EA]/60 border border-[#E5E5E5] rounded-xl px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] mb-0.5">
                        {t("oddSized")}
                      </p>
                      <p className="text-[#8B7280] text-[10px] leading-tight max-w-[120px]">{t("oddSizedDesc")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setDraft((d) => ({ ...d, oddSizedItems: Math.max(0, d.oddSizedItems - 1), numberOfBags: Math.max(1, d.regularBags + d.oddSizedItems - 1) }))}
                        className="w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-lg font-semibold text-[#0A2E6D] w-5 text-center tabular-nums">
                        {draft.oddSizedItems}
                      </span>
                      <button
                        onClick={() => setDraft((d) => ({ ...d, oddSizedItems: d.oddSizedItems + 1, numberOfBags: d.regularBags + d.oddSizedItems + 1 }))}
                        className="w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Travellers counters - ONLY if Chauffeur selected */}
            {draft.hasChauffeur && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-3 pt-2"
              >
                <label className="text-[10px] font-black tracking-[0.15em] uppercase text-[#8B7280] block pl-1">
                  Passenger Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Adults */}
                  <div className="bg-[#F6F2EA]/60 border border-[#E5E5E5] rounded-xl px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] mb-0.5">
                        {t("adultsLabel")}
                      </p>
                      <p className="text-[#8B7280] text-xs">{t("adultsAge")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setDraft((d) => ({ ...d, adults: Math.max(1, d.adults - 1) }))}
                        className="w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-lg font-semibold text-[#0A2E6D] w-5 text-center tabular-nums">
                        {draft.adults}
                      </span>
                      <button
                        onClick={() => setDraft((d) => ({ ...d, adults: d.adults + 1 }))}
                        className="w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  {/* Children */}
                  <div className="bg-[#F6F2EA]/60 border border-[#E5E5E5] rounded-xl px-5 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] mb-0.5">
                        {t("childrenLabel")}
                      </p>
                      <p className="text-[#8B7280] text-xs">{t("childrenAge")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setDraft((d) => {
                          const newCount = Math.max(0, d.children - 1);
                          return { ...d, children: newCount, childrenAges: d.childrenAges.slice(0, newCount) };
                        })}
                        className="w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-lg font-semibold text-[#0A2E6D] w-5 text-center tabular-nums">
                        {draft.children}
                      </span>
                      <button
                        onClick={() => setDraft((d) => ({ ...d, children: d.children + 1, childrenAges: [...d.childrenAges, ""] }))}
                        className="w-7 h-7 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Child Ages - ONLY if Chauffeur selected */}
            {draft.hasChauffeur && draft.children > 0 && (
              <div className="space-y-3 mt-4 pt-4 border-t border-[#E5E5E5]/60">
                <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#8B7280] flex items-center gap-2 pl-1">
                  {t("childAges")}
                  <span className="text-[#1E5BD7] normal-case tracking-normal font-medium text-xs bg-[#1E5BD7]/10 px-2 py-0.5 rounded-full">
                    Required
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: draft.children }).map((_, i) => (
                    <div key={i} className="relative group w-full">
                      <div className="w-full bg-[#F6F2EA] border border-[#E5E5E5]/50 hover:border-[#1E5BD7]/40 rounded-xl focus-within:border-[#1E5BD7] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,91,215,0.08)] transition-all duration-200 flex items-center pr-3">
                        <select
                          value={draft.childrenAges[i] || ""}
                          onChange={(e) =>
                            setDraft((d) => {
                              const newAges = [...d.childrenAges];
                              newAges[i] = e.target.value;
                              return { ...d, childrenAges: newAges };
                            })
                          }
                          className="w-full px-4 py-3 text-sm font-medium text-[#0A2E6D] bg-transparent focus:outline-none appearance-none cursor-pointer"
                        >
                          <option value="" disabled>
                            {t("childAge", { number: i + 1 })}
                          </option>
                          {[
                            { value: "Under 1", label: t("ages.under1") },
                            { value: "1 year", label: t("ages.1year") },
                            { value: "2 years", label: t("ages.2years") },
                            { value: "3 years", label: t("ages.3years") },
                            { value: "4 years", label: t("ages.4years") },
                            { value: "5 years", label: t("ages.5years") },
                            { value: "6-11 years", label: t("ages.6to11") },
                          ].map((age) => (
                            <option key={age.value} value={age.value}>
                              {age.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#8B7280] pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add & select bags/items */}
            <div className="space-y-3">
              <div className="mb-2">
                <label className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block">
                  {t("summary.bags")}
                </label>
              </div>

              {/* Regular Bags */}
              <div className="bg-white border border-[#E5E5E5] rounded-xl px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#F6F2EA] rounded-lg">
                    <Luggage
                      className="w-6 h-6 text-[#1E5BD7]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0A2E6D] mb-0.5">
                      {t("regular")}{" "}
                      <span className="text-xs font-medium text-[#8B7280] normal-case">
                        {t("minimumItem")}
                      </span>
                    </p>
                    <p className="text-[#8B7280] text-xs max-w-[200px]">
                      {t("regularDesc")}
                    </p>
                    <p className="text-xs font-semibold text-[#0A2E6D] mt-1">
                      {REGULAR_BAG_PRICE} AED / bag
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        regularBags: Math.max(0, d.regularBags - 1),
                        numberOfBags: Math.max(
                          1,
                          d.regularBags - 1 + d.oddSizedItems,
                        ),
                      }))
                    }
                    className="w-8 h-8 rounded-full bg-[#F6F2EA] flex items-center justify-center text-[#0A2E6D] hover:bg-[#E5E5E5] transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-bold text-[#0A2E6D] w-6 text-center tabular-nums">
                    {draft.regularBags}
                  </span>
                  <button
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        regularBags: d.regularBags + 1,
                        numberOfBags: d.regularBags + 1 + d.oddSizedItems,
                      }))
                    }
                    className="w-8 h-8 rounded-full bg-[#F6F2EA] flex items-center justify-center text-[#0A2E6D] hover:bg-[#E5E5E5] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Odd-sized Items */}
              <div className="bg-white border border-[#E5E5E5] rounded-xl px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#F6F2EA] rounded-lg">
                    <Bike
                      className="w-6 h-6 text-[#1E5BD7]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0A2E6D] mb-0.5">
                      {t("oddSized")}
                    </p>
                    <p className="text-[#8B7280] text-xs max-w-[200px]">
                      {t("oddSizedDesc")}
                    </p>
                    <p className="text-xs font-semibold text-[#0A2E6D] mt-1">
                      {ODD_ITEM_PRICE} AED / item
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        oddSizedItems: Math.max(0, d.oddSizedItems - 1),
                        numberOfBags: Math.max(
                          1,
                          d.regularBags + d.oddSizedItems - 1,
                        ),
                      }))
                    }
                    className="w-8 h-8 rounded-full bg-[#F6F2EA] flex items-center justify-center text-[#0A2E6D] hover:bg-[#E5E5E5] transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-bold text-[#0A2E6D] w-6 text-center tabular-nums">
                    {draft.oddSizedItems}
                  </span>
                  <button
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        oddSizedItems: d.oddSizedItems + 1,
                        numberOfBags: d.regularBags + d.oddSizedItems + 1,
                      }))
                    }
                    className="w-8 h-8 rounded-full bg-[#F6F2EA] flex items-center justify-center text-[#0A2E6D] hover:bg-[#E5E5E5] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Notes */}
            <div className="relative group w-full">
              <div className="w-full bg-[#F7F5F0] border border-transparent rounded-xl focus-within:border-[#1E5BD7] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,91,215,0.08)] transition-all duration-200">
                <label className="px-5 pt-3.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block mb-0.5 group-focus-within:text-[#1E5BD7] transition-colors">
                  {t("customNotes")}
                </label>
                <textarea
                  value={draft.notes}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, notes: e.target.value }))
                  }
                  placeholder={t("customNotesPlaceholder")}
                  className="w-full px-5 pb-3.5 pt-1 text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none placeholder-[#8B7280]/40 tracking-tight resize-none h-20"
                />
              </div>
            </div>

            {distanceError && (
              <p className="text-sm text-red-600 font-medium px-1">{distanceError}</p>
            )}

            {/* Price Quotation */}
            {(() => { const price = calculateBookingPrice(draft); return (
            <div className="bg-[#F6F2EA]/40 border border-[#E5E5E5] rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#0A2E6D] tracking-tight">
                {t("priceQuotation")}
              </h3>

              {/* International badge */}
              {draft.isInternational && (
                <div className="flex items-center gap-2 bg-[#1E5BD7]/5 border border-[#1E5BD7]/20 rounded-lg px-3 py-2">
                  <span className="text-xs font-semibold text-[#1E5BD7] uppercase tracking-wide">🌍 International Shipping</span>
                </div>
              )}

              <div className="space-y-2">
                {/* Delivery fee */}
                {draft.hasLuggage && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8B7280]">
                      {distanceLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          {draft.isInternational ? "International Shipping" : "Delivery Fee"} ({t("calculating")})
                        </span>
                      ) : (
                        <>{draft.isInternational ? "International Shipping" : `Delivery Fee (${price.distanceReady ? `${Math.round(price.distanceKm)} km` : "-- km"})`}</>
                      )}
                    </span>
                    <span className="font-semibold text-[#0A2E6D]">
                      {distanceLoading || (!price.distanceReady && !draft.isInternational)
                        ? "..."
                        : `AED ${price.deliveryFee}`}
                    </span>
                  </div>
                )}

                {/* Regular bags */}
                {draft.hasLuggage && draft.regularBags > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8B7280]">
                      {t("regular")} Bags ({draft.regularBags} × AED {REGULAR_BAG_PRICE})
                    </span>
                    <span className="font-semibold text-[#0A2E6D]">
                      AED {draft.regularBags * REGULAR_BAG_PRICE}
                    </span>
                  </div>
                )}

                {/* Odd-sized items */}
                {draft.hasLuggage && draft.oddSizedItems > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8B7280]">
                      {t("oddSized")} Items ({draft.oddSizedItems} × AED {ODD_ITEM_PRICE})
                    </span>
                    <span className="font-semibold text-[#0A2E6D]">
                      AED {draft.oddSizedItems * ODD_ITEM_PRICE}
                    </span>
                  </div>
                )}

                {/* Chauffeur Service */}
                {draft.hasChauffeur && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8B7280]">
                      Chauffeur Service
                    </span>
                    <span className="font-semibold text-[#0A2E6D]">
                      AED {price.chauffeurCharge}
                    </span>
                  </div>
                )}

                {/* Surge */}
                {price.isPeak && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-orange-500 font-medium">
                      {t("highDemandSurcharge")}
                    </span>
                    <span className="font-semibold text-orange-600">
                      AED {Math.round((price.basePrice / 1.1) * 0.1)}
                    </span>
                  </div>
                )}

              </div>
              <div className="border-t border-[#E5E5E5] pt-4 space-y-2">
                {price.bagDiscount! > 0 && (
                  <>
                    <div className="flex justify-between items-center text-sm font-semibold text-[#8B7280]">
                      <span>Subtotal</span>
                      <span>AED {price.total + price.bagDiscount}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-semibold text-emerald-600">
                      <span>Multi-bag Discount (4 &amp; 4+ Bags)</span>
                      <span>- AED {price.bagDiscount}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-[#E5E5E5]/60">
                  <span className="font-bold text-[#0A2E6D]">
                    {t("totalPrice")}
                  </span>
                  <span className="text-2xl font-bold text-[#0A2E6D]">
                    {distanceLoading ||
                    (draft.hasLuggage && !price.distanceReady && !draft.isInternational)
                      ? "..."
                      : `AED ${price.total}`}
                  </span>
                </div>
              </div>
            </div>
            ); })()}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setError(null);
                  setStep(1);
                }}
                className="h-12 px-6 rounded-xl font-semibold text-[#8B7280] hover:text-[#0A2E6D] bg-[#F6F2EA] hover:bg-[#F6F2EA] border border-[#E5E5E5] transition-all flex items-center gap-2"
              >
                {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />} {t("backButton")}
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleReviewAndPayClick}
                className="flex-1 h-14 rounded-xl flex items-center justify-center gap-3 text-base font-semibold tracking-tight transition-all bg-[#0A2E6D] text-white hover:bg-[#0D3A8A] active:scale-[0.98] duration-200 disabled:opacity-40"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">{t("savingText")}</span>
                ) : (
                  <>
                    <span>{t("reviewPayButton")}</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Review ─── */}
        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2E6D] leading-tight mb-1">
                  {t("reviewOrder")}
                </h2>
                <p className="text-[#8B7280] text-base">{t("reviewSubtitle")}</p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="h-10 px-4 rounded-xl font-semibold text-[#8B7280] hover:text-[#0A2E6D] bg-[#F6F2EA] border border-[#E5E5E5] transition-all flex items-center gap-2 text-xs"
              >
                {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />} {t("backButton")}
              </button>
            </div>

            <div className="bg-[#F6F2EA]/40 border border-[#E5E5E5] rounded-xl overflow-hidden">
              {[
                {
                  label: "Service",
                  value: `${draft.hasLuggage ? "Luggage Transfer" : ""}${draft.hasLuggage && draft.hasChauffeur ? " + " : ""}${draft.hasChauffeur ? "Chauffeur Service" : ""}`,
                },
                {
                  label: t("summary.pickup"),
                  value: `${draft.pickupLocation} @ ${draft.pickupTime}`,
                },
                {
                  label: t("summary.dropoff"),
                  value: `${draft.dropoffLocation} @ ${draft.deliveryTime}`,
                },
                {
                  label: t("summary.bags"),
                  value: `${draft.numberOfBags} (${draft.regularBags} ${t("regular")}, ${draft.oddSizedItems} ${t("oddSized")})`,
                },
                {
                  label: t("summary.guest"),
                  value: `${draft.firstName} ${draft.lastName}`,
                },
                { label: t("summary.contact"), value: draft.email },
                {
                  label: t("summary.travellers"),
                  value: `${draft.adults} ${draft.adults !== 1 ? t("summary.adults") : t("summary.adult")}${draft.children > 0 ? `, ${draft.children} ${draft.children !== 1 ? t("summary.children") : t("summary.child")} (${t("summary.ages")}: ${draft.childrenAges.join(", ")})` : ""}`,
                },
                {
                  label: t("paymentMethod"),
                  value:
                    draft.paymentMethod === "cod"
                      ? t("cashOnDelivery")
                      : t("cardPayment"),
                },
              ].map(({ label, value }, i, arr) => (
                <div
                  key={label}
                  className={`flex justify-between items-start gap-4 px-6 py-4 ${i < arr.length - 1 ? "border-b border-[#E5E5E5]" : ""}`}
                >
                  <span className="text-[11px] uppercase tracking-widest font-semibold text-[#8B7280] min-w-[80px] pt-0.5">
                    {label}
                  </span>
                  <span className="text-[#0A2E6D] text-sm font-medium text-right leading-snug">
                    {value}
                  </span>
                </div>
              ))}
              {/* Extras removed */}
            </div>

            {/* Promo Code Section */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#0A2E6D] tracking-tight">
                  {pt("title")}
                </h3>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={pt("placeholder")}
                  value={draft.promoCode}
                  onChange={(e) => {
                    setDraft({ ...draft, promoCode: e.target.value.toUpperCase() });
                    setPromoError(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#F6F2EA] border border-transparent focus:border-[#1E5BD7] focus:bg-white text-[#0A2E6D] font-bold tracking-wider placeholder-[#8B7280]/40 outline-none transition-all"
                />
                <button
                  disabled={promoLoading || !draft.promoCode}
                  onClick={async () => {
                    setPromoLoading(true);
                    setPromoError(null);
                    try {
                      const price = calculateBookingPrice(draft);
                      const res = await fetch("/api/promo/validate", {
                        method: "POST",
                        body: JSON.stringify({ 
                          code: draft.promoCode,
                          bookingAmount: price.total + (draft.promoDiscount || 0)
                        }),
                      });
                      const data = await res.json();
                      if (data.success) {
                        let discount = 0;
                        if (data.discount_type === "amount") {
                          discount = data.discount_value;
                        } else {
                          discount = Math.round((price.total + (draft.promoDiscount || 0)) * (data.discount_value / 100));
                        }
                        setDraft({ ...draft, promoDiscount: discount });
                      } else {
                        const errorMsg = data.error || pt("invalid");
                        setPromoError(errorMsg);
                        setDraft({ ...draft, promoDiscount: 0 });
                      }
                    } catch {
                      setPromoError("Failed to validate promo code");
                    } finally {
                      setPromoLoading(false);
                    }
                  }}
                  className="px-6 py-3 rounded-xl bg-[#0A2E6D] text-white font-bold text-sm hover:bg-[#0D3A8A] transition-all active:scale-95 disabled:opacity-50 min-w-[120px]"
                >
                  {promoLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : pt("apply")}
                </button>
              </div>
              {promoError && (
                <p className="text-red-500 text-xs font-bold">{promoError}</p>
              )}
              {draft.promoDiscount! > 0 && !promoError && (
                <p className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Promo applied! AED {draft.promoDiscount} saved.
                </p>
              )}
            </div>

            {/* Payment method — booking is created here with selected method */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#0A2E6D] tracking-tight">
                {t("paymentMethod")}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setBookingId(null);
                    setClientSecret(null);
                    setDraft({ ...draft, paymentMethod: "card" });
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    draft.paymentMethod !== "cod"
                      ? "border-[#1E5BD7] bg-[#1E5BD7]/5"
                      : "border-[#E5E5E5] hover:border-[#1E5BD7]/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <CreditCard className="w-6 h-6 text-[#0A2E6D]" />
                    <span className="text-sm font-semibold text-[#0A2E6D]">{t("cardPayment")}</span>
                    <span className="text-xs text-[#8B7280]">{t("cardPaymentDesc")}</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBookingId(null);
                    setClientSecret(null);
                    setDraft({ ...draft, paymentMethod: "cod" });
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    draft.paymentMethod === "cod"
                      ? "border-[#1E5BD7] bg-[#1E5BD7]/5"
                      : "border-[#E5E5E5] hover:border-[#1E5BD7]/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Banknote className="w-6 h-6 text-[#0A2E6D]" />
                    <span className="text-sm font-semibold text-[#0A2E6D]">{t("cashOnDelivery")}</span>
                    <span className="text-xs text-[#8B7280]">{t("cashOnDeliveryDesc")}</span>
                  </div>
                </button>
              </div>
            </div>

            {distanceError && (
              <p className="text-sm text-red-600 font-medium px-1">{distanceError}</p>
            )}

            {/* Price Quotation */}
            {(() => { const price = calculateBookingPrice(draft); return (
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#0A2E6D] tracking-tight">
                {t("quotation")}
              </h3>

              {/* International badge */}
              {draft.isInternational && (
                <div className="flex items-center gap-2 bg-[#1E5BD7]/5 border border-[#1E5BD7]/20 rounded-lg px-3 py-2">
                  <span className="text-xs font-semibold text-[#1E5BD7] uppercase tracking-wide">🌍 International Shipping · 5-7 business days</span>
                </div>
              )}

              <div className="space-y-2">
                {/* Delivery fee */}
                {draft.hasLuggage && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8B7280]">
                      {distanceLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          {t("calculating")}
                        </span>
                      ) : draft.isInternational ? (
                        "International Shipping"
                      ) : (
                        `Delivery Fee (${price.distanceReady ? `${Math.round(price.distanceKm)} km` : "-- km"})`
                      )}
                    </span>
                    <span className="font-semibold text-[#0A2E6D]">
                      {distanceLoading || (!price.distanceReady && !draft.isInternational)
                        ? "..."
                        : `AED ${price.deliveryFee}`}
                    </span>
                  </div>
                )}

                {/* Regular bags */}
                {draft.hasLuggage && draft.regularBags > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8B7280]">
                      {t("regular")} Bags ({draft.regularBags} × AED {REGULAR_BAG_PRICE})
                    </span>
                    <span className="font-semibold text-[#0A2E6D]">
                      AED {draft.regularBags * REGULAR_BAG_PRICE}
                    </span>
                  </div>
                )}

                {/* Odd-sized items */}
                {draft.hasLuggage && draft.oddSizedItems > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8B7280]">
                      {t("oddSized")} Items ({draft.oddSizedItems} × AED {ODD_ITEM_PRICE})
                    </span>
                    <span className="font-semibold text-[#0A2E6D]">
                      AED {draft.oddSizedItems * ODD_ITEM_PRICE}
                    </span>
                  </div>
                )}

                {/* Chauffeur Service */}
                {draft.hasChauffeur && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8B7280]">
                      Chauffeur Service
                    </span>
                    <span className="font-semibold text-[#0A2E6D]">
                      AED {price.chauffeurCharge}
                    </span>
                  </div>
                )}

                {/* Surge */}
                {price.isPeak && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-orange-500 font-medium">
                      {t("highDemandSurcharge")}
                    </span>
                    <span className="font-semibold text-orange-600">
                      AED {Math.round((price.basePrice / 1.1) * 0.1)}
                    </span>
                  </div>
                )}

              </div>
              <div className="border-t border-[#E5E5E5] pt-4 space-y-2">
                {(price.bagDiscount! > 0 || (draft.promoDiscount || 0) > 0) && (
                  <>
                    <div className="flex justify-between items-center text-sm font-semibold text-[#8B7280]">
                      <span>Subtotal</span>
                      <span>AED {price.total + price.bagDiscount + (draft.promoDiscount || 0)}</span>
                    </div>
                    {price.bagDiscount! > 0 && (
                      <div className="flex justify-between items-center text-sm font-semibold text-emerald-600">
                        <span>Multi-bag Discount (4 &amp; 4+ Bags)</span>
                        <span>- AED {price.bagDiscount}</span>
                      </div>
                    )}
                    {(draft.promoDiscount || 0) > 0 && (
                      <div className="flex justify-between items-center text-sm font-semibold text-emerald-600">
                        <span>Promo Discount</span>
                        <span>- AED {draft.promoDiscount}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between items-center pt-2 border-t border-[#E5E5E5]/60">
                  <span className="font-bold text-[#0A2E6D]">
                    {t("totalPrice")}
                  </span>
                  <span className="text-2xl font-bold text-[#0A2E6D]">
                    {distanceLoading ||
                    (draft.hasLuggage && !price.distanceReady && !draft.isInternational)
                      ? "..."
                      : `AED ${price.total}`}
                  </span>
                </div>
              </div>
            </div>
            ); })()}

            {isConfirmingOrder ? (
              <div className="flex flex-col items-center justify-center h-32 gap-3">
                <Loader2 className="w-6 h-6 text-[#1E5BD7] animate-spin" />
                <p className="text-sm text-[#8B7280] font-medium animate-pulse">
                  {t("confirmingOrder")}
                </p>
              </div>
            ) : !bookingId ? (
              <div className="bg-white border border-[#E5E5E5] p-5 rounded-xl shadow-sm space-y-4">
                {draft.paymentMethod === "cod" ? (
                  <p className="text-sm text-[#8B7280] text-center">
                    {t("codPayMessage", { amount: calculateBookingPrice(draft).total })}
                  </p>
                ) : (
                  <p className="text-sm text-[#8B7280] text-center">
                    {t("cardPaymentDesc")}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => submitBooking()}
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl flex items-center justify-center gap-3 text-base font-semibold tracking-tight transition-all bg-[#0A2E6D] text-white hover:bg-[#0D3A8A] active:scale-[0.98] duration-200 disabled:opacity-40"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">{t("confirming")}</span>
                  ) : draft.paymentMethod === "cod" ? (
                    <>
                      <span>{t("confirmOrder")}</span>
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      <span>{t("continue")}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            ) : draft.paymentMethod === "cod" && bookingId ? (
              <div className="bg-white border border-[#E5E5E5] p-5 rounded-xl shadow-sm space-y-4">
                {error && (
                  <p className="text-sm text-red-600 text-center font-medium">{error}</p>
                )}
                {!error && (
                  <p className="text-sm text-[#8B7280] text-center">
                    {t("codPayMessage", { amount: calculateBookingPrice(draft).total })}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => handlePaymentSuccess(bookingId)}
                  disabled={isConfirmingOrder}
                  className="w-full h-12 rounded-xl flex items-center justify-center gap-3 text-base font-semibold tracking-tight transition-all bg-[#0A2E6D] text-white hover:bg-[#0D3A8A] active:scale-[0.98] duration-200 disabled:opacity-40"
                >
                  {isConfirmingOrder ? (
                    <span className="animate-pulse">{t("confirming")}</span>
                  ) : (
                    <>
                      <span>{t("confirmOrder")}</span>
                      <CheckCircle2 className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            ) : clientSecret ? (
              <div className="bg-white border border-[#E5E5E5] p-5 rounded-xl shadow-sm">
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance: { theme: "stripe" } }}
                >
                  <StripePaymentForm
                    onSuccess={() => void handlePaymentSuccess()}
                    isSubmitting={isSubmitting}
                    setIsSubmitting={setIsSubmitting}
                  />
                </Elements>
                <div className="mt-4 pt-4 border-t border-dashed border-[#E5E5E5]">
                  <p className="text-xs text-[#8B7280] text-center mb-2">
                    Development Testing
                  </p>
                  <button
                    type="button"
                    onClick={() => void handlePaymentSuccess(bookingId ?? undefined)}
                    disabled={isConfirmingOrder || !bookingId}
                    className="w-full h-10 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors text-sm font-semibold flex items-center justify-center disabled:opacity-50"
                  >
                    Bypass Payment & Trigger Flow
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-6 h-6 text-[#1E5BD7] animate-spin" />
              </div>
            )}

            {/* Legal Links Section */}
            <div className="pt-4 text-center space-y-4">
              <p className="text-[11px] text-[#8B7280] leading-relaxed max-w-md mx-auto">
                {lt.rich("bookingAcceptance", {
                  terms: (chunks) => <Link href="/terms" className="hover:underline text-[#0A2E6D] font-bold">{chunks}</Link>,
                  privacy: (chunks) => <Link href="/privacy-policy" className="hover:underline text-[#0A2E6D] font-bold">{chunks}</Link>,
                  prohibited: (chunks) => <Link href="/prohibited-items" className="hover:underline text-[#0A2E6D] font-bold">{chunks}</Link>
                })}
              </p>
              <div className="flex justify-center gap-4 text-[10px] font-bold text-[#1E5BD7] uppercase tracking-widest">
                <Link href="/terms" className="hover:underline">{lt("termsOfService")}</Link>
                <span className="text-[#E5E5E5]">|</span>
                <Link href="/privacy-policy" className="hover:underline">{lt("privacyPolicy")}</Link>
                <span className="text-[#E5E5E5]">|</span>
                <Link href="/prohibited-items" className="hover:underline">{lt("prohibitedItems")}</Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 4: Confirmation ─── */}
        {step === 4 && (
          <motion.div
            key="s4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center py-16 space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center"
            >
              <CheckCircle2 className="w-9 h-9 text-emerald-500" />
            </motion.div>

            <div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold tracking-tight text-[#0A2E6D] mb-3"
              >
                {t("paymentSuccessTitle")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-[#8B7280] text-base max-w-sm mx-auto leading-relaxed"
              >
                {t("paymentSuccessDesc")}
              </motion.p>
            </div>

            {/* Tracking details card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-xs bg-[#F6F2EA]/60 border border-[#E5E5E5] rounded-xl p-5 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280]">
                  {t("totalPaid")}
                </span>
                <span className="text-[#0A2E6D] font-bold text-sm">
                  AED {calculateBookingPrice(draft).total}
                </span>
              </div>
              {trackingOtp && (
                <div className="flex justify-between items-center pt-2 border-t border-[#E5E5E5]">
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280]">
                    {t("trackingCode")}
                  </span>
                  <span className="text-[#1E5BD7] font-bold tracking-[0.2em] font-mono text-lg">
                    {trackingOtp}
                  </span>
                </div>
              )}
              <p className="text-[10px] text-[#8B7280] text-center pt-1">
                {t("trackingInstruction")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-700 text-xs font-semibold">
                {t("bookingConfirmed")}
              </span>
            </motion.div>

            <button
              onClick={() => {
                setStep(1);
                setDraft(defaultDraft);
                setBookingId(null);
                setError(null);
                setTrackingOtp(null);
              }}
              className="h-12 px-8 rounded-xl font-semibold text-[#8B7280] hover:text-[#0A2E6D] bg-[#F6F2EA] border border-[#E5E5E5] transition-all text-sm"
            >
              {t("bookAnother")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── OTP Modal ── */}
      <AnimatePresence>
        {showOtpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white border border-[#E5E5E5] rounded-2xl p-8 max-w-sm w-full shadow-[0_20px_60px_rgba(10,46,109,0.15)] relative"
            >
              <button
                onClick={() => setShowOtpModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F6F2EA] flex items-center justify-center text-[#8B7280] hover:bg-[#E5E5E5] hover:text-[#0A2E6D] transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6 mt-2 text-center">
                <div className="w-32 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Image
                    src="/Logo_primary.png"
                    alt="Logo"
                    width={150}
                    height={50}
                    className="w-auto h-16 object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#0A2E6D] mb-2">
                  {t("auth.verifyEmail")}
                </h3>
                <p className="text-[#8B7280] text-sm leading-relaxed">
                  {t("auth.otpSent")} <br />
                  <span className="text-[#0A2E6D] font-medium">
                    {draft.email}
                  </span>
                </p>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {otpError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center font-medium"
                    >
                      {otpError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => {
                    setOtpCode(e.target.value.replace(/\D/g, ""));
                    setOtpError(null);
                  }}
                  className="w-full text-center text-2xl tracking-[0.4em] font-mono bg-[#F6F2EA] border border-[#E5E5E5] rounded-xl py-4 focus:outline-none focus:border-[#1E5BD7] focus:bg-white text-[#0A2E6D] placeholder-[#8B7280]/20 transition-all"
                />
                <button
                  disabled={isVerifyingOtp || otpCode.length < 6}
                  onClick={verifyOtpAndSubmit}
                  className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-base font-semibold transition-all bg-[#0A2E6D] text-white hover:bg-[#0D3A8A] disabled:opacity-50 active:scale-[0.98] duration-200"
                >
                  {isVerifyingOtp ? t("processing") : t("auth.verify")}
                </button>

                <div className="pt-2 text-center">
                  <button
                    onClick={resendOtp}
                    disabled={isResending || resendSuccess}
                    className="text-sm font-medium text-[#8B7280] hover:text-[#0A2E6D] transition-colors disabled:opacity-50"
                  >
                    {isResending
                      ? t("auth.resending")
                      : resendSuccess
                        ? t("auth.codeSent")
                        : t("auth.resend")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
