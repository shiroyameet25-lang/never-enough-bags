import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { GoldDivider } from "@/components/Divider";
import { useWishlist } from "@/lib/cart-store";
import { PRODUCTS } from "@/lib/products";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — NEEVA BAGS" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { ids } = useWishlist();
  const items = PRODUCTS.filter((p) => ids.includes(p.id));
  return (
    <Layout>
      <section className="py-16 bg-background text-center">
        <GoldDivider label="Saved for Later" />
        <h1 className="text-display text-5xl mt-6">Your Wishlist</h1>
      </section>
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-display text-2xl italic text-muted-foreground mb-6">No saved pieces yet.</p>
              <Link to="/" className="btn-gold inline-block">Discover Pieces</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
