"use client";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import { useRef } from "react";

import Hero from "@/components/hero/Hero";
import { WorkIntro } from "@/components/work/WorkSection";

export default function HeroWorksTransition() {
  const transitionRef =
    useRef<HTMLDivElement>(null);

  /*
    Tracks only this 200vh transition stage.

    First viewport:
    Hero is visible.

    Second viewport:
    Works rises over Hero.
  */
  const { scrollYProgress } = useScroll({
    target: transitionRef,
    offset: [
      "start start",
      "end end",
    ],
  });

  /*
    Keep Works below the viewport briefly.

    Then move the panel from:
    100% below → completely covering Hero.
  */
  const worksY = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88],
    ["100%", "100%", "0%"]
  );

  /*
    Rounded corners flatten slightly
    as Works becomes the new page.
  */
  const cornerRadius = useTransform(
    scrollYProgress,
    [0.12, 0.88],
    [36, 0]
  );

  return (
    <div
      ref={transitionRef}
      className="relative h-[200vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* HERO REMAINS ALIVE BEHIND WORKS */}

        <div className="absolute inset-0">
          <Hero />
        </div>

        {/* WORKS ENTERS FROM BELOW */}

        <motion.div
          style={{
            y: worksY,
            borderTopLeftRadius:
              cornerRadius,
            borderTopRightRadius:
              cornerRadius,
          }}
          className="
            absolute
            inset-0
            z-20
            overflow-hidden
            will-change-transform
          "
        >
          <WorkIntro />
        </motion.div>

      </div>
    </div>
  );
}