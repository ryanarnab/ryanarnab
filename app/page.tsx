"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/hero/Hero";
import Cursor from "@/components/cursor/Cursor";
import WorkSection from "@/components/work/DiscoverySection";
import { ScrollProvider } from "@/components/scroll/ScrollProvider";
import AboutSection from "@/components/about/AboutSection";
import PlaygroundSection from "@/components/playground/PlaygroundSection";
import ContactSection from "@/components/contact/ContactSection";
import OrbitalSidebar from "@/components/navigation/OrbitalSidebar";
import BackgroundParticles from "@/components/hero/BackgroundParticles";
import SpacePingLoader from "@/components/loader/SpacePingLoader";
import ProjectDossierModal from "@/components/modals/ProjectDossierModal";
import DossierResumeModal from "@/components/modals/DossierResumeModal";

export default function Home() {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  useEffect(() => {
    const handleDossierOpen = () => setIsDossierOpen(true);
    const handleProjectOpen = (e: Event) => {
      const custom = e as CustomEvent<{ id?: string }>;
      if (custom.detail?.id) {
        setActiveProjectId(custom.detail.id);
      }
    };

    window.addEventListener("trigger-dossier-open", handleDossierOpen);
    window.addEventListener("open-project-dossier", handleProjectOpen);

    return () => {
      window.removeEventListener("trigger-dossier-open", handleDossierOpen);
      window.removeEventListener("open-project-dossier", handleProjectOpen);
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

  return (
    <ScrollProvider>
      <SpacePingLoader />
      <Cursor />
      <BackgroundParticles />
      <OrbitalSidebar />

      <Navbar />
      <Hero />
      <WorkSection onOpenProject={(id) => setActiveProjectId(id)} />
      <AboutSection />
      <PlaygroundSection />
      <ContactSection />

      {/* Global Interactive Modals */}
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