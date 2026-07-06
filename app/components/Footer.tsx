const links = [
  { label: "Twitter", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-neutral-900 to-black text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6 py-12 sm:px-10 sm:py-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:flex sm:items-center sm:justify-between">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} RyanArnab — Curiosity Creates Better.
          </p>

          <ul className="mt-6 flex gap-8 sm:mt-0">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 transition-colors duration-300 hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
