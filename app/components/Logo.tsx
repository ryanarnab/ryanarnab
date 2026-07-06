export function Logo({ light = true }: { light?: boolean }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span
        className={`font-serif text-lg tracking-tight sm:text-xl ${light ? "text-white" : "text-foreground"}`}
      >
        RyanArnab
      </span>
      <span
        className="inline-block size-2 translate-y-[-2px] bg-accent shadow-[0_0_12px_rgba(232,255,0,0.6)]"
        aria-hidden="true"
      />
    </span>
  );
}
