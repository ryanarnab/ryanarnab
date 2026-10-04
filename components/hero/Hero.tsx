"use client";

import { motion, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useScrollProgress, useScrollController } from "../scroll/ScrollProvider";
import { ArrowDown, Sparkles, Smartphone, RotateCcw, Zap, Target, Activity } from "lucide-react";
import { useSound } from "@/components/sound/SoundProvider";
import { triggerLightHaptic, triggerMediumHaptic, triggerSnapHaptic, triggerImpactHaptic } from "@/lib/haptics";

function GravityWord({
  children,
  gravityOn = true,
  wordIndex = 0,
}: {
  children: string;
  gravityOn?: boolean;
  wordIndex?: number;
}) {
  return (
    <span className="block">
      {children.split("").map((letter, index) => {
        const animClass = (wordIndex * 10 + index) % 2 === 0 ? "animate-zero-g-a" : "animate-zero-g-b";
        return (
          <span
            key={`${letter}-${index}`}
            className={`inline-block origin-center will-change-transform select-none transition-all duration-500 ${
              !gravityOn ? animClass : "hover:text-[#d4b068] hover:scale-105"
            }`}
            style={{
              animationDelay: !gravityOn ? `${((wordIndex * 10 + index) * 0.18) % 1.5}s` : undefined,
            }}
          >
            {letter}
          </span>
        );
      })}
    </span>
  );
}

