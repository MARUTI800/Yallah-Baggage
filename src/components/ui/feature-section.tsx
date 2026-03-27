"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { BlurIn } from "@/components/ui/blur-in"

interface Feature {
  step: string
  title?: string
  content: string
  image: string
}

interface FeatureStepsProps {
  features: Feature[]
  className?: string
  title?: string
  autoPlayInterval?: number
  imageHeight?: string
}

export function FeatureSteps({
  features,
  className,
  title = "How to get Started",
  autoPlayInterval = 3000,
  imageHeight = "h-[400px]",
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100))
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length)
        setProgress(0)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [progress, features.length, autoPlayInterval])

  return (
    <div className={cn("py-16 md:py-24 bg-[#000000]", className)}>
      <div className="max-w-7xl mx-auto w-full px-8 md:px-12">
        <BlurIn 
          word={title as string} 
          className="text-3xl md:text-4xl lg:text-5xl font-black mb-12 text-center text-white tracking-tight" 
        />

        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="w-full order-2 md:order-1 space-y-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-6 md:gap-8 cursor-pointer"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: index === currentFeature ? 1 : 0.4 }}
                transition={{ duration: 0.5 }}
                onClick={() => {
                  setCurrentFeature(index);
                  setProgress(0);
                }}
              >
                <motion.div
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex shrink-0 items-center justify-center border-2 shadow-sm transition-all duration-300",
                    index === currentFeature
                      ? "bg-orange-500 border-orange-500 text-black scale-110"
                      : "bg-white/5 border-white/10 text-white/40",
                  )}
                >
                  {index < currentFeature ? (
                    <span className="text-xl font-bold">✓</span>
                  ) : (
                    <span className="text-xl font-bold">{index + 1}</span>
                  )}
                </motion.div>

                <div className="flex-1 mt-1">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {feature.title || feature.step}
                  </h3>
                  <p className="text-base md:text-lg text-white/50 leading-relaxed max-w-md">
                    {feature.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            className={cn(
              "w-full order-1 md:order-2 relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] overflow-hidden rounded-2xl shadow-2xl border border-white/10"
            )}
          >
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 rounded-2xl overflow-hidden"
                      initial={{ y: 50, opacity: 0, scale: 0.95 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -50, opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <img
                        src={feature.image}
                        alt={feature.step}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
