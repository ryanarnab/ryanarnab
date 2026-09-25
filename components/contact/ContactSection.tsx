"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Copy, Check, Radio, Send, Globe, Sparkles, Orbit } from "lucide-react";

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
      className="relative z-10 w-full overflow-hidden bg-transparent text-white px-6 sm:px-10 lg:px-16 pt-24 sm:pt-36 pb-12 border-t border-white/10"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        
        {/* SECTION HEADER */}
        <div className="mb-14 sm:mb-20 flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900] animate-ping" />
              <span className="text-xs uppercase tracking-[0.2em] text-[#ffd900] font-mono font-semibold">
                Sector 04 // Deep Space Transmission
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-medium tracking-tight text-[#fffdf0]">
              Initialize Contact
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-mono tracking-widest text-white/50">
              SATELLITE WAVES PROPAGATING
            </span>
            <span className="font-mono text-xs tracking-widest text-[#ffd900]/70">
              04
            </span>
          </div>
        </div>

        {/* BENTO GRID: TRANSMISSION MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-8">
          
          {/* CARD 1: PRIMARY DISPATCH TERMINAL (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl liquid-glass p-8 sm:p-12 hover:border-[#ffd900]/30 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Send size={15} className="text-[#ffd900]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#ffd900]">
                  Direct Comms Channel
                </span>
              </div>

              <h3 className="text-[clamp(32px,5vw,64px)] font-medium leading-[0.95] tracking-[-0.06em] text-[#fffdf0] mb-6">
                HAVE AN IDEA OR MISSION IN MIND?
                <br />
                <span className="text-[#ffd900]">LET&apos;S TALK.</span>
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-[#fffdf0]/70 max-w-lg mb-8">
                Currently open for select brand identity commissions, spatial motion systems, and creative technology collaborations.
              </p>
            </div>

            {/* Email dispatch strip */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 flex items-center justify-between rounded-2xl bg-white/5 px-4 sm:px-5 py-3 border border-white/10">
                <span className="font-mono text-xs sm:text-sm text-[#ffd900] truncate">
                  {email}
                </span>
                <button
                  onClick={copyEmail}
                  data-cursor-label={copied ? "copied! ✓" : "copy email 📋"}
                  className="ml-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
                  title="Copy email to clipboard"
                >
                  {copied ? <Check size={14} className="text-[#ffd900]" /> : <Copy size={14} />}
                </button>
              </div>

              <a
                href={getMailtoHref()}
                data-cursor-label="open mail client ✉️"
                className="tactile-switch-accent rounded-2xl px-6 py-3.5 text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-transform group"
              >
                <span>Transmit Signal</span>
                <Send size={14} className="transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* CARD 2: MISSION PRESET SELECTOR (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl liquid-glass p-8 hover:border-[#ffd900]/30 transition-all">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <span className="text-xs font-mono uppercase tracking-widest text-[#ffd900]">
                  Transmission Frequency
                </span>
                <Sparkles size={14} className="text-[#ffd900]" />
              </div>

              <p className="text-xs font-mono text-white/60 mb-5">
                Select an operational focus to auto-configure transmission parameters:
              </p>

              <div className="space-y-3">
                {PRESETS.map((preset) => {
                  const isSelected = selectedPreset === preset.subject;
                  return (
                    <button
                      key={preset.label}
                      onClick={() => setSelectedPreset(isSelected ? null : preset.subject)}
                      data-cursor-label="select preset ✦"
                      className={`w-full text-left rounded-2xl p-4 transition-all duration-200 border cursor-pointer ${
                        isSelected
                          ? "liquid-metal border-[#ffd900]/60 text-[#ffd900] shadow-[0_0_16px_rgba(255,217,0,0.2)]"
                          : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/25"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{preset.label}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ffd900]" />
                      </div>
                      <span className="text-[11px] font-mono text-white/50 block">
                        {preset.subject}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-white/40 flex items-center justify-between">
              <span>ACTIVE FREQUENCY: {selectedPreset ? "CUSTOM LOCKED" : "GENERAL DISPATCH"}</span>
              <Orbit size={13} className="animate-spin text-[#ffd900]" />
            </div>
          </div>

        </div>

        {/* BENTO GRID: ROW 2 (ORBITAL UPLINKS & EARTH STATION) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SOCIAL_CHANNELS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label={`open ${social.name.toLowerCase()} ↗`}
              className="group flex flex-col justify-between rounded-3xl liquid-glass p-6 sm:p-7 transition-all duration-300 hover:scale-[1.02] hover:border-[#ffd900]/40"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono tracking-widest text-[#ffd900] uppercase">
                    {social.tag}
                  </span>
                  <ArrowUpRight size={15} className="text-white/40 group-hover:text-[#ffd900] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <h4 className="text-xl font-medium tracking-tight text-[#fffdf0] mb-1 group-hover:text-[#ffd900] transition-colors">
                  {social.name}
                </h4>
                <span className="font-mono text-xs text-white/50 block mb-3">
                  {social.handle}
                </span>

                <p className="text-xs leading-relaxed text-white/65">
                  {social.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40">
                <span>CHANNEL: ONLINE</span>
                <span className="text-[#ffd900]">CONNECT →</span>
              </div>
            </a>
          ))}
        </div>

        {/* FOOTER BAR & TELEMETRY */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/50">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 p-1">
              <Image src="/RyanArnab.svg" alt="RyanArnab" width={16} height={16} className="h-full w-full object-contain" />
            </div>
            <span>© 2026 RYAN ARNAB · ALL RIGHTS RESERVED</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5">
              <Radio size={11} className="text-[#ffd900] animate-pulse" />
              GUWAHATI 26.14°N 91.73°E
            </span>
            <span>·</span>
            <span>{time || "UTC CLOCK"}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}