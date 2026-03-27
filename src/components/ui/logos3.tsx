"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import { Zap, HeartHandshake, MapPin, BadgeDollarSign, ShieldCheck, Clock8, Truck, LocateFixed } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Term {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface TermsCarouselProps {
  heading?: string;
  terms?: Term[];
}

const Logos3 = ({
  heading = "",
  terms = [
    {
      id: "term-1",
      label: "Fast Delivery",
      icon: <Zap className="w-6 h-6 text-orange-500" />,
    },
    {
      id: "term-2",
      label: "Repeat Friendly",
      icon: <HeartHandshake className="w-6 h-6 text-blue-500" />,
    },
    {
      id: "term-3",
      label: "Dubai Coverage",
      icon: <MapPin className="w-6 h-6 text-orange-500" />,
    },
    {
      id: "term-4",
      label: "Transparent Pricing",
      icon: <BadgeDollarSign className="w-6 h-6 text-blue-500" />,
    },
    {
      id: "term-5",
      label: "Secure Handling",
      icon: <ShieldCheck className="w-6 h-6 text-orange-500" />,
    },
    {
      id: "term-6",
      label: "24/7 Support",
      icon: <Clock8 className="w-6 h-6 text-blue-500" />,
    },
    {
      id: "term-7",
      label: "Door-to-Door",
      icon: <Truck className="w-6 h-6 text-orange-500" />,
    },
    {
      id: "term-8",
      label: "Real-time Tracking",
      icon: <LocateFixed className="w-6 h-6 text-blue-500" />,
    },
  ],
}: TermsCarouselProps) => {
  return (
    <section className="py-6 w-full">
      <div className="container flex flex-col items-center text-center">
        {heading && (
          <h1 className="my-6 text-2xl font-bold text-pretty lg:text-4xl text-white">
            {heading}
          </h1>
        )}
      </div>
      <div className="pt-2 pb-4">
        <div className="relative mx-auto flex items-center justify-center w-full max-w-full overflow-hidden lg:max-w-7xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ playOnInit: true, speed: 1.5 })]}
            className="w-full"
          >
            <CarouselContent className="ml-0 flex items-center">
              {terms.map((term) => (
                <CarouselItem
                  key={term.id}
                  className="flex basis-auto justify-center pl-8 sm:pl-12 lg:pl-16"
                >
                  <div className="flex shrink-0 items-center justify-center gap-3 py-2 px-6 rounded-2xl bg-white/5 border border-white/10 shadow-sm hover:border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm">
                    {term.icon}
                    <span className="text-lg md:text-xl font-bold text-white tracking-tight whitespace-nowrap">
                      {term.label}
                    </span>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#030303] to-transparent pointer-events-none z-10"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#030303] to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </section>
  );
};

export { Logos3 };
