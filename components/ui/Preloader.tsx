"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING ORBITAL SENSORS");
  const [isComplete, setIsComplete] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return Boolean(sessionStorage.getItem("mars_preloader_seen"));
    }
    return false;
  });

  useEffect(() => {
    if (isComplete) return;

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
  }, [isComplete]);

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
          className="fixed inset-0 z-[99999] flex flex-col justify-between bg-[#080808] p-8 sm:p-14 text-white overflow-hidden"
        >
          {/* Subtle Warm Horizon Aura in Preloader */}
          <div className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#ffd900]/25 via-yellow-500/10 to-transparent blur-3xl" />

          {/* TOP TELEMETRY */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-2.5">
              <Image src="/RyanArnab.svg" alt="RyanArnab" width={20} height={20} className="h-5 w-auto" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] animate-ping" />
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#fffdf0]/60">
                Orbital Sector // 26.14°N 91.73°E
              </span>
            </div>
            <span className="text-[11px] font-mono tracking-widest text-[#ffd900]">
              SYS.BOOT // v2.6
            </span>
          </div>

          {/* CENTER LOGO & PROGRESS */}
          <div className="my-auto max-w-[650px]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8 flex items-center gap-4"
            >
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-[#ffd900]/10 border border-[#ffd900]/30 p-3 shadow-[0_0_30px_rgba(255,217,0,0.3)] backdrop-blur-md relative">
                <Image src="/RyanArnab.svg" alt="RyanArnab" fill className="p-3 object-contain" />
              </div>
              <div>
                <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#ffd900]">Ryan Arnab</span>
                <p className="text-xs text-white/50 font-mono tracking-wider">Communication Designer</p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-mono tracking-[0.25em] text-[#ffd900]/80 mb-3"
            >
              {statusText}
            </motion.p>

            <div className="flex items-baseline gap-4">
              <h1 className="text-[clamp(64px,14vw,140px)] font-semibold tracking-[-0.08em] leading-none text-[#fffdf0]">
                {progress}
                <span className="text-[#ffd900] font-mono text-[clamp(28px,5vw,56px)]">%</span>
              </h1>
            </div>

            {/* PROGRESS BAR */}
            <div className="mt-8 h-1.5 w-full max-w-[360px] overflow-hidden rounded-full bg-white/10 p-[1px]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#ffd900] to-amber-300 shadow-[0_0_12px_rgba(255,217,0,0.8)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </div>

          {/* BOTTOM BRANDING */}
          <div className="flex items-end justify-between border-t border-white/10 pt-5 text-[11px] font-mono text-white/40">
            <span>RYAN ARNAB // COMMUNICATION DESIGN</span>
            <span className="hidden sm:inline text-[#ffd900]/70">CURIOSITY CREATES BETTER</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
