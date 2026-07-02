import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import bag1 from "@/assets/float-bag-1.png";
import bag2 from "@/assets/float-bag-2.png";
import bag3 from "@/assets/float-bag-3.png";

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Particles() {
  const dots = useMemo(() => {
    const rand = mulberry32(1337);
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: rand() * 3 + 1,
      delay: rand() * 6,
      duration: 8 + rand() * 10,
      opacity: 0.3 + rand() * 0.5,
    }));
  }, []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-champagne"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            boxShadow: "0 0 12px var(--champagne)",
          }}
          animate={{ y: [0, -40, 0], opacity: [d.opacity, d.opacity * 0.3, d.opacity] }}
          transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}


function FloatingBag({
  src,
  className,
  rotate = 0,
  delay = 0,
  yRange = 30,
  parallaxY,
  mouseX,
  mouseY,
  depth = 1,
}: {
  src: string;
  className: string;
  rotate?: number;
  delay?: number;
  yRange?: number;
  parallaxY: MotionValue<number>;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  depth?: number;
}) {
  const tx = useTransform(mouseX, (v) => v * 30 * depth);
  const ty = useTransform(mouseY, (v) => v * 30 * depth);
  return (
    <motion.div
      className={`absolute ${className} pointer-events-none`}
      style={{ y: parallaxY, x: tx, translateY: ty }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.7, rotate: rotate - 10 }}
        animate={{ opacity: 1, scale: 1, rotate }}
        transition={{ duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          animate={{ y: [0, -yRange, 0], rotate: [rotate, rotate + 3, rotate] }}
          transition={{ duration: 7 + delay, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 40px 50px rgba(0,0,0,0.55)) drop-shadow(0 0 30px rgba(201,169,110,0.25))" }}
        >
          <img src={src} alt="" width={520} height={520} className="w-full h-auto select-none" draggable={false} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function LuxeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const yFar = useTransform(scrollY, [0, 800], [0, 120]);
  const yMid = useTransform(scrollY, [0, 800], [0, 220]);
  const yNear = useTransform(scrollY, [0, 800], [0, 340]);
  const contentY = useTransform(scrollY, [0, 600], [0, 80]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 20 });
  const smy = useSpring(my, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mx.set((e.clientX / w - 0.5) * 2);
      my.set((e.clientY / h - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden bg-noir text-ivory"
    >
      {/* Deep base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,oklch(0.12_0.01_75/0.6),transparent_60%),linear-gradient(180deg,oklch(0.06_0.005_60)_0%,oklch(0.04_0.005_260)_100%)]" />

      {/* Real-time 3D luxury scene */}
      {mounted && (
        <div className="absolute inset-0">
          <Hero3DScene />
        </div>
      )}

      {/* Animated mesh gradient blend */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-60"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage:
            "radial-gradient(40% 60% at 20% 30%, rgba(201,169,110,0.18), transparent 60%), radial-gradient(50% 60% at 80% 70%, rgba(180,190,230,0.12), transparent 65%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Soft glow behind heading for readability */}
      <div
        aria-hidden
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[70vw] h-[70vh] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(0,0,0,0.55), transparent 70%)",
        }}
      />

      {/* Vignette + bottom fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

      {/* Centerpiece content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 h-full min-h-[100svh] flex items-center"
      >
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-10 pt-28 pb-20">
          <div className="max-w-3xl">
            {/* Glass eyebrow pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-champagne/30 bg-ivory/5 backdrop-blur-xl"
            >
              <Sparkles className="w-3.5 h-3.5 text-champagne" />
              <span className="tracking-luxe text-champagne text-[0.65rem]">The Autumn Edit · 2026</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-display text-ivory text-[clamp(3rem,9vw,7.5rem)] leading-[0.92] mb-6"
            >
              Where Luxury
              <br />
              Meets <span className="shimmer-gold italic">Identity</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-ivory/70 text-lg md:text-xl font-light leading-relaxed max-w-lg mb-12"
            >
              Step inside India's private showroom for Gucci, Chanel, Dior, Louis Vuitton
              and the world's most coveted maisons — authenticated, hand-finished, delivered.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <Link to="/new-arrivals" className="btn-gold inline-flex items-center gap-3 group">
                Enter the Showroom
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/brands"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full border border-ivory/25 bg-ivory/5 backdrop-blur-xl text-ivory tracking-luxe text-[0.7rem] hover:border-champagne hover:text-champagne transition-all"
              >
                Explore Maisons
              </Link>
            </motion.div>

            {/* Glass stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="grid grid-cols-3 gap-3 md:gap-5 max-w-xl"
            >
              {[
                { k: "15+", v: "Maisons" },
                { k: "100%", v: "Authentic" },
                { k: "Pan‑India", v: "Delivery" },
              ].map((s) => (
                <div
                  key={s.v}
                  className="relative rounded-xl border border-ivory/10 bg-ivory/[0.04] backdrop-blur-xl px-4 py-4 md:px-5 md:py-5 overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />
                  <div className="text-display text-2xl md:text-3xl text-ivory">{s.k}</div>
                  <div className="tracking-luxe text-ivory/50 mt-1 text-[0.6rem]">{s.v}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Bottom fade into next section */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-noir z-10 pointer-events-none" />

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-ivory/60 text-[0.6rem] tracking-[0.4em] flex flex-col items-center gap-3"
      >
        SCROLL
        <motion.div
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-champagne to-transparent origin-top"
        />
      </motion.div>
    </section>
  );
}
