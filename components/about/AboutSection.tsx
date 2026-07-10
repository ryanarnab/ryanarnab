"use client";

import { motion } from "framer-motion";

const details = [
  ["BASED IN", "GUWAHATI, INDIA"],
  ["FOCUS", "VISUAL IDENTITY · DIGITAL · MOTION"],
  ["CURRENTLY", "B.DES COMMUNICATION DESIGN"],
  ["PHILOSOPHY", "CURIOSITY CREATES BETTER"],
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full overflow-hidden bg-black text-white"
    >
      <div className="mx-auto w-full max-w-[1400px] px-10 py-40">

        {/* SECTION LABEL */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="mb-24 flex items-center justify-between border-b border-white/10 pb-5"
        >
          <span className="text-xs uppercase tracking-[0.16em] text-white/35">
            About / The Observer
          </span>

          <span className="text-xs text-white/25">
            02
          </span>
        </motion.div>

        {/* MASSIVE STATEMENT */}
        <motion.h2
          initial={{
            opacity: 0,
            y: 70,
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
            text-[clamp(55px,8.5vw,130px)]
            font-medium
            leading-[0.88]
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
        <div className="mt-36 grid grid-cols-12 gap-8">

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
            className="col-span-5 col-start-2"
          >
            <p className="max-w-[440px] text-xl leading-8 text-white/70">
              I&apos;m Arnab, a communication designer exploring identity,
              interaction and motion. I like building experiences that reward
              curiosity — things that make you want to move, touch and discover
              what happens next.
            </p>
          </motion.div>

          {/* DETAILS */}
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
            className="col-span-5 col-start-8"
          >
            {details.map(([label, value]) => (
              <div
                key={label}
                className="flex items-start justify-between border-t border-white/10 py-5"
              >
                <span className="text-xs tracking-[0.12em] text-white/30">
                  {label}
                </span>

                <span className="max-w-[240px] text-right text-sm text-white/65">
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