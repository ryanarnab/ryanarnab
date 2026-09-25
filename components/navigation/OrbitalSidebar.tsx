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

  // Calculate probe Y position on the vertical rail (0px to 220px)
  const probeY = useTransform(smoothProgress, [0, 1], [0, 220]);

  // Dynamic simulated orbital altitude: 140 km (LEO) -> 920 km (Deep Orbit)
  const altitudeKm = useTransform(smoothProgress, [0, 1], [140, 920]);
  const [displayedAltitude, setDisplayedAltitude] = useState(140);

  useEffect(() => {
    const unsubAlt = altitudeKm.on("change", (val) => {
      setDisplayedAltitude(Math.round(val));
    });

    const unsubProg = documentProgress.on("change", (val) => {
      // Find current active sector based on scroll threshold
      for (let i = SECTORS.length - 1; i >= 0; i--) {
        if (val >= SECTORS[i].threshold - 0.08) {
          setActiveSector(SECTORS[i].id);
          break;
        }
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
      className="hidden lg:flex fixed left-6 sm:left-8 top-1/2 -translate-y-1/2 z-40 flex-col items-center select-none pointer-events-auto"
    >
      {/* TOP TELEMETRY STATUS */}
      <div className="mb-3 flex flex-col items-center">
        <span className="text-[9px] font-mono tracking-[0.24em] text-[#ffd900] uppercase font-bold">
          ALT {displayedAltitude}K
        </span>
        <span className="text-[8px] font-mono tracking-[0.16em] text-white/30 uppercase mt-0.5">
          ORBIT // TRACK
        </span>
      </div>

      {/* DOCKED VERTICAL RAIL (Liquid Glass Telemetry Pod) */}
      <div className="relative h-[230px] w-9 liquid-glass rounded-full flex items-center justify-center p-1">
        {/* Background track line */}
        <div className="absolute top-4 bottom-4 w-[1px] bg-gradient-to-b from-white/10 via-white/20 to-white/10 rounded-full" />

        {/* Dynamic active trail fill */}
        <motion.div
          className="absolute top-4 w-[2px] bg-gradient-to-b from-[#ffd900] to-yellow-300 shadow-[0_0_12px_rgba(255,217,0,0.8)] rounded-full origin-top"
          style={{ height: probeY }}
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
                {/* Node Tick Dot */}
                <div
                  className={`h-2.5 w-2.5 rounded-full border transition-all duration-300 flex items-center justify-center ${
                    isActive
                      ? "border-[#ffd900] bg-[#ffd900] shadow-[0_0_12px_rgba(255,217,0,1)] scale-110"
                      : "border-white/30 bg-black/60 hover:border-white hover:scale-125"
                  }`}
                >
                  <span
                    className={`h-1 w-1 rounded-full ${
                      isActive ? "bg-black" : "bg-transparent group-hover:bg-[#ffd900]"
                    }`}
                  />
                </div>

                {/* HOVER FLYOUT TOOLTIP (Liquid Glass Flyout) */}
                <div
                  className={`absolute left-8 flex items-center gap-2 rounded-full liquid-glass px-3 py-1 backdrop-blur-xl transition-all duration-200 pointer-events-none whitespace-nowrap shadow-[0_4px_24px_rgba(0,0,0,0.8)] ${
                    isHovered
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2"
                  }`}
                >
                  <span className="font-mono text-[9px] text-[#ffd900] font-bold">
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

        {/* 🛰️ ORBITAL SATELLITE PROBE RETICLE (Glides with scroll progress) */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-10 flex items-center justify-center"
          style={{ top: probeY }}
        >
          <div className="relative flex items-center justify-center h-4 w-4">
            {/* Pulsing beacon radar ring */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd900] opacity-60" />
            {/* Core probe diamond */}
            <span className="relative h-2 w-2 rotate-45 rounded-sm bg-[#ffd900] border border-white shadow-[0_0_10px_rgba(255,217,0,1)]" />
          </div>
        </motion.div>
      </div>

      {/* BOTTOM SECTOR CODE */}
      <div className="mt-3 flex flex-col items-center">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#ffd900]">
          SEC // {SECTORS.find((s) => s.id === activeSector)?.code || "00"}
        </span>
        <div className="mt-1 flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-[#ffd900] animate-pulse" />
          <span className="text-[8px] font-mono text-white/40 uppercase">LIVE</span>
        </div>
      </div>
    </aside>
  );
}
