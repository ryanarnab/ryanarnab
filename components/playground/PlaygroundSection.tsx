"use client";

import { motion } from "framer-motion";

const experiments = [
  {
    number: "01",
    title: "MOTION STUDIES",
    type: "MOTION · AFTER EFFECTS",
    year: "2026",
  },
  {
    number: "02",
    title: "3D EXPLORATIONS",
    type: "BLENDER · CGI",
    year: "2025—26",
  },
  {
    number: "03",
    title: "BEATPULSE",
    type: "INTERACTION · HAPTICS",
    year: "2026",
  },
  {
    number: "04",
    title: "VISUAL FRAGMENTS",
    type: "GRAPHICS · EXPERIMENTS",
    year: "2024—26",
  },
];

export default function PlaygroundSection() {
  return (
    <section
      id="playground"
      className="relative w-full overflow-hidden bg-black text-white"
    >
      <div className="mx-auto w-full max-w-[1400px] px-10 py-40">

        {/* HEADER */}
        <div className="mb-24 flex items-center justify-between border-b border-white/10 pb-5">
          <span className="text-xs uppercase tracking-[0.16em] text-white/35">
            Playground / Unfinished Signals
          </span>

          <span className="text-xs text-white/25">
            03
          </span>
        </div>

        {/* TITLE */}
        <motion.div
          initial={{
            opacity: 0,
            y: 60,
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
          className="mb-32"
        >
          <p className="mb-7 max-w-[380px] text-sm leading-6 text-white/40">
            Things made without a brief. Experiments, unfinished ideas and
            random curiosities that were interesting enough to follow.
          </p>

          <h2 className="text-[clamp(80px,14vw,200px)] font-medium leading-[0.8] tracking-[-0.085em]">
            PLAY
            <br />
            GROUND
          </h2>
        </motion.div>

        {/* EXPERIMENTS */}
        <div>
          {experiments.map((experiment, index) => (
            <motion.article
              key={experiment.number}
              initial={{
                opacity: 0,
                y: 30,
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
                delay: index * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="
                group
                grid
                grid-cols-12
                items-center
                border-t
                border-white/10
                py-8
              "
            >
              <span className="col-span-1 text-xs text-white/25">
                {experiment.number}
              </span>

              <h3
                className="
                  col-span-6
                  text-[clamp(32px,4vw,62px)]
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

              <span className="col-span-3 text-xs uppercase tracking-[0.12em] text-white/30">
                {experiment.type}
              </span>

              <span className="col-span-2 text-right text-xs text-white/30">
                {experiment.year}
              </span>
            </motion.article>
          ))}

          <div className="border-t border-white/10" />
        </div>

      </div>
    </section>
  );
}