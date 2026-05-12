"use client";

import { Link } from "@/navigation";
import Image from "next/image";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BookingWizard } from "@/components/ui/booking-wizard";
import { MapPin, Shield, Clock, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

function WizardWithParams({
  onLocationPin,
}: {
  onLocationPin: (lat: string, lon: string, name: string) => void;
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
    <BookingWizard onLocationPin={onLocationPin} initialDraft={initialDraft} />
  );
}

type PinnedLocation = { lat: string; lon: string; name: string };

export default function BookNowPage() {
  const t = useTranslations("BookNow");
  const [pinned, setPinned] = useState<PinnedLocation | null>(null);

  const trustPoints = [
    { icon: Shield, label: t("fullyInsured"), desc: t("allBagsCovered") },
    { icon: Clock, label: t("onTimeGuarantee"), desc: t("moneyBack") },
    { icon: Star, label: t("ratingLabel"), desc: t("ratingDesc") },
  ];

  // Using standard embed URL which is cleaner and doesn't require Embed API activation
  const mapSrc = pinned
    ? `https://maps.google.com/maps?q=${pinned.lat},${pinned.lon}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=25.2048,55.2708&t=&z=12&ie=UTF8&iwloc=&output=embed`;

  return (
    <main className="relative w-full min-h-screen flex flex-col overflow-x-hidden bg-white">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-[#E5E5E5] h-[64px] flex items-center px-6 lg:px-10"
      >
        <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/Logo_primary.png"
              alt="Logo"
              width={150}
              height={60}
              priority
              style={{ height: "60px", width: "auto" }}
            />
          </Link>
          <div className="flex items-center gap-2 text-[#8B7280] text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#1E5BD7] animate-pulse" />
            {t("secureCheckout")}
          </div>
        </div>
      </motion.header>

      {/* Two-Panel Layout */}
      <div className="flex flex-col lg:flex-row flex-1 pt-16 min-h-screen">
        {/* LEFT: Map Panel */}
        <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] relative flex-col justify-end overflow-hidden flex-shrink-0 bg-[#0A2E6D]">
          <iframe
            key={pinned ? `${pinned.lat},${pinned.lon}` : "dubai-default"}
            className="absolute opacity-60 pointer-events-none"
            style={{
              border: 0,
              top: "-80px",
              left: "-80px",
              width: "calc(100% + 160px)",
              height: "calc(100% + 160px)",
            }}
            loading="lazy"
            allowFullScreen
            title="Google Maps - Location Preview"
            src={mapSrc}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2E6D] via-[#0A2E6D]/70 to-[#0A2E6D]/30 pointer-events-none z-10" />

          <div className="relative z-20 p-12 xl:p-16 flex flex-col gap-8">
            <AnimatePresence mode="wait">
              {pinned ? (
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
          </div>
        </div>

        {/* RIGHT: Booking Form */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-14 xl:px-18 py-10 lg:py-12 bg-white lg:border-l border-[#E5E5E5] overflow-y-auto">
          <div className="w-full max-w-2xl mx-auto">
            <Suspense
              fallback={
                <div className="w-full h-[600px] rounded-xl bg-[#F6F2EA] animate-pulse" />
              }
            >
              <WizardWithParams
                onLocationPin={(lat, lon, name) =>
                  setPinned({ lat, lon, name })
                }
              />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
