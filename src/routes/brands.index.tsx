import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { GoldDivider } from "@/components/Divider";
import { BRANDS } from "@/lib/products";

export const Route = createFileRoute("/brands")({
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                to="/brands/$brand"
                params={{ brand: brand.slug }}
                className="aspect-[4/3] bg-card flex items-center justify-center border border-border hover:border-champagne hover:shadow-[var(--shadow-gold-glow)] transition-all duration-500 group"
              >
                <div className="text-center px-4">
                  <div className="text-display italic text-2xl md:text-3xl text-noir group-hover:text-champagne-deep transition-colors">
                    {brand.name}
                  </div>
                  <div className="tracking-luxe text-champagne-deep/0 group-hover:text-champagne-deep/80 transition-all mt-2 text-[0.6rem]">
                    Explore →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
