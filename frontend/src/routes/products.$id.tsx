import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { Heart, Minus, Plus, Shield, Truck, RotateCcw, Star, ChevronRight, ChevronLeft } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { OrderNowModal } from "@/components/OrderNowModal";
import { formatINR, productQueryOptions, productsQueryOptions } from "@/lib/products";
import { addToCart, toggleWishlist, useWishlist } from "@/lib/cart-store";


export const Route = createFileRoute("/products/$id")({
  loader: async ({ params, context }) => {
    const product = await context.queryClient.ensureQueryData(productQueryOptions(params.id));
    if (!product) throw notFound();
    context.queryClient.ensureQueryData(productsQueryOptions);
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.product
      ? [
          { title: `${loaderData.product.name} — ${loaderData.product.brand} | NEEVA BAGS` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — NEEVA BAGS` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.imageUrl },
        ]
      : [],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <Layout>
      <div className="py-32 text-center">
        <h1 className="text-display text-5xl mb-4">Product not found</h1>
        <Link to="/" className="text-champagne-deep tracking-luxe">← Home</Link>
      </div>
    </Layout>
  ),
});

const SIZES = ["Small", "Medium", "Large"];

function ProductPage() {
  const { id } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQueryOptions(id));
  const { data: all = [] } = useQuery(productsQueryOptions);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("Medium");
  const [activeIdx, setActiveIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const { has } = useWishlist();

  if (!product) return null;
  const liked = has(product.id);
  const related = useMemo(() => all.filter((p) => p.id !== product.id).slice(0, 4), [all, product.id]);
  const oos = !product.inStock;
  const images = useMemo(
    () => (product.imageUrls.length > 0 ? product.imageUrls : (product.imageUrl ? [product.imageUrl] : [])),
    [product.imageUrls, product.imageUrl]
  );
  const safeIdx = Math.min(activeIdx, Math.max(0, images.length - 1));
  const mainImage = images[safeIdx];

  const handleAdd = () => {
    if (oos) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 pb-4 flex items-center gap-2 text-xs text-muted-foreground tracking-wider">
        <Link to="/" className="hover:text-champagne-deep">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/brands/$brand" params={{ brand: product.brandSlug }} className="hover:text-champagne-deep">{product.brand}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-noir">{product.name}</span>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-10 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-muted overflow-hidden group">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                width={1000}
                height={1250}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-display italic text-xl">
                {product.brand}
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveIdx((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ivory/90 backdrop-blur flex items-center justify-center hover:bg-ivory"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIdx((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ivory/90 backdrop-blur flex items-center justify-center hover:bg-ivory"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className={`w-2 h-2 rounded-full transition-all ${i === safeIdx ? "bg-noir w-6" : "bg-noir/40"}`}
                      aria-label={`Image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((url, i) => (
                <button
                  key={`${url}-${i}`}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`aspect-square bg-muted overflow-hidden border-2 transition-all ${
                    i === safeIdx ? "border-champagne" : "border-transparent hover:border-border"
                  }`}
                >
                  <img src={url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="tracking-luxe text-champagne-deep mb-3">{product.brand}</div>
          <h1 className="text-display text-4xl md:text-5xl text-noir mb-4 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex gap-0.5 text-champagne-deep">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-xs text-muted-foreground">(124 reviews)</span>
          </div>

          <div className="flex items-center gap-4 mt-6 mb-4">
            <span className="text-3xl text-display text-noir">{formatINR(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
                <span className="tracking-luxe bg-noir text-ivory px-2 py-1">
                  Save {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              </>
            )}
          </div>

          <div className="mb-8 text-sm">
            {oos ? (
              <span className="tracking-luxe text-destructive">Out of Stock</span>
            ) : (
              <span className="tracking-luxe text-green-700">In Stock</span>
            )}
          </div>

          <p className="text-muted-foreground font-light leading-relaxed mb-8">{product.description}</p>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="tracking-luxe">Size</span>
              <button className="text-xs underline text-muted-foreground hover:text-champagne-deep">Size Guide</button>
            </div>
            <div className="flex gap-3">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-6 py-3 text-xs tracking-[0.15em] uppercase border transition-all ${
                    size === s ? "bg-noir text-ivory border-noir" : "border-border hover:border-champagne"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="tracking-luxe mb-3">Quantity</div>
            <div className="inline-flex items-center border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-muted"><Minus className="w-4 h-4" /></button>
              <span className="w-12 text-center text-noir">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-muted"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <button onClick={handleAdd} disabled={oos} className="btn-gold flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              {oos ? "Out of Stock" : added ? "✓ Added to Cart" : "Add to Cart"}
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="w-14 h-14 border border-border flex items-center justify-center hover:border-champagne"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-noir" : ""}`} />
            </button>
          </div>
          <button
            onClick={() => !oos && setOrderOpen(true)}
            disabled={oos}
            className="btn-noir w-full mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Order Now via WhatsApp
          </button>
          {orderOpen && (
            <OrderNowModal
              open={orderOpen}
              onClose={() => setOrderOpen(false)}
              product={product}
              defaultVariant={size}
              defaultQty={qty}
            />
          )}


          <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
            {[
              { icon: Shield, label: "Authenticated" },
              { icon: Truck, label: "Free Shipping" },
              { icon: RotateCcw, label: "Easy Returns" },
            ].map((a) => (
              <div key={a.label} className="text-center">
                <a.icon className="w-5 h-5 mx-auto mb-2 text-champagne-deep" />
                <div className="text-xs tracking-wider">{a.label}</div>
              </div>
            ))}
          </div>

          {product.dimensions && (
            <div className="mt-8">
              <div className="tracking-luxe text-champagne-deep mb-1">Dimensions</div>
              <p className="text-sm text-muted-foreground font-light">{product.dimensions}</p>
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <h2 className="text-display text-3xl md:text-4xl text-center mb-12">You May Also Love</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}
