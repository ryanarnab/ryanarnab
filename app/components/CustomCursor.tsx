"use client";

import { useEffect, useState } from "react";
import { useExperience } from "./ExperienceProvider";

export function CustomCursor() {
  const { setCursor } = useExperience();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    const onMove = (event: MouseEvent) => {
      const next = { x: event.clientX, y: event.clientY };
      setPosition(next);
      setCursor(next);
      if (!visible) setVisible(true);
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      setActive(!!target.closest("a, button, [data-cursor='active']"));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.body.addEventListener("mouseleave", onLeave);
    document.body.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.removeEventListener("mouseleave", onLeave);
      document.body.removeEventListener("mouseenter", onEnter);
    };
  }, [setCursor, visible]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden md:block"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
      }}
    >
      <div
        className={`size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out ${
          active ? "scale-[2] bg-accent" : "scale-100 bg-foreground"
        }`}
      />
    </div>
  );
}
