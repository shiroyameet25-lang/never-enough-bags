import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Hero3DScene = lazy(() =>
  import("@/components/Hero3DScene").then((m) => ({ default: m.Hero3DScene })),
);

export function LuxeHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 600], [0, 80]);
  const contentOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mq.matches);
    }
  }, []);

  const show3D = mounted && !isMobile && !reducedMotion;

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden bg-noir text-ivory"
    >
      {/* Deep base */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,oklch(0.12_0.01_75/0.6),transparent_60%),linear-gradient(180deg,oklch(0.06_0.005_60)_0%,oklch(0.04_0.005_260)_100%)]" />

      {/* Real-time 3D luxury scene — desktop only, respects reduced-motion */}
      {show3D && (
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <Hero3DScene />
          </Suspense>
        </div>
      )}

      {/* Mobile / reduced-motion fallback: cinematic static gradient */}
      {mounted && !show3D && (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 30% 30%, oklch(0.30 0.05 75 / 0.55), transparent 65%)," +
              "radial-gradient(50% 45% at 75% 70%, oklch(0.25 0.08 260 / 0.4), transparent 70%)," +
              "linear-gradient(180deg, oklch(0.08 0.005 60), oklch(0.05 0.005 260))",
          }}
        />
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
