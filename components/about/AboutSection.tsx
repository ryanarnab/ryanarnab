"use client";

import { motion } from "framer-motion";

const details = [
  ["ORBIT / BASE", "GUWAHATI, INDIA · 26.14°N 91.73°E"],
  ["SPECTRUM", "VISUAL IDENTITY · DIGITAL INTERACTION · MOTION"],
  ["CURRENT STATUS", "B.DES COMMUNICATION DESIGN"],
  ["CORE PHILOSOPHY", "CURIOSITY CREATES BETTER"],
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-black text-white px-6 sm:px-10 py-24 sm:py-40"
    >
      <div className="mx-auto w-full max-w-[1400px]">

        {/* SECTION LABEL */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-16 sm:mb-24 flex items-center justify-between border-b border-white/10 pb-5"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">
              Observatory // Spectral Analysis
            </span>
          </div>

          <span className="font-mono text-xs tracking-widest text-white/30">
            02
          </span>
        </motion.div>

        {/* MASSIVE COSMIC STATEMENT */}
        <motion.h2
          initial={{
            opacity: 0,
            y: 50,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            max-w-[1250px]
            text-[clamp(40px,7.5vw,130px)]
            font-medium
            leading-[0.92]
            tracking-[-0.075em]
          "
        >
          I DESIGN BECAUSE
          <br />
          I&apos;M CURIOUS ABOUT
          <br />
          HOW THINGS COULD
          <br />
          <span className="text-white/30">
            FEEL DIFFERENT.
          </span>
        </motion.h2>

        {/* INFO AREA */}
        <div className="mt-16 sm:mt-32 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">

          {/* PERSONAL COPY */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="col-span-1 md:col-span-6 lg:col-span-5 md:col-start-1 lg:col-start-2"
          >
            <p className="max-w-[460px] text-base sm:text-xl leading-relaxed text-white/70">
              I&apos;m Arnab, a communication designer exploring identity,
              spatial interaction and motion. I craft digital experiences that reward
              curiosity — environments that invite you to navigate, manipulate and discover
              unexpected signals.
            </p>
          </motion.div>

          {/* TELEMETRY DETAILS */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.3,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="col-span-1 md:col-span-6 lg:col-span-5 md:col-start-7 lg:col-start-8"
          >
            {details.map(([label, value]) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row sm:items-baseline justify-between border-t border-white/10 py-4 sm:py-5 gap-1 sm:gap-4"
              >
                <span className="text-[11px] font-mono tracking-[0.14em] text-white/35 uppercase">
                  {label}
                </span>

                <span className="text-right text-xs sm:text-sm text-white/75 font-sans">
                  {value}
                </span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}