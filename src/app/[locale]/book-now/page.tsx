"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookingWizard } from "@/components/ui/booking-wizard";
import { MapPin, Shield, Clock, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

type Coords = { lat: number; lng: number };

function WizardWithParams({
  onLocationPin,
  onRouteUpdate,
}: {
  onLocationPin: (lat: string, lon: string, name: string) => void;
  onRouteUpdate: (origin: string | null, dest: string | null) => void;
}) {
  const searchParams = useSearchParams();
  const pickupLocation = searchParams.get("pickup") || "";
  const dropoffLocation = searchParams.get("dropoff") || "";
  const pickupDate =
    searchParams.get("pickupDate") || searchParams.get("date") || "";
  const pickupTime =
    searchParams.get("pickupTime") || searchParams.get("time") || "";
  const deliveryDate = searchParams.get("deliveryDate") || "";
  const deliveryTime = searchParams.get("deliveryTime") || "";
  const initialDraft = {
    pickupLocation,
    dropoffLocation,
    pickupDate,
    pickupTime,
    deliveryDate,
    deliveryTime,
  };
  return (
    <BookingWizard
      onLocationPin={onLocationPin}
      onRouteUpdate={onRouteUpdate}
      initialDraft={initialDraft}
    />
  );
}

type PinnedLocation = { lat: string; lon: string; name: string };

export default function BookNowPage() {
  const t = useTranslations("BookNow");
  const [pinned, setPinned] = useState<PinnedLocation | null>(null);
  const [routeOrigin, setRouteOrigin] = useState<string | null>(null);
  const [routeDest, setRouteDest] = useState<string | null>(null);

  const trustPoints = [
    { icon: Shield, label: t("fullyInsured"), desc: t("allBagsCovered") },
    { icon: Clock, label: t("onTimeGuarantee"), desc: t("moneyBack") },
    { icon: Star, label: t("ratingLabel"), desc: t("ratingDesc") },
  ];

  // Build map URL: route overview if both coords available, single pin otherwise, default Dubai
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const mapSrc = useMemo(() => {
    if (routeOrigin && 
        routeDest && 
        apiKey && 
        !routeOrigin.includes('[object Object]') && 
        !routeDest.includes('[object Object]') &&
        routeOrigin !== 'null' &&
        routeDest !== 'null') {
      // Google Maps Embed API — directions mode: shows 2 markers + route polyline
      return `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodeURIComponent(routeOrigin)}&destination=${encodeURIComponent(routeDest)}&mode=driving`;
    }
    if (pinned && apiKey) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${pinned.lat},${pinned.lon}&zoom=15`;
    }
    if (apiKey) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Dubai,UAE&zoom=12`;
    }
    // Fallback if no API key
    return `https://maps.google.com/maps?q=25.2048,55.2708&t=&z=12&ie=UTF8&iwloc=&output=embed`;
  }, [routeOrigin, routeDest, pinned, apiKey]);

  const handleRouteUpdate = (origin: string | null, dest: string | null) => {
    setRouteOrigin(origin);
    setRouteDest(dest);
  };

  return (
    <main className="relative w-full min-h-screen flex flex-col overflow-x-hidden bg-white">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute top-0 left-0 right-0 z-[100] bg-white h-[80px] lg:h-[100px] flex items-center px-6 lg:px-10"
      >
        <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/Logo_primary.png"
              alt="Yallah Baggage"
              width={180}
              height={70}
              priority
              className="h-[70px] lg:h-[100px] w-auto"
            />
          </Link>
          <div className="flex items-center gap-2 text-[#8B7280] text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#1E5BD7] animate-pulse" />
            {t("secureCheckout")}
          </div>
        </div>
      </motion.header>

      {/* Two-Panel Layout */}
      <div className="flex flex-col lg:flex-row flex-1 pt-[80px] lg:pt-[100px] min-h-screen">
        {/* LEFT: Map Panel */}
        <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] relative flex-col justify-end overflow-hidden flex-shrink-0 bg-[#0A2E6D]">
          <iframe
            key={mapSrc}
            className={`absolute ${routeOrigin && routeDest ? "" : "pointer-events-none"}`}
            style={{
              border: 0,
              top: "-130px",
              left: "-10px",
              width: "calc(100% + 20px)",
              height: "calc(100% + 260px)",
              opacity: routeOrigin && routeDest ? 1 : 0.6,
              transition: "all 0.5s ease",
            }}
            loading="lazy"
            allowFullScreen
            title="Google Maps - Route Overview"
            src={mapSrc}
          />

          {/* Ultra-Clean Transparent Route Overview */}
          {routeOrigin && 
           routeDest && 
           !routeOrigin.includes('[object Object]') && 
           !routeDest.includes('[object Object]') && 
           routeOrigin !== 'null' && 
           routeDest !== 'null' && (
            <div className="absolute top-10 left-10 right-10 z-30 pointer-events-none">
              <div className="bg-transparent overflow-hidden relative">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-bold text-[11px] uppercase tracking-[0.25em] drop-shadow-lg">Route Overview</p>
                    <div className="flex items-center gap-2 bg-emerald-500/30 px-2.5 py-1 rounded-full backdrop-blur-sm border border-emerald-500/20 shadow-lg">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Optimized Route</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Pickup */}
                    <div className="flex items-start gap-5">
                      <div className="relative flex flex-col items-center pt-2">
                        <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)] z-10" />
                        <div className="w-[2px] h-10 bg-gradient-to-b from-white to-transparent mt-1" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1 drop-shadow-md">Pickup Origin</span>
                        <span className="text-white text-[15px] font-bold truncate max-w-[320px] xl:max-w-[450px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                          {decodeURIComponent(routeOrigin)}
                        </span>
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-start gap-5">
                      <div className="pt-2">
                        <MapPin className="w-4 h-4 text-[#1E5BD7] drop-shadow-[0_0_8px_rgba(30,91,215,0.8)]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1 drop-shadow-md">Drop-off Destination</span>
                        <span className="text-white text-[15px] font-bold truncate max-w-[320px] xl:max-w-[450px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                          {decodeURIComponent(routeDest)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gradient overlay — fades out when route is showing */}
          <div
            className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
            style={{
              background: routeOrigin && routeDest
                ? "linear-gradient(to top, rgba(10,46,109,0.85) 0%, transparent 40%)"
                : "linear-gradient(to top, #0A2E6D 0%, rgba(10,46,109,0.7) 50%, rgba(10,46,109,0.3) 100%)",
            }}
          />

          <div className="relative z-20 p-12 xl:p-16 flex flex-col gap-8">
            <AnimatePresence mode="wait">
              {routeOrigin && routeDest ? (
                <motion.div
                  key="route"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="inline-flex items-center gap-2 self-start bg-emerald-500/20 border border-emerald-400/30 px-4 py-2 rounded-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white text-sm font-semibold">
                    Route Calculated
                  </span>
                </motion.div>
              ) : pinned ? (
                <motion.div
                  key="pinned"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="inline-flex items-center gap-2 self-start bg-[#1E5BD7]/20 border border-[#1E5BD7]/30 px-4 py-2 rounded-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1E5BD7] animate-pulse" />
                  <span className="text-white text-sm font-semibold">
                    {pinned.name}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="inline-flex items-center gap-2 self-start bg-white/10 border border-white/10 px-4 py-2 rounded-lg"
                >
                  <MapPin className="w-3.5 h-3.5 text-white/60" />
                  <span className="text-white/60 text-sm font-semibold tracking-wide uppercase">
                    {t("dubaiUAE")}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hero text + trust info — hidden when route is showing */}
            {!(routeOrigin && routeDest) && (
              <>
                <div>
                  <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] text-white mb-4">
                    {t("heroTitle1")}
                    <br />
                    <span className="text-white/40">{t("heroTitle2")}</span>
                  </h1>
                  <p className="text-white/50 text-base font-medium max-w-xs leading-relaxed">
                    {t("heroDesc")}
                  </p>
                </div>

                <div className="space-y-3">
                  {trustPoints.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-center gap-3 group">
                      <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white/50" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm leading-none mb-0.5">
                          {label}
                        </p>
                        <p className="text-white/40 text-xs">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                  <div className="flex -space-x-2">
                    {[41, 42, 43, 44].map((i) => (
                      <Image
                        key={i}
                        src={`https://i.pravatar.cc/100?img=${i}`}
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full border-2 border-[#0A2E6D] object-cover"
                        alt=""
                      />
                    ))}
                  </div>
                  <p className="text-white/40 text-xs font-medium">
                    {t("trustedBy")}{" "}
                    <span className="text-white font-semibold">{t("travellersCount")}</span>{" "}
                    {t("travellers")}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Booking Form */}
        <div className="flex-1 px-6 sm:px-10 lg:px-14 xl:px-18 py-10 lg:py-12 bg-white lg:border-l border-[#E5E5E5] overflow-y-auto">
          <div className="w-full max-w-2xl mx-auto flex flex-col pt-8 lg:pt-0">
            <Suspense
              fallback={
                <div className="w-full h-[600px] rounded-xl bg-[#F6F2EA] animate-pulse" />
              }
            >
              <WizardWithParams
                onLocationPin={(lat, lon, name) =>
                  setPinned({ lat, lon, name })
                }
                onRouteUpdate={handleRouteUpdate}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
