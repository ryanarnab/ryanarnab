"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const images = [
  "/images/1.webp",
  "/images/2.webp",
  "/images/3.webp",
  "/images/4.webp",
  "/images/5.webp",
  "/images/6.webp",
];

export default function FloatingPreview() {
  const [mouse, setMouse] = useState({ x: -500, y: -500 });

  const [index, setIndex] = useState(0);

  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: PointerEvent) => {

      setMouse({
        x: e.clientX,
        y: e.clientY,
      });

      const dist = Math.hypot(
        e.clientX - last.current.x,
        e.clientY - last.current.y
      );

      if (dist > 140) {

        last.current = {
          x: e.clientX,
          y: e.clientY,
        };

        setIndex(i => (i + 1) % images.length);
      }
    };

    window.addEventListener("pointermove", move);

    return () =>
      window.removeEventListener("pointermove", move);

  }, []);

  return (
    <div
      className="pointer-events-none fixed z-40"
      style={{
        left: mouse.x + 24,
        top: mouse.y - 24,
        transform: "translate(-50%,-50%)",
      }}
    >
      <Image
        src={images[index]}
        alt=""
        width={220}
        height={280}
        className="rounded-xl object-cover"
      />
    </div>
  );
}