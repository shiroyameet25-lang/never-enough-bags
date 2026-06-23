import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import bag1 from "@/assets/float-bag-1.png";
import bag2 from "@/assets/float-bag-2.png";
import bag3 from "@/assets/float-bag-3.png";

function Particles() {
  const dots = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 6,
        duration: 8 + Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.5,
      })),
    [],
  );
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
      {/* Layered atmospheric gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,oklch(0.28_0.04_75/0.55),transparent_55%),radial-gradient(ellipse_at_75%_85%,oklch(0.35_0.06_30/0.35),transparent_60%),linear-gradient(180deg,oklch(0.10_0.005_60)_0%,oklch(0.06_0.005_60)_100%)]" />

      {/* Spotlight that follows cursor subtly */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx,50%) var(--my,40%), rgba(201,169,110,0.18), transparent 60%)",
        }}
        onMouseMove={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.setProperty("--mx", `${e.clientX}px`);
          el.style.setProperty("--my", `${e.clientY}px`);
        }}
      />

      {/* Geometric rings */}
      <motion.div
        className="absolute -right-40 -top-40 w-[640px] h-[640px] rounded-full border border-champagne/15"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        style={{ y: yFar }}
      >
        <div className="absolute inset-12 rounded-full border border-champagne/10" />
        <div className="absolute inset-28 rounded-full border border-champagne/5" />
      </motion.div>
      <motion.div
        className="absolute -left-32 bottom-[-180px] w-[520px] h-[520px] rounded-full border border-ivory/5"
        animate={{ rotate: -360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        style={{ y: yFar }}
      />

      {/* Blurred color orbs */}
      <motion.div
        style={{ y: yMid }}
        className="absolute top-1/4 left-[8%] w-72 h-72 rounded-full blur-3xl opacity-40"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,oklch(0.76_0.07_80/0.6),transparent_70%)]" />
      </motion.div>
      <motion.div
        style={{ y: yNear }}
        className="absolute bottom-10 right-[6%] w-80 h-80 rounded-full blur-3xl opacity-30"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle,oklch(0.7_0.12_25/0.7),transparent_70%)]" />
      </motion.div>

      {/* Particles */}
      <Particles />

      {/* Floating 3D bags */}
      <FloatingBag
        src={bag1}
        className="right-[-4%] top-[8%] w-[42vw] max-w-[520px] min-w-[280px]"
        rotate={-8}
        delay={0.4}
        yRange={26}
        parallaxY={yMid}
        mouseX={smx}
        mouseY={smy}
        depth={1.4}
      />
      <FloatingBag
        src={bag2}
        className="left-[-6%] bottom-[6%] w-[34vw] max-w-[420px] min-w-[220px]"
        rotate={6}
        delay={0.7}
        yRange={20}
        parallaxY={yNear}
        mouseX={smx}
        mouseY={smy}
        depth={0.9}
      />
      <FloatingBag
        src={bag3}
        className="right-[14%] bottom-[10%] w-[22vw] max-w-[280px] min-w-[160px] hidden md:block"
        rotate={-4}
        delay={1}
        yRange={16}
        parallaxY={yFar}
        mouseX={smx}
        mouseY={smy}
        depth={0.6}
      />

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
