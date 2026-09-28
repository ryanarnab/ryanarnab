"use client";

import { motion, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useScrollProgress, useScrollController } from "../scroll/ScrollProvider";
import { ArrowDown, Orbit, Sparkles, Smartphone, RotateCcw } from "lucide-react";
import { useSound } from "@/components/sound/SoundProvider";
import { triggerLightHaptic } from "@/lib/haptics";

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
              !gravityOn ? animClass : "hover:text-[#ffd900] hover:scale-105"
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
  // Default state: Gravity is ON (1.0G). Toggle turns OFF gravity (Zero-G mode).
  const [gravityOn, setGravityOn] = useState(true);
  const { playWarp } = useSound();

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

      // Detect horizontal swipe gesture
      if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        const dir = dx > 0 ? 1 : -1;
        setSwipeDirection(dir);
        const nextSwiped = !isSwipedAway;
        setIsSwipedAway(nextSwiped);

        if (typeof window !== "undefined" && window.__triggerFaceMorph) {
          window.__triggerFaceMorph(nextSwiped);
        }
      }
    }
  };

  const handleToggleOrRestore = () => {
    if (isSwipedAway) {
      setIsSwipedAway(false);
      if (window.__triggerFaceMorph) {
        window.__triggerFaceMorph(false);
      }
    } else {
      if (window.__requestGyroPermission) {
        window.__requestGyroPermission();
      }
      if (window.__triggerFaceMorph) {
        window.__triggerFaceMorph();
      }
    }
  };

  const heroY = useTransform(progress, [0, 1], [0, -420]);
  const heroOpacity = useTransform(progress, [0, 0.74], [1, 0]);
  const heroScale = useTransform(progress, [0, 1], [1, 0.82]);

  const { scrollTo } = useScrollController();

  const scrollToSection = (id: string) => {
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
      {/* Hero Structural Stage with smooth entrance */}
      <motion.div 
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-[1260px] flex-col items-center justify-center text-center px-4 sm:px-8 pt-28 sm:pt-20 pb-16"
      >
        {/* PLAYFUL COSMIC STATUS PILL (Liquid Glass Capsule) */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mb-4 sm:mb-8"
        >
          <div 
            data-cursor-label="telemetry: guwahati 📍"
            className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2.5 text-xs text-[#fffdf0]/90 transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-[#ffd900]/15 text-[#ffd900]">
              <Orbit size={12} className={!gravityOn ? "animate-spin" : "animate-pulse"} />
            </div>
            <span className="font-mono text-[11px] tracking-wide text-white/80">
              Orbiting somewhere curious
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] shadow-[0_0_8px_rgba(255,217,0,1)]" />
            <span className="text-[10px] font-mono text-[#ffd900] font-semibold">
              Guwahati, IN
            </span>
          </div>
        </motion.div>

        {/* MOBILE HARDWARE TELEMETRY & GESTURE TRIGGER BADGE */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="block sm:hidden mb-5 z-20"
        >
          <button
            onClick={handleToggleOrRestore}
            className={`liquid-glass rounded-full px-3.5 py-1.5 flex items-center gap-2 text-[10px] font-mono tracking-wider transition-all duration-300 ${
              isMorphActive 
                ? "border-[#ffd900]/80 bg-[#ffd900]/20 text-[#ffd900] shadow-[0_0_15px_rgba(255,217,0,0.3)]" 
                : "text-white/85"
            }`}
          >
            <Smartphone size={12} className={gyroInfo.available ? "text-[#ffd900] animate-pulse" : "text-white/60"} />
            {isMorphActive ? (
              <span className="font-semibold flex items-center gap-1.5">
                ✦ 3D FACE POINT-CLOUD ACTIVE [60 FPS]
                <RotateCcw size={10} className="ml-1 opacity-70" />
              </span>
            ) : gyroInfo.denied ? (
              <span className="text-amber-200/90">
                ⚡ GYRO BLOCKED • HOLD SKY (500MS) OR DOUBLE-TAP
              </span>
            ) : gyroInfo.available ? (
              <span>
                TILT: <strong className={gyroInfo.gamma > 20 ? "text-[#ffd900]" : "text-white"}>
                  {gyroInfo.gamma > 0 ? `+${gyroInfo.gamma}°` : `${gyroInfo.gamma}°`}
                </strong> {gyroInfo.gamma >= 25 ? "⚡ [SNAPPED]" : "☞ TILT &gt;25° RIGHT"}
              </span>
            ) : (
              <span>
                ⚡ TILT PHONE &gt;25° RIGHT OR SWIPE TEXT
              </span>
            )}
          </button>
        </motion.div>

        {/* CENTERED TITANIC TYPOGRAPHY WITH SWIPE-TO-REVEAL & GRAVITY TOGGLE */}
        <div className="w-full text-center relative">
          <motion.div
            onTouchStart={onTextTouchStart}
            onTouchEnd={onTextTouchEnd}
            animate={{
              x: isSwipedAway ? swipeDirection * 155 : 0,
              opacity: isSwipedAway ? 0.28 : 1,
              scale: isSwipedAway ? 0.94 : 1,
            }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="cursor-grab active:cursor-grabbing touch-pan-y"
          >
            <h1
              data-warp-text
              data-cursor-label={isSwipedAway ? "tap to restore text ↺" : gravityOn ? "gravity on 🧲" : "zero-g float 🎈"}
              onClick={() => {
                if (isSwipedAway) {
                  handleToggleOrRestore();
                }
              }}
              className="text-[clamp(56px,14vw,185px)] font-medium leading-[0.88] tracking-[-0.08em] text-[#fffdf0] text-center select-none transition-opacity duration-300"
            >
              <GravityWord gravityOn={gravityOn} wordIndex={0}>RYAN</GravityWord>
              <GravityWord gravityOn={gravityOn} wordIndex={1}>ARNAB</GravityWord>
            </h1>
          </motion.div>

          {/* Contextual notice when text is swiped out of the way */}
          {isSwipedAway && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={handleToggleOrRestore}
              className="sm:hidden mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono text-[#ffd900] bg-black/60 border border-[#ffd900]/40 backdrop-blur-md"
            >
              <RotateCcw size={11} />
              <span>Tap to restore text</span>
            </motion.button>
          )}
        </div>

        {/* CENTERED SUBTITLE */}
        <p 
          data-cursor-label="curiosity creates better ✦"
          className="mt-6 sm:mt-8 max-w-[580px] text-center text-xs sm:text-base leading-relaxed text-[#fffdf0]/75"
        >
          Communication Designer & Creative Technologist crafting playful <span className="text-[#ffd900] font-medium">brand identities</span>, tactile interfaces, and kinetic digital systems.
        </p>

        {/* TACTILE LIQUID METAL & LIQUID GLASS CONTROLS */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          
          {/* Primary Action: Explore Works */}
          <motion.button
            whileTap={{ scale: 0.95, y: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
            onClick={() => scrollToSection("work")}
            data-cursor-label="explore expeditions ↓"
            className="tactile-switch-accent rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Expeditions</span>
            <ArrowDown size={14} className="animate-bounce" />
          </motion.button>

          {/* Secondary Action: Transmit Signal */}
          <motion.button
            whileTap={{ scale: 0.95, y: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
            onClick={() => scrollToSection("contact")}
            data-cursor-label="transmit signal ⚡"
            className="tactile-switch rounded-xl px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-[#fffdf0] tracking-wide flex items-center gap-2 cursor-pointer"
          >
            <span className="h-2 w-2 rounded-full bg-[#ffd900] animate-ping" />
            <span>Transmit Signal</span>
          </motion.button>

          {/* Default state is Gravity ON; Toggle to turn off gravity (Zero-G Float) */}
          <motion.button
            whileTap={{ scale: 0.95, y: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
            onClick={() => {
              setGravityOn(!gravityOn);
              playWarp();
              triggerLightHaptic();
            }}
            data-cursor-label={gravityOn ? "turn off gravity 🎈" : "restore gravity 🧲"}
            className={`tactile-switch rounded-xl px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              !gravityOn
                ? "border-[#ffd900]/80 text-[#ffd900] bg-[#ffd900]/15 shadow-[0_0_18px_rgba(255,217,0,0.25)]"
                : "text-white/80 border-white/20 hover:border-white/40"
            }`}
            title={gravityOn ? "Click to turn off gravity (activate Zero-G float)" : "Click to restore gravity"}
          >
            <Sparkles size={13} className={!gravityOn ? "text-[#ffd900] animate-spin" : "text-white/40"} />
            <span>{gravityOn ? "Gravity: 1.0G (ON)" : "Zero-G: Float (OFF)"}</span>
          </motion.button>

        </div>
      </motion.div>
    </motion.section>
  );
}