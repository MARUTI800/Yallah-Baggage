"use client";

import React from "react";
import { RideBookingForm } from "@/components/ui/ride-booking-form";
import { Logos3 } from "@/components/ui/logos3";
import { SiteLogo } from "@/components/ui/site-logo";
import { HotelLogoCarousel } from "@/components/ui/hotel-logo-carousel";
import Footer4Col from "@/components/ui/footer-column";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useRouter } from "@/navigation";
import Image from "next/image";
import {
  Menu,
  X,
  Luggage,
  ShieldCheck,
  Clock,
  ArrowRight,
  MapPin,
} from "lucide-react";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { useTranslations, useLocale } from "next-intl";

import { SecuritySection } from "./security-section";

export const RevolutionHero = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === "ar";
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="w-full flex flex-col font-sans overflow-x-hidden">
      {/* ─── Navbar: scrolls away with the page (not sticky/fixed) ─── */}
      <header className="relative z-50 bg-white border-b border-[#E5E5E5] h-[88px] sm:h-[92px] lg:h-[108px]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-full flex items-center justify-between">
          {/* Logo */}
          <SiteLogo variant="header" priority className="transition-transform duration-500 hover:scale-[1.02]" />

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { label: t("Navigation.home"), id: "home", href: "/" },
              { label: t("Navigation.services"), id: "services", href: "/" },
              {
                label: t("Navigation.howItWorks"),
                id: "how-it-works",
                href: "/",
              },
              { label: t("Navigation.faq"), id: "faq", href: "/" },
              { label: t("Navigation.partnerships"), href: "/partnerships" },
              { label: t("Navigation.trackOrder"), href: "/track" },
            ].map((item) => {
              const isAnchor = item.id;

              const handleClick = (e: React.MouseEvent) => {
                if (isAnchor) {
                  e.preventDefault();
                  const targetId = item.id;
                  const element = document.getElementById(targetId!);
                  if (element) {
                    const offset = 16;
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = element.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
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
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden lg:flex items-center">
              <LanguageSwitcher />
            </div>
            <Link
              href="/book-now"
              className="hidden sm:flex items-center gap-2 bg-[#0A2E6D] text-white font-bold py-3 px-8 rounded-full hover:bg-[#1E5BD7] transition-all duration-300 text-[15px] active:scale-[0.98] shadow-lg shadow-[#0A2E6D]/10"
            >
              {t("Navigation.bookNow")}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full text-[#0A2E6D] bg-[#F6F2EA]/80 hover:bg-[#F6F2EA] transition-all"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
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
                  { label: t("Navigation.home"), id: "home", href: "/" },
                  {
                    label: t("Navigation.services"),
                    id: "services",
                    href: "/",
                  },
                  {
                    label: t("Navigation.howItWorks"),
                    id: "how-it-works",
                    href: "/",
                  },
                  { label: t("Navigation.faq"), id: "faq", href: "/" },
                  {
                    label: t("Navigation.partnerships"),
                    href: "/partnerships",
                  },
                  { label: t("Navigation.trackOrder"), href: "/track" },
                ].map((item) => {
                  const isAnchor = item.id;

                  const handleClick = (e: React.MouseEvent) => {
                    if (isAnchor) {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      const targetId = item.id;
                      const element = document.getElementById(targetId!);
                      if (element) {
                        const offset = 16;
                        const bodyRect =
                          document.body.getBoundingClientRect().top;
                        const elementRect = element.getBoundingClientRect().top;
                        const elementPosition = elementRect - bodyRect;
                        const offsetPosition = elementPosition - offset;

                        window.scrollTo({
                          top: offsetPosition,
                          behavior: "smooth",
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
                    {t("Navigation.bookNow")}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Hero Section ─── */}
      <section id="home" className="relative w-full min-h-[90vh] lg:min-h-screen flex flex-col bg-[#F6F2EA] overflow-visible">
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#1E5BD7]/5 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#0A2E6D]/5 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-16 pt-10 lg:pt-14 pb-12 lg:pb-20 relative z-10">
          {/* Left: Text Content */}
          <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-6"
            >
              {/* Tag */}
              <div className="inline-flex items-center gap-2 bg-[#1E5BD7]/5 border border-[#1E5BD7]/10 px-4 py-2 rounded-full text-[#1E5BD7] text-xs font-bold tracking-[0.2em] uppercase mb-4 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E5BD7] animate-pulse" />
                {t("Hero.tagline")}
              </div>

              {/* Headline */}
              <h1 className="text-[2.75rem] sm:text-6xl lg:text-7xl font-bold text-[#0A2E6D] tracking-tight leading-[1.05]">
                {t("Hero.title1")}
                <br />
                <span className="text-[#1E5BD7]">{t("Hero.title2")}</span>
                <br />
                {t("Hero.title3")}
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-[#6B7280] font-normal max-w-md leading-relaxed">
                {t("Hero.subtitle")}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link
                  href="/book-now"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#0A2E6D] text-white font-bold py-4.5 px-10 rounded-full hover:bg-[#1E5BD7] transition-all duration-300 text-lg active:scale-[0.98] shadow-xl shadow-[#0A2E6D]/20 hover:shadow-2xl hover:shadow-[#1E5BD7]/30"
                >
                  {t("Hero.bookButton")}
                  <ArrowRight
                    className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${isRtl ? "rotate-180 group-hover:-translate-x-1" : ""}`}
                  />
                </Link>
                <Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("how-it-works");
                    if (el) {
                      window.scrollTo({
                        top: el.offsetTop - 16,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-[#0A2E6D] font-bold py-4.5 px-10 rounded-full border-2 border-[#0A2E6D]/10 hover:border-[#0A2E6D] hover:bg-[#F6F2EA]/50 transition-all duration-300 text-lg"
                >
                  {t("Hero.howItWorksButton")}
                </Link>
              </div>

              {/* Stats Strip */}
              <div className="flex items-center gap-8 pt-8 border-t border-[#0A2E6D]/5">
                {[
                  { value: "2.5k+", label: t("Hero.bagsHandled") },
                  { value: "99.98%", label: t("Hero.onTime") },
                  { value: "4.9★", label: t("Hero.rating") },
                ].map((stat, i) => (
                  <div key={stat.label} className="flex flex-col relative">
                    {i > 0 && <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-[#0A2E6D]/10 hidden sm:block" />}
                    <span className="text-2xl font-bold text-[#0A2E6D] tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-[10px] font-bold text-[#8B7280] tracking-widest uppercase">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            id="booking"
            className="w-full lg:w-[55%] z-20"
          >
            <RideBookingForm
              onSearch={(d) => {
                const params = new URLSearchParams();
                if (d.pickup) params.set("pickup", d.pickup);
                if (d.dropoff) params.set("dropoff", d.dropoff);
                if (d.pickupDate) params.set("pickupDate", d.pickupDate);
                if (d.pickupTime) params.set("pickupTime", d.pickupTime);
                if (d.deliveryDate) params.set("deliveryDate", d.deliveryDate);
                if (d.deliveryTime) params.set("deliveryTime", d.deliveryTime);
                router.push(`/book-now?${params.toString()}`);
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* ─── Features Strip ─── */}
      <section id="services" className="w-full bg-white py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Luggage,
                title: t("Features.doorToDoorTitle"),
                description: t("Features.doorToDoorDesc"),
              },
              {
                icon: MapPin,
                title: t("Features.airportCityTitle"),
                description: t("Features.airportCityDesc"),
              },
              {
                icon: ShieldCheck,
                title: t("Features.safeSecureTitle"),
                description: t("Features.safeSecureDesc"),
              },
              {
                icon: Clock,
                title: t("Features.onTimeTitle"),
                description: t("Features.onTimeDesc"),
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center text-center sm:text-left lg:text-center gap-6 p-8 rounded-3xl bg-white border border-[#E5E5E5]/50 shadow-[0_4px_20px_rgba(10,46,109,0.03)] hover:shadow-[0_20px_40px_rgba(10,46,109,0.08)] hover:-translate-y-2 transition-all duration-500"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-[#F6F2EA] flex items-center justify-center text-[#1E5BD7] transition-all duration-500 group-hover:bg-[#1E5BD7] group-hover:text-white group-hover:rotate-[10deg] group-hover:scale-110 shadow-sm">
                  <feature.icon className="size-7" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#0A2E6D] mb-3 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-[#8B7280] text-[15px] leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Logo Carousel ─── */}
      <div className="w-full bg-white py-4 border-y border-[#E5E5E5]">
        <Logos3 />
      </div>

      {/* ─── Process Section ─── */}
      <section id="how-it-works" className="w-full bg-white py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          {/* Section Header */}
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0A2E6D] tracking-tight leading-tight">
              {t("Process.header")}
            </h2>
            <p className="mt-4 text-lg text-[#8B7280]">
              {t("Process.subheader")}
            </p>
          </div>

          {/* Minimalist Process Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {[
              {
                title: t("Process.step1Title"),
                image: "/app_screen_v2.png",
              },
              {
                title: t("Process.step2Title"),
                image: "/delivery_uniform_v2.png",
              },
              {
                title: t("Process.step3Title"),
                image: "/van_branding_v2.png",
              },
              {
                title: t("Process.step4Title"),
                image: "/luggage_tag_v2.png",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="flex flex-col group cursor-default"
              >
                {/* Clean Image Container */}
                <div className="w-full aspect-[16/10] overflow-hidden rounded-[20px] mb-5 relative bg-[#F6F2EA]">
                  <Image
                    src={step.image}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={step.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Subtle vignette for depth, no borders/rings */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                </div>
                {/* Ultra-minimal Content */}
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1E5BD7]/10 text-[#1E5BD7] text-xs font-bold">
                    {i + 1}
                  </span>
                  <h3 className="text-xl font-bold text-[#0A2E6D] tracking-tight group-hover:text-[#1E5BD7] transition-colors">
                    {step.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="relative w-full bg-[#F6F2EA] py-16 lg:py-20 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0A2E6D 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="max-w-3xl mx-auto px-6 lg:px-10 relative z-10">
          <div className="mb-14 text-center">
            <p className="text-[#1E5BD7] font-bold text-sm tracking-[0.2em] uppercase mb-4">
              {t("FAQ.support")}
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A2E6D] tracking-tight">
              {t("FAQ.title")}
            </h2>
          </div>
          <FaqAccordion
            data={[
              { id: 1, question: t("FAQ.q1"), answer: t("FAQ.a1") },
              { id: 2, question: t("FAQ.q2"), answer: t("FAQ.a2") },
              { id: 3, question: t("FAQ.q3"), answer: t("FAQ.a3") },
              { id: 4, question: t("FAQ.q4"), answer: t("FAQ.a4") },
              { id: 5, question: t("FAQ.q5"), answer: t("FAQ.a5") },
            ]}
          />
        </div>
      </section>

      {/* ─── Hotel Logo Carousel ─── */}
      <HotelLogoCarousel />

      {/* ─── CTA Banner ─── */}
      <section className="w-full bg-[#0A2E6D] py-16 lg:py-20">
        <div className="max-w-[800px] mx-auto px-6 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              {t("CTA.title")}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/book-now"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0A2E6D] font-medium py-4 px-10 rounded-lg hover:bg-[#F6F2EA] transition-all duration-200 text-base active:scale-[0.98]"
              >
                {t("CTA.button")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="px-6 lg:px-10 pb-12">
        <SecuritySection />
      </div>

      <Footer4Col />
    </div>
  );
};

export default RevolutionHero;
