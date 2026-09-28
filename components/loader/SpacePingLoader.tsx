"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Volume2, VolumeX, Sparkles } from "lucide-react";

interface SpacePingLoaderProps {
  onComplete?: () => void;
  minDuration?: number; // Duration in ms before signal locks (default ~1800ms)
}

export default function SpacePingLoader({
  onComplete,
  minDuration = 1900,
}: SpacePingLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("SCANNING CELESTIAL FREQUENCIES...");
  const [isMuted, setIsMuted] = useState(false);
  const [hasStartedMorph, setHasStartedMorph] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const isCompletedRef = useRef(false);

  // Synthesize procedural cosmic radar ping using Web Audio API (0 external bytes)
  const playCosmicPing = useCallback((freq = 880, decay = 0.65) => {
    if (isMuted || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.48, ctx.currentTime + decay);

      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + decay);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + decay);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [isMuted]);

  // Finish and morph into site
  const finishLoading = useCallback(() => {
    if (isCompletedRef.current) return;
    isCompletedRef.current = true;
    setProgress(100);
    setStatusText("SIGNAL ACQUIRED ✦ WARPING TO ORIGIN");
    setHasStartedMorph(true);

    // Play final arrival harmonic chime
    playCosmicPing(1046.5, 0.9); // High C

    setTimeout(() => {
      setIsLoaded(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("__ryanarnab_loaded", "true");
        window.dispatchEvent(new CustomEvent("space-ping-complete"));
      }
      onComplete?.();
    }, 650);
  }, [playCosmicPing, onComplete]);

  useEffect(() => {
    // Check if user already saw the loader in this session
    const hasSeenLoader = typeof window !== "undefined" ? sessionStorage.getItem("__ryanarnab_loaded") : null;
    if (hasSeenLoader === "true") {
      queueMicrotask(() => {
        setIsLoaded(true);
        onComplete?.();
      });
      return;
    }

    // Initial celestial ping sound
    const initialTimer = setTimeout(() => {
      playCosmicPing(587.33, 0.8); // D5
    }, 250);

    const secondPingTimer = setTimeout(() => {
      playCosmicPing(880, 0.7); // A5
    }, 950);

    // Progress ramp
    const startTime = performance.now();
    const updateProgress = () => {
      if (isCompletedRef.current) return;
      const elapsed = performance.now() - startTime;
      const ratio = Math.min(elapsed / minDuration, 1);

      // Smooth cubic acceleration curve
      const currentPct = Math.round(Math.pow(ratio, 0.85) * 100);
      setProgress(currentPct);

      if (currentPct < 35) {
        setStatusText("SEARCHING HYDROGEN LINE // 1420.405 MHz");
      } else if (currentPct < 70) {
        setStatusText("CARRIER RESONANCE DETECTED // VECTOR LOCKING");
      } else if (currentPct < 98) {
        setStatusText("TELEMETRY SYNCED // GUWAHATI [26.14° N, 91.73° E]");
      } else {
        finishLoading();
        return;
      }

      if (ratio < 1) {
        requestAnimationFrame(updateProgress);
      }
    };

    const animFrame = requestAnimationFrame(updateProgress);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(secondPingTimer);
      cancelAnimationFrame(animFrame);
    };
  }, [minDuration, finishLoading, playCosmicPing, onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="space-ping-loader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.08,
            filter: "blur(18px)",
            transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
          }}
          onClick={finishLoading}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#000000] select-none cursor-pointer overflow-hidden touch-none"
        >
          {/* Subtle Ambient Cosmic Glow */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(255,217,0,0.06),rgba(0,0,0,0)_100%)]" />

          {/* TOP TELEMETRY PROTOCOL BAR */}
          <div className="absolute top-6 sm:top-10 left-6 right-6 flex items-center justify-between text-white/40 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] animate-ping" />
              <span className="text-white/70 font-semibold">SIGNAL TELEMETRY // EXPEDITION 00</span>
            </div>

            {/* Mute Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="liquid-glass rounded-full px-2.5 py-1 flex items-center gap-1.5 hover:text-white transition-colors"
              title={isMuted ? "Unmute sound" : "Mute sound"}
            >
              {isMuted ? <VolumeX size={11} /> : <Volume2 size={11} className="text-[#ffd900]" />}
              <span className="text-[8px] tracking-widest">{isMuted ? "MUTED" : "AUDIO ON"}</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* CENTER RESONATING SPACE PING SONAR SYSTEM                                */}
          {/* ========================================================================= */}
          <div className="relative flex items-center justify-center w-[340px] h-[340px] sm:w-[460px] sm:h-[460px]">
            
            {/* SVG RESONATING CIRCULAR RADAR RINGS */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 460 460"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Gold Solar Gradient */}
                <linearGradient id="sonarGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffd900" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#ffb703" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffd900" stopOpacity="0.05" />
                </linearGradient>

                <linearGradient id="radarSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffd900" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ffd900" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Static Background Guide Rings */}
              <circle cx="230" cy="230" r="45" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
              <circle cx="230" cy="230" r="95" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" strokeDasharray="3 6" />
              <circle cx="230" cy="230" r="150" stroke="rgba(255, 217, 0, 0.12)" strokeWidth="1" />
              <circle cx="230" cy="230" r="210" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" strokeDasharray="2 8" />

              {/* Crosshair Cardinal Coordinate Guides */}
              <line x1="20" y1="230" x2="440" y2="230" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" strokeDasharray="4 8" />
              <line x1="230" y1="20" x2="230" y2="440" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" strokeDasharray="4 8" />

              {/* Cardinal Corner Tick Marks */}
              <circle cx="230" cy="20" r="2.5" fill="#ffd900" opacity="0.6" />
              <circle cx="440" cy="230" r="2.5" fill="#ffd900" opacity="0.6" />
              <circle cx="230" cy="440" r="2.5" fill="#ffd900" opacity="0.6" />
              <circle cx="20" cy="230" r="2.5" fill="#ffd900" opacity="0.6" />
            </svg>

            {/* RESONATING RIPPLE 1 (Staggered Expansion Waves) */}
            <motion.div
              animate={{
                scale: [0.15, 1.1, 2.2],
                opacity: [0.95, 0.45, 0],
              }}
              transition={{
                duration: 2.1,
                repeat: Infinity,
                ease: [0.21, 0.45, 0.32, 0.95],
                delay: 0,
              }}
              className="absolute h-44 w-44 rounded-full border border-[#ffd900]/70 shadow-[0_0_20px_rgba(255,217,0,0.3)] pointer-events-none"
            />

            {/* RESONATING RIPPLE 2 */}
            <motion.div
              animate={{
                scale: [0.15, 1.1, 2.2],
                opacity: [0.95, 0.45, 0],
              }}
              transition={{
                duration: 2.1,
                repeat: Infinity,
                ease: [0.21, 0.45, 0.32, 0.95],
                delay: 0.7,
              }}
              className="absolute h-44 w-44 rounded-full border border-[#fbbf24]/60 shadow-[0_0_18px_rgba(251,191,36,0.25)] pointer-events-none"
            />

            {/* RESONATING RIPPLE 3 */}
            <motion.div
              animate={{
                scale: [0.15, 1.1, 2.2],
                opacity: [0.95, 0.45, 0],
              }}
              transition={{
                duration: 2.1,
                repeat: Infinity,
                ease: [0.21, 0.45, 0.32, 0.95],
                delay: 1.4,
              }}
              className="absolute h-44 w-44 rounded-full border border-white/60 pointer-events-none"
            />

            {/* SLOW ROTATING COMPASS DIAL RETICLE */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute w-[290px] h-[290px] sm:w-[320px] sm:h-[320px] rounded-full border border-dashed border-[#ffd900]/25 flex items-center justify-center pointer-events-none"
            >
              {/* Compass tick indices */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 text-[8px] font-mono text-[#ffd900]/60">000°</div>
              <div className="absolute right-0 top-1/2 translate-x-1 -translate-y-1/2 text-[8px] font-mono text-[#ffd900]/60">090°</div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 text-[8px] font-mono text-[#ffd900]/60">180°</div>
              <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 text-[8px] font-mono text-[#ffd900]/60">270°</div>
            </motion.div>

            {/* SWEEPING RADAR SCANNER BEAM */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
              className="absolute w-[280px] h-[280px] pointer-events-none origin-center"
              style={{
                background: "conic-gradient(from 0deg at 50% 50%, rgba(255,217,0,0.18) 0deg, rgba(255,217,0,0) 65deg, transparent 360deg)",
                borderRadius: "50%",
              }}
            />

            {/* FINAL WARP SHOCKWAVE BURST (Triggers at 100% to smoothly morph into site) */}
            {hasStartedMorph && (
              <motion.div
                initial={{ scale: 0.2, opacity: 1 }}
                animate={{ scale: 16, opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="absolute h-32 w-32 rounded-full bg-gradient-to-r from-[#ffd900] via-yellow-200 to-white shadow-[0_0_120px_rgba(255,217,0,1)] pointer-events-none z-30"
              />
            )}

            {/* CENTRAL SPACE PING BEACON EMITTER */}
            <div className="relative z-20 flex items-center justify-center">
              {/* Halo Glow */}
              <div className="absolute h-16 w-16 rounded-full bg-[#ffd900]/20 blur-xl animate-pulse" />

              {/* Middle Orb */}
              <motion.div
                animate={{
                  scale: [1, 1.25, 1],
                  boxShadow: [
                    "0 0 20px rgba(255,217,0,0.8)",
                    "0 0 45px rgba(255,217,0,1)",
                    "0 0 20px rgba(255,217,0,0.8)",
                  ],
                }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-6 w-6 rounded-full bg-[#ffd900] flex items-center justify-center border border-white"
              >
                {/* Core White Hot Starlight Center */}
                <div className="h-2 w-2 rounded-full bg-white shadow-[0_0_10px_white]" />
              </motion.div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* BOTTOM READOUT & PROGRESS TELEMETRY                                       */}
          {/* ========================================================================= */}
          <div className="relative z-20 mt-4 sm:mt-6 flex flex-col items-center max-w-[480px] px-6 text-center">
            
            {/* Live Status Readout */}
            <div className="flex items-center gap-2 mb-3">
              <Radio size={13} className="text-[#ffd900] animate-pulse" />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-[#fffdf0] uppercase">
                {statusText}
              </span>
            </div>

            {/* Numeric Progress Bar */}
            <div className="w-56 sm:w-72 h-[2px] bg-white/10 rounded-full overflow-hidden relative mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-[#ffd900] to-yellow-200 shadow-[0_0_10px_#ffd900]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Percentage & Frequency Readouts */}
            <div className="w-56 sm:w-72 flex items-center justify-between text-[10px] font-mono text-white/50 tracking-wider">
              <span>RX // 1420.405 MHz</span>
              <span className="text-[#ffd900] font-bold">[{String(progress).padStart(2, "0")}%]</span>
            </div>

            {/* Skip Interaction Hint */}
            <div className="mt-8 flex items-center gap-1.5 text-[9px] font-mono tracking-[0.24em] text-white/35 uppercase hover:text-[#ffd900] transition-colors">
              <Sparkles size={11} className="text-[#ffd900]/70" />
              <span>Click or tap anywhere to warp ↵</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
