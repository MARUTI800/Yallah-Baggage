"use client"

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import Image from "next/image"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
import {
  ArrowRight, ArrowLeft, MapPin, Navigation2, Calendar, Clock,
  User, Mail, Phone, CheckCircle2, Minus, Plus, Loader2, Check, X,
  ChevronLeft, ChevronRight
} from "lucide-react"
import { getDubaiTime } from "@/lib/utils"

type Step = 1 | 2 | 3 | 4

type BookingDraft = {
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string
  pickupTime: string
  deliveryDate: string
  deliveryTime: string
  firstName: string
  lastName: string
  email: string
  phone: string
  numberOfBags: number // kept for total sum if needed
  cabinBags: number
  largeBags: number
  additionalItems: string[]
  notes: string
  serviceType: "Standard" | "Yallah Express"
  adults: number
  children: number
  childrenAges: string[]
  pickupLat: number | null
  pickupLon: number | null
  dropoffLat: number | null
  dropoffLon: number | null
}

interface GooglePrediction {
  place_id: string
  description: string
  structured_formatting?: {
    main_text: string
    secondary_text: string
  }
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
  cabinBags: 1,
  largeBags: 0,
  additionalItems: [],
  notes: "",
  serviceType: "Standard",
  adults: 1,
  children: 0,
  childrenAges: [],
  pickupLat: null,
  pickupLon: null,
  dropoffLat: null,
  dropoffLon: null,
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// ── Pricing & Distance Utilities ──────────────────────────────────
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function calculatePrice(draft: BookingDraft) {
  let distanceKm = 0;
  if (draft.pickupLat && draft.pickupLon && draft.dropoffLat && draft.dropoffLon) {
    distanceKm = calculateDistance(draft.pickupLat, draft.pickupLon, draft.dropoffLat, draft.dropoffLon);
  } else {
    distanceKm = 10; // Fallback distance if coordinates are missing
  }

  // Basic pricing rules
  let basePrice = 40 + (distanceKm * 2); // AED 40 base + 2 AED/km

  // Bag surcharges
  basePrice += (draft.cabinBags * 15); // AED 15 per cabin bag
  basePrice += (draft.largeBags * 30); // AED 30 per large bag

  // Additional items
  if (draft.additionalItems.includes("Motorbike")) basePrice += 50;
  if (draft.additionalItems.includes("Stroller")) basePrice += 20;
  if (draft.additionalItems.includes("Sports Equip")) basePrice += 40;
  if (draft.additionalItems.includes("Baby Seat")) basePrice += 25;

  // Peak Hours check (8AM-10AM or 5PM-8PM)
  let isPeak = false;
  if (draft.pickupTime) {
    const timeMatch = draft.pickupTime.match(/(\d+):(\d+)\s(AM|PM)/);
    if (timeMatch) {
      let h = parseInt(timeMatch[1]);
      const isPM = timeMatch[3] === "PM";
      if (isPM && h !== 12) h += 12;
      if (!isPM && h === 12) h = 0;
      if ((h >= 8 && h < 10) || (h >= 17 && h < 20)) {
        isPeak = true;
      }
    }
  }

  if (isPeak) {
    basePrice *= 1.25; // 25% peak hour surcharge
  }

  // 30-minute Urgency check (Yallah Express)
  let isUrgent = false;
  if (draft.pickupDate && draft.pickupTime) {
    const pickupDT = getComparableDate(draft.pickupDate, draft.pickupTime);
    const now = getDubaiTime();
    const diffNowMins = (pickupDT.getTime() - now.getTime()) / (1000 * 60);

    // 1. Pickup is within 30 mins of now
    if (diffNowMins > 0 && diffNowMins <= 30) {
      isUrgent = true;
    }

    // 2. Delivery is within 60 mins of pickup (Direct Delivery)
    if (draft.deliveryDate && draft.deliveryTime) {
      const deliveryDT = getComparableDate(draft.deliveryDate, draft.deliveryTime);
      const gapMins = (deliveryDT.getTime() - pickupDT.getTime()) / (1000 * 60);
      if (gapMins > 0 && gapMins <= 60) {
        isUrgent = true;
      }
    }
  }

  let expressSurcharge = (draft.serviceType === "Yallah Express" || isUrgent) ? 80 : 0;
  let total = Math.round(basePrice + expressSurcharge);

  return { distanceKm, basePrice: Math.round(basePrice), expressSurcharge, total, isPeak, isUrgent };
}

// ── Location Autocomplete ──────────────────────────────────────────
function LocationInput({
  label,
  icon: Icon,
  value,
  onChange,
  onPin,
  placeholder,
}: {
  label: string
  icon: React.ElementType
  value: string
  onChange: (val: string) => void
  onPin?: (lat: string, lon: string, name: string) => void
  placeholder: string
}) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<GooglePrediction[]>([])
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Search google places
  useEffect(() => {
    if (confirmed || query.length < 3) { setResults([]); return }
    const tid = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(query)}`)
        const data = await res.json()
        if (data.predictions) {
          setResults(data.predictions)
        } else {
          setResults([])
        }
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 350)
    return () => clearTimeout(tid)
  }, [query, confirmed])

  // Sync external value resets
  useEffect(() => {
    if (!value) { setQuery(""); setConfirmed(false) }
  }, [value])

  const select = useCallback(async (loc: GooglePrediction) => {
    // loc.description contains the full exact address or place name with context (e.g., "Villa 12, Street 5, Dubai, UAE")
    const fullText = loc.description
    setQuery(fullText)
    onChange(fullText)
    setConfirmed(true)
    setResults([])

    try {
      const res = await fetch(`/api/places/details?place_id=${loc.place_id}`)
      const data = await res.json()
      if (data.lat && data.lon) {
        onPin?.(data.lat.toString(), data.lon.toString(), data.name || fullText)
      }
    } catch (err) {
      console.error("Failed to fetch place details:", err)
    }
  }, [onChange, onPin])

  const geocodeCustomAddress = async (searchQuery: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/places/geocode?address=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()

      // We always preserve the exact text the user typed for custom searches
      setQuery(searchQuery)
      onChange(searchQuery)
      setConfirmed(true)
      setResults([])

      if (data.lat && data.lon) {
        onPin?.(data.lat.toString(), data.lon.toString(), searchQuery)
      }
    } catch (err) {
      console.error("Geocoding failed", err)
      setConfirmed(true)
    } finally {
      setLoading(false)
    }
  }

  const showDropdown = focused && !confirmed && query.length >= 3

  return (
    <div ref={containerRef} className="relative group w-full">
      <div className={`w-full bg-[#F7F5F0] border rounded-xl px-5 pt-3 pb-3 transition-all duration-200 ${focused ? "border-[#1E5BD7] bg-white shadow-[0_0_0_3px_rgba(30,91,215,0.08)]" : "border-transparent hover:bg-[#F0EEE9]"
        }`}>
        <label className={`text-[10px] font-semibold tracking-[0.15em] uppercase block mb-1 transition-colors ${focused ? "text-[#1E5BD7]" : "text-[#8B7280]"
          }`}>
          {label}
        </label>
        <div className="flex items-center gap-2 pr-6">
          <input
            type="text"
            value={query}
            placeholder={placeholder}
            className="w-full text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none placeholder-[#8B7280]/40 tracking-tight"
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onChange={e => {
              setQuery(e.target.value)
              onChange(e.target.value)
              setConfirmed(false)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                if (!confirmed && query.length >= 3) {
                  if (results.length > 0) {
                    select(results[0])
                  } else {
                    geocodeCustomAddress(query)
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Status icon */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        {loading
          ? <Loader2 className="w-4 h-4 text-[#8B7280] animate-spin" />
          : confirmed
            ? <Check className="w-4 h-4 text-[#1E5BD7]" />
            : <Icon className="w-4 h-4 text-[#8B7280]/40" />
        }
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
            {results.length > 0 ? results.map(loc => {
              const mainText = loc.structured_formatting?.main_text || loc.description.split(",")[0]
              const sub = loc.structured_formatting?.secondary_text || loc.description.split(",").slice(1).join(", ")
              return (
                <div
                  key={loc.place_id}
                  onMouseDown={() => select(loc)}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-[#F6F2EA] cursor-pointer group/item transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#F6F2EA] flex items-center justify-center flex-shrink-0 transition-all">
                    <MapPin className="w-3.5 h-3.5 text-[#0A2E6D]" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[#0A2E6D] text-sm font-medium truncate tracking-tight">{mainText}</span>
                    {sub && <span className="text-[#8B7280] text-xs truncate">{sub}</span>}
                  </div>
                </div>
              )
            }) : !loading ? (
              <div
                onMouseDown={() => geocodeCustomAddress(query)}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[#F6F2EA] cursor-pointer group/item transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#F6F2EA] flex items-center justify-center flex-shrink-0 transition-all">
                  <MapPin className="w-3.5 h-3.5 text-[#0A2E6D]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[#0A2E6D] text-sm font-medium truncate tracking-tight">Search for "{query}"</span>
                  <span className="text-[#8B7280] text-xs truncate">Use exact custom location</span>
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Styled Field wrapper (for non-location fields) ────────────────
const Field = ({
  label, icon: Icon, children, className = ""
}: { label: string; icon?: React.ElementType; children: React.ReactNode; className?: string }) => (
  <div className={`relative group w-full ${className}`}>
    <div className="w-full bg-[#F7F5F0] border border-transparent rounded-xl focus-within:border-[#1E5BD7] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,91,215,0.08)] transition-all duration-200">
      <label className="px-5 pt-3.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block mb-0.5 group-focus-within:text-[#1E5BD7] transition-colors">
        {label}
      </label>
      <div className="relative">
        {children}
        {Icon && <Icon className="absolute right-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8B7280]/40 pointer-events-none group-focus-within:text-[#1E5BD7] transition-colors duration-200" />}
      </div>
    </div>
  </div>
)

// ── Step dots ─────────────────────────────────────────────────────
const StepDots = ({ step }: { step: Step }) => (
  <div className="flex items-center gap-2 mb-8">
    {[1, 2, 3].map(s => (
      <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s < step ? "w-8 bg-[#1E5BD7]" : s === step ? "w-8 bg-[#0A2E6D]" : "w-4 bg-[#E5E5E5]"
        }`} />
    ))}
    <span className="ml-2 text-[#8B7280] text-xs font-medium tracking-widest uppercase">
      Step {Math.min(step, 3)} / 3
    </span>
  </div>
)

