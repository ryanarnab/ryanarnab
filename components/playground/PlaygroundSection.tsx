"use client";

import { motion } from "framer-motion";

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

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

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
            <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#ffd900]">
              Sector 03 // Orbital Research Lab
            </span>
          </div>

          <span className="font-mono text-xs tracking-widest text-[#ffd900]/70">
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
          <p className="mb-6 max-w-[400px] text-xs sm:text-sm leading-relaxed text-[#fffdf0]/60">
            Artifacts built without formal constraints. Unfinished orbits, computational explorations,
            and acoustic experiments interesting enough to preserve.
          </p>

          <h2 className="text-[clamp(52px,13vw,190px)] font-medium leading-[0.82] tracking-[-0.085em] text-[#fffdf0]">
            PLAY
            <br />
            <span className="text-[#ffd900]">GROUND</span>
          </h2>
        </motion.div>

        {/* EXPERIMENTS */}
        <div className="divide-y divide-white/10 border-b border-white/10">
          {experiments.map((experiment, index) => (
            <motion.article
              key={experiment.number}
              onMouseEnter={() => window.setCursorLabel?.("EXPERIMENT")}
              onMouseLeave={() => window.setCursorLabel?.("")}
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
                hover:bg-[#ffd900]/[0.04]
                active:bg-[#ffd900]/[0.08]
                px-3 sm:px-5
                rounded-2xl
                cursor-pointer
              "
            >
              <span className="col-span-12 sm:col-span-2 font-mono text-[11px] uppercase tracking-widest text-[#ffd900]/70 group-hover:text-[#ffd900] transition-colors">
                {experiment.number}
              </span>

              <h3
                className="
                  col-span-12 sm:col-span-6
                  text-[clamp(24px,3.8vw,56px)]
                  font-medium
                  tracking-[-0.055em]
                  text-[#fffdf0]/80
                  transition-colors
                  duration-300
                  group-hover:text-[#ffd900]
                "
              >
                {experiment.title}
              </h3>

              <span className="col-span-8 sm:col-span-3 text-[11px] sm:text-xs uppercase tracking-[0.14em] text-white/40 group-hover:text-white/80 transition-colors">
                {experiment.type}
              </span>

              <span className="col-span-4 sm:col-span-1 text-right font-mono text-[11px] sm:text-xs text-[#ffd900]/60 group-hover:text-[#ffd900]">
                {experiment.year}
              </span>
            </motion.article>
          ))}
        </div>

        {/* ENTER FULL LAB CALLOUT */}
        <div className="mt-12 flex justify-end">
          <Link
            href="/playground"
            onMouseEnter={() => window.setCursorLabel?.("OPEN LAB")}
            onMouseLeave={() => window.setCursorLabel?.("")}
            className="group inline-flex items-center gap-3 rounded-full border border-[#ffd900]/30 bg-[#ffd900]/10 px-6 py-3.5 text-xs font-mono tracking-widest text-[#ffd900] uppercase transition-all duration-300 hover:border-[#ffd900] hover:bg-[#ffd900] hover:text-black hover:shadow-[0_0_30px_rgba(255,217,0,0.4)]"
          >
            <span>Enter Full Research Lab Bench</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}