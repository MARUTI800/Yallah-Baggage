"use client"

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight, ArrowLeft, MapPin, Navigation2, Calendar, Clock,
  User, Mail, Phone, CheckCircle2, Minus, Plus, Loader2, Check, X
} from "lucide-react"

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
  numberOfBags: number
}

interface NominatimResult {
  place_id: number
  lat: string
  lon: string
  display_name: string
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
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
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
  const [results, setResults] = useState<NominatimResult[]>([])
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [focused, setFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Search nominatim
  useEffect(() => {
    if (confirmed || query.length < 3) { setResults([]); return }
    const tid = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6`
        )
        setResults(await res.json())
      } catch { setResults([]) }
      finally { setLoading(false) }
    }, 350)
    return () => clearTimeout(tid)
  }, [query, confirmed])

  // Sync external value resets
  useEffect(() => {
    if (!value) { setQuery(""); setConfirmed(false) }
  }, [value])

  const select = useCallback((loc: NominatimResult) => {
    const name = loc.display_name.split(", ")[0]
    setQuery(name)
    onChange(name)
    setConfirmed(true)
    setResults([])
    onPin?.(loc.lat, loc.lon, name)
  }, [onChange, onPin])

  const showDropdown = focused && !confirmed && results.length > 0

  return (
    <div ref={containerRef} className="relative group w-full">
      <div className={`w-full bg-[#0d0d0d] border rounded-2xl px-5 pt-3 pb-3 transition-all duration-300 ${
        focused ? "border-white/20 bg-[#141414]" : "border-white/8 hover:border-white/15"
      }`}>
        <label className={`text-[10px] font-bold tracking-[0.18em] uppercase block mb-1 transition-colors ${
          focused ? "text-orange-400" : "text-white/35"
        }`}>
          {label}
        </label>
        <div className="flex items-center gap-2 pr-6">
          <input
            type="text"
            value={query}
            placeholder={placeholder}
            className="w-full text-xl font-medium text-white bg-transparent focus:outline-none placeholder-white/20 tracking-tight"
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onChange={e => {
              setQuery(e.target.value)
              onChange(e.target.value)
              setConfirmed(false)
            }}
          />
        </div>
      </div>

      {/* Status icon */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        {loading
          ? <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
          : confirmed
          ? <Check className="w-4 h-4 text-green-400 drop-shadow-[0_0_6px_rgba(74,222,128,0.6)]" />
          : <Icon className="w-4 h-4 text-white/20" />
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
            className="absolute top-full mt-2 left-0 right-0 bg-[#111]/96 backdrop-blur-2xl border border-white/10 rounded-2xl py-2 z-[100] shadow-[0_24px_60px_rgba(0,0,0,0.95)] overflow-hidden"
          >
            {results.map(loc => {
              const name = loc.display_name.split(", ")[0]
              const sub = loc.display_name.split(", ").slice(1, 3).join(", ")
              return (
                <div
                  key={loc.place_id}
                  onMouseDown={() => select(loc)}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 cursor-pointer group/item transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center flex-shrink-0 group-hover/item:bg-orange-500/10 group-hover/item:border-orange-500/20 transition-all">
                    <MapPin className="w-3.5 h-3.5 text-white/30 group-hover/item:text-orange-400 transition-colors" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-white text-sm font-semibold truncate tracking-tight">{name}</span>
                    {sub && <span className="text-white/35 text-xs truncate">{sub}</span>}
                  </div>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Styled Field wrapper (for non-location fields) ────────────────
const Field = ({
  label, icon: Icon, children, className = ""
}: { label: string; icon?: any; children: React.ReactNode; className?: string }) => (
  <div className={`relative group w-full ${className}`}>
    <div className="w-full bg-[#0a0a0a] border border-white/5 rounded-[1.25rem] px-5 pt-3.5 pb-3.5 focus-within:border-orange-500/40 focus-within:bg-[#0f0f0f] shadow-inner transition-all duration-300">
      <label className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/40 block mb-1.5 group-focus-within:text-orange-400/80 transition-colors">
        {label}
      </label>
      {children}
    </div>
    {Icon && <Icon className="absolute right-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/20 pointer-events-none group-focus-within:text-orange-400/60 transition-colors duration-300" />}
  </div>
)

// ── Step dots ─────────────────────────────────────────────────────
const StepDots = ({ step }: { step: Step }) => (
  <div className="flex items-center gap-2 mb-10">
    {[1, 2, 3].map(s => (
      <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${
        s < step ? "w-8 bg-orange-500" : s === step ? "w-8 bg-white" : "w-4 bg-white/15"
      }`} />
    ))}
    <span className="ml-2 text-white/30 text-xs font-medium tracking-widest uppercase">
      Step {Math.min(step, 3)} / 3
    </span>
  </div>
)

