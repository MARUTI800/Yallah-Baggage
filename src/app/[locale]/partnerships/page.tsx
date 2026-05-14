"use client";

import React from "react";
import Footer4Col from "@/components/ui/footer-column";
import { PartnershipInquiry } from "@/components/ui/partnership-inquiry";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PartnershipsPage() {
  const t = useTranslations("Navigation");
  return (
    <main className="relative w-full min-h-screen flex flex-col font-sans overflow-x-hidden bg-white">
      {/* Header */}
      <header className="absolute top-0 inset-x-0 w-full z-[100] bg-white h-[80px] lg:h-[100px] flex items-center px-6 lg:px-10">
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
      <div className="pt-[80px] lg:pt-[100px]">
        <PartnershipInquiry />
      </div>

      <Footer4Col />
    </main>
  );
}
