"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookingWizard } from "@/components/ui/booking-wizard";
import { MapPin, Shield, Clock, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";


function WizardWithParams({
  onLocationPin,
  onRouteUpdate,
}: {
  onLocationPin: (lat: string, lon: string, name: string) => void;
  onRouteUpdate: (
    origin: string | null,
    dest: string | null,
    coords?: {
      origin?: { lat: number; lng: number };
      dest?: { lat: number; lng: number };
    } | null,
  ) => void;
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
  const [routeCoords, setRouteCoords] = useState<{
    origin?: { lat: number; lng: number };
    dest?: { lat: number; lng: number };
  } | null>(null);

  const trustPoints = [
    { icon: Shield, label: t("fullyInsured"), desc: t("allBagsCovered") },
    { icon: Clock, label: t("onTimeGuarantee"), desc: t("moneyBack") },
    { icon: Star, label: t("ratingLabel"), desc: t("ratingDesc") },
  ];

  // Build map URL: route overview if both coords available, single pin otherwise, default Dubai
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const hasValidRouteLabels =
    !!routeOrigin &&
    !!routeDest &&
    !routeOrigin.includes("[object Object]") &&
    !routeDest.includes("[object Object]") &&
    routeOrigin !== "null" &&
    routeDest !== "null";

  const hasRouteCoords =
    !!routeCoords?.origin?.lat &&
    !!routeCoords?.origin?.lng &&
    !!routeCoords?.dest?.lat &&
    !!routeCoords?.dest?.lng;

  const mapSrc = useMemo(() => {
    // Prefer lat/lng — address strings often break embed directions (world zoom)
    if (hasRouteCoords && apiKey) {
      const o = `${routeCoords!.origin!.lat},${routeCoords!.origin!.lng}`;
      const d = `${routeCoords!.dest!.lat},${routeCoords!.dest!.lng}`;
      return `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}&mode=driving`;
    }
    if (pinned && apiKey) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${pinned.lat},${pinned.lon}&zoom=14`;
    }
    if (apiKey) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Dubai,UAE&zoom=11`;
    }
    return `https://maps.google.com/maps?q=25.2048,55.2708&t=&z=11&ie=UTF8&iwloc=&output=embed`;
  }, [hasRouteCoords, routeCoords, pinned, apiKey]);

  const handleRouteUpdate = (
    origin: string | null,
    dest: string | null,
    coords?: {
      origin?: { lat: number; lng: number };
      dest?: { lat: number; lng: number };
    } | null,
  ) => {
    setRouteOrigin(origin);
    setRouteDest(dest);
    setRouteCoords(coords ?? null);
  };

  const showRouteOnMap = hasValidRouteLabels && hasRouteCoords;

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
            className={`absolute ${showRouteOnMap ? "" : "pointer-events-none"}`}
            style={{
              border: 0,
              top: showRouteOnMap ? "-80px" : "-130px",
              left: "-10px",
              width: "calc(100% + 20px)",
              height: showRouteOnMap ? "calc(100% + 160px)" : "calc(100% + 260px)",
              opacity: showRouteOnMap ? 1 : pinned ? 0.85 : 0.6,
              transition: "all 0.5s ease",
            }}
            loading="lazy"
            allowFullScreen
            title="Google Maps - Route Overview"
            src={mapSrc}
          />

          {/* Ultra-Clean Transparent Route Overview */}
          {hasValidRouteLabels && (
              <div className="absolute top-6 left-6 z-30 pointer-events-none max-w-[320px]">
                <div className="bg-[#0A2E6D]/90 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-xl relative overflow-hidden">
                  <div className="flex flex-col gap-3 relative z-10">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-400 text-[9px] font-bold uppercase tracking-wider">Optimized Route</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                        <span className="text-white text-[13px] font-medium truncate">
                          {routeOrigin}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="w-3.5 h-3.5 text-[#1E5BD7] flex-shrink-0" />
                        <span className="text-white text-[13px] font-medium truncate">
                          {routeDest}
                        </span>
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
              background: showRouteOnMap
                ? "linear-gradient(to top, rgba(10,46,109,0.85) 0%, transparent 40%)"
                : "linear-gradient(to top, #0A2E6D 0%, rgba(10,46,109,0.7) 50%, rgba(10,46,109,0.3) 100%)",
            }}
          />

          <div className="relative z-20 p-12 xl:p-16 flex flex-col gap-8">
            <AnimatePresence mode="wait">
              {showRouteOnMap ? (
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
              ) : hasValidRouteLabels && !hasRouteCoords ? (
                <motion.div
                  key="route-loading"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="inline-flex items-center gap-2 self-start bg-white/10 border border-white/10 px-4 py-2 rounded-lg"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1E5BD7] animate-pulse" />
                  <span className="text-white/80 text-sm font-semibold">
                    Calculating route…
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
            {!showRouteOnMap && (
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
