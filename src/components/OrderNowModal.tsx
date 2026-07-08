import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, AlertCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import type { Product } from "@/lib/products";
import { formatINR } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/use-auth";

const STORE_WHATSAPP = "918866965656";


type Props = {
  open: boolean;
  onClose: () => void;
  product: Product;
  defaultVariant?: string;
  defaultQty?: number;
};

type FormState = {
  fullName: string;
  mobile: string;
  whatsapp: string;
  sameAsMobile: boolean;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  quantity: number;
  variant: string;
  notes: string;
};

const initial: FormState = {
  fullName: "",
  mobile: "",
  whatsapp: "",
  sameAsMobile: true,
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  quantity: 1,
  variant: "",
  notes: "",
};

export function OrderNowModal({ open, onClose, product, defaultVariant, defaultQty }: Props) {
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const { user, loading: authLoading } = useAuth();


  useEffect(() => {
    if (open) {
      setForm({
        ...initial,
        quantity: defaultQty ?? 1,
        variant: defaultVariant ?? "",
      });
      setSubmitting(false);
    }
  }, [open, defaultVariant, defaultQty]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const total = useMemo(() => product.price * Math.max(1, form.quantity), [product.price, form.quantity]);

  const isValid =
    form.fullName.trim().length > 1 &&
    /^\d{10,13}$/.test(form.mobile.replace(/\D/g, "")) &&
    form.address.trim().length > 4 &&
    form.city.trim().length > 1 &&
    form.state.trim().length > 1 &&
    /^\d{4,8}$/.test(form.pincode.trim()) &&
    form.quantity >= 1;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    if (!user) {
      toast.error("Please sign in to place your order");
      return;
    }
    setSubmitting(true);

    const wa = form.sameAsMobile || !form.whatsapp.trim() ? form.mobile : form.whatsapp;
    const fullAddress = `${form.address.trim()}, ${form.city.trim()}, ${form.state.trim()}`;
    const landmark = [
      form.variant ? `Variant: ${form.variant}` : null,
      form.email ? `Email: ${form.email}` : null,
      !form.sameAsMobile && form.whatsapp ? `WhatsApp: ${wa}` : null,
      form.notes ? `Notes: ${form.notes}` : null,
    ].filter(Boolean).join(" | ") || "—";

    const subtotal = product.price * form.quantity;
    const paymentRef = `WA${Date.now().toString(36).toUpperCase()}`;

    // 1. Save order to database FIRST
    let orderId: string;
    try {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: form.fullName.trim(),
          mobile: form.mobile.trim(),
          address: fullAddress,
          pincode: form.pincode.trim(),
          landmark,
          items: [{
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            qty: form.quantity,
            variant: form.variant || null,
            image_url: product.imageUrl,
          }],
          subtotal,
          tax: 0,
          total: subtotal,
          payment_status: "whatsapp_pending",
          payment_reference: paymentRef,
          fulfillment_status: "processing",
        })
        .select("id")
        .single();
      if (error) throw error;
      orderId = data.id;
    } catch (err) {
      setSubmitting(false);
      const msg = err instanceof Error ? err.message : "Failed to save your order";
      toast.error(`${msg}. Please try again.`);
      return;
    }

    // 2. Only after DB save succeeds, open WhatsApp
    const lines = [
      "🛍️ *New Purse Order*",
      `Order ID: ${orderId.slice(0, 8).toUpperCase()}`,
      "",
      "*Product Details*",
      `• Product: ${product.name}`,
      `• Brand: ${product.brand}`,
      `• Price: ₹${product.price.toLocaleString("en-IN")}`,
      `• Quantity: ${form.quantity}`,
      form.variant ? `• Variant: ${form.variant}` : null,
      `• Total: ₹${subtotal.toLocaleString("en-IN")}`,
      "",
      "*Customer Details*",
      `• Name: ${form.fullName}`,
      `• Mobile: ${form.mobile}`,
      `• WhatsApp: ${wa}`,
      form.email ? `• Email: ${form.email}` : null,
      "",
      "*Delivery Address*",
      form.address,
      `${form.city}, ${form.state} - ${form.pincode}`,
      form.notes ? "" : null,
      form.notes ? "*Special Instructions*" : null,
      form.notes || null,
      "",
      product.imageUrl ? `Product Image: ${product.imageUrl}` : null,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${STORE_WHATSAPP}?text=${text}`;

    toast.success("Order saved! Opening WhatsApp…");
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitting(false);
    onClose();
  };



  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-noir/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto bg-ivory text-noir border border-champagne/40 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.55)]"
          >
            <div className="sticky top-0 z-10 bg-ivory/95 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
              <div>
                <div className="tracking-luxe text-champagne-deep text-xs">Exclusive Order</div>
                <h2 className="text-display text-2xl">Complete Your Order</h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-champagne"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-[1fr_1.2fr] gap-0">
              {/* Order summary */}
              <aside className="p-6 bg-noir text-ivory md:sticky md:top-[73px] md:self-start">
                <div className="aspect-[4/5] bg-noir/40 overflow-hidden mb-5 border border-champagne/20">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  ) : null}
                </div>
                <div className="tracking-luxe text-champagne text-xs mb-1">{product.brand}</div>
                <h3 className="text-display text-xl mb-4 leading-tight">{product.name}</h3>
                <div className="space-y-2 text-sm border-t border-champagne/20 pt-4">
                  <Row k="Price" v={formatINR(product.price)} />
                  {form.variant && <Row k="Variant" v={form.variant} />}
                  <Row k="Quantity" v={String(form.quantity)} />
                  <div className="h-px bg-champagne/20 my-3" />
                  <div className="flex items-center justify-between">
                    <span className="tracking-luxe text-champagne">Total</span>
                    <span className="text-display text-2xl text-champagne">{formatINR(total)}</span>
                  </div>
                </div>
                <p className="text-[11px] text-ivory/60 mt-4 font-light">
                  Confirming will open WhatsApp with your order pre-filled. Just press Send.
                </p>
              </aside>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Field label="Full Name *">
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    className={inp}
                    placeholder="e.g. Aanya Sharma"
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Mobile Number *">
                    <input
                      required
                      inputMode="tel"
                      value={form.mobile}
                      onChange={(e) => update("mobile", e.target.value)}
                      className={inp}
                      placeholder="10-digit mobile"
                    />
                  </Field>
                  <Field label="WhatsApp Number">
                    <input
                      value={form.sameAsMobile ? form.mobile : form.whatsapp}
                      disabled={form.sameAsMobile}
                      onChange={(e) => update("whatsapp", e.target.value)}
                      className={`${inp} disabled:opacity-60`}
                      placeholder="Same as mobile"
                    />
                    <label className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={form.sameAsMobile}
                        onChange={(e) => update("sameAsMobile", e.target.checked)}
                        className="accent-champagne-deep"
                      />
                      Same as mobile number
                    </label>
                  </Field>
                </div>
                <Field label="Email (optional)">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inp}
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="Full Delivery Address *">
                  <textarea
                    required
                    rows={2}
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className={`${inp} resize-none`}
                    placeholder="House / Flat, Street, Landmark"
                  />
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="City *">
                    <input required value={form.city} onChange={(e) => update("city", e.target.value)} className={inp} />
                  </Field>
                  <Field label="State *">
                    <input required value={form.state} onChange={(e) => update("state", e.target.value)} className={inp} />
                  </Field>
                  <Field label="PIN Code *">
                    <input
                      required
                      inputMode="numeric"
                      value={form.pincode}
                      onChange={(e) => update("pincode", e.target.value.replace(/\D/g, "").slice(0, 8))}
                      className={inp}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Quantity *">
                    <input
                      required
                      type="number"
                      min={1}
                      value={form.quantity}
                      onChange={(e) => update("quantity", Math.max(1, Number(e.target.value) || 1))}
                      className={inp}
                    />
                  </Field>
                  <Field label="Color / Variant">
                    <input
                      value={form.variant}
                      onChange={(e) => update("variant", e.target.value)}
                      className={inp}
                      placeholder="e.g. Champagne Gold"
                    />
                  </Field>
                </div>
                <Field label="Special Instructions">
                  <textarea
                    rows={2}
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    className={`${inp} resize-none`}
                    placeholder="Gift wrap, delivery preference, etc."
                  />
                </Field>

                {!authLoading && !user && (
                  <div className="flex items-start gap-3 border border-champagne/40 bg-blush/20 p-3 text-xs">
                    <AlertCircle className="w-4 h-4 text-champagne-deep shrink-0 mt-0.5" />
                    <p className="text-noir/80">
                      Please{" "}
                      <Link to="/account" className="underline text-champagne-deep font-medium">
                        sign in
                      </Link>{" "}
                      to place your order. Your order will be saved to your account before WhatsApp opens.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isValid || submitting || !user}
                  className="btn-gold w-full mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving order…
                    </>
                  ) : (
                    <>Place Order & Open WhatsApp</>
                  )}
                </button>
                <p className="text-[11px] text-center text-muted-foreground font-light">
                  Your order is saved to the admin panel first, then WhatsApp opens with the full details pre-filled.
                </p>

              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const inp =
  "w-full bg-transparent border-b border-border py-2.5 focus:border-champagne outline-none text-sm placeholder:text-muted-foreground/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="tracking-luxe text-[11px] text-champagne-deep block mb-1">{label}</span>
      {children}
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ivory/70">{k}</span>
      <span className="text-ivory">{v}</span>
    </div>
  );
}
