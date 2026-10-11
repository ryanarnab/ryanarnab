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
import { getProjectById } from "@/lib/projects";

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
    title: "RYAN ARNAB IDENTITY SYSTEM",
    category: "IDENTITY · MONOGRAM SYSTEM",
    year: "2026",
    client: "Ryan Arnab Studio",
    role: "Brand Identity Designer & Art Director",
    src: "/images/works/brand-identity-1.png",
    conceptSrc: "/images/works/brand-identity-3.png",
    desc: "Personal visual identity and geometric monogram mark system exploring kinetic grid structures and gold accents.",
    narrative: {
      objective: "To engineer an authoritative personal visual identity and monogram mark that harmonizes razor-sharp modernist geometry with dynamic negative space.",
      architecture: "Constructed on interlocking diagonal axes evoking the letterforms 'R' and 'A', paired with a solar gold and deep void dark-mode color taxonomy.",
      impact: "Established as the hallmark signature across all digital platforms, physical portfolio presentations, and personal stationery.",
    },
    colors: [
      { name: "Orbital Gold", hex: "#d4b068" },
      { name: "Deep Void", hex: "#08080C" },
      { name: "Neon Amber", hex: "#EAB308" },
      { name: "Solar Starlight", hex: "#FFFDF0" },
    ],
    specs: [
      { label: "TYPOGRAPHY", value: "Custom Monogram + Geist Mono" },
      { label: "GEOMETRY", value: "Interlocking Geometric Grid" },
      { label: "DELIVERABLES", value: "Brand Guidelines, Monogram Vectors" },
      { label: "PALETTE", value: "Solar Gold & Onyx Void" },
    ],
    tags: ["Brand Architecture", "Monogram", "Identity System", "Personal Brand"],
    externalUrl: "https://www.behance.net/ryanarnab",
  },
  "02": {
    id: "02",
    number: "EXPEDITION // 02",
    title: "KOKUYO CAMEL TYPEFACE REDESIGN",
    category: "TYPOGRAPHY · TYPE DESIGN",
    year: "2026",
    client: "Kokuyo Camel Stationery",
    role: "Typeface Designer & Typographer",
    src: "/images/works/typography-1.png",
    conceptSrc: "/images/works/typography-4.png",
    desc: "A custom display typeface redesign (CAMEL.TTF) and comprehensive type specimen crafted for Kokuyo Camel.",
    narrative: {
      objective: "Revitalizing the legacy visual identity of Camel Stationery by designing a bespoke, expressive display typeface suited for modern packaging and editorial contexts.",
      architecture: "Sculpted organic high-contrast stroke terminals with soft rounded joints, creating an unmistakable tactile warmth balanced with strict baseline metrics.",
      impact: "Produced full alphanumeric glyph sets (CAMEL.TTF), variable weights, and comprehensive specimen showcases across print packaging.",
    },
    colors: [
      { name: "Camel Crimson", hex: "#D93829" },
      { name: "Ivory Parchment", hex: "#F4EEDB" },
      { name: "Deep Charcoal", hex: "#111113" },
      { name: "Warm Ochre", hex: "#C85A32" },
    ],
    specs: [
      { label: "FORMAT", value: "OpenType / TrueType (CAMEL.TTF)" },
      { label: "GLYPHS", value: "Full Alphanumeric Specimen" },
      { label: "APPLICATION", value: "Stationery Packaging & Editorial" },
      { label: "TOOLS", value: "Affinity Designer, Vector Glyphs" },
    ],
    tags: ["Typeface Design", "Typography", "Branding", "Custom Font"],
    externalUrl: "https://www.behance.net/ryanarnab",
  },
  "03": {
    id: "03",
    number: "EXPEDITION // 03",
    title: "ZENED CYBERNETIC CGI",
    category: "3D SIMULATION · CGI",
    year: "2025",
    client: "Zened Dark Fangs Series",
    role: "3D CGI Artist & Simulation Specialist",
    src: "/images/works/zened-1.png",
    conceptSrc: "/images/works/zened-2.png",
    desc: "Dark metallic spatial CGI render exploring biomechanical cybernetic forms and radiant particle emissions.",
    narrative: {
      objective: "Synthesizing an aggressive biomechanical jaw sculpture suspended in deep void space with volumetric particle dispersion and radiant glow.",
      architecture: "High-density mesh sculpting in Blender Cycles combined with rough metallic specular shaders and subsurface emission simulations.",
      impact: "Formed the cornerstone visual aesthetic for dark futuristic spatial art studies and motion title sequences.",
    },
    colors: [
      { name: "Metallic Carbon", hex: "#0D0D11" },
      { name: "Crimson Emission", hex: "#FF1E40" },
      { name: "Specular Platinum", hex: "#E2E8F0" },
      { name: "Void Black", hex: "#000000" },
    ],
    specs: [
      { label: "ENGINE", value: "Blender Cycles GPU Compute" },
      { label: "SHADERS", value: "Rough Metallic Specular + Volume Emission" },
      { label: "PARTICLES", value: "Dynamic Point Emission Cloud" },
      { label: "OUTPUT", value: "4K Master Stills & Title Sequences" },
    ],
    tags: ["3D CGI", "Blender", "Lighting & Particles", "Spatial 3D"],
    externalUrl: "https://www.behance.net/ryanarnab",
  },
  "04": {
    id: "04",
    number: "EXPEDITION // 04",
    title: "TECHNOPHILIA 4.0 FESTIVAL IDENTITY",
    category: "ART DIRECTION · KEY VISUAL",
    year: "2025",
    client: "The Assam Royal Global University",
    role: "Lead Visual Designer & Creative Director",
    src: "/images/works/poster-technophilia.png",
    conceptSrc: "/images/works/poster-technophilia.png",
    desc: "Futuristic cyber-mech key visual identity and comprehensive collateral system for annual technology symposium.",
    narrative: {
      objective: "Crafting a showstopping visual anchor for North-East India's premier collegiate technology festival to drive high engagement and ticket registrations.",
      architecture: "Blended a hyper-detailed robotic helmet character with tribal patterned accent bands and tactical HUD grid layout.",
      impact: "Prominently featured across campus billboards, digital banners, prize ceremony stages, and social media campaigns with 10k+ reach.",
    },
    colors: [
      { name: "Mech Cyan", hex: "#00E5FF" },
      { name: "HUD Amber", hex: "#FFB703" },
      { name: "Tactical Navy", hex: "#0B192C" },
      { name: "Royal Gold", hex: "#D4AF37" },
    ],
    specs: [
      { label: "COLLATERAL", value: "Main Poster, Event Badges, Stage LED" },
      { label: "PRIZE POOL", value: "₹3,00,000+ Featured Competition" },
      { label: "PRINT SIZE", value: "A1 Billboard & A3 Poster Runs" },
      { label: "ASSETS", value: "Digital Social Campaign Kit" },
    ],
    tags: ["Key Visual", "Art Direction", "Event Branding", "Cyberpunk"],
    externalUrl: "https://www.behance.net/ryanarnab",
  },
  "05": {
    id: "05",
    number: "EXPEDITION // 05",
    title: "EASTERN HIMALAYAN NATURENOMICS",
    category: "EDITORIAL · VISUAL CAMPAIGN",
    year: "2025",
    client: "Balipara Foundation & Royal Global University",
    role: "Graphic Designer & Editorial Director",
    src: "/images/works/poster-naturenomics.png",
    conceptSrc: "/images/works/poster-winterfest.png",
    desc: "13th Eastern Himalayan Naturenomics Forum visual identity, typography system, and ecological publication design.",
    narrative: {
      objective: "Creating a dignified and inspiring visual identity for high-level ecological forums bringing together international scientists, youth, and indigenous leaders.",
      architecture: "Integrated majestic Himalayan landscape photography with refined serif typography and clean frosted glass metadata containers.",
      impact: "Deployed across summit registration materials, environmental whitepapers, and international delegate collateral.",
    },
    colors: [
      { name: "Forest Pine", hex: "#1B4332" },
      { name: "Mist Ivory", hex: "#F8F9FA" },
      { name: "Earth Ochre", hex: "#D4A373" },
      { name: "Alpine Sky", hex: "#457B9D" },
    ],
    specs: [
      { label: "MEDIUM", value: "Summit Posters, Forum Booklets, QR Portals" },
      { label: "VENUE", value: "The Assam Royal Global University" },
      { label: "TARGET", value: "Regional Practitioners & Youth Leaders" },
      { label: "DELIVERABLES", value: "Key Visual, Digital Banners, Print" },
    ],
    tags: ["Editorial", "Environmental", "Print & Digital", "Typography"],
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
  const found = projectId ? getProjectById(projectId) : null;
  const rawProject = found && found.status === "showcase" 
    ? found 
    : (projectId && (projectId === "01" || projectId === "02") ? PROJECT_DETAILS[projectId] : null);

  const project = rawProject ? {
    ...rawProject,
    number: (rawProject as any).code || (rawProject as any).number || `EXPEDITION // ${rawProject.id}`,
    client: rawProject.client || "Studio Archive",
    role: rawProject.role || "Lead Creative Technologist",
    colors: rawProject.colors || [
      { name: "Orbital Gold", hex: "#d4b068" },
      { name: "Deep Void", hex: "#08080C" }
    ],
    specs: rawProject.specs || [
      { label: "GRID SCALE", value: "8pt Modular System" },
      { label: "STATUS", value: "Verified · Active" }
    ],
    narrative: rawProject.narrative || {
      objective: rawProject.desc,
      architecture: "Constructed on relativistic grid geometry with dynamic micro-interactions.",
      impact: "Archived and deployed as an active artifact in the personal telemetry portfolio."
    },
    tags: rawProject.tags || [rawProject.category, "Expedition"]
  } : null;
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
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl bg-[#0a0a10] border border-[#d4b068]/30 shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden z-10 my-auto flex flex-col max-h-[88vh] 2xl:max-h-[85vh]"
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
        <div 
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          tabIndex={0}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-7 modal-scroll focus:outline-none"
        >
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
