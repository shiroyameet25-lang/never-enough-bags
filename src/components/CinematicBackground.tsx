import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo } from "react";

function seeded(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fixed, full-viewport cinematic background: layered gradients, chrome rings,
 * glassmorphism orbs, and soft particles with subtle mouse parallax.
 * Rendered behind all page content (z-0), pointer-events-none.
 */
export function CinematicBackground() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 40, damping: 20 });
  const smy = useSpring(my, { stiffness: 40, damping: 20 });

  const px1 = useTransform(smx, (v) => v * 20);
  const py1 = useTransform(smy, (v) => v * 20);
  const px2 = useTransform(smx, (v) => v * -35);
  const py2 = useTransform(smy, (v) => v * -35);
  const px3 = useTransform(smx, (v) => v * 55);
  const py3 = useTransform(smy, (v) => v * 55);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const particles = useMemo(() => {
    const r = seeded(9271);
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: r() * 100,
      top: r() * 100,
      size: r() * 2.4 + 0.6,
      delay: r() * 8,
      duration: 10 + r() * 12,
      opacity: 0.2 + r() * 0.5,
    }));
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 0%, oklch(0.22 0.03 75 / 0.55), transparent 55%)," +
          "radial-gradient(ellipse at 85% 90%, oklch(0.20 0.02 260 / 0.45), transparent 60%)," +
          "linear-gradient(180deg, oklch(0.08 0.005 60) 0%, oklch(0.05 0.005 60) 55%, oklch(0.07 0.008 260) 100%)",
      }}
    >
      {/* film-grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* soft platinum sweep */}
      <div className="absolute inset-x-0 top-0 h-[45vh] bg-[linear-gradient(180deg,oklch(0.75_0.03_80/0.06),transparent)]" />

      {/* glass orbs */}
      <motion.div
        style={{ x: px1, y: py1 }}
        className="absolute -top-32 -left-24 w-[38rem] h-[38rem] rounded-full blur-3xl opacity-40"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,oklch(0.76_0.07_80/0.55),transparent_70%)]" />
      </motion.div>
      <motion.div
        style={{ x: px2, y: py2 }}
        className="absolute top-1/3 right-[-10rem] w-[42rem] h-[42rem] rounded-full blur-3xl opacity-35"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,oklch(0.55_0.10_260/0.45),transparent_70%)]" />
      </motion.div>
      <motion.div
        style={{ x: px3, y: py3 }}
        className="absolute bottom-[-12rem] left-1/3 w-[36rem] h-[36rem] rounded-full blur-3xl opacity-30"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,oklch(0.65_0.09_25/0.4),transparent_70%)]" />
      </motion.div>

      {/* chrome rings */}
      <motion.div
        style={{ x: px1, y: py1 }}
        className="absolute -right-40 top-20 w-[46rem] h-[46rem] rounded-full border border-champagne/15"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, oklch(0.85 0.06 85 / 0.35) 60deg, transparent 140deg, oklch(0.9 0.02 260 / 0.25) 240deg, transparent 320deg)",
            WebkitMask:
              "radial-gradient(circle, transparent 68%, black 69%, black 71%, transparent 72%)",
            mask: "radial-gradient(circle, transparent 68%, black 69%, black 71%, transparent 72%)",
          }}
        />
        <div className="absolute inset-16 rounded-full border border-ivory/8" />
        <div className="absolute inset-32 rounded-full border border-champagne/8" />
      </motion.div>
      <motion.div
        style={{ x: px2, y: py2 }}
        className="absolute -left-32 bottom-[-10rem] w-[36rem] h-[36rem] rounded-full border border-ivory/8"
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 90deg, transparent 0deg, oklch(0.9 0.02 260 / 0.2) 80deg, transparent 200deg)",
            WebkitMask:
              "radial-gradient(circle, transparent 70%, black 71%, black 72.5%, transparent 74%)",
            mask: "radial-gradient(circle, transparent 70%, black 71%, black 72.5%, transparent 74%)",
          }}
        />
      </motion.div>

      {/* floating glass tiles */}
      <motion.div
        style={{ x: px3, y: py3 }}
        animate={{ rotate: [0, 6, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[22%] right-[18%] w-40 h-56 rounded-2xl border border-ivory/15"
      >
        <div className="w-full h-full rounded-2xl bg-[linear-gradient(135deg,oklch(1_0_0/0.08),oklch(1_0_0/0.02))] backdrop-blur-md" />
      </motion.div>
      <motion.div
        style={{ x: px1, y: py1 }}
        animate={{ rotate: [0, -8, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[18%] left-[12%] w-32 h-32 rounded-full border border-champagne/25"
      >
        <div className="w-full h-full rounded-full bg-[linear-gradient(135deg,oklch(0.76_0.07_80/0.12),transparent)] backdrop-blur-md" />
      </motion.div>

      {/* soft particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            background: "oklch(0.9 0.04 85)",
            boxShadow: "0 0 10px oklch(0.85 0.06 85 / 0.6)",
          }}
          animate={{ y: [0, -60, 0], opacity: [p.opacity, p.opacity * 0.25, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,oklch(0.04_0_0/0.55)_100%)]" />
    </div>
  );
}