// ── Date / Time Picker ────────────────────────────────────────────
const generateDates = () => {
  const dates: Date[] = []
  const now = getDubaiTime()
  for (let i = 0; i < 14; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    dates.push(d)
  }
  return dates
}


const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })

const getComparableDate = (dStr: string, tStr: string) => {
  const dates = generateDates()
  const matched = dates.find(d => fmtDate(d) === dStr)
  if (!matched) return new Date(0)

  const match = tStr.match(/(\d+):(\d+)\s(AM|PM)/)
  if (!match) return new Date(0)
  let h = parseInt(match[1])
  const m = parseInt(match[2])
  const isPM = match[3] === "PM"
  if (isPM && h !== 12) h += 12
  if (!isPM && h === 12) h = 0

  const finalDate = new Date(matched)
  finalDate.setHours(h, m, 0, 0)
  return finalDate
}

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1)
  const days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay()
}

function DateTimePicker({
  label, dateVal, timeVal, onDateChange, onTimeChange, minDateTime, isOpen, setIsOpen
}: {
  label: string
  dateVal: string
  timeVal: string
  onDateChange: (v: string) => void
  onTimeChange: (v: string) => void
  minDateTime?: Date
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}) {

  const availableTimesList = useMemo(() => Array.from({ length: 29 }, (_, i) => {
    const totalMins = 8 * 60 + i * 30
    const h = Math.floor(totalMins / 60)
    const m = totalMins % 60
    const period = h >= 12 ? "PM" : "AM"
    return `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${m.toString().padStart(2, "0")} ${period}`
  }), [])

  // parse dateVal or use today
  const selectedDate = useMemo(() => {
    if (!dateVal) return getDubaiTime()
    const match = generateDates().find(d => fmtDate(d) === dateVal)
    return match || getDubaiTime()
  }, [dateVal])

  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))

  const nextMonth = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }
  const prevMonth = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth())
  const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth())
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  return (
    <div className={`relative flex flex-col w-full group transition-all duration-200 ${isOpen ? "z-50" : "z-10"}`}>
      <div
        className={`bg-[#F7F5F0] border rounded-xl px-5 py-3.5 cursor-pointer transition-all duration-200 ${isOpen ? "border-[#1E5BD7] bg-white shadow-[0_0_0_3px_rgba(30,91,215,0.08)]" : "border-transparent hover:bg-[#F0EEE9]"
          }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
            <Calendar className="w-5 h-5 text-[#0A2E6D]" />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block mb-1">{label}</span>
            <div className="text-[15px] font-medium text-[#0A2E6D] tracking-tight">
              {dateVal ? `${dateVal} at ${timeVal || "Pick time"}` : "Pick Date & Time"}
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
              <span className="text-sm font-bold text-[#0A2E6D]">{monthName}</span>
              <div className="flex gap-1">
                <button type="button" onClick={prevMonth} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F6F2EA] text-[#0A2E6D] transition-all"><ChevronLeft className="w-4 h-4" /></button>
                <button type="button" onClick={nextMonth} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F6F2EA] text-[#0A2E6D] transition-all"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {weekDays.map(wd => (
                <div key={wd} className="text-[10px] font-bold text-[#8B7280] text-center mb-1">{wd}</div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {daysInMonth.map(day => {
                const isSelected = day.toDateString() === selectedDate.toDateString();
                const isToday = day.toDateString() === getDubaiTime().toDateString();

                const todayDateOnly = getDubaiTime();
                todayDateOnly.setHours(0, 0, 0, 0);

                const minDateOnly = minDateTime ? new Date(minDateTime) : new Date(todayDateOnly);
                minDateOnly.setHours(0, 0, 0, 0);

                const isPast = day < minDateOnly;

                return (
                  <button
                    key={day.toString()}
                    type="button"
                    onClick={() => { if (!isPast) onDateChange(fmtDate(day)); }}
                    disabled={isPast}
                    className={`w-7 h-7 mx-auto flex items-center justify-center rounded-full text-xs font-medium transition-all mb-1 ${isPast ? "text-[#8B7280]/40 cursor-not-allowed" :
                      isSelected ? "bg-[#1E5BD7] text-white shadow-md font-bold" :
                        isToday ? "text-[#1E5BD7] font-bold hover:bg-[#1E5BD7]/10" :
                          "text-[#0A2E6D] hover:bg-[#F6F2EA]"
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
                <span className="text-xs font-bold text-[#0A2E6D]">Time</span>
              </div>
              <div className="flex overflow-x-auto pb-1 gap-2 snap-x scrollbar-hide no-scrollbar">
                <style dangerouslySetInnerHTML={{ __html: `.no-scrollbar::-webkit-scrollbar { display: none; }` }} />
                {availableTimesList.map(t => {
                  let isTimeDisabled = false;
                  if (minDateTime) {
                    const selDateOnly = new Date(selectedDate);
                    selDateOnly.setHours(0, 0, 0, 0);
                    const minDOnly = new Date(minDateTime);
                    minDOnly.setHours(0, 0, 0, 0);

                    if (selDateOnly.getTime() === minDOnly.getTime()) {
                      const match = t.match(/(\d+):(\d+)\s(AM|PM)/);
                      if (match) {
                        let h = parseInt(match[1]);
                        const m = parseInt(match[2]);
                        const isPM = match[3] === "PM";
                        if (isPM && h !== 12) h += 12;
                        if (!isPM && h === 12) h = 0;
                        const tDate = new Date(selectedDate);
                        tDate.setHours(h, m, 0, 0);
                        if (tDate.getTime() <= minDateTime.getTime()) {
                          isTimeDisabled = true;
                        }
                      }
                    } else if (selDateOnly.getTime() < minDOnly.getTime()) {
                      isTimeDisabled = true;
                    }
                  }

                  return (
                    <button
                      key={t}
                      type="button"
                      disabled={isTimeDisabled}
                      onClick={() => {
                        if (!isTimeDisabled) {
                          onTimeChange(t);
                          if (!dateVal) {
                            onDateChange(fmtDate(selectedDate));
                          }
                          setIsOpen(false);
                        }
                      }}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all snap-start ${isTimeDisabled ? "bg-[#F6F2EA]/50 text-[#8B7280]/40 cursor-not-allowed" :
                        timeVal === t
                          ? "bg-[#1E5BD7] text-white shadow-md font-bold"
                          : "bg-[#F6F2EA] text-[#0A2E6D] hover:bg-[#E5E5E5]"
                        }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Stripe Payment Form ───────────────────────────────────────────
function StripePaymentForm({ onSuccess, isSubmitting, setIsSubmitting }: { onSuccess: () => void, isSubmitting: boolean, setIsSubmitting: (s: boolean) => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsSubmitting(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message ?? "Please complete the payment details.")
      setIsSubmitting(false)
      return
    }

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })

    if (error) {
      setError(error.message ?? "Payment failed.")
      setIsSubmitting(false)
    } else {
      onSuccess()
      setTimeout(() => setIsSubmitting(false), 500)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement options={{ layout: "tabs" }} />
      {error && <div className="mt-3 text-red-500 text-sm font-medium">{error}</div>}
      <button
        disabled={isSubmitting || !stripe || !elements}
        type="submit"
        className="w-full h-14 mt-6 rounded-xl flex items-center justify-center gap-3 text-base font-semibold tracking-tight transition-all bg-[#0A2E6D] text-white hover:bg-[#0D3A8A] active:scale-[0.98] duration-200 disabled:opacity-40"
      >
        {isSubmitting ? <span className="animate-pulse">Processing Payment…</span> : "Confirm & Pay"}
      </button>
    </form>
  )
}

// ── Main Wizard ───────────────────────────────────────────────────
export function BookingWizard({
  onLocationPin,
  initialDraft = {}
}: {
  onLocationPin?: (lat: string, lon: string, name: string) => void
  initialDraft?: Partial<BookingDraft>
}) {
  const [step, setStep] = useState<Step>(1)
  const [activePicker, setActivePicker] = useState<'pickup' | 'delivery' | null>(null)
  const [draft, setDraft] = useState<BookingDraft>({ ...defaultDraft, ...initialDraft })
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [otpError, setOtpError] = useState<string | null>(null)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [trackingOtp, setTrackingOtp] = useState<string | null>(null)
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  const pickupDateTime = useMemo(() => getComparableDate(draft.pickupDate, draft.pickupTime), [draft.pickupDate, draft.pickupTime])

  useEffect(() => {
    if (!draft.pickupDate || !draft.pickupTime) return;
    const ddt = getComparableDate(draft.deliveryDate, draft.deliveryTime);
    if (ddt.getTime() <= pickupDateTime.getTime()) {
      const newDDT = new Date(pickupDateTime.getTime() + 60 * 60 * 1000); // +1 hour

      const newDateStr = fmtDate(newDDT);
      let h = newDDT.getHours();
      let m = newDDT.getMinutes();
      m = m <= 30 ? 30 : 0;
      if (m === 0) h += 1;

      const period = h >= 12 ? "PM" : "AM";
      const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const newTimeStr = `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`;

      setDraft(d => ({ ...d, deliveryDate: newDateStr, deliveryTime: newTimeStr }));
    }
  }, [pickupDateTime, draft.deliveryDate, draft.deliveryTime, draft.pickupDate, draft.pickupTime]);

  // Automated Service Type Selection based on urgency
  useEffect(() => {
    const { isUrgent } = calculatePrice(draft);
    if (isUrgent && draft.serviceType !== "Yallah Express") {
      setDraft(d => ({ ...d, serviceType: "Yallah Express" }));
    }
  }, [draft.pickupDate, draft.pickupTime, draft.deliveryDate, draft.deliveryTime, draft.serviceType]);

  const canGoToStep2 =
    draft.pickupLocation.trim().length > 0 &&
    draft.dropoffLocation.trim().length > 0 &&
    draft.pickupDate.trim().length > 0 &&
    draft.pickupTime.trim().length > 0 &&
    draft.deliveryDate.trim().length > 0 &&
    draft.deliveryTime.trim().length > 0

  const validateStep1 = () => {
    if (!draft.pickupLocation.trim()) return "Pickup location is required."
    if (!draft.dropoffLocation.trim()) return "Drop-off location is required."
    if (!draft.pickupDate.trim()) return "Pick-up date is required."
    if (!draft.pickupTime.trim()) return "Pick-up time is required."
    if (!draft.deliveryDate.trim()) return "Delivery date is required."
    if (!draft.deliveryTime.trim()) return "Delivery time is required."

    const pickupDT = getComparableDate(draft.pickupDate, draft.pickupTime)
    const dropoffDT = getComparableDate(draft.deliveryDate, draft.deliveryTime)

    // Delivery must be at least 30 mins after pickup
    const diffMins = (dropoffDT.getTime() - pickupDT.getTime()) / (1000 * 60)
    if (diffMins < 30) {
      return "Delivery time must be at least 30 minutes after pick-up."
    }

    return null
  }

  const validateStep2 = () => {
    if (!draft.firstName.trim()) return "First name is required."
    if (!draft.lastName.trim()) return "Last name is required."
    if (!draft.email.trim() || !isValidEmail(draft.email)) return "A valid email is required."
    if (!draft.phone.trim()) return "Phone number is required."
    if (draft.numberOfBags < 1) return "At least 1 bag is required."
    if (draft.children > 0) {
      if (draft.childrenAges.length !== draft.children || draft.childrenAges.some(age => !age)) {
        return "Please specify the age for all children."
      }
    }
    return null
  }

  const submitBooking = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      // Convert UI dates ("Mon, Mar 30") into standard database format (YYYY-MM-DD)
      const parseDate = (dStr: string) => {
        const dates = generateDates()
        const matched = dates.find(d => fmtDate(d) === dStr)
        if (!matched) return dStr
        // Extract local date
        const offset = matched.getTimezoneOffset()
        const local = new Date(matched.getTime() - offset * 60 * 1000)
        return local.toISOString().split("T")[0]
      }

      // Convert UI times ("02:30 PM") into standard time format (HH:mm:00)
      const parseTime = (tStr: string) => {
        const match = tStr.match(/(\d+):(\d+)\s(AM|PM)/)
        if (!match) return tStr
        let h = parseInt(match[1])
        const m = parseInt(match[2])
        const isPM = match[3] === "PM"
        if (isPM && h !== 12) h += 12
        if (!isPM && h === 12) h = 0
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:00`
      }

      const { total } = calculatePrice(draft)

      const payload = {
        ...draft,
        pickupDate: parseDate(draft.pickupDate),
        pickupTime: parseTime(draft.pickupTime),
        deliveryDate: parseDate(draft.deliveryDate),
        deliveryTime: parseTime(draft.deliveryTime),
        cabinBags: draft.cabinBags,
        largeBags: draft.largeBags,
        additionalItems: draft.additionalItems,
        notes: draft.notes,
        serviceType: draft.serviceType,
        totalPrice: total,
        adults: draft.adults,
        children: draft.children,
        childrenAges: draft.childrenAges,
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = (await res.json()) as { bookingId?: string; error?: string }
      if (!res.ok || !json.bookingId) throw new Error(json.error ?? "Failed to create booking.")
      setBookingId(json.bookingId)

      // Fetch Stripe client secret
      const piRes = await fetch("/api/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: json.bookingId }),
      })
      const piJson = await piRes.json()
      if (!piRes.ok || !piJson.clientSecret) {
        throw new Error("Failed to initialize payment gateway.")
      }
      setClientSecret(piJson.clientSecret)
      setStep(3)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReviewAndPayClick = async () => {
    const err = validateStep2()
    if (err) { setError(err); return }
    setError(null)
    setIsSubmitting(true)

    try {
      // Check if this email has already been verified via a previous booking
      const checkRes = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: draft.email })
      })
      const checkJson = await checkRes.json()

      if (checkJson.verified) {
        // Email already verified from a previous booking — skip OTP
        setIsSubmitting(false)
        await submitBooking()
        return
      }

      // New email — send OTP for verification
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: draft.email })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to send verification email.")

      setOtpError(null)
      setShowOtpModal(true)
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message)
      } else {
        setError("Unexpected error")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const verifyOtpAndSubmit = async () => {
    if (otpCode.length < 6) {
      setOtpError("Please enter the 6-digit code.")
      return
    }
    setOtpError(null)
    setIsVerifyingOtp(true)

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: draft.email, token: otpCode })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Invalid code. Please try again.")

      setTrackingOtp(otpCode)
      setShowOtpModal(false)
      await submitBooking()
    } catch (e: unknown) {
      if (e instanceof Error) {
        setOtpError(e.message)
      } else {
        setOtpError("Invalid code.")
      }
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const resendOtp = async () => {
    setOtpError(null)
    setIsResending(true)
    setResendSuccess(false)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: draft.email })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to resend.")

      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 5000)
    } catch (e: unknown) {
      if (e instanceof Error) {
        setOtpError(e.message)
      } else {
        setOtpError("Failed to resend.")
      }
    } finally {
      setIsResending(false)
    }
  }

  const handlePaymentSuccess = async () => {
    setIsConfirmingOrder(true)
    try {
      // Confirm the order in the backend now that payment has succeeded
      const res = await fetch(`/api/bookings/${bookingId}/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? "Failed to confirm order.")
      if (json.trackingCode) {
        setTrackingOtp(json.trackingCode)
      }
      setStep(4)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to confirm order after payment.")
    } finally {
      setIsConfirmingOrder(false)
    }
  }

  if (!hasMounted) return <div className="min-h-[400px] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#0A2E6D] animate-spin" /></div>

  return (
    <div className="w-full">
      {step < 4 && <StepDots step={step} />}

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
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
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2E6D] leading-tight mb-1">
                Where are you headed?
              </h2>
              <p className="text-[#8B7280] text-base">Enter your pickup and drop-off locations.</p>
            </div>

            {/* Location inputs with Nominatim autocomplete */}
            <div className="space-y-3">
              <LocationInput
                label="Pick up location"
                icon={MapPin}
                value={draft.pickupLocation}
                onChange={v => setDraft(d => ({ ...d, pickupLocation: v }))}
                onPin={(lat, lon, name) => {
                  onLocationPin?.(lat, lon, name)
                  setDraft(d => ({ ...d, pickupLat: parseFloat(lat), pickupLon: parseFloat(lon) }))
                }}
                placeholder="Hotel, building or address"
              />
              <LocationInput
                label="Drop off location"
                icon={Navigation2}
                value={draft.dropoffLocation}
                onChange={v => setDraft(d => ({ ...d, dropoffLocation: v }))}
                onPin={(lat, lon, name) => {
                  onLocationPin?.(lat, lon, name)
                  setDraft(d => ({ ...d, dropoffLat: parseFloat(lat), dropoffLon: parseFloat(lon) }))
                }}
                placeholder="Airport, hotel or address"
              />
            </div>

            {/* Pick-up schedule */}
            <div className="relative">
              <DateTimePicker
                label="Pick-up Date & Time"
                isOpen={activePicker === 'pickup'}
                setIsOpen={(v) => setActivePicker(v ? 'pickup' : null)}
                dateVal={draft.pickupDate} timeVal={draft.pickupTime}
                onDateChange={v => setDraft(d => ({ ...d, pickupDate: v }))}
                onTimeChange={v => setDraft(d => ({ ...d, pickupTime: v }))}
              />
            </div>

            {/* Delivery schedule */}
            <div className="relative">
              <DateTimePicker
                label="Delivery Date & Time"
                isOpen={activePicker === 'delivery'}
                setIsOpen={(v) => setActivePicker(v ? 'delivery' : null)}
                dateVal={draft.deliveryDate} timeVal={draft.deliveryTime}
                onDateChange={v => setDraft(d => ({ ...d, deliveryDate: v }))}
                onTimeChange={v => setDraft(d => ({ ...d, deliveryTime: v }))}
                minDateTime={pickupDateTime}
              />
            </div>

            <button
              onClick={() => { const err = validateStep1(); if (err) { setError(err); return } setError(null); setStep(2) }}
              disabled={!canGoToStep2}
              className="w-full h-14 rounded-xl flex items-center justify-center gap-3 text-base font-semibold tracking-tight transition-all bg-[#0A2E6D] text-white hover:bg-[#0D3A8A] active:scale-[0.98] duration-200 disabled:opacity-30 disabled:hover:scale-100"
            >
              Continue <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        )}

        {/* ── STEP 2: Guest Details ─── */}
        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2E6D] leading-tight mb-1">
                Guest details.
              </h2>
              <p className="text-[#8B7280] text-base">So we can contact you about your booking.</p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" icon={User}>
                  <input type="text" value={draft.firstName}
                    onChange={e => setDraft(d => ({ ...d, firstName: e.target.value }))}
                    placeholder="Jane"
                    autoComplete="given-name"
                    className="w-full px-5 pb-3.5 text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none placeholder-[#8B7280]/40 tracking-tight rounded-b-xl" />
                </Field>
                <Field label="Last name">
                  <input type="text" value={draft.lastName}
                    onChange={e => setDraft(d => ({ ...d, lastName: e.target.value }))}
                    placeholder="Doe"
                    autoComplete="family-name"
                    className="w-full px-5 pb-3.5 text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none placeholder-[#8B7280]/40 tracking-tight rounded-b-xl" />
                </Field>
              </div>

              <Field label="Email address" icon={Mail}>
                <input type="email" value={draft.email}
                  onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
                  placeholder="jane@example.com"
                  autoComplete="email"
                  className="w-full px-5 pb-3.5 text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none placeholder-[#8B7280]/40 tracking-tight rounded-b-xl" />
              </Field>

              <div className="relative group w-full">
                <div className="w-full bg-[#F7F5F0] border border-transparent rounded-xl focus-within:border-[#1E5BD7] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,91,215,0.08)] transition-all duration-200">
                  <label className="px-5 pt-3.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block mb-0.5 group-focus-within:text-[#1E5BD7] transition-colors">
                    Phone number
                  </label>
                  <div className="relative flex items-center pr-5">
                    <PhoneInput
                      international
                      defaultCountry="AE"
                      value={draft.phone}
                      onChange={(val) => setDraft(d => ({ ...d, phone: val || "" }))}
                      className="w-full px-5 pb-3.5 text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none"
                    />
                    <Phone className="absolute right-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8B7280]/40 pointer-events-none group-focus-within:text-[#1E5BD7] transition-colors duration-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Service Type */}
            <div className="bg-[#F6F2EA]/60 border border-[#E5E5E5] rounded-xl p-1.5 flex gap-1">
              {(["Standard", "Yallah Express"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setDraft(d => ({ ...d, serviceType: type }))}
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${draft.serviceType === type ? "bg-white shadow-sm text-[#0A2E6D] border border-[#E5E5E5]" : "text-[#8B7280] hover:text-[#0A2E6D] hover:bg-white/50 border border-transparent"}`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Travellers counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Adults */}
              <div className="bg-[#F6F2EA]/60 border border-[#E5E5E5] rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] mb-0.5">Adults</p>
                  <p className="text-[#8B7280] text-xs">12+ years</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDraft(d => ({ ...d, adults: Math.max(1, d.adults - 1) }))}
                    className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xl font-semibold text-[#0A2E6D] w-6 text-center tabular-nums">{draft.adults}</span>
                  <button
                    onClick={() => setDraft(d => ({ ...d, adults: d.adults + 1 }))}
                    className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="bg-[#F6F2EA]/60 border border-[#E5E5E5] rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] mb-0.5">Children</p>
                  <p className="text-[#8B7280] text-xs">0-11 years</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDraft(d => {
                      const newCount = Math.max(0, d.children - 1)
                      return { ...d, children: newCount, childrenAges: d.childrenAges.slice(0, newCount) }
                    })}
                    className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xl font-semibold text-[#0A2E6D] w-6 text-center tabular-nums">{draft.children}</span>
                  <button
                    onClick={() => setDraft(d => ({ ...d, children: d.children + 1, childrenAges: [...d.childrenAges, ""] }))}
                    className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Child Ages */}
            {draft.children > 0 && (
              <div className="space-y-2">
                <label className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block pl-1">Child Ages (For Seats)</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: draft.children }).map((_, i) => (
                    <div key={i} className="relative group w-full">
                      <div className="w-full bg-[#F7F5F0] border border-transparent rounded-xl focus-within:border-[#1E5BD7] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,91,215,0.08)] transition-all duration-200">
                        <select
                          value={draft.childrenAges[i] || ""}
                          onChange={(e) => setDraft(d => {
                            const newAges = [...d.childrenAges]
                            newAges[i] = e.target.value
                            return { ...d, childrenAges: newAges }
                          })}
                          className="w-full px-4 py-3 text-sm font-medium text-[#0A2E6D] bg-transparent focus:outline-none appearance-none"
                        >
                          <option value="" disabled>Child {i + 1} Age</option>
                          {["Under 1", "1 year", "2 years", "3 years", "4 years", "5 years", "6-11 years"].map(age => (
                            <option key={age} value={age}>{age}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bag counters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cabin Bags */}
              <div className="bg-[#F6F2EA]/60 border border-[#E5E5E5] rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] mb-0.5">Cabin Bags</p>
                  <p className="text-[#8B7280] text-xs">Small items</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDraft(d => ({ ...d, cabinBags: Math.max(0, d.cabinBags - 1), numberOfBags: Math.max(1, d.cabinBags - 1 + d.largeBags) }))}
                    className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xl font-semibold text-[#0A2E6D] w-6 text-center tabular-nums">{draft.cabinBags}</span>
                  <button
                    onClick={() => setDraft(d => ({ ...d, cabinBags: d.cabinBags + 1, numberOfBags: d.cabinBags + 1 + d.largeBags }))}
                    className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Large Bags */}
              <div className="bg-[#F6F2EA]/60 border border-[#E5E5E5] rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] mb-0.5">Large Bags</p>
                  <p className="text-[#8B7280] text-xs">Checked luggage</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDraft(d => ({ ...d, largeBags: Math.max(0, d.largeBags - 1), numberOfBags: Math.max(1, d.cabinBags + d.largeBags - 1) }))}
                    className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xl font-semibold text-[#0A2E6D] w-6 text-center tabular-nums">{draft.largeBags}</span>
                  <button
                    onClick={() => setDraft(d => ({ ...d, largeBags: d.largeBags + 1, numberOfBags: d.cabinBags + d.largeBags + 1 }))}
                    className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#0A2E6D] hover:bg-[#0A2E6D] hover:text-white transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Items */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block pl-1">Additional Items</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "Motorbike", label: "Motorbike Gear" },
                  { id: "Baby Seat", label: "Baby Seat" },
                  { id: "Stroller", label: "Stroller" },
                  { id: "Sports Equip", label: "Sports Equipment" }
                ].map(item => {
                  const isSelected = draft.additionalItems.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => setDraft(d => ({
                        ...d,
                        additionalItems: isSelected
                          ? d.additionalItems.filter(i => i !== item.id)
                          : [...d.additionalItems, item.id]
                      }))}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${isSelected ? "border-[#1E5BD7] bg-[#1E5BD7]/5" : "border-[#E5E5E5] bg-[#F7F5F0] hover:bg-[#F0EEE9]"}`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? "bg-[#1E5BD7] border-[#1E5BD7]" : "border-[#8B7280]/40 bg-white"}`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm font-medium ${isSelected ? "text-[#0A2E6D]" : "text-[#8B7280]"}`}>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Custom Notes */}
            <div className="relative group w-full">
              <div className="w-full bg-[#F7F5F0] border border-transparent rounded-xl focus-within:border-[#1E5BD7] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,91,215,0.08)] transition-all duration-200">
                <label className="px-5 pt-3.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block mb-0.5 group-focus-within:text-[#1E5BD7] transition-colors">
                  Custom Notes (Optional)
                </label>
                <textarea
                  value={draft.notes}
                  onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
                  placeholder="Any special instructions for pick-up/drop-off..."
                  className="w-full px-5 pb-3.5 pt-1 text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none placeholder-[#8B7280]/40 tracking-tight resize-none h-20"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setError(null); setStep(1) }}
                className="h-12 px-6 rounded-xl font-semibold text-[#8B7280] hover:text-[#0A2E6D] bg-[#F6F2EA] hover:bg-[#F6F2EA] border border-[#E5E5E5] transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleReviewAndPayClick}
                className="flex-1 h-14 rounded-xl flex items-center justify-center gap-3 text-base font-semibold tracking-tight transition-all bg-[#0A2E6D] text-white hover:bg-[#0D3A8A] active:scale-[0.98] duration-200 disabled:opacity-40"
              >
                {isSubmitting ? <span className="animate-pulse">Saving…</span> : <><span>Review & Pay</span><ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /></>}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Review ─── */}
        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2E6D] leading-tight mb-1">
                Review your order.
              </h2>
              <p className="text-[#8B7280] text-base">Everything look right? Then let&apos;s go.</p>
            </div>

            <div className="bg-[#F6F2EA]/40 border border-[#E5E5E5] rounded-xl overflow-hidden">
              {[
                { label: "Route", value: `${draft.pickupLocation} → ${draft.dropoffLocation}` },
                { label: "Pick-up", value: `${draft.pickupDate} at ${draft.pickupTime}` },
                { label: "Delivery", value: `${draft.deliveryDate} at ${draft.deliveryTime}` },
                { label: "Bags", value: `${draft.numberOfBags} (${draft.cabinBags} Cabin, ${draft.largeBags} Large)` },
                { label: "Guest", value: `${draft.firstName} ${draft.lastName}` },
                { label: "Contact", value: draft.email },
                { label: "Travellers", value: `${draft.adults} Adult${draft.adults !== 1 ? 's' : ''}${draft.children > 0 ? `, ${draft.children} Child${draft.children !== 1 ? 'ren' : ''} (Ages: ${draft.childrenAges.join(", ")})` : ''}` },
              ].map(({ label, value }, i, arr) => (
                <div key={label} className={`flex justify-between items-start gap-4 px-6 py-4 ${i < arr.length - 1 ? "border-b border-[#E5E5E5]" : ""}`}>
                  <span className="text-[11px] uppercase tracking-widest font-semibold text-[#8B7280] min-w-[80px] pt-0.5">{label}</span>
                  <span className="text-[#0A2E6D] text-sm font-medium text-right leading-snug">{value}</span>
                </div>
              ))}
              {draft.additionalItems.length > 0 && (
                <div className="flex justify-between items-start gap-4 px-6 py-4 border-t border-[#E5E5E5]">
                  <span className="text-[11px] uppercase tracking-widest font-semibold text-[#8B7280] min-w-[80px] pt-0.5">Extras</span>
                  <span className="text-[#0A2E6D] text-sm font-medium text-right leading-snug">{draft.additionalItems.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Price Quotation */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-[#0A2E6D] tracking-tight">Price Quotation</h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#8B7280]">Distance & Base Rate ({Math.round(calculatePrice(draft).distanceKm)} km)</span>
                  <span className="font-semibold text-[#0A2E6D]">AED {Math.round(40 + calculatePrice(draft).distanceKm * 2)}</span>
                </div>

                {draft.cabinBags > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8B7280]">Cabin Bags ({draft.cabinBags} × AED 15)</span>
                    <span className="font-semibold text-[#0A2E6D]">AED {draft.cabinBags * 15}</span>
                  </div>
                )}

                {draft.largeBags > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#8B7280]">Large Bags ({draft.largeBags} × AED 30)</span>
                    <span className="font-semibold text-[#0A2E6D]">AED {draft.largeBags * 30}</span>
                  </div>
                )}

                {draft.additionalItems.map(item => {
                  let price = 0;
                  if (item === "Motorbike") price = 50;
                  if (item === "Stroller") price = 20;
                  if (item === "Sports Equip") price = 40;
                  if (item === "Baby Seat") price = 25;
                  if (price > 0) {
                    return (
                      <div key={item} className="flex justify-between items-center text-sm">
                        <span className="text-[#8B7280]">{item} Surcharge</span>
                        <span className="font-semibold text-[#0A2E6D]">AED {price}</span>
                      </div>
                    )
                  }
                  return null;
                })}

                {calculatePrice(draft).isPeak && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-orange-500 font-medium">Peak Hour Surcharge (+25%)</span>
                    <span className="font-semibold text-orange-600">
                      AED {Math.round((calculatePrice(draft).basePrice / 1.25) * 0.25)}
                    </span>
                  </div>
                )}

                {calculatePrice(draft).expressSurcharge > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#1E5BD7] font-medium">
                      {calculatePrice(draft).isUrgent ? "Priority Dispatch (Express)" : "Yallah Express"}
                    </span>
                    <span className="font-semibold text-[#1E5BD7]">AED {calculatePrice(draft).expressSurcharge}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-[#E5E5E5] pt-4 flex justify-between items-center">
                <span className="font-bold text-[#0A2E6D]">Total Price</span>
                <span className="text-2xl font-bold text-[#0A2E6D]">AED {calculatePrice(draft).total}</span>
              </div>
            </div>

            {isConfirmingOrder ? (
              <div className="flex flex-col items-center justify-center h-32 gap-3">
                <Loader2 className="w-6 h-6 text-[#1E5BD7] animate-spin" />
                <p className="text-sm text-[#8B7280] font-medium animate-pulse">Confirming your order…</p>
              </div>
            ) : clientSecret ? (
              <div className="bg-white border border-[#E5E5E5] p-5 rounded-xl shadow-sm">
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
                  <StripePaymentForm onSuccess={handlePaymentSuccess} isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting} />
                </Elements>
                <div className="mt-4 pt-4 border-t border-dashed border-[#E5E5E5]">
                  <p className="text-xs text-[#8B7280] text-center mb-2">Development Testing</p>
                  <button
                    onClick={handlePaymentSuccess}
                    className="w-full h-10 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors text-sm font-semibold flex items-center justify-center"
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

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setError(null); setStep(2) }}
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl font-semibold text-[#8B7280] hover:text-[#0A2E6D] bg-[#F6F2EA] border border-[#E5E5E5] transition-all flex items-center justify-center gap-2 disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Guest Details
              </button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 4: Confirmation ─── */}
        {step === 4 && (
          <motion.div
            key="s4"
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center py-16 space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center"
            >
              <CheckCircle2 className="w-9 h-9 text-emerald-500" />
            </motion.div>

            <div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold tracking-tight text-[#0A2E6D] mb-3"
              >
                Payment successful!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-[#8B7280] text-base max-w-sm mx-auto leading-relaxed"
              >
                Your order has been confirmed. We&apos;ll reach out shortly with pickup details.
              </motion.p>
            </div>

            {/* Tracking details card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-xs bg-[#F6F2EA]/60 border border-[#E5E5E5] rounded-xl p-5 space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280]">Total Paid</span>
                <span className="text-[#0A2E6D] font-bold text-sm">AED {calculatePrice(draft).total}</span>
              </div>
              {trackingOtp && (
                <div className="flex justify-between items-center pt-2 border-t border-[#E5E5E5]">
                  <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280]">Tracking Code</span>
                  <span className="text-[#1E5BD7] font-bold tracking-[0.2em] font-mono text-lg">{trackingOtp}</span>
                </div>
              )}
              <p className="text-[10px] text-[#8B7280] text-center pt-1">Use your tracking code to check your order status later.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-700 text-xs font-semibold">Order Confirmed</span>
            </motion.div>

            <button
              onClick={() => { setStep(1); setDraft(defaultDraft); setBookingId(null); setError(null); setTrackingOtp(null) }}
              className="h-12 px-8 rounded-xl font-semibold text-[#8B7280] hover:text-[#0A2E6D] bg-[#F6F2EA] border border-[#E5E5E5] transition-all text-sm"
            >
              Book another transfer
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
                <div className="w-20 h-14 mx-auto mb-4 flex items-center justify-center">
                  <Image src="/Logo_primary.png" alt="Logo" width={120} height={40} className="w-auto h-12 object-contain" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-[#0A2E6D] mb-2">Verify your email</h3>
                <p className="text-[#8B7280] text-sm leading-relaxed">
                  We&apos;ve sent a 6-digit secure code to <br />
                  <span className="text-[#0A2E6D] font-medium">{draft.email}</span>
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
                  onChange={e => {
                    setOtpCode(e.target.value.replace(/\D/g, ''))
                    setOtpError(null)
                  }}
                  className="w-full text-center text-2xl tracking-[0.4em] font-mono bg-[#F6F2EA] border border-[#E5E5E5] rounded-xl py-4 focus:outline-none focus:border-[#1E5BD7] focus:bg-white text-[#0A2E6D] placeholder-[#8B7280]/20 transition-all"
                />
                <button
                  disabled={isVerifyingOtp || otpCode.length < 6}
                  onClick={verifyOtpAndSubmit}
                  className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-base font-semibold transition-all bg-[#0A2E6D] text-white hover:bg-[#0D3A8A] disabled:opacity-50 active:scale-[0.98] duration-200"
                >
                  {isVerifyingOtp ? "Verifying..." : "Confirm & Proceed"}
                </button>

                <div className="pt-2 text-center">
                  <button
                    onClick={resendOtp}
                    disabled={isResending || resendSuccess}
                    className="text-sm font-medium text-[#8B7280] hover:text-[#0A2E6D] transition-colors disabled:opacity-50"
                  >
                    {isResending ? "Sending..." : resendSuccess ? "Code sent!" : "Didn't receive a code? Resend"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
