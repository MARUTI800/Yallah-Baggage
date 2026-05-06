"use client";

import React from "react";
import { LogoCarousel } from "@/components/ui/logo-carousel";
import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
}

const AtlantisIcon = (props: IconProps) => <div className={cn("flex flex-col items-center justify-center font-serif text-[#0A2E6D]/80", props.className)}><span className="text-lg md:text-xl tracking-[0.15em] md:tracking-[0.2em] uppercase">Atlantis</span></div>;
const BurjAlArabIcon = (props: IconProps) => <div className={cn("flex flex-col items-center justify-center font-serif text-[#0A2E6D]/80", props.className)}><span className="text-lg md:text-xl tracking-wider md:tracking-widest uppercase">Burj Al Arab</span></div>;
const JumeirahIcon = (props: IconProps) => <div className={cn("flex flex-col items-center justify-center font-sans font-light text-[#0A2E6D]/80", props.className)}><span className="text-xl md:text-2xl tracking-[0.1em] md:tracking-[0.15em] uppercase">Jumeirah</span></div>;
const RitzCarltonIcon = (props: IconProps) => <div className={cn("flex flex-col items-center justify-center font-serif text-[#0A2E6D]/80", props.className)}><span className="text-lg md:text-xl tracking-[0.05em] md:tracking-[0.1em] font-bold uppercase text-center">The Ritz-Carlton</span></div>;
const KempinskiIcon = (props: IconProps) => <div className={cn("flex flex-col items-center justify-center font-serif text-[#0A2E6D]/80", props.className)}><span className="text-2xl md:text-3xl italic tracking-tight md:tracking-wide">Kempinski</span></div>;
const WaldorfIcon = (props: IconProps) => <div className={cn("flex flex-col items-center justify-center font-serif text-[#0A2E6D]/80", props.className)}><span className="text-lg md:text-xl tracking-[0.1em] md:tracking-[0.15em] uppercase text-center">Waldorf Astoria</span></div>;
const ArmaniIcon = (props: IconProps) => <div className={cn("flex flex-col items-center justify-center font-serif text-[#0A2E6D]/80", props.className)}><span className="text-xl md:text-2xl tracking-[0.2em] md:tracking-[0.3em] uppercase">Armani</span></div>;
const AddressIcon = (props: IconProps) => <div className={cn("flex flex-col items-center justify-center font-sans font-light text-[#0A2E6D]/80", props.className)}><span className="text-lg md:text-xl tracking-wider md:tracking-widest uppercase">The Address</span></div>;
const BulgariIcon = (props: IconProps) => <div className={cn("flex flex-col items-center justify-center font-serif text-[#0A2E6D]/80", props.className)}><span className="text-xl md:text-2xl tracking-[0.25em] md:tracking-[0.35em] uppercase">Bvlgari</span></div>;
const OneAndOnlyIcon = (props: IconProps) => <div className={cn("flex flex-col items-center justify-center font-serif text-[#0A2E6D]/80", props.className)}><span className="text-lg md:text-xl tracking-[0.1em] md:tracking-[0.15em] uppercase">One&Only</span></div>;
const StRegisIcon = (props: IconProps) => <div className={cn("flex flex-col items-center justify-center font-serif text-[#0A2E6D]/80", props.className)}><span className="text-xl md:text-2xl tracking-wider md:tracking-widest uppercase">St. Regis</span></div>;
const MandarinIcon = (props: IconProps) => <div className={cn("flex flex-col items-center justify-center font-serif text-[#0A2E6D]/80", props.className)}><span className="text-base md:text-[1.1rem] tracking-[0.15em] md:tracking-[0.2em] uppercase text-center leading-tight">Mandarin Oriental</span></div>;

const allLogos = [
  { name: "Atlantis", id: 1, img: AtlantisIcon },
  { name: "Burj Al Arab", id: 2, img: BurjAlArabIcon },
  { name: "Jumeirah", id: 3, img: JumeirahIcon },
  { name: "Ritz-Carlton", id: 4, img: RitzCarltonIcon },
  { name: "Kempinski", id: 5, img: KempinskiIcon },
  { name: "Waldorf Astoria", id: 6, img: WaldorfIcon },
  { name: "Armani", id: 7, img: ArmaniIcon },
  { name: "The Address", id: 8, img: AddressIcon },
  { name: "Bulgari", id: 9, img: BulgariIcon },
  { name: "One&Only", id: 10, img: OneAndOnlyIcon },
  { name: "St Regis", id: 11, img: StRegisIcon },
  { name: "Mandarin Oriental", id: 12, img: MandarinIcon },
];

export function HotelLogoCarousel() {
  return (
    <div className="w-full bg-white space-y-6 py-16 md:py-20 border-t border-[#E5E5E5] flex flex-col items-center">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center space-y-4 px-4">
        <div className="text-center flex flex-col items-center gap-2">
          <p className="text-[#1E5BD7] font-semibold text-sm tracking-wide uppercase mb-1">Our Partners</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A2E6D] tracking-tight leading-tight">
            Trusted by the UAE&apos;s Best Hotels
          </h2>
        </div>
        <div className="w-full max-w-5xl px-4 mt-6">
          <LogoCarousel columnCount={4} logos={allLogos} />
        </div>
      </div>
    </div>
  );
}
