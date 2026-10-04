"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { triggerSnapHaptic, triggerSelectionHaptic } from "@/lib/haptics";

declare global {
  interface Window {
    __starfieldMorphBlend?: number;
    __triggerFaceMorph?: (enabled?: boolean) => void;
    __toggleFaceMorph?: () => void;
    __isFaceMorphActive?: () => boolean;
    __requestGyroPermission?: () => Promise<boolean>;
  }
}

// GLSL Vertex Shader — 100% GPU-accelerated particle interpolation & 3D face point cloud
const VERTEX_SHADER_SRC = `
precision highp float;

attribute vec3 a_basePos;       // Base starfield position (x, y, z)
attribute vec3 a_portraitPos;   // 3D face point cloud (x, y, z depth)
attribute vec2 a_workPos;       // Section 1: Work constellation grid
attribute vec2 a_aboutParam;    // Section 2: Ring index, angle
attribute vec2 a_labParam;      // Section 3: NormX, NormY
attribute vec2 a_contactParam;  // Section 4: Ring, angle
attribute vec2 a_seed;          // Unique random seeds
attribute float a_colorIndex;   // Palette color index
attribute float a_isPortrait;   // 1.0 = portrait pixel, 0.0 = background

uniform vec2 u_resolution;      // Canvas size in CSS pixels
uniform vec2 u_portCenter;      // Portrait center coordinates (desktop right edge, phone middle)
uniform float u_time;           // Time in seconds
uniform float u_morph;          // Morph factor (0.0 to 1.0)
uniform float u_section;        // Current scroll section (0.0 to 4.0)
uniform vec2 u_mouse;           // Mouse coordinate (-1000 if inactive)
uniform vec2 u_tilt;            // Tilt angle in degrees (gamma, beta)
uniform float u_warp;           // Warp streak length from scroll velocity
uniform float u_dpr;            // Device pixel ratio
uniform float u_isMobile;       // 1.0 if mobile, 0.0 if desktop

varying vec4 v_color;

void main() {
    float t = u_time * 0.0005;
    vec2 center = u_resolution * 0.5;

    // --- SECTION 0: IDLE STARFIELD DRIFT ---
    vec2 drift = vec2(
        sin(t + a_seed.x) * 12.0 + sin(t * 0.5 + a_seed.x * 2.1) * 4.0,
        cos(t * 0.8 + a_seed.x) * 9.0 + sin(t * 0.35 + a_seed.x * 1.7) * 4.0
    );

    vec3 sec0 = a_basePos;
    sec0.xy += drift;
    float sec0Opacity = 0.38;

    // Gentle cursor repulsion in Section 0: Starfield reacts to cursor as usual
    if (u_mouse.x > -500.0) {
        vec2 d = sec0.xy - u_mouse;
        float distSq = dot(d, d);
        float radius = 175.0;
        if (distSq < radius * radius && distSq > 0.001) {
            float dist = sqrt(distSq);
            float strength = pow(1.0 - dist / radius, 2.0);
            sec0.xy += (d / dist) * strength * 90.0;
            sec0Opacity = 0.38 * max(0.05, 1.0 - strength * 1.1);
        }
    }

    // --- 3D FACE PORTRAIT WITH REAL HARDWARE GYRO PARALLAX ---
    vec3 port3D = a_portraitPos;
    if (u_morph > 0.001) {
        // Floating organic zero-g micro-flutter
        port3D.x += sin(t * 0.3 + a_seed.x) * 1.5 * (1.0 - u_morph);
        port3D.y += cos(t * 0.4 + a_seed.x) * 1.2 * (1.0 - u_morph);

        // Dynamic 3D rotation centered on exact computed portrait position
        vec2 portCenter = u_portCenter;
        vec3 rel = port3D - vec3(portCenter, 0.0);

        // Real-time 3D rotation from device orientation (hardware gamma and beta)
        float rotY = u_tilt.x * 0.016; // Gamma tilt (left/right yaw)
        float rotX = u_tilt.y * 0.012; // Beta tilt (forward/backward pitch)

        // Rotate around Y axis (gamma)
        float cosY = cos(rotY);
        float sinY = sin(rotY);
        float rx1 = rel.x * cosY + rel.z * sinY;
        float rz1 = -rel.x * sinY + rel.z * cosY;

        // Rotate around X axis (beta)
        float cosX = cos(rotX);
        float sinX = sin(rotX);
        float ry2 = rel.y * cosX - rz1 * sinX;
        float rz2 = rel.y * sinX + rz1 * cosX;

        // True 3D perspective projection for structured point cloud
        float camDist = 520.0;
        float perspective = camDist / max(camDist - rz2, 70.0);
        perspective = clamp(perspective, 0.65, 1.85);

        port3D.xy = portCenter + vec2(rx1, ry2) * perspective;
        port3D.z = rz2;
    }

    // Smooth particle interpolation between Starfield & 3D Portrait
    vec3 currentSec0 = mix(sec0, port3D, u_morph);
    if (a_isPortrait > 0.5) {
        // Face points become solid radiant Martian solar gold
        sec0Opacity = mix(sec0Opacity, 0.96, u_morph);
    } else {
        // Starfield background subtly dims to enhance portrait contrast
        sec0Opacity = mix(sec0Opacity, sec0Opacity * 0.16, u_morph);
    }

    // --- SECTION 1: WORK (Constellation Aperture Grid) ---
    vec2 sec1 = a_workPos + vec2(sin(t * 0.6 + a_seed.x) * 5.0, cos(t * 0.7 + a_seed.x) * 5.0);
    float sec1Opacity = 0.35;

    // --- SECTION 2: ABOUT (Orbital Radar Rings) ---
    float ringRadius = (u_isMobile > 0.5 ? 90.0 : 150.0) + a_aboutParam.x * (u_isMobile > 0.5 ? 75.0 : 135.0);
    float currentRingAngle = a_aboutParam.y + t * (0.12 / (a_aboutParam.x + 1.0));
    vec2 sec2 = center + vec2(
        cos(currentRingAngle) * ringRadius + sin(t + a_seed.x) * 3.0,
        sin(currentRingAngle) * (ringRadius * 0.75) + cos(t + a_seed.x) * 3.0
    );
    float sec2Opacity = 0.32;

    // --- SECTION 3: LAB (Quantum Sine Lattice) ---
    float waveY = sin(a_labParam.x * 10.0 + t * 2.5) * 35.0 + cos(a_labParam.y * 8.0 + t * 1.8) * 20.0;
    vec2 sec3 = a_basePos.xy + vec2(sin(t + a_seed.x) * 4.0, waveY);
    float sec3Opacity = 0.36;

    // --- SECTION 4: CONTACT (Parabolic Satellite Waves) ---
    float dishCenterY = u_resolution.y * 0.82;
    float maxDist = u_resolution.x * 0.65;
    float pulseProgress = mod(t * 60.0 + a_contactParam.x * 75.0, maxDist);
    vec2 sec4 = vec2(
        center.x + cos(a_contactParam.y) * pulseProgress,
        dishCenterY + sin(a_contactParam.y) * (pulseProgress * 0.65)
    );
    float waveDistNorm = pulseProgress / max(maxDist, 1.0);
    float sec4Opacity = 0.38 * sin(waveDistNorm * 3.14159) * 1.1;

    // --- Multi-Section Blending ---
    vec2 pos;
    float opacity;

    if (u_section < 1.0) {
        float w = u_section;
        pos = mix(currentSec0.xy, sec1, w);
        opacity = mix(sec0Opacity, sec1Opacity, w);
    } else if (u_section < 2.0) {
        float w = u_section - 1.0;
        pos = mix(sec1, sec2, w);
        opacity = mix(sec1Opacity, sec2Opacity, w);
    } else if (u_section < 3.0) {
        float w = u_section - 2.0;
        pos = mix(sec2, sec3, w);
        opacity = mix(sec2Opacity, sec3Opacity, w);
    } else {
        float w = clamp(u_section - 3.0, 0.0, 1.0);
        pos = mix(sec3, sec4, w);
        opacity = mix(sec3Opacity, sec4Opacity, w);
    }

    // Convert pixel position to WebGL clip space (-1.0 to 1.0)
    vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
    clipSpace.y = -clipSpace.y; // Invert Y for screen coordinates

    gl_Position = vec4(clipSpace, 0.0, 1.0);

    // Particle Point Size (DPR aware and responsive)
    float baseSize = 2.4 * u_dpr;
    if (u_morph > 0.2 && a_isPortrait > 0.5) {
        baseSize *= (1.0 + u_morph * 0.65);
    }
    float warpBoost = min(abs(u_warp) * 0.25, 2.5);
    gl_PointSize = clamp(baseSize + warpBoost, 1.0, 24.0);

    // Color Selection — Subtle Champagne Titanium & Starlight Palette
    vec3 c;
    if (u_morph > 0.3 && a_isPortrait > 0.5) {
        c = vec3(0.85, 0.72, 0.46); // Refined Warm Champagne Gold
    } else if (a_colorIndex < 0.5) {
        c = vec3(0.96, 0.96, 0.94); // Pure Starlight White
    } else if (a_colorIndex < 1.5) {
        c = vec3(0.80, 0.68, 0.44); // Subtle Champagne Tone
    } else if (a_colorIndex < 2.5) {
        c = vec3(0.70, 0.58, 0.38); // Muted Bronze Titanium
    } else {
        c = vec3(0.90, 0.80, 0.58); // Soft Warm Glow
    }

    v_color = vec4(c, clamp(opacity, 0.0, 1.0));
}
`;

