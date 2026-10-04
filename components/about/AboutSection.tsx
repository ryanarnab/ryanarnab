"use client";

import { motion } from "framer-motion";
import { Eye, Layers, Cpu, Compass, Radio, Sparkles, Shield, Crosshair } from "lucide-react";

const CAPABILITIES = [
  {
    icon: Eye,
    title: "Visual Identity Systems",
    desc: "Crafting iconic brand worlds, relativistic typography hierarchies, and cohesive design systems that adapt across spatial and digital mediums.",
    tools: ["Logo Architecture", "Design Systems", "Brand Manuals"],
  },
  {
    icon: Layers,
    title: "Motion & Kinetic Choreography",
    desc: "Treating time, momentum and physics as structural design elements to impart digital artifacts with soul, weight, and rhythm.",
    tools: ["After Effects", "Kinetic Typography", "Lottie / Video"],
  },
  {
    icon: Cpu,
    title: "Creative Technology & Interaction",
    desc: "Engineering immersive web experiences with Next.js, Framer Motion, and WebGL where tactile micro-interactions reward user curiosity.",
    tools: ["Next.js & React", "TypeScript", "Tailwind CSS"],
  },
  {
    icon: Compass,
    title: "Spatial & Editorial Computing",
    desc: "Exploring three-dimensional typography specimens, digital installations, and experimental visual interfaces built for exploratory navigation.",
    tools: ["3D CGI / Blender", "Spatial UI", "Shader Studies"],
  },
];

const METRICS = [
  { label: "ORBIT / BASE", value: "Guwahati, IN · 26.14°N 91.73°E" },
  { label: "DISCIPLINE", value: "Communication Design & Creative Tech" },
  { label: "EDUCATION", value: "B.Des Communication Design" },
  { label: "CORE PHILOSOPHY", value: "Curiosity Creates Better" },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 w-full overflow-hidden bg-transparent text-white px-6 sm:px-10 lg:px-16 py-24 sm:py-36"
    >
      <div className="mx-auto w-full max-w-[1440px]">

        {/* SECTION HEADER — Angular */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-14 sm:mb-20 flex flex-col sm:flex-row sm:items-end justify-between edge-divider pb-6 gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-6 w-6 flex items-center justify-center bg-[#d4b068]/10 text-[#d4b068] border border-[#d4b068]/30"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              >
                <Shield size={10} />
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#d4b068] font-mono font-bold">
                Sector 02 // The Observatory Deck
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-[-0.04em] text-[#fffdf0]">
              Observation <span className="text-[#d4b068]">&amp;</span> Manifesto
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono tracking-widest text-white/40 uppercase">
              Orbital Radar Aligned
            </span>
            <div className="h-8 w-[2px] bg-gradient-to-b from-[#d4b068] to-transparent" />
          </div>
        </motion.div>

        {/* BENTO GRID: ROW 1 (MANIFESTO + TELEMETRY CARD) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 mb-6">
          
          {/* MANIFESTO CARD (8 COLS) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            data-cursor-label="manifesto ✦"
            className="lg:col-span-8 flex flex-col justify-between angular-panel p-8 sm:p-12 transition-all"
          >
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-5 w-5 flex items-center justify-center text-[#d4b068]"
                  style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                >
                  <Sparkles size={12} />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#d4b068] font-bold">
                  Core Philosophy
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#d4b068]/20 to-transparent ml-3" />
              </div>

              <h3 className="text-[clamp(32px,5vw,70px)] font-bold leading-[0.92] tracking-[-0.05em] text-[#fffdf0] mb-8">
                I DESIGN BECAUSE
                <br />
                I&apos;M <span className="text-[#d4b068]">CURIOUS</span> ABOUT
                <br />
                HOW THINGS COULD
                <br />
                <span className="text-[#d4b068]/35">FEEL DIFFERENT.</span>
              </h3>
            </div>

            <div className="pt-6 border-t border-white/8">
              <p className="text-base sm:text-lg leading-relaxed text-[#fffdf0]/70 font-normal max-w-2xl">
                I&apos;m <span className="text-[#d4b068] font-bold">Arnab Ghosh</span>, a communication designer and creative technologist based in Guwahati. I treat interfaces as tactical arenas — engineering environments where kinetic motion, typography, and interactive physics reward curiosity.
              </p>
            </div>
          </motion.div>

          {/* TELEMETRY MATRIX CARD (4 COLS) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            data-cursor-label="orbital telemetry 🛰️"
            className="lg:col-span-4 flex flex-col justify-between angular-panel p-6 sm:p-8 transition-all"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-6">
                <div className="flex items-center gap-2">
                  <Radio size={12} className="text-[#d4b068] animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4b068] font-bold">
                    Deck Telemetry
                  </span>
                </div>
                <span className="h-2 w-2 bg-[#d4b068] shadow-[0_0_8px_#d4b068]"
                  style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                />
              </div>

              <div className="space-y-4">
                {METRICS.map((m) => (
                  <div key={m.label} className="border-b border-white/5 pb-3">
                    <span className="text-[9px] font-mono tracking-[0.2em] text-[#d4b068]/60 uppercase block mb-1 font-bold">
                      {m.label}
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-white/85 font-medium block">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/8 flex items-center justify-between text-[10px] font-mono text-white/35">
              <span className="flex items-center gap-1.5">
                <Crosshair size={10} className="text-[#d4b068]" />
                RADAR: SYNCHRONIZED
              </span>
              <span className="font-bold text-[#d4b068]/50">2026.10</span>
            </div>
          </motion.div>

        </div>

        {/* BENTO GRID: ROW 2 (4 CORE MISSION DISCIPLINES) */}
        <div>
          <div className="mb-6 flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-8 bg-[#d4b068]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#d4b068] font-bold">
                Core Mission Disciplines // Spectrum
              </span>
            </div>
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
              4 Tiles
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  data-cursor-label={`spec: ${cap.title.toLowerCase()} ✦`}
                  className="group relative flex flex-col justify-between angular-panel-sm p-6 sm:p-7 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div>
                    <div className="mb-6 flex h-12 w-12 items-center justify-center bg-[#d4b068]/8 text-[#d4b068] border border-[#d4b068]/20 transition-transform group-hover:scale-110"
                      style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
                    >
                      <Icon size={20} />
                    </div>

                    <h3 className="text-lg font-bold tracking-tight text-[#fffdf0] mb-2.5 group-hover:text-[#d4b068] transition-colors">
                      {cap.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-white/55 mb-6">
                      {cap.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/8 flex flex-wrap gap-1.5">
                    {cap.tools.map((t) => (
                      <span
                        key={t}
                        className="bg-white/6 px-2.5 py-1 text-[9px] font-mono text-white/50 group-hover:text-white/80 transition-colors uppercase tracking-wider"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}