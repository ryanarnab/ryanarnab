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

import Link from "next/link";
import { UploadCloud } from "lucide-react";
import { getAllProjects, getShowcaseProjects, getProjectMetrics, ProjectItem } from "@/lib/projects";

const CATEGORIES = ["All", "Identity", "Typography", "3D & CGI", "Art Direction", "Editorial"] as const;

export default function WorksPage() {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>(() => getAllProjects());
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const { playWarp, playClick } = useSound();

  // Load fresh projects on mount to capture any newly uploaded artifacts
  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects)) {
          setProjectsList(data.projects);
        }
      })
      .catch(() => {});
  }, []);

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

  const showcaseCount = projectsList.filter((p) => p.status === "showcase").length;
  const totalCount = projectsList.length;

  const filteredProjects =
    activeFilter === "All"
      ? projectsList
      : projectsList.filter((p) => p.category.toLowerCase().includes(activeFilter.toLowerCase()) || p.category === activeFilter);

  return (
    <ScrollProvider>
      <Cursor />
      <Navbar />

      <main className="relative min-h-screen w-full bg-black text-white px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 pt-32 sm:pt-40 pb-20">
        <div className="mx-auto w-full max-w-[1440px] xl:max-w-[1560px] 2xl:max-w-[1720px] 3xl:max-w-[1920px]">
          
          {/* HEADER */}
          <div className="mb-14 sm:mb-20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[#d4b068]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d4b068] animate-pulse" />
                <span>Sector 01 // Expedition Archive ({showcaseCount} Active · {totalCount} Total)</span>
              </div>

              <Link
                href="/upload"
                data-cursor-label="upload project ↗"
                className="tactile-switch px-4 py-2 text-xs font-mono font-bold text-[#d4b068] border border-[#d4b068]/30 hover:border-[#d4b068] bg-[#d4b068]/10 hover:bg-[#d4b068]/20 flex items-center gap-2 uppercase tracking-wider transition-all"
                style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
              >
                <UploadCloud size={14} />
                <span>+ Upload Project</span>
              </Link>
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
            {CATEGORIES.map((cat) => {
              const count = cat === "All" 
                ? showcaseCount 
                : projectsList.filter((p) => p.status === "showcase" && (p.category.toLowerCase().includes(cat.toLowerCase()) || p.category === cat)).length;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    playClick();
                    setActiveFilter(cat);
                  }}
                  className={`rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeFilter === cat
                      ? "bg-[#d4b068] text-black font-bold shadow-[0_0_16px_rgba(212, 176, 104,0.5)]"
                      : "border border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-[#d4b068]/40"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] ${activeFilter === cat ? "text-black/70" : "text-white/40"}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* PROJECT GRID */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-6 xl:gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => {
                const isUploading = project.status === "uploading_soon" || project.isUploadingSoon;

                if (isUploading) {
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5 }}
                      key={project.id}
                      data-cursor-label="uploading soon"
                      className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#14141a]/90 p-6 min-h-[360px] select-none backdrop-blur-2xl"
                    >
                      {/* Blurred Grey Background */}
                      <div className="absolute inset-0 bg-[#16161e] -z-10" />
                      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                      {/* Top Bar with Minimalist Index */}
                      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                        <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
                          {project.id}
                        </span>
                        <span className="text-[9px] font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-white/[0.04] text-white/40 border border-white/5">
                          LOCKED
                        </span>
                      </div>

                      {/* Centered Minimalist Uploading Soon Indicator (No texts) */}
                      <div className="flex flex-col items-center justify-center gap-3 text-center my-auto py-8">
                        <div 
                          className="h-10 w-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/10 text-white/40 shadow-inner"
                        >
                          <span className="h-2 w-2 rounded-full bg-[#d4b068]/60 animate-pulse" />
                        </div>
                        <span className="text-xs font-mono font-bold tracking-[0.28em] text-white/60 uppercase">
                          UPLOADING SOON
                        </span>
                        <div className="w-10 h-[1px] bg-white/10 my-0.5" />
                        <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">
                          TRANSMISSION PENDING
                        </span>
                      </div>

                      {/* Bottom Subtle Status Bar */}
                      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-white/25">
                        <span>ARCHIVED</span>
                        <span>COMING SOON</span>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.article
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    key={project.id}
                    onClick={() => handleInspect(project.dossierId || project.id)}
                    data-cursor-label={`inspect ${project.title.toLowerCase()} ↗`}
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
                          {project.desc || project.description}
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
                );
              })}
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
