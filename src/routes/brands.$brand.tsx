import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { BRANDS, productsQueryOptions } from "@/lib/products";

export const Route = createFileRoute("/brands/$brand")({
  loader: ({ params, context }) => {
    const brand = BRANDS.find((b) => b.slug === params.brand);
    if (!brand) throw notFound();
    context.queryClient.ensureQueryData(productsQueryOptions);
    return { brand };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.brand.name} Handbags — NEEVA BAGS` },
      { name: "description", content: `Shop authentic ${loaderData?.brand.name} luxury handbags in India.` },
      { property: "og:title", content: `${loaderData?.brand.name} — NEEVA BAGS` },
    ],
  }),
  component: BrandPage,
  notFoundComponent: () => (
    <Layout>
      <div className="py-32 text-center">
        <h1 className="text-display text-5xl mb-4">Brand not found</h1>
        <Link to="/brands" className="text-champagne-deep tracking-luxe">← All Brands</Link>
      </div>
    </Layout>
  ),
});

const TYPES = ["all", "tote", "sling", "clutch", "shoulder", "bucket"] as const;
const PRICE_RANGES = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under ₹18k", min: 0, max: 18000 },
  { label: "₹18k–₹25k", min: 18000, max: 25000 },
  { label: "Above ₹25k", min: 25000, max: Infinity },
];

function BrandPage() {
  const { brand } = Route.useLoaderData();
  const { data: allProducts = [] } = useQuery(productsQueryOptions);
  const [type, setType] = useState<(typeof TYPES)[number]>("all");
  const [priceIdx, setPriceIdx] = useState(0);

  const products = useMemo(() => {
    const inBrand = allProducts.filter((p) => p.brandSlug === brand.slug);
    return inBrand.filter((p) => {
      if (type !== "all" && p.type !== type) return false;
      const r = PRICE_RANGES[priceIdx];
      if (p.price < r.min || p.price > r.max) return false;
      return true;
    });
  }, [brand.slug, type, priceIdx, allProducts]);

  return (
    <Layout>
      <section className="relative py-28 bg-gradient-to-br from-noir via-noir to-[oklch(0.18_0.02_60)] text-ivory text-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,var(--champagne)_0%,transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto px-6">
          <Link to="/brands" className="tracking-luxe text-champagne/70 hover:text-champagne mb-6 inline-block">
            ← All Brands
          </Link>
          <h1 className="text-display italic text-6xl md:text-8xl mb-4 shimmer-gold">{brand.name}</h1>
          <p className="text-ivory/60 font-light max-w-md mx-auto">
            The complete {brand.name} collection — authenticated, curated, ready to ship.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap gap-6 mb-12 pb-6 border-b border-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="tracking-luxe text-champagne-deep mr-2">Type:</span>
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-all ${
                    type === t ? "bg-noir text-ivory border-noir" : "border-border text-noir hover:border-champagne"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="tracking-luxe text-champagne-deep mr-2">Price:</span>
              {PRICE_RANGES.map((p, i) => (
                <button
                  key={p.label}
                  onClick={() => setPriceIdx(i)}
                  className={`px-4 py-2 text-xs tracking-[0.15em] uppercase border transition-all ${
                    priceIdx === i ? "bg-noir text-ivory border-noir" : "border-border text-noir hover:border-champagne"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No {brand.name} pieces match these filters yet.
              <button onClick={() => { setType("all"); setPriceIdx(0); }} className="text-champagne-deep underline ml-2">Reset</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