export default function Hero() {
  const progress = useScrollProgress();
  const [gravityOn, setGravityOn] = useState(true);
  const { playWarp, playClick } = useSound();

  // Mobile Hardware Morph & Swipe-to-Reveal State
  const [isSwipedAway, setIsSwipedAway] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<1 | -1>(1);
  const [isMorphActive, setIsMorphActive] = useState(false);
  const [gyroInfo, setGyroInfo] = useState<{
    gamma: number;
    beta: number;
    available: boolean;
    denied: boolean;
  }>({ gamma: 0, beta: 0, available: false, denied: false });

  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);

  useEffect(() => {
    // Notify particle system to realign with the portal box once DOM has mounted
    const alignTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("realign-particles"));
    }, 60);

    const handleWindowResize = () => {
      window.dispatchEvent(new CustomEvent("realign-particles"));
    };
    window.addEventListener("resize", handleWindowResize);

    const handleGyroTelemetry = (e: Event) => {
      const custom = e as CustomEvent<{
        gamma?: number;
        beta?: number;
        available?: boolean;
        denied?: boolean;
      }>;
      if (custom.detail) {
        setGyroInfo((prev) => ({
          gamma: custom.detail.gamma !== undefined ? custom.detail.gamma : prev.gamma,
          beta: custom.detail.beta !== undefined ? custom.detail.beta : prev.beta,
          available: custom.detail.available !== undefined ? custom.detail.available : prev.available,
          denied: custom.detail.denied !== undefined ? custom.detail.denied : prev.denied,
        }));
      }
    };

    const handleMorphTrigger = (e: Event) => {
      const custom = e as CustomEvent<{ active?: boolean }>;
      if (custom.detail) {
        setIsMorphActive(!!custom.detail.active);
      }
    };

    const handleToggleGravity = () => {
      setGravityOn((prev) => !prev);
      playWarp();
      triggerLightHaptic();
    };

    window.addEventListener("gyro-telemetry", handleGyroTelemetry);
    window.addEventListener("face-morph-trigger", handleMorphTrigger);
    window.addEventListener("toggle-hero-gravity", handleToggleGravity);

    return () => {
      clearTimeout(alignTimer);
      window.removeEventListener("resize", handleWindowResize);
      window.removeEventListener("gyro-telemetry", handleGyroTelemetry);
      window.removeEventListener("face-morph-trigger", handleMorphTrigger);
      window.removeEventListener("toggle-hero-gravity", handleToggleGravity);
    };
  }, [playWarp]);

  // Handle touch swipe on hero text
  const onTextTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const onTextTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStartXRef.current;
      const dy = e.changedTouches[0].clientY - touchStartYRef.current;

      if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        const dir = dx > 0 ? 1 : -1;
        setSwipeDirection(dir);
        const nextSwiped = !isSwipedAway;
        setIsSwipedAway(nextSwiped);
        triggerImpactHaptic();
        playWarp();

        if (typeof window !== "undefined" && window.__triggerFaceMorph) {
          window.__triggerFaceMorph(nextSwiped);
        }
      }
    }
  };

  const handleToggleOrRestore = () => {
    triggerSnapHaptic();
    playWarp();
    const nextMorph = !isMorphActive;
    setIsMorphActive(nextMorph);
    if (typeof window !== "undefined" && window.__triggerFaceMorph) {
      window.__triggerFaceMorph(nextMorph);
    }
  };

  const heroY = useTransform(progress, [0, 1], [0, -420]);
  const heroOpacity = useTransform(progress, [0, 0.74], [1, 0]);
  const heroScale = useTransform(progress, [0, 1], [1, 0.82]);

  const { scrollTo } = useScrollController();

  const scrollToSection = (id: string) => {
    playClick();
    triggerMediumHaptic();
    scrollTo(`#${id}`);
  };

  return (
    <motion.section
      id="hero"
      className="sticky top-0 flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{
        y: heroY,
        opacity: heroOpacity,
        scale: heroScale,
      }}   
    >
      {/* Background ambient HUD lines */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Subtle diagonal accent lines */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-25">
          <div className="absolute top-[25%] left-[-10%] w-[60%] h-[1px] bg-gradient-to-r from-transparent via-[#d4b068]/20 to-transparent rotate-[20deg]" />
          <div className="absolute bottom-[35%] right-[-10%] w-[50%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-[-12deg]" />
        </div>

        {/* Angular corner ticks */}
        <svg className="absolute top-12 left-12 w-12 h-12 opacity-30 hidden md:block" viewBox="0 0 48 48" fill="none">
          <path d="M0 0H20V2H2V20H0V0Z" fill="#d4b068" />
        </svg>
        <svg className="absolute bottom-12 right-12 w-12 h-12 opacity-30 hidden md:block" viewBox="0 0 48 48" fill="none">
          <path d="M48 48H28V46H46V28H48V48Z" fill="#d4b068" />
        </svg>
      </div>

      {/* Horizontal glitch scan line */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        <div className="absolute w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#d4b068]/15 to-transparent glitch-scanline" />
      </div>

      {/* Hero Content — Split layout: Left text, Right particle 3D face portal */}
      <motion.div 
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row items-center justify-between text-left px-6 sm:px-10 lg:px-16 pt-24 sm:pt-20 pb-12 gap-8 lg:gap-8"
      >
        {/* LEFT COLUMN: Clean, High-Impact Riot Typography & CTAs */}
        <div className="flex-1 flex flex-col items-start justify-center max-w-2xl w-full">
          
          {/* TACTICAL STATUS BADGE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="mb-5 sm:mb-7"
          >
            <div 
              data-cursor-label="telemetry: guwahati 📍"
              className="angular-panel-sm px-4 py-2 flex items-center gap-3 text-xs text-[#fffdf0]/90 transition-transform duration-200 hover:scale-[1.02]"
              style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
            >
              <div 
                className="flex items-center justify-center h-5 w-5 bg-[#d4b068]/20 text-[#d4b068] shrink-0" 
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              >
                <Zap size={11} />
              </div>
              <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-white/90 uppercase font-semibold">
                Design &amp; Tech Operative
              </span>
              <span 
                className="h-1.5 w-1.5 bg-[#d4b068] shadow-[0_0_8px_rgba(212,176,104,1)] shrink-0" 
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} 
              />
              <span className="text-[10px] sm:text-[11px] font-mono text-[#d4b068] font-bold shrink-0">
                Guwahati, IN
              </span>
            </div>
          </motion.div>

          {/* MOBILE & TABLET 3D POINT CLOUD TELEMETRY BADGE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="block lg:hidden mb-4 z-20 max-w-full"
          >
            <button
              onClick={handleToggleOrRestore}
              className={`angular-panel-sm px-3.5 py-1.5 flex items-center justify-center gap-1.5 text-[10px] font-mono tracking-wider transition-all duration-300 max-w-[92vw] active:scale-95 ${
                isMorphActive 
                  ? "border-[#d4b068]/80 bg-[#d4b068]/20 text-[#d4b068] shadow-[0_0_15px_rgba(212,176,104,0.3)]" 
                  : "text-white/85"
              }`}
            >
              <Smartphone size={12} className={isMorphActive || gyroInfo.available ? "text-[#d4b068] animate-pulse shrink-0" : "text-white/60 shrink-0"} />
              {isMorphActive ? (
                <span className="font-semibold flex items-center gap-1 truncate">
                  ✦ 3D FACE ACTIVE • TAP TO DISPERSE
                  <RotateCcw size={10} className="opacity-70 shrink-0" />
                </span>
              ) : (
                <span className="truncate">
                  ✦ TAP TO MORPH 3D FACE {gyroInfo.available ? `· TILT GYRO (${gyroInfo.gamma > 0 ? `+${gyroInfo.gamma}` : gyroInfo.gamma}°)` : "PARTICLES"}
                </span>
              )}
            </button>
          </motion.div>

          {/* TITLE — CRISP, BOLD, ZERO-G LETTERS */}
          <div className="w-full text-left relative py-1">
            <motion.div
              onTouchStart={onTextTouchStart}
              onTouchEnd={onTextTouchEnd}
              animate={{
                x: isSwipedAway ? swipeDirection * 24 : 0,
                opacity: isSwipedAway ? 0.25 : 1,
                scale: isSwipedAway ? 0.92 : 1,
              }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className="cursor-grab active:cursor-grabbing touch-pan-y"
            >
              <h1
                data-warp-text
                data-cursor-label={isSwipedAway ? "tap to restore text ↺" : gravityOn ? "gravity on 🧲" : "zero-g float 🎈"}
                onClick={() => {
                  triggerLightHaptic();
                  playWarp();
                  handleToggleOrRestore();
                }}
                className="text-[clamp(58px,13vw,165px)] font-black leading-[0.88] tracking-[-0.05em] text-[#fffdf0] text-left select-none transition-opacity duration-300"
              >
                <GravityWord gravityOn={gravityOn} wordIndex={0}>RYAN</GravityWord>
                <GravityWord gravityOn={gravityOn} wordIndex={1}>ARNAB</GravityWord>
              </h1>
            </motion.div>

            {/* RIOT-STYLE THICK GOLD BAR UNDERLINE WITH END NOTCH */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 sm:mt-5 flex items-center gap-2 origin-left"
            >
              <div className="h-[4px] w-48 sm:w-64 bg-[#d4b068] shadow-[0_0_14px_rgba(212,176,104,0.7)]" />
              <div className="h-[4px] w-[6px] bg-[#d4b068] shadow-[0_0_8px_rgba(212,176,104,0.5)]" />
              <span className="text-[10px] font-mono text-[#d4b068] tracking-widest pl-1">✦ SPEC-01</span>
            </motion.div>

            {/* Mobile swipe notice */}
            {isSwipedAway && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={handleToggleOrRestore}
                className="lg:hidden mt-2 inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-[#d4b068] bg-black/70 border border-[#d4b068]/40 backdrop-blur-md active:scale-95"
              >
                <RotateCcw size={11} />
                <span>Tap to restore text</span>
              </motion.button>
            )}
          </div>

          {/* SUBTITLE */}
          <motion.p 
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            data-cursor-label="curiosity creates better ✦"
            className="mt-6 sm:mt-8 max-w-[540px] text-left text-sm sm:text-base leading-relaxed text-[#fffdf0]/80 font-normal"
          >
            Communication Designer & Creative Technologist forging <span className="text-[#d4b068] font-semibold">brand identities</span>, tactical interfaces, and kinetic digital arsenals.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4 max-w-full w-full"
          >
            {/* Primary CTA */}
            <motion.button
              whileTap={{ scale: 0.95, y: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
              onClick={() => scrollToSection("work")}
              data-cursor-label="explore expeditions ↓"
              className="tactile-switch-accent px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_0_24px_rgba(212,176,104,0.25)]"
              style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
            >
              <Target size={14} />
              <span>Explore Works</span>
              <ArrowDown size={14} className="animate-bounce" />
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              whileTap={{ scale: 0.95, y: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
              onClick={() => scrollToSection("contact")}
              data-cursor-label="transmit signal ⚡"
              className="tactile-switch px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold text-[#fffdf0] tracking-wider uppercase flex items-center justify-center gap-2.5 cursor-pointer hover:border-[#d4b068]/50"
              style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
            >
              <span className="h-2 w-2 bg-[#d4b068] animate-ping" style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
              <span>Transmit Signal</span>
            </motion.button>

            {/* Gravity Toggle */}
            <motion.button
              whileTap={{ scale: 0.95, y: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 25 }}
              onClick={() => {
                setGravityOn(!gravityOn);
                playWarp();
                triggerImpactHaptic();
              }}
              data-cursor-label={gravityOn ? "turn off gravity 🎈" : "restore gravity 🧲"}
              className={`tactile-switch px-4 sm:px-5 py-3.5 sm:py-4 text-[11px] sm:text-xs font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                !gravityOn
                  ? "border-[#d4b068]/80 text-[#d4b068] bg-[#d4b068]/15 shadow-[0_0_18px_rgba(212,176,104,0.25)]"
                  : "text-white/80 border-white/15 hover:border-[#d4b068]/30"
              }`}
              style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
              title={gravityOn ? "Click to turn off gravity (activate Zero-G float)" : "Click to restore gravity"}
            >
              <Sparkles size={13} className={!gravityOn ? "text-[#d4b068] animate-spin" : "text-white/40"} />
              <span>{gravityOn ? "Gravity: 1.0G" : "Zero-G: Float"}</span>
            </motion.button>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 100% TRANSPARENT 3D PARTICLE FACE ZONE (NO PHOTO) */}
        <motion.div
          id="hero-face-portal"
          data-cursor-label="arnab 3d ✦"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-1 max-w-lg w-full aspect-[4/5] relative items-center justify-center pointer-events-auto select-none"
        >
          {/* Floating Diamond Crosshairs (✦) */}
          <div className="absolute -top-4 right-10 text-xl text-[#d4b068] filter drop-shadow-[0_0_8px_rgba(212,176,104,0.7)] animate-pulse">
            ✦
          </div>
          <div className="absolute bottom-12 -left-4 text-2xl text-[#d4b068] filter drop-shadow-[0_0_8px_rgba(212,176,104,0.7)] animate-pulse" style={{ animationDelay: "1.5s" }}>
            ✦
          </div>

          {/* Tactical Viewfinder Reticles (Framing the 3D particles without blocking) */}
          <div className="absolute inset-4 pointer-events-none">
            {/* Top-Left Corner Bracket */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#d4b068]/35" />
            {/* Top-Right Corner Bracket */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#d4b068]/35" />
            {/* Bottom-Left Corner Bracket */}
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#d4b068]/35" />
            {/* Bottom-Right Corner Bracket */}
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#d4b068]/35" />
          </div>

          {/* Top HUD Telemetry Tag */}
          <div className="absolute top-8 left-8 flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleToggleOrRestore}
              className="angular-panel-sm px-3 py-1.5 text-[10px] font-mono tracking-widest text-[#d4b068] uppercase flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_12px_rgba(212,176,104,0.15)]"
              style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
              title="Click to toggle 3D Face Point Cloud morph"
            >
              <span className={`h-1.5 w-1.5 bg-[#d4b068] ${isMorphActive ? "animate-ping" : ""}`} style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }} />
              <span>{isMorphActive ? "3D FACE: ACTIVE" : "STARFIELD: DRIFT"}</span>
              <Activity size={11} className="opacity-70" />
            </button>
          </div>

          {/* Bottom HUD Metadata & Operative Dossier Lockup */}
          <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between pointer-events-auto">
            <div>
              <span className="text-[9px] font-mono tracking-[0.22em] text-[#d4b068] uppercase block font-semibold">
                TACTICAL OPERATIVE // DOSSIER
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight block uppercase mt-0.5">
                Arnab Ghosh
              </h2>
              <span className="text-[10px] font-mono text-[#d4b068]/90 block tracking-wide mt-0.5 font-medium">
                20 YRS OLD · CREATIVE TECHNOLOGIST
              </span>
              <span className="text-[9px] font-mono text-white/50 tracking-wider block mt-0.5">
                GUWAHATI, ASSAM, IN · 26.14°N · 91.73°E
              </span>
            </div>

            {/* Engagement Metrics */}
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/90">
                <span className="text-[#d4b068] font-bold">20</span>
                <span className="text-[8px] text-white/50 uppercase">Age</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/90">
                <span className="text-[#d4b068] font-bold">12</span>
                <span className="text-[8px] text-white/50 uppercase">Works</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/90">
                <span className="text-[#d4b068] font-bold">4+</span>
                <span className="text-[8px] text-white/50 uppercase">Years</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}