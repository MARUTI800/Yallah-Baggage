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
  timestamp = "",
  questionClassName,
  answerClassName,
}: FaqAccordionProps) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  return (
    <div className={cn("", className)}>
      {timestamp && (
        <div className="mb-6 text-sm font-medium text-[#8B7280] text-center">{timestamp}</div>
      )}

      <Accordion.Root
        type="single"
        collapsible
        value={openItem || ""}
        onValueChange={(value) => setOpenItem(value)}
        className="w-full space-y-2"
      >
        {data.map((item) => (
          <Accordion.Item 
            value={item.id.toString()} 
            key={item.id} 
            className="w-full border-b border-[#E5E5E5]"
          >
            <Accordion.Header className="w-full flex">
              <Accordion.Trigger className="flex w-full items-center justify-between gap-x-4 group outline-none">
                <div
                  className={cn(
                    "relative flex-1 flex items-center py-5 transition-all duration-200 text-left",
                    openItem === item.id.toString() 
                      ? "text-[#0A2E6D]" 
                      : "text-[#0A2E6D] hover:text-[#1E5BD7]",
                    questionClassName
                  )}
                >
                  <span className="font-semibold text-lg md:text-xl pr-4">{item.question}</span>
                </div>

                <div 
                  className={cn(
                    "shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                    openItem === item.id.toString() ? "bg-[#F6F2EA]" : "bg-transparent"
                  )}
                >
                  {openItem === item.id.toString() ? (
                    <Minus className="h-5 w-5 text-[#0A2E6D]" />
                  ) : (
                    <Plus className="h-5 w-5 text-[#8B7280] group-hover:text-[#0A2E6D]" />
                  )}
                </div>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content asChild forceMount>
              <motion.div
                initial="collapsed"
                animate={openItem === item.id.toString() ? "open" : "collapsed"}
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pb-5">
                  <div
                    className={cn(
                      "text-[#8B7280] text-base leading-relaxed max-w-3xl",
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
