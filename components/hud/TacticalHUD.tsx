"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, Check } from "lucide-react";
import { useSound } from "@/components/sound/SoundProvider";
import { triggerHeartbeatHaptic, triggerSuccessHaptic } from "@/lib/haptics";

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export default function TacticalHUD() {
  const { playClick, playSuccess } = useSound();
  const [likes, setLikes] = useState(18240);
  const [hasLiked, setHasLiked] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleLike = () => {
    triggerHeartbeatHaptic();
    playSuccess();
    setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
    setHasLiked(!hasLiked);

    // Spawn floating heart particle
    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * 32,
      y: -15 - Math.random() * 25,
    };
    setFloatingHearts((prev) => [...prev.slice(-5), newHeart]);
  };

  const handleShare = () => {
    triggerSuccessHaptic();
    playClick();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <>
      {/* ─── 1. TACTICAL SUBTLE EDGE RAIL (LEFT SIDE) ───────────────────── */}
      <div 
        aria-hidden="true" 
        className="tactical-edge-rail hidden md:block" 
      >
        <div className="absolute top-28 left-[14px] text-[8px] font-mono text-[#d4b068]/40 tracking-[0.25em] uppercase rotate-90 origin-top-left pointer-events-none whitespace-nowrap">
          SYSTEM // 26.14°N 91.73°E · GHY
        </div>
      </div>

      {/* ─── 2. TOP RIGHT SUBTLE STATUS TAG ──────────────────────────────── */}
      <div className="fixed top-5 sm:top-6 right-5 sm:right-8 z-50 pointer-events-auto hidden md:flex items-center gap-2">
        <div 
          className="tactical-badge-green px-2.5 py-1 text-[9px] uppercase font-mono tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-ping" />
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      {/* ─── 3. RIGHT-EDGE MINIMALIST ENGAGEMENT DOCK (LIKE & SHARE ONLY) ─── */}
      <aside 
        aria-label="Portfolio Interaction"
        className="fixed right-3 sm:right-6 bottom-20 md:bottom-28 z-40 flex flex-col items-center gap-2.5 select-none pointer-events-auto"
      >
        {/* Floating Heart Particles */}
        <div className="relative">
          <AnimatePresence>
            {floatingHearts.map((h) => (
              <motion.div
                key={h.id}
                initial={{ opacity: 1, scale: 0.8, x: 0, y: 0 }}
                animate={{ opacity: 0, scale: 1.5, x: h.x, y: h.y - 50 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[#e05a76] pointer-events-none"
              >
                <Heart size={15} fill="#e05a76" />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Heart / Like Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            data-cursor-label={hasLiked ? "liked ♥" : "like portfolio ♥"}
            className={`group relative flex flex-col items-center justify-center p-2.5 sm:p-3 transition-all duration-300 ${
              hasLiked
                ? "bg-[#e05a76]/15 text-[#e05a76] border-[#e05a76]/50 shadow-[0_0_16px_rgba(224,90,118,0.25)]"
                : "bg-black/60 backdrop-blur-xl text-white/70 hover:text-white border-white/10 hover:border-[#d4b068]/40 hover:bg-black/80 shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
            }`}
            style={{
              clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              border: "1px solid",
            }}
            title="Like Portfolio"
          >
            <Heart 
              size={17} 
              className={`transition-transform duration-300 group-hover:scale-110 ${hasLiked ? "fill-[#e05a76]" : ""}`} 
            />
            <span className="text-[9px] font-mono font-medium tracking-tight mt-1 text-white/80">
              {(likes / 1000).toFixed(1)}K
            </span>
          </motion.button>
        </div>

        {/* Share / Copy Link Button */}
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            data-cursor-label="copy link 🔗"
            className={`group relative flex flex-col items-center justify-center p-2.5 sm:p-3 transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.5)] ${
              copiedShare
                ? "bg-[#d4b068]/15 text-[#d4b068] border-[#d4b068]/50 shadow-[0_0_16px_rgba(212,176,104,0.3)]"
                : "bg-black/60 backdrop-blur-xl text-white/70 hover:text-[#d4b068] border-white/10 hover:border-[#d4b068]/40 hover:bg-black/80"
            }`}
            style={{
              clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))",
              border: "1px solid",
            }}
            title="Share Portfolio Link"
          >
            {copiedShare ? (
              <Check size={17} className="text-[#d4b068]" />
            ) : (
              <Share2 size={17} className="transition-transform duration-300 group-hover:scale-110" />
            )}
            <span className="text-[9px] font-mono font-medium tracking-tight mt-1 text-white/80">
              {copiedShare ? "COPIED" : "SHARE"}
            </span>
          </motion.button>
        </div>
      </aside>
    </>
  );
}
