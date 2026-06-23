import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { GoldDivider } from "@/components/Divider";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/new-arrivals")({
  head: () => ({
    meta: [
      { title: "New Arrivals — NEEVA BAGS" },
      { name: "description", content: "The latest luxury designer handbags, just arrived at NEEVA BAGS." },
    ],
  }),
  component: () => (
    <Layout>
      <section className="py-20 bg-noir text-ivory text-center">
        <GoldDivider label="Just In" />
        <h1 className="text-display text-5xl md:text-6xl mt-6 mb-4">New Arrivals</h1>
        <p className="text-ivory/60 max-w-xl mx-auto font-light px-6">Freshly unboxed and authenticated — this season's most coveted pieces.</p>
      </section>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        <div className="text-center mt-12">
          <Link to="/brands" className="btn-outline-noir">Browse by Brand</Link>
        </div>
      </section>
    </Layout>
  ),
});
