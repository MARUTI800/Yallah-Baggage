"use client"

import React, { useState, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import {
  Mail, Phone, ArrowRight, Loader2, CircleCheck,
  MapPin, Navigation2, Calendar, Clock, Package, Truck,
  Search, Hash
} from "lucide-react"

type BookingData = {
  id: string
  status: string
  pickupLocation: string
  dropoffLocation: string
  pickupDate: string
  pickupTime: string
  deliveryDate: string
  deliveryTime: string
  numberOfBags: number
  firstName: string
  lastName: string
  trackingCode: string
  createdAt: string
  paidAt: string | null
}

const STATUS_STEPS = [
  { key: "confirmed", label: "Order Confirmed", icon: CircleCheck, description: "Payment received, order is confirmed" },
  { key: "pickup_scheduled", label: "Pickup Scheduled", icon: Calendar, description: "Our team is on the way to collect" },
  { key: "in_transit", label: "In Transit", icon: Truck, description: "Your luggage is en route to destination" },
  { key: "delivered", label: "Delivered", icon: CircleCheck, description: "Successfully delivered to destination" },
]

function getStatusIndex(status: string): number {
  const map: Record<string, number> = {
    pending_payment: -1,
    confirmed: 0,
    pickup_scheduled: 1,
    picked_up: 1,
    in_transit: 2,
    delivered: 3,
  }
  return map[status] ?? 0
}

function TrackingPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const prefillEmail = searchParams.get("email") || ""
  const urlCode = searchParams.get("code") || ""

  const [step, setStep] = useState<"form" | "tracking">("form")
  const [email, setEmail] = useState(prefillEmail)
  const [phone, setPhone] = useState("")
  const [trackingCode, setTrackingCode] = useState(urlCode)
  const [formError, setFormError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [booking, setBooking] = useState<BookingData | null>(null)

  // Listen for browser back/forward and URL changes
  React.useEffect(() => {
    const code = searchParams.get("code")
    if (!code && step === "tracking") {
      setStep("form")
      setBooking(null)
    }
    if (code && step === "form" && !booking) {
      // Auto-search if we have a code in URL but no booking loaded
      // This handles deep links and browser forward
      setTrackingCode(code)
    }
  }, [searchParams, step, booking])

  const handleSearch = async () => {
    if (!email.trim() || !phone.trim() || !trackingCode.trim()) {
      setFormError("Email, phone, and tracking code are all required.")
      return
    }
    setFormError(null)
    setIsLoading(true)

    try {
      const res = await fetch("/api/tracking/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email.trim(), 
          phone: phone.trim(),
          trackingCode: trackingCode.trim() 
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to find order.")

      setBooking(json.booking)
      setStep("tracking")
      // Update URL so browser back button works
      router.push(`/track?email=${encodeURIComponent(email)}&code=${encodeURIComponent(json.booking.trackingCode)}`)
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Unexpected error.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/Logo_primary.png" alt="Yallah Baggage" width={150} height={60} priority className="h-[60px] w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/book-now" className="hidden sm:flex items-center gap-2 bg-[#0A2E6D] text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-[#0D3A8A] transition-all duration-200 text-[15px] active:scale-[0.98]">
              Book Now
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-[72px]">
        <div className="max-w-lg mx-auto px-6 py-16">
          <AnimatePresence mode="wait">

            {/* ── STEP: Form ── */}
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#1E5BD7]/10 flex items-center justify-center">
                    <Search className="w-7 h-7 text-[#1E5BD7]" />
                  </div>
                </div>

                <div className="text-center">
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2E6D] mb-2">
                    Track Your Order
                  </h1>
                  <p className="text-[#8B7280] text-base">
                    Enter your booking details below to see live tracking.
                  </p>
                </div>

                <AnimatePresence>
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="px-5 py-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium"
                    >
                      {formError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  {/* Email field */}
                  <div className="relative group w-full">
                    <div className="w-full bg-[#F7F5F0] border border-transparent rounded-xl focus-within:border-[#1E5BD7] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,91,215,0.08)] transition-all duration-200">
                      <label className="px-5 pt-3.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block mb-0.5 group-focus-within:text-[#1E5BD7] transition-colors">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="jane@example.com"
                          autoComplete="email"
                          className="w-full px-5 pb-3.5 text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none placeholder-[#8B7280]/40 tracking-tight rounded-b-xl"
                        />
                        <Mail className="absolute right-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8B7280]/40 pointer-events-none group-focus-within:text-[#1E5BD7] transition-colors duration-200" />
                      </div>
                    </div>
                  </div>

                  {/* Phone field */}
                  <div className="relative group w-full">
                    <div className="w-full bg-[#F7F5F0] border border-transparent rounded-xl focus-within:border-[#1E5BD7] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,91,215,0.08)] transition-all duration-200">
                      <label className="px-5 pt-3.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block mb-0.5 group-focus-within:text-[#1E5BD7] transition-colors">
                        Phone Number
                      </label>
                      <div className="relative flex items-center">
                        <PhoneInput
                          international
                          defaultCountry="AE"
                          value={phone}
                          onChange={(val) => setPhone(val || "")}
                          className="w-full"
                        />
                        <Phone className="absolute right-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8B7280]/40 pointer-events-none group-focus-within:text-[#1E5BD7] transition-colors duration-200" />
                      </div>
                    </div>
                  </div>

                  {/* Tracking Code field */}
                  <div className="relative group w-full">
                    <div className="w-full bg-[#F7F5F0] border border-transparent rounded-xl focus-within:border-[#1E5BD7] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,91,215,0.08)] transition-all duration-200">
                      <label className="px-5 pt-3.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block mb-0.5 group-focus-within:text-[#1E5BD7] transition-colors">
                        Tracking Code
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={trackingCode}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
                            if (val.startsWith('YB') && val.length > 2) {
                              val = 'YB-' + val.substring(2)
                            } else if (!val.startsWith('YB') && val.length > 0) {
                              val = 'YB-' + val
                            }
                            setTrackingCode(val)
                          }}
                          placeholder="YB-001"
                          className="w-full px-5 pb-3.5 text-base font-medium text-[#0A2E6D] bg-transparent focus:outline-none placeholder-[#8B7280]/40 tracking-widest uppercase rounded-b-xl"
                        />
                        <Hash className="absolute right-5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8B7280]/40 pointer-events-none group-focus-within:text-[#1E5BD7] transition-colors duration-200" />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={isLoading || !email.trim() || !phone.trim() || !trackingCode.trim()}
                  className="w-full h-14 rounded-xl flex items-center justify-center gap-3 text-base font-semibold tracking-tight transition-all bg-[#0A2E6D] text-white hover:bg-[#0D3A8A] active:scale-[0.98] duration-200 disabled:opacity-40"
                >
                  {isLoading ? (
                    <span className="animate-pulse">Searching…</span>
                  ) : (
                    <>
                      <span>Find My Order</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link href="/" className="text-sm text-[#8B7280] hover:text-[#0A2E6D] transition-colors font-medium">
                    ← Back to Home
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ── STEP: Tracking View ── */}
            {step === "tracking" && booking && (
              <motion.div
                key="tracking"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Status header */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      booking.status === "delivered"
                        ? "bg-[#F6F2EA] border border-[#E5E5E5]"
                        : "bg-emerald-50 border border-emerald-200"
                    }`}
                  >
                    {booking.status === "delivered" ? (
                      <CircleCheck className="w-7 h-7 text-[#0A2E6D]" />
                    ) : (
                      <Package className="w-7 h-7 text-emerald-500" />
                    )}
                  </motion.div>
                  <h2 className="text-2xl font-bold tracking-tight text-[#0A2E6D] mb-1">
                    {booking.status === "delivered" ? "Delivered!" :
                     booking.status === "in_transit" ? "In Transit" :
                     "Order Confirmed"}
                  </h2>
                  <p className="text-sm text-[#8B7280]">
                    Tracking Code <span className="font-mono font-medium text-[#0A2E6D]">{booking.trackingCode}</span>
                  </p>
                </div>

                {/* Status Timeline */}
                <div className="bg-[#F6F2EA]/40 border border-[#E5E5E5] rounded-xl p-6">
                  <div className="space-y-0">
                    {STATUS_STEPS.map((s, i) => {
                      const currentIdx = getStatusIndex(booking.status)
                      const isComplete = i <= currentIdx
                      const isCurrent = i === currentIdx
                      const Icon = s.icon

                      return (
                        <div key={s.key} className="flex items-start gap-4">
                          {/* Dot + line */}
                          <div className="flex flex-col items-center">
                            <motion.div
                              initial={isCurrent ? { scale: 0 } : {}}
                              animate={isCurrent ? { scale: 1 } : {}}
                              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                isComplete
                                  ? isCurrent
                                    ? "bg-[#1E5BD7] shadow-lg shadow-[#1E5BD7]/25"
                                    : "bg-emerald-500"
                                  : "bg-[#E5E5E5]"
                              }`}
                            >
                              <Icon className={`w-4 h-4 ${isComplete ? "text-white" : "text-[#8B7280]"}`} />
                            </motion.div>
                            {i < STATUS_STEPS.length - 1 && (
                              <div className={`w-0.5 h-10 ${i < currentIdx ? "bg-emerald-400" : "bg-[#E5E5E5]"}`} />
                            )}
                          </div>
                          {/* Text */}
                          <div className="pt-1 pb-4">
                            <p className={`text-sm font-semibold ${isComplete ? "text-[#0A2E6D]" : "text-[#8B7280]"}`}>
                              {s.label}
                              {isCurrent && (
                                <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#1E5BD7] bg-[#1E5BD7]/10 px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E5BD7] animate-pulse" />
                                  CURRENT
                                </span>
                              )}
                            </p>
                            <p className={`text-xs mt-0.5 ${isComplete ? "text-[#8B7280]" : "text-[#8B7280]/50"}`}>
                              {s.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
                  {[
                    { icon: MapPin, label: "Pick-up", value: booking.pickupLocation },
                    { icon: Navigation2, label: "Drop-off", value: booking.dropoffLocation },
                    { icon: Calendar, label: "Pick-up Schedule", value: `${booking.pickupDate} at ${booking.pickupTime}` },
                    { icon: Clock, label: "Delivery Schedule", value: `${booking.deliveryDate} at ${booking.deliveryTime}` },
                    { icon: Package, label: "Bags", value: `${booking.numberOfBags} ${booking.numberOfBags === 1 ? "bag" : "bags"}` },
                  ].map(({ icon: ItemIcon, label, value }, i, arr) => (
                    <div key={label} className={`flex items-center gap-4 px-5 py-4 ${i < arr.length - 1 ? "border-b border-[#E5E5E5]" : ""}`}>
                      <div className="w-8 h-8 rounded-lg bg-[#F6F2EA] flex items-center justify-center flex-shrink-0">
                        <ItemIcon className="w-4 h-4 text-[#0A2E6D]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#8B7280] block">{label}</span>
                        <span className="text-sm font-medium text-[#0A2E6D] truncate block">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { 
                      setStep("form"); 
                      setEmail(""); 
                      setPhone(""); 
                      setTrackingCode(""); 
                      setBooking(null);
                      router.push("/track"); // Clear URL
                    }}
                    className="flex-1 h-12 rounded-xl font-semibold text-[#8B7280] hover:text-[#0A2E6D] bg-[#F6F2EA] border border-[#E5E5E5] transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    Track Another
                  </button>
                  <Link
                    href="/book-now"
                    className="flex-1 h-12 rounded-xl font-semibold bg-[#0A2E6D] text-white hover:bg-[#0D3A8A] transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                  >
                    New Booking
                  </Link>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#F6F2EA] py-8 text-center">
        <p className="text-xs text-[#8B7280]">© 2026 Yallah Baggage. Dubai&apos;s Premier Luggage Concierge.</p>
      </footer>
    </div>
  )
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-[#0A2E6D] animate-spin" />
      </div>
    }>
      <TrackingPageContent />
    </Suspense>
  )
}
