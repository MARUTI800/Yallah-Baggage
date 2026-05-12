"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem,
  ) => {
    setActiveTab(item.name);

    // Smooth-scroll for in-page hash links.
    if (item.url.startsWith("#")) {
      const id = item.url.slice(1);
      if (!id) return;

      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        window.history.pushState(null, "", item.url);
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // If the element doesn't exist, fall back to updating the hash.
        window.history.pushState(null, "", item.url);
      }
    }
  };

  return (
    <div className={cn("z-50", className)}>
      <div className="flex items-center gap-1 sm:gap-3 bg-black/60 border border-white/10 backdrop-blur-xl py-1.5 px-2 rounded-full shadow-2xl">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={(e) => handleNavClick(e, item)}
              className={cn(
                "relative cursor-pointer text-xs sm:text-sm font-bold px-4 py-2 sm:px-6 sm:py-2.5 rounded-full transition-colors",
                "text-white/70 hover:text-orange-500",
                isActive && "bg-white/10 text-orange-500",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={20} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-orange-500/10 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-1 bg-orange-500 rounded-t-full">
                    <div className="absolute w-12 sm:w-16 h-6 bg-orange-500/30 rounded-full blur-md -top-2 -left-2 sm:-left-2" />
                    <div className="absolute w-8 sm:w-10 h-6 bg-orange-500/30 rounded-full blur-md -top-1 sm:-left-1" />
                    <div className="absolute w-4 h-4 bg-orange-500/30 rounded-full blur-sm top-0 left-2 sm:left-4" />
                  </div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
