"use client";

import { useEffect, useRef, useState } from "react";
import { MousePointer2, Pencil, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type Point = {
  x: number;
  y: number;
  time: number;
};

type Mode = "normal" | "draw";

export default function Cursor() {
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);

  const cursorRef = useRef<HTMLDivElement>(null);
  const satelliteRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({
    x: -100,
    y: -100,
  });

  const smoothMouse = useRef({
    x: -100,
    y: -100,
  });

  const satelliteMouse = useRef({
    x: -100,
    y: -100,
  });
  
  const trail = useRef<Point[]>([]);
  const lastMoveTime = useRef(0);

  const currentStroke = useRef<Point[]>([]);
  const strokes = useRef<Point[][]>([]);

  const modeRef = useRef<Mode>("normal");
  const drawingRef = useRef(false);

  const [mode, setMode] = useState<Mode>("normal");
  const [hasDrawings, setHasDrawings] = useState(false);
  const [overText, setOverText] = useState(false);
  const overTextRef = useRef(false);

  /*
    Keep ref synced without rebuilding event listeners.
  */
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  /*
    POINTER EVENTS
  */
  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const now = performance.now();

      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;

      lastMoveTime.current = now;

      trail.current.push({
        x: event.clientX,
        y: event.clientY,
        time: now,
      });

      const element = document.elementFromPoint(
        event.clientX,
        event.clientY
      );
      
      const isOverText =
        element?.closest("[data-warp-text]") !== null;
      
      if (isOverText !== overTextRef.current) {
        overTextRef.current = isOverText;
        setOverText(isOverText);
      }

      /*
        Keep the trail short.
        No React state update here.
      */
      if (trail.current.length > 12) {
        trail.current.shift();
      }

      if (drawingRef.current && modeRef.current === "draw") {
        currentStroke.current.push({
          x: event.clientX,
          y: event.clientY,
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

    window.addEventListener("pointermove", handleMove, {
      passive: true,
    });

    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
    };
  }, []);

  /*
    CANVAS + CURSOR ANIMATION

    One RAF loop handles:
    - smooth cursor movement
    - short tapered trail
    - sketch rendering
  */
  useEffect(() => {
    const trailCanvas = trailCanvasRef.current;
    const drawCanvas = drawCanvasRef.current;
    const cursor = cursorRef.current;
    const satellite = satelliteRef.current;
    
    if (!trailCanvas || !drawCanvas || !cursor || !satellite) return;

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

      const cursorSmoothness = 1 - Math.exp(-28 * delta);
      const satelliteSmoothness = 1 - Math.exp(-10 * delta);

      /*
        MAIN CURSOR
        Fast, smooth, responsive.
      */
      smoothMouse.current.x +=
        (mouse.current.x - smoothMouse.current.x) * cursorSmoothness;

      smoothMouse.current.y +=
        (mouse.current.y - smoothMouse.current.y) * cursorSmoothness;

      cursor.style.transform = `translate3d(
        ${smoothMouse.current.x}px,
        ${smoothMouse.current.y}px,
        0
      ) translate(-50%, -50%)`;

      /*
        SATELLITE
        Smoothly follows the main cursor with more inertia.
      */
      satelliteMouse.current.x +=
        (smoothMouse.current.x - satelliteMouse.current.x) *
        satelliteSmoothness;

      satelliteMouse.current.y +=
        (smoothMouse.current.y - satelliteMouse.current.y) *
        satelliteSmoothness;

      satellite.style.transform = `translate3d(
        ${satelliteMouse.current.x}px,
        ${satelliteMouse.current.y}px,
        0
      ) translate(-50%, -50%)`;

      /*
        TRAIL
        Short, visible and tapered.
      */
      trail.current = trail.current.filter(
        (point) => now - point.time < 130
      );

      trailContext.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      if (
        now - lastMoveTime.current < 100 &&
        trail.current.length > 1
      ) {
        const points = trail.current;

        for (let i = 1; i < points.length; i++) {
          const previous = points[i - 1];
          const current = points[i];

          const progress = i / (points.length - 1);

          const opacity =
            Math.pow(progress, 1.8) * 0.24;

          const width =
            0.3 + Math.pow(progress, 1.5) * 1.25;

          trailContext.beginPath();

          trailContext.moveTo(
            previous.x,
            previous.y
          );

          trailContext.lineTo(
            current.x,
            current.y
          );

          trailContext.strokeStyle =
            `rgba(255, 255, 255, ${opacity})`;

          trailContext.lineWidth = width;
          trailContext.lineCap = "round";

          trailContext.stroke();
        }
      }

      /*
        DRAWING CANVAS
      */
      drawContext.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );

      drawContext.lineCap = "round";
      drawContext.lineJoin = "round";
      drawContext.strokeStyle = "#ffffff";
      drawContext.lineWidth = 2;

      const drawStroke = (stroke: Point[]) => {
        if (stroke.length < 2) return;

        drawContext.beginPath();

        drawContext.moveTo(
          stroke[0].x,
          stroke[0].y
        );

        for (let i = 1; i < stroke.length; i++) {
          drawContext.lineTo(
            stroke[i].x,
            stroke[i].y
          );
        }

        drawContext.stroke();
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
  }, []);

  const changeMode = (nextMode: Mode) => {
    setMode(nextMode);
  };

  const clearDrawings = () => {
    strokes.current = [];
    currentStroke.current = [];
    setHasDrawings(false);
  };

  return (
    <>
      {/* SUBTLE TAPERED TRAIL */}
      <canvas
        ref={trailCanvasRef}
        className="pointer-events-none fixed inset-0 z-[9997] mix-blend-exclusion"
      />

      {/* SKETCH CANVAS */}
      <canvas
        ref={drawCanvasRef}
        className="pointer-events-none fixed inset-0 z-[9996]"
      />

      {/* MAIN CURSOR — actual pointer */}
      <motion.div
        ref={cursorRef}
        animate={{
          width: overText ? 54 : 14,
          height: overText ? 54 : 14,
          backgroundColor: overText
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,1)",
          borderWidth: overText ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 380,
          damping: 28,
          mass: 0.6,
        }}
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[10001]
          rounded-full
          border-white/40
          mix-blend-exclusion
          backdrop-blur-[1px]
          will-change-transform
        "
      />

      {/* SATELLITE — decorative follower */}
      <div
        ref={satelliteRef}
        className="
          pointer-events-none
          fixed
          left-0
          top-0
          z-[10000]
          h-[4px]
          w-[4px]
          rounded-full
          bg-white/70
          mix-blend-exclusion
          will-change-transform
        "
      />

      {/* ONE VERTICAL PILL */}
      <motion.div
        initial={{
          opacity: 0,
          x: 20,
          scale: 0.94,
        }}
        animate={{
          opacity: 1,
          x: 0,
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 28,
          mass: 0.7,
        }}
        className="
          fixed
          right-6
          top-1/2
          z-[9998]
          -translate-y-1/2
        "
      >
        <motion.div
          layout
          transition={{
            layout: {
              type: "spring",
              stiffness: 500,
              damping: 38,
              mass: 0.7,
            },
          }}
          className="
            flex
            w-[52px]
            flex-col
            items-center
            gap-1
            rounded-full
            border
            border-white/10
            bg-black/60
            p-1.5
            backdrop-blur-xl
          "
        >
          {/* EXPLORE */}
          <motion.button
            layout
            onClick={() => changeMode("normal")}
            whileTap={{ scale: 0.88 }}
            animate={{
              backgroundColor:
                mode === "normal"
                  ? "rgba(255,255,255,1)"
                  : "rgba(255,255,255,0)",

              color:
                mode === "normal"
                  ? "rgba(0,0,0,1)"
                  : "rgba(255,255,255,0.55)",
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
            }}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
            "
            aria-label="Explore mode"
          >
            <MousePointer2 size={15} />
          </motion.button>

          {/* SKETCH */}
          <motion.button
            layout
            onClick={() => changeMode("draw")}
            whileTap={{ scale: 0.88 }}
            animate={{
              backgroundColor:
                mode === "draw"
                  ? "rgba(255,255,255,1)"
                  : "rgba(255,255,255,0)",

              color:
                mode === "draw"
                  ? "rgba(0,0,0,1)"
                  : "rgba(255,255,255,0.55)",
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
            }}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
            "
            aria-label="Sketch mode"
          >
            <Pencil size={15} />
          </motion.button>

          {/* CLEAR — ONLY WHEN USEFUL */}
          <AnimatePresence initial={false}>
            {mode === "draw" && hasDrawings && (
              <motion.button
                key="clear"
                initial={{
                  opacity: 0,
                  scale: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  height: 40,
                }}
                exit={{
                  opacity: 0,
                  scale: 0,
                  height: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 32,
                }}
                whileTap={{
                  scale: 0.85,
                }}
                onClick={clearDrawings}
                className="
                  flex
                  w-10
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-full
                  text-white/50
                  transition-colors
                  hover:bg-white/10
                  hover:text-white
                "
                aria-label="Clear drawing"
              >
                <Trash2 size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}