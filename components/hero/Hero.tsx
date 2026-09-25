"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import Image from "next/image";
import { useEffect, useRef } from "react";
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

import { useState } from "react";
import { ArrowDown, Orbit, Sparkles } from "lucide-react";

export default function Hero() {
  const progress = useScrollProgress();
  const [zeroG, setZeroG] = useState(true);

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
          className="mb-6 sm:mb-8"
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

        {/* CENTERED TITANIC TYPOGRAPHY WITH INDIVIDUAL ZERO-G FLOATING LETTERS */}
        <div className="w-full text-center">
          <h1
            data-warp-text
            data-cursor-label="gravity pull 🧲"
            className="text-[clamp(56px,14vw,185px)] font-medium leading-[0.88] tracking-[-0.08em] text-[#fffdf0] text-center select-none"
          >
            <GravityWord zeroG={zeroG} wordIndex={0}>RYAN</GravityWord>
            <GravityWord zeroG={zeroG} wordIndex={1}>ARNAB</GravityWord>
          </h1>
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