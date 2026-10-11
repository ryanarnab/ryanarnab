"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Cursor from "@/components/cursor/Cursor";
import { ScrollProvider } from "@/components/scroll/ScrollProvider";
import { motion } from "framer-motion";
import {
  UploadCloud,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  Eye,
  EyeOff,
  Layers,
  Palette,
  Crosshair,
  AlertCircle
} from "lucide-react";
import { useSound } from "@/components/sound/SoundProvider";
import { triggerLightHaptic, triggerMediumHaptic, triggerSuccessHaptic } from "@/lib/haptics";

const CATEGORIES = [
  "Identity",
  "Typography",
  "3D & CGI",
  "Art Direction",
  "Editorial",
] as const;

export default function UploadPage() {
  const { playClick, playSuccess, playWarp } = useSound();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("Identity");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [client, setClient] = useState("");
  const [role, setRole] = useState("Brand Identity Designer & Art Director");
  const [desc, setDesc] = useState("");
  const [objective, setObjective] = useState("");
  const [architecture, setArchitecture] = useState("");
  const [impact, setImpact] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"showcase" | "uploading_soon">("showcase");

  // Color Swatches
  const [colors, setColors] = useState([
    { name: "Orbital Gold", hex: "#d4b068" },
    { name: "Deep Void", hex: "#08080C" },
    { name: "Solar Starlight", hex: "#FFFDF0" },
  ]);

  // Image Upload & Preview
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProject, setSubmittedProject] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playClick();
      triggerLightHaptic();
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      playClick();
      triggerLightHaptic();
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const addColor = () => {
    playClick();
    triggerLightHaptic();
    setColors([...colors, { name: `Swatch ${colors.length + 1}`, hex: "#d4b068" }]);
  };

  const updateColor = (index: number, key: "name" | "hex", val: string) => {
    const updated = [...colors];
    updated[index][key] = val;
    setColors(updated);
  };

  const removeColor = (index: number) => {
    playClick();
    triggerLightHaptic();
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please specify an expedition title");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    playWarp();
    triggerMediumHaptic();

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      formData.append("title", title);
      formData.append("category", category);
      formData.append("year", year);
      formData.append("client", client || "Studio Expedition");
      formData.append("role", role);
      formData.append("desc", desc || "Tactical artifact exploration in spatial interface.");
      formData.append("objective", objective);
      formData.append("architecture", architecture);
      formData.append("impact", impact);
      formData.append("tags", tags || `${category}, Creative`);
      formData.append("status", status);
      formData.append("colors", JSON.stringify(colors));

      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        playSuccess();
        triggerSuccessHaptic();
        setSubmittedProject(data.project);
      } else {
        setErrorMsg(data.error || "Failed to commit expedition to archive");
      }
    } catch (err) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    playClick();
    setSelectedFile(null);
    setPreviewUrl(null);
    setTitle("");
    setDesc("");
    setObjective("");
    setArchitecture("");
    setImpact("");
    setTags("");
    setSubmittedProject(null);
  };

  return (
    <ScrollProvider>
      <Cursor />
      <Navbar />

      <main className="relative min-h-screen w-full bg-[#050508] text-white px-5 sm:px-8 md:px-10 lg:px-12 xl:px-16 2xl:px-20 pt-32 sm:pt-40 pb-28">
        <div className="mx-auto w-full max-w-4xl xl:max-w-5xl">
          
          {/* HEADER TELEMETRY STRIP */}
          <div className="mb-10 sm:mb-14">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.25em] text-[#d4b068] mb-3">
              <Crosshair size={12} className="text-[#d4b068] animate-spin" />
              <span>TERMINAL // EXPEDITION INGESTION SYSTEM</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#fffdf0] uppercase">
              Upload <span className="text-[#d4b068]">Artifact</span>
            </h1>
            <p className="mt-2 text-sm font-sans text-white/60 max-w-xl">
              Publish new works directly into your archive. Configured projects automatically update all metrics, 
              interactive telemetry counts, and live portfolio showcase cards across the site.
            </p>
          </div>

          {/* SUCCESS MODAL CARD */}
          {submittedProject ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 sm:p-10 border border-[#d4b068]/40 bg-[#0a0a10] shadow-[0_30px_90px_rgba(212,176,104,0.15)] flex flex-col items-center text-center space-y-6"
              style={{ clipPath: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))" }}
            >
              <div className="h-16 w-16 rounded-full bg-[#d4b068]/10 border border-[#d4b068]/30 flex items-center justify-center text-[#d4b068]">
                <CheckCircle2 size={32} />
              </div>

              <div>
                <span className="text-xs font-mono tracking-widest text-[#d4b068] uppercase">
                  {submittedProject.code} // COMMITTED TO ARCHIVE
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold uppercase text-[#fffdf0] mt-1">
                  {submittedProject.title}
                </h2>
                <p className="text-xs sm:text-sm font-mono text-white/50 mt-1">
                  STATUS: {submittedProject.status === "showcase" ? "ACTIVE SHOWCASE (LIVE ON SITE)" : "UPLOADING SOON (BLURRED)"}
                </p>
              </div>

              {submittedProject.src && (
                <div className="relative w-full max-w-md aspect-[16/10] overflow-hidden rounded-lg border border-white/10 bg-black">
                  <Image
                    src={submittedProject.src}
                    alt={submittedProject.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/10 w-full">
                <Link
                  href="/works"
                  data-cursor-label="view works ↗"
                  className="tactile-switch px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-black bg-[#d4b068] hover:bg-[#e2c17d] flex items-center gap-2"
                  style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                >
                  <span>View in Works Archive</span>
                  <ArrowUpRight size={14} />
                </Link>

                <Link
                  href="/#work"
                  data-cursor-label="view homepage ↗"
                  className="tactile-switch px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white border border-white/20 hover:border-[#d4b068]/50 flex items-center gap-2"
                  style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                >
                  <span>View on Homepage</span>
                  <ArrowUpRight size={14} />
                </Link>

                <button
                  onClick={resetForm}
                  className="px-6 py-3 text-xs font-mono text-white/60 hover:text-white underline underline-offset-4 cursor-pointer"
                >
                  Ingest Another Artifact
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* ERROR NOTICE */}
              {errorMsg && (
                <div className="p-4 border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. IMAGE UPLOAD DROPZONE */}
              <div 
                className="angular-panel p-6 sm:p-8 space-y-4 border border-white/10 bg-[#0a0a10]"
                style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#d4b068] uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={12} />
                    <span>01 // VISUAL ASSET DROPZONE</span>
                  </span>
                  <span className="text-white/40">PNG, JPG, WEBP (AUTO-COMPRESSED)</span>
                </div>

                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer border-2 border-dashed border-white/15 hover:border-[#d4b068]/60 bg-white/[0.01] hover:bg-white/[0.03] transition-all p-8 flex flex-col items-center justify-center text-center min-h-[220px]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="relative w-full aspect-[16/9] max-h-[280px] overflow-hidden rounded border border-white/20">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-mono text-[#d4b068]">
                        Click or Drop new file to replace
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-[#d4b068] group-hover:border-[#d4b068]/40 transition-colors">
                        <UploadCloud size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white/90">
                          Click to select image or drag and drop artwork
                        </p>
                        <p className="text-xs font-mono text-white/40 mt-1">
                          Max dimensions preserved up to 1920px
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. VISIBILITY & SHOWCASE STATUS */}
              <div 
                className="angular-panel p-6 sm:p-8 space-y-4 border border-white/10 bg-[#0a0a10]"
                style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#d4b068] uppercase tracking-widest flex items-center gap-2">
                    <Layers size={12} />
                    <span>02 // VISIBILITY & SHOWCASE PROTOCOL</span>
                  </span>
                  <span className="text-white/40">STATUS CONTROLLER</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => {
                      playClick();
                      triggerLightHaptic();
                      setStatus("showcase");
                    }}
                    className={`p-4 border cursor-pointer transition-all flex items-start gap-3.5 ${
                      status === "showcase"
                        ? "border-[#d4b068] bg-[#d4b068]/10 text-white"
                        : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20"
                    }`}
                  >
                    <Eye size={20} className={status === "showcase" ? "text-[#d4b068]" : "text-white/40"} />
                    <div>
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#fffdf0]">
                        Active Showcase (Live)
                      </div>
                      <p className="text-xs text-white/60 mt-1">
                        Fully visible with images, title, tags, and clickable expedition dossier modal.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      playClick();
                      triggerLightHaptic();
                      setStatus("uploading_soon");
                    }}
                    className={`p-4 border cursor-pointer transition-all flex items-start gap-3.5 ${
                      status === "uploading_soon"
                        ? "border-[#d4b068] bg-[#d4b068]/10 text-white"
                        : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20"
                    }`}
                  >
                    <EyeOff size={20} className={status === "uploading_soon" ? "text-[#d4b068]" : "text-white/40"} />
                    <div>
                      <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#fffdf0]">
                        Uploading Soon (Blurred)
                      </div>
                      <p className="text-xs text-white/60 mt-1">
                        Blurred out with dark grey backdrop, no text exposed. Placeholder reserved for future reveal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. EXPEDITION METADATA */}
              <div 
                className="angular-panel p-6 sm:p-8 space-y-6 border border-white/10 bg-[#0a0a10]"
                style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#d4b068] uppercase tracking-widest flex items-center gap-2">
                    <Crosshair size={12} />
                    <span>03 // EXPEDITION METADATA</span>
                  </span>
                  <span className="text-white/40">CORE IDENTITY SPEC</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                      Expedition Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. AXIOM DISPLAY SYSTEM"
                      required
                      className="w-full bg-white/[0.03] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4b068]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                      Discipline Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#0a0a10] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4b068]"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                      Cycle / Year
                    </label>
                    <input
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="2026"
                      className="w-full bg-white/[0.03] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4b068]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                      Client / Organization
                    </label>
                    <input
                      type="text"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      placeholder="e.g. Kokuyo Camel / Studio R"
                      className="w-full bg-white/[0.03] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4b068]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                      Designation Role
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Lead Type Designer & Creative Technologist"
                      className="w-full bg-white/[0.03] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4b068]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                      Project Synopsis / Brief Description
                    </label>
                    <textarea
                      rows={3}
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      placeholder="A comprehensive breakdown of the project concept and kinetic identity..."
                      className="w-full bg-white/[0.03] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4b068]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                      Categorization Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="Typeface Design, Typography, Branding"
                      className="w-full bg-white/[0.03] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4b068]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. DOSSIER NARRATIVE (FOR DETAILED MODAL) */}
              <div 
                className="angular-panel p-6 sm:p-8 space-y-4 border border-white/10 bg-[#0a0a10]"
                style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#d4b068] uppercase tracking-widest flex items-center gap-2">
                    <Layers size={12} />
                    <span>04 // DOSSIER NARRATIVE (CASE STUDY)</span>
                  </span>
                  <span className="text-white/40">OPTIONAL DETAILED SPEC</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                      Strategic Objective
                    </label>
                    <textarea
                      rows={2}
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      placeholder="To engineer a relativistic display font bridging tactile warmth with modernist precision..."
                      className="w-full bg-white/[0.03] border border-white/15 px-4 py-2 text-sm text-white focus:outline-none focus:border-[#d4b068]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                      System Architecture
                    </label>
                    <textarea
                      rows={2}
                      value={architecture}
                      onChange={(e) => setArchitecture(e.target.value)}
                      placeholder="Forged with extreme stroke contrast and geometric ink-traps..."
                      className="w-full bg-white/[0.03] border border-white/15 px-4 py-2 text-sm text-white focus:outline-none focus:border-[#d4b068]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-white/70 mb-2">
                      Operational Impact
                    </label>
                    <textarea
                      rows={2}
                      value={impact}
                      onChange={(e) => setImpact(e.target.value)}
                      placeholder="Adopted as the foundational display typeface for brand campaigns..."
                      className="w-full bg-white/[0.03] border border-white/15 px-4 py-2 text-sm text-white focus:outline-none focus:border-[#d4b068]"
                    />
                  </div>
                </div>
              </div>

              {/* 5. COLOR PALETTE SWATCHES */}
              <div 
                className="angular-panel p-6 sm:p-8 space-y-4 border border-white/10 bg-[#0a0a10]"
                style={{ clipPath: "polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))" }}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#d4b068] uppercase tracking-widest flex items-center gap-2">
                    <Palette size={12} />
                    <span>05 // DESIGN SYSTEM SWATCHES</span>
                  </span>
                  <button
                    type="button"
                    onClick={addColor}
                    className="text-[#d4b068] hover:underline cursor-pointer"
                  >
                    + Add Swatch
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {colors.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 border border-white/10 bg-white/[0.02]">
                      <input
                        type="color"
                        value={c.hex}
                        onChange={(e) => updateColor(i, "hex", e.target.value)}
                        className="h-8 w-8 rounded border-none cursor-pointer bg-transparent"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={c.name}
                          onChange={(e) => updateColor(i, "name", e.target.value)}
                          placeholder="Name"
                          className="w-full text-xs font-mono bg-transparent border-none text-white focus:outline-none"
                        />
                        <div className="text-[10px] font-mono text-white/40">{c.hex}</div>
                      </div>
                      {colors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeColor(i)}
                          className="text-white/30 hover:text-red-400 text-xs px-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <div className="pt-4 flex items-center justify-end gap-4">
                <Link
                  href="/works"
                  className="px-6 py-3.5 text-xs font-mono text-white/60 hover:text-white uppercase tracking-wider"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  data-cursor-label="deploy expedition ↗"
                  className="tactile-switch px-8 sm:px-12 py-4 text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-black bg-[#d4b068] hover:bg-[#e2c17d] transition-transform hover:scale-[1.02] flex items-center gap-3 cursor-pointer shadow-[0_0_24px_rgba(212,176,104,0.4)] disabled:opacity-50"
                  style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
                >
                  <Sparkles size={16} />
                  <span>{isSubmitting ? "WRITING TELEMETRY..." : "COMMISSION EXPEDITION TO ARCHIVE"}</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>

            </form>
          )}

        </div>
      </main>
    </ScrollProvider>
  );
}
