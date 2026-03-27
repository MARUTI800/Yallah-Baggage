"use client"

import Link from "next/link"
import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { BookingWizard } from "@/components/ui/booking-wizard"
import { MapPin, Shield, Clock, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const trustPoints = [
  { icon: Shield, label: "Fully Insured", desc: "All bags covered" },
  { icon: Clock, label: "On-Time Guarantee", desc: "Or your money back" },
  { icon: Star, label: "4.9 Rating", desc: "From 3,200+ guests" },
]

function WizardWithParams({ onLocationPin }: { onLocationPin: (lat: string, lon: string, name: string) => void }) {
  const searchParams = useSearchParams()
  const pickupLocation = searchParams.get("pickup") || ""
  const dropoffLocation = searchParams.get("dropoff") || ""
  const pickupDate = searchParams.get("date") || ""
  const pickupTime = searchParams.get("time") || ""

  const initialDraft = {
    pickupLocation,
    dropoffLocation,
    pickupDate,
    pickupTime
  }

  return <BookingWizard onLocationPin={onLocationPin} initialDraft={initialDraft} />
}

type PinnedLocation = { lat: string; lon: string; name: string }

export default function BookNowPage() {
  const [pinned, setPinned] = useState<PinnedLocation | null>(null)

  // Dubai default coords
  const mapSrc = pinned
    ? `https://maps.google.com/maps?q=${pinned.lat},${pinned.lon}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=25.2048,55.2708&t=&z=12&ie=UTF8&iwloc=&output=embed`

  return (
    <main className="relative w-full min-h-screen flex flex-col overflow-x-hidden bg-[#000000] text-white font-sans">

      {/* ── Header — Apple iOS Liquid Pill ── */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[100] h-16 sm:h-20 flex items-center justify-between px-6 sm:px-10 bg-[#161616]/40 backdrop-blur-3xl backdrop-saturate-[1.8] border border-white/10 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] transition-all duration-300">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/Logo.png" alt="Yallah Baggage" className="h-8 w-auto object-contain brightness-200 group-hover:opacity-80 transition-opacity" />
          <span className="text-lg font-semibold tracking-tighter text-white">
            Yallah <span className="text-white/40 font-light">Baggage</span>
          </span>
        </Link>
        <div className="flex items-center gap-2.5 text-white/50 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
          Secure Checkout
        </div>
      </header>

      {/* ── Two-Panel Layout ── */}
      <div className="flex flex-col lg:flex-row flex-1 pt-20 min-h-screen">

        {/* ── LEFT PANEL: Live Map ── */}
        <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] relative flex-col justify-end overflow-hidden flex-shrink-0">

          {/* Map iframe — key swap smoothly reloads on location change */}
          <iframe
            key={pinned ? `${pinned.lat},${pinned.lon}` : "dubai-default"}
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={mapSrc}
          />

          {/* Dark overlay so text is readable on top of map */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/60 pointer-events-none z-10" />

          {/* Left panel content — overlaid on map */}
          <div className="relative z-20 p-12 xl:p-16 flex flex-col gap-8">

            {/* Location status badge */}
            <AnimatePresence mode="wait">
              {pinned ? (
                <motion.div
                  key="pinned"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 self-start bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-300 text-sm font-semibold tracking-tight">{pinned.name}</span>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 self-start bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-white/50 text-sm font-medium tracking-widest uppercase">Dubai, UAE</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Headline */}
            <div>
              <h1 className="text-5xl xl:text-6xl font-semibold tracking-tighter leading-[0.95] text-white mb-4">
                Your bags.<br />
                <span className="text-white/30">Our mission.</span>
              </h1>
              <p className="text-white/50 text-lg font-light max-w-xs leading-relaxed">
                Hands-free luxury travel across Dubai and the UAE. Your belongings arrive before you do.
              </p>
            </div>

            {/* Trust badges */}
            <div className="space-y-3">
              {trustPoints.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-xl bg-black/40 border border-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:border-orange-500/30 transition-all duration-300">
                    <Icon className="w-4 h-4 text-white/40 group-hover:text-orange-400 transition-colors" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm tracking-tight leading-none mb-0.5">{label}</p>
                    <p className="text-white/40 text-xs">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 pt-2 border-t border-white/10">
              <div className="flex -space-x-2">
                {[41, 42, 43, 44].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i}`} className="w-7 h-7 rounded-full border border-black object-cover" alt="" />
                ))}
              </div>
              <p className="text-white/40 text-xs font-medium">
                Trusted by <span className="text-white font-bold">45,000+</span> travellers
              </p>
            </div>

          </div>
        </div>

        {/* ── RIGHT PANEL: Booking Form ── */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-12 xl:px-16 py-10 lg:py-12 bg-[#000000] lg:border-l border-white/5 overflow-y-auto">
          <div className="w-full max-w-2xl mx-auto">
            <Suspense fallback={<div className="w-full h-[600px] rounded-2xl bg-white/5 animate-pulse" />}>
              <WizardWithParams onLocationPin={(lat, lon, name) => setPinned({ lat, lon, name })} />
            </Suspense>
          </div>
        </div>

      </div>
    </main>
  )
}
