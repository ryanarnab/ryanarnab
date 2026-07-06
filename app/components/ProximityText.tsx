"use client";

import { useEffect, useRef, useState } from "react";
import { useExperience } from "./ExperienceProvider";

const PROXIMITY_RADIUS = 120;

function proximityOpacity(
  cursorX: number,
  cursorY: number,
  centerX: number,
  centerY: number,
  clarity: number,
  reducedMotion: boolean,
) {
  if (reducedMotion) return 1;

  const distance = Math.hypot(cursorX - centerX, cursorY - centerY);
  const near = Math.max(0, 1 - distance / PROXIMITY_RADIUS);
  const base = 0.06 + clarity * 0.22;
  return Math.min(1, base + near * 0.88);
}

export function ProximityText({
  text,
  x,
  y,
  projectId,
  className = "",
  dark = false,
}: {
  text: string;
  x: number;
  y: number;
  projectId?: string;
  className?: string;
  dark?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { cursor, clarity, discover, reducedMotion } = useExperience();
  const [opacity, setOpacity] = useState(reducedMotion ? 1 : 0.06);
  const [discovered, setDiscovered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const next = proximityOpacity(
      cursor.x,
      cursor.y,
      centerX,
      centerY,
      clarity,
      reducedMotion,
    );

    setOpacity(next);

    if (projectId && next > 0.55 && !discovered) {
      setDiscovered(true);
      discover(projectId);
    }
  }, [cursor, clarity, discover, projectId, discovered, reducedMotion]);

  return (
    <span
      ref={ref}
      className={`pointer-events-none absolute max-w-[14rem] text-sm leading-snug tracking-wide transition-opacity duration-500 ease-out ${dark ? "text-white/40" : "text-muted"} ${className} ${
        discovered && projectId ? (dark ? "text-white/80" : "text-foreground") : ""
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        opacity,
        transform: "translate(-50%, -50%)",
      }}
      aria-hidden="true"
    >
      {text}
      {discovered && projectId && (
        <span className="text-accent" aria-hidden="true">
          .
        </span>
      )}
    </span>
  );
}
