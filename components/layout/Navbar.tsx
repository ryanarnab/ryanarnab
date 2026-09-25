"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Radio } from "lucide-react";

export default function Navbar() {
  const [time, setTime] = useState<string>("");
  const [scrolled, setScrolled] = useState<boolean>(false);
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

  // Show navbar only after scrolling past the hero section
  useEffect(() => {
    const handleScroll = () => {
      const threshold = (window.innerHeight || 800) * 0.35;
      setScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavClick = (e: React.MouseEvent, sectionId: string, href: string) => {
    if (pathname === "/") {
      e.preventDefault();
      scrollToSection(sectionId);
    }
  };

  const isVisible = pathname !== "/" || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pt-6 sm:pt-8 md:pt-10 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-10"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 sm:px-12 md:px-16 py-2">
        
        {/* LOGO & MARS TELEMETRY */}
        <div className={`flex items-center gap-5 ${isVisible ? "pointer-events-auto" : "pointer-events-none"}`}>
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                scrollToSection("hero");
              }
            }}
            className="group flex items-center gap-3.5 text-sm font-medium tracking-tight text-white transition hover:opacity-90 focus:outline-none"
            aria-label="Ryan Arnab Home"
          >
            {/* BRAND LOGO SVG */}
            <div className="relative flex items-center justify-center h-10 w-10 rounded-xl liquid-glass p-2 transition-all duration-300 group-hover:scale-105 group-hover:border-white/40">
              <Image src="/RyanArnab.svg" alt="RyanArnab Logo" width={24} height={24} className="h-full w-full object-contain" />
            </div>

            <div className="flex flex-col">
              <span className="font-bold tracking-[-0.03em] text-[#fffdf0] text-base leading-none group-hover:text-[#ffd900] transition-colors">ryanarnab</span>
              <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-white/50 leading-tight mt-1">Design & Tech</span>
            </div>
          </Link>

          {/* TELEMETRY BADGE */}
          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-white/10 text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
            <Radio size={11} className="text-[#ffd900] animate-pulse" />
            <span className="text-[#ffd900]">ORBITAL</span>
            <span className="text-white/20">·</span>
            <span>26.14°N 91.73°E</span>
            <span className="text-white/20">·</span>
            <span>{time || "ORBITAL DECK"}</span>
          </div>
        </div>

        {/* NAVIGATION PILL (Liquid Glass Floating Dock with Comfortable Space) */}
        <nav className={isVisible ? "pointer-events-auto" : "pointer-events-none"}>
          <ul className="flex items-center gap-2 sm:gap-2.5 rounded-full liquid-glass p-2 sm:p-2.5 text-xs sm:text-[13px] shadow-[0_16px_48px_rgba(0,0,0,0.75)]">
            <li>
              <Link
                href="/"
                onClick={(e) => handleNavClick(e, "hero", "/")}
                data-cursor-label="home ✦"
                className={`px-5 sm:px-6 py-2.5 rounded-full font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                  pathname === "/"
                    ? "liquid-metal text-white border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_16px_rgba(255,255,255,0.15)] font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  {pathname === "/" && <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] shadow-[0_0_8px_rgba(255,217,0,1)]" />}
                  Origin
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/works"
                onClick={(e) => handleNavClick(e, "work", "/works")}
                data-cursor-label="expeditions ✦"
                className={`px-5 sm:px-6 py-2.5 rounded-full font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                  pathname === "/works"
                    ? "liquid-metal text-white border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_16px_rgba(255,255,255,0.15)] font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  {pathname === "/works" && <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] shadow-[0_0_8px_rgba(255,217,0,1)]" />}
                  Works
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={(e) => handleNavClick(e, "about", "/about")}
                data-cursor-label="observatory ✦"
                className={`px-5 sm:px-6 py-2.5 rounded-full font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                  pathname === "/about"
                    ? "liquid-metal text-white border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_16px_rgba(255,255,255,0.15)] font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  {pathname === "/about" && <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] shadow-[0_0_8px_rgba(255,217,0,1)]" />}
                  Observatory
                </span>
              </Link>
            </li>
            <li>
              <Link
                href="/playground"
                onClick={(e) => handleNavClick(e, "playground", "/playground")}
                data-cursor-label="research lab 🧪"
                className={`hidden sm:inline-flex px-5 sm:px-6 py-2.5 rounded-full font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                  pathname === "/playground"
                    ? "liquid-metal text-white border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_16px_rgba(255,255,255,0.15)] font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  {pathname === "/playground" && <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] shadow-[0_0_8px_rgba(255,217,0,1)]" />}
                  Lab
                </span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* CTA (Tactile Liquid Metal Capsule) */}
        <div className={`flex justify-end ${isVisible ? "pointer-events-auto" : "pointer-events-none"}`}>
          {pathname === "/" ? (
            <button
              onClick={() => scrollToSection("contact")}
              data-cursor-label="transmit signal ⚡"
              className="tactile-switch-accent rounded-full px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2.5 cursor-pointer transition-transform group"
            >
              <span className="hidden sm:inline">Transmit</span>
              <span>Let&apos;s talk</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </button>
          ) : (
            <Link
              href="/#contact"
              data-cursor-label="transmit signal ⚡"
              className="tactile-switch-accent rounded-full px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2.5 cursor-pointer transition-transform group"
            >
              <span className="hidden sm:inline">Transmit</span>
              <span>Let&apos;s talk</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}