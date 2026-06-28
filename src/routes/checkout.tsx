import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { GoldDivider } from "@/components/Divider";
import { useCart, clearCart } from "@/lib/cart-store";
import { formatINR } from "@/lib/products";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — NEEVA BAGS" }] }),
  component: CheckoutPage,
});

type FormState = {
  customer_name: string;
  mobile: string;
  address: string;
  pincode: string;
  landmark: string;
};

const EMPTY: FormState = { customer_name: "", mobile: "", address: "", pincode: "", landmark: "" };

function CheckoutPage() {
  const { items, subtotal } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [showPay, setShowPay] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  useEffect(() => {
    if (!loading && !user) {
      toast.info("Please sign in to place your order");
      navigate({ to: "/account" });
    }
  }, [loading, user, navigate]);

  if (placedOrderId) return <SuccessView orderId={placedOrderId} />;

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const validate = (): string | null => {
    if (form.customer_name.trim().length < 2) return "Please enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) return "Enter a valid 10-digit mobile number";
    if (form.address.trim().length < 10) return "Please enter your complete address";
    if (!/^\d{6}$/.test(form.pincode.trim())) return "Enter a valid 6-digit pincode";
    if (form.landmark.trim().length < 2) return "Please mention a nearby landmark";
    return null;
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setShowPay(true);
  };

  const placeOrder = async (paymentRef: string) => {
    if (!user) throw new Error("Not signed in");
    const payload = {
      user_id: user.id,
      customer_name: form.customer_name.trim(),
      mobile: form.mobile.trim(),
      address: form.address.trim(),
      pincode: form.pincode.trim(),
      landmark: form.landmark.trim(),
      items: items.map(({ product, qty }) => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        qty,
        image_url: product.imageUrl,
      })),
      subtotal,
      tax,
      total,
      payment_status: "paid_online",
      payment_reference: paymentRef,
      fulfillment_status: "processing" as const,
    };
    const { data, error } = await supabase
      .from("orders")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw error;
    clearCart();
    setPlacedOrderId(data.id);
  };

  return (
    <Layout>
      <section className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <div className="text-center mb-12">
          <GoldDivider label="Secure Checkout" />
          <h1 className="text-display text-5xl mt-6">Checkout</h1>
        </div>

        <form onSubmit={handleProceed} className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="text-display text-2xl mb-6">Delivery Details</h2>
              <div className="space-y-5">
                <Field label="Full Name">
                  <input required value={form.customer_name} onChange={(e) => set("customer_name", e.target.value)} maxLength={100} className="form-input" />
                </Field>
                <Field label="Mobile Number">
                  <input required type="tel" inputMode="numeric" pattern="[6-9][0-9]{9}" maxLength={10} value={form.mobile} onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))} className="form-input" placeholder="10-digit mobile" />
                </Field>
                <Field label="Complete Address">
                  <textarea required rows={3} value={form.address} onChange={(e) => set("address", e.target.value)} maxLength={500} className="form-input resize-none" placeholder="House / Flat no, Street, Area, City, State" />
                </Field>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Pincode">
                    <input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={form.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))} className="form-input" placeholder="6-digit pincode" />
                  </Field>
                  <Field label="Exact Location / Landmark">
                    <input required value={form.landmark} onChange={(e) => set("landmark", e.target.value)} maxLength={150} className="form-input" placeholder="Near…" />
                  </Field>
                </div>
              </div>
            </div>

            <div className="bg-blush/30 border border-champagne/30 p-5 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-champagne-deep shrink-0 mt-0.5" />
              <p className="text-sm font-light text-noir/80">
                Online payment only. Cash on Delivery is not available. Your order will be confirmed instantly after a successful payment.
              </p>
            </div>
          </div>

          <div className="bg-secondary p-8 h-fit lg:sticky lg:top-28">
            <h2 className="text-display text-2xl mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6 max-h-72 overflow-y-auto pr-2">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 text-sm">
                  <img src={product.imageUrl} alt="" width={50} height={60} className="w-12 h-15 object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <div className="line-clamp-1">{product.name}</div>
                    <div className="text-xs text-muted-foreground">Qty {qty}</div>
                  </div>
                  <div>{formatINR(product.price * qty)}</div>
                </div>
              ))}
              {items.length === 0 && <p className="text-sm text-muted-foreground">Your cart is empty.</p>}
            </div>
            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-champagne-deep">Free</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>{formatINR(tax)}</span></div>
            </div>
            <div className="flex justify-between items-baseline border-t border-border mt-4 pt-4 mb-6">
              <span className="tracking-luxe">Total</span>
              <span className="text-display text-3xl">{formatINR(total)}</span>
            </div>
            <button type="submit" disabled={items.length === 0} className="btn-gold w-full disabled:opacity-50">
              Pay {formatINR(total)} & Place Order
            </button>
          </div>
        </form>
      </section>

      {showPay && (
        <PaymentModal
          amount={total}
          onClose={() => setShowPay(false)}
          onSuccess={async (ref) => {
            try {
              await placeOrder(ref);
              setShowPay(false);
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Failed to save order");
            }
          }}
        />
      )}
    </Layout>
  );
}

