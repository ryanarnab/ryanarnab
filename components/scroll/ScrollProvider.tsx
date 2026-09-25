"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";

import {
  MotionValue,
  motionValue,
} from "framer-motion";

import Lenis from "lenis";

const heroScrollProgress = motionValue(0);
const documentScrollProgress = motionValue(0);

interface ScrollContextValue {
  heroProgress: MotionValue<number>;
  documentProgress: MotionValue<number>;
  scrollTo: (target: string | number | HTMLElement) => void;
}

const ScrollContext = createContext<ScrollContextValue>({
  heroProgress: heroScrollProgress,
  documentProgress: documentScrollProgress,
  scrollTo: () => {},
});

export function ScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;

    const updateProgress = ({
      scroll,
      limit,
    }: {
      scroll: number;
      limit: number;
    }) => {
      const viewportHeight = window.innerHeight;

      const heroProg = Math.min(
        Math.max(scroll / viewportHeight, 0),
        1
      );
      heroScrollProgress.set(heroProg);

      const maxScroll = limit > 0 ? limit : Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
      const docProg = Math.min(Math.max(scroll / maxScroll, 0), 1);
      documentScrollProgress.set(docProg);
    };

    lenis.on("scroll", updateProgress);

    let animationFrame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    };

    animationFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (target: string | number | HTMLElement) => {
    if (typeof target === "string" && target.startsWith("#")) {
      const el = document.querySelector(target);
      if (!el) {
        if (target === "#hero" || target === "#origin") {
          lenisRef.current?.scrollTo(0, { duration: 1.4 });
        }
        return;
      }
    }
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { duration: 1.4 });
    } else if (typeof target === "string") {
      const el = document.querySelector(target);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ScrollContext.Provider
      value={{
        heroProgress: heroScrollProgress,
        documentProgress: documentScrollProgress,
        scrollTo,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollProgress() {
  const context = useContext(ScrollContext);
  return context.heroProgress;
}

export function useDocumentScrollProgress() {
  const context = useContext(ScrollContext);
  return context.documentProgress;
}

export function useScrollController() {
  return useContext(ScrollContext);
}