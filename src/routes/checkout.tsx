import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { GoldDivider } from "@/components/Divider";
import { useCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/products";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — NEEVA BAGS" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [placed, setPlaced] = useState(false);
  const [payment, setPayment] = useState<"cod" | "online">("online");
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  if (placed) {
    return (
      <Layout>
        <section className="py-32 max-w-xl mx-auto px-6 text-center">
          <GoldDivider label="Order Confirmed" />
          <h1 className="text-display text-5xl mt-8 mb-4">Thank you</h1>
          <p className="text-muted-foreground font-light mb-2">Your order has been placed successfully.</p>
          <p className="text-muted-foreground font-light mb-10">Order ID: <span className="text-champagne-deep tracking-luxe">NB-2026-{Math.floor(Math.random() * 9000 + 1000)}</span></p>
          <Link to="/" className="btn-gold">Continue Shopping</Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <div className="text-center mb-12">
          <GoldDivider label="Almost There" />
          <h1 className="text-display text-5xl mt-6">Checkout</h1>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setPlaced(true); }}
          className="grid lg:grid-cols-3 gap-12"
        >
          {/* Shipping + Payment */}
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-display text-2xl mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Full Name" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none" />
                  <input required type="tel" placeholder="Phone" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none" />
                </div>
                <input required type="email" placeholder="Email" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none" />
                <input required placeholder="Address Line 1" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none" />
                <input placeholder="Address Line 2 (optional)" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none" />
                <div className="grid grid-cols-3 gap-4">
                  <input required placeholder="City" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none" />
                  <input required placeholder="State" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none" />
                  <input required placeholder="PIN Code" className="w-full bg-transparent border-b border-border py-3 focus:border-champagne outline-none" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-display text-2xl mb-6">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: "online", title: "Online Payment", desc: "UPI · Cards · Net Banking (Razorpay)" },
                  { id: "cod", title: "Cash on Delivery", desc: "Pay when your order arrives" },
                ].map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-start gap-4 p-5 border cursor-pointer transition-all ${
                      payment === p.id ? "border-champagne bg-blush/20" : "border-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={payment === p.id}
                      onChange={() => setPayment(p.id as "cod" | "online")}
                      className="mt-1 accent-noir"
                    />
                    <div>
                      <div className="tracking-luxe">{p.title}</div>
                      <div className="text-sm text-muted-foreground font-light mt-1">{p.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-secondary p-8 h-fit lg:sticky lg:top-28">
            <h2 className="text-display text-2xl mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 text-sm">
                  <img src={product.imageUrl} alt="" width={50} height={60} className="w-12 h-15 object-cover bg-muted" />
                  <div className="flex-1">
                    <div className="line-clamp-1">{product.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {qty}</div>
                  </div>
                  <div>{formatINR(product.price * qty)}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-champagne-deep">Free</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GST</span><span>{formatINR(tax)}</span></div>
            </div>
            <div className="flex justify-between items-baseline border-t border-border mt-4 pt-4 mb-6">
              <span className="tracking-luxe">Total</span>
              <span className="text-display text-3xl">{formatINR(total)}</span>
            </div>
            <button type="submit" disabled={items.length === 0} className="btn-gold w-full disabled:opacity-50">
              Place Order
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
}
