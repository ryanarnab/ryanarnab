"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, FlaskConical, Activity, Layers, Cpu, Atom, Zap } from "lucide-react";

interface Experiment {
  number: string;
  title: string;
  type: string;
  year: string;
  status: string;
  desc: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
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

        {/* SECTION HEADER — Angular */}
        <div className="mb-14 sm:mb-20 flex flex-col sm:flex-row sm:items-end justify-between edge-divider pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-6 w-6 flex items-center justify-center bg-[#d4b068]/10 text-[#d4b068] border border-[#d4b068]/30"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              >
                <Zap size={10} />
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#d4b068] font-mono font-bold">
                Sector 03 // Orbital Research Lab
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-[-0.04em] text-[#fffdf0]">
              Playground <span className="text-[#d4b068]">&amp;</span> Experiments
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono tracking-widest text-white/40 uppercase">
              Quantum Sine Lattice Active
            </span>
            <div className="h-8 w-[2px] bg-gradient-to-b from-[#d4b068] to-transparent" />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mb-10 max-w-xl">
          <p className="text-sm sm:text-base leading-relaxed text-[#fffdf0]/65">
            Artifacts built without formal client constraints — exploratory orbits, procedural typography experiments, and acoustic shaders interesting enough to keep alive.
          </p>
        </div>

        {/* 4-CELL MODULAR EXPERIMENT GRID — Angular */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
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
                className="group relative flex flex-col justify-between angular-panel p-7 sm:p-9 transition-all duration-300 hover:scale-[1.01]"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-white/8 pb-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center bg-[#d4b068]/8 text-[#d4b068] border border-[#d4b068]/20"
                        style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                      >
                        <Icon size={16} />
                      </div>
                      <span className="font-mono text-[10px] text-[#d4b068] tracking-widest font-bold uppercase">
                        {exp.number}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-[#d4b068]/10 border border-[#d4b068]/20 px-2.5 py-0.5 text-[9px] font-mono tracking-wider text-[#d4b068] uppercase font-bold"
                        style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
                      >
                        {exp.status}
                      </span>
                      <span className="font-mono text-[10px] text-white/35 tracking-widest">
                        {exp.year}
                      </span>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 block mb-1 font-bold">
                    {exp.type}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#fffdf0] mb-3 group-hover:text-[#d4b068] transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-white/55 mb-6">
                    {exp.desc}
                  </p>
                </div>

                {/* Footer Tags & CTA */}
                <div className="pt-5 border-t border-white/8 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((t) => (
                      <span
                        key={t}
                        className="bg-white/5 px-2.5 py-1 text-[9px] font-mono text-white/45 group-hover:text-white/75 transition-colors uppercase tracking-wider"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/playground"
                    className="tactile-switch inline-flex items-center gap-2 px-4 py-2 text-[10px] font-mono font-bold text-white transition-all group-hover:border-[#d4b068]/50 uppercase tracking-widest"
                    style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                  >
                    <span>Test Lab</span>
                    <ArrowUpRight size={11} className="text-[#d4b068]" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM ARCHIVE ACTION — Angular */}
        <div className="mt-16 sm:mt-20 flex justify-center px-2">
          <Link
            href="/playground"
            data-cursor-label="open full playground 🧪"
            className="tactile-switch px-6 sm:px-10 py-4 sm:py-5 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] text-[#fffdf0] max-w-full text-center"
            style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
          >
            <FlaskConical size={16} className="text-[#d4b068] animate-pulse shrink-0" />
            <span className="hidden sm:inline">Launch Complete Research Laboratory</span>
            <span className="sm:hidden text-[11px] truncate">Launch Research Lab</span>
            <ArrowUpRight size={16} className="text-[#d4b068] shrink-0" />
          </Link>
        </div>

      </div>
    </section>
  );
}