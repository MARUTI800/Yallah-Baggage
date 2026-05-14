"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Calendar,
  Clock,
  Loader2,
  CheckCircle2,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Navigation2,
} from "lucide-react";
import { getDubaiTime } from "@/lib/utils";
import { useTranslations } from "next-intl";

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

interface RideBookingFormProps {
  className?: string;
  onSearch: (details: {
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    pickupDate: string;
    pickupTime: string;
    deliveryDate: string;
    deliveryTime: string;
  }) => void;
}

interface GooglePrediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

const generateTimes = () => {
  const times = [];
  for (let h = 8; h <= 22; h++) {
    const period = h >= 12 ? "PM" : "AM";
    const hour = h > 12 ? h - 12 : h;
    times.push(`${hour.toString().padStart(2, "0")}:00 ${period}`);
    times.push(`${hour.toString().padStart(2, "0")}:30 ${period}`);
  }
  return times;
};

const formatAppleDate = (d: Date | null, locale: string = "en-US") => {
  if (!d) return "...";
  return d.toLocaleDateString(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

function DateTimePicker({
  label,
  isOpen,
  setIsOpen,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  minDateTime,
}: {
  label: string;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  selectedDate: Date | null;
  setSelectedDate: (d: Date) => void;
  selectedTime: string;
  setSelectedTime: (t: string) => void;
  minDateTime?: Date;
}) {
  const t = useTranslations("RideBookingForm");
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const d = selectedDate || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const availableTimes = React.useMemo(() => generateTimes(), []);

  const nextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };
  const prevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const daysInMonth = getDaysInMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );
  const firstDay = getFirstDayOfMonth(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
  );
  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div
      className={cn(
        "relative flex flex-col w-full group transition-all duration-200",
        isOpen ? "z-[60]" : "z-10",
      )}
    >
      <div
        className={cn(
          "w-full relative bg-[#F7F5F0] rounded-2xl px-5 py-3.5 border border-transparent transition-all duration-200 cursor-pointer",
          isOpen
            ? "bg-white border-[#1E5BD7] shadow-[0_0_0_4px_rgba(30,91,215,0.1)]"
            : "hover:bg-white",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
            <Calendar className="w-5 h-5 text-[#0A2E6D]" />
          </div>
          <div className="flex-1 flex flex-col justify-center min-h-[48px]">
            <label className="text-[13px] font-bold text-[#0A2E6D] mb-0.5 block cursor-pointer uppercase tracking-wider">
              {label}
            </label>
            <div className="text-[15px] font-medium text-[#8B7280] leading-tight">
              {formatAppleDate(selectedDate)} {t("at")} {selectedTime}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+12px)] left-0 w-full sm:w-[340px] bg-white border border-[#E5E5E5] rounded-2xl shadow-[0_20px_50px_rgba(10,46,109,0.2)] p-5 origin-top z-[100]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold text-[#0A2E6D]">
                {monthName}
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F6F2EA] text-[#0A2E6D] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#F6F2EA] text-[#0A2E6D] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {weekDays.map((wd) => (
                <div
                  key={wd}
                  className="text-[10px] font-bold text-[#8B7280] text-center mb-1 uppercase tracking-wider"
                >
                  {wd}
                </div>
              ))}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {daysInMonth.map((day) => {
                const isSelected =
                  selectedDate && day.toDateString() === selectedDate.toDateString();
                const isToday =
                  hasMounted && day.toDateString() === getDubaiTime().toDateString();

                const todayDateOnly = hasMounted ? getDubaiTime() : new Date();
                todayDateOnly.setHours(0, 0, 0, 0);

                const minDateOnly = minDateTime
                  ? new Date(minDateTime)
                  : todayDateOnly;
                minDateOnly.setHours(0, 0, 0, 0);

                const isPast = day < minDateOnly;

                return (
                  <button
                    key={day.toString()}
                    type="button"
                    onClick={() => {
                      if (!isPast) setSelectedDate(day);
                    }}
                    disabled={isPast}
                    className={cn(
                      "w-7 h-7 mx-auto flex items-center justify-center rounded-full text-xs font-medium transition-all mb-1",
                      isPast
                        ? "text-[#8B7280]/30 cursor-not-allowed"
                        : isSelected
                          ? "bg-[#1E5BD7] text-white shadow-md font-bold scale-105"
                          : isToday
                            ? "text-[#1E5BD7] font-bold border border-[#1E5BD7]/20"
                            : "text-[#0A2E6D] hover:bg-[#F6F2EA]",
                    )}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-3 border-t border-[#E5E5E5]">
              <div className="flex items-center gap-2 mb-2 px-1">
                <Clock className="w-4 h-4 text-[#8B7280]" />
                <span className="text-xs font-bold text-[#0A2E6D]">
                  {t("time")}
                </span>
              </div>
              <div className="flex overflow-x-auto pb-1 gap-2 snap-x scrollbar-hide">
                {availableTimes.map((timeSlot) => {
                  let isTimeDisabled = false;
                  if (minDateTime) {
                    const selDateOnly = new Date(selectedDate || new Date());
                    selDateOnly.setHours(0, 0, 0, 0);
                    const minDOnly = new Date(minDateTime);
                    minDOnly.setHours(0, 0, 0, 0);

                    if (selDateOnly.getTime() === minDOnly.getTime()) {
                      const match = timeSlot.match(/(\d+):(\d+)\s(AM|PM)/);
                      if (match) {
                        let h = parseInt(match[1]);
                        const m = parseInt(match[2]);
                        const isPM = match[3] === "PM";
                        if (isPM && h !== 12) h += 12;
                        if (!isPM && h === 12) h = 0;
                        const tDate = new Date(selectedDate || new Date());
                        tDate.setHours(h, m, 0, 0);
                        if (tDate.getTime() <= minDateTime.getTime()) {
                          isTimeDisabled = true;
                        }
                      }
                    } else if (selDateOnly.getTime() < minDOnly.getTime()) {
                      isTimeDisabled = true;
                    }
                  }

                  return (
                    <button
                      key={timeSlot}
                      type="button"
                      disabled={isTimeDisabled}
                      onClick={() => {
                        if (!isTimeDisabled) {
                          setSelectedTime(timeSlot);
                          setIsOpen(false);
                        }
                      }}
                      className={cn(
                        "flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all snap-start",
                        isTimeDisabled
                          ? "bg-[#F6F2EA]/50 text-[#8B7280]/40 cursor-not-allowed"
                          : selectedTime === timeSlot
                            ? "bg-[#1E5BD7] text-white shadow-md font-bold"
                            : "bg-[#F6F2EA] text-[#0A2E6D] hover:bg-[#E5E5E5]",
                      )}
                    >
                      {timeSlot}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export const RideBookingForm = React.forwardRef<
  HTMLDivElement,
  RideBookingFormProps
>(({ className, onSearch }, ref) => {
  const t = useTranslations("RideBookingForm");
  const tBookNow = useTranslations("BookNow");

  const [pickup, setPickup] = React.useState("");
  const [pickupResults, setPickupResults] = React.useState<GooglePrediction[]>(
    [],
  );
  const [pickupSelected, setPickupSelected] =
    React.useState<GooglePrediction | null>(null);
  const [pickupFocused, setPickupFocused] = React.useState(false);
  const [pickupLoading, setPickupLoading] = React.useState(false);

  const [dropoff, setDropoff] = React.useState("");
  const [dropoffResults, setDropoffResults] = React.useState<
    GooglePrediction[]
  >([]);
  const [dropoffSelected, setDropoffSelected] =
    React.useState<GooglePrediction | null>(null);
  const [dropoffFocused, setDropoffFocused] = React.useState(false);
  const [dropoffLoading, setDropoffLoading] = React.useState(false);

  const [pickupDate, setPickupDate] = React.useState<Date | null>(null);
  const [pickupTime, setPickupTime] = React.useState("12:00 PM");
  const [showPickupDatePicker, setShowPickupDatePicker] = React.useState(false);

  const [deliveryDate, setDeliveryDate] = React.useState<Date | null>(null);
  const [deliveryTime, setDeliveryTime] = React.useState("04:00 PM");
  const [showDeliveryDatePicker, setShowDeliveryDatePicker] =
    React.useState(false);
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
    const dubaiTime = getDubaiTime();
    setPickupDate(dubaiTime);
    const later = new Date(dubaiTime.getTime() + 4 * 60 * 60 * 1000);
    setDeliveryDate(
      new Date(later.getFullYear(), later.getMonth(), later.getDate()),
    );

    const h = later.getHours();
    const period = h >= 12 ? "PM" : "AM";
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    setDeliveryTime(`${hour.toString().padStart(2, "0")}:00 ${period}`);
  }, []);

  // After this point, pickupDate and deliveryDate are handled safely
  const safePickupDate = React.useMemo(
    () => pickupDate || (hasMounted ? new Date() : null),
    [pickupDate, hasMounted],
  );
  const safeDeliveryDate = React.useMemo(
    () => deliveryDate || (hasMounted ? new Date() : null),
    [deliveryDate, hasMounted],
  );

  const pickupDateTime = React.useMemo(() => {
    if (!safePickupDate) return new Date();
    const match = pickupTime.match(/(\d+):(\d+)\s(AM|PM)/);
    if (!match) return safePickupDate;
    let h = parseInt(match[1]);
    const m = parseInt(match[2]);
    const isPM = match[3] === "PM";
    if (isPM && h !== 12) h += 12;
    if (!isPM && h === 12) h = 0;

    const dt = new Date(safePickupDate);
    dt.setHours(h, m, 0, 0);
    return dt;
  }, [safePickupDate, pickupTime]);

  React.useEffect(() => {
    const match = deliveryTime.match(/(\d+):(\d+)\s(AM|PM)/);
    let dh = 0,
      dm = 0;
    if (match) {
      dh = parseInt(match[1]);
      dm = parseInt(match[2]);
      if (match[3] === "PM" && dh !== 12) dh += 12;
      if (match[3] === "AM" && dh === 12) dh = 0;
    }
    if (!safeDeliveryDate) return;
    const ddt = new Date(safeDeliveryDate);
    ddt.setHours(dh, dm, 0, 0);

    if (ddt.getTime() <= pickupDateTime.getTime()) {
      const newDDT = new Date(pickupDateTime.getTime() + 60 * 60 * 1000); // +1 hour minimum
      setDeliveryDate(
        new Date(newDDT.getFullYear(), newDDT.getMonth(), newDDT.getDate()),
      );

      let h = newDDT.getHours();
      let m = newDDT.getMinutes();
      m = m <= 30 ? 30 : 0;
      if (m === 0) h += 1;

      const period = h >= 12 ? "PM" : "AM";
      const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
      setDeliveryTime(
        `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")} ${period}`,
      );
    }
  }, [pickupDateTime, safeDeliveryDate, deliveryTime]);

  const [activeMapPreview, setActiveMapPreview] = React.useState<{
    lat: string;
    lon: string;
    display_name: string;
  } | null>(null);

  React.useEffect(() => {
    const search = async () => {
      if (
        !pickup ||
        pickup.length < 2 ||
        pickupSelected?.description === pickup
      ) {
        setPickupResults([]);
        return;
      }
      setPickupLoading(true);
      try {
        const res = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(pickup)}`,
        );
        const data = await res.json();
        setPickupResults(data.predictions || []);
      } catch {
      } finally {
        setPickupLoading(false);
      }
    };
    const tid = setTimeout(search, 300);
    return () => clearTimeout(tid);
  }, [pickup, pickupSelected]);

  React.useEffect(() => {
    const search = async () => {
      if (
        !dropoff ||
        dropoff.length < 2 ||
        dropoffSelected?.description === dropoff
      ) {
        setDropoffResults([]);
        return;
      }
      setDropoffLoading(true);
      try {
        const res = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(dropoff)}`,
        );
        const data = await res.json();
        setDropoffResults(data.predictions || []);
      } catch {
      } finally {
        setDropoffLoading(false);
      }
    };
    const tid = setTimeout(search, 300);
    return () => clearTimeout(tid);
  }, [dropoff, dropoffSelected]);

  const selectPickup = async (loc: GooglePrediction) => {
    const mainText =
      loc.structured_formatting?.main_text || loc.description.split(",")[0];
    setPickupSelected(loc);
    setPickup(mainText);
    try {
      const res = await fetch(`/api/places/details?place_id=${loc.place_id}`);
      const data = await res.json();
      if (data.lat && data.lon) {
        setActiveMapPreview({
          lat: data.lat.toString(),
          lon: data.lon.toString(),
          display_name: mainText,
        });
      }
    } catch {
      /* ignore */
    }
  };

  const selectDropoff = async (loc: GooglePrediction) => {
    const mainText =
      loc.structured_formatting?.main_text || loc.description.split(",")[0];
    setDropoffSelected(loc);
    setDropoff(mainText);
    try {
      const res = await fetch(`/api/places/details?place_id=${loc.place_id}`);
      const data = await res.json();
      if (data.lat && data.lon) {
        setActiveMapPreview({
          lat: data.lat.toString(),
          lon: data.lon.toString(),
          display_name: mainText,
        });
      }
    } catch {
      /* ignore */
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!safePickupDate || !safeDeliveryDate) return;
    onSearch({
      pickup,
      dropoff,
      date: formatAppleDate(safePickupDate),
      time: pickupTime,
      pickupDate: formatAppleDate(safePickupDate),
      pickupTime,
      deliveryDate: formatAppleDate(safeDeliveryDate),
      deliveryTime,
    });
  };

  const formRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowPickupDatePicker(false);
        setShowDeliveryDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!hasMounted || !pickupDate || !deliveryDate)
    return (
      <div className="min-h-[520px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0A2E6D] animate-spin" />
      </div>
    );

  return (
    <div
      className={cn("w-full max-w-3xl mx-auto", className)}
      ref={ref}
    >
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-[0_4px_40px_rgba(10,46,109,0.08)] border border-[#E5E5E5] min-h-[520px] relative overflow-visible"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Left Side: Booking Form */}
        <div
          className="p-8 sm:p-10 relative z-[40] flex flex-col h-full justify-center"
          ref={formRef}
        >
          <div className="mb-6">
            <h2 className="text-3xl lg:text-[2.5rem] font-bold text-[#0A2E6D] leading-[1.1] tracking-tight mb-2">
              {t("title")}
            </h2>
            <p className="text-[#8B7280] font-medium text-lg">
              {t("subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Block-style Inputs matching App Screen Mockup */}
            <div className="flex flex-col gap-4">
              {/* PICKUP */}
              <div className="relative flex flex-col w-full z-[40] group">
                <div className="w-full relative bg-[#F7F5F0] rounded-2xl px-5 py-3.5 border border-transparent focus-within:bg-white focus-within:border-[#1E5BD7] focus-within:shadow-[0_0_0_4px_rgba(30,91,215,0.1)] transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 transition-all duration-300 group-focus-within:bg-[#1E5BD7] group-focus-within:text-white group-focus-within:shadow-[0_0_15px_rgba(30,91,215,0.4)]">
                      <MapPin className="w-5 h-5 text-[#0A2E6D] group-focus-within:text-white transition-all duration-300 group-focus-within:scale-110" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-h-[48px]">
                      <label className="text-[13px] font-bold text-[#0A2E6D] mb-0.5 block uppercase tracking-wider">
                        {t("pickupLabel")}
                      </label>
                      <input
                        type="text"
                        placeholder={t("pickupPlaceholder")}
                        value={pickup}
                        onChange={(e) => {
                          setPickup(e.target.value);
                          setPickupSelected(null);
                        }}
                        onFocus={() => setPickupFocused(true)}
                        onBlur={() =>
                          setTimeout(() => setPickupFocused(false), 200)
                        }
                        className="w-full text-[15px] font-medium text-[#8B7280] focus:text-[#0A2E6D] focus:outline-none bg-transparent placeholder-[#8B7280]/60 leading-tight"
                        aria-label="Pickup location"
                      />
                    </div>
                    {pickupLoading && (
                      <Loader2 className="h-5 w-5 text-[#8B7280] animate-spin flex-shrink-0" />
                    )}
                    {pickupSelected && !pickupLoading && (
                      <CheckCircle2 className="h-5 w-5 text-[#1E5BD7] flex-shrink-0" />
                    )}
                  </div>

                  <AnimatePresence>
                    {pickupFocused &&
                      pickup.length >= 2 &&
                      !pickupSelected &&
                      pickupResults.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white border border-[#E5E5E5] rounded-xl shadow-[0_20px_50px_rgba(10,46,109,0.2)] z-[100] py-2"
                        >
                          {pickupResults.map((loc) => {
                            const mainText =
                              loc.structured_formatting?.main_text ||
                              loc.description.split(",")[0];
                            const subtitle =
                              loc.structured_formatting?.secondary_text ||
                              loc.description.split(",").slice(1).join(",");
                            return (
                              <div
                                key={loc.place_id}
                                onClick={() => selectPickup(loc)}
                                className="px-5 py-3 hover:bg-[#F6F2EA] cursor-pointer flex items-center transition-colors"
                              >
                                <div className="w-8 h-8 rounded-full bg-[#F6F2EA] flex items-center justify-center mr-3 flex-shrink-0">
                                  <MapPin className="w-4 h-4 text-[#0A2E6D]" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm text-[#0A2E6D] font-bold truncate">
                                    {mainText}
                                  </span>
                                  {subtitle && (
                                    <span className="text-xs text-[#8B7280] truncate">
                                      {subtitle}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>
              </div>

              {/* DELIVERY */}
              <div className="relative flex flex-col w-full z-[30] group">
                <div className="w-full relative bg-[#F7F5F0] rounded-2xl px-5 py-3.5 border border-transparent focus-within:bg-white focus-within:border-[#1E5BD7] focus-within:shadow-[0_0_0_4px_rgba(30,91,215,0.1)] transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0 transition-all duration-300 group-focus-within:bg-[#1E5BD7] group-focus-within:text-white group-focus-within:shadow-[0_0_15px_rgba(30,91,215,0.4)]">
                      <Navigation2 className="w-5 h-5 text-[#0A2E6D] group-focus-within:text-white transition-all duration-300 group-focus-within:scale-110" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center min-h-[48px]">
                      <label className="text-[13px] font-bold text-[#0A2E6D] mb-0.5 block uppercase tracking-wider">
                        {t("deliveryLabel")}
                      </label>
                      <input
                        type="text"
                        placeholder={t("deliveryPlaceholder")}
                        value={dropoff}
                        onChange={(e) => {
                          setDropoff(e.target.value);
                          setDropoffSelected(null);
                        }}
                        onFocus={() => setDropoffFocused(true)}
                        onBlur={() =>
                          setTimeout(() => setDropoffFocused(false), 200)
                        }
                        className="w-full text-[15px] font-medium text-[#8B7280] focus:text-[#0A2E6D] focus:outline-none bg-transparent placeholder-[#8B7280]/60 leading-tight"
                        aria-label="Delivery location"
                      />
                    </div>
                    {dropoffLoading && (
                      <Loader2 className="h-5 w-5 text-[#8B7280] animate-spin flex-shrink-0" />
                    )}
                    {dropoffSelected && !dropoffLoading && (
                      <CheckCircle2 className="h-5 w-5 text-[#1E5BD7] flex-shrink-0" />
                    )}
                  </div>

                  <AnimatePresence>
                    {dropoffFocused &&
                      dropoff.length >= 2 &&
                      !dropoffSelected &&
                      dropoffResults.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white border border-[#E5E5E5] rounded-xl shadow-[0_20px_50px_rgba(10,46,109,0.2)] z-[100] py-2"
                        >
                          {dropoffResults.map((loc) => {
                            const mainText =
                              loc.structured_formatting?.main_text ||
                              loc.description.split(",")[0];
                            const subtitle =
                              loc.structured_formatting?.secondary_text ||
                              loc.description.split(",").slice(1).join(",");
                            return (
                              <div
                                key={loc.place_id}
                                onClick={() => selectDropoff(loc)}
                                className="px-5 py-3 hover:bg-[#F6F2EA] cursor-pointer flex items-center transition-colors"
                              >
                                <div className="w-8 h-8 rounded-full bg-[#F6F2EA] flex items-center justify-center mr-3 flex-shrink-0">
                                  <MapPin className="w-4 h-4 text-[#0A2E6D]" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm text-[#0A2E6D] font-bold truncate">
                                    {mainText}
                                  </span>
                                  {subtitle && (
                                    <span className="text-xs text-[#8B7280] truncate">
                                      {subtitle}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Pick-up Date + Time */}
              <DateTimePicker
                label={t("pickupDateTime")}
                isOpen={showPickupDatePicker}
                setIsOpen={setShowPickupDatePicker}
                selectedDate={safePickupDate}
                setSelectedDate={setPickupDate}
                selectedTime={pickupTime}
                setSelectedTime={setPickupTime}
              />

              {/* Delivery Date + Time */}
              <DateTimePicker
                label={t("deliveryDateTime")}
                isOpen={showDeliveryDatePicker}
                setIsOpen={setShowDeliveryDatePicker}
                selectedDate={safeDeliveryDate}
                setSelectedDate={setDeliveryDate}
                selectedTime={deliveryTime}
                setSelectedTime={setDeliveryTime}
                minDateTime={pickupDateTime}
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 h-14 rounded-full text-[15px] font-bold transition-all bg-[#0A2E6D] text-white hover:bg-[#0A2E6D]/90 active:scale-[0.98] shadow-md duration-200"
              >
                {t("continue")}
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Map */}
        <div className="hidden lg:block relative w-full h-full bg-[#F6F2EA] overflow-hidden rounded-r-2xl">
          <iframe
            key={
              pickupSelected && dropoffSelected
                ? `${pickupSelected.description}-${dropoffSelected.description}`
                : activeMapPreview
                  ? `${activeMapPreview.lat},${activeMapPreview.lon}`
                  : "dubai-default"
            }
            className="absolute inset-0 w-full h-full"
            style={{
              border: 0,
              top: "-130px",
              left: "-10px",
              width: "calc(100% + 20px)",
              height: "calc(100% + 260px)"
            }}
            loading="lazy"
            title="Google Maps - Location Preview"
            src={(() => {
              const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
              if (pickupSelected &&
                dropoffSelected &&
                pickupSelected.description &&
                dropoffSelected.description &&
                apiKey &&
                !pickupSelected.description.includes('[object Object]') &&
                !dropoffSelected.description.includes('[object Object]')) {
                return `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${encodeURIComponent(pickupSelected.description)}&destination=${encodeURIComponent(dropoffSelected.description)}&mode=driving`;
              }
              if (activeMapPreview &&
                activeMapPreview.display_name &&
                apiKey &&
                !activeMapPreview.display_name.includes('[object Object]')) {
                return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(activeMapPreview.display_name)}&zoom=15`;
              }
              if (apiKey) {
                return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Dubai,UAE&zoom=12`;
              }
              return `https://maps.google.com/maps?q=25.2048,55.2708&t=&z=12&ie=UTF8&iwloc=&output=embed`;
            })()}
          />

          {/* Top Gradient Bar for custom UI (Google UI is cropped out via negative top) */}
          <div
            className="absolute top-0 left-0 right-0 h-[140px] z-30 pointer-events-none flex flex-col justify-start px-6 pt-6"
            style={{ background: 'linear-gradient(to bottom, rgba(10, 46, 109, 0.9) 0%, rgba(10, 46, 109, 0.6) 50%, transparent 100%)' }}
          >
            {pickupSelected &&
              dropoffSelected &&
              pickupSelected.description &&
              dropoffSelected.description &&
              !pickupSelected.description.includes('[object Object]') ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-emerald-500/20 self-start px-2 py-0.5 rounded-full border border-emerald-500/30 mb-1">
                  <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-[8px] font-bold uppercase tracking-wider">Optimized Route</span>
                </div>
                <div className="flex flex-col gap-1.5 text-white text-[13px] font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                    <span className="truncate max-w-[240px]">{pickupSelected.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-[#1E5BD7] flex-shrink-0" />
                    <span className="truncate max-w-[240px]">{dropoffSelected.description}</span>
                  </div>
                </div>
              </div>
            ) : activeMapPreview && activeMapPreview.display_name && !activeMapPreview.display_name.includes('[object Object]') ? (
              <div className="flex flex-col gap-1.5">
                <p className="text-white/40 font-bold text-[9px] uppercase tracking-widest mb-0.5">Location Preview</p>
                <div className="flex items-center gap-2 text-white text-[13px] font-medium">
                  <MapPin className="w-3 h-3 text-[#1E5BD7] flex-shrink-0" />
                  <span className="truncate max-w-[300px]">{activeMapPreview.display_name}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <p className="text-white/40 font-bold text-[9px] uppercase tracking-widest mb-0.5">Yallah Baggage</p>
                <div className="flex items-center gap-2 text-white text-[13px] font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1E5BD7] flex-shrink-0 animate-pulse" />
                  <span>Select locations to see route</span>
                </div>
              </div>
            )}
          </div>

          <AnimatePresence>
            {activeMapPreview && !(pickupSelected && dropoffSelected) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-5 inset-x-0 flex justify-center z-20"
              >
                <div className="bg-white/95 backdrop-blur-md border border-[#E5E5E5] px-4 py-2.5 rounded-full flex items-center gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
                  <CheckCircle2 className="w-4 h-4 text-[#1E5BD7]" />
                  <span className="text-[#0A2E6D] text-sm font-bold tracking-tight">
                    {activeMapPreview.display_name.split(", ")[0]}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!activeMapPreview && !(pickupSelected && dropoffSelected) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-5 inset-x-0 flex justify-center z-20"
              >
                <div className="bg-white/90 backdrop-blur-sm border border-[#E5E5E5] px-4 py-2 rounded-lg flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#1E5BD7]" />
                  <span className="text-[#0A2E6D] text-xs font-semibold tracking-wide uppercase">
                    {tBookNow("dubaiUAE")}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
});

RideBookingForm.displayName = "RideBookingForm";
