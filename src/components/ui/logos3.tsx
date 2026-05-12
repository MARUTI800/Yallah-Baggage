"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import {
  Zap,
  HeartHandshake,
  MapPin,
  BadgeDollarSign,
  ShieldCheck,
  Clock8,
  Truck,
  LocateFixed,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useTranslations } from "next-intl";

interface Term {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TermsCarouselProps {
  heading?: string;
  terms?: Term[];
}

const Logos3 = ({ heading = "", terms }: TermsCarouselProps) => {
  const t = useTranslations("Logos");

  const defaultTerms = [
    {
      id: "term-1",
      label: t("fastDelivery"),
      icon: <Zap className="w-5 h-5 text-[#1E5BD7]" />,
    },
    {
      id: "term-2",
      label: t("repeatFriendly"),
      icon: <HeartHandshake className="w-5 h-5 text-[#0A2E6D]" />,
    },
    {
      id: "term-3",
      label: t("dubaiCoverage"),
      icon: <MapPin className="w-5 h-5 text-[#1E5BD7]" />,
    },
    {
      id: "term-4",
      label: t("transparentPricing"),
      icon: <BadgeDollarSign className="w-5 h-5 text-[#0A2E6D]" />,
    },
    {
      id: "term-5",
      label: t("secureHandling"),
      icon: <ShieldCheck className="w-5 h-5 text-[#1E5BD7]" />,
    },
    {
      id: "term-6",
      label: t("support247"),
      icon: <Clock8 className="w-5 h-5 text-[#0A2E6D]" />,
    },
    {
      id: "term-7",
      label: t("doorToDoor"),
      icon: <Truck className="w-5 h-5 text-[#1E5BD7]" />,
    },
    {
      id: "term-8",
      label: t("realTimeTracking"),
      icon: <LocateFixed className="w-5 h-5 text-[#0A2E6D]" />,
    },
  ];

  const displayTerms = terms || defaultTerms;
  return (
    <section className="py-5 w-full">
      <div className="container flex flex-col items-center text-center">
        {heading && (
          <h1 className="my-6 text-2xl font-bold text-[#0A2E6D] lg:text-4xl">
            {heading}
          </h1>
        )}
      </div>
      <div className="pt-1 pb-2">
        <div className="relative mx-auto flex items-center justify-center w-full max-w-full overflow-hidden lg:max-w-7xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ playOnInit: true, speed: 1.2 })]}
            className="w-full"
          >
            <CarouselContent className="ml-0 flex items-center">
              {displayTerms.map((term) => (
                <CarouselItem
                  key={term.id}
                  className="flex basis-auto justify-center pl-6 sm:pl-10 lg:pl-14"
                >
                  <div className="flex shrink-0 items-center justify-center gap-2.5 py-2 px-5 rounded-full bg-transparent">
                    {term.icon}
                    <span className="text-base md:text-lg font-semibold text-[#0A2E6D] tracking-tight whitespace-nowrap">
                      {term.label}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </section>
  );
};

export { Logos3 };
