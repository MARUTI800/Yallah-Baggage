"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Logo {
  name: string;
  id: number;
  img: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface LogoColumnProps {
  logos: Logo[];
  index: number;
  currentTime: number;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  // Use a deterministic seed-based shuffle to avoid hydration mismatch
  let seed = 12345;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const distributeLogos = (allLogos: Logo[], columnCount: number): Logo[][] => {
  const shuffled = shuffleArray(allLogos);
  const columns: Logo[][] = Array.from({ length: columnCount }, () => []);

  shuffled.forEach((logo, index) => {
    columns[index % columnCount].push(logo);
  });

  // Fill columns so they are evenly long
  const maxLength = Math.max(...columns.map((col) => col.length));
  let seed = 54321;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  columns.forEach((col) => {
    while (col.length < maxLength) {
      col.push(shuffled[Math.floor(random() * shuffled.length)]);
    }
  });

  return columns;
};

const LogoColumn: React.FC<LogoColumnProps> = React.memo(
  ({ logos, index, currentTime }) => {
    const cycleInterval = 2000;
    const columnDelay = index * 200;
    const adjustedTime =
      (currentTime + columnDelay) % (cycleInterval * logos.length);
    const currentIndex = Math.floor(adjustedTime / cycleInterval);
    const CurrentLogo = useMemo(
      () => logos[currentIndex].img,
      [logos, currentIndex],
    );

    return (
      <motion.div
        className="relative h-20 w-[calc(50%-12px)] min-w-[140px] sm:w-40 md:h-28 md:w-56 overflow-hidden rounded-2xl border border-gray-100/50 bg-white/50 shadow-sm"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${logos[currentIndex].id}-${currentIndex}`}
            className="absolute inset-0 flex items-center justify-center p-2"
            initial={{ y: "15%", opacity: 0, filter: "blur(8px)" }}
            animate={{
              y: "0%",
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 1,
                bounce: 0.2,
                duration: 0.5,
              },
            }}
            exit={{
              y: "-20%",
              opacity: 0,
              filter: "blur(6px)",
              transition: {
                type: "tween",
                ease: "easeIn",
                duration: 0.3,
              },
            }}
          >
            <CurrentLogo className="h-full w-full object-contain drop-shadow-sm" />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  },
);

LogoColumn.displayName = "LogoColumn";

interface LogoCarouselProps {
  columnCount?: number;
  logos: Logo[];
}

export function LogoCarousel({ columnCount = 2, logos }: LogoCarouselProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const logoSets = useMemo(() => {
    if (!hasMounted) return [];
    return distributeLogos(logos, columnCount);
  }, [logos, columnCount, hasMounted]);

  const [currentTime, setCurrentTime] = useState(0);

  const updateTime = useCallback(() => {
    setCurrentTime((prevTime) => prevTime + 100);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
    const intervalId = setInterval(updateTime, 100);
    return () => clearInterval(intervalId);
  }, [updateTime]);

  if (!hasMounted) {
    return (
      <div className="flex flex-wrap justify-center gap-4 py-8 h-32 md:h-40" />
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-4 py-8">
      {logoSets.map((columnLogos, index) => (
        <LogoColumn
          key={index}
          logos={columnLogos}
          index={index}
          currentTime={currentTime}
        />
      ))}
    </div>
  );
}
