"use client"

import React from "react"
import { RideBookingForm } from "@/components/ui/ride-booking-form"
import { Logos3 } from "@/components/ui/logos3"
import { HotelLogoCarousel } from "@/components/ui/hotel-logo-carousel"
import { PartnershipInquiry } from "@/components/ui/partnership-inquiry"
import { FaqAccordion } from "@/components/ui/faq-chat-accordion"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, X, Luggage, ShieldCheck, Clock, ArrowRight, MapPin } from "lucide-react"

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

const features = [
  {
    icon: Luggage,
    title: "Door to Door",
    description: "We pick up and deliver your luggage anywhere in Dubai and across the UAE.",
  },
  {
    icon: MapPin,
    title: "Airport & City",
    description: "From airports to hotels, and everywhere in between. Full coverage.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    description: "Your luggage is in safe hands. Fully insured, GPS-tracked, and handled with care.",
  },
  {
    icon: Clock,
    title: "On Time, Every Time",
    description: "Reliable service so you can focus on your journey. 99.98% on-time delivery rate.",
  },
]

const processSteps = [
  {
    number: "01",
    title: "Book Your Transfer",
    description: "Schedule your luggage pickup online in seconds. Select your preferred pickup and drop-off locations.",
    image: "/app_screen.png",
  },
  {
    number: "02",
    title: "We Collect",
    description: "Our concierge driver arrives at your location and carefully collects your belongings.",
    image: "/van_branding.png",
  },
  {
    number: "03",
    title: "Travel Free",
    description: "Enjoy your day completely unburdened. Your items arrive safely at your destination.",
    image: "/delivery_uniform.png",
  },
]

