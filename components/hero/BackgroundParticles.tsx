"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Dot = {
  id: number;
  baseX: number;
  baseY: number;
  currX: number;
  currY: number;
  currOpacity: number;
  seed: number;
  turbSeed: number;
  color: string;
  // Section 0: Portrait
  portraitX: number;
  portraitY: number;
  portraitBrightness: number;
  hasPortrait: boolean;
  // Section 1: Work Constellation Grid
  workX: number;
  workY: number;
  // Section 2: About Orbital Radar Rings
  aboutRing: number;
  aboutAngle: number;
  // Section 3: Lab Sine Lattice
  labNormX: number;
  labNormY: number;
  // Section 4: Contact Dish & Pulses
  contactRing: number;
  contactAngle: number;
};

const DOT_SIZE = 2;
const SPACING = 34;
const RADIUS = 170;
const RADIUS_SQ = RADIUS * RADIUS;
const FORCE = 95;
const BASE_OPACITY = 0.38;
const LERP_SPEED = 0.055;

const SPACE_PALETTE = [
  "rgba(255, 255, 255,",   // Pure Stardust
  "rgba(251, 191, 36,",    // Martian Solar Amber
  "rgba(251, 146, 60,",    // Mars Warm Rust
  "rgba(253, 230, 138,",   // Golden Hour Light
];

