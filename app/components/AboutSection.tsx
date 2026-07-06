"use client";

import { useEffect, useRef, useState } from "react";
import { GlassCard } from "./SiteSection";
import { useExperience } from "./ExperienceProvider";

export function AboutSection() {
  const { reducedMotion } = useExperience();
  const [expanded, setExpanded] = useState(reducedMotion);
  const lingerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const startLinger = () => {
    if (reducedMotion) return;
    if (lingerTimer.current) clearTimeout(lingerTimer.current);
    lingerTimer.current = setTimeout(() => setExpanded(true), 1800);
  };

  const cancelLinger = () => {
    if (reducedMotion) return;
    if (lingerTimer.current) clearTimeout(lingerTimer.current);
    setExpanded(false);
  };

  useEffect(() => {
    if (!reducedMotion) return;
    setExpanded(true);
  }, [reducedMotion]);

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startLinger();
        else cancelLinger();
      },
      { threshold: 0.6 },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      if (lingerTimer.current) clearTimeout(lingerTimer.current);
    };
  }, [reducedMotion]);

  return (
    <div ref={ref}>
      <p className="font-serif text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
        Design is how I explore ideas.
      </p>

      <div
        className={`mt-10 overflow-hidden transition-all duration-700 ease-out ${
          expanded ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <GlassCard className="mt-2 space-y-6">
          <p className="text-lg leading-relaxed text-muted sm:text-xl">
            RyanArnab is a communication designer working at the edge of
            identity, product, and editorial craft — chasing questions more than
            answers.
          </p>
          <p className="text-lg leading-relaxed text-muted sm:text-xl">
            Curiosity isn&apos;t a tagline here. It&apos;s the method — the
            reason every project starts incomplete and finishes somewhere
            unexpected.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