export const RevolutionHero = () => {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="w-full flex flex-col font-sans overflow-x-hidden">

      {/* ─── Navbar: Clean Uber-style flat ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/Logo_primary.png"
              alt="Yallah Baggage"
              width={150}
              height={60}
              priority
              className="h-[60px] w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: "Home", id: "home", href: "/" },
              { label: "Services", id: "services", href: "/" },
              { label: "How It Works", id: "how-it-works", href: "/" },
              { label: "FAQ", id: "faq", href: "/" },
              { label: "Partnerships", href: "/partnerships" },
              { label: "Track Order", href: "/track" },
            ].map((item) => {
              const isAnchor = item.id;
              
              const handleClick = (e: React.MouseEvent) => {
                if (isAnchor) {
                  e.preventDefault();
                  const targetId = item.id;
                  const element = document.getElementById(targetId!);
                  if (element) {
                    const offset = 80;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth"
                    });
                  }
                }
              };

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={handleClick}
                  className="px-4 py-2 text-[15px] font-medium text-[#0A2E6D]/70 hover:text-[#0A2E6D] transition-colors rounded-lg hover:bg-[#F6F2EA]/60"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/book-now"
              className="hidden sm:flex items-center gap-2 bg-[#0A2E6D] text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-[#0D3A8A] transition-all duration-200 text-[15px] active:scale-[0.98]"
            >
              Book Now
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-[#0A2E6D] hover:bg-[#F6F2EA] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden bg-white border-t border-[#E5E5E5] overflow-hidden shadow-lg"
            >
              <div className="px-6 py-4 space-y-1">
                {[
                  { label: "Home", id: "home", href: "/" },
                  { label: "Services", id: "services", href: "/" },
                  { label: "How It Works", id: "how-it-works", href: "/" },
                  { label: "FAQ", id: "faq", href: "/" },
                  { label: "Partnerships", href: "/partnerships" },
                  { label: "Track Order", href: "/track" },
                ].map((item) => {
                  const isAnchor = item.id;

                  const handleClick = (e: React.MouseEvent) => {
                    if (isAnchor) {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      const targetId = item.id;
                      const element = document.getElementById(targetId!);
                      if (element) {
                        const offset = 80;
                        const bodyRect = document.body.getBoundingClientRect().top;
                        const elementRect = element.getBoundingClientRect().top;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;

                        window.scrollTo({
                          top: offsetPosition,
                          behavior: "smooth"
                        });
                      }
                    } else {
                      setMobileMenuOpen(false);
                    }
                  };

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={handleClick}
                      className="block px-4 py-3 text-[15px] font-medium text-[#0A2E6D]/80 hover:text-[#0A2E6D] hover:bg-[#F6F2EA] rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2, delay: 0.25 }}
                >
                  <Link
                    href="/book-now"
                    className="block text-center bg-[#0A2E6D] text-white font-semibold py-3 px-6 rounded-lg mt-3"
                  >
                    Book Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Hero Section: Clean Split Layout ─── */}
      <section id="home" className="relative w-full min-h-screen bg-white flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pt-[120px] lg:pt-[100px] pb-16 lg:pb-0">

          {/* Left: Text Content */}
          <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-6"
            >
              {/* Tag */}
              <div className="inline-flex items-center gap-2 text-[#0A2E6D] text-sm font-semibold tracking-wide uppercase mb-2">
                Dubai&apos;s Premier Luggage Concierge
              </div>

              {/* Headline */}
              <h1 className="text-[2.75rem] sm:text-6xl lg:text-7xl font-bold text-[#0A2E6D] tracking-tight leading-[1.05]">
                Travel Light.
                <br />
                <span className="text-[#1E5BD7]">We&apos;ll Handle</span>
                <br />
                the Rest.
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-[#8B7280] font-normal max-w-md leading-relaxed">
                Seamless door-to-door luggage pickup, storage, and delivery across Dubai and the UAE.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/book-now"
                  className="inline-flex items-center justify-center gap-2 bg-[#0A2E6D] text-white font-medium py-4 px-8 rounded-none hover:bg-[#0A2E6D]/90 transition-all duration-200 text-base active:scale-[0.98]"
                >
                  Book a Transfer
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("how-it-works");
                    if (el) {
                      window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-[#0A2E6D] font-medium py-4 px-8 rounded-none border border-[#0A2E6D] hover:bg-[#F6F2EA] transition-all duration-200 text-base"
                >
                  How It Works
                </Link>
              </div>

              {/* Stats Strip */}
              <div className="flex items-center gap-8 pt-6">
                {[
                  { value: "2.5k+", label: "Bags Handled" },
                  { value: "99.98%", label: "On-Time" },
                  { value: "4.9★", label: "Rating" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-2xl font-bold text-[#0A2E6D] tracking-tight">{stat.value}</span>
                    <span className="text-xs font-medium text-[#8B7280] tracking-wide uppercase">{stat.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            id="booking"
            className="w-full lg:w-[55%] z-20"
          >
            <RideBookingForm
              imageUrl="/yalla-form-image.png"
              city="Dubai, UAE"
              onSearch={(d) => {
                const params = new URLSearchParams()
                if (d.pickup) params.set("pickup", d.pickup)
                if (d.dropoff) params.set("dropoff", d.dropoff)
                if (d.pickupDate) params.set("pickupDate", d.pickupDate)
                if (d.pickupTime) params.set("pickupTime", d.pickupTime)
                if (d.deliveryDate) params.set("deliveryDate", d.deliveryDate)
                if (d.deliveryTime) params.set("deliveryTime", d.deliveryTime)
                router.push(`/book-now?${params.toString()}`)
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* ─── Features Strip ─── */}
      <section id="services" className="w-full bg-[#F6F2EA] py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="flex flex-col items-start gap-4"
                >
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-[#0A2E6D]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">{feature.title}</h3>
                    <p className="text-base text-[#8B7280] leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Logo Carousel ─── */}
      <div className="w-full bg-white py-4 border-y border-[#E5E5E5]">
        <Logos3 />
      </div>

      {/* ─── Process Section ─── */}
      <section id="how-it-works" className="w-full bg-white py-24 lg:py-32">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          {/* Section Header */}
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2E6D] tracking-tight leading-tight">
              Simple. Seamless. Effortless.
            </h2>
            <p className="mt-4 text-lg text-[#8B7280]">Three steps to hands-free travel.</p>
          </div>

          {/* Process Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col group"
              >
                {/* Image */}
                <div className="w-full aspect-square overflow-hidden mb-6 bg-transparent relative">
                  <Image
                    src={step.image}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={step.title}
                    fill
                  />
                </div>
                {/* Content */}
                <div className="flex flex-col items-start text-left">
                  <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#8B7280] mb-2.5">
                    STEP {step.number}
                  </div>
                  <h3 className="text-[22px] font-bold text-[#0A2E6D] mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-[#8B7280] text-[15px] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="w-full bg-[#F6F2EA] py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <p className="text-[#1E5BD7] font-semibold text-sm tracking-wide uppercase mb-3">Support</p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A2E6D] tracking-tight">
              Frequently Asked
              <br />
              Questions
            </h2>
          </div>
          <FaqAccordion
            data={faqData}
            timestamp=""
          />
        </div>
      </section>

      {/* ─── Partnership Inquiry ─── */}
      <PartnershipInquiry />

      {/* ─── Hotel Logo Carousel ─── */}
      <HotelLogoCarousel />

      {/* ─── CTA Banner ─── */}
      <section className="w-full bg-[#0A2E6D] py-24 lg:py-32">
        <div className="max-w-[800px] mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Ready to travel light?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/book-now"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0A2E6D] font-medium py-4 px-10 rounded-none hover:bg-[#F6F2EA] transition-all duration-200 text-base active:scale-[0.98]"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default RevolutionHero
