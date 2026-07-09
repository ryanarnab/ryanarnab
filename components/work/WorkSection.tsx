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
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="mb-5 text-sm text-white/40">
            Selected Works / 2024—2026
          </p>

          <h2 className="text-[clamp(80px,12vw,180px)] font-medium leading-[0.82] tracking-[-0.08em]">
            SELECTED
            <br />
            WORKS
          </h2>
        </motion.div>

      </div>
    </section>
  );
}