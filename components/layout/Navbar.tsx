"use client";

import { useEffect, useState } from "react";
import { Radio } from "lucide-react";

export default function Navbar() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full pointer-events-none transition-all">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 sm:px-10 py-5 sm:py-8">
        
        {/* LOGO & TELEMETRY */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => scrollTo("hero")}
            className="flex items-center gap-2 text-sm font-medium tracking-tight text-white transition hover:opacity-75 focus:outline-none"
            aria-label="Back to top"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/75 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="font-semibold tracking-[-0.03em]">ryanarnab</span>
          </button>

          {/* TELEMETRY BADGE (Hidden on small mobile) */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/10 text-[10px] uppercase tracking-[0.18em] text-white/40">
            <Radio size={11} className="text-white/60 animate-pulse" />
            <span>26.14°N 91.73°E</span>
            <span className="text-white/20">·</span>
            <span>{time || "ORBITAL DECK"}</span>
          </div>
        </div>

        {/* NAVIGATION PILL */}
        <nav className="pointer-events-auto">
          <ul className="flex items-center gap-1 sm:gap-2 rounded-full border border-white/10 bg-black/60 px-3 sm:px-4 py-1.5 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] text-xs sm:text-sm">
            <li>
              <button
                onClick={() => scrollTo("hero")}
                className="px-2.5 py-1 text-white/60 transition hover:text-white rounded-full hover:bg-white/5"
              >
                Origin
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollTo("work")}
                className="px-2.5 py-1 text-white/60 transition hover:text-white rounded-full hover:bg-white/5"
              >
                Works
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollTo("about")}
                className="px-2.5 py-1 text-white/60 transition hover:text-white rounded-full hover:bg-white/5"
              >
                Observatory
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollTo("playground")}
                className="hidden sm:inline-block px-2.5 py-1 text-white/60 transition hover:text-white rounded-full hover:bg-white/5"
              >
                Lab
              </button>
            </li>
          </ul>
        </nav>

        {/* CTA */}
        <div className="flex justify-end pointer-events-auto">
          <button
            onClick={() => scrollTo("contact")}
            className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white/90 backdrop-blur-md transition hover:border-white/40 hover:bg-white/10 hover:text-white"
          >
            <span className="hidden sm:inline">Transmit</span>
            <span>Let&apos;s talk</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </button>
        </div>

      </div>
    </header>
  );
}