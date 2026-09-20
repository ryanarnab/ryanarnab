"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import { useEffect, useRef } from "react";
import { useScrollProgress } from "../scroll/ScrollProvider";
import BackgroundParticles from "./BackgroundParticles";

function GravityWord({
  children,
}: {
  children: string;
}) {
  return (
    <span className="block">
      {children.split("").map((letter, index) => (
        <GravityLetter
          key={`${letter}-${index}`}
          letter={letter}
        />
      ))}
    </span>
  );
}

function GravityLetter({
  letter,
}: {
  letter: string;
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
  }, [offsetX, offsetY, stretch]);

  return (
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
  );
}

export default function Hero() {
  const progress = useScrollProgress();

  const heroY = useTransform(progress, [0, 1], [0, -420]);
  const heroOpacity = useTransform(progress, [0, 0.74], [1, 0]);
  const heroScale = useTransform(progress, [0, 1], [1, 0.82]);

  return (
    <motion.section
      id="hero"
      className="sticky top-0 flex min-h-screen w-full items-center overflow-hidden"
      style={{
        y: heroY,
        opacity: heroOpacity,
        scale: heroScale,
      }}   
    >
      {/* Background Celestial Star Particles */}
      <BackgroundParticles />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] justify-end px-6 sm:px-10 pt-20 sm:pt-0">
        <div className="max-w-[850px]">

          {/* TELEMETRY TAG */}
          <div className="mb-4 flex items-center justify-end gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
            <span>Sector 01 // Orbital Station</span>
          </div>

          <h1
            data-warp-text
            data-wrap-text
            className="text-[clamp(52px,13vw,180px)] font-medium leading-[0.88] tracking-[-0.08em] text-white"
          >
            <GravityWord>RYAN</GravityWord>
            <GravityWord>ARNAB</GravityWord>
          </h1>

          <p className="mt-6 sm:mt-8 ml-auto max-w-[300px] text-right text-xs sm:text-sm leading-relaxed text-white/60">
            Communication Designer & Creative Technologist exploring visual identity, interaction and motion in digital space.
          </p>
        </div>
      </div>
    </motion.section>
  );
}