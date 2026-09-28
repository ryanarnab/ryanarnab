"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  Copy,
  Check,
  Printer,
  Cpu,
  BookOpen,
  MapPin,
  Mail,
  ExternalLink,
} from "lucide-react";
import { useSound } from "@/components/sound/SoundProvider";
import { triggerLightHaptic, triggerMediumHaptic } from "@/lib/haptics";

interface DossierResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DossierResumeModal({
  isOpen,
  onClose,
}: DossierResumeModalProps) {
  const [copied, setCopied] = useState(false);
  const { playClick, playSuccess } = useSound();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        playClick();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, playClick]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ryanarnab.design@gmail.com");
    setCopied(true);
    playSuccess();
    triggerLightHaptic();
    setTimeout(() => setCopied(false), 1500);
  };

  const handlePrint = () => {
    playClick();
    triggerMediumHaptic();
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6">
      {/* Dark Scrim Backdrop */}
      <div
        onClick={() => {
          playClick();
          onClose();
        }}
        className="fixed inset-0 bg-black/90 cursor-pointer"
      />

      {/* Dossier Card Container */}
      <div className="relative w-full max-w-3xl bg-[#0a0a0f] rounded-2xl sm:rounded-3xl border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden z-10 my-auto flex flex-col max-h-[88vh]">
            {/* Header Telemetry Strip */}
            <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ffd900] animate-pulse" />
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#ffd900]">
                  DECLASSIFIED PERSONNEL RECORD // DOSSIER #AG-26
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="tactile-switch px-3 py-1.5 rounded-lg text-xs font-mono text-white/70 hover:text-white flex items-center gap-1.5"
                  title="Print / Save as PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PRINT / PDF</span>
                </button>
                <button
                  onClick={() => {
                    playClick();
                    onClose();
                  }}
                  className="tactile-switch p-1.5 rounded-lg text-white/60 hover:text-white"
                  aria-label="Close Dossier"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-8 scrollbar-thin scrollbar-thumb-white/20">

              {/* Identity & Coordinates */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/10 pb-6">
                <div>
                  <div className="text-xs font-mono text-[#ffd900] tracking-widest uppercase mb-1">
                    PRIMARY DESIGNATOR
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#fffdf0]">
                    ARNAB GHOSH
                  </h1>
                  <p className="text-base text-white/70 font-mono mt-1">
                    alias <span className="text-[#ffd900]">Ryan Arnab</span> · Communication Designer & Creative Technologist
                  </p>
                </div>

                <div className="flex flex-col gap-1 text-xs font-mono text-white/60">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#ffd900]" />
                    <span>Guwahati, IN (26.14°N 91.73°E)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#ffd900]" />
                    <button
                      onClick={handleCopyEmail}
                      className="hover:text-[#ffd900] transition-colors underline underline-offset-4 decoration-white/20"
                    >
                      {copied ? "COPIED TO CLIPBOARD!" : "ryanarnab.design@gmail.com"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="liquid-glass rounded-xl p-5 border border-white/10 space-y-2">
                <div className="text-xs font-mono text-white/40 uppercase tracking-widest">
                  OPERATIONAL PROFILE
                </div>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
                  Communication designer and creative technologist operating at the confluence of relativistic brand identities, kinetic motion choreography, and high-performance spatial interfaces. Driven by the tenet <span className="text-[#ffd900] font-mono">&quot;Curiosity Creates Better&quot;</span>, synthesizing tactile physics with modern web architecture to produce visceral digital artifacts.
                </p>
              </div>

              {/* Technical Arsenal / Matrix */}
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase tracking-widest text-[#ffd900] flex items-center gap-2">
                  <Cpu className="w-4 h-4" /> CORE CAPABILITIES & TECH ARSENAL
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                    <div className="text-xs font-mono text-white font-medium mb-1">
                      Visual Identity & Brand Architecture
                    </div>
                    <p className="text-xs text-white/60 mb-2">
                      Dynamic logo systems, relativistic typographic specimens, comprehensive brand guidelines, design tokens.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Figma", "Illustrator", "Typography", "Art Direction"].map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono border border-white/10 bg-white/5 text-white/70">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                    <div className="text-xs font-mono text-white font-medium mb-1">
                      Motion & Kinetic Choreography
                    </div>
                    <p className="text-xs text-white/60 mb-2">
                      Kinetic letterforms, inertia springs, relativistic motion timing, spatial UI micro-interactions.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {["After Effects", "Framer Motion", "GSAP", "Lottie"].map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono border border-white/10 bg-white/5 text-white/70">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                    <div className="text-xs font-mono text-white font-medium mb-1">
                      Spatial 3D & Simulation
                    </div>
                    <p className="text-xs text-white/60 mb-2">
                      Procedural topology, non-Euclidean lighting, zero-gravity particle systems, CGI visualizers.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Blender 4.2", "Cycles", "Geometry Nodes", "Three.js"].map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono border border-white/10 bg-white/5 text-white/70">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                    <div className="text-xs font-mono text-white font-medium mb-1">
                      Creative Technology & WebGL
                    </div>
                    <p className="text-xs text-white/60 mb-2">
                      High-performance web applications, custom GLSL shaders, procedural Web Audio, haptic feedback.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Next.js 16", "TypeScript", "GLSL Shaders", "Web Audio API"].map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono border border-white/10 bg-white/5 text-white/70">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education & History */}
              <div className="space-y-4 border-t border-white/10 pt-6">
                <div className="text-xs font-mono uppercase tracking-widest text-[#ffd900] flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> ACADEMIC & EXPEDITION ARCHIVE
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                    <div>
                      <div className="text-white font-medium">B.Des in Communication Design</div>
                      <div className="text-white/50">Specialization in Visual Systems & Digital Interaction</div>
                    </div>
                    <div className="text-[#ffd900] mt-1 sm:mt-0">GRADUATION STATUS: COMPLETED</div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                    <div>
                      <div className="text-white font-medium">Independent Creative Technologist & Brand Consultant</div>
                      <div className="text-white/50">Directing visual systems and spatial interactive experiences</div>
                    </div>
                    <div className="text-[#ffd900] mt-1 sm:mt-0">2024 — PRESENT</div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
                <div className="flex items-center gap-4 text-xs font-mono text-white/50">
                  <a
                    href="https://www.behance.net/ryanarnab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ffd900] flex items-center gap-1"
                  >
                    BEHANCE <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/arnab-ghosh-ba99782a7/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ffd900] flex items-center gap-1"
                  >
                    LINKEDIN <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://www.instagram.com/ryanarnab/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#ffd900] flex items-center gap-1"
                  >
                    INSTAGRAM <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleCopyEmail}
                    className="tactile-switch px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 text-white flex-1 sm:flex-initial justify-center"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-[#ffd900]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "COPIED EMAIL" : "COPY CONTACT"}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="tactile-switch-accent px-5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 flex-1 sm:flex-initial justify-center"
                  >
                    <Download className="w-4 h-4" />
                    <span>SAVE DOSSIER</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
  );
}
