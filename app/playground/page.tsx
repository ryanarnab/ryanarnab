"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Cursor from "@/components/cursor/Cursor";
import { ScrollProvider } from "@/components/scroll/ScrollProvider";
import ContactSection from "@/components/contact/ContactSection";
import { motion } from "framer-motion";

interface Toy {
  id: string;
  title: string;
  category: string;
  date: string;
  desc: string;
}

const EXPERIMENTS: Toy[] = [
  {
    id: "LAB-01",
    title: "GRAVITATIONAL VECTOR FIELD",
    category: "PHYSICS · WEBGL",
    date: "2026",
    desc: "Interactive spatial particle mesh that warps and bends around mouse mass coordinates.",
  },
  {
    id: "LAB-02",
    title: "CHRONO PULSE SYNTHESIZER",
    category: "ACOUSTICS · KINETIC",
    date: "2026",
    desc: "A rhythmic audio-visual metronome mapping time distortion into kinetic geometric ripples.",
  },
  {
    id: "LAB-03",
    title: "MARTIAN TOPOLOGY STUDIES",
    category: "3D CGI · BLENDER",
    date: "2025—26",
    desc: "Procedural heightmap generators modeling hypothetical Martian crater terrain under solar flares.",
  },
  {
    id: "LAB-04",
    title: "KINETIC GLYPH MORPHER",
    category: "TYPOGRAPHY · CODE",
    date: "2025",
    desc: "Real-time vector interpolation of brutalist typography into fluid planetary coordinates.",
  },
];

export default function PlaygroundPage() {
  const [activeInteractive, setActiveInteractive] = useState<string>("LAB-01");

  return (
    <ScrollProvider>
      <Cursor />
      <Navbar />

      <main className="relative min-h-screen w-full bg-black text-white px-6 sm:px-10 pt-36 sm:pt-44 pb-20">
        <div className="mx-auto max-w-[1400px]">
          
          {/* HEADER */}
          <div className="mb-14 sm:mb-20">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400/80 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Sector 03 // Orbital Lab</span>
            </div>

            <h1 className="text-[clamp(44px,8vw,110px)] font-medium leading-[0.9] tracking-[-0.075em] text-white">
              UNFINISHED
              <br />
              <span className="text-amber-500/50">FREQUENCIES.</span>
            </h1>

            <p className="mt-6 max-w-[520px] text-sm sm:text-base leading-relaxed text-white/60">
              Artifacts created without briefs or commercial constraints. Explorations in creative coding,
              kinetic typography, procedural math, and acoustic synthesis.
            </p>
          </div>

          {/* INTERACTIVE EXPERIMENT PLAYGROUND BOX */}
          <div className="mb-20 overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-black to-black p-6 sm:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(245,158,11,0.1)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-8">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-xs font-mono uppercase tracking-widest text-white/80">
                  LIVE INTERACTION BENCH // {activeInteractive}
                </span>
              </div>
              <span className="text-xs font-mono text-amber-400/70">
                ACTIVE SENSORS
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* INTERACTIVE DISPLAY CANVAS MOCKUP */}
              <div className="lg:col-span-8 aspect-[16/10] w-full rounded-2xl border border-white/10 bg-black/90 p-8 flex flex-col justify-between relative overflow-hidden group">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent opacity-80" />
                
                {/* HUD Overlay */}
                <div className="flex justify-between items-center text-[10px] font-mono text-white/40">
                  <span>FPS: 60 · DPR: 2.0</span>
                  <span>PHYSICS ENGINE: ACTIVE</span>
                </div>

                <div className="my-auto text-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.06, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 16,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mx-auto h-28 w-28 rounded-full border-2 border-dashed border-amber-400/40 p-4 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.8)]" />
                  </motion.div>
                  <p className="mt-6 text-xs font-mono uppercase tracking-widest text-amber-300/80">
                    MOVE CURSOR TO INDUCE GRAVITATIONAL DISTORTION
                  </p>
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-white/30">
                  <span>MARS OBSERVATORY SIMULATION</span>
                  <span>v2.4.0</span>
                </div>
              </div>

              {/* EXPERIMENT SELECTOR */}
              <div className="lg:col-span-4 space-y-3">
                {EXPERIMENTS.map((exp) => (
                  <button
                    key={exp.id}
                    onClick={() => setActiveInteractive(exp.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      activeInteractive === exp.id
                        ? "border-amber-400 bg-amber-500/15 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-white/40 mb-1">
                      <span>{exp.id}</span>
                      <span>{exp.date}</span>
                    </div>
                    <h4 className="text-sm font-medium text-white tracking-tight">
                      {exp.title}
                    </h4>
                    <p className="mt-1 text-xs text-white/50 leading-relaxed line-clamp-2">
                      {exp.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ALL EXPERIMENTS LIST */}
          <div className="divide-y divide-white/10 border-b border-white/10">
            {EXPERIMENTS.map((exp) => (
              <div
                key={exp.id}
                className="group grid grid-cols-12 items-baseline sm:items-center py-6 sm:py-8 gap-y-2 sm:gap-y-0 px-2 sm:px-4 rounded-xl hover:bg-white/[0.02] transition-colors"
              >
                <span className="col-span-12 sm:col-span-2 font-mono text-[11px] text-amber-400/80 uppercase tracking-widest">
                  {exp.id}
                </span>
                <h3 className="col-span-12 sm:col-span-6 text-xl sm:text-2xl font-medium tracking-tight text-white group-hover:text-amber-200 transition-colors">
                  {exp.title}
                </h3>
                <span className="col-span-8 sm:col-span-3 text-xs uppercase tracking-widest text-white/40">
                  {exp.category}
                </span>
                <span className="col-span-4 sm:col-span-1 text-right font-mono text-xs text-white/30">
                  {exp.date}
                </span>
              </div>
            ))}
          </div>

        </div>
      </main>

      <ContactSection />
    </ScrollProvider>
  );
}
