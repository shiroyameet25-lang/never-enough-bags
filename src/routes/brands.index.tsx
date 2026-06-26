import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { GoldDivider } from "@/components/Divider";
import { BRANDS } from "@/lib/products";
import { BrandLogo } from "@/components/BrandLogo";

export const Route = createFileRoute("/brands/")({
  head: () => ({
    meta: [
      { title: "Designer Brands — NEEVA BAGS" },
      { name: "description", content: "Shop luxury handbags by brand. Gucci, Louis Vuitton, Dior, Prada, Hermès, Chanel and more." },
      { property: "og:title", content: "Designer Brands — NEEVA BAGS" },
    ],
  }),
  component: BrandsPage,
});

function BrandsPage() {
  return (
    <Layout>
      <section className="pt-20 pb-16 bg-noir text-ivory text-center">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-center gap-5 mb-6">
            <span className="gold-divider" /><span className="tracking-luxe text-champagne">The Maisons</span><span className="gold-divider" />
          </div>
          <h1 className="text-display text-5xl md:text-6xl mb-4">Shop by Brand</h1>
          <p className="text-ivory/70 font-light">Fifteen of the world's most desired luxury maisons — curated for India.</p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-border border border-border">
            {BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                to="/brands/$brand"
                params={{ brand: brand.slug }}
                className="relative aspect-[4/3] bg-ivory flex items-center justify-center px-6 hover:bg-card hover:shadow-[var(--shadow-gold-glow)] transition-all duration-500 group overflow-hidden"
              >
                <span className="absolute top-3 left-3 right-3 h-px bg-champagne/0 group-hover:bg-champagne/60 transition-colors duration-500" />
                <span className="absolute bottom-3 left-3 right-3 h-px bg-champagne/0 group-hover:bg-champagne/60 transition-colors duration-500" />
                <BrandLogo name={brand.name} tagline={brand.tagline} style={brand.style} size="md" />
                <span className="absolute bottom-3 right-4 text-[0.55rem] tracking-[0.3em] uppercase text-champagne-deep opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
