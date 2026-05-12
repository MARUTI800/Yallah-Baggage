"use client";

import { motion } from "framer-motion";
import { Headphones, Briefcase, Clock, Timer, ShieldCheck } from "lucide-react";

const stats = [
  {
    icon: Headphones,
    value: "24/7",
    label: "Customer Support",
    iconColor: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Briefcase,
    value: "2.5k+",
    label: "Bags Handled",
    iconColor: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Clock,
    value: "99.98%",
    label: "On-Time Delivery",
    iconColor: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Timer,
    value: "9min",
    label: "Average Pickup Time",
    iconColor: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: ShieldCheck,
    value: "$5K",
    label: "Protection up-to*/bag",
    iconColor: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
];

export function TrustStats() {
  return (
    <section className="w-full bg-[#fcfcfc] py-20 border-b border-gray-100 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 tracking-tight text-balance"
          >
            Trusted by thousands of travelers
          </motion.h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto rounded-full animate-in fade-in zoom-in duration-1000 delay-300" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const isLastOdd = i === stats.length - 1 && stats.length % 2 !== 0;
            return (
              <div
                key={i}
                className={`bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center justify-center text-center hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group ${isLastOdd ? "col-span-2 md:col-span-1 lg:col-span-1" : ""}`}
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${stat.bg} ${stat.iconColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-white/50 backdrop-blur-md`}
                >
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 tracking-tight">
                  {stat.value}
                </h3>
                <p className="text-sm font-bold text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
