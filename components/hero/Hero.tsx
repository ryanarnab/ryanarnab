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
    const handleMove = (event: PointerEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = centerX - event.clientX;
      const dy = centerY - event.clientY;

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

    window.addEventListener("pointermove", handleMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handleMove);
    };
  }, [offsetX, offsetY, stretch]);

  
  return (
    <motion.span
      ref={ref}
      className="inline-block origin-center will-change-transform"
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

  return (
    <motion.section
      id="hero"
      style={{
        y: -progress * 250,
        opacity: 1 - progress,
        scale: 1 - progress * 0.08,
      }}
      className="relative flex h-screen w-full items-center overflow-hidden"
    >
      {/* Background Particles */}
      <BackgroundParticles />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] justify-end px-10">
        <div className="max-w-[700px]">
          <h1 className="leading-[0.9] font-medium tracking-[-0.08em] text-[180px] text-white">
            <GravityWord>RYAN</GravityWord>
            <GravityWord>ARNAB</GravityWord>
          </h1>

          <p className="mt-8 ml-auto w-[230px] text-right text-sm leading-5 text-white/80">
           
          </p>
        </div>
      </div>
    </motion.section>
  );
}