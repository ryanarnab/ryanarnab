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

const scrollProgress = motionValue(0);

const ScrollContext =
  createContext<MotionValue<number>>(scrollProgress);

export function ScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const viewportHeight = window.innerHeight;

      const progress = Math.min(
        Math.max(window.scrollY / viewportHeight, 0),
        1
      );

      scrollProgress.set(progress);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    updateScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", updateScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateScroll);
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