"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  {
    label: "BEHANCE",
    href: "https://www.behance.net/",
  },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/",
  },
  {
    label: "INSTAGRAM",
    href: "https://www.instagram.com/",
  },
];

export default function ContactSection() {
  return (
    <footer
      id="contact"
      className="
        relative
        min-h-screen
        w-full
        overflow-hidden
        bg-black
        text-white
      "
    >
      <div
        className="
          mx-auto
          flex
          min-h-screen
          w-full
          max-w-[1400px]
          flex-col
          justify-between
          px-10
          pb-10
          pt-32
        "
      >
        {/* TOP INFORMATION */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-white/10
            pb-5
          "
        >
          <span
            className="
              text-xs
              uppercase
              tracking-[0.16em]
              text-white/35
            "
          >
            Contact / Start a Conversation
          </span>

          <span className="text-xs text-white/25">
            04
          </span>
        </div>

        {/* MAIN CONTACT AREA */}

        <motion.div
          initial={{
            opacity: 0,
            y: 60,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.25,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="py-24"
        >
          <p
            className="
              mb-8
              max-w-[380px]
              text-sm
              leading-6
              text-white/45
            "
          >
            Have an idea, collaboration or something
            interesting worth exploring?
          </p>

          <h2
            className="
              max-w-[1250px]
              text-[clamp(70px,12vw,180px)]
              font-medium
              leading-[0.8]
              tracking-[-0.085em]
            "
          >
            LET&apos;S MAKE
            <br />

            <span className="text-white/30">
              SOMETHING
            </span>

            <br />

            CURIOUS.
          </h2>

          {/* EMAIL */}

          <motion.a
            href="mailto:your-email@example.com"
            whileHover={{
              x: 8,
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 25,
            }}
            className="
              group
              mt-20
              inline-flex
              items-center
              gap-4
              border-b
              border-white/25
              pb-3
              text-[clamp(22px,3vw,42px)]
              tracking-[-0.04em]
              text-white
              transition-colors
              hover:border-white
            "
          >
            your-email@example.com

            <ArrowUpRight
              className="
                transition-transform
                duration-300
                group-hover:rotate-45
              "
              size={30}
              strokeWidth={1.5}
            />
          </motion.a>
        </motion.div>

        {/* FOOTER BAR */}

        <div
          className="
            flex
            items-end
            justify-between
            border-t
            border-white/10
            pt-6
          "
        >
          <div>
            <p className="text-sm text-white/65">
              Arnab Ghosh
            </p>

            <p className="mt-1 text-xs text-white/30">
              Communication Designer · Guwahati, India
            </p>
          </div>

          <div className="flex items-center gap-7">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="
                  text-xs
                  tracking-[0.12em]
                  text-white/35
                  transition-colors
                  hover:text-white
                "
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="
              text-xs
              uppercase
              tracking-[0.12em]
              text-white/35
              transition-colors
              hover:text-white
            "
          >
            Back to Origin ↑
          </button>
        </div>
      </div>
    </footer>
  );
}