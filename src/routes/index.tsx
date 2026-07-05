import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Package, Truck, BadgeIndianRupee, Star, Instagram } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { GoldDivider } from "@/components/Divider";
import { LuxeHero } from "@/components/LuxeHero";
import { CinematicBackground } from "@/components/CinematicBackground";
import { LuxeLoader } from "@/components/LuxeLoader";
import { BusinessBanner } from "@/components/BusinessBanner";
import { BRANDS, productsQueryOptions } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEEVA BAGS — Luxury Designer Handbags in India" },
      { name: "description", content: "Where Luxury Meets Identity. Authenticated designer handbags from Gucci, Louis Vuitton, Dior, Prada, Hermès, Chanel and more." },
      { property: "og:title", content: "NEEVA BAGS — Where Luxury Meets Identity" },
      { property: "og:description", content: "Authenticated luxury designer handbags, delivered across India." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions),
  component: HomePage,
});

function BrandStrip() {
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
  const { data: products = [] } = useQuery(productsQueryOptions);
  const items = products.slice(0, 8);
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
        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Catalog launching soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
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
  { name: "Aanya Mehta", city: "Mumbai", text: "The Chanel mini I purchased arrived in pristine condition with the authenticity card. Truly the best luxury shopping experience in India." },
  { name: "Priya Kapoor", city: "Delhi", text: "I was hesitant about buying online but NEEVA exceeded every expectation. The packaging alone made me feel like royalty." },
  { name: "Sneha Reddy", city: "Bangalore", text: "Three orders in and I'm still impressed. They sourced a Dior Saddle I'd been hunting for months. Customer service is unmatched." },
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
  const { data: products = [] } = useQuery(productsQueryOptions);
  const images = products.slice(0, 6);
  if (images.length === 0) return null;
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
              src={p.imageUrl}
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
      <LuxeLoader />
      <div className="relative">
        <CinematicBackground />
        <div className="relative z-10">
          <LuxeHero />
          <BrandStrip />
          <NewArrivals />
          <WhyUs />
          <Testimonials />
          <Gallery />
        </div>
      </div>
    </Layout>
  );
}

