export default function Navbar() {
    return (
      <header className="fixed top-0 left-0 z-50 w-full">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-10 py-8">
  
          {/* Logo */}
          <div className="w-32 text-sm font-medium">
            ryanarnab
          </div>
  
          {/* Navigation */}
          <nav className="flex-1">
            <ul className="flex justify-center gap-8 text-sm">
              <li className="cursor-pointer transition hover:opacity-60">
                Home
              </li>
              <li className="cursor-pointer transition hover:opacity-60">
                Works
              </li>
              <li className="cursor-pointer transition hover:opacity-60">
                About
              </li>
            </ul>
          </nav>
  
          {/* CTA */}
          <div className="w-32 flex justify-end">
            <button className="text-sm transition hover:opacity-60">
              Let's talk
            </button>
          </div>
  
        </div>
      </header>
    );
  }