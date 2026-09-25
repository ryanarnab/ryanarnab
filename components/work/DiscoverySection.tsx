"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, Sparkles, Orbit, Layers } from "lucide-react";

interface ProjectItem {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  src: string;
  desc: string;
  tags: string[];
}

const PROJECTS: ProjectItem[] = [
  {
    id: "01",
    number: "EXPEDITION // 01",
    title: "CHRONO IDENTITY",
    category: "IDENTITY · SPATIAL MOTION",
    year: "2026",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    desc: "A relativistic temporal brand identity system combining procedural typography with kinetic gravity choreographies.",
    tags: ["Brand Architecture", "Motion Systems", "Spatial 3D"],
  },
  {
    id: "02",
    number: "EXPEDITION // 02",
    title: "AURA INTERFACE",
    category: "CREATIVE DEV · HAPTICS",
    year: "2026",
    src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop",
    desc: "Tactile haptic interaction framework built with soft-touch switch physics and real-time magnetic spring resistance.",
    tags: ["WebGL", "Tactile UI", "Next.js"],
  },
  {
    id: "03",
    number: "EXPEDITION // 03",
    title: "GRAVITY SYSTEMS",
    category: "3D SIMULATION · CGI",
    year: "2025",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    desc: "Particle-driven zero-gravity simulations exploring celestial gravitational pulls and physical trajectory maps.",
    tags: ["Blender CGI", "Simulations", "Lighting"],
  },
  {
    id: "04",
    number: "EXPEDITION // 04",
    title: "COSMIC FLUX",
    category: "EXPERIENCE DESIGN · WEBGL",
    year: "2025—26",
    src: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop",
    desc: "Interactive planetary shader engine reacting dynamically to acoustic frequencies and user velocity.",
    tags: ["Shaders", "Interaction", "Sound Sync"],
  },
  {
    id: "05",
    number: "EXPEDITION // 05",
    title: "TELEMETRY LABS",
    category: "TYPOGRAPHY · ART DIRECTION",
    year: "2025",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
    desc: "Multi-layered cosmic editorial specimen celebrating experimental monospaced typography and radar grid layouts.",
    tags: ["Editorial", "Typography", "Print / Digital"],
  },
];

