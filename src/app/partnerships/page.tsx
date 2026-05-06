"use client";

import React, { useState } from "react";
import Footer4Col from "@/components/ui/footer-column";
import { Building2, Send, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function PartnershipsPage() {
  const [formData, setFormData] = useState({
    hotelName: "",
    contactPerson: "",
    jobTitle: "",
    email: "",
    phone: "",
    volume: "",
    comments: ""
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass = "w-full bg-[#F6F2EA]/60 border border-[#E5E5E5] rounded-xl px-4 py-3 text-[#0A2E6D] placeholder:text-[#8B7280]/40 focus:outline-none focus:border-[#1E5BD7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,91,215,0.08)] transition-all font-medium text-base";

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

      {/* Content */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-6 lg:px-10 pt-[100px] pb-20 flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="lg:w-1/2 flex flex-col items-start pt-4"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F2EA] text-[#0A2E6D] font-semibold text-sm mb-6"
          >
            <Building2 size={18} className="text-[#1E5BD7]" />
            B2B Hospitality Partners
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A2E6D] leading-[1.1] tracking-tight mb-6"
          >
            Elevate Your{" "}
            <span className="text-[#1E5BD7]">Guest Experience</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg text-[#8B7280] mb-10 max-w-lg leading-relaxed"
          >
            Join the UAE&apos;s premier luggage concierge network. Offer your guests seamless luggage management directly from your property.
          </motion.p>

          <div className="space-y-4 w-full max-w-md">
            {[
              "Increase guest satisfaction & reviews",
              "Free up valuable bell desk space",
              "Revenue share opportunities",
              "Dedicated VIP concierge support"
            ].map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.1), duration: 0.4 }}
                whileHover={{ x: 5, backgroundColor: "#ffffff", boxShadow: "0 4px 20px rgba(10,46,109,0.05)" }}
                className="flex items-center gap-4 bg-[#F6F2EA] p-4 rounded-xl border border-transparent transition-all"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#0A2E6D] flex items-center justify-center text-white font-bold text-sm">
                  {i + 1}
                </div>
                <span className="font-semibold text-[#0A2E6D] text-[0.95rem]">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="lg:w-1/2 w-full max-w-lg lg:max-w-none lg:pt-4"
        >
          <div className="bg-white border border-[#E5E5E5] p-8 rounded-2xl shadow-[0_4px_40px_rgba(10,46,109,0.06)]">
            <div className="h-1 bg-[#0A2E6D] rounded-full mb-6 -mt-1" />
            <h2 className="text-xl font-bold text-[#0A2E6D] mb-6">Partnership Inquiry</h2>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center py-12"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
                    className="w-16 h-16 bg-[#1E5BD7]/10 text-[#1E5BD7] rounded-full flex items-center justify-center mb-5 border border-[#1E5BD7]/20"
                  >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                  </motion.div>
                  <h3 className="text-xl font-bold text-[#0A2E6D] mb-2">Request Received!</h3>
                  <p className="text-[#8B7280] font-medium">Our partnership team will be in touch within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0A2E6D]">Hotel / Business Name*</label>
                    <input required name="hotelName" value={formData.hotelName} onChange={handleChange} type="text" className={inputClass} placeholder="E.g. Grand Plaza Hotel" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[#0A2E6D]">Contact Person*</label>
                      <input required name="contactPerson" value={formData.contactPerson} onChange={handleChange} type="text" className={inputClass} placeholder="Jane Doe" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[#0A2E6D]">Job Title*</label>
                      <input required name="jobTitle" value={formData.jobTitle} onChange={handleChange} type="text" className={inputClass} placeholder="General Manager" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0A2E6D]">Email Address*</label>
                    <input required name="email" value={formData.email} onChange={handleChange} type="email" className={inputClass} placeholder="jane@hotel.com" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[#0A2E6D]">Phone Number*</label>
                      <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className={inputClass} placeholder="+971 50 XXXXXXX" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-[#0A2E6D]">Est. Daily Volume*</label>
                      <select required name="volume" value={formData.volume} onChange={handleChange} className={inputClass + " appearance-none"}>
                        <option value="" disabled>Select volume</option>
                        <option value="1-10">1-10 Bags / Day</option>
                        <option value="10-50">10-50 Bags / Day</option>
                        <option value="50-100">50-100 Bags / Day</option>
                        <option value="100+">100+ Bags / Day</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-[#0A2E6D]">Comments / Requirements</label>
                    <textarea name="comments" value={formData.comments} onChange={handleChange} rows={3} className={inputClass + " resize-none"} placeholder="Tell us about your specific needs..."></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-[#0A2E6D] hover:bg-[#0D3A8A] text-white font-semibold text-base py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 mt-4 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="flex items-center gap-2"
                      >
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </motion.div>
                    ) : (
                      <>Submit Request <Send size={18} /></>
                    )}
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <Footer4Col />
    </main>
  );
}
