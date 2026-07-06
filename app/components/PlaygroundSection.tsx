"use client";

import { useState } from "react";
import { experiments } from "../lib/content";
import { GlassCard } from "./SiteSection";
import { useExperience } from "./ExperienceProvider";

export function PlaygroundSection() {
  const { allProjectsDiscovered, clarity, reducedMotion } = useExperience();
  const [open, setOpen] = useState(false);

  const unlocked = allProjectsDiscovered || clarity > 0.55 || reducedMotion;

  if (!unlocked) {
    return (
      <GlassCard dark className="border-dashed border-white/20">
        <p className="font-serif text-2xl text-white/30 sm:text-3xl">
          Some things don&apos;t need a client.
        </p>
        <p className="mt-4 text-sm text-white/30">
          Discover the work above to unlock.
        </p>
      </GlassCard>
    );
  }

  return (
    <div>
      <button
        type="button"
        data-cursor="active"
        onClick={() => setOpen((prev) => !prev)}
        className="text-left font-serif text-2xl tracking-tight transition-colors duration-300 hover:text-accent sm:text-3xl lg:text-4xl"
      >
        Some things don&apos;t need a client.
        <span className="text-accent">{open ? "" : " →"}</span>
      </button>

      <ul
        className={`mt-10 space-y-4 transition-all duration-700 ease-out ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        {experiments.map((item) => (
          <li key={item.title}>
            <GlassCard dark>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-12">
                <span className="min-w-[10rem] font-serif text-xl text-white sm:text-2xl">
                  {item.title}
                </span>
                <span className="text-white/50">{item.note}</span>
              </div>
            </GlassCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
