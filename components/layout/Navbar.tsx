"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radio } from "lucide-react";

export default function Navbar() {
  const [time, setTime] = useState<string>("");
  const pathname = usePathname();

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

  const scrollToSection = (id: string) => {
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full pointer-events-none transition-all">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 sm:px-10 py-5 sm:py-8">
        
        {/* LOGO & MARS TELEMETRY */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <Link
            href="/"
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 text-sm font-medium tracking-tight text-white transition hover:opacity-80 focus:outline-none"
            aria-label="Ryan Arnab Home"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
            <span className="font-semibold tracking-[-0.03em] text-white">ryanarnab</span>
          </Link>

          {/* TELEMETRY BADGE */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-white/10 text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
            <Radio size={11} className="text-amber-400 animate-pulse" />
            <span className="text-amber-400/80">MARS SECTOR</span>
            <span className="text-white/20">·</span>
            <span>26.14°N 91.73°E</span>
            <span className="text-white/20">·</span>
            <span>{time || "ORBITAL DECK"}</span>
          </div>
        </div>

        {/* NAVIGATION PILL */}
        <nav className="pointer-events-auto">
          <ul className="flex items-center gap-1 sm:gap-2 rounded-full border border-white/10 bg-black/75 px-3 sm:px-4 py-1.5 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.6)] text-xs sm:text-sm">
            <li>
              <Link
                href="/"
                onClick={() => scrollToSection("hero")}
                className={`px-2.5 sm:px-3 py-1 rounded-full transition-all ${
                  pathname === "/"
                    ? "bg-amber-400/15 text-amber-300 font-medium shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                Origin
              </Link>
            </li>
            <li>
              <Link
                href="/works"
                className={`px-2.5 sm:px-3 py-1 rounded-full transition-all ${
                  pathname === "/works"
                    ? "bg-amber-400/15 text-amber-300 font-medium shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                Works
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className={`px-2.5 sm:px-3 py-1 rounded-full transition-all ${
                  pathname === "/about"
                    ? "bg-amber-400/15 text-amber-300 font-medium shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                Observatory
              </Link>
            </li>
            <li>
              <Link
                href="/playground"
                className={`hidden sm:inline-block px-2.5 sm:px-3 py-1 rounded-full transition-all ${
                  pathname === "/playground"
                    ? "bg-amber-400/15 text-amber-300 font-medium shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                Lab
              </Link>
            </li>
          </ul>
        </nav>

        {/* CTA */}
        <div className="flex justify-end pointer-events-auto">
          {pathname === "/" ? (
            <button
              onClick={() => scrollToSection("contact")}
              className="group flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-amber-200 backdrop-blur-md transition hover:border-amber-400 hover:bg-amber-500/20 hover:text-white hover:shadow-[0_0_16px_rgba(245,158,11,0.3)]"
            >
              <span className="hidden sm:inline">Transmit</span>
              <span>Let&apos;s talk</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 text-amber-400">→</span>
            </button>
          ) : (
            <Link
              href="/#contact"
              className="group flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-amber-200 backdrop-blur-md transition hover:border-amber-400 hover:bg-amber-500/20 hover:text-white hover:shadow-[0_0_16px_rgba(245,158,11,0.3)]"
            >
              <span className="hidden sm:inline">Transmit</span>
              <span>Let&apos;s talk</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 text-amber-400">→</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}