function PaymentModal({ amount, onClose, onSuccess }: { amount: number; onClose: () => void; onSuccess: (ref: string) => void | Promise<void> }) {
  const [method, setMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [processing, setProcessing] = useState(false);
  const [upi, setUpi] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });

  const handlePay = async () => {
    // Simple client-side input checks for the simulated gateway
    if (method === "upi" && !/^[\w.-]+@[\w.-]+$/.test(upi.trim())) {
      toast.error("Enter a valid UPI ID (e.g. name@bank)");
      return;
    }
    if (method === "card") {
      if (card.number.replace(/\s/g, "").length < 12) return toast.error("Enter a valid card number");
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return toast.error("Expiry must be MM/YY");
      if (!/^\d{3,4}$/.test(card.cvv)) return toast.error("Invalid CVV");
    }
    setProcessing(true);
    // Simulated gateway processing — replace with Razorpay handler when keys are added
    await new Promise((r) => setTimeout(r, 1800));
    const ref = `NB${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    await onSuccess(ref);
    // Component unmounts on success
  };

  return (
    <div className="fixed inset-0 z-[90] bg-noir/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-ivory w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <div className="text-xs tracking-luxe text-champagne-deep">Secure Payment</div>
            <div className="text-display text-xl">{formatINR(amount)}</div>
          </div>
          <button onClick={onClose} disabled={processing} className="p-2 hover:text-champagne-deep disabled:opacity-30" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2 text-xs tracking-luxe">
            {(["upi", "card", "netbanking"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                disabled={processing}
                className={`py-2 border ${method === m ? "border-champagne bg-blush/30 text-noir" : "border-border text-muted-foreground"}`}
              >
                {m === "upi" ? "UPI" : m === "card" ? "Card" : "Net Banking"}
              </button>
            ))}
          </div>

          {method === "upi" && (
            <Field label="UPI ID">
              <input value={upi} onChange={(e) => setUpi(e.target.value)} placeholder="yourname@upi" className="form-input" disabled={processing} />
            </Field>
          )}

          {method === "card" && (
            <div className="space-y-4">
              <Field label="Card Number">
                <input value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d ]/g, "").slice(0, 19) })} placeholder="0000 0000 0000 0000" className="form-input" disabled={processing} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry (MM/YY)">
                  <input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value.slice(0, 5) })} placeholder="MM/YY" className="form-input" disabled={processing} />
                </Field>
                <Field label="CVV">
                  <input value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="•••" className="form-input" disabled={processing} type="password" />
                </Field>
              </div>
              <Field label="Name on Card">
                <input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} className="form-input" disabled={processing} />
              </Field>
            </div>
          )}

          {method === "netbanking" && (
            <div className="text-sm font-light text-muted-foreground border border-dashed border-border p-4">
              You'll be redirected to your bank to complete the transaction.
            </div>
          )}

          <button
            type="button"
            onClick={handlePay}
            disabled={processing}
            className="btn-gold w-full inline-flex items-center justify-center gap-2"
          >
            {processing ? (<><Loader2 className="w-4 h-4 animate-spin" /> Processing payment…</>) : `Pay ${formatINR(amount)}`}
          </button>

          <p className="text-[10px] text-center text-muted-foreground tracking-luxe">
            Simulated gateway · 256-bit SSL · No real charge
          </p>
        </div>
      </div>
    </div>
  );
}

function SuccessView({ orderId }: { orderId: string }) {
  return (
    <Layout>
      <section className="py-24 max-w-xl mx-auto px-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-champagne/20 mb-6">
          <CheckCircle2 className="w-10 h-10 text-champagne-deep" />
        </div>
        <GoldDivider label="Payment Successful" />
        <h1 className="text-display text-5xl mt-6 mb-3">Order Placed!</h1>
        <p className="text-muted-foreground font-light mb-2">
          Your payment was successful and your order is now being processed.
        </p>
        <p className="text-sm text-muted-foreground mb-10">
          Order ID: <span className="text-champagne-deep tracking-luxe">{orderId.slice(0, 8).toUpperCase()}</span>
        </p>
        <div className="flex justify-center gap-3 flex-wrap">
          <Link to="/" className="btn-gold">Continue Shopping</Link>
          <Link to="/account" className="btn-outline-noir">View My Orders</Link>
        </div>
      </section>
    </Layout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="tracking-luxe text-xs text-champagne-deep mb-2 block">{label}</span>
      {children}
    </label>
  );
}
