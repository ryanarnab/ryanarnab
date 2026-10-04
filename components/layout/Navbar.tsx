"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Radio, Menu, X, ArrowUpRight, Send, Volume2, VolumeX, FileText, Sparkles } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useScrollController, useDocumentScrollProgress } from "../scroll/ScrollProvider";
import { useSound } from "@/components/sound/SoundProvider";
import { triggerLightHaptic, triggerMediumHaptic } from "@/lib/haptics";

interface NavItem {
  id: string;
  label: string;
  code: string;
  href: string;
  cursorLabel: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Origin", code: "00", href: "/", cursorLabel: "home ✦" },
  { id: "work", label: "Works", code: "01", href: "/works", cursorLabel: "expeditions ✦" },
  { id: "about", label: "Observatory", code: "02", href: "/about", cursorLabel: "observatory ✦" },
  { id: "playground", label: "Lab", code: "03", href: "/playground", cursorLabel: "research lab 🧪" },
];

/* ─── Signal Waveform Component ──────────────────────────────────────── */
function SignalWaveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-3" aria-hidden="true">
      {[0.5, 0.9, 0.4, 0.8, 0.6].map((h, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full"
          style={{ backgroundColor: active ? "#d4b068" : "rgba(255,255,255,0.3)" }}
          animate={
            active
              ? {
                  height: [`${h * 12}px`, `${h * 3.5}px`, `${h * 12}px`],
                }
              : { height: `${h * 5}px` }
          }
          transition={
            active
              ? {
                  duration: 0.5 + i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.08,
                }
              : { duration: 0.25 }
          }
        />
      ))}
    </div>
  );
}

/* ─── Orbital Progress Ring (Logo) ───────────────────────────────────── */
function OrbitalRing({ progress }: { progress: number }) {
  const circumference = 2 * Math.PI * 17;
  const strokeDashoffset = circumference - Math.min(Math.max(progress, 0), 1) * circumference;

  return (
    <svg
      className="absolute -inset-[3px] w-[calc(100%+6px)] h-[calc(100%+6px)] -rotate-90 pointer-events-none"
      viewBox="0 0 40 40"
      aria-hidden="true"
    >
      <circle
        cx="20"
        cy="20"
        r="17"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.5"
      />
      <circle
        cx="20"
        cy="20"
        r="17"
        fill="none"
        stroke="#d4b068"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{
          transition: "stroke-dashoffset 0.3s cubic-bezier(0.16,1,0.3,1)",
          filter: "drop-shadow(0 0 4px rgba(212, 176, 104,0.6))",
        }}
      />
      {progress > 0.01 && (
        <circle
          cx="20"
          cy="3"
          r="2"
          fill="#d4b068"
          style={{
            filter: "drop-shadow(0 0 6px rgba(212, 176, 104,1))",
            transform: `rotate(${progress * 360}deg)`,
            transformOrigin: "20px 20px",
            transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
          }}
        />
      )}
    </svg>
  );
}

/* ═════════════════════════════════════════════════════════════════════════
   NAVBAR — COMMAND DECK (FULLY RESPONSIVE FOR PHONE & DESKTOP)
   ═════════════════════════════════════════════════════════════════════════ */
