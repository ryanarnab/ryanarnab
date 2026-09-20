"use client";

import { useState } from "react";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

const links = [
  {
    label: "BEHANCE",
    href: "https://www.behance.net/ryanarnab",
  },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/arnab-ghosh-ba99782a7/",
  },
  {
    label: "INSTAGRAM",
    href: "https://www.instagram.com/ryanarnab/",
  },
];

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const email = "ryanarnab.design@gmail.com";

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer
      id="contact"
      className="relative min-h-screen w-full overflow-hidden bg-black text-white px-6 sm:px-10 pb-12 pt-24 sm:pt-36"
    >
      <div className="mx-auto flex min-h-[85vh] w-full max-w-[1400px] flex-col justify-between">
        
        {/* TOP TELEMETRY */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] text-white/40">
              Subspace Frequency // Transmission Terminal
            </span>
          </div>

          <span className="font-mono text-xs tracking-widest text-white/30">
            04
          </span>
        </div>

        {/* MAIN CONTACT AREA */}
        <motion.div
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
            amount: 0.25,
          }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="py-16 sm:py-24"
        >
          <p className="mb-6 max-w-[400px] text-xs sm:text-sm leading-relaxed text-white/45">
            Seeking collaborations, spatial interfaces, identity systems or novel digital missions.
          </p>

          <h2 className="max-w-[1250px] text-[clamp(48px,11vw,180px)] font-medium leading-[0.88] tracking-[-0.085em] text-white">
            LET&apos;S MAKE
            <br />
            <span className="text-white/30">SOMETHING</span>
            <br />
            CURIOUS.
          </h2>

          {/* EMAIL & COPY ACTION */}
          <div className="mt-12 sm:mt-16 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${email}`}
              className="
                group
                inline-flex
                items-center
                gap-3 sm:gap-4
                border-b
                border-white/25
                pb-2 sm:pb-3
                text-[clamp(18px,2.8vw,38px)]
                tracking-[-0.03em]
                text-white
                transition-colors
                hover:border-white
              "
            >
              {email}
              <ArrowUpRight
                className="transition-transform duration-300 group-hover:rotate-45"
                size={24}
                strokeWidth={1.5}
              />
            </a>

            {/* Quick Copy Button */}
            <button
              onClick={copyEmail}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur-md transition hover:border-white/40 hover:bg-white/10 hover:text-white"
              title="Copy email to clipboard"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? "Copied Signal" : "Copy"}</span>
            </button>
          </div>
        </motion.div>

        {/* FOOTER BAR */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-0 border-t border-white/10 pt-8">
          <div>
            <p className="text-sm font-medium text-white/80">
              Arnab Ghosh
            </p>
            <p className="mt-1 text-xs font-mono tracking-wider text-white/35">
              Communication Designer · Guwahati Deck · 26.14°N 91.73°E
            </p>
          </div>

          <div className="flex items-center gap-6 sm:gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="text-xs uppercase tracking-[0.16em] text-white/40 transition-colors hover:text-white"
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
            className="text-xs uppercase tracking-[0.16em] text-white/40 transition-colors hover:text-white"
          >
            Back to Origin ↑
          </button>
        </div>

      </div>
    </footer>
  );
}