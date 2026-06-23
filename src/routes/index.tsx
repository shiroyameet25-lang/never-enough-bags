import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Shield, Package, Truck, BadgeIndianRupee, Star, Instagram } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { GoldDivider } from "@/components/Divider";
import { PRODUCTS, BRANDS } from "@/lib/products";
import heroBag from "@/assets/hero-bag.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEEVA BAGS — Luxury Designer Handbags in India" },
      { name: "description", content: "Where Luxury Meets Identity. Authenticated designer handbags from Gucci, Louis Vuitton, Dior, Prada, Hermès, Chanel and more." },
      { property: "og:title", content: "NEEVA BAGS — Where Luxury Meets Identity" },
      { property: "og:description", content: "Authenticated luxury designer handbags, delivered across India." },
    ],
  }),
  component: HomePage,
});

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section ref={ref} className="relative h-[92vh] min-h-[640px] overflow-hidden bg-noir">
      {/* Background image with parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={heroBag}
          alt="Luxury designer handbag"
          width={1920}
          height={1280}
          className="w-full h-[120%] object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-noir via-noir/50 to-noir/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-noir/40" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex items-center"
      >
        <div className="max-w-7xl w-full mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="tracking-luxe text-champagne mb-6"
            >
              · The Autumn Edit 2026 ·
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-display text-ivory text-[clamp(3rem,8vw,6.5rem)] leading-[0.95] mb-4"
            >
              Where Luxury<br />
              Meets <span className="shimmer-gold italic">Identity</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-ivory/70 text-lg font-light leading-relaxed max-w-md mb-10"
            >
              Curated designer handbags from the world's most coveted maisons —
              authenticated, hand-finished, delivered to your door.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/new-arrivals" className="btn-gold inline-flex items-center gap-3">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/brands" className="inline-flex items-center gap-3 px-10 py-4 border border-ivory/40 text-ivory tracking-luxe hover:border-champagne hover:text-champagne transition-all">
                Explore Brands
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-ivory/60 text-[0.65rem] tracking-[0.4em]"
      >
        <div className="flex flex-col items-center gap-3">
          SCROLL
          <div className="w-px h-12 bg-gradient-to-b from-champagne to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

function BrandStrip() {
  // duplicate for seamless marquee
  const items = [...BRANDS, ...BRANDS];
  return (
    <section className="py-24 bg-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-12 text-center">
        <GoldDivider label="Maisons We Carry" />
        <h2 className="text-display text-4xl md:text-5xl mt-6 mb-4">Shop by Brand</h2>
        <p className="text-muted-foreground max-w-xl mx-auto font-light">
          Fifteen of the world's most desirable maisons, curated for the discerning Indian collector.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-ivory to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-ivory to-transparent z-10" />

        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {items.map((brand, i) => (
            <Link
              key={`${brand.slug}-${i}`}
              to="/brands/$brand"
              params={{ brand: brand.slug }}
              className="text-display text-3xl md:text-4xl text-noir/40 hover:text-champagne-deep transition-colors tracking-[0.15em] italic"
            >
              {brand.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewArrivals() {
  const items = PRODUCTS.slice(0, 8);
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-14">
          <GoldDivider label="The New Edit" />
          <h2 className="text-display text-4xl md:text-5xl mt-6 mb-4">New Arrivals</h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-light">
            Pieces just landed — limited stock from this season's most coveted releases.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        <div className="text-center mt-16">
          <Link to="/new-arrivals" className="btn-outline-noir inline-flex items-center gap-3">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

const VALUES = [
  { icon: Shield, title: "Authenticated", desc: "Every piece individually verified by our in-house authentication team." },
  { icon: Package, title: "Premium Packaging", desc: "Hand-wrapped in dust bag, gold-foiled box and silk ribbon." },
  { icon: Truck, title: "Pan-India Delivery", desc: "Insured express shipping. Free across India on every order." },
  { icon: BadgeIndianRupee, title: "COD Available", desc: "Pay on delivery with confidence. Inspect before you pay." },
];

function WhyUs() {
  return (
    <section className="py-24 bg-noir text-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-5 py-2 mb-6">
            <span className="gold-divider" />
            <span className="tracking-luxe text-champagne">The Neeva Promise</span>
            <span className="gold-divider" />
          </div>
          <h2 className="text-display text-4xl md:text-5xl">Why Choose NEEVA BAGS</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-champagne/40 flex items-center justify-center">
                <v.icon className="w-6 h-6 text-champagne" />
              </div>
              <h3 className="text-display text-2xl mb-3 text-ivory">{v.title}</h3>
              <p className="text-ivory/60 font-light text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const REVIEWS = [
  {
    name: "Aanya Mehta",
    city: "Mumbai",
    text: "The Chanel mini I purchased arrived in pristine condition with the authenticity card. Truly the best luxury shopping experience in India.",
  },
  {
    name: "Priya Kapoor",
    city: "Delhi",
    text: "I was hesitant about buying online but NEEVA exceeded every expectation. The packaging alone made me feel like royalty.",
  },
  {
    name: "Sneha Reddy",
    city: "Bangalore",
    text: "Three orders in and I'm still impressed. They sourced a Dior Saddle I'd been hunting for months. Customer service is unmatched.",
  },
];

function Testimonials() {
  return (
    <section className="py-24 bg-blush/40">
      <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
        <GoldDivider label="In Her Words" />
        <h2 className="text-display text-4xl md:text-5xl mt-6 mb-16">Loved by Collectors</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="bg-ivory p-8 text-left"
            >
              <div className="flex gap-1 mb-5 text-champagne-deep">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-display text-xl italic leading-relaxed text-noir mb-6">"{r.text}"</p>
              <div className="tracking-luxe text-champagne-deep">{r.name} <span className="text-muted-foreground">— {r.city}</span></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const images = PRODUCTS.slice(0, 6);
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mb-12 text-center">
        <GoldDivider label="@neevabags" />
        <h2 className="text-display text-4xl md:text-5xl mt-6 mb-4 flex items-center justify-center gap-3">
          <Instagram className="w-8 h-8 text-champagne-deep" /> Follow Us
        </h2>
        <p className="text-muted-foreground font-light">Tagged styling moments from our community.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 px-2">
        {images.map((p) => (
          <a key={p.id} href="#" className="block aspect-square overflow-hidden group">
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              width={400}
              height={400}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </a>
        ))}
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <Layout>
      <Hero />
      <BrandStrip />
      <NewArrivals />
      <WhyUs />
      <Testimonials />
      <Gallery />
    </Layout>
  );
}
