"use client";

import React from "react";
import Footer4Col from "@/components/ui/footer-column";
import { PartnershipInquiry } from "@/components/ui/partnership-inquiry";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function PartnershipsPage() {
  return (
    <main className="relative w-full min-h-screen flex flex-col font-sans overflow-x-hidden bg-white">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 w-full z-[100] bg-white border-b border-[#E5E5E5] h-[64px] flex items-center px-6 lg:px-10">
        <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/Logo_primary.png" alt="Yallah Baggage" width={150} height={60} style={{ height: '60px', width: 'auto' }} />
          </Link>
          <Link href="/" className="flex items-center gap-2 text-[#8B7280] hover:text-[#0A2E6D] text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Inquiry Section */}
      <div className="pt-[64px]">
        <PartnershipInquiry />
      </div>

      <Footer4Col />
    </main>
  );
}
