"use client";

import { useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type Transition as MotionTransition,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProjectItem {
  id: string;
  number: string;
  text: string;
  category: string;
  year: string;
  src: string;
  link?: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: "01",
    number: "EXPEDITION // 01",
    text: "CHRONO IDENTITY",
    category: "IDENTITY · SPATIAL MOTION",
    year: "2026",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "02",
    number: "EXPEDITION // 02",
    text: "AURA INTERFACE",
    category: "CREATIVE DEV · HAPTICS",
    year: "2026",
    src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "03",
    number: "EXPEDITION // 03",
    text: "GRAVITY SYSTEMS",
    category: "3D SIMULATION · CGI",
    year: "2025",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "04",
    number: "EXPEDITION // 04",
    text: "COSMIC FLUX",
    category: "EXPERIENCE DESIGN · WEBGL",
    year: "2025—26",
    src: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "05",
    number: "EXPEDITION // 05",
    text: "TELEMETRY LABS",
    category: "TYPOGRAPHY · ART DIRECTION",
    year: "2025",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
  },
];

const DEFAULT_TRANSITION: MotionTransition = {
  type: "spring",
  stiffness: 400,
  damping: 40,
  mass: 1,
};

export default function DiscoverySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springCfg = { stiffness: 70, damping: 28, mass: 0.5 };
  const x = useSpring(rawX, springCfg);
  const y = useSpring(rawY, springCfg);

  const anyActive = hovered !== null;

  const onMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set(e.clientX - rect.left + 220);
    rawY.set(e.clientY - rect.top);
  };

  return (
    <section
      id="work"
      ref={containerRef}
      onMouseMove={onMove}
      onMouseLeave={() => {
        setHovered(null);
        (window as any).setCursorLabel?.("");
      }}
      className="relative w-full overflow-hidden bg-black text-white px-6 sm:px-10 py-24 sm:py-36"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        
        {/* SECTION HEADER */}
        <div className="mb-16 sm:mb-24 flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">
              Expeditions / Selected Artifacts
            </span>
          </div>

          <span className="text-xs font-mono tracking-widest text-white/30">
            01
          </span>
        </div>

        {/* DESKTOP HOVER REVEAL (Hidden on mobile/touch, visible on md+) */}
        <div className="hidden md:block relative min-h-[560px]">
          
          {/* FLOATING IMAGE PORTAL */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              x,
              y,
              translateX: "-50%",
              translateY: "-50%",
              width: 320,
              height: 440,
              borderRadius: 20,
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 30px rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            animate={{ opacity: anyActive ? 1 : 0, scale: anyActive ? 1 : 0.92 }}
            transition={DEFAULT_TRANSITION}
          >
            {PROJECTS.map((item, i) => {
              const yPos =
                hovered === null
                  ? "100%"
                  : i < hovered
                  ? "-100%"
                  : i > hovered
                  ? "100%"
                  : "0%";
              return (
                <motion.div
                  key={item.id}
                  initial={false}
                  animate={{ y: yPos }}
                  transition={DEFAULT_TRANSITION}
                  className="absolute inset-0 h-full w-full overflow-hidden bg-zinc-900"
                >
                  <img
                    src={item.src}
                    alt={item.text}
                    className="h-full w-full object-cover grayscale contrast-125 transition-transform duration-700 hover:scale-105"
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* PROJECT LIST */}
          <div
            onMouseLeave={() => setHovered(null)}
            className="flex flex-col gap-10 sm:gap-14"
          >
            {PROJECTS.map((item, i) => {
              const isHovered = hovered === i;
              const color = anyActive ? (isHovered ? "#ffffff" : "rgba(255,255,255,0.25)") : "#ffffff";

              return (
                <div
                  key={item.id}
                  onMouseEnter={() => {
                    setHovered(i);
                    (window as any).setCursorLabel?.("ORBIT // VIEW");
                  }}
                  className="group relative cursor-pointer border-b border-white/5 pb-8 transition-colors duration-300 hover:border-cyan-400/30"
                >
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-6">
                      <span className="font-mono text-xs uppercase tracking-widest text-white/30 group-hover:text-cyan-400/80 transition-colors">
                        {item.number}
                      </span>
                      <h3
                        style={{ color }}
                        className="text-[clamp(38px,5vw,76px)] font-medium tracking-[-0.06em] leading-[0.9] transition-colors duration-300"
                      >
                        {item.text}
                      </h3>
                    </div>

                    <div className="flex items-center gap-8 text-right">
                      <span className="text-xs uppercase tracking-[0.16em] text-white/35 group-hover:text-cyan-300/70 transition-colors">
                        {item.category}
                      </span>
                      <span className="font-mono text-xs text-white/30">
                        {item.year}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MOBILE / TABLET TOUCH-FRIENDLY CARDS (Visible on mobile/tablet) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-6">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all active:scale-[0.98] active:border-cyan-400/40 active:shadow-[0_0_20px_rgba(56,189,248,0.15)]"
            >
              {/* Image Preview */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-900">
                <img
                  src={project.src}
                  alt={project.text}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-mono tracking-widest text-white/80 backdrop-blur-md">
                  {project.id}
                </div>
              </div>

              {/* Card Meta */}
              <div className="mt-4 flex items-baseline justify-between">
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-white">
                    {project.text}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-widest text-white/40">
                    {project.category}
                  </p>
                </div>
                <span className="font-mono text-xs text-white/30">
                  {project.year}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}