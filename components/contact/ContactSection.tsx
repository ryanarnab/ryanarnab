"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Copy, Check, Radio, Send, Sparkles, Crosshair, Signal } from "lucide-react";
import { triggerLightHaptic, triggerSuccessHaptic } from "@/lib/haptics";

interface SocialChannel {
  name: string;
  handle: string;
  desc: string;
  href: string;
  tag: string;
}

const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    name: "Behance",
    handle: "/ryanarnab",
    desc: "Complete Case Studies & Identity Systems",
    href: "https://www.behance.net/ryanarnab",
    tag: "PORTFOLIO ARCHIVE",
  },
  {
    name: "LinkedIn",
    handle: "Arnab Ghosh",
    desc: "Professional History & Design Leadership",
    href: "https://www.linkedin.com/in/arnab-ghosh-ba99782a7/",
    tag: "PROFESSIONAL NETWORK",
  },
  {
    name: "Instagram",
    handle: "@ryanarnab",
    desc: "Kinetic Motion, Spatial 3D & Daily Labs",
    href: "https://www.instagram.com/ryanarnab/",
    tag: "DAILY ARTIFACTS",
  },
];

const PRESETS = [
  { label: "New Project / Identity", subject: "Mission Inquiry: Brand Identity System" },
  { label: "Spatial & Motion", subject: "Mission Inquiry: Spatial & Motion Design" },
  { label: "Creative Tech Collaboration", subject: "Mission Inquiry: Creative Technology" },
];

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [time, setTime] = useState("");
  const email = "ryanarnab.design@gmail.com";

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyEmail = () => {
    triggerSuccessHaptic();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2600);
  };

  const getMailtoHref = () => {
    const subject = selectedPreset
      ? encodeURIComponent(selectedPreset)
      : encodeURIComponent("Mission Inquiry / Collaboration");
    return `mailto:${email}?subject=${subject}`;
  };

  return (
    <footer
      id="contact"
      className="relative z-10 w-full overflow-hidden bg-transparent text-white px-6 sm:px-10 lg:px-16 pt-24 sm:pt-36 pb-12"
    >
      {/* Edge divider at top */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      <div className="absolute top-0 left-0 w-[120px] h-[1px] bg-gradient-to-r from-[#d4b068] to-transparent" />

      <div className="mx-auto w-full max-w-[1440px]">
        
        {/* SECTION HEADER — Angular */}
        <div className="mb-14 sm:mb-20 flex flex-col sm:flex-row sm:items-end justify-between edge-divider pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-6 w-6 flex items-center justify-center bg-[#d4b068]/10 text-[#d4b068] border border-[#d4b068]/30"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
              >
                <Signal size={10} />
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#d4b068] font-mono font-bold">
                Sector 04 // Deep Space Transmission
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-bold tracking-[-0.04em] text-[#fffdf0]">
              Initialize <span className="text-[#d4b068]">Contact</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono tracking-widest text-white/40 uppercase">
              Satellite Waves Propagating
            </span>
            <div className="h-8 w-[2px] bg-gradient-to-b from-[#d4b068] to-transparent" />
          </div>
        </div>

        {/* BENTO GRID: TRANSMISSION MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 mb-6">
          
          {/* CARD 1: PRIMARY DISPATCH TERMINAL (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col justify-between angular-panel p-8 sm:p-12 transition-all">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Send size={14} className="text-[#d4b068]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#d4b068] font-bold">
                  Direct Comms Channel
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#d4b068]/20 to-transparent ml-3" />
              </div>

              <h3 className="text-[clamp(28px,4.5vw,58px)] font-bold leading-[0.95] tracking-[-0.05em] text-[#fffdf0] mb-6">
                HAVE AN IDEA OR MISSION IN MIND?
                <br />
                <span className="text-[#d4b068]">LET&apos;S TALK.</span>
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#fffdf0]/60 max-w-lg mb-8">
                Currently open for select brand identity commissions, spatial motion systems, and creative technology collaborations.
              </p>
            </div>

            {/* Email dispatch strip */}
            <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 flex items-center justify-between bg-white/4 px-4 sm:px-5 py-3.5 border border-white/8"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
              >
                <span className="font-mono text-xs sm:text-sm text-[#d4b068] truncate font-bold">
                  {email}
                </span>
                <button
                  onClick={copyEmail}
                  data-cursor-label={copied ? "copied! ✓" : "copy email 📋"}
                  className="ml-3 p-1.5 bg-white/8 hover:bg-white/15 text-white/80 transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                  style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
                >
                  {copied ? <Check size={14} className="text-[#d4b068]" /> : <Copy size={14} />}
                </button>
              </div>

              <a
                href={getMailtoHref()}
                data-cursor-label="open mail client ✉️"
                className="tactile-switch-accent px-6 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer transition-transform group"
                style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
              >
                <span>Transmit Signal</span>
                <Send size={14} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* CARD 2: MISSION PRESET SELECTOR (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col justify-between angular-panel p-8 transition-all">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-6">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4b068] font-bold">
                  Transmission Frequency
                </span>
                <Sparkles size={12} className="text-[#d4b068]" />
              </div>

              <p className="text-[10px] font-mono text-white/50 mb-5 tracking-wider uppercase">
                Select an operational focus to auto-configure transmission parameters:
              </p>

              <div className="space-y-3">
                {PRESETS.map((preset) => {
                  const isSelected = selectedPreset === preset.subject;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => {
                        triggerLightHaptic();
                        setSelectedPreset(isSelected ? null : preset.subject);
                      }}
                      data-cursor-label="select preset ✦"
                      className={`w-full text-left p-4 transition-all duration-200 border cursor-pointer ${
                        isSelected
                          ? "angular-panel border-[#d4b068]/50 text-[#d4b068] shadow-[0_0_20px_rgba(212, 176, 104,0.15)]"
                          : "bg-white/3 border-white/8 text-white/75 hover:bg-white/6 hover:border-white/15"
                      }`}
                      style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold">{preset.label}</span>
                        <span className="h-2 w-2 bg-[#d4b068]"
                          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-white/40 block tracking-wider uppercase">
                        {preset.subject}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/8 text-[10px] font-mono text-white/30 flex items-center justify-between uppercase tracking-widest">
              <span>Frequency: {selectedPreset ? "Custom Locked" : "General Dispatch"}</span>
              <Crosshair size={11} className="text-[#d4b068]" />
            </div>
          </div>

        </div>

        {/* BENTO GRID: ROW 2 (ORBITAL UPLINKS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {SOCIAL_CHANNELS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label={`open ${social.name.toLowerCase()} ↗`}
              className="group flex flex-col justify-between angular-panel-sm p-6 sm:p-7 transition-all duration-300 hover:scale-[1.02]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[9px] font-mono tracking-[0.2em] text-[#d4b068] uppercase font-bold">
                    {social.tag}
                  </span>
                  <ArrowUpRight size={14} className="text-white/30 group-hover:text-[#d4b068] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <h4 className="text-xl font-bold tracking-tight text-[#fffdf0] mb-1 group-hover:text-[#d4b068] transition-colors">
                  {social.name}
                </h4>
                <span className="font-mono text-xs text-white/40 block mb-3 tracking-wider">
                  {social.handle}
                </span>

                <p className="text-xs leading-relaxed text-white/50">
                  {social.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/8 flex items-center justify-between text-[10px] font-mono text-white/30 uppercase tracking-widest">
                <span>Channel: Online</span>
                <span className="text-[#d4b068] font-bold">Connect →</span>
              </div>
            </a>
          ))}
        </div>

        {/* FOOTER BAR — Angular */}
        <div className="mt-16 sm:mt-24 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          {/* Edge line */}
          <div className="absolute left-6 sm:left-10 lg:left-16 right-6 sm:right-10 lg:right-16 h-[1px] bg-gradient-to-r from-[#d4b068]/30 via-white/8 to-transparent" style={{ marginTop: "-32px" }} />
          
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center bg-white/8 p-1"
              style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
            >
              <Image src="/RyanArnab.svg" alt="RyanArnab" width={16} height={16} className="h-full w-full object-contain" />
            </div>
            <span>© 2026 Ryan Arnab · All Rights Reserved</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Radio size={10} className="text-[#d4b068] animate-pulse" />
              Guwahati 26.14°N 91.73°E
            </span>
            <span className="text-white/15">·</span>
            <span className="text-[#d4b068]/60">{time || "UTC CLOCK"}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}