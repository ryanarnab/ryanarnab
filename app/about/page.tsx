"use client";

import Navbar from "@/components/layout/Navbar";
import Cursor from "@/components/cursor/Cursor";
import { ScrollProvider } from "@/components/scroll/ScrollProvider";
import ContactSection from "@/components/contact/ContactSection";
import { motion } from "framer-motion";
import { Radio, Compass, Eye, Cpu, Layers } from "lucide-react";

const PILLARS = [
  {
    icon: Compass,
    title: "Curiosity-Led Discovery",
    desc: "Designing interactions that encourage exploration and reward tactile curiosity rather than passive consumption.",
  },
  {
    icon: Eye,
    title: "Visual Identity & Spatial Systems",
    desc: "Crafting bold typographic hierarchies, relativistic grid systems, and brand universes that scale seamlessly.",
  },
  {
    icon: Cpu,
    title: "Creative Technology",
    desc: "Bridging the boundary between visual design and production code with WebGL, Framer Motion, and Next.js.",
  },
  {
    icon: Layers,
    title: "Motion & Temporal Aesthetics",
    desc: "Treating time and choreography as foundational design elements to give digital interfaces rhythm and life.",
  },
];

const SKILLS = [
  { group: "CREATIVE & MOTION", items: ["After Effects", "Cinema 4D / Blender", "Figma", "Design Systems", "Art Direction"] },
  { group: "DEVELOPMENT & INTERACTION", items: ["Next.js & React", "TypeScript", "Tailwind CSS", "Framer Motion", "GSAP & WebGL"] },
  { group: "RESEARCH & DOMAINS", items: ["Communication Design", "Spatial Interfaces", "Kinetic Typography", "Haptic Interactions"] },
];

export default function AboutPage() {
  return (
    <ScrollProvider>
      <Cursor />
      <Navbar />

      <main className="relative min-h-screen w-full bg-black text-white px-6 sm:px-10 pt-36 sm:pt-44 pb-20">
        <div className="mx-auto max-w-[1400px]">
          
          {/* HEADER */}
          <div className="mb-20 sm:mb-28">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400/80 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Sector 02 // The Observatory</span>
            </div>

            <h1 className="text-[clamp(44px,8vw,110px)] font-medium leading-[0.9] tracking-[-0.075em] text-white">
              OBSERVING
              <br />
              <span className="text-amber-500/50">THE SIGNAL.</span>
            </h1>

            <p className="mt-8 max-w-[620px] text-lg sm:text-xl leading-relaxed text-white/70">
              I&apos;m Arnab Ghosh, a communication designer and creative technologist based in Guwahati, India.
              My work investigates how visual identity, kinetic motion, and software interfaces can provoke deep curiosity.
            </p>
          </div>

          {/* MANIFESTO / PHILOSOPHY */}
          <div className="my-20 sm:my-32 border-y border-white/10 py-16 sm:py-24">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400/80 mb-8">
              PHILOSOPHY // 01
            </h2>

            <p className="text-[clamp(28px,4.5vw,64px)] font-medium leading-[1.05] tracking-[-0.05em] text-white/90 max-w-[1100px]">
              &ldquo;Great design should not feel like an instruction manual.
              It should feel like an artifact you arrived at by accident and couldn&apos;t look away from.&rdquo;
            </p>
          </div>

          {/* FOUR PILLARS */}
          <div className="mb-24 sm:mb-36">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400/80 mb-10">
              CORE DISCIPLINES // 02
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition-all hover:border-amber-400/30 hover:bg-white/[0.04]"
                  >
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium tracking-tight text-white mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/60">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SKILLS SPECTRUM */}
          <div className="mb-20">
            <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-amber-400/80 mb-10">
              TELEMETRY & SPECTRUM // 03
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SKILLS.map((spec) => (
                <div key={spec.group} className="border-t border-white/10 pt-6">
                  <h3 className="text-xs font-mono tracking-widest text-white/40 uppercase mb-5">
                    {spec.group}
                  </h3>
                  <ul className="space-y-2.5">
                    {spec.items.map((item) => (
                      <li key={item} className="text-sm text-white/80 flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-amber-400/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <ContactSection />
    </ScrollProvider>
  );
}
