"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const photos = [
  "/images/1.webp",
  "/images/2.webp",
  "/images/3.webp",
  "/images/4.webp",
  "/images/5.webp",
  "/images/6.webp",
];

type TrailImage = {
  id: number;
  src: string;
  x: number;
  y: number;
  rotation: number;
};

export default function ImageTrail() {
  const [images, setImages] = useState<TrailImage[]>([]);

  const lastPoint = useRef({ x: 0, y: 0 });
  const id = useRef(0);

  useEffect(() => {
    const hero = document.getElementById("hero");

    if (!hero) return;

    const handleMove = (e: PointerEvent) => {
      const rect = hero.getBoundingClientRect();

      const x = e.clientX;
      const y = e.clientY;

      if (
        x < rect.left ||
        x > rect.right ||
        y < rect.top ||
        y > rect.bottom
      ) {
        return;
      }

      const distance = Math.hypot(
        x - lastPoint.current.x,
        y - lastPoint.current.y
      );

      if (distance < 35) return;

      lastPoint.current = { x, y };

      const image: TrailImage = {
        id: id.current++,
        src: photos[Math.floor(Math.random() * photos.length)],
        x,
        y,
        rotation: (Math.random() - 0.5) * 16,
      };

      setImages((prev) => [...prev, image].slice(-10));

      setTimeout(() => {
        setImages((prev) => prev.filter((i) => i.id !== image.id));
      }, 350);
    };

    hero.addEventListener("pointermove", handleMove);

    return () => {
      hero.removeEventListener("pointermove", handleMove);
    };
  }, []);

  return (
    <AnimatePresence>
      {images.map((image) => (
        <motion.div
          key={image.id}
          initial={{
            opacity: 0,
            scale: 0.65,
            rotate: image.rotation - 6,
          }}
          
          animate={{
            opacity: 1,
            scale: 1,
            rotate: image.rotation,
          }}
          
          exit={{
            opacity: 0,
            scale: 0.75,
          }}
          
          transition={{
            scale: {
              type: "spring",
              stiffness: 380,
              damping: 18,
              mass: 0.6,
            },
            rotate: {
              type: "spring",
              stiffness: 280,
              damping: 20,
            },
            opacity: {
              duration: 0.15,
            },
          }}
          className="fixed pointer-events-none z-30 overflow-hidden rounded-xl shadow-2xl"
          style={{
            left: image.x,
            top: image.y,
            width: 200,
            height: 200,
            rotate: image.rotation,
            translateX: "-50%",
            translateY: "-50%",
          }}
        >
          <Image
            src={image.src}
            alt=""
            fill
            className="object-cover"
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
