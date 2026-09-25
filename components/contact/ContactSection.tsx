"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowUpRight, Copy, Check, Radio, Send, Globe } from "lucide-react";
import { useScrollController } from "../scroll/ScrollProvider";

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
  const [time, setTime] = useState("");
  const { scrollTo } = useScrollController();
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

  return (
    <footer
      id="contact"
      className="relative min-h-screen w-full overflow-hidden bg-[#080808] text-white px-6 sm:px-10 pb-12 pt-24 sm:pt-36 border-t border-[#ffd900]/20"
    >
      {/* BACKGROUND GRAPHICAL RADAR GRID */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
        {/* Concentric radar rings */}
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 h-[700px] w-[700px] sm:h-[900px] sm:w-[900px] rounded-full border border-[#ffd900]/20 flex items-center justify-center">
          <div className="h-[75%] w-[75%] rounded-full border border-dashed border-[#ffd900]/25 flex items-center justify-center">
            <div className="h-[60%] w-[60%] rounded-full border border-[#ffd900]/30 flex items-center justify-center">
              <div className="h-[40%] w-[40%] rounded-full border border-dashed border-[#ffd900]/40" />
            </div>
          </div>
        </div>

        {/* Ambient solar transmission glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[350px] w-[600px] bg-gradient-to-t from-[#ffd900]/15 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[85vh] w-full max-w-[1400px] flex-col justify-between">
        
        {/* TOP TELEMETRY STRIP */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffd900]/10 border border-[#ffd900]/30 p-1">
              <Image src="/RyanArnab.svg" alt="RyanArnab" width={18} height={18} className="h-full w-full object-contain" />
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#ffd900] animate-ping" />
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#ffd900] font-semibold">
                Sector 04 // Transmission Terminal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-white/40">
            <span className="text-[#ffd900]/80">BAND: KU-24GHZ</span>
            <span>·</span>
            <span>STATUS: OPEN FOR MISSIONS</span>
            <span>·</span>
            <span className="text-[#fffdf0]/80">{time || "TRANSMITTER READY"}</span>
          </div>
        </div>

        {/* MAIN GRAPHICAL TERMINAL INTERFACE */}
        <div className="py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: MASSIVE INVITATION & DIRECT ACTION */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffd900]/30 bg-[#ffd900]/10 px-3.5 py-1 text-xs font-mono tracking-wider text-[#ffd900] mb-6">
              <Radio size={12} className="animate-pulse" />
              <span>DIRECT SATELLITE UPLINK</span>
            </div>

            <h2 className="text-[clamp(44px,7.8vw,120px)] font-medium leading-[0.9] tracking-[-0.075em] text-[#fffdf0]">
              READY TO LAUNCH
              <br />
              <span className="text-[#ffd900]">YOUR NEXT SIGNAL?</span>
            </h2>

            <p className="mt-6 max-w-[500px] text-sm sm:text-base leading-relaxed text-[#fffdf0]/70">
              Whether you need a world-class visual identity system, interactive spatial digital experiences, or kinetic motion direction — open a transmission below.
            </p>

            {/* HIGH-IMPACT EMAIL TRANSMITTER BOX */}
            <div className="mt-10 max-w-[620px] rounded-2xl border border-[#ffd900]/30 bg-black/80 p-5 sm:p-6 backdrop-blur-xl shadow-[0_0_40px_rgba(255,217,0,0.12)]">
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40 mb-3">
                <span>PRIMARY COMMS FREQUENCY</span>
                <span className="text-[#ffd900]">FAST DISPATCH</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <a
                  href={`mailto:${email}`}
                  className="text-lg sm:text-2xl font-semibold tracking-tight text-[#fffdf0] hover:text-[#ffd900] transition-colors truncate"
                >
                  {email}
                </a>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={copyEmail}
                    className="flex items-center gap-2 rounded-xl border border-[#ffd900]/40 bg-[#ffd900]/10 px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-[#ffd900] transition-all hover:bg-[#ffd900] hover:text-black font-bold shadow-[0_0_16px_rgba(255,217,0,0.25)]"
                    title="Copy email address"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>

                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-mono uppercase tracking-wider text-white hover:border-white/30 transition-all"
                  >
                    <Send size={13} />
                    <span>Send</span>
                  </a>
                </div>
              </div>

              {/* QUICK LAUNCH INTENT PRESETS */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 mr-1">
                  Topic:
                </span>
                {PRESETS.map((preset) => (
                  <a
                    key={preset.label}
                    href={`mailto:${email}?subject=${encodeURIComponent(preset.subject)}`}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70 transition-all hover:border-[#ffd900]/50 hover:bg-[#ffd900]/10 hover:text-[#ffd900]"
                  >
                    {preset.label} →
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: GRAPHICAL NETWORK CHANNELS & BASE TELEMETRY */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#ffd900] mb-2 flex items-center gap-2">
              <Globe size={13} />
              <span>ORBITAL TRANSMISSION NODES</span>
            </div>

            {/* CHANNEL TILES */}
            <div className="grid grid-cols-1 gap-3.5">
              {SOCIAL_CHANNELS.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-[#ffd900]/50 hover:bg-[#ffd900]/[0.03] hover:shadow-[0_0_25px_rgba(255,217,0,0.15)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest text-[#ffd900]/80">
                      {channel.tag}
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="text-white/40 transition-transform duration-300 group-hover:rotate-45 group-hover:text-[#ffd900]"
                    />
                  </div>

                  <div className="mt-3">
                    <h3 className="text-xl font-bold tracking-tight text-[#fffdf0] group-hover:text-[#ffd900] transition-colors">
                      {channel.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/50 leading-relaxed">
                      {channel.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-white/40">
                    <span>{channel.handle}</span>
                    <span className="text-[#ffd900]/60 group-hover:text-[#ffd900]">UPLINK ACTIVE ↗</span>
                  </div>
                </a>
              ))}
            </div>

            {/* BASE STATION DECK TELEMETRY CARD */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs font-mono text-white/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/30 uppercase tracking-widest">Base Coordinates</span>
                <span className="text-[#ffd900]">26.14°N 91.73°E · GUWAHATI</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/30 uppercase tracking-widest">Availability</span>
                <span className="text-emerald-400 font-semibold">Q1/Q2 2026 MISSIONS</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM LAUNCHPAD BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/10 pt-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#ffd900]/10 border border-[#ffd900]/30 p-2 flex items-center justify-center">
              <Image src="/RyanArnab.svg" alt="RyanArnab Monogram" width={24} height={24} className="h-full w-full object-contain" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#fffdf0] tracking-tight">
                Arnab Ghosh
              </p>
              <p className="text-xs font-mono tracking-wider text-[#ffd900]/80">
                Communication Designer & Creative Technologist
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-mono text-white/40">
              © {new Date().getFullYear()} RYAN ARNAB · ALL ORBITS RESERVED
            </span>

            {/* LAUNCH TO ORIGIN BUTTON */}
            <button
              onClick={() => scrollTo("#hero")}
              className="flex items-center gap-2 rounded-full border border-[#ffd900]/40 bg-[#ffd900]/10 px-4 py-2 text-xs font-mono uppercase tracking-widest text-[#ffd900] transition-all hover:bg-[#ffd900] hover:text-black font-bold shadow-[0_0_16px_rgba(255,217,0,0.2)]"
            >
              <span>▲ RETURN TO ORBIT 00</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}