export default function DiscoverySection() {
  const p1 = PROJECTS[0];
  const p2 = PROJECTS[1];
  const p3 = PROJECTS[2];
  const p4 = PROJECTS[3];
  const p5 = PROJECTS[4];

  return (
    <section
      id="work"
      className="relative z-10 w-full overflow-hidden bg-transparent text-white px-6 sm:px-10 lg:px-16 py-24 sm:py-36"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        
        {/* SECTION HEADER & TELEMETRY */}
        <div className="mb-14 sm:mb-20 flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] animate-ping" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#ffd900] font-mono font-semibold">
                Sector 01 // Selected Artifacts
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#fffdf0]">
              Featured Expeditions
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-mono tracking-widest text-white/50">
              MODULAR GRID // 05 OF 12
            </span>
            <span className="text-xs font-mono tracking-widest text-[#ffd900]/70">
              01
            </span>
          </div>
        </div>

        {/* MODULAR BENTO GRID OF EXPEDITIONS */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          
          {/* CARD 1: FEATURED TITAN (7 COLS) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            data-cursor-label={`inspect ${p1.title.toLowerCase()} ↗`}
            className="md:col-span-7 group relative flex flex-col justify-between overflow-hidden rounded-3xl liquid-glass p-6 sm:p-8 transition-all duration-300 hover:border-[#ffd900]/40"
          >
            <div>
              {/* Media Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-zinc-950">
                <Image
                  src={p1.src}
                  alt={p1.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Badge overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-mono tracking-wider text-[#ffd900] backdrop-blur-md border border-white/10">
                  <Sparkles size={11} className="animate-spin" />
                  <span>{p1.number}</span>
                </div>

                <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-mono tracking-wider text-white/70 backdrop-blur-md border border-white/10">
                  {p1.year}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div className="flex flex-wrap gap-2">
                    {p1.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-white/15 px-2.5 py-1 text-[10px] font-mono text-white/90 backdrop-blur-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Meta information */}
              <div className="mt-6 flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.18em] text-[#ffd900] font-mono">
                  {p1.category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#fffdf0] group-hover:text-[#ffd900] transition-colors">
                  {p1.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#fffdf0]/70 max-w-xl">
                  {p1.desc}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-white/40">STATUS: ARCHIVED · READY</span>
              <Link
                href="/works"
                className="tactile-switch inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-white transition-all group-hover:border-[#ffd900]/50"
              >
                <span>Inspect Artifact</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* CARD 2: INTERFACE SYSTEMS (5 COLS) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            data-cursor-label={`inspect ${p2.title.toLowerCase()} ↗`}
            className="md:col-span-5 group relative flex flex-col justify-between overflow-hidden rounded-3xl liquid-glass p-6 sm:p-8 transition-all duration-300 hover:border-[#ffd900]/40"
          >
            <div>
              {/* Media Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-950">
                <Image
                  src={p2.src}
                  alt={p2.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-mono tracking-wider text-[#ffd900] backdrop-blur-md border border-white/10">
                  <Orbit size={11} className="animate-spin" />
                  <span>{p2.number}</span>
                </div>

                <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-[11px] font-mono tracking-wider text-white/70 backdrop-blur-md border border-white/10">
                  {p2.year}
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                  {p2.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-white/15 px-2 py-0.5 text-[10px] font-mono text-white/90 backdrop-blur-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Meta info */}
              <div className="mt-6 flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.18em] text-[#ffd900] font-mono">
                  {p2.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[#fffdf0] group-hover:text-[#ffd900] transition-colors">
                  {p2.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#fffdf0]/70">
                  {p2.desc}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-white/40">HAPTIC: VERIFIED</span>
              <Link
                href="/works"
                className="tactile-switch inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-white transition-all group-hover:border-[#ffd900]/50"
              >
                <span>Inspect</span>
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* ROW 2: TRIO EXPEDITIONS (4 COLS EACH) */}
          {[p3, p4, p5].map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              data-cursor-label={`inspect ${project.title.toLowerCase()} ↗`}
              className="md:col-span-4 group relative flex flex-col justify-between overflow-hidden rounded-3xl liquid-glass p-5 sm:p-6 transition-all duration-300 hover:scale-[1.01] hover:border-[#ffd900]/40"
            >
              <div>
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-zinc-950">
                  <Image
                    src={project.src}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-mono tracking-wider text-[#ffd900] backdrop-blur-md border border-white/10">
                    {project.number}
                  </div>

                  <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-0.5 text-[10px] font-mono tracking-wider text-white/60 backdrop-blur-md border border-white/10">
                    {project.year}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-1.5">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-[#ffd900] font-mono">
                    {project.category}
                  </span>
                  <h3 className="text-lg font-medium tracking-tight text-[#fffdf0] group-hover:text-[#ffd900] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-[#fffdf0]/65 line-clamp-2">
                    {project.desc}
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex gap-1">
                  {project.tags.slice(0, 2).map((t) => (
                    <span key={t} className="rounded bg-white/10 px-2 py-0.5 text-[9px] font-mono text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  href="/works"
                  className="text-xs font-mono text-white/70 hover:text-[#ffd900] flex items-center gap-1 transition-colors"
                >
                  <span>Inspect</span>
                  <ArrowUpRight size={13} />
                </Link>
              </div>
            </motion.div>
          ))}

        </div>

        {/* BOTTOM ARCHIVE LINK */}
        <div className="mt-14 sm:mt-20 flex justify-center">
          <Link
            href="/works"
            data-cursor-label="view all 12 works ↗"
            className="tactile-switch rounded-2xl px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-mono tracking-widest uppercase flex items-center gap-3 transition-transform hover:scale-[1.02] text-[#fffdf0]"
          >
            <Compass size={16} className="text-[#ffd900] animate-spin" />
            <span>Explore All 12 Expeditions in Deep Archive</span>
            <ArrowUpRight size={16} className="text-[#ffd900]" />
          </Link>
        </div>

      </div>
    </section>
  );
}