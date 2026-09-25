"use client";

import { motion } from "framer-motion";
import { Eye, Layers, Cpu, Compass } from "lucide-react";

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
  ["ORBIT / BASE", "GUWAHATI, INDIA · 26.14°N 91.73°E"],
  ["DISCIPLINE", "COMMUNICATION DESIGN & CREATIVE TECHNOLOGY"],
  ["EDUCATION", "B.DES COMMUNICATION DESIGN"],
  ["CORE PHILOSOPHY", "CURIOSITY CREATES BETTER"],
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-[#080808] text-white px-6 sm:px-10 py-24 sm:py-40"
    >
      <div className="mx-auto w-full max-w-[1400px]">

        {/* SECTION LABEL */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-16 sm:mb-24 flex items-center justify-between border-b border-white/10 pb-5"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#ffd900] font-semibold">
              Sector 02 // The Observatory Deck
            </span>
          </div>

          <span className="font-mono text-xs tracking-widest text-[#ffd900]/70">
            02
          </span>
        </motion.div>

        {/* MASSIVE STATEMENT */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[1250px] text-[clamp(38px,7.2vw,120px)] font-medium leading-[0.92] tracking-[-0.075em] text-[#fffdf0]"
        >
          I DESIGN BECAUSE
          <br />
          I&apos;M <span className="text-[#ffd900]">CURIOUS</span> ABOUT
          <br />
          HOW THINGS COULD
          <br />
          <span className="text-[#ffd900]/40">FEEL DIFFERENT.</span>
        </motion.h2>

        {/* BIOGRAPHY & TELEMETRY ROW */}
        <div className="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          <div className="md:col-span-6 lg:col-span-6">
            <p className="text-lg sm:text-2xl leading-relaxed text-[#fffdf0]/85 font-normal">
              I&apos;m <span className="text-[#ffd900] font-bold">Arnab Ghosh</span>, a communication designer and creative technologist. I build identity systems, kinetic motion, and spatial interfaces engineered to reward curiosity — creating environments where visitors actively discover unexpected signals.
            </p>
          </div>

          <div className="md:col-span-6 lg:col-span-6 space-y-4">
            {METRICS.map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:items-baseline justify-between border-t border-white/10 py-3.5 sm:py-4 gap-1 sm:gap-4 hover:border-[#ffd900]/40 transition-colors"
              >
                <span className="text-[11px] font-mono tracking-[0.14em] text-[#ffd900]/80 uppercase">
                  {label}
                </span>
                <span className="text-right text-xs sm:text-sm text-[#fffdf0]/90 font-mono">
                  {value}
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* CAPABILITIES SPECTRUM GRID */}
        <div className="mt-24 sm:mt-32">
          <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#ffd900]">
              CORE MISSION DISCIPLINES
            </span>
            <span className="text-[11px] font-mono text-white/40">
              SPECTRUM // MATRIX
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-black/50 p-6 backdrop-blur-md transition-all duration-300 hover:border-[#ffd900]/50 hover:bg-[#ffd900]/[0.03] hover:shadow-[0_0_24px_rgba(255,217,0,0.12)]"
                >
                  <div>
                    <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffd900]/10 text-[#ffd900] border border-[#ffd900]/30 shadow-[0_0_14px_rgba(255,217,0,0.2)]">
                      <Icon size={18} />
                    </div>

                    <h3 className="text-lg font-bold tracking-tight text-[#fffdf0] mb-2 group-hover:text-[#ffd900] transition-colors">
                      {cap.title}
                    </h3>

                    <p className="text-xs leading-relaxed text-white/60 mb-6">
                      {cap.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                    {cap.tools.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono text-white/50 group-hover:text-[#ffd900]/80 transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}