"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Cursor from "@/components/cursor/Cursor";
import { ScrollProvider } from "@/components/scroll/ScrollProvider";
import ContactSection from "@/components/contact/ContactSection";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  title: string;
  category: "Identity" | "Motion" | "Spatial" | "Creative Dev";
  year: string;
  description: string;
  src: string;
  tags: string[];
}

const ALL_PROJECTS: Project[] = [
  {
    id: "EXP-01",
    title: "CHRONO IDENTITY SYSTEM",
    category: "Identity",
    year: "2026",
    description: "A dynamic temporal visual identity exploring kinetic letterforms and relativistic grid systems.",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    tags: ["Brand Identity", "Design System", "Motion Studies"],
  },
  {
    id: "EXP-02",
    title: "AURA HAPTIC INTERFACE",
    category: "Creative Dev",
    year: "2026",
    description: "Tactile micro-interaction laboratory mapping acoustic frequencies to physical gesture physics.",
    src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
    tags: ["WebGL", "Sensory UI", "Creative Coding"],
  },
  {
    id: "EXP-03",
    title: "GRAVITY SYSTEMS SIMULATION",
    category: "Spatial",
    year: "2025",
    description: "3D planetary topology and gravitational lens simulations rendered in real-time.",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    tags: ["3D CGI", "Blender", "Spatial Computing"],
  },
  {
    id: "EXP-04",
    title: "COSMIC FLUX EXPERIENCES",
    category: "Motion",
    year: "2025—26",
    description: "Editorial kinetic typography films and spatial motion graphics for immersive installations.",
    src: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1200&auto=format&fit=crop",
    tags: ["Motion Design", "After Effects", "Film Direction"],
  },
  {
    id: "EXP-05",
    title: "TELEMETRY LABS ARCHIVE",
    category: "Identity",
    year: "2025",
    description: "Aerospace telemetry data visualization and astronomical typography specimens.",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    tags: ["Typography", "Editorial", "Data Design"],
  },
  {
    id: "EXP-06",
    title: "SOLARIS SOUND MATRIX",
    category: "Creative Dev",
    year: "2026",
    description: "Synthesizer wave visualizer converting orbital planetary soundscapes into kinetic vector fields.",
    src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
    tags: ["Audio Visualizer", "Generative Art", "Interactive"],
  },
];

const CATEGORIES = ["All", "Identity", "Motion", "Spatial", "Creative Dev"] as const;

export default function WorksPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filteredProjects =
    activeFilter === "All"
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <ScrollProvider>
      <Cursor />
      <Navbar />

      <main className="relative min-h-screen w-full bg-black text-white px-6 sm:px-10 pt-36 sm:pt-44 pb-20">
        <div className="mx-auto max-w-[1400px]">
          
          {/* HEADER */}
          <div className="mb-14 sm:mb-20">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#ffd900] mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] animate-pulse" />
              <span>Sector 01 // Expedition Archive</span>
            </div>

            <h1 className="text-[clamp(44px,8vw,110px)] font-medium leading-[0.9] tracking-[-0.075em] text-[#fffdf0]">
              DISCOVERED
              <br />
              <span className="text-[#ffd900]/50">ARTIFACTS.</span>
            </h1>

            <p className="mt-6 max-w-[500px] text-sm sm:text-base leading-relaxed text-[#fffdf0]/70">
              A curated catalog of communication design, visual identity systems, spatial interfaces,
              and motion explorations built to provoke curiosity.
            </p>
          </div>

          {/* FILTER PILLS */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-6 mb-12 sm:mb-16">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-all ${
                  activeFilter === cat
                    ? "bg-[#ffd900] text-black font-bold shadow-[0_0_16px_rgba(255,217,0,0.5)]"
                    : "border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-[#ffd900]/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* PROJECT GRID */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  key={project.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:border-[#ffd900]/50 hover:shadow-[0_0_30px_rgba(255,217,0,0.2)]"
                >
                  {/* IMAGE FRAME */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-900">
                    <Image
                      src={project.src}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-mono tracking-widest text-[#ffd900] backdrop-blur-md border border-[#ffd900]/30 z-10">
                      {project.id}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="mt-5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#ffd900]/70 mb-2">
                        <span>{project.category}</span>
                        <span>{project.year}</span>
                      </div>

                      <h3 className="text-xl font-medium tracking-tight text-[#fffdf0] group-hover:text-[#ffd900] transition-colors">
                        {project.title}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-[#fffdf0]/60">
                        {project.description}
                      </p>
                    </div>

                    {/* TAGS */}
                    <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono tracking-wider text-white/50 group-hover:border-[#ffd900]/30 border border-transparent transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </main>

      <ContactSection />
    </ScrollProvider>
  );
}