export default function Navbar() {
  const [time, setTime] = useState<string>("");
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [hoveredNavId, setHoveredNavId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isFaceMorphActive, setIsFaceMorphActive] = useState(false);
  const { soundEnabled, toggleSound, playWarp, playClick, playHover } = useSound();
  const pathname = usePathname();
  const router = useRouter();
  const { scrollTo } = useScrollController();
  const documentProgress = useDocumentScrollProgress();

  // Track navbar capsule mouse position for magnetic glow
  const navRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const glowX = useTransform(smoothMouseX, (v) => `${v}px`);
  const glowY = useTransform(smoothMouseY, (v) => `${v}px`);

  const handleNavMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!navRef.current) return;
      const rect = navRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY]
  );

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
      setScrolled(window.scrollY > 25);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Subscribe to document scroll progress (for orbital ring)
  useEffect(() => {
    const unsub = documentProgress.on("change", (val) => {
      setScrollProgress(val);
    });
    return () => unsub();
  }, [documentProgress]);

  // Listen to face morph state
  useEffect(() => {
    const handleMorph = (e: Event) => {
      const custom = e as CustomEvent<{ active?: boolean }>;
      if (custom.detail) {
        setIsFaceMorphActive(!!custom.detail.active);
      }
    };
    window.addEventListener("face-morph-trigger", handleMorph);
    return () => window.removeEventListener("face-morph-trigger", handleMorph);
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
    if (typeof document !== "undefined") {
      if (isMobileMenuOpen) {
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
      } else {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      }
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      }
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
      playClick();
      triggerLightHaptic();

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
    [pathname, router, scrollTo, playClick]
  );

  const handleTransmitClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsMobileMenuOpen(false);
      playClick();
      triggerMediumHaptic();

      if (pathname === "/") {
        scrollTo("#contact");
        setActiveSection("contact");
      } else {
        router.push("/#contact");
      }
    },
    [pathname, router, scrollTo, playClick]
  );

  const handleLogoClick = useCallback(
    (e: React.MouseEvent) => {
      if (pathname === "/") {
        e.preventDefault();
        scrollTo("#hero");
        setActiveSection("hero");
      }
      setIsMobileMenuOpen(false);
      playClick();
      triggerLightHaptic();
    },
    [pathname, scrollTo, playClick]
  );

  const toggleFaceMorphMobile = useCallback(() => {
    playWarp();
    triggerMediumHaptic();
    if (typeof window !== "undefined" && window.__triggerFaceMorph) {
      window.__triggerFaceMorph();
    }
  }, [playWarp]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled ? "pt-2.5 sm:pt-4" : "pt-4 sm:pt-6"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-3 sm:px-8 lg:px-12">

          {/* ─── 1. BRAND LOGO & TELEMETRY ─────────────────────────────── */}
          <div className="flex items-center gap-3 sm:gap-4 pointer-events-auto min-w-0">
            <Link
              href="/"
              onClick={handleLogoClick}
              className="group flex items-center gap-2.5 sm:gap-3 text-sm font-medium tracking-tight text-white transition hover:opacity-95 focus:outline-none shrink-0"
              aria-label="Ryan Arnab Home"
            >
              {/* Logo with Angular Clip-path Frame */}
              <div 
                className="relative flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 angular-panel-sm p-1.5 sm:p-2 transition-all duration-300 group-hover:scale-105 group-hover:border-[#d4b068]/50 group-hover:shadow-[0_0_16px_rgba(212, 176, 104,0.3)] shrink-0"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
              >
                <OrbitalRing progress={scrollProgress} />
                <Image
                  src="/RyanArnab.svg"
                  alt="RyanArnab Logo"
                  width={22}
                  height={22}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>

              <div className="flex flex-col min-w-0">
                <span className="font-bold tracking-[-0.03em] text-[#fffdf0] text-sm sm:text-base leading-none group-hover:text-[#d4b068] transition-colors truncate">
                  ryanarnab
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.14em] uppercase text-[#d4b068]/70 leading-tight mt-0.5 sm:mt-1 truncate flex items-center gap-1">
                  <span>OPERATIVE</span>
                  <span className="text-[7px]">✦</span>
                  <span>SPEC 01</span>
                </span>
              </div>
            </Link>

            {/* TELEMETRY BADGE (DESKTOP ONLY) */}
            <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-white/10 text-[10px] font-mono uppercase tracking-[0.18em] text-white/40">
              <Radio size={11} className="text-[#d4b068] animate-pulse" />
              <span className="text-[#d4b068] font-semibold">TACTICAL DECK</span>
              <span className="text-white/20">·</span>
              <span>26.14°N 91.73°E</span>
              <span className="text-white/20">·</span>
              <span>{time || "SYS: LIVE"}</span>
            </div>
          </div>

          {/* ─── 2. NAVIGATION DOCK (DESKTOP) ──────────────────────────── */}
          <nav
            ref={navRef}
            onMouseMove={handleNavMouseMove}
            onMouseLeave={() => setHoveredNavId(null)}
            className="hidden md:block pointer-events-auto"
          >
            <motion.ul
              className={`relative flex items-center gap-1.5 sm:gap-2 p-1.5 text-xs sm:text-[13px] overflow-hidden transition-all duration-300 ${
                scrolled
                  ? "angular-panel shadow-[0_16px_48px_rgba(0,0,0,0.85)] border-[#d4b068]/30"
                  : "bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              }`}
              style={{
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
              }}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Mouse-following glow overlay */}
              <motion.div
                className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
                style={{
                  background: `radial-gradient(120px circle at var(--gx) var(--gy), rgba(212, 176, 104,0.1), transparent 70%)`,
                  // @ts-expect-error CSS custom properties
                  "--gx": glowX,
                  "--gy": glowY,
                  opacity: hoveredNavId ? 0.9 : 0,
                }}
              />

              {NAV_ITEMS.map((item, index) => {
                const isActive = activeSection === item.id;
                const isHovered = hoveredNavId === item.id;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.2 + index * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item)}
                      onMouseEnter={() => {
                        setHoveredNavId(item.id);
                        playHover();
                      }}
                      onMouseLeave={() => setHoveredNavId(null)}
                      data-cursor-label={item.cursorLabel}
                      className={`relative z-10 px-5 sm:px-6 py-2 font-mono tracking-wider transition-all duration-200 cursor-pointer select-none inline-flex items-center gap-2 ${
                        isActive
                          ? "bg-[#d4b068]/15 text-[#d4b068] border border-[#d4b068]/50 shadow-[0_0_16px_rgba(212, 176, 104,0.25)] font-semibold"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                      style={{
                        clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
                      }}
                    >
                      {/* Active diamond beacon */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            className="h-1.5 w-1.5 bg-[#d4b068] shadow-[0_0_8px_rgba(212, 176, 104,1)]"
                            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Sector code on hover */}
                      <AnimatePresence>
                        {isHovered && !isActive && (
                          <motion.span
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "auto", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[9px] text-[#d4b068] font-bold overflow-hidden whitespace-nowrap"
                          >
                            {item.code}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <span>{item.label}</span>

                      {/* Hover underline scanner */}
                      <motion.span
                        className="absolute bottom-1 left-3 right-3 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4b068] to-transparent"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{
                          scaleX: isHovered && !isActive ? 1 : 0,
                          opacity: isHovered && !isActive ? 0.8 : 0,
                        }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          {/* ─── 3. CTA & SYSTEM CONTROLS ──────────────────────────────── */}
          <div className="flex items-center gap-2 pointer-events-auto shrink-0">
            {/* Audio Toggle (Tablet & Desktop) */}
            <motion.button
              onClick={() => {
                toggleSound();
              }}
              title={soundEnabled ? "Mute Procedural Audio" : "Activate Procedural Audio"}
              className={`tactile-switch hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono transition-colors ${
                soundEnabled ? "border-[#d4b068]/50 text-[#d4b068]" : "text-white/60 hover:text-white"
              }`}
              style={{
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
            >
              {soundEnabled ? (
                <>
                  <SignalWaveform active={true} />
                  <span className="text-[10px] tracking-wider">AUDIO ON</span>
                </>
              ) : (
                <>
                  <VolumeX size={13} className="text-white/40" />
                  <span className="text-[10px] tracking-wider text-white/40">AUDIO OFF</span>
                </>
              )}
            </motion.button>

            {/* Dossier Resume Button (Desktop) */}
            <motion.button
              onClick={() => {
                playWarp();
                window.dispatchEvent(new CustomEvent("trigger-dossier-open"));
              }}
              title="Open Personnel Dossier / CV"
              className="tactile-switch hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-white/70 hover:text-[#d4b068] hover:border-[#d4b068]/40 transition-colors"
              style={{
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText size={12} className="text-[#d4b068]" />
              <span className="text-[10px] tracking-wider">DOSSIER</span>
            </motion.button>

            {/* Transmit Button (Desktop & Tablet) */}
            <motion.button
              onClick={handleTransmitClick}
              data-cursor-label="transmit signal ⚡"
              className="tactile-switch-accent hidden sm:inline-flex px-4 sm:px-5 py-2 text-xs font-bold tracking-wide uppercase items-center gap-1.5 cursor-pointer group"
              style={{
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="hidden md:inline">Transmit</span>
              <span>Signal</span>
              <motion.span
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.button>

            {/* Mobile Sound Quick Switch */}
            <button
              onClick={() => {
                toggleSound();
                triggerLightHaptic();
              }}
              aria-label={soundEnabled ? "Mute audio" : "Enable sound"}
              className={`sm:hidden flex h-9 w-9 items-center justify-center angular-panel-sm text-white transition-all active:scale-90 ${
                soundEnabled ? "border-[#d4b068]/60 text-[#d4b068]" : "text-white/50"
              }`}
              style={{
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              {soundEnabled ? <Volume2 size={16} className="text-[#d4b068]" /> : <VolumeX size={16} />}
            </button>

            {/* Mobile Hamburger Toggle (Phones & Small Screens) */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                triggerLightHaptic();
                playClick();
              }}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open navigation menu"}
              className={`md:hidden flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center angular-panel-sm text-white transition-all active:scale-90 ${
                isMobileMenuOpen
                  ? "border-[#d4b068]/80 bg-[#d4b068]/20 text-[#d4b068] shadow-[0_0_12px_rgba(212, 176, 104,0.3)]"
                  : "hover:border-white/40"
              }`}
              style={{
                clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              }}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </header>

      {/* ─── 4. FULLSCREEN MOBILE NAVIGATION TERMINAL ──────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] md:hidden bg-black/95 backdrop-blur-2xl flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden select-none"
          >
            {/* Subtle holographic scanline overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.03]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 4px)",
              }}
            />

            {/* Sweeping radar scanner */}
            <motion.div
              className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4b068]/50 to-transparent pointer-events-none z-10"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />

            {/* Mobile Header Bar */}
            <div className="relative z-20 flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#d4b068]">
                <Radio size={12} className="animate-pulse" />
                <span>COMMAND DECK // LIVE</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-white/50">{time}</span>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    triggerLightHaptic();
                    playClick();
                  }}
                  className="p-1.5 angular-panel-sm text-white/80 active:scale-90 transition-transform"
                  style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
                  aria-label="Close navigation"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable Mobile Body */}
            <div className="relative z-10 flex-1 overflow-y-auto px-5 py-4 flex flex-col justify-between max-w-md mx-auto w-full gap-4">
              
              {/* Sector Navigation Nodes */}
              <nav className="my-auto py-2">
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/40 block mb-2 px-1">
                  SECTOR DISPATCH // TARGET
                </span>
                <ul className="flex flex-col gap-2.5">
                  {NAV_ITEMS.map((item, idx) => {
                    const isActive = activeSection === item.id;
                    return (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.05 + idx * 0.05,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <button
                          onClick={(e) => handleNavClick(e, item)}
                          className={`w-full flex items-center justify-between p-3.5 transition-all active:scale-[0.98] text-left ${
                            isActive
                              ? "bg-[#d4b068]/15 border border-[#d4b068]/50 text-white shadow-[0_0_20px_rgba(212, 176, 104,0.2)]"
                              : "angular-panel-sm text-white/80 hover:text-white"
                          }`}
                          style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-[#d4b068] tracking-wider font-semibold">
                              {item.code}
                            </span>
                            <span className="text-lg font-medium tracking-tight">
                              {item.label}
                            </span>
                          </div>

                          {isActive ? (
                            <span className="flex items-center gap-2 text-[10px] font-mono text-[#d4b068] uppercase tracking-wider">
                              <span className="h-2 w-2 bg-[#d4b068] shadow-[0_0_8px_rgba(212, 176, 104,1)] animate-ping" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
                              Active
                            </span>
                          ) : (
                            <ChevronRightIcon />
                          )}
                        </button>
                      </motion.li>
                    );
                  })}

                  {/* High-Priority Primary Action: Transmit */}
                  <motion.li
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.05 + NAV_ITEMS.length * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="mt-1"
                  >
                    <button
                      onClick={handleTransmitClick}
                      className="w-full flex items-center justify-between p-3.5 tactile-switch-accent text-black font-bold text-sm tracking-wider uppercase shadow-[0_0_24px_rgba(212, 176, 104,0.3)] active:scale-[0.98] transition-transform"
                      style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
                    >
                      <div className="flex items-center gap-2.5">
                        <Send size={16} className="text-black" />
                        <span>Transmit Direct Signal</span>
                      </div>
                      <span className="font-bold">→</span>
                    </button>
                  </motion.li>
                </ul>
              </nav>

              {/* CYBERDECK 3-CELL HARDWARE ACTION GRID */}
              <div className="shrink-0 space-y-3">
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/40 block px-1">
                  TACTILE HARDWARE CONTROLS
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {/* Control 1: Sound FX */}
                  <button
                    onClick={() => {
                      toggleSound();
                      triggerLightHaptic();
                    }}
                    className={`tactile-switch p-2.5 text-center flex flex-col items-center justify-center gap-1 text-[10px] font-mono active:scale-95 transition-all ${
                      soundEnabled ? "border-[#d4b068]/60 text-[#d4b068] bg-[#d4b068]/10" : "text-white/60"
                    }`}
                    style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                  >
                    {soundEnabled ? (
                      <>
                        <Volume2 size={16} className="text-[#d4b068]" />
                        <span className="text-[#d4b068] text-[9px] font-semibold">AUDIO ON</span>
                      </>
                    ) : (
                      <>
                        <VolumeX size={16} className="text-white/40" />
                        <span className="text-white/40 text-[9px]">AUDIO OFF</span>
                      </>
                    )}
                  </button>

                  {/* Control 2: CV Dossier Modal */}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      playWarp();
                      triggerMediumHaptic();
                      window.dispatchEvent(new CustomEvent("trigger-dossier-open"));
                    }}
                    className="tactile-switch p-2.5 text-center flex flex-col items-center justify-center gap-1 text-[9px] font-mono text-white/80 active:scale-95 transition-all hover:border-[#d4b068]/40"
                    style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                  >
                    <FileText size={16} className="text-[#d4b068]" />
                    <span className="font-medium">CV DOSSIER</span>
                  </button>

                  {/* Control 3: 3D Face Point Cloud Toggle */}
                  <button
                    onClick={() => {
                      toggleFaceMorphMobile();
                    }}
                    className={`tactile-switch p-2.5 rounded-xl text-center flex flex-col items-center justify-center gap-1 text-[9px] font-mono active:scale-95 transition-all ${
                      isFaceMorphActive
                        ? "border-[#d4b068]/80 bg-[#d4b068]/20 text-[#d4b068] shadow-[0_0_12px_rgba(212, 176, 104,0.3)]"
                        : "text-white/80 hover:border-white/40"
                    }`}
                  >
                    <Sparkles size={16} className={isFaceMorphActive ? "text-[#d4b068] animate-spin" : "text-[#d4b068]"} />
                    <span className="font-medium">{isFaceMorphActive ? "FACE 3D ON" : "3D MORPH"}</span>
                  </button>
                </div>
              </div>

              {/* Bottom Subpage Shortcuts & Telemetry */}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5 shrink-0">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/60">
                  <Link
                    href="/works"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      triggerLightHaptic();
                    }}
                    className="hover:text-[#d4b068] flex items-center gap-1 active:text-[#d4b068] transition-colors"
                  >
                    <span>All Works</span>
                    <ArrowUpRight size={11} />
                  </Link>
                  <span className="text-white/20">·</span>
                  <Link
                    href="/about"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      triggerLightHaptic();
                    }}
                    className="hover:text-[#d4b068] flex items-center gap-1 active:text-[#d4b068] transition-colors"
                  >
                    <span>Manifesto</span>
                    <ArrowUpRight size={11} />
                  </Link>
                  <span className="text-white/20">·</span>
                  <Link
                    href="/playground"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      triggerLightHaptic();
                    }}
                    className="hover:text-[#d4b068] flex items-center gap-1 active:text-[#d4b068] transition-colors"
                  >
                    <span>Research Lab</span>
                    <ArrowUpRight size={11} />
                  </Link>
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono text-white/40 tracking-wider">
                  <span>GUWAHATI // 26.14°N 91.73°E</span>
                  <span className="text-[#d4b068]">1420.405 MHz</span>
                </div>
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