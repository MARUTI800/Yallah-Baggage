"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/navigation";

interface LegalLayoutProps {
  title: string;
  lastUpdated: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

export function LegalLayout({ title, lastUpdated, icon: Icon, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FDFCF9] pt-24 pb-24 px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        {/* Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-16"
        >
          <Link 
            href="/" 
            className="group inline-flex items-center gap-4 text-xs font-black text-[#8B7280] hover:text-[#0A2E6D] transition-all uppercase tracking-[0.2em]"
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E5E5] flex items-center justify-center group-hover:border-[#0A2E6D] group-hover:bg-[#0A2E6D] group-hover:text-white transition-all shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <header className="mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row md:items-center gap-8 mb-10"
          >
            <div className="w-20 h-20 rounded-[28px] bg-[#0A2E6D] text-white flex items-center justify-center shadow-2xl shadow-[#0A2E6D]/20 shrink-0">
              <Icon className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black text-[#0A2E6D] tracking-tighter leading-tight">
                {title}
              </h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-[#8B7280] font-black uppercase tracking-[0.2em] text-[9px]">
                  Last Updated: {lastUpdated}
                </p>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-[#E5E5E5] rounded-[32px] p-8 md:p-14 shadow-[0_20px_80px_rgba(10,46,109,0.04)] prose prose-slate max-w-none prose-headings:text-[#0A2E6D] prose-headings:font-black prose-headings:tracking-tight prose-p:text-[#4A4A4A] prose-p:text-base prose-p:leading-relaxed prose-strong:text-[#0A2E6D] prose-li:text-[#4A4A4A] prose-li:text-base"
        >
          {children}
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 pt-10 border-t border-[#E5E5E5] text-center max-w-2xl mx-auto"
        >
          <p className="text-[#8B7280] text-sm leading-relaxed font-medium">
            At Yallah Baggage, we take your trust seriously. If you have any questions regarding our <span className="text-[#0A2E6D] font-bold underline decoration-[#1E5BD7]/30">{title.toLowerCase()}</span>, our legal team is here to help.
          </p>
          <a href="mailto:support@yallahbaggage.com" className="mt-6 inline-block text-[#1E5BD7] font-black text-xs uppercase tracking-[0.2em] hover:opacity-70 transition-opacity">
            Contact Support &rarr;
          </a>
        </motion.div>
      </div>
    </div>
  );
}
