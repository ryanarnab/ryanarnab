"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ScrollContext = createContext(0);

export function ScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const h = window.innerHeight;

      const p = Math.min(window.scrollY / h, 1);

      setProgress(p);
    };

    update();

    window.addEventListener("scroll", update);

    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <ScrollContext.Provider value={progress}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScrollProgress = () => useContext(ScrollContext);