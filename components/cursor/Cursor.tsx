"use client";

import { useEffect, useRef, useState } from "react";
import { MousePointer2, Sparkles, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ClickEffects from "./ClickEffects";

type Point = {
  x: number;
  y: number;
  time: number;
};

type Mode = "normal" | "draw";

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
  const [isFinePointer, setIsFinePointer] = useState(false);

  const isInteractiveRef = useRef(false);
  const cursorLabelRef = useRef("");

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    cursorLabelRef.current = cursorLabel;
  }, [cursorLabel]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  useEffect(() => {
    (window as any).setCursorLabel = setCursorLabel;
    return () => {
      delete (window as any).setCursorLabel;
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
        "a, button, [role='button'], input, textarea, [data-interactive], [data-warp-text]"
      );
      const interactive = interactiveEl !== null;

      if (interactive !== isInteractiveRef.current) {
        isInteractiveRef.current = interactive;
        setIsInteractive(interactive);
      }

      if (interactiveEl) {
        const rect = interactiveEl.getBoundingClientRect();
        hoveredElementRect.current = rect;

        // DYNAMIC COLLISION AVOIDANCE CALCULATION:
        // Position the pill safely away from the element boundary and cursor tip
        let pillX = clientX + 32;
        let pillY = rect.top - 24; // Float above element

        // If too close to the top screen edge, float below the element
        if (pillY < 40) {
          pillY = rect.bottom + 24;
        }

        // If too close to the right screen edge, float to the left
        if (clientX > window.innerWidth - 160) {
          pillX = rect.left - 48;
        }

        targetPillOffset.current = { x: pillX, y: pillY };
      } else {
        hoveredElementRect.current = null;
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

      // WARM SOLAR STARDUST TRAIL
      trail.current = trail.current.filter((point) => now - point.time < 160);
      trailContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (trail.current.length > 1) {
        const points = trail.current;
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const progress = i / (points.length - 1);
          const opacity = Math.pow(progress, 1.6) * 0.45;
          const width = 0.5 + Math.pow(progress, 1.4) * 2;

          trailContext.beginPath();
          trailContext.moveTo(prev.x, prev.y);
          trailContext.lineTo(curr.x, curr.y);
          // Warm Martian solar amber trail
          trailContext.strokeStyle = `rgba(251, 191, 36, ${opacity})`;
          trailContext.lineWidth = width;
          trailContext.lineCap = "round";
          trailContext.stroke();
        }
      }

      // CONSTELLATION DRAWING CANVAS
      drawContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
      drawContext.lineCap = "round";
      drawContext.lineJoin = "round";
      drawContext.strokeStyle = "rgba(245, 158, 11, 0.85)"; // Mars gold
      drawContext.lineWidth = 1.5;

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
            drawContext.fillStyle = "#fb923c"; // Orange star
            drawContext.beginPath();
            drawContext.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
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

  if (!isFinePointer) {
    return null;
  }

  const activeLabel = cursorLabel || (isInteractive ? "EXPLORE" : "");

  return (
    <>
      <ClickEffects />

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

      {/* 🪐 THE PLANET (Instant Zero-Latency Core Pointer) */}
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
              ? "h-3.5 w-3.5 bg-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.9)]"
              : "h-2 w-2 bg-white shadow-[0_0_10px_rgba(255,255,255,1)]"
          }
        `}
      />

      {/* 🛰️ THE DYNAMIC SATELLITE (Smart Collision Avoidance & Morphing Action Pill) */}
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
          duration-300
          ease-out
          will-change-transform
          ${
            activeLabel
              ? "px-3.5 py-1 bg-black/90 border border-amber-500/40 text-amber-200 shadow-[0_0_24px_rgba(245,158,11,0.3)] backdrop-blur-md text-[10px] font-mono tracking-[0.18em] uppercase"
              : "h-1.5 w-1.5 bg-amber-400/90 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
          }
        `}
      >
        {activeLabel && (
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-ping" />
            {activeLabel}
          </span>
        )}
      </div>

      {/* SPACE MODE HUD PILL (Explore vs Constellation Sketch) */}
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
            w-[48px]
            flex-col
            items-center
            gap-1.5
            rounded-full
            border
            border-white/10
            bg-black/70
            p-1.5
            backdrop-blur-xl
            shadow-[0_4px_24px_rgba(0,0,0,0.5)]
          "
        >
          {/* EXPLORE */}
          <button
            onClick={() => changeMode("normal")}
            className={`
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              transition-all
              ${
                mode === "normal"
                  ? "bg-amber-400 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                  : "text-white/40 hover:text-white"
              }
            `}
            title="Explore Mode"
            aria-label="Explore mode"
          >
            <MousePointer2 size={14} />
          </button>

          {/* CONSTELLATION SKETCH */}
          <button
            onClick={() => changeMode("draw")}
            className={`
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              transition-all
              ${
                mode === "draw"
                  ? "bg-orange-500 text-white shadow-[0_0_12px_rgba(234,88,12,0.6)]"
                  : "text-white/40 hover:text-white"
              }
            `}
            title="Constellation Sketch Mode"
            aria-label="Constellation sketch mode"
          >
            <Sparkles size={14} />
          </button>

          {/* CLEAR DRAWINGS */}
          <AnimatePresence>
            {mode === "draw" && hasDrawings && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={clearDrawings}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-white/40
                  hover:bg-white/10
                  hover:text-white
                  transition-colors
                "
                title="Clear Constellations"
                aria-label="Clear drawings"
              >
                <Trash2 size={13} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}