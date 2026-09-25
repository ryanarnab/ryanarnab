"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, FlaskConical, Play, Sparkles, Activity, Layers, Cpu, Atom } from "lucide-react";

interface Experiment {
  number: string;
  title: string;
  type: string;
  year: string;
  status: string;
  desc: string;
  icon: any;
  tags: string[];
}

const EXPERIMENTS: Experiment[] = [
  {
    number: "EXP // 01",
    title: "MOTION LABS",
    type: "AFTER EFFECTS · KINETIC",
    year: "2026",
    status: "STABLE PROTO",
    desc: "Procedural typography kinetic timing studies simulating gravitational momentum and inertia rebound.",
    icon: Activity,
    tags: ["Kinetic Typography", "Inertia", "Physics"],
  },
  {
    number: "EXP // 02",
    title: "3D TOPOLOGY",
    type: "BLENDER · SPATIAL CGI",
    year: "2025—26",
    status: "CGI ENGINE",
    desc: "Mathematical curved surface meshes and non-Euclidean lighting models rendered for spatial interfaces.",
    icon: Layers,
    tags: ["Spatial 3D", "Non-Euclidean", "Blender"],
  },
  {
    number: "EXP // 03",
    title: "GRAVITON PULSE",
    type: "INTERACTION · HAPTICS",
    year: "2026",
    status: "ACTIVE LAB",
    desc: "Magnetic resistance switch simulation testing haptic bounce curves and tactile click thresholds.",
    icon: Atom,
    tags: ["Haptics", "Tactile Switch", "Spring Physics"],
  },
  {
    number: "EXP // 04",
    title: "COSMIC FRAGMENTS",
    type: "CREATIVE CODE · SHADERS",
    year: "2024—26",
    status: "ALPHA",
    desc: "GLSL fragment shaders generating continuous simplex noise nebulae reacting to pointer velocities.",
    icon: Cpu,
    tags: ["GLSL Shaders", "Simplex Noise", "Audio Reactive"],
  },
];

export default function PlaygroundSection() {
  return (
    <section
      id="playground"
      className="relative z-10 w-full overflow-hidden bg-transparent text-white px-6 sm:px-10 lg:px-16 py-24 sm:py-36"
    >
      <div className="mx-auto w-full max-w-[1440px]">

        {/* SECTION HEADER */}
        <div className="mb-14 sm:mb-20 flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#ffd900] font-mono font-semibold">
                Sector 03 // Orbital Research Lab
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#fffdf0]">
              Playground & Experiments
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-mono tracking-widest text-white/50">
              QUANTUM SINE LATTICE ACTIVE
            </span>
            <span className="font-mono text-xs tracking-widest text-[#ffd900]/70">
              03
            </span>
          </div>
        </div>

        {/* DESCRIPTION PILL */}
        <div className="mb-10 max-w-xl">
          <p className="text-sm sm:text-base leading-relaxed text-[#fffdf0]/75">
            Artifacts built without formal client constraints — exploratory orbits, procedural typography experiments, and acoustic shaders interesting enough to keep alive.
          </p>
        </div>

        {/* 4-CELL MODULAR EXPERIMENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {EXPERIMENTS.map((exp, idx) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={exp.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                data-cursor-label={`launch: ${exp.title.toLowerCase()} 🧪`}
                className="group relative flex flex-col justify-between rounded-3xl liquid-glass p-7 sm:p-9 transition-all duration-300 hover:border-[#ffd900]/40 hover:scale-[1.01]"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#ffd900] border border-white/15">
                        <Icon size={16} />
                      </div>
                      <span className="font-mono text-xs text-[#ffd900] tracking-widest font-semibold">
                        {exp.number}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-mono tracking-wider text-white/70">
                        {exp.status}
                      </span>
                      <span className="font-mono text-xs text-white/40">
                        {exp.year}
                      </span>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/50 block mb-1">
                    {exp.type}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#fffdf0] mb-3 group-hover:text-[#ffd900] transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-white/70 mb-6">
                    {exp.desc}
                  </p>
                </div>

                {/* Footer Tags & CTA */}
                <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-mono text-white/60 group-hover:text-white transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/playground"
                    className="tactile-switch inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-mono text-white transition-all group-hover:border-[#ffd900]/50"
                  >
                    <span>Test Lab</span>
                    <ArrowUpRight size={13} className="text-[#ffd900]" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM ARCHIVE ACTION */}
        <div className="mt-14 sm:mt-16 flex justify-center">
          <Link
            href="/playground"
            data-cursor-label="open full playground 🧪"
            className="tactile-switch rounded-2xl px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-mono tracking-widest uppercase flex items-center gap-3 transition-transform hover:scale-[1.02] text-[#fffdf0]"
          >
            <FlaskConical size={16} className="text-[#ffd900] animate-pulse" />
            <span>Launch Complete Research Laboratory</span>
            <ArrowUpRight size={16} className="text-[#ffd900]" />
          </Link>
        </div>

      </div>
    </section>
  );
}