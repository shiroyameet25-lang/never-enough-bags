import { motion } from "framer-motion";
import bannerImg from "@/assets/business-banner.jpg";

export function BusinessBanner() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background via-blush/20 to-background">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden border border-champagne/30 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] bg-noir"
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne to-transparent z-10" />
          <img
            src={bannerImg}
            alt="NEEVA BAGS — Where Luxury Meets Identity"
            loading="lazy"
            className="w-full h-auto object-contain block"
          />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-champagne to-transparent z-10" />
        </motion.div>
      </div>
    </section>
  );
}
