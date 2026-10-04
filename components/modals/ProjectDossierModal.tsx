"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  ArrowUpRight,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { useSound } from "@/components/sound/SoundProvider";
import { triggerLightHaptic } from "@/lib/haptics";

export interface ProjectDetail {
  id: string;
  number: string;
  title: string;
  category: string;
  year: string;
  client: string;
  role: string;
  src: string;
  conceptSrc?: string; // For the interactive before/after comparison
  desc: string;
  narrative: {
    objective: string;
    architecture: string;
    impact: string;
  };
  colors: { name: string; hex: string }[];
  specs: { label: string; value: string }[];
  tags: string[];
  externalUrl?: string;
}

export const PROJECT_DETAILS: Record<string, ProjectDetail> = {
  "01": {
    id: "01",
    number: "EXPEDITION // 01",
    title: "CHRONO IDENTITY SYSTEM",
    category: "IDENTITY · SPATIAL MOTION",
    year: "2026",
    client: "Chrono Labs Zurich",
    role: "Lead Brand Architect & Motion Director",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    conceptSrc: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
    desc: "A relativistic temporal brand identity combining kinetic typography with gravity choreographies.",
    narrative: {
      objective: "To construct a visual identity that evolves as a function of time, simulating relativistic acceleration across digital and spatial brand touchpoints.",
      architecture: "Engineered variable typography axes driven by mathematical momentum equations, complemented by liquid metal materials rendered in Blender and WebGL.",
      impact: "Adopted across global keynote presentations, spatial exhibition pavilions, and a comprehensive 240-page interactive brand architecture system.",
    },
    colors: [
      { name: "Orbital Gold", hex: "#d4b068" },
      { name: "Deep Void", hex: "#08080C" },
      { name: "Mars Rust", hex: "#EAB308" },
      { name: "Solar Starlight", hex: "#FFFDF0" },
    ],
    specs: [
      { label: "TYPOGRAPHY", value: "Instrument Serif + Geist Mono" },
      { label: "CHOREOGRAPHY", value: "Variable Inertia Springs" },
      { label: "GEOMETRY", value: "12-Col Orbital Relativistic Grid" },
      { label: "DELIVERABLES", value: "3D Motion Tokens, Design System" },
    ],
    tags: ["Brand Architecture", "Motion Systems", "Spatial 3D", "Procedural Typography"],
    externalUrl: "https://www.behance.net/ryanarnab",
  },
  "02": {
    id: "02",
    number: "EXPEDITION // 02",
    title: "AURA HAPTIC INTERFACE",
    category: "CREATIVE DEV · HAPTICS",
    year: "2026",
    client: "Aura Spatial Devices",
    role: "Creative Technologist & UI Engineer",
    src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
    conceptSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    desc: "Tactile haptic interaction framework built with soft-touch switch physics and real-time magnetic spring resistance.",
    narrative: {
      objective: "Bridging the tactile feedback gap in flat glass touchscreens by synthesizing physical spring tension and procedural audio impulses.",
      architecture: "Synthesized zero-latency Web Audio micro-clicks synchronized with WebGL spring simulations and device vibration hardware API.",
      impact: "Reduced interaction friction by 40% while elevating user delight and dwell-time across spatial web interfaces.",
    },
    colors: [
      { name: "Molten Chrome", hex: "#E0E0E6" },
      { name: "Cyan Resonance", hex: "#00E5FF" },
      { name: "Telemetry Amber", hex: "#d4b068" },
      { name: "Obsidian", hex: "#050508" },
    ],
    specs: [
      { label: "ENGINE", value: "Next.js 16 + WebGL + Web Audio" },
      { label: "PHYSICS", value: "RK4 Spring Differential Solver" },
      { label: "LATENCY", value: "< 4.2ms Audio-Visual Sync" },
      { label: "OUTPUT", value: "Open Haptic Component Library" },
    ],
    tags: ["WebGL", "Tactile UI", "Spring Physics", "Next.js"],
    externalUrl: "https://www.behance.net/ryanarnab",
  },
  "03": {
    id: "03",
    number: "EXPEDITION // 03",
    title: "GRAVITY SYSTEMS SIMULATION",
    category: "3D SIMULATION · CGI",
    year: "2025",
    client: "Astrophysics Observatory",
    role: "Spatial 3D & Simulation Artist",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    conceptSrc: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1200&auto=format&fit=crop",
    desc: "Particle-driven zero-gravity simulations exploring celestial gravitational pulls and physical trajectory maps.",
    narrative: {
      objective: "Visualizing complex N-body gravitational fields and black hole light bending in an accessible, cinematic visual format.",
      architecture: "Created procedural geometry nodes in Blender combined with GPU compute particle pipelines running at 60 FPS.",
      impact: "Featured in international astronomy symposiums and digital planetarium dome projections.",
    },
    colors: [
      { name: "Singularity Black", hex: "#000000" },
      { name: "Accretion Gold", hex: "#d4b068" },
      { name: "Event Horizon", hex: "#6366F1" },
      { name: "Plasma White", hex: "#FFFFFF" },
    ],
    specs: [
      { label: "SOFTWARE", value: "Blender 4.2 + Geometry Nodes" },
      { label: "PARTICLES", value: "1,500,000 Real-Time Points" },
      { label: "RENDER", value: "Cycles GPU + Custom GLSL Shaders" },
      { label: "RATIO", value: "Ultra-Wide 21:9 & Spatial Dome" },
    ],
    tags: ["Blender CGI", "N-Body Physics", "Lighting", "Simulations"],
    externalUrl: "https://www.behance.net/ryanarnab",
  },
  "04": {
    id: "04",
    number: "EXPEDITION // 04",
    title: "COSMIC FLUX EXPERIENCES",
    category: "EXPERIENCE DESIGN · WEBGL",
    year: "2025—26",
    client: "Soundwave Spatial Lab",
    role: "Creative Director & Shader Developer",
    src: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1200&auto=format&fit=crop",
    conceptSrc: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
    desc: "Interactive planetary shader engine reacting dynamically to acoustic frequencies and user velocity.",
    narrative: {
      objective: "Synthesizing musical harmonics into real-time undulating planetary atmospheres that pulse with listener audio input.",
      architecture: "Fast Fourier Transform (FFT) audio analysis mapped directly to GLSL vertex displacement and chromatic dispersion algorithms.",
      impact: "Praised by audiovisual creators worldwide; over 50,000 interactive listening sessions generated.",
    },
    colors: [
      { name: "Cosmic Neon", hex: "#A855F7" },
      { name: "Solar Flare", hex: "#d4b068" },
      { name: "Deep Sea Abyss", hex: "#0A0D1A" },
      { name: "Stardust", hex: "#E2E8F0" },
    ],
    specs: [
      { label: "AUDIO SYNC", value: "Real-time FFT Frequency Bins" },
      { label: "SHADERS", value: "Custom GLSL Raymarching" },
      { label: "FPS", value: "Locked 60 FPS on Mobile & Desktop" },
      { label: "INTEGRATION", value: "Web Audio + Canvas WebGL2" },
    ],
    tags: ["GLSL Shaders", "Audio Reactive", "Interaction", "Creative Code"],
    externalUrl: "https://www.behance.net/ryanarnab",
  },
  "05": {
    id: "05",
    number: "EXPEDITION // 05",
    title: "TELEMETRY LABS ARCHIVE",
    category: "TYPOGRAPHY · ART DIRECTION",
    year: "2025",
    client: "Orbital Editorial",
    role: "Editorial Art Director & Typographer",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    conceptSrc: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
    desc: "Multi-layered cosmic editorial specimen celebrating experimental monospaced typography and radar grid layouts.",
    narrative: {
      objective: "Creating a tactile physical and digital editorial publication documenting deep space telemetry and radio telescope intercepts.",
      architecture: "Constructed on modular 32-column swiss grids fused with sci-fi radar indexing and foil-stamped liquid gold metallic inks.",
      impact: "Awarded Tokyo Type Directors Club Annual recognition and featured in contemporary typographic anthologies.",
    },
    colors: [
      { name: "Radar Amber", hex: "#d4b068" },
      { name: "Carbon Fiber", hex: "#121214" },
      { name: "Silver Leaf", hex: "#CBD5E1" },
      { name: "Void Grey", hex: "#27272A" },
    ],
    specs: [
      { label: "FORMAT", value: "Print Specimen + Interactive Web" },
      { label: "FINISHING", value: "Cold Metallic Foil & Deboss" },
      { label: "GRID", value: "32-Column Relativistic Radar" },
      { label: "EDITION", value: "Limited 500 Copies Worldwide" },
    ],
    tags: ["Editorial", "Monospace", "Print / Digital", "Art Direction"],
    externalUrl: "https://www.behance.net/ryanarnab",
  },
};

