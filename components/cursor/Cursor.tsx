"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { MousePointer2, Sparkles, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ClickEffects from "./ClickEffects";

type Point = {
  x: number;
  y: number;
  time: number;
};

type Mode = "normal" | "draw";

declare global {
  interface Window {
    setCursorLabel?: (label: string) => void;
    __starfieldMorphBlend?: number;
  }
}

const emptySubscribe = () => () => {};

const subscribePointerFine = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mediaQuery = window.matchMedia("(pointer: fine)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};
const getPointerFineSnapshot = () => window.matchMedia("(pointer: fine)").matches;
const getServerPointerFineSnapshot = () => false;

// Contextual label resolver — decides what the cursor pill should say
function resolveContextualLabel(
  element: Element | null,
  interactiveEl: Element | null,
  morphBlend: number,
  cursorX: number,
  viewportWidth: number
): string {
  // Check if user is currently on the hero screen
  const isHeroScreen =
    typeof window !== "undefined" &&
    window.scrollY < (window.innerHeight || 800) * 0.55 &&
    (window.location.pathname === "/" || window.location.pathname === "");

  // --- 1. STARFIELD MORPH LABELS (STRICTLY HERO SCREEN ONLY) ---
  if (isHeroScreen) {
    if (morphBlend >= 0.72) {
      return "arnab ☞";
    }
    if (morphBlend > 0.05) {
      return "move more ☞";
    }
  }

  // --- 2. EXPLICIT data-cursor-label attribute ---
  if (interactiveEl) {
    const explicit = interactiveEl.getAttribute("data-cursor-label");
    if (explicit) return explicit;

    const parent = interactiveEl.closest("[data-cursor-label]");
    if (parent) {
      const parentLabel = parent.getAttribute("data-cursor-label");
      if (parentLabel) return parentLabel;
    }
  }

  // --- 3. SPECIAL INTERACTIVE SELECTORS ---
  if (element?.closest("[data-warp-text]")) {
    return "gravity pull 🧲";
  }

  if (!interactiveEl) return "";

  // --- 4. SMART CONTEXTUAL DETECTION FOR UNLABELLED ELEMENTS ---
  const tag = interactiveEl.tagName.toLowerCase();
  const role = interactiveEl.getAttribute("role");
  const href = interactiveEl.getAttribute("href");
  const text = interactiveEl.textContent?.trim().toLowerCase() || "";

  // Links
  if (tag === "a" || role === "link") {
    if (href?.startsWith("mailto:")) return "send transmission ✉";
    if (href?.startsWith("tel:")) return "call ✆";
    if (text.includes("behance")) return "behance ↗";
    if (text.includes("linkedin")) return "linkedin ↗";
    if (text.includes("instagram")) return "instagram ↗";
    if (href?.startsWith("http") && !href?.includes(window.location.hostname)) return "open link ↗";
    if (href === "/" || text.includes("home") || text.includes("origin")) return "home ✦";
    if (text.includes("work") || text.includes("project") || text.includes("expedition")) return "expeditions ✦";
    if (text.includes("about") || text.includes("observatory")) return "observatory ✦";
    if (text.includes("lab") || text.includes("playground")) return "research lab 🧪";
    if (text.includes("contact") || text.includes("talk") || text.includes("transmit")) return "transmit signal ⚡";
    return "explore ↗";
  }

  // Buttons
  if (tag === "button" || role === "button") {
    if (text.includes("explore") || text.includes("expedition")) return "explore expeditions ↓";
    if (text.includes("transmit") || text.includes("signal") || text.includes("contact") || text.includes("talk")) return "transmit signal ⚡";
    if (text.includes("zero") || text.includes("gravity") || text.includes("float")) return "zero-g float 🎈";
    if (text.includes("draw") || text.includes("sketch")) return "sketch stars ✨";
    if (text.includes("clear") || text.includes("erase")) return "clear sky 🗑";
    if (text.includes("copy")) return "copy address 📋";
    if (text.includes("send") || text.includes("submit")) return "send transmission ↗";
    if (text.includes("return") || text.includes("top") || text.includes("orbit 00")) return "warp to top 🚀";
    return "press ✦";
  }

  // Input / Textarea
  if (tag === "input" || tag === "textarea") {
    const placeholder = interactiveEl.getAttribute("placeholder");
    if (placeholder) return `type: ${placeholder.substring(0, 16)}`;
    return "type ⌨";
  }

  return "inspect ✦";
}

export default function Cursor() {
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);

  const planetRef = useRef<HTMLDivElement>(null);
  const satelliteRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({
    x: -100,
    y: -100,
  });

  const satellitePos = useRef({
    x: -100,
    y: -100,
  });

  const targetPillOffset = useRef({
    x: 0,
    y: 0,
  });

  const hoveredElementRect = useRef<DOMRect | null>(null);

  const orbitAngle = useRef(0);
  const trail = useRef<Point[]>([]);
  const lastMoveTime = useRef(0);

  const currentStroke = useRef<Point[]>([]);
  const strokes = useRef<Point[][]>([]);

  const modeRef = useRef<Mode>("normal");
  const drawingRef = useRef(false);

  const [mode, setMode] = useState<Mode>("normal");
  const [hasDrawings, setHasDrawings] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const [isInteractive, setIsInteractive] = useState(false);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isFinePointer = useSyncExternalStore(
    subscribePointerFine,
    getPointerFineSnapshot,
    getServerPointerFineSnapshot
  );

  const isInteractiveRef = useRef(false);
  const cursorLabelRef = useRef("");

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    cursorLabelRef.current = cursorLabel;
  }, [cursorLabel]);

  useEffect(() => {
    window.setCursorLabel = setCursorLabel;
    return () => {
      delete window.setCursorLabel;
    };
  }, []);

  /*
    ZERO-LATENCY DIRECT POINTER EVENTS WITH SMART COLLISION DETECTION
  */
  useEffect(() => {
    if (!isFinePointer) return;

    const handleMove = (event: PointerEvent) => {
      const now = performance.now();
      const clientX = event.clientX;
      const clientY = event.clientY;

      mouse.current.x = clientX;
      mouse.current.y = clientY;
      lastMoveTime.current = now;

      // DIRECT ZERO-LATENCY INSTANT POINTER UPDATE
      if (planetRef.current) {
        planetRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0) translate(-50%, -50%)`;
      }

      trail.current.push({
        x: clientX,
        y: clientY,
        time: now,
      });

      const element = document.elementFromPoint(clientX, clientY);
      const interactiveEl = element?.closest(
        "a, button, [role='button'], input, textarea, [data-interactive], [data-warp-text], [data-cursor-label]"
      );
      const interactive = interactiveEl !== null;

      // Resolve contextual label
      const morphBlend = (window as any).__starfieldMorphBlend || 0;
      const resolved = resolveContextualLabel(
        element,
        interactiveEl ?? null,
        morphBlend,
        clientX,
        window.innerWidth
      );

      if (interactive !== isInteractiveRef.current) {
        isInteractiveRef.current = interactive;
        setIsInteractive(interactive);
      }

      if (resolved !== cursorLabelRef.current) {
        cursorLabelRef.current = resolved;
        setCursorLabel(resolved);
      }

      if (interactiveEl) {
        const rect = interactiveEl.getBoundingClientRect();
        hoveredElementRect.current = rect;

        // DYNAMIC COLLISION AVOIDANCE CALCULATION:
        let pillX = clientX + 32;
        let pillY = rect.top - 24;

        if (pillY < 40) {
          pillY = rect.bottom + 24;
        }

        if (clientX > window.innerWidth - 160) {
          pillX = rect.left - 48;
        }

        targetPillOffset.current = { x: pillX, y: pillY };
      } else {
        hoveredElementRect.current = null;
        let pillX = clientX + 28;
        let pillY = clientY - 26;
        if (clientX > window.innerWidth - 150) {
          pillX = clientX - 85;
        }
        if (pillY < 50) {
          pillY = clientY + 28;
        }
        targetPillOffset.current = { x: pillX, y: pillY };
      }

      if (trail.current.length > 16) {
        trail.current.shift();
      }

      if (drawingRef.current && modeRef.current === "draw") {
        currentStroke.current.push({
          x: clientX,
          y: clientY,
          time: now,
        });
      }
    };

    const handleDown = () => {
      if (modeRef.current !== "draw") return;
      drawingRef.current = true;
      currentStroke.current = [];
    };

    const handleUp = () => {
      if (!drawingRef.current) return;
      drawingRef.current = false;
      if (currentStroke.current.length > 1) {
        strokes.current.push([...currentStroke.current]);
        setHasDrawings(true);
      }
      currentStroke.current = [];
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [isFinePointer]);

  /*
    ANIMATION LOOP: SATELLITE LAG + ORBIT + ACTION PILL MORPHING + STARDUST TRAIL
  */
  useEffect(() => {
    if (!isFinePointer) return;

    const trailCanvas = trailCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    const satellite = satelliteRef.current;

    if (!trailCanvas || !drawCanvas || !satellite) return;

    const trailContext = trailCanvas.getContext("2d");
    const drawContext = drawCanvas.getContext("2d");
    if (!trailContext || !drawContext) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      [trailCanvas, drawCanvas].forEach((canvas) => {
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
      });
      trailContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    let animationFrame = 0;
    let previousTime = performance.now();

    const render = () => {
      animationFrame = requestAnimationFrame(render);

      const now = performance.now();
      const delta = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;

      const mx = mouse.current.x;
      const my = mouse.current.y;
      const isMoving = now - lastMoveTime.current < 120;
      const hasAction = !!cursorLabelRef.current || isInteractiveRef.current;

      // SATELLITE WITH COLLISION AVOIDANCE POSITIONING
      if (hasAction) {
        let targetX = targetPillOffset.current.x;
        let targetY = targetPillOffset.current.y;

        // Fallback offset if no specific rect computed
        if (!targetX || !targetY) {
          targetX = mx > window.innerWidth - 180 ? mx - 70 : mx + 40;
          targetY = my < 80 ? my + 30 : my - 24;
        }

        const satFollow = 1 - Math.exp(-20 * delta);
        satellitePos.current.x += (targetX - satellitePos.current.x) * satFollow;
        satellitePos.current.y += (targetY - satellitePos.current.y) * satFollow;
      } else {
        // Celestial Orbit around planet core
        orbitAngle.current += delta * (isMoving ? 2.0 : 2.8);
        const orbitRadius = isMoving ? 16 : 20;
        const targetX = mx + Math.cos(orbitAngle.current) * orbitRadius;
        const targetY = my + Math.sin(orbitAngle.current) * orbitRadius;
        const satFollow = 1 - Math.exp((isMoving ? -14 : -18) * delta);
        satellitePos.current.x += (targetX - satellitePos.current.x) * satFollow;
        satellitePos.current.y += (targetY - satellitePos.current.y) * satFollow;
      }

      satellite.style.transform = `translate3d(${satellitePos.current.x}px, ${satellitePos.current.y}px, 0) translate(-50%, -50%)`;

      // STARDUST TRAIL (soft shimmer)
      trail.current = trail.current.filter((point) => now - point.time < 160);
      trailContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (trail.current.length > 1) {
        const points = trail.current;
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const progress = i / (points.length - 1);
          const opacity = Math.pow(progress, 1.6) * 0.4;
          const width = 0.5 + Math.pow(progress, 1.4) * 2;

          trailContext.beginPath();
          trailContext.moveTo(prev.x, prev.y);
          trailContext.lineTo(curr.x, curr.y);
          trailContext.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          trailContext.lineWidth = width;
          trailContext.lineCap = "round";
          trailContext.stroke();
        }
      }

      // CONSTELLATION DRAWING CANVAS
      drawContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
      drawContext.lineCap = "round";
      drawContext.lineJoin = "round";
      drawContext.strokeStyle = "rgba(255, 255, 255, 0.8)";
      drawContext.lineWidth = 1.8;

      const drawStroke = (stroke: Point[]) => {
        if (stroke.length < 2) return;
        drawContext.beginPath();
        drawContext.moveTo(stroke[0].x, stroke[0].y);

        for (let i = 1; i < stroke.length; i++) {
          drawContext.lineTo(stroke[i].x, stroke[i].y);
        }
        drawContext.stroke();

        stroke.forEach((pt, idx) => {
          if (idx % 4 === 0 || idx === stroke.length - 1) {
            drawContext.fillStyle = "rgba(255, 255, 255, 0.9)";
            drawContext.beginPath();
            drawContext.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
            drawContext.fill();
          }
        });
      };

      strokes.current.forEach(drawStroke);
      if (drawingRef.current) {
        drawStroke(currentStroke.current);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [isFinePointer]);

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
  };

  const clearDrawings = () => {
    strokes.current = [];
    currentStroke.current = [];
    setHasDrawings(false);
  };

  if (!mounted || !isFinePointer) {
    return null;
  }

  const activeLabel = cursorLabel;
  // Morph blend for styling the cursor differently during portrait mode
  const morphBlend = typeof window !== "undefined" ? ((window as any).__starfieldMorphBlend || 0) : 0;
  const isMorphing = morphBlend > 0.3;

  return (
    <>
      <ClickEffects color="rgba(255,255,255,0.85)" />

      {/* STARDUST TRAIL CANVAS */}
      <canvas
        ref={trailCanvasRef}
        className="pointer-events-none fixed inset-0 z-[9997]"
      />

      {/* CONSTELLATION SKETCH CANVAS */}
      <canvas
        ref={drawCanvasRef}
        className="pointer-events-none fixed inset-0 z-[9996]"
      />

      {/* THE PLANET (Instant Zero-Latency Core Pointer) */}
      <div
        ref={planetRef}
        className={`
          pointer-events-none
          fixed
          left-0
          top-0
          z-[10002]
          rounded-full
          transition-[width,height,box-shadow,background-color]
          duration-150
          ease-out
          will-change-transform
          ${
            isInteractive
              ? "h-3.5 w-3.5 bg-white shadow-[0_0_16px_rgba(255,255,255,0.9),0_0_24px_rgba(255,217,0,0.5)]"
              : "h-2 w-2 bg-white/95 shadow-[0_0_10px_rgba(255,255,255,0.7)]"
          }
        `}
      />

      {/* THE SATELLITE (Liquid Glass Action Pill with Personality) */}
      <div
        ref={satelliteRef}
        className={`
          pointer-events-none
          fixed
          left-0
          top-0
          z-[10001]
          flex
          items-center
          justify-center
          rounded-full
          transition-all
          duration-200
          ease-out
          will-change-transform
          ${
            activeLabel
              ? activeLabel.includes("arnab")
                ? "glass-cursor-pill border-[#ffd900]/70 bg-black/90 px-4 py-1.5 shadow-[0_0_24px_rgba(255,217,0,0.35),inset_0_1px_0_rgba(255,255,255,0.4)]"
                : "glass-cursor-pill px-3.5 py-1 text-[11px] font-medium tracking-[0.06em]"
              : "h-2 w-2 bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.6)] rounded-full"
          }
        `}
      >
        {activeLabel && (
          activeLabel.includes("arnab") ? (
            <span className="flex items-center gap-2 whitespace-nowrap">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] shadow-[0_0_8px_rgba(255,217,0,1)] animate-ping" />
              <span className="font-mono text-xs font-bold text-[#ffd900] tracking-wider uppercase">arnab</span>
              <span className="text-sm select-none animate-pulse">👉</span>
            </span>
          ) : activeLabel.includes("move more") ? (
            <span className="flex items-center gap-2 whitespace-nowrap text-white/95 text-[11px] font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] animate-pulse" />
              <span className="tracking-wide">move more</span>
              <span className="text-xs select-none">👉</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 whitespace-nowrap text-white/90 text-[11px] font-mono">
              <span className="h-1 w-1 rounded-full bg-[#ffd900] shadow-[0_0_6px_rgba(255,217,0,0.9)]" />
              <span>{activeLabel}</span>
            </span>
          )
        )}
      </div>

      {/* MODE HUD PILL (Liquid Glass Dock) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="
          hidden
          md:block
          fixed
          right-6
          top-1/2
          z-[9998]
          -translate-y-1/2
        "
      >
        <div
          className="
            flex
            w-[46px]
            flex-col
            items-center
            gap-1
            rounded-full
            glass-dock
            p-1.5
          "
        >
          {/* EXPLORE */}
          <button
            onClick={() => changeMode("normal")}
            data-cursor-label="explore mode ✦"
            className={`
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              transition-all
              duration-200
              ${
                mode === "normal"
                  ? "bg-white/20 text-white shadow-[0_0_12px_rgba(255,255,255,0.25)] backdrop-blur-sm"
                  : "text-white/30 hover:text-white/70 hover:bg-white/5"
              }
            `}
            title="Explore Mode"
            aria-label="Explore mode"
          >
            <MousePointer2 size={13} />
          </button>

          {/* CONSTELLATION SKETCH */}
          <button
            onClick={() => changeMode("draw")}
            data-cursor-label="sketch constellations ✨"
            className={`
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              transition-all
              duration-200
              ${
                mode === "draw"
                  ? "bg-white/20 text-white shadow-[0_0_12px_rgba(255,255,255,0.25)] backdrop-blur-sm"
                  : "text-white/30 hover:text-white/70 hover:bg-white/5"
              }
            `}
            title="Constellation Sketch Mode"
            aria-label="Constellation sketch mode"
          >
            <Sparkles size={13} />
          </button>

          {/* CLEAR DRAWINGS */}
          <AnimatePresence>
            {mode === "draw" && hasDrawings && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={clearDrawings}
                data-cursor-label="clear sky 🗑"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  text-white/30
                  hover:bg-white/10
                  hover:text-white/70
                  transition-colors
                  duration-200
                "
                title="Clear Constellations"
                aria-label="Clear drawings"
              >
                <Trash2 size={12} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}