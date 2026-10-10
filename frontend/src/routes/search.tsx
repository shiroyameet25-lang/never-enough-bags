import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { productsSearchQueryOptions } from "@/lib/products";

const searchSchema = z.object({ q: z.string().optional().default("") });

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  component: SearchPage,
  errorComponent: ({ error }) => (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-24 text-center text-noir/70">{error.message}</div>
    </Layout>
  ),
  notFoundComponent: () => (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">Not found</div>
    </Layout>
  ),
  head: () => ({
    meta: [
      { title: "Search · NEEVA BAGS" },
      { name: "description", content: "Search luxury handbags by name, brand, color and more." },
    ],
  }),
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const [term, setTerm] = useState(q);

  // Debounce input → URL
  useEffect(() => {
    const t = setTimeout(() => {
      if (term !== q) navigate({ search: { q: term }, replace: true });
    }, 250);
    return () => clearTimeout(t);
  }, [term, q, navigate]);

  useEffect(() => setTerm(q), [q]);

  const { data: products, isLoading, isFetching } = useQuery(productsSearchQueryOptions(q));

  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-12 pb-20">
        <h1 className="text-display text-4xl md:text-5xl text-noir mb-8">Search</h1>

        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-noir/50" />
          <input
            autoFocus
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search by name, brand, color, type…"
            className="w-full pl-11 pr-12 py-4 bg-ivory border border-champagne/60 focus:border-champagne-deep outline-none tracking-luxe text-sm"
          />
          {isFetching && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-champagne-deep animate-spin" />
          )}
        </div>

        <div className="mt-10">
          {isLoading ? (
            <div className="flex items-center justify-center py-24 text-noir/60">
              <Loader2 className="w-6 h-6 animate-spin mr-3" /> Loading products…
            </div>
          ) : !products || products.length === 0 ? (
            <div className="py-24 text-center text-noir/60 tracking-luxe">
              No products found{q ? ` for "${q}"` : ""}.
            </div>
          ) : (
            <>
              <p className="text-xs tracking-luxe text-noir/60 mb-6">
                {products.length} {products.length === 1 ? "result" : "results"}
                {q && ` for "${q}"`}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}
