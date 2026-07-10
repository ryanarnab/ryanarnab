"use client";

import { motion } from "framer-motion";

const projects = [
  {
    number: "01",
    title: "DEEKSHARAMBH",
    year: "2026",
    category: "VISUAL IDENTITY · EVENT DESIGN",
    description:
      "A dynamic visual identity built around many stories converging into one beginning.",
  },
  {
    number: "02",
    title: "BEATPULSE",
    year: "2026",
    category: "EXPERIMENTAL · INTERACTION",
    description:
      "A music-reactive haptic experience translating sound into physical vibration.",
  },
  {
    number: "03",
    title: "PROJECT THREE",
    year: "2026",
    category: "BRAND IDENTITY",
    description:
      "A selected identity project exploring systems, form and visual communication.",
  },
  {
    number: "04",
    title: "PROJECT FOUR",
    year: "2025",
    category: "MOTION · DIGITAL",
    description:
      "An experimental digital project built through motion, interaction and curiosity.",
  },
];

export default function WorkSection() {
  return (
    <motion.section
      id="works"
      initial={{
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
      }}
      className="
        relative
        z-20
        w-full
        overflow-hidden
        rounded-t-[32px]
        bg-[#000000]
        text-white
      "
    >
      {/* INTRO */}
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] items-center px-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full"
        >
          <div className="mb-8 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-white/35">
            <span>Selected Works / 2024—2026</span>
            <span>04 Objects Discovered</span>
          </div>

          <h2 className="text-[clamp(80px,13vw,190px)] font-medium leading-[0.8] tracking-[-0.08em]">
            SELECTED
            <br />
            WORKS
          </h2>

          <div className="mt-12 flex items-center gap-3 text-sm text-white/35">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            Scroll to explore
          </div>
        </motion.div>
      </div>

      {/* PROJECTS */}
      <div className="mx-auto w-full max-w-[1400px] px-10 pb-40">
        {projects.map((project, index) => {
          const alignRight = index % 2 === 0;

          return (
            <motion.article
              key={project.number}
              initial={{
                opacity: 0,
                y: 80,
                scale: 0.97,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              viewport={{
                once: true,
                amount: 0.15,
              }}
              transition={{
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`mb-52 flex w-full ${
                alignRight ? "justify-end" : "justify-start"
              }`}
            >
              <div className="w-[78%]">
                {/* PROJECT META */}
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <span className="mb-2 block text-xs text-white/30">
                      {project.number} / 04
                    </span>

                    <h3 className="text-[clamp(42px,6vw,90px)] font-medium leading-none tracking-[-0.06em]">
                      {project.title}
                    </h3>
                  </div>

                  <span className="pb-2 text-sm text-white/35">
                    {project.year}
                  </span>
                </div>

                {/* PROJECT VISUAL PLACEHOLDER */}
                <motion.div
                  whileHover={{
                    scale: 0.985,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 25,
                  }}
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.035]"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs uppercase tracking-[0.18em] text-white/20">
                      Project Visual
                    </span>
                  </div>
                </motion.div>

                {/* PROJECT INFO */}
                <div className="mt-5 flex items-start justify-between gap-10">
                  <p className="text-xs uppercase tracking-[0.12em] text-white/35">
                    {project.category}
                  </p>

                  <p className="max-w-[340px] text-right text-sm leading-6 text-white/55">
                    {project.description}
                  </p>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}