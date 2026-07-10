"use client";

import {
  createContext,
  useContext,
  useEffect,
} from "react";

import {
  MotionValue,
  motionValue,
} from "framer-motion";

import Lenis from "lenis";

const scrollProgress = motionValue(0);

const ScrollContext =
  createContext<MotionValue<number>>(scrollProgress);

export function ScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
    });

    const updateProgress = ({
      scroll,
    }: {
      scroll: number;
    }) => {
      const viewportHeight = window.innerHeight;

      const progress = Math.min(
        Math.max(scroll / viewportHeight, 0),
        1
      );

      scrollProgress.set(progress);
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
    };
  }, []);

  return (
    <ScrollContext.Provider value={scrollProgress}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollProgress() {
  return useContext(ScrollContext);
}