interface ProjectDossierModalProps {
  projectId: string | null;
  onClose: () => void;
}

export default function ProjectDossierModal({
  projectId,
  onClose,
}: ProjectDossierModalProps) {
  const project = projectId ? PROJECT_DETAILS[projectId] || null : null;
  const { playClick, playHover, playSuccess, playWarp } = useSound();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && project) {
        playClick();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose, playClick]);

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    playSuccess();
    triggerLightHaptic();
    setTimeout(() => {
      setCopiedHex(null);
    }, 1500);
  };

  if (!project) return null;

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

      {/* Modal Container — Angular Riot Styling */}
      <div 
        className="relative w-full max-w-4xl bg-[#0a0a10] border border-[#d4b068]/30 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden z-10 my-auto flex flex-col max-h-[88vh]"
        style={{ clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))" }}
      >
        {/* Top gold accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#d4b068] to-transparent" />

        {/* Top Telemetry Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-3">
            <span 
              className="h-2 w-2 bg-[#d4b068] animate-ping" 
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            />
            <span className="text-xs font-mono font-semibold tracking-[0.2em] text-[#d4b068]">
              {project.number}
            </span>
            <span className="hidden sm:inline-block text-white/30 text-xs">/</span>
            <span className="hidden sm:inline-block text-xs font-mono text-white/50 tracking-wider">
              {project.category}
            </span>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 text-white/60 hover:text-white angular-panel-sm transition-colors"
            style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
            aria-label="Close Case Study"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-7 scrollbar-thin scrollbar-thumb-white/20">
          {/* Title & Metadata Row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <div className="text-[10px] font-mono text-[#d4b068] tracking-widest uppercase mb-1 flex items-center gap-1.5">
                <span>✦</span>
                <span>EXPEDITION DOSSIER</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#fffdf0] mb-2 uppercase">
                {project.title}
              </h2>
              <div className="w-20 h-[2px] bg-[#d4b068] my-2" />
              <p className="text-white/60 text-sm sm:text-base max-w-2xl font-sans leading-relaxed">
                {project.desc}
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-col gap-2 sm:gap-1 text-xs font-mono text-white/50 shrink-0">
              <div><span className="text-white/30">CLIENT:</span> <span className="text-white/80">{project.client}</span></div>
              <div><span className="text-white/30">ROLE:</span> <span className="text-white/80">{project.role}</span></div>
              <div><span className="text-white/30">CYCLE:</span> <span className="text-[#d4b068]">{project.year}</span></div>
            </div>
          </div>

          {/* Visual Showcase Frame */}
          <div 
            className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden border border-white/15 shadow-xl bg-black"
            style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
          >
            <Image
              src={project.src}
              alt={project.title}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
              priority
            />
          </div>

          {/* Design System Color Swatches */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/60 tracking-wider uppercase">
                SYSTEM COLOR TOKENS (CLICK TO COPY HEX)
              </span>
              {copiedHex && (
                <span className="text-[#d4b068] font-mono flex items-center gap-1 text-xs animate-pulse">
                  <Check className="w-3.5 h-3.5" /> COPIED {copiedHex}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {project.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => copyColor(c.hex)}
                  onMouseEnter={playHover}
                  className="group p-3 border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-[#d4b068]/40 transition-all text-left flex items-center gap-3 cursor-pointer"
                  style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                >
                  <div
                    className="w-8 h-8 border border-white/20 shrink-0 shadow-inner"
                    style={{ 
                      backgroundColor: c.hex,
                      clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" 
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-white truncate">
                      {c.name}
                    </div>
                    <div className="text-[11px] font-mono text-white/50 group-hover:text-[#d4b068] flex items-center gap-1">
                      {c.hex}
                      <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Architectural Narrative */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#d4b068] flex items-center gap-1">
                <span>✦</span> 01 // THE CHALLENGE
              </span>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                {project.narrative.objective}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#d4b068] flex items-center gap-1">
                <span>✦</span> 02 // ARCHITECTURE
              </span>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                {project.narrative.architecture}
              </p>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#d4b068] flex items-center gap-1">
                <span>✦</span> 03 // OUTCOME
              </span>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                {project.narrative.impact}
              </p>
            </div>
          </div>

          {/* Technical Specifications Matrix */}
          <div 
            className="bg-white/[0.02] p-5 border border-white/10"
            style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
          >
            <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-3">
              TELEMETRY SPECIFICATIONS
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {project.specs.map((spec) => (
                <div key={spec.label}>
                  <div className="text-[10px] font-mono text-white/40 mb-1">
                    {spec.label}
                  </div>
                  <div className="text-xs font-mono text-white font-medium">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[11px] font-mono border border-white/15 bg-white/5 text-white/70"
                  style={{ clipPath: "polygon(0 0, calc(100% - 4px) 0, 100% 4px, 100% 100%, 4px 100%, 0 calc(100% - 4px))" }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {project.externalUrl && (
                <a
                  href={project.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    playClick();
                    triggerLightHaptic();
                  }}
                  className="px-4 py-2.5 border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono flex items-center gap-2 text-white flex-1 sm:flex-initial justify-center transition-colors"
                  style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
                >
                  <span>VIEW ON BEHANCE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => {
                  playWarp();
                  onClose();
                  const contactEl = document.querySelector("#contact");
                  contactEl?.scrollIntoView({ behavior: "smooth" });
                }}
                className="tactile-switch-accent px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 flex-1 sm:flex-initial justify-center cursor-pointer"
                style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
              >
                <span>INQUIRE ABOUT MISSION</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
