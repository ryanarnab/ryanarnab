"use client";

import { useEffect, useRef } from "react";

type Dot = {
  id: number;
  baseX: number;
  baseY: number;
  currX: number;
  currY: number;
  currOpacity: number;
  seed: number;
  turbSeed: number;
};

const DOT_SIZE = 2;
const SPACING = 34;
const RADIUS = 170;
const RADIUS_SQ = RADIUS * RADIUS;
const FORCE = 95;
const BASE_OPACITY = 0.40;
const LERP_SPEED = 0.14;

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const newDots: Dot[] = [];
      let id = 0;

      for (let y = 0; y < height; y += SPACING) {
        for (let x = 0; x < width; x += SPACING) {
          const baseX = x + (Math.random() - 0.5) * SPACING * 0.8;
          const baseY = y + (Math.random() - 0.5) * SPACING * 0.8;
          newDots.push({
            id: id++,
            baseX,
            baseY,
            currX: baseX,
            currY: baseY,
            currOpacity: BASE_OPACITY,
            seed: id * 0.73,
            turbSeed: id * 1.73,
          });
        }
      }
      dots = newDots;
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
      } else {
        mouseRef.current.x = Number.NEGATIVE_INFINITY;
        mouseRef.current.y = Number.NEGATIVE_INFINITY;
      }
    };

    const handlePointerLeave = () => {
      mouseRef.current.x = Number.NEGATIVE_INFINITY;
      mouseRef.current.y = Number.NEGATIVE_INFINITY;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    const render = (time: number) => {
      const t = time * 0.0005;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = Number.isFinite(mx) && Number.isFinite(my);

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ffffff";

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const seed = dot.seed;

        // Multi-frequency organic idle drift
        const driftX =
          Math.sin(t + seed) * 15 +
          Math.sin(t * 0.5 + seed * 2.1) * 5;

        const driftY =
          Math.cos(t * 0.8 + seed) * 10 +
          Math.sin(t * 0.35 + seed * 1.7) * 5;

        let targetOffsetX = driftX;
        let targetOffsetY = driftY;
        let targetOpacity = BASE_OPACITY;

        if (mouseActive) {
          const currentPosX = dot.baseX + driftX;
          const currentPosY = dot.baseY + driftY;
          const dx = currentPosX - mx;
          const dy = currentPosY - my;
          const distSq = dx * dx + dy * dy;

          if (distSq < RADIUS_SQ) {
            const dist = Math.sqrt(distSq);
            const rawStrength = 1 - dist / RADIUS;
            const strength = rawStrength * rawStrength * (3 - 2 * rawStrength);
            const safeDistance = Math.max(dist, 0.001);
            const directionX = dx / safeDistance;
            const directionY = dy / safeDistance;

            const push = Math.pow(strength, 1.35) * FORCE;
            const tangentX = -directionY;
            const tangentY = directionX;
            const turbulence = Math.sin(dot.turbSeed) * strength * 18;

            targetOffsetX += directionX * push + tangentX * turbulence;
            targetOffsetY += directionY * push + tangentY * turbulence;
            targetOpacity = BASE_OPACITY * Math.max(0, 1 - strength * 1.4);
          }
        }

        // Smoothly interpolate towards target position and opacity
        dot.currX += (dot.baseX + targetOffsetX - dot.currX) * LERP_SPEED;
        dot.currY += (dot.baseY + targetOffsetY - dot.currY) * LERP_SPEED;
        dot.currOpacity += (targetOpacity - dot.currOpacity) * LERP_SPEED;

        if (dot.currOpacity > 0.01) {
          ctx.globalAlpha = dot.currOpacity;
          ctx.beginPath();
          ctx.arc(dot.currX, dot.currY, DOT_SIZE / 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}