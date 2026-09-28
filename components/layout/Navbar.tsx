"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Radio, Menu, X, ArrowUpRight, Send, Volume2, VolumeX, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollController } from "../scroll/ScrollProvider";
import { useSound } from "@/components/sound/SoundProvider";
import { triggerLightHaptic } from "@/lib/haptics";

interface NavItem {
  id: string; // Target anchor on home page
  label: string;
  code: string;
  href: string; // Target standalone route
  cursorLabel: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Origin", code: "00", href: "/", cursorLabel: "home ✦" },
  { id: "work", label: "Works", code: "01", href: "/works", cursorLabel: "expeditions ✦" },
  { id: "about", label: "Observatory", code: "02", href: "/about", cursorLabel: "observatory ✦" },
  { id: "playground", label: "Lab", code: "03", href: "/playground", cursorLabel: "research lab 🧪" },
];

export default function Navbar() {
  const [time, setTime] = useState<string>("");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { soundEnabled, toggleSound, playWarp } = useSound();
  const pathname = usePathname();
  const router = useRouter();
  const { scrollTo } = useScrollController();

  // Live UTC Telemetry Clock
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

  // Track scroll position for docked liquid-glass appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll spy on home page: track active section automatically
  useEffect(() => {
    if (pathname !== "/") {
      queueMicrotask(() => {
        if (pathname.startsWith("/works")) setActiveSection("work");
        else if (pathname.startsWith("/about")) setActiveSection("about");
        else if (pathname.startsWith("/playground")) setActiveSection("playground");
        else setActiveSection("hero");
      });
      return;
    }

    const sections = ["hero", "work", "about", "playground", "contact"];
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -45% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  // Handle URL hash on initial load (e.g. /#contact)
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash;
      const timer = setTimeout(() => {
        scrollTo(hash);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [scrollTo]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Smooth Navigation dispatcher
  const handleNavClick = useCallback(
    (e: React.MouseEvent, item: NavItem) => {
      e.preventDefault();
      setIsMobileMenuOpen(false);

      if (pathname === "/") {
        scrollTo(`#${item.id}`);
        setActiveSection(item.id);
      } else {
        if (item.id === "hero") {
          router.push("/");
        } else {
          router.push(item.href);
        }
      }
    },
    [pathname, router, scrollTo]
  );

  const handleTransmitClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsMobileMenuOpen(false);

      if (pathname === "/") {
        scrollTo("#contact");
        setActiveSection("contact");
      } else {
        router.push("/#contact");
      }
    },
    [pathname, router, scrollTo]
  );

  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      if (pathname === "/") {
        e.preventDefault();
        scrollTo("#hero");
        setActiveSection("hero");
      }
      setIsMobileMenuOpen(false);
    },
    [pathname, scrollTo]
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "pt-3 sm:pt-4"
            : "pt-5 sm:pt-7"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12">
          
          {/* 1. BRAND LOGO & TELEMETRY */}
          <div className="flex items-center gap-4 pointer-events-auto">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="group flex items-center gap-3 text-sm font-medium tracking-tight text-white transition hover:opacity-90 focus:outline-none"
              aria-label="Ryan Arnab Home"
            >
              {/* BRAND LOGO SVG */}
              <div className="relative flex items-center justify-center h-10 w-10 rounded-xl liquid-glass p-2 transition-all duration-300 group-hover:scale-105 group-hover:border-[#ffd900]/50 group-hover:shadow-[0_0_16px_rgba(255,217,0,0.3)]">
                <Image
                  src="/RyanArnab.svg"
                  alt="RyanArnab Logo"
                  width={24}
                  height={24}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>

              <div className="flex flex-col">
                <span className="font-bold tracking-[-0.03em] text-[#fffdf0] text-base leading-none group-hover:text-[#ffd900] transition-colors">
                  ryanarnab
                </span>
                <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-white/50 leading-tight mt-1">
                  Design & Tech
                </span>
              </div>
            </Link>

            {/* TELEMETRY BADGE (DESKTOP) */}
            <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-white/10 text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
              <Radio size={11} className="text-[#ffd900] animate-pulse" />
              <span className="text-[#ffd900] font-semibold">ORBITAL</span>
              <span className="text-white/20">·</span>
              <span>26.14°N 91.73°E</span>
              <span className="text-white/20">·</span>
              <span>{time || "ORBITAL DECK"}</span>
            </div>
          </div>

          {/* 2. NAVIGATION DOCK (DESKTOP) */}
          <nav className="hidden md:block pointer-events-auto">
            <ul
              className={`flex items-center gap-1.5 sm:gap-2 rounded-full p-1.5 text-xs sm:text-[13px] transition-all duration-300 ${
                scrolled
                  ? "liquid-glass shadow-[0_16px_48px_rgba(0,0,0,0.85)] border-white/20"
                  : "bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              }`}
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item)}
                      data-cursor-label={item.cursorLabel}
                      className={`relative px-5 sm:px-6 py-2 rounded-full font-mono tracking-wider transition-all duration-200 cursor-pointer select-none inline-flex items-center gap-2 ${
                        isActive
                          ? "liquid-metal text-white border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_0_16px_rgba(255,217,0,0.2)] font-semibold"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] shadow-[0_0_8px_rgba(255,217,0,1)] animate-pulse" />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 3. CTA & MOBILE TRIGGER */}
          <div className="flex items-center gap-2 sm:gap-2.5 pointer-events-auto">
            {/* Audio Toggle (Zero-Asset Procedural Soundscape) */}
            <button
              onClick={() => {
                toggleSound();
              }}
              title={soundEnabled ? "Mute Procedural Audio" : "Activate Procedural Audio"}
              className={`tactile-switch hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono transition-colors ${
                soundEnabled ? "border-[#ffd900]/50 text-[#ffd900]" : "text-white/60 hover:text-white"
              }`}
            >
              {soundEnabled ? (
                <>
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 bg-[#ffd900] h-2 animate-[pulse_0.6s_ease-in-out_infinite]" />
                    <span className="w-0.5 bg-[#ffd900] h-3 animate-[pulse_0.4s_ease-in-out_infinite_0.1s]" />
                    <span className="w-0.5 bg-[#ffd900] h-1.5 animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
                  </div>
                  <span className="text-[10px] tracking-wider">AUDIO ON</span>
                </>
              ) : (
                <>
                  <VolumeX size={13} className="text-white/40" />
                  <span className="text-[10px] tracking-wider text-white/40">AUDIO OFF</span>
                </>
              )}
            </button>


            {/* Dossier Resume Button */}
            <button
              onClick={() => {
                playWarp();
                window.dispatchEvent(new CustomEvent("trigger-dossier-open"));
              }}
              title="Open Personnel Dossier / CV"
              className="tactile-switch hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-mono text-white/70 hover:text-white hover:border-[#ffd900]/40 transition-colors"
            >
              <FileText size={12} className="text-[#ffd900]" />
              <span className="text-[10px] tracking-wider">DOSSIER</span>
            </button>

            {/* Transmit Button (Desktop & Tablet) */}
            <button
              onClick={handleTransmitClick}
              data-cursor-label="transmit signal ⚡"
              className="tactile-switch-accent rounded-full px-4 sm:px-5 py-2 sm:py-2 text-xs sm:text-xs font-semibold tracking-wide flex items-center gap-1.5 cursor-pointer transition-transform group"
            >
              <span className="hidden sm:inline">Transmit</span>
              <span>Let&apos;s talk</span>
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </button>

            {/* Mobile Hamburger Toggle (Phones & Small Screens) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
              className={`md:hidden flex h-10 w-10 items-center justify-center rounded-xl liquid-glass text-white transition-all duration-200 active:scale-95 ${
                isMobileMenuOpen
                  ? "border-[#ffd900]/80 bg-[#ffd900]/20 text-[#ffd900]"
                  : "hover:border-white/40"
              }`}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </header>

      {/* 4. FULLSCREEN MOBILE NAVIGATION OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(28px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-black/92 px-6 pt-24 pb-8 md:hidden overflow-y-auto"
          >
            {/* Top Telemetry in Drawer */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#ffd900]">
                <Radio size={12} className="animate-pulse" />
                <span>ORBITAL DECK // ONLINE</span>
              </div>
              <span className="text-[10px] font-mono text-white/50">{time}</span>
            </div>

            {/* Sector Navigation Links */}
            <nav className="my-auto py-8">
              <ul className="flex flex-col gap-4">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = activeSection === item.id;
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.06 }}
                    >
                      <button
                        onClick={(e) => handleNavClick(e, item)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 text-left ${
                          isActive
                            ? "liquid-metal border-white/30 text-white shadow-[0_0_24px_rgba(255,217,0,0.15)]"
                            : "liquid-glass text-white/75 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs text-[#ffd900] tracking-widest">
                            {item.code}
                          </span>
                          <span className="text-xl font-medium tracking-tight">
                            {item.label}
                          </span>
                        </div>

                        {isActive ? (
                          <span className="flex items-center gap-2 text-[10px] font-mono text-[#ffd900] uppercase tracking-wider">
                            <span className="h-2 w-2 rounded-full bg-[#ffd900] shadow-[0_0_8px_rgba(255,217,0,1)] animate-ping" />
                            Active
                          </span>
                        ) : (
                          <ChevronRightIcon />
                        )}
                      </button>
                    </motion.li>
                  );
                })}

                {/* Direct Action: Transmit Signal */}
                <motion.li
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: NAV_ITEMS.length * 0.06 }}
                  className="mt-2"
                >
                  <button
                    onClick={handleTransmitClick}
                    className="w-full flex items-center justify-between p-4 rounded-2xl tactile-switch-accent text-white font-semibold text-base shadow-[0_0_30px_rgba(255,217,0,0.25)]"
                  >
                    <div className="flex items-center gap-3">
                      <Send size={18} className="text-black" />
                      <span>Transmit Message</span>
                    </div>
                    <span>→</span>
                  </button>
                </motion.li>
              </ul>
            </nav>

            {/* Mobile Quick System Controls */}
            <div className="grid grid-cols-3 gap-2 my-2">
              <button
                onClick={() => {
                  toggleSound();
                  triggerLightHaptic();
                }}
                className="tactile-switch p-2.5 rounded-xl text-center flex flex-col items-center gap-1 text-[10px] font-mono text-white/80"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 size={16} className="text-[#ffd900]" />
                    <span className="text-[#ffd900]">AUDIO ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX size={16} className="text-white/40" />
                    <span className="text-white/40">AUDIO OFF</span>
                  </>
                )}
              </button>


              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  playWarp();
                  window.dispatchEvent(new CustomEvent("trigger-dossier-open"));
                }}
                className="tactile-switch p-2.5 rounded-xl text-center flex flex-col items-center gap-1 text-[10px] font-mono text-white/80"
              >
                <FileText size={16} className="text-[#ffd900]" />
                <span>CV DOSSIER</span>
              </button>
            </div>

            {/* Bottom Subpage Shortcuts & Telemetry */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                <Link
                  href="/works"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#ffd900] flex items-center gap-1 transition-colors"
                >
                  <span>All Works</span>
                  <ArrowUpRight size={12} />
                </Link>
                <span className="text-white/20">·</span>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#ffd900] flex items-center gap-1 transition-colors"
                >
                  <span>Manifesto</span>
                  <ArrowUpRight size={12} />
                </Link>
                <span className="text-white/20">·</span>
                <Link
                  href="/playground"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="hover:text-[#ffd900] flex items-center gap-1 transition-colors"
                >
                  <span>Research Lab</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-white/40 tracking-wider">
                <span>GUWAHATI // 26.14°N 91.73°E</span>
                <span className="text-[#ffd900]">1420.405 MHz</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-white/40"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}