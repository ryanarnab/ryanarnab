"use client";

import { motion } from "framer-motion";
import { Eye, Layers, Cpu, Compass, Orbit, Radio, Sparkles } from "lucide-react";

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

        {/* SECTION LABEL */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-14 sm:mb-20 flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#ffd900] font-mono font-semibold">
                Sector 02 // The Observatory Deck
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#fffdf0]">
              Observation & Manifesto
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-mono tracking-widest text-white/50">
              ORBITAL RADAR ALIGNED
            </span>
            <span className="font-mono text-xs tracking-widest text-[#ffd900]/70">
              02
            </span>
          </div>
        </motion.div>

        {/* BENTO GRID: ROW 1 (MANIFESTO + TELEMETRY CARD) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-8">
          
          {/* MANIFESTO CARD (8 COLS) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            data-cursor-label="manifesto ✦"
            className="lg:col-span-8 flex flex-col justify-between rounded-3xl liquid-glass p-8 sm:p-12 hover:border-[#ffd900]/30 transition-all"
          >
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={14} className="text-[#ffd900]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#ffd900]">
                  Core Philosophy
                </span>
              </div>

              <h3 className="text-[clamp(32px,5vw,70px)] font-medium leading-[0.94] tracking-[-0.06em] text-[#fffdf0] mb-8">
                I DESIGN BECAUSE
                <br />
                I&apos;M <span className="text-[#ffd900]">CURIOUS</span> ABOUT
                <br />
                HOW THINGS COULD
                <br />
                <span className="text-[#ffd900]/45">FEEL DIFFERENT.</span>
              </h3>
            </div>

            <div className="pt-6 border-t border-white/10">
              <p className="text-base sm:text-lg leading-relaxed text-[#fffdf0]/80 font-normal max-w-2xl">
                I&apos;m <span className="text-[#ffd900] font-semibold">Arnab Ghosh</span>, a communication designer and creative technologist based in Guwahati. I treat interfaces as tactile cosmic sandboxes — engineering environments where kinetic motion, typography, and interactive physics reward curiosity.
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
            className="lg:col-span-4 flex flex-col justify-between rounded-3xl liquid-glass p-6 sm:p-8 hover:border-[#ffd900]/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <Radio size={14} className="text-[#ffd900] animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest text-[#ffd900]">
                    Deck Telemetry
                  </span>
                </div>
                <span className="h-2 w-2 rounded-full bg-[#ffd900] shadow-[0_0_8px_#ffd900]" />
              </div>

              <div className="space-y-4">
                {METRICS.map((m) => (
                  <div key={m.label} className="border-b border-white/5 pb-3">
                    <span className="text-[10px] font-mono tracking-widest text-[#ffd900]/70 uppercase block mb-1">
                      {m.label}
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-white/90 font-medium block">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40">
              <span className="flex items-center gap-1.5">
                <Orbit size={12} className="animate-spin text-[#ffd900]" />
                RADAR: SYNCHRONIZED
              </span>
              <span>2026.09</span>
            </div>
          </motion.div>

        </div>

        {/* BENTO GRID: ROW 2 (4 CORE MISSION DISCIPLINES) */}
        <div>
          <div className="mb-6 flex items-center justify-between px-1">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#ffd900]">
              CORE MISSION DISCIPLINES // SPECTRUM
            </span>
            <span className="text-[11px] font-mono text-white/40">
              4 TILES
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  className="group relative flex flex-col justify-between rounded-3xl liquid-glass p-6 sm:p-7 transition-all duration-300 hover:scale-[1.02] hover:border-[#ffd900]/40"
                >
                  <div>
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-[#ffd900] border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-transform group-hover:scale-105">
                      <Icon size={20} />
                    </div>

                    <h3 className="text-lg font-semibold tracking-tight text-[#fffdf0] mb-2.5 group-hover:text-[#ffd900] transition-colors">
                      {cap.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-white/65 mb-6">
                      {cap.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                    {cap.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-mono text-white/70 group-hover:text-white transition-colors"
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