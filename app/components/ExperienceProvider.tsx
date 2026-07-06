"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Section = "hero" | "work" | "about" | "playground" | "contact";

type ExperienceContextValue = {
  cursor: { x: number; y: number };
  setCursor: (cursor: { x: number; y: number }) => void;
  clarity: number;
  discoveries: Set<string>;
  discover: (id: string) => void;
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  allProjectsDiscovered: boolean;
  reducedMotion: boolean;
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [cursor, setCursor] = useState({ x: -9999, y: -9999 });
  const [clarity, setClarity] = useState(0);
  const [discoveries, setDiscoveries] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [reducedMotion, setReducedMotion] = useState(false);

  const discover = useCallback((id: string) => {
    setDiscoveries((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const onMotionChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    motionQuery.addEventListener("change", onMotionChange);
    return () => motionQuery.removeEventListener("change", onMotionChange);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      setClarity(Math.min(1, progress * 1.4));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--clarity",
      String(clarity),
    );
  }, [clarity]);

  const allProjectsDiscovered = useMemo(
    () =>
      ["meridian", "forma", "northwind", "atlas"].every((id) =>
        discoveries.has(id),
      ),
    [discoveries],
  );

  const value = useMemo(
    () => ({
      cursor,
      setCursor,
      clarity,
      discoveries,
      discover,
      activeSection,
      setActiveSection,
      allProjectsDiscovered,
      reducedMotion,
    }),
    [
      cursor,
      clarity,
      discoveries,
      discover,
      activeSection,
      allProjectsDiscovered,
      reducedMotion,
    ],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience() {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperience must be used within ExperienceProvider");
  }
  return context;
}
