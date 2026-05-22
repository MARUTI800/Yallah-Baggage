"use client";

import React from "react";
import Footer4Col from "@/components/ui/footer-column";
import { PartnershipInquiry } from "@/components/ui/partnership-inquiry";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/navigation";
import { SiteLogo } from "@/components/ui/site-logo";
import { useTranslations } from "next-intl";

export default function PartnershipsPage() {
  const t = useTranslations("Navigation");
  return (
    <main className="relative w-full min-h-screen flex flex-col font-sans overflow-x-hidden bg-white">
      {/* Header */}
      <header className="absolute top-0 inset-x-0 w-full z-[100] bg-white h-[88px] sm:h-[92px] lg:h-[108px] flex items-center px-6 lg:px-10">
        <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
          <SiteLogo variant="header" priority />
          <Link
            href="/"
            className="flex items-center gap-2 text-[#8B7280] hover:text-[#0A2E6D] text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("backToHome")}
          </Link>
        </div>
      </header>

      {/* Main Inquiry Section */}
      <div className="pt-[88px] sm:pt-[92px] lg:pt-[108px]">
        <PartnershipInquiry />
      </div>

      <Footer4Col />
    </main>
  );
}
