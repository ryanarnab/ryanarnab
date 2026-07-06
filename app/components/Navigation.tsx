"use client";

import { Logo } from "./Logo";
import { useExperience } from "./ExperienceProvider";

const sectionHints = {
  hero: "Wonder",
  work: "Work",
  about: "About",
  playground: "Play",
  contact: "Contact",
} as const;

const links = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Playground", href: "#playground" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const { activeSection } = useExperience();

  return (
    <header className="glass-nav sticky top-0 z-50">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10 sm:py-6">
        <a
          href="#"
          className="text-white transition-opacity duration-300 hover:opacity-70"
        >
          <Logo />
        </a>

        <div className="flex items-center gap-6 sm:gap-10">
          <span
            className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs tracking-[0.2em] text-white/50 uppercase shadow-lg shadow-black/20 backdrop-blur-md sm:inline"
            aria-hidden="true"
          >
            {sectionHints[activeSection]}
          </span>

          <ul className="flex items-center gap-5 sm:gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm tracking-wide text-white/60 transition-colors duration-300 hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
