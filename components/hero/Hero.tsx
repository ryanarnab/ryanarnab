"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useScrollProgress } from "../scroll/ScrollProvider";

function GravityWord({
  children,
  zeroG = true,
  wordIndex = 0,
}: {
  children: string;
  zeroG?: boolean;
  wordIndex?: number;
}) {
  return (
    <span className="block">
      {children.split("").map((letter, index) => (
        <GravityLetter
          key={`${letter}-${index}`}
          letter={letter}
          index={wordIndex * 10 + index}
          zeroG={zeroG}
        />
      ))}
    </span>
  );
}

function GravityLetter({
  letter,
  index,
  zeroG = true,
}: {
  letter: string;
  index: number;
  zeroG?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const stretch = useMotionValue(1);
  const aberration = useMotionValue(0);

  const x = useSpring(offsetX, {
    stiffness: 90,
    damping: 18,
    mass: 0.8,
  });
  
  const y = useSpring(offsetY, {
    stiffness: 90,
    damping: 18,
    mass: 0.8,
  });
  
  const scaleX = useSpring(stretch, {
    stiffness: 100,
    damping: 20,
    mass: 0.7,
  });
  
  const textShadow = useTransform(
    aberration,
    [0, 1],
    [
      "0px 0px 0px rgba(255,0,0,0)",
      "-2px 0px 0px rgba(255,40,80,0.65), 2px 0px 0px rgba(0,220,255,0.65)",
    ]
  );
  
  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = centerX - clientX;
      const dy = centerY - clientY;

      const distance = Math.hypot(dx, dy);
      const radius = 220;

      if (distance > radius) {
        offsetX.set(0);
        offsetY.set(0);
        stretch.set(1);
        aberration.set(0);
        return;
      }

      const rawStrength = 1 - distance / radius;
      const strength = rawStrength * rawStrength * (3 - 2 * rawStrength);

      const directionX = dx / Math.max(distance, 1);
      const directionY = dy / Math.max(distance, 1);

      offsetX.set(directionX * strength * 8);
      offsetY.set(directionY * strength * 5);

      stretch.set(1 + strength * 0.025);
      aberration.set(strength * 0.7);
    };

    const onPointerMove = (e: PointerEvent) => {
      handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [offsetX, offsetY, stretch, aberration]);

  // Individual zero-gravity buoyant wave parameters per letter
  const floatDuration = 3.6 + ((index * 7) % 5) * 0.45;
  const floatY = 7 + ((index * 3) % 4) * 2.5;
  const floatX = (index % 2 === 0 ? 1 : -1) * (1.5 + ((index * 2) % 3));
  const floatRotate = (index % 2 === 0 ? 1 : -1) * (1.2 + ((index * 5) % 3) * 0.6);
  const delay = (index * 0.22) % 1.6;

  return (
    <motion.span
      className="inline-block origin-center will-change-transform select-none"
      animate={
        zeroG
          ? {
              y: [-floatY, floatY * 1.15, -floatY],
              x: [-floatX, floatX, -floatX],
              rotate: [-floatRotate, floatRotate, -floatRotate],
            }
          : {
              y: 0,
              x: 0,
              rotate: 0,
            }
      }
      transition={
        zeroG
          ? {
              duration: floatDuration,
              repeat: Infinity,
              ease: "easeInOut",
              delay,
            }
          : {
              duration: 0.5,
              ease: "easeOut",
            }
      }
    >
      <motion.span
        ref={ref}
        className="inline-block origin-center will-change-transform select-none"
        style={{
          x,
          y,
          scaleX,
          textShadow,
        }}
      >
        {letter}
      </motion.span>
    </motion.span>
  );
}

import { ArrowDown, Orbit, Sparkles, Smartphone, RotateCcw } from "lucide-react";

export default function Hero() {
  const progress = useScrollProgress();
  const [zeroG, setZeroG] = useState(true);

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

    window.addEventListener("gyro-telemetry", handleGyroTelemetry);
    window.addEventListener("face-morph-trigger", handleMorphTrigger);

    // Periodically check global blend for synchronization
    const syncInterval = setInterval(() => {
      const blend = (window as unknown as { __starfieldMorphBlend?: number }).__starfieldMorphBlend || 0;
      setIsMorphActive(blend > 0.5);
    }, 150);

    return () => {
      window.removeEventListener("gyro-telemetry", handleGyroTelemetry);
      window.removeEventListener("face-morph-trigger", handleMorphTrigger);
      clearInterval(syncInterval);
    };
  }, []);

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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
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
      {/* Hero Structural Stage with smooth Zoom-in entrance on load */}
      <motion.div 
        initial={{ scale: 0.86, opacity: 0, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex w-full max-w-[1260px] flex-col items-center justify-center text-center px-4 sm:px-8 pt-28 sm:pt-20 pb-16"
      >
        {/* PLAYFUL COSMIC STATUS PILL (Liquid Glass Capsule) */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mb-4 sm:mb-8"
        >
          <div 
            data-cursor-label="telemetry: guwahati 📍"
            className="liquid-glass rounded-full px-4 py-1.5 flex items-center gap-2.5 text-xs text-[#fffdf0]/90 transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-[#ffd900]/15 text-[#ffd900]">
              <Orbit size={12} className={zeroG ? "animate-spin" : "animate-pulse"} />
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
          transition={{ delay: 0.35, duration: 0.5 }}
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

        {/* CENTERED TITANIC TYPOGRAPHY WITH SWIPE-TO-REVEAL & ZERO-G FLOAT */}
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
              data-cursor-label={isSwipedAway ? "tap to restore text ↺" : "gravity pull 🧲"}
              onClick={() => {
                if (isSwipedAway) {
                  handleToggleOrRestore();
                }
              }}
              className="text-[clamp(56px,14vw,185px)] font-medium leading-[0.88] tracking-[-0.08em] text-[#fffdf0] text-center select-none transition-opacity duration-300"
            >
              <GravityWord zeroG={zeroG} wordIndex={0}>RYAN</GravityWord>
              <GravityWord zeroG={zeroG} wordIndex={1}>ARNAB</GravityWord>
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

        {/* PLAYFUL CENTERED SUBTITLE */}
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

          {/* Fun Space Toy: Zero-G Physics Switch */}
          <motion.button
            whileTap={{ scale: 0.95, y: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 25 }}
            onClick={() => setZeroG(!zeroG)}
            data-cursor-label={zeroG ? "restore gravity 🧲" : "zero-g float 🎈"}
            className={`tactile-switch rounded-xl px-4 py-2.5 sm:py-3 text-[11px] sm:text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2 ${
              zeroG ? "border-[#ffd900]/80 text-[#ffd900] bg-[#ffd900]/15 shadow-[0_0_18px_rgba(255,217,0,0.25)]" : "text-white/70"
            }`}
            title="Toggle Zero-G float state"
          >
            <Sparkles size={13} className={zeroG ? "text-[#ffd900] animate-spin" : "text-white/40"} />
            <span>{zeroG ? "Zero-G: Float" : "Gravity: 1.0G"}</span>
          </motion.button>

        </div>
      </motion.div>
    </motion.section>
  );
}