// GLSL Fragment Shader — Antialiased circular stardust points
const FRAGMENT_SHADER_SRC = `
precision mediump float;

varying vec4 v_color;

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) {
        discard;
    }
    float alpha = smoothstep(0.5, 0.08, dist) * v_color.a;
    gl_FragColor = vec4(v_color.rgb, alpha);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function initWebGLProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
  if (!vs || !fs) return null;

  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);

  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

// Extract bright/feature pixels from myself.png
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

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Initialize WebGL context
    const rawGl =
      canvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: false,
        powerPreference: "high-performance",
      }) || (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!rawGl) {
      console.warn("WebGL not supported, hardware morph unavailable");
      return;
    }
    const gl: WebGLRenderingContext = rawGl;

    const program = initWebGLProgram(gl);
    if (!program) return;
    gl.useProgram(program);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Uniform locations
    const u_resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const u_portCenterLoc = gl.getUniformLocation(program, "u_portCenter");
    const u_timeLoc = gl.getUniformLocation(program, "u_time");
    const u_morphLoc = gl.getUniformLocation(program, "u_morph");
    const u_sectionLoc = gl.getUniformLocation(program, "u_section");
    const u_mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const u_tiltLoc = gl.getUniformLocation(program, "u_tilt");
    const u_warpLoc = gl.getUniformLocation(program, "u_warp");
    const u_dprLoc = gl.getUniformLocation(program, "u_dpr");
    const u_isMobileLoc = gl.getUniformLocation(program, "u_isMobile");

    // Attribute locations
    const a_basePosLoc = gl.getAttribLocation(program, "a_basePos");
    const a_portraitPosLoc = gl.getAttribLocation(program, "a_portraitPos");
    const a_workPosLoc = gl.getAttribLocation(program, "a_workPos");
    const a_aboutParamLoc = gl.getAttribLocation(program, "a_aboutParam");
    const a_labParamLoc = gl.getAttribLocation(program, "a_labParam");
    const a_contactParamLoc = gl.getAttribLocation(program, "a_contactParam");
    const a_seedLoc = gl.getAttribLocation(program, "a_seed");
    const a_colorIndexLoc = gl.getAttribLocation(program, "a_colorIndex");
    const a_isPortraitLoc = gl.getAttribLocation(program, "a_isPortrait");

    // GPU Buffers
    const basePosBuffer = gl.createBuffer();
    const portraitPosBuffer = gl.createBuffer();
    const workPosBuffer = gl.createBuffer();
    const aboutParamBuffer = gl.createBuffer();
    const labParamBuffer = gl.createBuffer();
    const contactParamBuffer = gl.createBuffer();
    const seedBuffer = gl.createBuffer();
    const colorIndexBuffer = gl.createBuffer();
    const isPortraitBuffer = gl.createBuffer();

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particleCount = 0;

    let morphBlend = 0;
    let toggledMorph = false;
    let lastDispatchedMorph = false;
    let gyroSnapFired = false;
    let currentSection = 0;
    let scrollVelocity = 0;
    let lastScrollY = 0;

    // Computed portrait center coordinates (desktop right edge, phone middle)
    let portCenter = { x: 0, y: 0 };

    // Mouse coordinates (desktop hover)
    const mouse = { x: -1000, y: -1000 };

    // Device orientation (accelerometer gamma & beta)
    const tilt = { gamma: 0, beta: 0, smoothGamma: 0, smoothBeta: 0 };
    let gyroAvailable = false;
    let gyroDenied = false;

    // Face pixels from image
    interface FacePixel {
      px: number;
      py: number;
      brightness: number;
      nx: number;
      ny: number;
      depth: number;
    }
    let facePixels: FacePixel[] = [];
    let portraitReady = false;

    // Load portrait brightness data (sampled at 88x88 for clean, solid, steady 3D face structure)
    loadImageBrightness("/images/myself.png", 88, 88).then(({ data, w, h }) => {
      if (data.length > 0) {
        const pixels: FacePixel[] = [];
        for (let py = 0; py < h; py++) {
          for (let px = 0; px < w; px++) {
            const idx = (py * w + px) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const a = data[idx + 3];
            const bright = r * 0.299 + g * 0.587 + b * 0.114;

            // Feature pixels with contrast and opacity
            if (bright < 185 && a > 80) {
              const nx = (px / w - 0.5) * 2.0;
              const ny = (py / h - 0.5) * 2.0;

              // True 3D depth curvature dome
              const dome = Math.max(0.0, 1.0 - (nx * nx * 1.15 + ny * ny * 0.95));
              const featureRelief = (1.0 - bright / 255) * 0.35;
              const depth = (Math.sqrt(dome) * 0.75 + featureRelief) * 95.0;

              pixels.push({
                px,
                py,
                brightness: bright / 255,
                nx,
                ny,
                depth,
              });
            }
          }
        }

        // Shuffle slightly for organic dispersal
        for (let i = pixels.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pixels[i], pixels[j]] = [pixels[j], pixels[i]];
        }

        facePixels = pixels;
        portraitReady = true;
        rebuildBuffers();
      }
    });

    // Rebuild attribute buffers when dimensions or portrait data change
    function rebuildBuffers() {
      if (width === 0 || height === 0) return;

      // Particle count optimized for 120 FPS buttery smooth performance
      const targetCount = width < 768 ? 1100 : 1800;
      particleCount = Math.max(targetCount, facePixels.length);

      const basePosData = new Float32Array(particleCount * 3);
      const portraitPosData = new Float32Array(particleCount * 3);
      const workPosData = new Float32Array(particleCount * 2);
      const aboutParamData = new Float32Array(particleCount * 2);
      const labParamData = new Float32Array(particleCount * 2);
      const contactParamData = new Float32Array(particleCount * 2);
      const seedData = new Float32Array(particleCount * 2);
      const colorIndexData = new Float32Array(particleCount);
      const isPortraitData = new Float32Array(particleCount);

      const isMobile = width < 768;

      // Stratified 2D grid covering 100% of width and 100% of height evenly across the entire viewport
      const aspect = (width || 1) / (height || 1);
      const cols = Math.max(1, Math.round(Math.sqrt(particleCount * aspect)));
      const rows = Math.max(1, Math.ceil(particleCount / cols));
      const cellW = width / cols;
      const cellH = height / rows;

      // Portrait layout geometry:
      // Desktop: Anchored inside the HUD box portal (#hero-face-portal) for pixel-precise alignment
      // Mobile: Centered in the middle of the phone screen
      let portraitAreaW = isMobile
        ? Math.min(width * 0.82, 350)
        : Math.min(width * 0.28, 380);
      let portraitAreaH = isMobile ? portraitAreaW : portraitAreaW * 1.15;

      const rightMargin = Math.max(width * 0.05, 54);
      let portraitLeft = isMobile
        ? (width - portraitAreaW) / 2
        : width - portraitAreaW - rightMargin;
      let portraitTop = isMobile
        ? Math.max((height - portraitAreaH) / 2 - 20, height * 0.16)
        : (height - portraitAreaH) / 2;

      // If portal box element exists and is rendered, center the morphed face precisely inside it
      const portalEl = typeof document !== "undefined" ? document.getElementById("hero-face-portal") : null;
      if (portalEl) {
        const rect = portalEl.getBoundingClientRect();
        if (rect.width > 60 && rect.height > 60) {
          portraitAreaW = Math.min(rect.width * 0.76, 320);
          portraitAreaH = portraitAreaW * 1.18;
          portraitLeft = rect.left + (rect.width - portraitAreaW) * 0.5;
          portraitTop = (rect.top + window.scrollY) + (rect.height - portraitAreaH) * 0.44;
        }
      }

      portCenter = {
        x: portraitLeft + portraitAreaW * 0.5,
        y: portraitTop + portraitAreaH * 0.5,
      };

      // Work section viewfinder box
      const boxLeft = width * 0.08;
      const boxRight = width * 0.92;
      const boxTop = height * 0.12;
      const boxBottom = height * 0.88;

      for (let i = 0; i < particleCount; i++) {
        // 1. Base Starfield coordinates — 100% full screen coverage with Poisson-jittered stratified grid
        const col = i % cols;
        const row = Math.floor(i / cols);
        const bx = Math.min(width, Math.max(0, (col + Math.random()) * cellW));
        const by = Math.min(height, Math.max(0, (row + Math.random()) * cellH));
        const bz = (Math.random() - 0.5) * 180.0;

        basePosData[i * 3] = bx;
        basePosData[i * 3 + 1] = by;
        basePosData[i * 3 + 2] = bz;

        // 2. Portrait Target coordinates
        if (i < facePixels.length) {
          const fp = facePixels[i];
          const px = portraitLeft + ((fp.nx + 1.0) / 2.0) * portraitAreaW;
          const py = portraitTop + ((fp.ny + 1.0) / 2.0) * portraitAreaH;

          portraitPosData[i * 3] = px;
          portraitPosData[i * 3 + 1] = py;
          portraitPosData[i * 3 + 2] = fp.depth;
          isPortraitData[i] = 1.0;
        } else {
          // Surrounding celestial cloud
          portraitPosData[i * 3] = width * 0.5 + (Math.random() - 0.5) * width * 1.6;
          portraitPosData[i * 3 + 1] = height * 0.5 + (Math.random() - 0.5) * height * 1.6;
          portraitPosData[i * 3 + 2] = (Math.random() - 0.5) * 300.0;
          isPortraitData[i] = 0.0;
        }

        // 3. Section 1: Work Constellation Grid
        const normX = bx / width;
        const normY = by / height;
        if (i % 5 === 0) {
          const tParam = (i % 100) / 100;
          if (i % 4 === 0) {
            workPosData[i * 2] = boxLeft + tParam * (boxRight - boxLeft);
            workPosData[i * 2 + 1] = boxTop;
          } else if (i % 4 === 1) {
            workPosData[i * 2] = boxRight;
            workPosData[i * 2 + 1] = boxTop + tParam * (boxBottom - boxTop);
          } else if (i % 4 === 2) {
            workPosData[i * 2] = boxRight - tParam * (boxRight - boxLeft);
            workPosData[i * 2 + 1] = boxBottom;
          } else {
            workPosData[i * 2] = boxLeft;
            workPosData[i * 2 + 1] = boxBottom - tParam * (boxBottom - boxTop);
          }
        } else {
          workPosData[i * 2] = boxLeft + normX * (boxRight - boxLeft) + (Math.random() - 0.5) * 40;
          workPosData[i * 2 + 1] = boxTop + normY * (boxBottom - boxTop) + (Math.random() - 0.5) * 40;
        }

        // 4. Section 2: About Orbital Radar Rings
        aboutParamData[i * 2] = i % 3; // ring 0, 1, 2
        aboutParamData[i * 2 + 1] = ((i * 37) % 360) * (Math.PI / 180);

        // 5. Section 3: Lab Sine Lattice
        labParamData[i * 2] = normX;
        labParamData[i * 2 + 1] = normY;

        // 6. Section 4: Contact Parabolic Waves
        contactParamData[i * 2] = (i % 4) + 1;
        contactParamData[i * 2 + 1] = -Math.PI * 0.85 + (((i * 17) % 100) / 100) * (Math.PI * 0.7);

        // 7. Random Seeds
        seedData[i * 2] = i * 0.73;
        seedData[i * 2 + 1] = i * 1.73;

        // 8. Color index
        colorIndexData[i] = i % 4;
      }

      // Upload buffers to GPU
      gl.bindBuffer(gl.ARRAY_BUFFER, basePosBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, basePosData, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(a_basePosLoc);
      gl.vertexAttribPointer(a_basePosLoc, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, portraitPosBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, portraitPosData, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(a_portraitPosLoc);
      gl.vertexAttribPointer(a_portraitPosLoc, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, workPosBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, workPosData, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(a_workPosLoc);
      gl.vertexAttribPointer(a_workPosLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, aboutParamBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, aboutParamData, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(a_aboutParamLoc);
      gl.vertexAttribPointer(a_aboutParamLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, labParamBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, labParamData, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(a_labParamLoc);
      gl.vertexAttribPointer(a_labParamLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, contactParamBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, contactParamData, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(a_contactParamLoc);
      gl.vertexAttribPointer(a_contactParamLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, seedBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, seedData, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(a_seedLoc);
      gl.vertexAttribPointer(a_seedLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorIndexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colorIndexData, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(a_colorIndexLoc);
      gl.vertexAttribPointer(a_colorIndexLoc, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, isPortraitBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, isPortraitData, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(a_isPortraitLoc);
      gl.vertexAttribPointer(a_isPortraitLoc, 1, gl.FLOAT, false, 0, 0);
    }

    // Resize handling — strictly viewport aware
    const resize = () => {
      const w = window.innerWidth || document.documentElement.clientWidth || 1920;
      const h = window.innerHeight || document.documentElement.clientHeight || 1080;
      width = w;
      height = h;
      dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 1.25);

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      gl.viewport(0, 0, canvas.width, canvas.height);
      rebuildBuffers();
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener("resize", resize);

    // Desktop pointer tracking
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      }
    };

    const handlePointerLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    let cachedTargetSec = 0;
    const updateTargetSection = () => {
      const scrollY = window.scrollY;
      const totalH = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const ratio = scrollY / totalH;
      if (ratio < 0.16) cachedTargetSec = 0;
      else if (ratio < 0.42) cachedTargetSec = 1;
      else if (ratio < 0.68) cachedTargetSec = 2;
      else if (ratio < 0.86) cachedTargetSec = 3;
      else cachedTargetSec = 4;
    };

    let scrollTicking = false;
    const handleScroll = () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        scrollTicking = false;
        const currentScrollY = window.scrollY;
        const deltaY = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;
        scrollVelocity = Math.max(Math.min(deltaY * 0.05, 5), -5);
        updateTargetSection();
      });
    };

    updateTargetSection();

    // --- MOBILE HARDWARE GYROSCOPE (DeviceOrientation API with Resting Angle Offset) ---
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        gyroAvailable = true;
        // Clamp gamma (roll left/right) to -45 to +45 deg
        tilt.gamma = Math.max(-45, Math.min(45, e.gamma));

        // When holding phone at eye level, human hands rest at ~48 degrees pitch
        const restingPitch = 48.0;
        const normalizedBeta = Math.max(-40, Math.min(40, e.beta - restingPitch));
        tilt.beta = normalizedBeta;

        // Dispatch telemetry for hero badges
        window.dispatchEvent(
          new CustomEvent("gyro-telemetry", {
            detail: {
              gamma: Math.round(tilt.gamma),
              beta: Math.round(tilt.beta),
              available: true,
              denied: false,
            },
          })
        );
      }
    };

    // Bind orientation listener
    const bindOrientation = () => {
      if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
        window.addEventListener("deviceorientation", handleOrientation, { passive: true });
      }
    };

    // iOS 13+ permission request
    const requestGyroPermission = async (): Promise<boolean> => {
      if (
        typeof window !== "undefined" &&
        typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
          ?.requestPermission === "function"
      ) {
        try {
          const resp = await (
            DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }
          ).requestPermission();
          if (resp === "granted") {
            gyroDenied = false;
            bindOrientation();
            window.dispatchEvent(
              new CustomEvent("gyro-telemetry", {
                detail: { available: true, denied: false, granted: true },
              })
            );
            return true;
          } else {
            gyroDenied = true;
            window.dispatchEvent(
              new CustomEvent("gyro-telemetry", {
                detail: { available: false, denied: true },
              })
            );
            return false;
          }
        } catch {
          gyroDenied = true;
          window.dispatchEvent(
            new CustomEvent("gyro-telemetry", {
              detail: { available: false, denied: true },
            })
          );
          return false;
        }
      } else {
        bindOrientation();
        return true;
      }
    };

    // Attempt automatic orientation bind (works on Android & non-iOS)
    bindOrientation();

    // Attach one-time gesture for iOS permission
    const onFirstUserGesture = () => {
      requestGyroPermission();
      window.removeEventListener("touchend", onFirstUserGesture);
      window.removeEventListener("click", onFirstUserGesture);
    };
    window.addEventListener("touchend", onFirstUserGesture, { passive: true, once: true });
    window.addEventListener("click", onFirstUserGesture, { passive: true, once: true });

    // --- FALLBACK TOUCH EVENTS (Long-Press 500ms & Double-Tap) ---
    let longPressTimer: NodeJS.Timeout | null = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTapTimestamp = 0;
    let lastTapX = 0;
    let lastTapY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        triggerSelectionHaptic();
      }

      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement | null;

      // Ignore interactive controls
      if (
        target?.closest(
          "button, a, input, textarea, select, [role='button'], [data-interactive]"
        )
      ) {
        return;
      }

      // Check if touch is on Hero section screen
      const heroEl = document.getElementById("hero");
      if (!heroEl) return;
      const heroRect = heroEl.getBoundingClientRect();
      const clientY = e.touches[0].clientY;
      if (clientY > heroRect.bottom || clientY < heroRect.top) return;

      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;

      // Start 450ms Long-Press Timer
      if (longPressTimer) clearTimeout(longPressTimer);
      longPressTimer = setTimeout(() => {
        // Trigger face morph on 450ms hold
        toggledMorph = !toggledMorph;
        triggerSnapHaptic();
        window.dispatchEvent(
          new CustomEvent("face-morph-trigger", {
            detail: { active: toggledMorph, source: "long-press" },
          })
        );
      }, 450);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }

      if (e.touches.length !== 1 || !longPressTimer) return;
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      // Cancel long press if finger moved > 12px
      if (Math.hypot(dx, dy) > 12) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      mouse.x = -1000;
      mouse.y = -1000;

      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }

      const touch = e.changedTouches[0];
      if (!touch) return;

      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          "button, a, input, textarea, select, [role='button'], [data-interactive]"
        )
      ) {
        return;
      }

      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;
      if (Math.hypot(dx, dy) > 14) return; // Swiped, not tapped

      // Double-Tap Detection (< 320ms between taps)
      const now = performance.now();
      const timeSinceLast = now - lastTapTimestamp;
      const distFromLast = Math.hypot(touch.clientX - lastTapX, touch.clientY - lastTapY);

      if (timeSinceLast < 320 && distFromLast < 28) {
        // Double-tap triggered!
        toggledMorph = !toggledMorph;
        triggerSnapHaptic();
        window.dispatchEvent(
          new CustomEvent("face-morph-trigger", {
            detail: { active: toggledMorph, source: "double-tap" },
          })
        );
        lastTapTimestamp = 0;
      } else {
        lastTapTimestamp = now;
        lastTapX = touch.clientX;
        lastTapY = touch.clientY;
      }
    };

    // Public window helper APIs
    window.__triggerFaceMorph = (enabled?: boolean) => {
      toggledMorph = enabled !== undefined ? enabled : !toggledMorph;
      triggerSnapHaptic();
    };
    window.__toggleFaceMorph = () => {
      toggledMorph = !toggledMorph;
    };
    window.__isFaceMorphActive = () => morphBlend > 0.5;
    window.__requestGyroPermission = requestGyroPermission;

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("realign-particles", rebuildBuffers);

    let isTabVisible = true;
    let isModalOpen = false;
    let previousTime = performance.now();

    const handleModalChange = (e: Event) => {
      const custom = e as CustomEvent<{ isOpen?: boolean }>;
      isModalOpen = !!custom.detail?.isOpen;
      if (!isModalOpen && isTabVisible) {
        previousTime = performance.now();
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    };
    window.addEventListener("modal-visibility-change", handleModalChange);

    // --- 60FPS GPU RENDER LOOP ---
    const render = (time: number) => {
      if (!isTabVisible || isModalOpen) return;
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      const isMobile = width < 768;

      currentSection += (cachedTargetSec - currentSection) * 0.035;
      const isHero = currentSection < 0.35 && window.scrollY < height * 0.55;

      // Smooth gyro tilt damping for natural 3D parallax
      tilt.smoothGamma += (tilt.gamma - tilt.smoothGamma) * 0.12;
      tilt.smoothBeta += (tilt.beta - tilt.smoothBeta) * 0.12;

      // 1. Gyro Trigger: Tilt phone right (> 20 degrees) snaps into face formation!
      let gyroTargetMorph = 0;
      if (tilt.smoothGamma >= 20.0) {
        gyroTargetMorph = 1.0; // Snap into portrait!
        if (!gyroSnapFired) {
          gyroSnapFired = true;
          triggerSnapHaptic();
        }
      } else if (tilt.smoothGamma > 8.0) {
        gyroTargetMorph = (tilt.smoothGamma - 8.0) / 12.0; // Smooth preview transition
      } else {
        gyroTargetMorph = 0.0;
        if (tilt.smoothGamma < 12.0) {
          gyroSnapFired = false;
        }
      }

      // 2. Desktop cursor hover trigger: ONLY begins and is active when cursor is taken to the box (#hero-face-portal)
      let mouseTargetMorph = 0;
      let isHoveringPortal = false;
      if (!isMobile && mouse.x > -500 && mouse.y > -500 && isHero) {
        const portalEl = typeof document !== "undefined" ? document.getElementById("hero-face-portal") : null;
        if (portalEl) {
          const rect = portalEl.getBoundingClientRect();
          // Check if cursor is inside the HUD box portal
          if (
            mouse.x >= rect.left &&
            mouse.x <= rect.right &&
            mouse.y >= rect.top &&
            mouse.y <= rect.bottom
          ) {
            isHoveringPortal = true;
            mouseTargetMorph = 1.0;

            // Interactive 3D parallax tilt tracking cursor inside the box
            const cx = rect.left + rect.width * 0.5;
            const cy = rect.top + rect.height * 0.5;
            const normX = Math.max(-1, Math.min(1, (mouse.x - cx) / (rect.width * 0.5)));
            const normY = Math.max(-1, Math.min(1, (mouse.y - cy) / (rect.height * 0.5)));
            tilt.gamma = normX * 22.0;
            tilt.beta = normY * 16.0;
          } else {
            // Outside the box: reset 3D tilt
            tilt.gamma = 0;
            tilt.beta = 0;
          }
        }
      }

      // 3. Combined effective target morph (Hardware Gyro, Explicit Toggle, or Cursor inside Portal Box)
      let targetMorph = 0;
      if (isHero && portraitReady) {
        targetMorph = Math.max(
          toggledMorph ? 1.0 : 0.0,
          gyroTargetMorph,
          mouseTargetMorph
        );
      }

      // Smooth GLSL uniform morph interpolation
      morphBlend += (targetMorph - morphBlend) * (isHero ? 0.085 : 0.2);
      if (!isHero && morphBlend < 0.005) morphBlend = 0;

      // Update UI badge state if morph crossed boundary
      const morphActiveNow = morphBlend > 0.45;
      if (morphActiveNow !== lastDispatchedMorph) {
        lastDispatchedMorph = morphActiveNow;
        window.dispatchEvent(
          new CustomEvent("face-morph-trigger", {
            detail: { active: morphActiveNow, source: isHoveringPortal ? "hover" : "state" },
          })
        );
      }

      // Update global for Cursor labels
      window.__starfieldMorphBlend = isHero ? morphBlend : 0;

      // Damping scroll velocity
      scrollVelocity *= Math.exp(-9 * delta);

      // Pass all uniforms directly to the GPU
      gl.uniform2f(u_resolutionLoc, width, height);
      gl.uniform2f(u_portCenterLoc, portCenter.x, portCenter.y);
      gl.uniform1f(u_timeLoc, time);
      gl.uniform1f(u_morphLoc, morphBlend);
      gl.uniform1f(u_sectionLoc, currentSection);
      gl.uniform2f(u_mouseLoc, mouse.x, mouse.y);
      gl.uniform2f(u_tiltLoc, tilt.smoothGamma, tilt.smoothBeta);
      gl.uniform1f(u_warpLoc, scrollVelocity);
      gl.uniform1f(u_dprLoc, dpr);
      gl.uniform1f(u_isMobileLoc, isMobile ? 1.0 : 0.0);

      // Single hardware-accelerated draw call
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (particleCount > 0) {
        gl.drawArrays(gl.POINTS, 0, particleCount);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible";
      if (isTabVisible && !isModalOpen) {
        previousTime = performance.now();
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("modal-visibility-change", handleModalChange);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("deviceorientation", handleOrientation);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("realign-particles", rebuildBuffers);
      window.removeEventListener("touchend", onFirstUserGesture);
      window.removeEventListener("click", onFirstUserGesture);
      delete window.__triggerFaceMorph;
      delete window.__toggleFaceMorph;
      delete window.__isFaceMorphActive;
      delete window.__requestGyroPermission;
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 w-screen h-screen z-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </motion.div>
  );
}