"use client";

import React, { useState } from "react";
import { Building2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";

export function PartnershipInquiry() {
  const t = useTranslations("Partnerships");
  const [formData, setFormData] = useState({
    hotelName: "",
    contactPerson: "",
    jobTitle: "",
    email: "",
    phone: "",
    volume: "",
    comments: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass =
    "w-full bg-[#F6F2EA]/60 border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#0A2E6D] placeholder:text-[#8B7280]/40 focus:outline-none focus:border-[#1E5BD7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,91,215,0.08)] transition-all font-medium text-base";

  return (
    <section
      id="partnership-inquiry"
      className="w-full bg-white py-24 lg:py-32 border-t border-[#E5E5E5]"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        {/* Left Content */}
        <div className="lg:w-1/2 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F2EA] text-[#0A2E6D] font-semibold text-sm mb-6">
            <Building2 size={18} className="text-[#1E5BD7]" />
            {t("tag")}
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#0A2E6D] leading-[1.1] tracking-tight mb-6">
            {t.rich("title", {
              span: (chunks) => (
                <span className="text-[#1E5BD7]">{chunks}</span>
              ),
            })}
          </h2>

          <p className="text-lg text-[#8B7280] mb-10 max-w-lg leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {[
              t("benefits.reviews"),
              t("benefits.automation"),
              t("benefits.revenue"),
              t("benefits.support"),
            ].map((benefit, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-[#F6F2EA]/50 p-4 rounded-xl border border-[#E5E5E5]/50"
              >
                <div className="w-6 h-6 rounded-full bg-[#1E5BD7] flex items-center justify-center text-white text-[10px] font-bold">
                  ✓
                </div>
                <span className="font-semibold text-[#0A2E6D] text-sm">
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:w-1/2 w-full max-w-lg lg:max-w-none">
          <div className="bg-white border border-[#E5E5E5] p-8 rounded-2xl shadow-[0_4px_40px_rgba(10,46,109,0.06)]">
            <h3 className="text-xl font-bold text-[#0A2E6D] mb-6">
              {t("form.title")}
            </h3>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <div className="w-16 h-16 bg-[#1E5BD7]/10 text-[#1E5BD7] rounded-full flex items-center justify-center mb-5 border border-[#1E5BD7]/20">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-[#0A2E6D] mb-2">
                    {t("form.successTitle")}
                  </h4>
                  <p className="text-[#8B7280] font-medium">
                    {t("form.successSubtitle")}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0A2E6D]">
                      {t("form.businessName")}
                    </label>
                    <input
                      required
                      name="hotelName"
                      value={formData.hotelName}
                      onChange={handleChange}
                      type="text"
                      className={inputClass}
                      placeholder={t("form.businessPlaceholder")}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[#0A2E6D]">
                        {t("form.contactPerson")}
                      </label>
                      <input
                        required
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        type="text"
                        className={inputClass}
                        placeholder={t("form.contactPlaceholder")}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[#0A2E6D]">
                        {t("form.email")}
                      </label>
                      <input
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        className={inputClass}
                        placeholder={t("form.emailPlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0A2E6D]">
                      {t("form.phone")}
                    </label>
                    <input
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel"
                      className={inputClass}
                      placeholder={t("form.phonePlaceholder")}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0A2E6D] hover:bg-[#0D3A8A] text-white font-semibold text-base py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 mt-4 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t("form.submitting")}
                      </span>
                    ) : (
                      <>
                        {t("form.submit")} <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
