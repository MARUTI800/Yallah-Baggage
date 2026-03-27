"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; 
import { MapPin, Navigation, Navigation2, Calendar, Clock, Loader2, CheckCircle2 } from "lucide-react";

interface RideBookingFormProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  city?: string;
  onSearch: (details: {
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
  }) => void;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
}

const generateDates = () => {
  const dates = [];
  const now = new Date();
  for(let i=0; i<14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      dates.push(d);
  }
  return dates;
};

const generateTimes = () => {
  const times = [];
  for(let h=8; h<=22; h++) {
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h > 12 ? h - 12 : h;
    times.push(`${hour.toString().padStart(2, '0')}:00 ${period}`);
    times.push(`${hour.toString().padStart(2, '0')}:30 ${period}`);
  }
  return times;
};

const formatAppleDate = (d: Date) => {
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

export const RideBookingForm = React.forwardRef<HTMLDivElement, RideBookingFormProps>(
  ({ className, imageUrl, city = "Dubai, UAE", onSearch, ...props }, ref) => {
    
    const [pickup, setPickup] = React.useState("");
    const [pickupResults, setPickupResults] = React.useState<NominatimResult[]>([]);
    const [pickupSelected, setPickupSelected] = React.useState<NominatimResult | null>(null);
    const [pickupFocused, setPickupFocused] = React.useState(false);
    const [pickupLoading, setPickupLoading] = React.useState(false);

    const [dropoff, setDropoff] = React.useState("");
    const [dropoffResults, setDropoffResults] = React.useState<NominatimResult[]>([]);
    const [dropoffSelected, setDropoffSelected] = React.useState<NominatimResult | null>(null);
    const [dropoffFocused, setDropoffFocused] = React.useState(false);
    const [dropoffLoading, setDropoffLoading] = React.useState(false);

    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
    const [selectedTime, setSelectedTime] = React.useState("12:00 PM");
    const [showDatePicker, setShowDatePicker] = React.useState(false);
    const [showTimePicker, setShowTimePicker] = React.useState(false);
    
    const availableDates = React.useMemo(() => generateDates(), []);
    const availableTimes = React.useMemo(() => generateTimes(), []);

    const [activeMapPreview, setActiveMapPreview] = React.useState<NominatimResult | null>(null);

    React.useEffect(() => {
      const search = async () => {
        if (!pickup || pickup.length < 3 || pickupSelected?.display_name === pickup) {
          setPickupResults([]);
          return;
        }
        setPickupLoading(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pickup)}&format=json&limit=6`);
          const data = await res.json();
          setPickupResults(data);
        } catch (e) {} finally { setPickupLoading(false); }
      };
      const tid = setTimeout(search, 300);
      return () => clearTimeout(tid);
    }, [pickup, pickupSelected]);

    React.useEffect(() => {
      const search = async () => {
        if (!dropoff || dropoff.length < 3 || dropoffSelected?.display_name === dropoff) {
          setDropoffResults([]);
          return;
        }
        setDropoffLoading(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(dropoff)}&format=json&limit=6`);
          const data = await res.json();
          setDropoffResults(data);
        } catch (e) {} finally { setDropoffLoading(false); }
      };
      const tid = setTimeout(search, 300);
      return () => clearTimeout(tid);
    }, [dropoff, dropoffSelected]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch({ pickup, dropoff, date: formatAppleDate(selectedDate), time: selectedTime });
    };
    
    const formRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(event.target as Node)) {
          setShowDatePicker(false);
          setShowTimePicker(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const containerVariants: any = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
    };

    return (
      <div className={cn("w-full max-w-6xl mx-auto md:p-4 font-inter", className)} ref={ref} {...props}>
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 bg-[#080808] rounded-[2rem] lg:rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)] border border-white/10 overflow-hidden min-h-[560px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side: Booking Form */}
          <div className="p-8 sm:p-12 relative z-20 flex flex-col h-full justify-center" ref={formRef}>
            
            <div className="mb-8">
              <h2 className="text-[3rem] lg:text-[3.5rem] font-bold text-white leading-[0.95] tracking-tighter mb-2 selection:bg-orange-500 selection:text-white">
                Book a transfer.
              </h2>
              <p className="text-white/50 font-medium text-lg tracking-tight">Secure. Hands-free. Direct.</p>
            </div>

             <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="relative">
                {/* PICKUP */}
                <div className="relative flex flex-col w-full z-30 group mb-4">
                  <div className="w-full relative bg-white/5 hover:bg-white/10 rounded-[1.25rem] px-5 py-3.5 border border-transparent focus-within:bg-[#111] focus-within:border-white/20 transition-all duration-300 ease-out">
                    <label className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-1 block group-focus-within:text-white transition-colors">Pick up location</label>
                    <div className="flex items-center">
                       <input
                         type="text"
                         placeholder="Enter hotel or address"
                         value={pickup}
                         onChange={(e) => { setPickup(e.target.value); setPickupSelected(null); }}
                         onFocus={() => setPickupFocused(true)}
                         onBlur={() => setTimeout(() => setPickupFocused(false), 200)}
                         className="w-full text-[1.3rem] tracking-tight font-medium text-white focus:outline-none bg-transparent placeholder-white/20"
                         aria-label="Pickup location"
                       />
                       {pickupLoading && <Loader2 className="h-5 w-5 text-white/40 animate-spin absolute right-4" />}
                       {pickupSelected && !pickupLoading && <MapPin className="h-5 w-5 text-green-400 absolute right-4 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />}
                    </div>
                    
                    <AnimatePresence>
                      {pickupFocused && pickup.length >= 3 && !pickupSelected && pickupResults.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 0, scale: 0.98 }} transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }}
                          className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#161616]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-[100] py-2"
                        >
                          {pickupResults.map(loc => {
                            const name = loc.display_name.split(", ")[0];
                            const subtitle = loc.display_name.split(", ").slice(1, 3).join(", ");
                            return (
                            <div 
                              key={loc.place_id}
                              onClick={() => { setPickupSelected(loc); setPickup(name); setActiveMapPreview(loc); }}
                              className="px-5 py-3 hover:bg-white/5 cursor-pointer flex items-center transition-colors group/item"
                            >
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover/item:bg-white group-hover/item:text-black transition-colors duration-300">
                                <MapPin className="w-4 h-4 text-white/40 group-hover/item:text-black" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-base tracking-tight text-white font-medium truncate">{name}</span>
                                {subtitle && <span className="text-sm tracking-tight text-white/40 truncate">{subtitle}</span>}
                              </div>
                            </div>
                          )})}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* DROPOFF */}
                <div className="relative flex flex-col w-full z-20 group">
                  <div className="w-full relative bg-white/5 hover:bg-white/10 rounded-[1.25rem] px-5 py-3.5 border border-transparent focus-within:bg-[#111] focus-within:border-white/20 transition-all duration-300 ease-out">
                    <label className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-white/40 mb-1 block group-focus-within:text-white transition-colors">Drop off location</label>
                    <div className="flex items-center">
                       <input
                         type="text"
                         placeholder="Airport, Port, or Hotel"
                         value={dropoff}
                         onChange={(e) => { setDropoff(e.target.value); setDropoffSelected(null); }}
                         onFocus={() => setDropoffFocused(true)}
                         onBlur={() => setTimeout(() => setDropoffFocused(false), 200)}
                         className="w-full text-[1.3rem] tracking-tight font-medium text-white focus:outline-none bg-transparent placeholder-white/20"
                         aria-label="Dropoff location"
                       />
                       {dropoffLoading && <Loader2 className="h-5 w-5 text-white/40 animate-spin absolute right-4" />}
                       {dropoffSelected && !dropoffLoading && <Navigation className="h-5 w-5 text-green-400 absolute right-4 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />}
                    </div>

                    <AnimatePresence>
                      {dropoffFocused && dropoff.length >= 3 && !dropoffSelected && dropoffResults.length > 0 && (
                        <motion.div 
                           initial={{ opacity: 0, y: 5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 0, scale: 0.98 }} transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }}
                           className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#161616]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-[100] py-2"
                        >
                          {dropoffResults.map(loc => {
                            const name = loc.display_name.split(", ")[0];
                            const subtitle = loc.display_name.split(", ").slice(1, 3).join(", ");
                            return (
                            <div 
                              key={loc.place_id}
                              onClick={() => { setDropoffSelected(loc); setDropoff(name); setActiveMapPreview(loc); }}
                              className="px-5 py-3 hover:bg-white/5 cursor-pointer flex items-center transition-colors group/item"
                            >
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-4 group-hover/item:bg-white transition-colors duration-300">
                                <Navigation2 className="w-4 h-4 text-white/40 group-hover/item:text-black" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-base tracking-tight text-white font-medium truncate">{name}</span>
                                {subtitle && <span className="text-sm tracking-tight text-white/40 truncate">{subtitle}</span>}
                              </div>
                            </div>
                          )})}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Date + Time pickers */}
              <div className="grid grid-cols-2 gap-4 mt-2">
                
                {/* Date Picker */}
                <div className="relative">
                  <div 
                    onClick={() => { setShowDatePicker(!showDatePicker); setShowTimePicker(false); }}
                    className="flex flex-col justify-center bg-white/5 hover:bg-white/10 rounded-[1.25rem] px-5 py-3 border border-transparent transition-colors group cursor-pointer h-[4.5rem]"
                  >
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-0.5 group-hover:text-white transition-colors">Date</span>
                    <div className="flex items-center justify-between text-white font-medium text-lg w-full tracking-tight">
                       <span>{formatAppleDate(selectedDate)}</span>
                       <Calendar className="w-4 h-4 text-white/50" />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {showDatePicker && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-full mb-3 left-0 w-[280px] bg-[#161616]/90 backdrop-blur-2xl border border-white/10 p-4 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
                      >
                         <div className="text-sm font-bold text-white mb-3 ml-2 tracking-tight">Select Date</div>
                         <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-2 scrollbar-hide">
                           {availableDates.map((dateObj, idx) => (
                             <div 
                               key={idx} 
                               onClick={() => { setSelectedDate(dateObj); setShowDatePicker(false); }}
                               className={cn(
                                 "px-4 py-3 rounded-xl cursor-pointer text-sm font-medium tracking-tight transition-all",
                                 dateObj.getTime() === selectedDate.getTime() 
                                   ? "bg-white text-black font-bold shadow-md"
                                   : "hover:bg-white/10 text-white"
                               )}
                             >
                               {formatAppleDate(dateObj)}
                             </div>
                           ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Time Picker */}
                <div className="relative">
                  <div 
                    onClick={() => { setShowTimePicker(!showTimePicker); setShowDatePicker(false); }}
                    className="flex flex-col justify-center bg-white/5 hover:bg-white/10 rounded-[1.25rem] px-5 py-3 border border-transparent transition-colors group cursor-pointer h-[4.5rem]"
                  >
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-0.5 group-hover:text-white transition-colors">Time</span>
                    <div className="flex items-center justify-between text-white font-medium text-lg w-full tracking-tight">
                       <span>{selectedTime}</span>
                       <Clock className="w-4 h-4 text-white/50" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {showTimePicker && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute bottom-full mb-3 right-0 w-[200px] bg-[#161616]/90 backdrop-blur-2xl border border-white/10 p-4 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
                      >
                         <div className="text-sm font-bold text-white mb-3 ml-2 tracking-tight">Select Time</div>
                         <div className="grid grid-cols-1 gap-1 max-h-[220px] overflow-y-auto pr-2 scrollbar-hide">
                           {availableTimes.map((t, idx) => (
                             <div 
                               key={idx} 
                               onClick={() => { setSelectedTime(t); setShowTimePicker(false); }}
                               className={cn(
                                 "px-4 py-2.5 rounded-xl cursor-pointer text-sm font-medium tracking-tight transition-all text-center",
                                 t === selectedTime 
                                   ? "bg-white text-black font-bold shadow-md"
                                   : "hover:bg-white/10 text-white"
                               )}
                             >
                               {t}
                             </div>
                           ))}
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-8 h-16 rounded-[1.25rem] text-[1.15rem] font-bold tracking-tight transition-all bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-black shadow-[0_15px_45px_-10px_rgba(249,115,22,0.6)] hover:shadow-[0_20px_60px_-10px_rgba(249,115,22,0.8)] active:scale-[0.98] duration-500"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Live Map — defaults to Dubai, updates on location select */}
          <div className="hidden lg:block relative w-full h-full bg-[#0a0a0a] overflow-hidden">
            <iframe
              key={activeMapPreview ? `${activeMapPreview.lat},${activeMapPreview.lon}` : "dubai-default"}
              className="absolute inset-0 w-full h-full mix-blend-screen opacity-80 contrast-125 grayscale-[30%] transition-opacity duration-700"
              style={{ border: 0 }}
              loading="lazy"
              src={
                activeMapPreview
                  ? `https://maps.google.com/maps?q=${activeMapPreview.lat},${activeMapPreview.lon}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                  : `https://maps.google.com/maps?q=25.2048,55.2708&t=&z=12&ie=UTF8&iwloc=&output=embed`
              }
            />
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />

            <AnimatePresence>
              {activeMapPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-6 inset-x-0 flex justify-center z-20"
                >
                  <div className="bg-black/70 backdrop-blur-xl border border-white/10 px-5 py-3 rounded-full flex items-center gap-2 shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
                    <CheckCircle2 className="w-4 h-4 text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                    <span className="text-white text-sm font-semibold tracking-tight">
                      {activeMapPreview.display_name.split(", ")[0]}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {!activeMapPreview && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute bottom-6 inset-x-0 flex justify-center z-20"
                >
                  <div className="bg-black/50 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-white/50" />
                    <span className="text-white/50 text-xs font-medium tracking-widest uppercase">Dubai, UAE</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    );
  }
);

RideBookingForm.displayName = "RideBookingForm";
