import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X, ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useCart, updateQty, removeFromCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Cart — NEEVA BAGS" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, count } = useCart();
  const shipping = 0;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <Layout>
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-5 mb-4">
            <span className="gold-divider" /><span className="tracking-luxe text-champagne-deep">Your Selection</span><span className="gold-divider" />
          </div>
          <h1 className="text-display text-5xl">Shopping Bag</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-display text-3xl italic text-muted-foreground mb-6">Your bag is empty</p>
            <Link to="/" className="btn-gold inline-flex items-center gap-3">
              Discover Pieces <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-6 pb-6 border-b border-border">
                  <Link to="/products/$id" params={{ id: product.id }} className="shrink-0 w-32 h-40 bg-muted overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} width={200} height={250} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div>
                        <div className="tracking-luxe text-champagne-deep mb-1">{product.brand}</div>
                        <Link to="/products/$id" params={{ id: product.id }} className="text-display text-xl text-noir hover:text-champagne-deep">{product.name}</Link>
                        <div className="text-xs text-muted-foreground mt-1">{product.brand} · Medium</div>
                      </div>
                      <button onClick={() => removeFromCart(product.id)} className="text-muted-foreground hover:text-noir" aria-label="Remove">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-6">
                      <div className="inline-flex items-center border border-border">
                        <button onClick={() => updateQty(product.id, qty - 1)} className="w-10 h-10 flex items-center justify-center hover:bg-muted"><Minus className="w-3 h-3" /></button>
                        <span className="w-10 text-center text-sm">{qty}</span>
                        <button onClick={() => updateQty(product.id, qty + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-muted"><Plus className="w-3 h-3" /></button>
                      </div>
                      <div className="text-display text-xl">{formatINR(product.price * qty)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-secondary p-8 h-fit lg:sticky lg:top-28">
              <h2 className="text-display text-2xl mb-6">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({count} items)</span><span>{formatINR(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-champagne-deep">Complimentary</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{formatINR(tax)}</span></div>
              </div>
              <div className="border-t border-border my-5" />
              <div className="flex justify-between items-baseline mb-8">
                <span className="tracking-luxe">Total</span>
                <span className="text-display text-3xl">{formatINR(total)}</span>
              </div>
              <Link to="/checkout" className="btn-noir w-full text-center block mb-3">Proceed to Checkout</Link>
              <Link to="/" className="block text-center text-sm tracking-wider text-muted-foreground hover:text-noir mt-4">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
