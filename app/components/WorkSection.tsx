"use client";

import { projects } from "../lib/content";
import { GlassCard } from "./SiteSection";
import { useExperience } from "./ExperienceProvider";

export function WorkSection() {
  const { discover } = useExperience();

  return (
    <div>
      <div className="mb-12 sm:mb-16">
        <h2 className="max-w-3xl font-serif text-3xl leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Every project begins with a question.
        </h2>
      </div>

      <ul className="space-y-4 sm:space-y-5">
        {projects.map((project) => (
          <li key={project.id}>
            <GlassCard>
              <a
                href="#"
                data-cursor="active"
                className="group relative block"
                onMouseEnter={() => discover(project.id)}
                onFocus={() => discover(project.id)}
              >
                <span className="block font-serif text-2xl leading-snug tracking-tight transition-all duration-500 ease-out group-hover:opacity-0 sm:text-3xl">
                  {project.question}
                </span>

                <span className="absolute inset-0 flex items-center opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-2">
                  <span className="font-serif text-2xl tracking-tight sm:text-3xl">
                    {project.title}
                    <span className="text-accent">.</span>
                  </span>
                  <span className="ml-auto rounded-full border border-neutral-200 bg-white/80 px-4 py-1 text-sm tabular-nums text-muted shadow-sm">
                    {project.year}
                  </span>
                </span>
              </a>
            </GlassCard>
          </li>
        ))}
      </ul>
    </div>
  );
}
