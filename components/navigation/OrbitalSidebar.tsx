"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useDocumentScrollProgress, useScrollController } from "../scroll/ScrollProvider";

interface SectorNode {
  id: string;
  code: string;
  label: string;
  threshold: number; // approximate progress threshold 0..1
}

const SECTORS: SectorNode[] = [
  { id: "hero", code: "00", label: "ORIGIN", threshold: 0 },
  { id: "work", code: "01", label: "EXPEDITIONS", threshold: 0.22 },
  { id: "about", code: "02", label: "OBSERVATORY", threshold: 0.52 },
  { id: "playground", code: "03", label: "LAB", threshold: 0.74 },
  { id: "contact", code: "04", label: "TRANSMISSION", threshold: 0.94 },
];

export default function OrbitalSidebar() {
  const documentProgress = useDocumentScrollProgress();
  const { scrollTo } = useScrollController();
  const [activeSector, setActiveSector] = useState("hero");
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  // Smooth physical spring following the scroll
  const smoothProgress = useSpring(documentProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.4,
  });

  // Calculate probe Y position on the vertical rail (clamped strictly within tick centers: 21px to 209px)
  const probeY = useTransform(smoothProgress, [0, 1], [21, 209], { clamp: true });
  const trailHeight = useTransform(smoothProgress, [0, 1], [0, 188], { clamp: true });

  // Dynamic simulated orbital altitude: 140 km (LEO) -> 920 km (Deep Orbit), strictly clamped
  const altitudeKm = useTransform(smoothProgress, [0, 1], [140, 920], { clamp: true });
  const [displayedAltitude, setDisplayedAltitude] = useState(140);

  useEffect(() => {
    let lastAlt = 140;
    const unsubAlt = altitudeKm.on("change", (val) => {
      const rounded = Math.round(val);
      if (rounded !== lastAlt) {
        lastAlt = rounded;
        setDisplayedAltitude(rounded);
      }
    });

    let lastSector = "hero";
    const unsubProg = documentProgress.on("change", (val) => {
      // Find current active sector based on scroll threshold
      let current = "hero";
      for (let i = SECTORS.length - 1; i >= 0; i--) {
        if (val >= SECTORS[i].threshold - 0.08) {
          current = SECTORS[i].id;
          break;
        }
      }
      if (current !== lastSector) {
        lastSector = current;
        setActiveSector(current);
      }
    });

    return () => {
      unsubAlt();
      unsubProg();
    };
  }, [altitudeKm, documentProgress]);

  const handleSectorClick = (sectorId: string) => {
    scrollTo(`#${sectorId}`);
  };

  return (
    <aside
      aria-label="Orbital Telemetry Navigation"
      className="hidden lg:flex fixed left-6 sm:left-8 xl:left-10 top-1/2 -translate-y-1/2 z-40 flex-col items-center select-none pointer-events-auto"
    >
      {/* TOP TELEMETRY STATUS */}
      <div className="mb-3 flex flex-col items-center">
        <span className="text-[9px] font-mono tracking-[0.24em] text-[#d4b068] uppercase font-bold">
          ALT {displayedAltitude}K
        </span>
        <span className="text-[8px] font-mono tracking-[0.16em] text-white/25 uppercase mt-0.5">
          Orbit // Track
        </span>
      </div>

      {/* DOCKED VERTICAL RAIL — Angular Telemetry Pod */}
      <div className="relative h-[230px] w-9 flex items-center justify-center p-1 overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(5,5,10,0.8))",
          border: "1px solid rgba(255,255,255,0.08)",
          clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
        }}
      >
        {/* Background track line */}
        <div className="absolute top-[21px] bottom-[21px] w-[1px] bg-gradient-to-b from-white/8 via-white/15 to-white/8" />

        {/* Dynamic active trail fill */}
        <motion.div
          className="absolute top-[21px] w-[2px] bg-gradient-to-b from-[#d4b068] to-[#d4b068]/40 shadow-[0_0_12px_rgba(212, 176, 104,0.6)] origin-top pointer-events-none"
          style={{ height: trailHeight }}
        />

        {/* CLICKABLE SECTOR TICK NODES */}
        <div className="absolute inset-0 flex flex-col justify-between py-4">
          {SECTORS.map((sector) => {
            const isActive = activeSector === sector.id;
            const isHovered = hoveredSector === sector.id;

            return (
              <div
                key={sector.id}
                data-cursor-label={`orbit // ${sector.label.toLowerCase()}`}
                className="relative flex items-center justify-center cursor-pointer group"
                onMouseEnter={() => setHoveredSector(sector.id)}
                onMouseLeave={() => setHoveredSector(null)}
                onClick={() => handleSectorClick(sector.id)}
              >
                {/* Node Tick — Diamond shape for active, square for inactive */}
                <div
                  className={`h-2.5 w-2.5 border transition-all duration-300 flex items-center justify-center ${
                    isActive
                      ? "border-[#d4b068] bg-[#d4b068] shadow-[0_0_12px_rgba(212, 176, 104,1)] scale-110"
                      : "border-white/25 bg-black/60 hover:border-[#d4b068]/60 hover:scale-125"
                  }`}
                  style={{
                    clipPath: isActive 
                      ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
                      : "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                  }}
                >
                  <span
                    className={`h-1 w-1 ${
                      isActive ? "bg-black" : "bg-transparent group-hover:bg-[#d4b068]"
                    }`}
                    style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                  />
                </div>

                {/* HOVER FLYOUT TOOLTIP — Angular */}
                <div
                  className={`absolute left-8 flex items-center gap-2 px-3 py-1 backdrop-blur-xl transition-all duration-200 pointer-events-none whitespace-nowrap shadow-[0_4px_24px_rgba(0,0,0,0.8)] ${
                    isHovered
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2"
                  }`}
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(5,5,10,0.9))",
                    border: "1px solid rgba(255,255,255,0.1)",
                    clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
                  }}
                >
                  <span className="font-mono text-[9px] text-[#d4b068] font-bold">
                    {sector.code}
                  </span>
                  <span className="text-[10px] font-mono tracking-widest text-[#fffdf0] uppercase">
                    {sector.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ORBITAL SATELLITE PROBE RETICLE — Angular Diamond */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center"
          style={{ top: probeY }}
        >
          <div className="relative flex items-center justify-center h-4 w-4">
            {/* Pulsing beacon ring */}
            <span className="animate-ping absolute inline-flex h-full w-full bg-[#d4b068] opacity-40"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            />
            {/* Core probe diamond */}
            <span className="relative h-2.5 w-2.5 bg-[#d4b068] border border-white shadow-[0_0_10px_rgba(212, 176, 104,1)]"
              style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
            />
          </div>
        </motion.div>
      </div>

      {/* BOTTOM SECTOR CODE */}
      <div className="mt-3 flex flex-col items-center">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#d4b068]">
          SEC // {SECTORS.find((s) => s.id === activeSector)?.code || "00"}
        </span>
        <div className="mt-1 flex items-center gap-1">
          <span className="h-1 w-1 bg-[#d4b068] animate-pulse"
            style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
          />
          <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Live</span>
        </div>
      </div>
    </aside>
  );
}
