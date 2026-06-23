import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Plus, Shield, Truck, RotateCcw, Star, ChevronRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCTS, formatINR } from "@/lib/products";
import { addToCart, toggleWishlist, useWishlist } from "@/lib/cart-store";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = PRODUCTS.find((p) => p.id === params.id);
    if (!product) throw notFound();
    const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
    return { product, related };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.name} — ${loaderData?.product.brand} | NEEVA BAGS` },
      { name: "description", content: loaderData?.product.description },
      { property: "og:title", content: `${loaderData?.product.name} — NEEVA BAGS` },
      { property: "og:description", content: loaderData?.product.description },
      { property: "og:image", content: loaderData?.product.image },
    ],
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
const COLORS = [
  { name: "Noir", hex: "#0A0A0A" },
  { name: "Ivory", hex: "#FAF8F5" },
  { name: "Champagne", hex: "#C9A96E" },
  { name: "Blush", hex: "#E8C4B8" },
];

function ProductPage() {
  const { product, related } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("Medium");
  const [color, setColor] = useState(COLORS[0].name);
  const [added, setAdded] = useState(false);
  const { has } = useWishlist();
  const liked = has(product.id);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 pb-4 flex items-center gap-2 text-xs text-muted-foreground tracking-wider">
        <Link to="/" className="hover:text-champagne-deep">Home</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/brands/$brand" params={{ brand: product.brandSlug }} className="hover:text-champagne-deep">{product.brand}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-noir">{product.name}</span>
      </div>

      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-10 grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-muted overflow-hidden group">
            <img
              src={product.image}
              alt={product.name}
              width={1000}
              height={1250}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[product.image, product.image, product.image, product.image].map((src, i) => (
              <div key={i} className={`aspect-square bg-muted overflow-hidden cursor-pointer border-2 ${i === 0 ? "border-champagne" : "border-transparent"}`}>
                <img src={src} alt="" width={200} height={200} loading="lazy" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="tracking-luxe text-champagne-deep mb-3">{product.brand}</div>
          <h1 className="text-display text-4xl md:text-5xl text-noir mb-4 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mb-2">
            <div className="flex gap-0.5 text-champagne-deep">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <span className="text-xs text-muted-foreground">(124 reviews)</span>
          </div>

          <div className="flex items-center gap-4 mt-6 mb-8">
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

          <p className="text-muted-foreground font-light leading-relaxed mb-8">{product.description}</p>

          {/* Size */}
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

          {/* Color */}
          <div className="mb-8">
            <div className="tracking-luxe mb-3">Color: <span className="text-champagne-deep">{color}</span></div>
            <div className="flex gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  style={{ background: c.hex }}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    color === c.name ? "border-champagne ring-2 ring-champagne ring-offset-2" : "border-border"
                  }`}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="mb-8">
            <div className="tracking-luxe mb-3">Quantity</div>
            <div className="inline-flex items-center border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-muted"><Minus className="w-4 h-4" /></button>
              <span className="w-12 text-center text-noir">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-muted"><Plus className="w-4 h-4" /></button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <button onClick={handleAdd} className="btn-gold flex-1 flex items-center justify-center">
              {added ? "✓ Added to Cart" : "Add to Cart"}
            </button>
            <Link to="/cart" onClick={() => addToCart(product, qty)} className="btn-noir flex-1 text-center">
              Buy Now
            </Link>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="w-14 h-14 border border-border flex items-center justify-center hover:border-champagne"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-noir" : ""}`} />
            </button>
          </div>

          {/* Assurances */}
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

          {/* Details */}
          <div className="mt-8 space-y-4">
            <div>
              <div className="tracking-luxe text-champagne-deep mb-1">Material</div>
              <p className="text-sm text-muted-foreground font-light">{product.material}</p>
            </div>
            <div>
              <div className="tracking-luxe text-champagne-deep mb-1">Dimensions</div>
              <p className="text-sm text-muted-foreground font-light">{product.dimensions}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <h2 className="text-display text-3xl md:text-4xl text-center mb-12">You May Also Love</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {(related as typeof PRODUCTS).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>
    </Layout>
  );
}
