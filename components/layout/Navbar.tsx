"use client";

export default function Navbar() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full pointer-events-none">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 sm:px-10 py-6 sm:py-8">
        {/* Logo */}
        <div className="w-32 text-sm font-medium pointer-events-auto">
          <button
            onClick={() => scrollTo("hero")}
            className="transition hover:opacity-60 text-white tracking-tight"
          >
            ryanarnab
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pointer-events-auto">
          <ul className="flex justify-center gap-6 sm:gap-8 text-xs sm:text-sm">
            <li>
              <button
                onClick={() => scrollTo("hero")}
                className="transition hover:opacity-60 text-white/80 hover:text-white"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollTo("work")}
                className="transition hover:opacity-60 text-white/80 hover:text-white"
              >
                Works
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollTo("about")}
                className="transition hover:opacity-60 text-white/80 hover:text-white"
              >
                About
              </button>
            </li>
          </ul>
        </nav>

        {/* CTA */}
        <div className="w-32 flex justify-end pointer-events-auto">
          <button
            onClick={() => scrollTo("contact")}
            className="text-xs sm:text-sm transition hover:opacity-60 text-white/90"
          >
            Let&apos;s talk
          </button>
        </div>
      </div>
    </header>
  );
}