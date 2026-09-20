"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const experiments = [
  {
    number: "EXP // 01",
    title: "MOTION LABS",
    type: "AFTER EFFECTS · KINETIC",
    year: "2026",
  },
  {
    number: "EXP // 02",
    title: "3D TOPOLOGY",
    type: "BLENDER · SPATIAL CGI",
    year: "2025—26",
  },
  {
    number: "EXP // 03",
    title: "GRAVITON PULSE",
    type: "INTERACTION · HAPTICS",
    year: "2026",
  },
  {
    number: "EXP // 04",
    title: "COSMIC FRAGMENTS",
    type: "CREATIVE CODE · SHADERS",
    year: "2024—26",
  },
];

export default function PlaygroundSection() {
  return (
    <section
      id="playground"
      className="relative w-full overflow-hidden bg-black text-white px-6 sm:px-10 py-24 sm:py-40"
    >
      <div className="mx-auto w-full max-w-[1400px]">

        {/* HEADER */}
        <div className="mb-16 sm:mb-24 flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">
              Orbital Lab // Signal Experiments
            </span>
          </div>

          <span className="font-mono text-xs tracking-widest text-white/30">
            03
          </span>
        </div>

        {/* TITLE */}
        <motion.div
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-16 sm:mb-28"
        >
          <p className="mb-6 max-w-[400px] text-xs sm:text-sm leading-relaxed text-white/45">
            Artifacts built without formal constraints. Unfinished orbits, computational explorations,
            and acoustic experiments interesting enough to preserve.
          </p>

          <h2 className="text-[clamp(52px,13vw,190px)] font-medium leading-[0.82] tracking-[-0.085em] text-white">
            PLAY
            <br />
            GROUND
          </h2>
        </motion.div>

        {/* EXPERIMENTS */}
        <div className="divide-y divide-white/10 border-b border-white/10">
          {experiments.map((experiment, index) => (
            <motion.article
              key={experiment.number}
              initial={{
                opacity: 0,
                y: 25,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.4,
              }}
              transition={{
                duration: 0.65,
                delay: index * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                group
                grid
                grid-cols-12
                items-baseline sm:items-center
                gap-y-2 sm:gap-y-0
                py-6 sm:py-8
                transition-colors
                duration-300
                hover:bg-white/[0.02]
                active:bg-white/[0.04]
                px-2 sm:px-4
                rounded-xl
              "
            >
              <span className="col-span-12 sm:col-span-2 font-mono text-[11px] uppercase tracking-widest text-white/30">
                {experiment.number}
              </span>

              <h3
                className="
                  col-span-12 sm:col-span-6
                  text-[clamp(24px,3.8vw,56px)]
                  font-medium
                  tracking-[-0.055em]
                  text-white/75
                  transition-colors
                  duration-300
                  group-hover:text-white
                "
              >
                {experiment.title}
              </h3>

              <span className="col-span-8 sm:col-span-3 text-[11px] sm:text-xs uppercase tracking-[0.14em] text-white/35">
                {experiment.type}
              </span>

              <span className="col-span-4 sm:col-span-1 text-right font-mono text-[11px] sm:text-xs text-white/30">
                {experiment.year}
              </span>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}