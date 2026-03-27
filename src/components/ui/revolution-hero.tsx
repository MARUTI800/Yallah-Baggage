"use client"

import React from "react"
import { RideBookingForm } from "@/components/ui/ride-booking-form"
import { Logos3 } from "@/components/ui/logos3"
import { HotelLogoCarousel } from "@/components/ui/hotel-logo-carousel"
import { FeatureSteps } from "@/components/ui/feature-section"
import { FaqAccordion } from "@/components/ui/faq-chat-accordion"
import { BlurIn } from "@/components/ui/blur-in"
import { TestimonialsSection } from "@/components/blocks/testimonials"
import { Home, Briefcase, PhoneCall, HelpCircle } from 'lucide-react'
import Link from "next/link"
import { useRouter } from "next/navigation"

const faqData = [
  {
    id: 1,
    question: "Where can I leave my bags in Dubai?",
    answer: "With Yallah Baggage, you don't even need to find a location! We pick up your bags directly from any hotel, port, or address in the UAE and handle the storage for you.",
  },
  {
    id: 2,
    question: "Do you offer luggage storage at Dubai Airport?",
    answer: "Yes! We provide seamless luggage storage and transit services directly to and from Dubai International Airport (DXB) and Al Maktoum Airport (DWC).",
  },
  {
    id: 3,
    question: "How long can I store my luggage?",
    answer: "You can securely store your luggage with us for as long as you want! Whether you need it held for a few hours between flights or safely stored for several months.",
  },
  {
    id: 4,
    question: "How does luggage delivery work in the UAE?",
    answer: "Simply book online, and our concierge driver will collect your bags. You can then explore hands-free while we deliver them safely to your next destination.",
  },
  {
    id: 5,
    question: "Can I cancel my booking?",
    answer: "Absolutely. We offer 100% free cancellation up to 2 hours before your scheduled pickup time.",
  },
]

