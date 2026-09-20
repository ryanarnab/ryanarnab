"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING ORBITAL SENSORS");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Check if user already saw preloader in this session
    const hasLoaded = sessionStorage.getItem("mars_preloader_seen");
    if (hasLoaded) {
      setIsComplete(true);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            sessionStorage.setItem("mars_preloader_seen", "true");
          }, 400);
          return 100;
        }

        const next = prev + Math.floor(Math.random() * 12) + 3;
        if (next > 30 && next < 60) {
          setStatusText("CALIBRATING MARS TELEMETRY");
        } else if (next >= 60 && next < 90) {
          setStatusText("ALIGNING SOLAR HORIZON");
        } else if (next >= 90) {
          setStatusText("ORBITAL LINK ESTABLISHED");
        }
        return Math.min(next, 100);
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -20,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[99999] flex flex-col justify-between bg-black p-8 sm:p-14 text-white overflow-hidden"
        >
          {/* Subtle Warm Martian Horizon Aura in Preloader */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-500/20 via-orange-600/10 to-transparent blur-3xl" />

          {/* TOP TELEMETRY */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/50">
                Mars Sector // 26.14°N 91.73°E
              </span>
            </div>
            <span className="text-[11px] font-mono tracking-widest text-amber-400/80">
              SYS.BOOT // v2.6
            </span>
          </div>

          {/* CENTER LOGO & PROGRESS */}
          <div className="my-auto max-w-[600px]">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-mono tracking-[0.25em] text-amber-400/70 mb-4"
            >
              {statusText}
            </motion.p>

            <div className="flex items-baseline gap-4">
              <h1 className="text-[clamp(64px,14vw,140px)] font-medium tracking-[-0.08em] leading-none text-white">
                {progress}
                <span className="text-amber-500/60 font-mono text-[clamp(28px,5vw,56px)]">%</span>
              </h1>
            </div>

            {/* PROGRESS BAR */}
            <div className="mt-8 h-1 w-full max-w-[320px] overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>

          {/* BOTTOM BRANDING */}
          <div className="flex items-end justify-between border-t border-white/10 pt-5 text-[11px] font-mono text-white/40">
            <span>RYAN ARNAB // COMMUNICATION DESIGN</span>
            <span className="hidden sm:inline">CURIOSITY CREATES BETTER</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
