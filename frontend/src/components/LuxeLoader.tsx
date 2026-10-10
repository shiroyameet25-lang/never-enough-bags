import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export function LuxeLoader() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-noir"
        >
          {/* radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.25_0.04_75/0.5),transparent_60%)]" />

          {/* rotating chrome rings */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-40 h-40"
          >
            <motion.div
              className="absolute inset-0 rounded-full border border-champagne/50"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, var(--champagne) 90deg, transparent 180deg, var(--champagne) 270deg, transparent 360deg)",
                WebkitMask:
                  "radial-gradient(circle, transparent 63%, black 64%, black 66%, transparent 67%)",
                mask: "radial-gradient(circle, transparent 63%, black 64%, black 66%, transparent 67%)",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 rounded-full border border-ivory/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-display italic text-3xl shimmer-gold">NEEVA</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
