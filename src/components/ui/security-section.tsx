"use client";

import React from "react";
import { Lock, MapPin, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export function SecuritySection() {
  const t = useTranslations("Security");

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative border-y border-[#0A2E6D]/10 py-10 md:py-14"
      >
        <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1E5BD7]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B7280]">
                {t("title")}
              </span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#0A2E6D] tracking-tight leading-snug">
              {t("description")}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-16 w-full lg:w-auto">
            {[
              { icon: Lock, label: t("tamperProof") },
              { icon: MapPin, label: t("gpsTracking") },
              { icon: Shield, label: t("coverProtection") },
            ].map((item, idx) => (
              <motion.div 
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                className="group flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0A2E6D] text-white flex items-center justify-center shadow-lg shadow-[#0A2E6D]/10 group-hover:scale-110 transition-transform duration-500">
                  <item.icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="space-y-1">
                  <p className="text-[#0A2E6D] font-black text-[9px] uppercase tracking-[0.2em]">
                    {item.label}
                  </p>
                  <div className="w-4 h-0.5 bg-[#1E5BD7] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
