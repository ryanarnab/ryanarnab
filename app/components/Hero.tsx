"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { proximityFragments, synonyms } from "../lib/content";
import { ProximityText } from "./ProximityText";
import { useExperience } from "./ExperienceProvider";

export function Hero() {
  const { reducedMotion } = useExperience();
  const [revealed, setRevealed] = useState(reducedMotion);
  const [wordIndex, setWordIndex] = useState(0);
  const [hoveringChase, setHoveringChase] = useState(false);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetPause = useCallback(() => {
    if (reducedMotion) return;
    setRevealed(false);
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => setRevealed(true), 1400);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      setRevealed(true);
      return;
    }

    resetPause();
    return () => {
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
    };
  }, [reducedMotion, resetPause]);

  useEffect(() => {
    if (!hoveringChase || reducedMotion) {
      if (cycleTimer.current) clearInterval(cycleTimer.current);
      return;
    }

    cycleTimer.current = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % synonyms.length);
    }, 900);

    return () => {
      if (cycleTimer.current) clearInterval(cycleTimer.current);
    };
  }, [hoveringChase, reducedMotion]);

  return (
    <div
      className="relative min-h-[60vh]"
      onMouseMove={resetPause}
    >
      {proximityFragments.map((fragment) => (
        <ProximityText
          key={fragment.id}
          text={fragment.text}
          x={fragment.x}
          y={fragment.y}
          projectId={"projectId" in fragment ? fragment.projectId : undefined}
          dark
        />
      ))}

      <div className="relative z-10">
        <h1 className="font-serif text-[clamp(2.75rem,9vw,6.5rem)] leading-[0.95] tracking-tight">
          Curiosity Creates
          <br />
          <span className="gradient-text">Better</span>
          <span
            className={`transition-all duration-700 ease-out ${
              revealed ? "text-accent opacity-100 drop-shadow-[0_0_24px_rgba(232,255,0,0.5)]" : "opacity-0"
            }`}
          >
            .
          </span>
        </h1>

        <p
          className="mt-16 max-w-xl text-xl leading-relaxed text-white/60 sm:mt-20 sm:text-2xl"
          onMouseEnter={() => setHoveringChase(true)}
          onMouseLeave={() => {
            setHoveringChase(false);
            setWordIndex(0);
          }}
        >
          I chase{" "}
          <span
            className="inline-block min-w-[9ch] rounded-lg border border-white/10 bg-white/5 px-2 text-white shadow-inner shadow-black/20 transition-all duration-500"
            data-cursor="active"
          >
            {synonyms[wordIndex]}
          </span>{" "}
          problems.
        </p>

        <p className="mt-8 max-w-sm text-base leading-relaxed text-white/40">
          Design is how I explore ideas.
        </p>
      </div>

      <p
        className="absolute -bottom-4 right-0 text-sm tracking-[0.18em] text-white/30 uppercase"
        aria-hidden="true"
      >
        Move slowly.
      </p>
    </div>
  );
}
