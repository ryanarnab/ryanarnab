"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform
} from "framer-motion";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useScrollProgress } from "../scroll/ScrollProvider";

type Dot = {
  id: number;
  x: number;
  y: number;
};

const DOT_SIZE = 2;
const SPACING = 34;

/*
  Size of the cursor interaction area
*/
const RADIUS = 170;

/*
  How far particles get pushed away
*/
const FORCE = 95;

/*
  Normal visibility of every dot
*/
const BASE_OPACITY = 0.40;

const SPRING = {
  stiffness: 150,
  damping: 16,
  mass: 0.5,
};

export default function BackgroundParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollProgress = useScrollProgress();

  const mouseX = useMotionValue(
    Number.POSITIVE_INFINITY
  );

  const mouseY = useMotionValue(
    Number.POSITIVE_INFINITY
  );

  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    const createDots = () => {
      if (!containerRef.current) return;

      const rect =
        containerRef.current.getBoundingClientRect();

      const newDots: Dot[] = [];

      let id = 0;

      for (
        let y = 0;
        y < rect.height;
        y += SPACING
      ) {
        for (
          let x = 0;
          x < rect.width;
          x += SPACING
        ) {
          newDots.push({
            id: id++,
            x: x + (Math.random() - 0.5) * SPACING * 0.8,
            y: y + (Math.random() - 0.5) * SPACING * 0.8,
          });
        }
      }

      setDots(newDots);
    };

    createDots();

    const observer = new ResizeObserver(createDots);

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  type ParticleProps = {
    dot: Dot;
    mouseX: typeof mouseX;
    mouseY: typeof mouseY;
  };

  function Particle({
    dot,
    mouseX,
    mouseY,
  }: ParticleProps) {
    const x = useSpring(0, SPRING);
    const y = useSpring(0, SPRING);

    const opacity = useSpring(
      BASE_OPACITY,
      SPRING
    );

    const idleX = useMotionValue(0);
    const idleY = useMotionValue(0);

    const combinedX = useTransform(
      [x, idleX],
      ([mouseOffset, idleOffset]) =>
        Number(mouseOffset) + Number(idleOffset)
    );
    
    const combinedY = useTransform(
      [y, idleY],
      ([mouseOffset, idleOffset]) =>
        Number(mouseOffset) + Number(idleOffset)
    );

    useEffect(() => {
      let animationFrame: number;
    
      const seed = dot.id * 0.73;
    
      const animate = (time: number) => {
        const t = time * 0.0005;
    
        // Very subtle organic space-like drift
        const driftX =
          Math.sin(t + seed) * 15 +
          Math.sin(t * 0.50 + seed * 2.1) * 5;

        const driftY =
          Math.cos(t * 0.8 + seed) * 10 +
          Math.sin(t * 0.35 + seed * 1.7) * 5;
    
        idleX.set(driftX);
        idleY.set(driftY);
    
        animationFrame = requestAnimationFrame(animate);
      };
    
      animationFrame = requestAnimationFrame(animate);
    
      return () => {
        cancelAnimationFrame(animationFrame);
      };
    }, [dot.id, idleX, idleY]);
    
    useEffect(() => {
      const update = () => {
        const mx = mouseX.get();
        const my = mouseY.get();

        /*
          Cursor outside hero:
          smoothly return home.
        */
        if (
          !Number.isFinite(mx) ||
          !Number.isFinite(my)
        ) {
          x.set(0);
          y.set(0);
          opacity.set(BASE_OPACITY);

          return;
        }

        const dx = dot.x - mx;
        const dy = dot.y - my;

        const distance = Math.sqrt(
          dx * dx + dy * dy
        );

        /*
          Outside interaction radius:
          stay completely normal.
        */
        if (distance >= RADIUS) {
          x.set(0);
          y.set(0);
          opacity.set(BASE_OPACITY);

          return;
        }

        /*
          1 at cursor centre.
          0 at edge of radius.

          Smoothstep makes the transition
          much less harsh.
        */
        const rawStrength =
          1 - distance / RADIUS;

        const strength =
          rawStrength *
          rawStrength *
          (3 - 2 * rawStrength);

        /*
          Direction away from cursor.
        */
        const safeDistance = Math.max(
          distance,
          0.001
        );

        const directionX =
          dx / safeDistance;

        const directionY =
          dy / safeDistance;

        /*
          Stronger push near cursor.
        */
        const push = Math.pow(strength, 1.35) * FORCE;

        /*
          Slight sideways turbulence makes the particles
          flow around the cursor instead of only moving
          directly away from it.
        */
        const tangentX = -directionY;
        const tangentY = directionX;
        
        const turbulence =
          Math.sin(dot.id * 1.73) *
          strength *
          18;
        
        x.set(
          directionX * push +
          tangentX * turbulence
        );
        
        y.set(
          directionY * push +
          tangentY * turbulence
        );

        /*
          Fade particles closest to cursor.

          This creates the clean empty zone.
        */
        const newOpacity =
          BASE_OPACITY *
          Math.max(
            0,
            1 - strength * 1.4
          );

        opacity.set(newOpacity);
      };

      const unsubX =
        mouseX.on("change", update);

      const unsubY =
        mouseY.on("change", update);

      return () => {
        unsubX();
        unsubY();
      };
    }, [
      dot,
      mouseX,
      mouseY,
      x,
      y,
      opacity,
    ]);

    return (
      <motion.div
        className="absolute rounded-full bg-white"
        style={{
          left: dot.x,
          top: dot.y,
          width: DOT_SIZE,
          height: DOT_SIZE,
          x: combinedX,
          y: combinedY,
          opacity,
          willChange: "transform, opacity",
        }}
      />
    );
  }

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!containerRef.current) return;
  
      const rect =
        containerRef.current.getBoundingClientRect();
  
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
  
      if (!isInside) {
        mouseX.set(Number.POSITIVE_INFINITY);
        mouseY.set(Number.POSITIVE_INFINITY);
        return;
      }
  
      mouseX.set(event.clientX - rect.left);
      mouseY.set(event.clientY - rect.top);
    };
  
    window.addEventListener("pointermove", handleMove, {
      passive: true,
    });
  
    return () => {
      window.removeEventListener("pointermove", handleMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {dots.map((dot) => (
        <Particle
          key={dot.id}
          dot={dot}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </div>
  );
}