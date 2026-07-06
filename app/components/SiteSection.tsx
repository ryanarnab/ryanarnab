"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useExperience } from "./ExperienceProvider";

type Section = "hero" | "work" | "about" | "playground" | "contact";

const sectionMeta: Record<
  Section,
  {
    index: string;
    label: string;
    outer: string;
    glow: string;
    panel: string;
    labelClass: string;
    dark: boolean;
  }
> = {
  hero: {
    index: "01",
    label: "Introduction",
    outer:
      "relative overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-black text-white",
    glow: "bg-accent/25",
    panel:
      "rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-12 lg:p-16",
    labelClass: "text-white/40",
    dark: true,
  },
  work: {
    index: "02",
    label: "Selected Work",
    outer:
      "relative overflow-hidden bg-gradient-to-b from-neutral-100 via-white to-neutral-50 text-foreground",
    glow: "bg-neutral-400/20",
    panel:
      "rounded-[2rem] border border-white/80 bg-white/55 p-8 shadow-xl shadow-neutral-300/40 backdrop-blur-xl sm:p-12 lg:p-14",
    labelClass: "text-muted",
    dark: false,
  },
  about: {
    index: "03",
    label: "About",
    outer:
      "relative overflow-hidden bg-gradient-to-tr from-neutral-50 via-[#f7f7ef] to-neutral-100 text-foreground",
    glow: "bg-accent/30",
    panel:
      "rounded-[2rem] border border-white/70 bg-white/45 p-8 shadow-2xl shadow-neutral-400/25 backdrop-blur-2xl sm:p-12 lg:p-14",
    labelClass: "text-muted",
    dark: false,
  },
  playground: {
    index: "04",
    label: "Playground",
    outer:
      "relative overflow-hidden bg-gradient-to-bl from-neutral-900 via-neutral-950 to-black text-white",
    glow: "bg-accent/20",
    panel:
      "rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/60 backdrop-blur-2xl sm:p-12 lg:p-14",
    labelClass: "text-white/40",
    dark: true,
  },
  contact: {
    index: "05",
    label: "Contact",
    outer:
      "relative overflow-hidden bg-gradient-to-t from-neutral-950 via-neutral-900 to-neutral-800 text-white",
    glow: "bg-white/10",
    panel:
      "rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-12 lg:p-14",
    labelClass: "text-white/40",
    dark: true,
  },
};

export function SiteSection({
  section,
  id,
  children,
  fullHeight = false,
  panel = true,
}: {
  section: Section;
  id?: string;
  children: ReactNode;
  fullHeight?: boolean;
  panel?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { setActiveSection } = useExperience();
  const meta = sectionMeta[section];

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActiveSection(section);
      },
      { threshold: 0.3 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [section, setActiveSection]);

  return (
    <section
      ref={ref}
      id={id}
      className={`${meta.outer} ${fullHeight ? "min-h-screen" : ""}`}
      data-section={section}
      data-tone={meta.dark ? "dark" : "light"}
    >
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl ${meta.glow}`}
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full blur-3xl ${meta.glow} opacity-60`}
        aria-hidden="true"
      />

      <div
        className={`relative mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28 lg:py-32 ${
          fullHeight ? "flex min-h-screen flex-col justify-center" : ""
        }`}
      >
        <div className="mb-8 flex items-center gap-4 sm:mb-10">
          <span
            className={`font-mono text-xs tracking-widest ${meta.labelClass}`}
          >
            {meta.index}
          </span>
          <span className={`h-px flex-1 ${meta.dark ? "bg-white/10" : "bg-border"}`} />
          <span
            className={`text-xs tracking-[0.2em] uppercase ${meta.labelClass}`}
          >
            {meta.label}
          </span>
        </div>

        {panel ? (
          <div className={meta.panel}>{children}</div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export function GlassCard({
  children,
  className = "",
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 shadow-lg backdrop-blur-lg transition-all duration-500 sm:p-8 ${
        dark
          ? "border-white/10 bg-white/5 shadow-black/30 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-black/40"
          : "border-white/80 bg-white/60 shadow-neutral-300/30 hover:-translate-y-0.5 hover:border-white hover:bg-white/75 hover:shadow-xl hover:shadow-neutral-300/50"
      } ${className}`}
    >
      {children}
    </div>
  );
}