// Sample brightness data from image
function loadImageBrightness(
  src: string,
  sampleWidth: number,
  sampleHeight: number
): Promise<{ data: Uint8ClampedArray; w: number; h: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const offscreen = document.createElement("canvas");
      offscreen.width = sampleWidth;
      offscreen.height = sampleHeight;
      const octx = offscreen.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
      const imageData = octx.getImageData(0, 0, sampleWidth, sampleHeight);
      resolve({ data: imageData.data, w: sampleWidth, h: sampleHeight });
    };
    img.onerror = () => {
      resolve({ data: new Uint8ClampedArray(0), w: 0, h: 0 });
    };
    img.src = src;
  });
}

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: Number.NEGATIVE_INFINITY, y: Number.NEGATIVE_INFINITY });
  const scrollVelocityRef = useRef(0);
  const lastScrollYRef = useRef(0);

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
    let portraitReady = false;
    let morphBlend = 0;
    let currentSection = 0; // 0: Hero, 1: Work, 2: About, 3: Lab, 4: Contact

    const PORTRAIT_SAMPLE_W = 80;
    const PORTRAIT_SAMPLE_H = 80;
    let brightnessMap: Uint8ClampedArray | null = null;
    let bmW = 0;
    let bmH = 0;

    loadImageBrightness("/images/myself.png", PORTRAIT_SAMPLE_W, PORTRAIT_SAMPLE_H).then(
      ({ data, w, h }) => {
        if (data.length > 0) {
          brightnessMap = data;
          bmW = w;
          bmH = h;
          portraitReady = true;
          assignPortraitTargets();
        }
      }
    );

    function assignPortraitTargets() {
      if (!brightnessMap || dots.length === 0) return;

      const darkPixels: { px: number; py: number; brightness: number }[] = [];
      for (let py = 0; py < bmH; py++) {
        for (let px = 0; px < bmW; px++) {
          const idx = (py * bmW + px) * 4;
          const r = brightnessMap[idx];
          const g = brightnessMap[idx + 1];
          const b = brightnessMap[idx + 2];
          const a = brightnessMap[idx + 3];
          const bright = (r * 0.299 + g * 0.587 + b * 0.114);
          if (bright < 180 && a > 100) {
            darkPixels.push({ px, py, brightness: bright / 255 });
          }
        }
      }

      if (darkPixels.length === 0) return;

      const portraitAreaW = width * 0.38;
      const portraitAreaH = height * 0.7;
      const portraitLeft = width * 0.58;
      const portraitTop = (height - portraitAreaH) / 2;

      for (let i = darkPixels.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [darkPixels[i], darkPixels[j]] = [darkPixels[j], darkPixels[i]];
      }

      for (let i = 0; i < dots.length; i++) {
        if (i < darkPixels.length) {
          const pixel = darkPixels[i];
          dots[i].portraitX = portraitLeft + (pixel.px / bmW) * portraitAreaW;
          dots[i].portraitY = portraitTop + (pixel.py / bmH) * portraitAreaH;
          dots[i].portraitBrightness = pixel.brightness;
          dots[i].hasPortrait = true;
        } else {
          dots[i].portraitX = width * 0.5 + (Math.random() - 0.5) * width * 1.5;
          dots[i].portraitY = height * 0.5 + (Math.random() - 0.5) * height * 1.5;
          dots[i].portraitBrightness = 1;
          dots[i].hasPortrait = false;
        }
      }
    }

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

      const centerX = width * 0.5;
      const centerY = height * 0.5;

      for (let y = 0; y < height; y += SPACING) {
        for (let x = 0; x < width; x += SPACING) {
          const baseX = x + (Math.random() - 0.5) * SPACING * 0.8;
          const baseY = y + (Math.random() - 0.5) * SPACING * 0.8;

          // Section 1: Work Constellation Grid (viewfinder aperture framing)
          const normX = x / width;
          const normY = y / height;
          const boxLeft = width * 0.08;
          const boxRight = width * 0.92;
          const boxTop = height * 0.12;
          const boxBottom = height * 0.88;
          let wX = baseX;
          let wY = baseY;
          if (id % 5 === 0) {
            // Edge frame points
            const tParam = (id % 100) / 100;
            if (id % 4 === 0) { wX = boxLeft + tParam * (boxRight - boxLeft); wY = boxTop; }
            else if (id % 4 === 1) { wX = boxRight; wY = boxTop + tParam * (boxBottom - boxTop); }
            else if (id % 4 === 2) { wX = boxRight - tParam * (boxRight - boxLeft); wY = boxBottom; }
            else { wX = boxLeft; wY = boxBottom - tParam * (boxBottom - boxTop); }
          } else {
            // Interior celestial nodes
            wX = boxLeft + normX * (boxRight - boxLeft) + (Math.random() - 0.5) * 40;
            wY = boxTop + normY * (boxBottom - boxTop) + (Math.random() - 0.5) * 40;
          }

          // Section 2: About Orbital Radar Rings (3 concentric rings)
          const ringIdx = id % 3; // 0, 1, 2
          const ringAngle = ((id * 37) % 360) * (Math.PI / 180);

          // Section 3: Lab Sine Lattice
          const labNormX = normX;
          const labNormY = normY;

          // Section 4: Contact Dish & Waves
          const contactRing = (id % 4) + 1;
          const contactAngle = -Math.PI * 0.85 + (((id * 17) % 100) / 100) * (Math.PI * 0.7);

          newDots.push({
            id: id++,
            baseX,
            baseY,
            currX: baseX,
            currY: baseY,
            currOpacity: BASE_OPACITY,
            seed: id * 0.73,
            turbSeed: id * 1.73,
            color: SPACE_PALETTE[id % SPACE_PALETTE.length],
            portraitX: baseX,
            portraitY: baseY,
            portraitBrightness: 1,
            hasPortrait: false,
            workX: wX,
            workY: wY,
            aboutRing: ringIdx,
            aboutAngle: ringAngle,
            labNormX,
            labNormY,
            contactRing,
            contactAngle,
          });
        }
      }
      dots = newDots;

      if (portraitReady) {
        assignPortraitTargets();
      }
    };

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handlePointerLeave = () => {
      mouseRef.current.x = Number.NEGATIVE_INFINITY;
      mouseRef.current.y = Number.NEGATIVE_INFINITY;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;
      // Very gentle, calm velocity tracking to prevent hyperspeed transitions
      scrollVelocityRef.current = Math.max(Math.min(deltaY * 0.05, 5), -5);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    let previousTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      const t = time * 0.0005;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = Number.isFinite(mx) && Number.isFinite(my);

      // Section calculation based on document scroll progress
      // Section calculation based on actual section elements in DOM
      const scrollY = window.scrollY;
      const midY = window.innerHeight * 0.45;
      const secElements = [
        document.getElementById("hero"),
        document.getElementById("work"),
        document.getElementById("about"),
        document.getElementById("playground"),
        document.getElementById("contact"),
      ];

      let targetSec = 0;
      for (let s = secElements.length - 1; s >= 0; s--) {
        const el = secElements[s];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= midY) {
            targetSec = s;
            break;
          }
        }
      }

      // Smooth section transition (calm, gradual morphing)
      currentSection += (targetSec - currentSection) * 0.035;

      // Face morph only active in Hero section
      const isHero = currentSection < 0.35 && scrollY < height * 0.55;
      let targetMorph = 0;
      if (portraitReady && mouseActive && isHero) {
        const normalizedX = mx / width;
        targetMorph = Math.max(0, Math.min(1, (normalizedX - 0.45) / 0.25));
      }
      morphBlend += (targetMorph - morphBlend) * (isHero ? 0.06 : 0.18);
      if (!isHero && morphBlend < 0.01) morphBlend = 0;
      (window as any).__starfieldMorphBlend = isHero ? morphBlend : 0;

      scrollVelocityRef.current *= Math.exp(-9 * delta);
      const warpSpeed = scrollVelocityRef.current;
      const isWarping = Math.abs(warpSpeed) > 3.0;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        const seed = dot.seed;

        // Base idle drift
        const driftX = Math.sin(t + seed) * 12 + Math.sin(t * 0.5 + seed * 2.1) * 4;
        const driftY = Math.cos(t * 0.8 + seed) * 9 + Math.sin(t * 0.35 + seed * 1.7) * 4;

        // --- SECTION 0: HERO (Starfield + Portrait on right) ---
        let sec0X = dot.baseX + driftX;
        let sec0Y = dot.baseY + driftY;
        let sec0Opacity = BASE_OPACITY;

        // Mouse repulsion in Section 0
        if (mouseActive && isHero && morphBlend < 0.5) {
          const dx = sec0X - mx;
          const dy = sec0Y - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < RADIUS_SQ) {
            const dist = Math.sqrt(distSq);
            const strength = Math.pow(1 - dist / RADIUS, 2);
            const safeDist = Math.max(dist, 0.001);
            sec0X += (dx / safeDist) * strength * FORCE;
            sec0Y += (dy / safeDist) * strength * FORCE;
            sec0Opacity = BASE_OPACITY * Math.max(0, 1 - strength * 1.2);
          }
        }

        // Apply portrait morph if on hero and blend > 0
        if (morphBlend > 0.01) {
          const pX = dot.portraitX + Math.sin(t * 0.3 + seed) * 1.5 * (1 - morphBlend);
          const pY = dot.portraitY + Math.cos(t * 0.4 + seed) * 1.2 * (1 - morphBlend);
          sec0X = sec0X + (pX - sec0X) * morphBlend;
          sec0Y = sec0Y + (pY - sec0Y) * morphBlend;
          if (dot.hasPortrait) {
            const pOpacity = (1 - dot.portraitBrightness) * 0.95;
            sec0Opacity = sec0Opacity + (pOpacity - sec0Opacity) * morphBlend;
          } else {
            sec0Opacity = sec0Opacity * (1 - morphBlend * 0.85);
          }
        }

        // --- SECTION 1: WORK (Constellation Aperture Grid) ---
        const sec1X = dot.workX + Math.sin(t * 0.6 + seed) * 5;
        const sec1Y = dot.workY + Math.cos(t * 0.7 + seed) * 5;
        const sec1Opacity = BASE_OPACITY * 0.85;

        // --- SECTION 2: ABOUT (Concentric Orbital Radar Rings) ---
        const ringRadius = 150 + dot.aboutRing * 135;
        const currentRingAngle = dot.aboutAngle + t * (0.12 / (dot.aboutRing + 1));
        const sec2X = centerX + Math.cos(currentRingAngle) * ringRadius + Math.sin(t + seed) * 3;
        const sec2Y = centerY + Math.sin(currentRingAngle) * (ringRadius * 0.75) + Math.cos(t + seed) * 3;
        const sec2Opacity = BASE_OPACITY * (0.7 + (dot.aboutRing === 1 ? 0.3 : 0));

        // --- SECTION 3: LAB (Quantum Sine Lattice) ---
        const waveY = Math.sin(dot.labNormX * 10 + t * 2.5) * 35 + Math.cos(dot.labNormY * 8 + t * 1.8) * 20;
        const sec3X = dot.baseX + Math.sin(t + seed) * 4;
        const sec3Y = dot.baseY + waveY;
        const sec3Opacity = BASE_OPACITY * 0.9;

        // --- SECTION 4: CONTACT (Radiating Parabolic Satellite Waves) ---
        const dishCenterY = height * 0.82;
        const pulseProgress = (t * 60 + dot.contactRing * 75) % (width * 0.65);
        const sec4X = centerX + Math.cos(dot.contactAngle) * pulseProgress;
        const sec4Y = dishCenterY + Math.sin(dot.contactAngle) * (pulseProgress * 0.65);
        const waveDistNorm = pulseProgress / (width * 0.65);
        const sec4Opacity = BASE_OPACITY * Math.sin(waveDistNorm * Math.PI) * 1.1;

        // Multi-section interpolation based on currentSection
        let targetX = sec0X;
        let targetY = sec0Y;
        let targetOpacity = sec0Opacity;

        if (currentSection < 1) {
          const w = currentSection;
          targetX = sec0X + (sec1X - sec0X) * w;
          targetY = sec0Y + (sec1Y - sec0Y) * w;
          targetOpacity = sec0Opacity + (sec1Opacity - sec0Opacity) * w;
        } else if (currentSection < 2) {
          const w = currentSection - 1;
          targetX = sec1X + (sec2X - sec1X) * w;
          targetY = sec1Y + (sec2Y - sec1Y) * w;
          targetOpacity = sec1Opacity + (sec2Opacity - sec1Opacity) * w;
        } else if (currentSection < 3) {
          const w = currentSection - 2;
          targetX = sec2X + (sec3X - sec2X) * w;
          targetY = sec2Y + (sec3Y - sec2Y) * w;
          targetOpacity = sec2Opacity + (sec3Opacity - sec2Opacity) * w;
        } else {
          const w = Math.min(currentSection - 3, 1);
          targetX = sec3X + (sec4X - sec3X) * w;
          targetY = sec3Y + (sec4Y - sec3Y) * w;
          targetOpacity = sec3Opacity + (sec4Opacity - sec3Opacity) * w;
        }

        // Smooth physical lerp to target
        dot.currX += (targetX - dot.currX) * LERP_SPEED;
        dot.currY += (targetY - dot.currY) * LERP_SPEED;
        dot.currOpacity += (targetOpacity - dot.currOpacity) * LERP_SPEED;

        if (dot.currOpacity > 0.01) {
          const alpha = dot.currOpacity;

          let fillColor = dot.color;
          if (morphBlend > 0.3 && dot.hasPortrait && isHero) {
            fillColor = "rgba(255, 217, 0,";
          }

          ctx.fillStyle = `${fillColor} ${Math.min(alpha, 0.95)})`;
          ctx.strokeStyle = `${fillColor} ${Math.min(alpha * 0.8, 0.9)})`;

          if (isWarping) {
            // Extremely gentle micro-elongation (max 3px) instead of harsh hyperspeed streaks
            const streakLen = Math.max(Math.min(warpSpeed * 0.2, 3), -3);
            ctx.lineWidth = DOT_SIZE * 0.85;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(dot.currX, dot.currY);
            ctx.lineTo(dot.currX, dot.currY - streakLen);
            ctx.stroke();
          } else {
            const dotRadius = (DOT_SIZE / 2) * (1 + (morphBlend > 0.3 && dot.hasPortrait && isHero ? 0.6 : 0));
            ctx.beginPath();
            ctx.arc(dot.currX, dot.currY, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
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
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </motion.div>
  );
}