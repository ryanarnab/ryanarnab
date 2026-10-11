"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Cursor from "@/components/cursor/Cursor";
import { ScrollProvider } from "@/components/scroll/ScrollProvider";
import ContactSection from "@/components/contact/ContactSection";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ProjectDossierModal from "@/components/modals/ProjectDossierModal";
import DossierResumeModal from "@/components/modals/DossierResumeModal";
import { useSound } from "@/components/sound/SoundProvider";
import { triggerLightHaptic } from "@/lib/haptics";

interface Project {
  id: string;
  dossierId: string;
  title: string;
  category: "Identity" | "Typography" | "3D & CGI" | "Art Direction" | "Editorial";
  year: string;
  description: string;
  src: string;
  tags: string[];
}

const ALL_PROJECTS: Project[] = [
  {
    id: "EXP-01",
    dossierId: "01",
    title: "RYAN ARNAB IDENTITY SYSTEM",
    category: "Identity",
    year: "2026",
    description: "Personal visual identity and geometric monogram mark system exploring kinetic grid structures and gold accents.",
    src: "/images/works/brand-identity-1.png",
    tags: ["Brand Architecture", "Monogram", "Identity System"],
  },
  {
    id: "EXP-02",
    dossierId: "02",
    title: "KOKUYO CAMEL TYPEFACE REDESIGN",
    category: "Typography",
    year: "2026",
    description: "A custom display typeface redesign (CAMEL.TTF) and comprehensive type specimen crafted for Kokuyo Camel.",
    src: "/images/works/typography-1.png",
    tags: ["Typeface Design", "Typography", "Branding"],
  },
  {
    id: "EXP-03",
    dossierId: "03",
    title: "ZENED CYBERNETIC CGI",
    category: "3D & CGI",
    year: "2025",
    description: "Dark metallic spatial CGI render exploring biomechanical cybernetic forms and radiant particle emissions.",
    src: "/images/works/zened-1.png",
    tags: ["3D CGI", "Blender", "Lighting & Particles"],
  },
  {
    id: "EXP-04",
    dossierId: "04",
    title: "TECHNOPHILIA 4.0 KEY VISUAL",
    category: "Art Direction",
    year: "2025",
    description: "Futuristic cyber-mech key visual identity and comprehensive collateral system for annual technology symposium.",
    src: "/images/works/poster-technophilia.png",
    tags: ["Key Visual", "Art Direction", "Event Branding"],
  },
  {
    id: "EXP-05",
    dossierId: "05",
    title: "EASTERN HIMALAYAN NATURENOMICS",
    category: "Editorial",
    year: "2025",
    description: "13th Eastern Himalayan Naturenomics Forum visual identity, typography system, and ecological publication design.",
    src: "/images/works/poster-naturenomics.png",
    tags: ["Editorial", "Environmental", "Print & Digital"],
  },
  {
    id: "EXP-06",
    dossierId: "01",
    title: "BRAND IDENTITY GUIDELINES",
    category: "Identity",
    year: "2026",
    description: "Brand architecture guidelines, grid geometry, spacing rules, and comprehensive identity collateral.",
    src: "/images/works/brand-identity-4.png",
    tags: ["Brand Guidelines", "Manual", "Grid Systems"],
  },
  {
    id: "EXP-07",
    dossierId: "02",
    title: "CAMEL.TTF PROCESS & GLYPHS",
    category: "Typography",
    year: "2026",
    description: "Character anatomy, ligature development, stroke weight balancing, and kerning pairs.",
    src: "/images/works/typography-5.png",
    tags: ["Glyph Anatomy", "Kerning", "Process"],
  },
  {
    id: "EXP-08",
    dossierId: "04",
    title: "WHISPERS OF WINTER FESTIVAL",
    category: "Art Direction",
    year: "2025",
    description: "Festive spatial typography and winter celebration visual campaign designed for student council events.",
    src: "/images/works/poster-winterfest.png",
    tags: ["Festive", "Spatial Type", "Poster"],
  },
  {
    id: "EXP-09",
    dossierId: "04",
    title: "RGU INTER-UNIVERSITY FOOTBALL",
    category: "Art Direction",
    year: "2026",
    description: "High-energy collegiate football matchday posters and athletic identity for AIU North East tournament.",
    src: "/images/works/sports-rgu.png",
    tags: ["Sports Branding", "Matchday", "Athletics"],
  },
];

const CATEGORIES = ["All", "Identity", "Typography", "3D & CGI", "Art Direction", "Editorial"] as const;

export default function WorksPage() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const { playWarp, playClick } = useSound();

  useEffect(() => {
    const handleDossierOpen = () => setIsDossierOpen(true);

    window.addEventListener("trigger-dossier-open", handleDossierOpen);

    return () => {
      window.removeEventListener("trigger-dossier-open", handleDossierOpen);
    };
  }, []);

  const isAnyModalOpen = !!activeProjectId || isDossierOpen;

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isAnyModalOpen ? "hidden" : "";
      window.dispatchEvent(
        new CustomEvent("modal-visibility-change", { detail: { isOpen: isAnyModalOpen } })
      );
    }
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, [isAnyModalOpen]);

  const handleInspect = (dossierId: string) => {
    playWarp();
    triggerLightHaptic();
    setActiveProjectId(dossierId);
  };

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
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#d4b068] mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d4b068] animate-pulse" />
              <span>Sector 01 // Expedition Archive</span>
            </div>

            <h1 className="text-[clamp(44px,8vw,110px)] font-medium leading-[0.9] tracking-[-0.075em] text-[#fffdf0]">
              DISCOVERED
              <br />
              <span className="text-[#d4b068]/50">ARTIFACTS.</span>
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
                onClick={() => {
                  playClick();
                  setActiveFilter(cat);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === cat
                    ? "bg-[#d4b068] text-black font-bold shadow-[0_0_16px_rgba(212, 176, 104,0.5)]"
                    : "border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-[#d4b068]/40"
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
                  onClick={() => handleInspect(project.dossierId)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:border-[#d4b068]/50 hover:shadow-[0_0_30px_rgba(212, 176, 104,0.2)] cursor-pointer"
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
                    <div className="absolute top-3 left-3 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-mono tracking-widest text-[#d4b068] backdrop-blur-md border border-[#d4b068]/30 z-10">
                      {project.id}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="mt-5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#d4b068]/70 mb-2">
                        <span>{project.category}</span>
                        <span>{project.year}</span>
                      </div>

                      <h3 className="text-xl font-medium tracking-tight text-[#fffdf0] group-hover:text-[#d4b068] transition-colors">
                        {project.title}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-[#fffdf0]/60">
                        {project.description}
                      </p>
                    </div>

                    {/* ACTION & TAGS */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono tracking-wider text-white/50 group-hover:border-[#d4b068]/30 border border-transparent transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs font-mono text-white/70 group-hover:text-[#d4b068] flex items-center gap-1 transition-colors">
                        <span>Dossier</span>
                        <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

        </div>
      </main>

      <ContactSection />

      {/* Global Modals */}
      <ProjectDossierModal
        projectId={activeProjectId}
        onClose={() => setActiveProjectId(null)}
      />

      <DossierResumeModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />
    </ScrollProvider>
  );
}
