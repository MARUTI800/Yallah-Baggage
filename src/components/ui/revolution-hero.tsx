"use client";

import React from "react";
import { RideBookingForm } from "@/components/ui/ride-booking-form";
import { Logos3 } from "@/components/ui/logos3";
import { HotelLogoCarousel } from "@/components/ui/hotel-logo-carousel";
import Footer4Col from "@/components/ui/footer-column";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/navigation";
import Image from "next/image";
import { useRouter } from "@/navigation";
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

export const RevolutionHero = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full flex flex-col font-sans overflow-x-hidden">
      {/* ─── Navbar: Clean Uber-style flat ─── */}
      <header
        className={`fixed top-0 left-0 right-0 z-[999] transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-white/70 backdrop-blur-sm"
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
                    const offset = 80;
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
          <div className="flex items-center gap-3">
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>
            <Link
              href="/book-now"
              className="hidden sm:flex items-center gap-2 bg-[#0A2E6D] text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-[#0D3A8A] transition-all duration-200 text-[15px] active:scale-[0.98]"
            >
              {t("Navigation.bookNow")}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-[#0A2E6D] hover:bg-[#F6F2EA] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
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
                        const offset = 80;
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

      {/* ─── Hero Section: Clean Split Layout ─── */}
      <section
        id="home"
        className="relative w-full min-h-screen bg-white flex items-center"
      >
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
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/book-now"
                  className="inline-flex items-center justify-center gap-2 bg-[#0A2E6D] text-white font-medium py-4 px-8 rounded-lg hover:bg-[#0A2E6D]/90 transition-all duration-200 text-base active:scale-[0.98]"
                >
                  {t("Hero.bookButton")}
                  <ArrowRight
                    className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`}
                  />
                </Link>
                <Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("how-it-works");
                    if (el) {
                      window.scrollTo({
                        top: el.offsetTop - 80,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-[#0A2E6D] font-medium py-4 px-8 rounded-lg border border-[#0A2E6D] hover:bg-[#F6F2EA] transition-all duration-200 text-base"
                >
                  {t("Hero.howItWorksButton")}
                </Link>
              </div>

              {/* Stats Strip */}
              <div className="flex items-center gap-8 pt-6">
                {[
                  { value: "2.5k+", label: t("Hero.bagsHandled") },
                  { value: "99.98%", label: t("Hero.onTime") },
                  { value: "4.9★", label: t("Hero.rating") },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-2xl font-bold text-[#0A2E6D] tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-xs font-medium text-[#8B7280] tracking-wide uppercase">
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
      <section id="services" className="w-full bg-[#F6F2EA] py-16 lg:py-20">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
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
            ].map((feature, i) => {
              const Icon = feature.icon;
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
                    <Icon
                      className="w-8 h-8 text-[#0A2E6D]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0A2E6D] mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-base text-[#8B7280] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
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
              {t("Process.header")}
            </h2>
            <p className="mt-4 text-lg text-[#8B7280]">
              {t("Process.subheader")}
            </p>
          </div>

          {/* Process Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {[
              {
                number: "01",
                title: t("Process.step1Title"),
                description: t("Process.step1Desc"),
                image: "/app_screen.png",
              },
              {
                number: "02",
                title: t("Process.step2Title"),
                description: t("Process.step2Desc"),
                image: "/delivery_uniform.png",
              },
              {
                number: "03",
                title: t("Process.step3Title"),
                description: t("Process.step3Desc"),
                image: "/van_branding.png",
              },
              {
                number: "04",
                title: t("Process.step4Title"),
                description: t("Process.step4Desc"),
                image: "/luggage_tag.png",
              },
            ].map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col group"
              >
                {/* Image */}
                <div className="w-full aspect-[4/5] overflow-hidden mb-6 bg-[#F6F2EA] rounded-2xl relative">
                  <Image
                    src={step.image}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={step.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                {/* Content */}
                <div className="flex flex-col items-start text-left">
                  <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#8B7280] mb-2.5">
                    {t("Process.stepLabel", { number: step.number })}
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
            <p className="text-[#1E5BD7] font-semibold text-sm tracking-wide uppercase mb-3">
              {t("FAQ.support")}
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#0A2E6D] tracking-tight">
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
              {t("CTA.title")}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/book-now"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0A2E6D] font-medium py-4 px-10 rounded-none hover:bg-[#F6F2EA] transition-all duration-200 text-base active:scale-[0.98]"
              >
                {t("CTA.button")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer4Col />
    </div>
  );
};

export default RevolutionHero;
