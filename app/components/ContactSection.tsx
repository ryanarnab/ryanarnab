"use client";

import { useEffect, useState } from "react";
import { GlassCard } from "./SiteSection";

const email = "hello@ryanarnab.com";
const reversed = email.split("").reverse().join("");

export function ContactSection() {
  const [correct, setCorrect] = useState(false);
  const [typed, setTyped] = useState("");
  const [fieldVisible, setFieldVisible] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (event.key.length === 1 && !event.metaKey && !event.ctrlKey) {
        setTyped((prev) => prev + event.key);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (typed.length >= 3) setFieldVisible(true);
  }, [typed]);

  return (
    <div>
      <p className="mb-10 font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
        Correspondence is the last index entry.
      </p>

      <GlassCard dark>
        <a
          href={`mailto:${email}`}
          data-cursor="active"
          className="inline-block text-xl transition-all duration-500 sm:text-2xl"
          onMouseEnter={() => setCorrect(true)}
          onMouseLeave={() => setCorrect(false)}
          onFocus={() => setCorrect(true)}
          onBlur={() => setCorrect(false)}
        >
          <span
            className={`inline-block transition-all duration-500 ${
              correct
                ? "text-accent drop-shadow-[0_0_20px_rgba(232,255,0,0.35)]"
                : "text-white/50"
            }`}
            aria-label={email}
          >
            {correct ? email : reversed}
          </span>
        </a>

        {fieldVisible && (
          <p className="mt-6 border-t border-white/10 pt-6 text-sm text-white/40">
            You started typing — the address is{" "}
            <a
              href={`mailto:${email}`}
              className="text-white underline decoration-accent underline-offset-4 transition-colors hover:text-accent"
            >
              {email}
            </a>
            .
          </p>
        )}
      </GlassCard>
    </div>
  );
}