export const RevolutionHero = () => {
  const router = useRouter();

  return (
    <div className="w-full bg-[#030303] flex flex-col font-sans overflow-x-hidden selection:bg-gray-800 selection:text-white">

      {/* Header — Apple iOS Liquid Pill */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-[100] h-16 sm:h-20 flex items-center justify-between px-6 sm:px-10 bg-[#161616]/40 backdrop-blur-3xl backdrop-saturate-[1.8] border border-white/10 rounded-full shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] transition-all duration-300">
        <div className="flex items-center gap-3 cursor-pointer group">
          <img src="/Logo.png" alt="Yallah Baggage Logo" className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-105 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] brightness-110" />
          <span className="text-xl sm:text-2xl lg:text-3xl font-semibold tracking-tighter text-white">
            Yallah <span className="text-white/40 font-light">Baggage</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-8 lg:gap-10">
          <nav className="text-white/70 hidden lg:flex gap-2 text-[0.95rem] font-medium tracking-tight">
            <a href="#home" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all duration-300 active:scale-95">Home</a>
            <a href="#services" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all duration-300 active:scale-95">Services</a>
            <a href="#faq" className="px-4 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all duration-300 active:scale-95">FAQ</a>
          </nav>
          <Link 
            href="/book-now" 
            className="bg-white text-black font-semibold px-6 lg:px-8 py-2.5 rounded-full hover:bg-zinc-200 active:scale-95 transition-all duration-300 tracking-tight text-sm shadow-[0_8px_24px_rgba(255,255,255,0.15)]"
          >
            Book Now
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative scroll-mt-28 w-full min-h-screen overflow-hidden bg-[#030303] flex items-center flex-col md:flex-row justify-center pb-24 lg:pb-24">

        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/hero-bg.jpg"
            alt="Hero Background"
            className="w-full h-full object-cover object-center pointer-events-none grayscale-[60%] blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-[#030303]/40" />
        </div>

        <div className="relative z-30 w-full h-full max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between pt-[12rem] lg:pt-[11rem]">

          {/* Left Text */}
          <div className="text-white w-full lg:w-[42%] flex-shrink-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 md:mb-0 mt-8 md:mt-0 text-center lg:text-left flex flex-col items-center lg:items-start space-y-8 z-20">
            <h1 className="text-6xl md:text-7xl lg:text-[6.5rem] font-medium leading-[0.95] tracking-tighter text-balance text-white selection:bg-white selection:text-black">
              Luggage. <br />
              <span className="text-white/40">Reimagined.</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-md text-balance leading-relaxed font-light tracking-wide">
              The premier hands-free concierge for Dubai. We transport your bags from the airport to wherever you need them. Uncompromisingly simple.
            </p>

            <div className="pt-4 flex items-center gap-4 opacity-80 mix-blend-screen">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i + 40}`} className="w-10 h-10 rounded-full border border-[#030303] object-cover" alt="Client" />
                ))}
              </div>
              <div className="text-xs font-medium text-white/40 tracking-widest uppercase">
                <span className="text-white font-bold block mb-0.5">45,000+ Bags Handled</span>
                Safely &amp; Securely
              </div>
            </div>
          </div>

          {/* Right: Booking Form */}
          <div id="contact" className="w-full lg:w-[58%] xl:max-w-4xl mt-16 lg:mt-0 animate-in fade-in slide-in-from-bottom-12 duration-1200 z-50 relative pb-10 md:pb-0 perspective-1000 pl-0 lg:pl-10">
            <RideBookingForm
              imageUrl="/yalla-form-image.png"
              city="Dubai, UAE"
              onSearch={(d) => {
                const params = new URLSearchParams()
                if (d.pickup) params.set("pickup", d.pickup)
                if (d.dropoff) params.set("dropoff", d.dropoff)
                if (d.date) params.set("date", d.date)
                if (d.time) params.set("time", d.time)
                router.push(`/book-now?${params.toString()}`)
              }}
            />
          </div>

        </div>
      </section>

      {/* Logo Carousel */}
      <div className="w-full bg-[#030303] relative z-30 shadow-[0_-20px_50px_rgba(0,0,0,1)] border-t border-white/5 py-8">
        <Logos3 />
      </div>

      {/* Below-fold dark sections */}
      <div className="bg-[#000000] text-white relative z-40 overflow-hidden border-t border-white/5">

        {/* Services */}
        <div id="services" className="scroll-mt-28 mt-16 px-6 max-w-7xl mx-auto">
          <FeatureSteps
            title="Effortless Logistics."
            autoPlayInterval={4000}
            features={[
              {
                step: 'Upload',
                title: 'Book Your Transfer',
                content: 'Schedule your luggage pickup online in seconds. Select your preferred pickup and drop-off locations with total precision.',
                image: '/whatsapp_support.png'
              },
              {
                step: 'Hand-off',
                title: 'We Collect',
                content: 'Our concierge meticulously retrieves your belongings directly from your location.',
                image: '/yalla-form-image.png'
              },
              {
                step: 'Enjoy',
                title: 'Total Freedom',
                content: 'Enjoy your day completely unburdened. Your items will meet you securely at your destination.',
                image: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80&w=800'
              },
            ]}
          />
        </div>

        {/* FAQ */}
        <div id="faq" className="scroll-mt-28 w-full py-24 mb-10">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <BlurIn
              word="Questions?"
              className="text-4xl md:text-5xl lg:text-6xl font-medium mb-10 text-center text-white tracking-tighter leading-tight"
            />
            <FaqAccordion
              data={faqData}
              timestamp=""
              questionClassName="bg-white/5 hover:bg-white/10 text-white border-b border-white/5 shadow-none py-6 text-lg font-medium"
              answerClassName="bg-transparent text-white/60 font-normal py-4 leading-relaxed"
            />
          </div>
        </div>

        <HotelLogoCarousel />
        <TestimonialsSection />
      </div>
    </div>
  )
}

export default RevolutionHero
