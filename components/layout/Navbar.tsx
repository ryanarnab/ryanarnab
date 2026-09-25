"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link
            href="/"
            onClick={() => scrollToSection("hero")}
            className="group flex items-center gap-3 text-sm font-medium tracking-tight text-white transition hover:opacity-90 focus:outline-none"
            aria-label="Ryan Arnab Home"
          >
            {/* BRAND LOGO SVG */}
            <div className="relative flex items-center justify-center h-8 w-8 rounded-lg bg-[#ffd900]/10 border border-[#ffd900]/30 p-1.5 transition-all duration-300 group-hover:scale-105 group-hover:bg-[#ffd900]/20 group-hover:border-[#ffd900] group-hover:shadow-[0_0_16px_rgba(255,217,0,0.5)]">
              <Image src="/RyanArnab.svg" alt="RyanArnab Logo" width={24} height={24} className="h-full w-full object-contain" />
            </div>

            <div className="flex flex-col">
              <span className="font-bold tracking-[-0.03em] text-[#fffdf0] text-base leading-none group-hover:text-[#ffd900] transition-colors">ryanarnab</span>
              <span className="text-[9px] font-mono tracking-[0.16em] uppercase text-[#ffd900]/70 leading-tight">Design & Tech</span>
            </div>
          </Link>

          {/* TELEMETRY BADGE */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-white/10 text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
            <Radio size={11} className="text-[#ffd900] animate-pulse" />
            <span className="text-[#ffd900]">ORBITAL SECTOR</span>
            <span className="text-white/20">·</span>
            <span>26.14°N 91.73°E</span>
            <span className="text-white/20">·</span>
            <span>{time || "ORBITAL DECK"}</span>
          </div>
        </div>

        {/* NAVIGATION PILL */}
        <nav className="pointer-events-auto">
          <ul className="flex items-center gap-1 sm:gap-2 rounded-full border border-[#ffd900]/20 bg-black/80 px-3 sm:px-4 py-1.5 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.7)] text-xs sm:text-sm">
            <li>
              <Link
                href="/"
                onClick={() => scrollToSection("hero")}
                className={`px-2.5 sm:px-3 py-1 rounded-full transition-all ${
                  pathname === "/"
                    ? "bg-[#ffd900]/20 text-[#ffd900] font-semibold shadow-[0_0_14px_rgba(255,217,0,0.35)]"
                    : "text-white/70 hover:text-[#fffdf0] hover:bg-white/5"
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
                    ? "bg-[#ffd900]/20 text-[#ffd900] font-semibold shadow-[0_0_14px_rgba(255,217,0,0.35)]"
                    : "text-white/70 hover:text-[#fffdf0] hover:bg-white/5"
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
                    ? "bg-[#ffd900]/20 text-[#ffd900] font-semibold shadow-[0_0_14px_rgba(255,217,0,0.35)]"
                    : "text-white/70 hover:text-[#fffdf0] hover:bg-white/5"
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
                    ? "bg-[#ffd900]/20 text-[#ffd900] font-semibold shadow-[0_0_14px_rgba(255,217,0,0.35)]"
                    : "text-white/70 hover:text-[#fffdf0] hover:bg-white/5"
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
              className="group flex items-center gap-2 rounded-full border border-[#ffd900]/40 bg-[#ffd900]/10 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#ffd900] backdrop-blur-md transition hover:border-[#ffd900] hover:bg-[#ffd900]/25 hover:text-white hover:shadow-[0_0_20px_rgba(255,217,0,0.45)]"
            >
              <span className="hidden sm:inline">Transmit</span>
              <span>Let&apos;s talk</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 text-[#ffd900]">→</span>
            </button>
          ) : (
            <Link
              href="/#contact"
              className="group flex items-center gap-2 rounded-full border border-[#ffd900]/40 bg-[#ffd900]/10 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#ffd900] backdrop-blur-md transition hover:border-[#ffd900] hover:bg-[#ffd900]/25 hover:text-white hover:shadow-[0_0_20px_rgba(255,217,0,0.45)]"
            >
              <span className="hidden sm:inline">Transmit</span>
              <span>Let&apos;s talk</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5 text-[#ffd900]">→</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}