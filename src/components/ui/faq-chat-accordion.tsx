"use client";

import * as React from "react";
import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon?: string;
  iconPosition?: "left" | "right";
}

interface FaqAccordionProps {
  data: FAQItem[];
  className?: string;
  timestamp?: string;
  questionClassName?: string;
  answerClassName?: string;
}

export function FaqAccordion({
  data,
  className,
  timestamp = "Every day, 9:01 AM",
  questionClassName,
  answerClassName,
}: FaqAccordionProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  return (
    <div className={cn("p-4 md:p-8", className)}>
      {timestamp && (
        <div className="mb-6 text-sm font-medium text-gray-500 text-center">{timestamp}</div>
      )}

      <Accordion.Root
        type="single"
        collapsible
        value={openItem || ""}
        onValueChange={(value) => setOpenItem(value)}
        className="w-full space-y-4"
      >
        {data.map((item) => (
          <Accordion.Item 
            value={item.id.toString()} 
            key={item.id} 
            className="w-full"
          >
            <Accordion.Header className="w-full flex">
              <Accordion.Trigger className="flex w-full items-center justify-between gap-x-4 group outline-none">
                <div
                  className={cn(
                    "relative flex-1 flex items-center rounded-2xl p-4 md:p-5 transition-all duration-300 text-left",
                    openItem === item.id.toString() 
                      ? "bg-orange-500/10 text-white shadow-md transform scale-[1.02] border border-orange-500/20" 
                      : "bg-white/5 hover:bg-white/10 text-white/80 shadow-sm border border-transparent",
                    questionClassName
                  )}
                >
                  {item.icon && (
                    <span
                      className={cn(
                        "absolute -top-3 text-2xl drop-shadow-md",
                        item.iconPosition === "right" ? "-right-2" : "-left-2"
                      )}
                      style={{
                        transform: item.iconPosition === "right" 
                          ? "rotate(12deg)" 
                          : "rotate(-12deg)",
                      }}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className="font-bold text-lg md:text-xl pr-4">{item.question}</span>
                </div>

                <div 
                  className={cn(
                    "shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm border",
                    openItem === item.id.toString() 
                      ? "bg-orange-500 text-black border-orange-500 transform rotate-180"
                      : "bg-white/5 text-white/40 group-hover:bg-white/10 border-white/10"
                  )}
                >
                  {openItem === item.id.toString() ? (
                    <Minus className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </div>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content asChild forceMount>
              <motion.div
                initial="collapsed"
                animate={openItem === item.id.toString() ? "open" : "collapsed"}
                variants={{
                  open: { opacity: 1, height: "auto", marginTop: 12 },
                  collapsed: { opacity: 0, height: 0, marginTop: 0 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="ml-4 md:ml-8 lg:ml-12 mb-4">
                  <div
                    className={cn(
                      "relative max-w-2xl rounded-2xl rounded-tl-none bg-white/5 border border-white/10 px-6 py-4 text-white/70 font-medium shadow-md text-base md:text-lg",
                      answerClassName
                    )}
                  >
                    {item.answer}
                  </div>
                </div>
              </motion.div>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