// ── Date / Time Picker ────────────────────────────────────────────
const generateDates = () => {
  const dates: Date[] = []
  const now = new Date()
  for (let i = 0; i < 14; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    dates.push(d)
  }
  return dates
}

const availableTimes = Array.from({ length: 29 }, (_, i) => {
  const totalMins = 8 * 60 + i * 30
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  const period = h >= 12 ? "PM" : "AM"
  return `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${m.toString().padStart(2, "0")} ${period}`
})

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })

function DateTimePicker({
  dateLabel, timeLabel, dateVal, timeVal, onDateChange, onTimeChange,
}: {
  dateLabel: string; timeLabel: string
  dateVal: string; timeVal: string
  onDateChange: (v: string) => void
  onTimeChange: (v: string) => void
}) {
  const [showDate, setShowDate] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const dates = useMemo(() => generateDates(), [])

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Date */}
      <div className="relative">
        <div
          onClick={() => { setShowDate(!showDate); setShowTime(false) }}
          className={`bg-[#0d0d0d] border rounded-2xl px-5 py-3 cursor-pointer transition-all duration-300 ${
            showDate ? "border-white/20 bg-[#141414]" : "border-white/8 hover:border-white/15"
          }`}
        >
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/35 block mb-1">{dateLabel}</span>
          <div className="flex items-center justify-between">
            <span className={`text-base font-semibold tracking-tight ${dateVal ? "text-white" : "text-white/25"}`}>
              {dateVal || "Pick date"}
            </span>
            <Calendar className="w-4 h-4 text-white/20 flex-shrink-0" />
          </div>
        </div>
        <AnimatePresence>
          {showDate && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full mt-2 left-0 w-[220px] bg-[#111]/96 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 z-50 shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[240px] overflow-y-auto"
            >
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2 px-1">Select Date</p>
              {dates.map((d, i) => {
                const str = fmtDate(d)
                return (
                  <div
                    key={i}
                    onClick={() => { onDateChange(str); setShowDate(false) }}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                      dateVal === str ? "bg-white text-black" : "text-white/70 hover:bg-white/8"
                    }`}
                  >
                    {str}
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Time */}
      <div className="relative">
        <div
          onClick={() => { setShowTime(!showTime); setShowDate(false) }}
          className={`bg-[#0d0d0d] border rounded-2xl px-5 py-3 cursor-pointer transition-all duration-300 ${
            showTime ? "border-white/20 bg-[#141414]" : "border-white/8 hover:border-white/15"
          }`}
        >
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/35 block mb-1">{timeLabel}</span>
          <div className="flex items-center justify-between">
            <span className={`text-base font-semibold tracking-tight ${timeVal ? "text-white" : "text-white/25"}`}>
              {timeVal || "Pick time"}
            </span>
            <Clock className="w-4 h-4 text-white/20 flex-shrink-0" />
          </div>
        </div>
        <AnimatePresence>
          {showTime && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full mt-2 right-0 w-[180px] bg-[#111]/96 backdrop-blur-2xl border border-white/10 rounded-2xl p-3 z-50 shadow-[0_20px_60px_rgba(0,0,0,0.9)] max-h-[240px] overflow-y-auto"
            >
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2 px-1">Select Time</p>
              {availableTimes.map((t, i) => (
                <div
                  key={i}
                  onClick={() => { onTimeChange(t); setShowTime(false) }}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all text-center ${
                    timeVal === t ? "bg-white text-black" : "text-white/70 hover:bg-white/8"
                  }`}
                >
                  {t}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
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
    return null
  }

  const validateStep2 = () => {
    if (!draft.firstName.trim()) return "First name is required."
    if (!draft.lastName.trim()) return "Last name is required."
    if (!draft.email.trim() || !isValidEmail(draft.email)) return "A valid email is required."
    if (!draft.phone.trim()) return "Phone number is required."
    if (draft.numberOfBags < 1) return "At least 1 bag is required."
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

      const payload = {
        ...draft,
        pickupDate: parseDate(draft.pickupDate),
        pickupTime: parseTime(draft.pickupTime),
        deliveryDate: parseDate(draft.deliveryDate),
        deliveryTime: parseTime(draft.deliveryTime),
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = (await res.json()) as { bookingId?: string; error?: string }
      if (!res.ok || !json.bookingId) throw new Error(json.error ?? "Failed to create booking.")
      setBookingId(json.bookingId)
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
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: draft.email })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to send verification email.")
      
      setOtpError(null)
      setShowOtpModal(true)
    } catch (e: any) {
      setError(e.message || "Unexpected error")
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
      
      setShowOtpModal(false)
      await submitBooking()
    } catch (e: any) {
      setOtpError(e.message || "Invalid code.")
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
    } catch (e: any) {
      setOtpError(e.message || "Failed to resend.")
    } finally {
      setIsResending(false)
    }
  }

  const confirmPayment = async () => {
    if (!bookingId) return
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/confirm-payment`, { method: "POST" })
      const json = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Payment confirmation failed.")
      setStep(4)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full selection:bg-orange-500 selection:text-white">
      {step < 4 && <StepDots step={step} />}

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mb-6 px-5 py-4 rounded-2xl border border-red-500/20 bg-red-500/8 text-red-300 text-sm font-medium"
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
            className="space-y-7"
          >
            <div>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-white leading-tight mb-1">
                Where are you headed?
              </h2>
              <p className="text-white/35 text-base font-light">Enter your pickup and drop-off locations.</p>
            </div>

            {/* Location inputs with Nominatim autocomplete */}
            <div className="space-y-3">
              <LocationInput
                label="Pick up location"
                icon={MapPin}
                value={draft.pickupLocation}
                onChange={v => setDraft(d => ({ ...d, pickupLocation: v }))}
                onPin={onLocationPin}
                placeholder="Hotel, building or address"
              />
              <LocationInput
                label="Drop off location"
                icon={Navigation2}
                value={draft.dropoffLocation}
                onChange={v => setDraft(d => ({ ...d, dropoffLocation: v }))}
                onPin={onLocationPin}
                placeholder="Airport, hotel or address"
              />
            </div>

            {/* Pick-up schedule */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-white/30">Pick-up schedule</p>
              <DateTimePicker
                dateLabel="Pick-up date" timeLabel="Pick-up time"
                dateVal={draft.pickupDate} timeVal={draft.pickupTime}
                onDateChange={v => setDraft(d => ({ ...d, pickupDate: v }))}
                onTimeChange={v => setDraft(d => ({ ...d, pickupTime: v }))}
              />
            </div>

            {/* Delivery schedule */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-white/30">Delivery schedule</p>
              <DateTimePicker
                dateLabel="Delivery date" timeLabel="Delivery time"
                dateVal={draft.deliveryDate} timeVal={draft.deliveryTime}
                onDateChange={v => setDraft(d => ({ ...d, deliveryDate: v }))}
                onTimeChange={v => setDraft(d => ({ ...d, deliveryTime: v }))}
              />
            </div>

            <button
              onClick={() => { const err = validateStep1(); if (err) { setError(err); return } setError(null); setStep(2) }}
              disabled={!canGoToStep2}
              className="w-full h-16 rounded-[1.25rem] flex items-center justify-center gap-3 text-lg font-bold tracking-tight transition-all bg-white text-black hover:bg-zinc-100 shadow-[0_12px_40px_rgba(255,255,255,0.15)] active:scale-[0.98] duration-300 disabled:opacity-30 disabled:hover:scale-100"
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
            className="space-y-7"
          >
            <div>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-white leading-tight mb-1">
                Guest details.
              </h2>
              <p className="text-white/35 text-base font-light">So we can contact you about your booking.</p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" icon={User}>
                  <input type="text" value={draft.firstName}
                    onChange={e => setDraft(d => ({ ...d, firstName: e.target.value }))}
                    placeholder="Jane"
                    className="w-full text-xl font-medium text-white bg-transparent focus:outline-none placeholder-white/20 tracking-tight" />
                </Field>
                <Field label="Last name">
                  <input type="text" value={draft.lastName}
                    onChange={e => setDraft(d => ({ ...d, lastName: e.target.value }))}
                    placeholder="Doe"
                    className="w-full text-xl font-medium text-white bg-transparent focus:outline-none placeholder-white/20 tracking-tight" />
                </Field>
              </div>

              <Field label="Email address" icon={Mail}>
                <input type="email" value={draft.email}
                  onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
                  placeholder="jane@example.com"
                  className="w-full text-xl font-medium text-white bg-transparent focus:outline-none placeholder-white/20 tracking-tight" />
              </Field>

              <Field label="Phone number" icon={Phone}>
                <input type="tel" value={draft.phone}
                  onChange={e => setDraft(d => ({ ...d, phone: e.target.value }))}
                  placeholder="+971 50 123 4567"
                  className="w-full text-xl font-medium text-white bg-transparent focus:outline-none placeholder-white/20 tracking-tight" />
              </Field>
            </div>

            {/* Bag counter */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[1.25rem] px-6 py-5 flex items-center justify-between shadow-inner">
              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] uppercase text-white/40 mb-1">Number of Bags</p>
                <p className="text-white/40 text-sm font-light">Each bag is individually tracked</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDraft(d => ({ ...d, numberOfBags: Math.max(1, d.numberOfBags - 1) }))}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all duration-200"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-3xl font-semibold text-white w-8 text-center tabular-nums">{draft.numberOfBags}</span>
                <button
                  onClick={() => setDraft(d => ({ ...d, numberOfBags: d.numberOfBags + 1 }))}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black hover:border-white transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setError(null); setStep(1) }}
                className="h-14 px-6 rounded-2xl font-semibold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 transition-all flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleReviewAndPayClick}
                className="flex-1 h-16 rounded-[1.25rem] flex items-center justify-center gap-3 text-lg font-bold tracking-tight transition-all bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-black shadow-[0_15px_45px_-10px_rgba(249,115,22,0.6)] hover:shadow-[0_20px_60px_-10px_rgba(249,115,22,0.8)] active:scale-[0.98] duration-500 disabled:opacity-40"
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
            className="space-y-7"
          >
            <div>
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tighter text-white leading-tight mb-1">
                Review your order.
              </h2>
              <p className="text-white/35 text-base font-light">Everything look right? Then let's go.</p>
            </div>

            <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl overflow-hidden">
              {[
                { label: "Route", value: `${draft.pickupLocation} → ${draft.dropoffLocation}` },
                { label: "Pick-up", value: `${draft.pickupDate} at ${draft.pickupTime}` },
                { label: "Delivery", value: `${draft.deliveryDate} at ${draft.deliveryTime}` },
                { label: "Bags", value: String(draft.numberOfBags) },
                { label: "Guest", value: `${draft.firstName} ${draft.lastName}` },
                { label: "Contact", value: draft.email },
              ].map(({ label, value }, i, arr) => (
                <div key={label} className={`flex justify-between items-start gap-4 px-6 py-4 ${i < arr.length - 1 ? "border-b border-white/5" : ""}`}>
                  <span className="text-[11px] uppercase tracking-widest font-bold text-white/30 min-w-[80px] pt-0.5">{label}</span>
                  <span className="text-white text-sm font-medium text-right leading-snug">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 bg-orange-500/6 border border-orange-500/15 rounded-2xl px-5 py-4">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
              <p className="text-orange-300/70 text-sm font-light leading-relaxed">
                <strong className="text-orange-400 font-semibold">Demo payment flow.</strong> Stripe integration replaces this with real 3D Secure processing.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setError(null); setStep(2) }}
                disabled={isSubmitting}
                className="h-14 px-6 rounded-2xl font-semibold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 transition-all flex items-center gap-2 disabled:opacity-30"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={isSubmitting || !bookingId}
                onClick={confirmPayment}
                className="flex-1 h-16 rounded-[1.25rem] flex items-center justify-center gap-3 text-[1.1rem] font-bold tracking-tight transition-all bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-black shadow-[0_20px_50px_-12px_rgba(249,115,22,0.7)] hover:shadow-[0_25px_70px_-12px_rgba(249,115,22,0.9)] active:scale-[0.98] duration-500 disabled:opacity-40"
              >
                {isSubmitting ? <span className="animate-pulse">Processing…</span> : "Confirm & Pay"}
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
              className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-[0_0_60px_rgba(74,222,128,0.15)]"
            >
              <CheckCircle2 className="w-9 h-9 text-green-400" />
            </motion.div>

            <div>
              <h2 className="text-5xl font-semibold tracking-tighter text-white mb-3">Booking confirmed.</h2>
              <p className="text-white/40 text-lg font-light max-w-sm mx-auto leading-relaxed">
                We'll reach out shortly. Your booking ID is{" "}
                <span className="text-white font-semibold tracking-wide font-mono">{bookingId ?? "—"}</span>.
              </p>
            </div>

            <button
              onClick={() => { setStep(1); setDraft(defaultDraft); setBookingId(null); setError(null) }}
              className="h-12 px-8 rounded-2xl font-semibold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/8 transition-all text-sm"
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
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#111111] border border-white/10 rounded-[2rem] p-8 max-w-sm w-full shadow-[0_30px_80px_rgba(0,0,0,0.8)] relative"
            >
              <button 
                onClick={() => setShowOtpModal(false)} 
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="mb-6 mt-2 text-center">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                  <span className="text-orange-400">✉️</span>
                </div>
                <h3 className="text-2xl font-semibold tracking-tighter text-white mb-2">Verify your email</h3>
                <p className="text-white/40 text-[13.5px] leading-relaxed">
                  We've sent a 6-digit secure code to <br/>
                  <span className="text-white/90 font-medium">{draft.email}</span>
                </p>
              </div>
              
              <div className="space-y-4">
                <AnimatePresence>
                  {otpError && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: -5 }} 
                      className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium"
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
                  className="w-full text-center text-3xl tracking-[0.4em] font-mono bg-[#050505] border border-white/10 rounded-2xl py-4 focus:outline-none focus:border-orange-500/50 focus:bg-[#0a0a0a] text-white placeholder-white/5 transition-all shadow-inner"
                />
                <button
                  disabled={isVerifyingOtp || otpCode.length < 6}
                  onClick={verifyOtpAndSubmit}
                  className="w-full h-14 rounded-[1.1rem] flex items-center justify-center gap-2 text-base font-semibold tracking-tight transition-all bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:hover:bg-white shadow-[0_10px_30px_rgba(255,255,255,0.15)] active:scale-95 duration-200"
                >
                  {isVerifyingOtp ? "Verifying..." : "Confirm & Proceed"}
                </button>
                
                <div className="pt-2 text-center">
                  <button 
                    onClick={resendOtp} 
                    disabled={isResending || resendSuccess}
                    className="text-sm font-medium text-white/40 hover:text-white transition-colors disabled:opacity-50"
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
