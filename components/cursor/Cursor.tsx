"use client";

import { useEffect, useRef, useState } from "react";

type Point = {
  x: number;
  y: number;
};

function buildSmoothPath(points: Point[]) {
    if (points.length < 2) return "";

    let d = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;

        d += ` Q ${points[i].x} ${points[i].y} ${xc} ${yc}`;
    }

    return d;
}

export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cursor, setCursor] = useState<Point>({
    x: -100,
    y: -100,
  });
  
  const [moving, setMoving] = useState(false);
  
  const moveTimeout = useRef<NodeJS.Timeout | null>(null);

  const [trail, setTrail] = useState<Point[]>([]);
  const trailTimeout = useRef<NodeJS.Timeout | null>(null);

  const [mode, setMode] = useState<"normal" | "draw">("normal");

  const [drawing, setDrawing] = useState(false);

  const currentStroke = useRef<Point[]>([]);
  const strokes = useRef<Point[][]>([]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const p = {
        x: e.clientX,
        y: e.clientY,
      };

      setCursor(p);

      setTrail((prev) => [...prev.slice(-30), p]);
      
      if (trailTimeout.current) {
        clearTimeout(trailTimeout.current);
    }
    
    trailTimeout.current = setTimeout(() => {
        setTrail([]);
    }, 160);

      if (drawing && mode === "draw") {
        currentStroke.current.push(p);
      }
    };

    const down = () => {
      if (mode !== "draw") return;

      setDrawing(true);
      currentStroke.current = [];
    };

    const up = () => {
      if (!drawing) return;

      setDrawing(false);

      if (currentStroke.current.length > 1) {
        strokes.current.push([...currentStroke.current]);
      }

      currentStroke.current = [];
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [drawing, mode]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();

    window.addEventListener("resize", resize);

    let frame = 0;

    const render = () => {
      frame = requestAnimationFrame(render);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      strokes.current.forEach((stroke) => {
        if (stroke.length < 2) return;

        ctx.beginPath();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;

        ctx.moveTo(stroke[0].x, stroke[0].y);

        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }

        ctx.stroke();
      });

      if (drawing && currentStroke.current.length > 1) {
        ctx.beginPath();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;

        ctx.moveTo(
          currentStroke.current[0].x,
          currentStroke.current[0].y
        );

        for (let i = 1; i < currentStroke.current.length; i++) {
          ctx.lineTo(
            currentStroke.current[i].x,
            currentStroke.current[i].y
          );
        }

        ctx.stroke();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [drawing]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[9998] pointer-events-none"
      />

    <svg
        className="fixed inset-0 pointer-events-none z-[9999]"
        width="100%"
        height="100%"
    >
        <path
            d={buildSmoothPath(trail)}
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".55"
        />
    </svg>
    
      <div
        className="fixed z-[10000] rounded-full bg-white pointer-events-none"
        style={{
          left: cursor.x,
          top: cursor.y,
          width: 6,
          height: 6,
          transform: "translate(-50%,-50%)",
        }}
      />

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10001] flex rounded-full border border-white/10 bg-black/70 backdrop-blur px-2 py-2 gap-2">

        <button
          onClick={() => setMode("normal")}
          className={`px-3 py-1 rounded-full text-sm ${
            mode === "normal"
              ? "bg-white text-black"
              : "text-white"
          }`}
        >
          Normal
        </button>

        <button
          onClick={() => setMode("draw")}
          className={`px-3 py-1 rounded-full text-sm ${
            mode === "draw"
              ? "bg-white text-black"
              : "text-white"
          }`}
        >
          Draw
        </button>

        <button
          onClick={() => {
            strokes.current = [];
          }}
          className="px-3 py-1 rounded-full text-sm text-white"
        >
          Clear
        </button>

      </div>
    </>
  );
}