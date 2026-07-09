"use client";

import { motion } from "framer-motion";

export default function WorkSection() {
  return (
    <section
      id="works"
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col justify-center px-10">

        <motion.div
          initial={{
            opacity: 0,
            y: 80,
            scale: 0.96,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          viewport={{
            once: false,
            amount: 0.25,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="mb-6 text-sm uppercase tracking-[0.18em] text-white/35">
            06 Objects Discovered · 2024—2026
          </p>

          <h2 className="text-[clamp(80px,12vw,180px)] font-medium leading-[0.82] tracking-[-0.08em]">
            SELECTED
            <br />
            WORKS
          </h2>

          <div className="mt-10 flex items-center gap-3 text-sm text-white/40">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span>Scroll to explore</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}