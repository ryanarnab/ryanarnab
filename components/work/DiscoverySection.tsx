"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, Sparkles, Crosshair, Zap } from "lucide-react";
import { useSound } from "@/components/sound/SoundProvider";
import { triggerLightHaptic, triggerMediumHaptic } from "@/lib/haptics";

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

interface DiscoverySectionProps {
  onOpenProject?: (id: string) => void;
}

export default function DiscoverySection({ onOpenProject }: DiscoverySectionProps) {
  const { playWarp } = useSound();

  const handleOpen = (id: string) => {
    playWarp();
    triggerMediumHaptic();
    if (onOpenProject) {
      onOpenProject(id);
    } else {
      window.dispatchEvent(
        new CustomEvent("open-project-dossier", { detail: { id } })
      );
    }
  };

  const p1 = PROJECTS[0];
  const p2 = PROJECTS[1];
  const p3 = PROJECTS[2];
  const p4 = PROJECTS[3];
  const p5 = PROJECTS[4];

  return (
    <section
      id="work"
      className="relative z-10 w-full overflow-hidden bg-transparent text-white px-6 sm:px-10 lg:px-16 py-24 sm:py-36 angular-bg-pattern"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        
        {/* SECTION HEADER — Angular Edge */}
        <div className="mb-14 sm:mb-20 flex flex-col sm:flex-row sm:items-end justify-between edge-divider pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-6 w-6 flex items-center justify-center bg-[#d4b068]/10 text-[#d4b068] border border-[#d4b068]/30"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              >
                <Crosshair size={10} />
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#d4b068] font-mono font-bold">
                Sector 01 // Selected Artifacts
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-[-0.04em] text-[#fffdf0]">
              Featured <span className="text-[#d4b068]">Expeditions</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono tracking-widest text-white/40 uppercase">
              Tactical Grid // 05 of 12
            </span>
            <div className="h-8 w-[2px] bg-gradient-to-b from-[#d4b068] to-transparent" />
          </div>
        </div>

        {/* MODULAR ANGULAR GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          
          {/* CARD 1: FEATURED TITAN (7 COLS) — Angular Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            data-cursor-label={`inspect ${p1.title.toLowerCase()} ↗`}
            className="md:col-span-7 group relative flex flex-col justify-between overflow-hidden angular-panel p-0 transition-all duration-300"
          >
            {/* Media Container — Full bleed */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
              <Image
                src={p1.src}
                alt={p1.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
              
              {/* Angular badge overlay */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 text-[10px] font-mono tracking-widest text-[#d4b068] border border-[#d4b068]/20"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
              >
                <Sparkles size={10} className="animate-spin" />
                <span>{p1.number}</span>
              </div>

              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 text-[10px] font-mono tracking-widest text-white/70 border border-white/10"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
              >
                {p1.year}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {p1.tags.map((tag) => (
                    <span key={tag} className="bg-white/10 backdrop-blur-md px-2.5 py-1 text-[9px] font-mono text-white/90 uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Meta information */}
            <div className="p-6 sm:p-8 flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4b068] font-mono font-bold">
                {p1.category}
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#fffdf0] group-hover:text-[#d4b068] transition-colors">
                {p1.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#fffdf0]/60 max-w-xl">
                {p1.desc}
              </p>
            </div>

            <div className="mx-6 sm:mx-8 mb-6 pt-4 border-t border-white/8 flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Status: Archived · Ready</span>
              <button
                onClick={() => handleOpen(p1.id)}
                className="tactile-switch inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-white transition-all group-hover:border-[#d4b068]/50 cursor-pointer uppercase tracking-wider"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
              >
                <span>Inspect</span>
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#d4b068]" />
              </button>
            </div>
          </motion.div>

          {/* CARD 2: INTERFACE SYSTEMS (5 COLS) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            data-cursor-label={`inspect ${p2.title.toLowerCase()} ↗`}
            className="md:col-span-5 group relative flex flex-col justify-between overflow-hidden angular-panel p-0 transition-all duration-300"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-950">
              <Image
                src={p2.src}
                alt={p2.title}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 text-[10px] font-mono tracking-widest text-[#d4b068] border border-[#d4b068]/20"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
              >
                <Zap size={10} />
                <span>{p2.number}</span>
              </div>

              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 text-[10px] font-mono tracking-widest text-white/70 border border-white/10"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
              >
                {p2.year}
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                {p2.tags.map((tag) => (
                  <span key={tag} className="bg-white/10 backdrop-blur-md px-2 py-0.5 text-[9px] font-mono text-white/90 uppercase tracking-wider">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-6 sm:p-8 flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#d4b068] font-mono font-bold">
                {p2.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#fffdf0] group-hover:text-[#d4b068] transition-colors">
                {p2.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-[#fffdf0]/60">
                {p2.desc}
              </p>
            </div>

            <div className="mx-6 sm:mx-8 mb-6 pt-4 border-t border-white/8 flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Haptic: Verified</span>
              <button
                onClick={() => handleOpen(p2.id)}
                className="tactile-switch inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-white transition-all group-hover:border-[#d4b068]/50 cursor-pointer uppercase tracking-wider"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
              >
                <span>Inspect</span>
                <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#d4b068]" />
              </button>
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
              className="md:col-span-4 group relative flex flex-col justify-between overflow-hidden angular-panel-sm p-0 transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="relative aspect-[16/11] w-full overflow-hidden bg-zinc-950">
                <Image
                  src={project.src}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-mono tracking-widest text-[#d4b068] border border-[#d4b068]/20"
                  style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
                >
                  {project.number}
                </div>

                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-mono tracking-widest text-white/60 border border-white/10"
                  style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
                >
                  {project.year}
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col gap-1.5">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[#d4b068] font-mono font-bold">
                  {project.category}
                </span>
                <h3 className="text-lg font-bold tracking-tight text-[#fffdf0] group-hover:text-[#d4b068] transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#fffdf0]/55 line-clamp-2">
                  {project.desc}
                </p>
              </div>

              <div className="mx-5 sm:mx-6 mb-5 pt-4 border-t border-white/8 flex items-center justify-between">
                <div className="flex gap-1">
                  {project.tags.slice(0, 2).map((t) => (
                    <span key={t} className="bg-white/8 px-2 py-0.5 text-[8px] font-mono text-white/50 uppercase tracking-wider">
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleOpen(project.id)}
                  className="text-[10px] font-mono font-bold text-white/60 hover:text-[#d4b068] flex items-center gap-1 transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <span>Inspect</span>
                  <ArrowUpRight size={11} />
                </button>
              </div>
            </motion.div>
          ))}

        </div>

        {/* BOTTOM ARCHIVE LINK — Angular */}
        <div className="mt-16 sm:mt-24 flex justify-center px-2">
          <Link
            href="/works"
            data-cursor-label="view all 12 works ↗"
            className="tactile-switch px-6 sm:px-10 py-4 sm:py-5 text-xs sm:text-sm font-mono font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] text-[#fffdf0] max-w-full text-center"
            style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
          >
            <Compass size={16} className="text-[#d4b068] animate-spin shrink-0" />
            <span className="hidden sm:inline">Explore All 12 Expeditions in Deep Archive</span>
            <span className="sm:hidden text-[11px] truncate">Explore All 12 Expeditions</span>
            <ArrowUpRight size={16} className="text-[#d4b068] shrink-0" />
          </Link>
        </div>

      </div>
    </section>
  );
}