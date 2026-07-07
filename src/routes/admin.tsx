import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, Upload, X, LogOut, GripVertical, Package, ShoppingBag } from "lucide-react";
import { Layout } from "@/components/Layout";
import { GoldDivider } from "@/components/Divider";
import { supabase } from "@/integrations/supabase/client";
import {
  BRANDS,
  formatINR,
  productsQueryOptions,
  type Product,
} from "@/lib/products";
import { useAuth, useIsAdmin } from "@/lib/use-auth";

type FulfillmentStatus = "pending" | "processing" | "confirmed" | "shipped" | "delivered" | "cancelled";

type OrderItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  qty: number;
  image_url?: string;
};

type OrderRow = {
  id: string;
  created_at: string;
  customer_name: string;
  mobile: string;
  address: string;
  pincode: string;
  landmark: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  payment_status: string;
  payment_reference: string;
  fulfillment_status: FulfillmentStatus;
};


export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — NEEVA BAGS" }] }),
  component: AdminPage,
});

// Long-lived signed URL: 10 years
const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 365 * 10;

type FormState = {
  id?: string;
  name: string;
  brand: string;
  brand_slug: string;
  price: string;
  discount_price: string;
  description: string;
  in_stock: boolean;
  type: string;
  dimensions: string;
  badge: string;
  image_urls: string[];
};

const EMPTY_FORM: FormState = {
  name: "",
  brand: BRANDS[0].name,
  brand_slug: BRANDS[0].slug,
  price: "",
  discount_price: "",
  description: "",
  in_stock: true,
  type: "tote",
  dimensions: "",
  badge: "",
  image_urls: [],
};

function AdminPage() {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin(user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/account", replace: true });
  }, [loading, user, navigate]);

  if (loading || roleLoading) {
    return (
      <Layout>
        <div className="py-32 text-center text-muted-foreground">Loading…</div>
      </Layout>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <Layout>
        <section className="py-32 max-w-xl mx-auto px-6 text-center">
          <h1 className="text-display text-5xl mb-4">Restricted</h1>
          <p className="text-muted-foreground mb-8 font-light">
            This area is reserved for administrators.
          </p>
          <Link to="/" className="btn-outline-noir">← Back to Home</Link>
        </section>
      </Layout>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const { data: products = [], refetch } = useQuery(productsQueryOptions);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [editing, setEditing] = useState<FormState | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.brand.toLowerCase().includes(search.toLowerCase()),
      ),
    [products, search],
  );

  const handleDelete = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Product deleted");
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const startEdit = (p: Product) => {
    setEditing({
      id: p.id,
      name: p.name,
      brand: p.brand,
      brand_slug: p.brandSlug,
      price: String(p.originalPrice ?? p.price),
      discount_price: p.originalPrice ? String(p.price) : "",
      description: p.description,
      in_stock: p.inStock,
      type: p.type,
      dimensions: p.dimensions,
      badge: p.badge ?? "",
      image_urls: p.imageUrls,
    });
  };

  return (
    <Layout>
      <section className="py-12 bg-noir text-ivory">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <GoldDivider label="Admin" />
            <h1 className="text-display text-4xl md:text-5xl mt-4">Dashboard</h1>
            <p className="text-ivory/60 font-light mt-2">
              {tab === "products"
                ? `${products.length} ${products.length === 1 ? "piece" : "pieces"} in inventory`
                : "Customer orders & fulfillment"}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {tab === "products" && (
              <button onClick={() => setEditing({ ...EMPTY_FORM, image_urls: [] })} className="btn-gold inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            )}
            <button onClick={handleSignOut} className="border border-ivory/30 px-4 py-3 tracking-luxe text-xs hover:bg-ivory/10 inline-flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-8 flex gap-1 border-b border-ivory/10">
          {([
            { key: "products", label: "Products", Icon: ShoppingBag },
            { key: "orders", label: "Orders", Icon: Package },
          ] as const).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-2 px-5 py-3 text-xs tracking-luxe border-b-2 transition-colors ${
                tab === key ? "border-champagne text-champagne" : "border-transparent text-ivory/60 hover:text-ivory"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </section>

      {tab === "products" ? (
        <section className="py-10 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or brand…"
              className="w-full bg-transparent border-b border-border py-3 mb-8 focus:border-champagne outline-none"
            />

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border text-left text-xs tracking-luxe text-champagne-deep">
                    <th className="py-3 pr-4">Image</th>
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Brand</th>
                    <th className="py-3 pr-4">Price</th>
                    <th className="py-3 pr-4">Stock</th>
                    <th className="py-3 pr-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b border-border/60 hover:bg-muted/30">
                      <td className="py-3 pr-4">
                        {p.imageUrl ? (
                          <img src={p.imageUrl} alt="" className="w-14 h-16 object-cover bg-muted" />
                        ) : (
                          <div className="w-14 h-16 bg-muted flex items-center justify-center text-xs text-muted-foreground">N/A</div>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-sm font-medium">{p.name}</td>
                      <td className="py-3 pr-4 text-sm text-muted-foreground">{p.brand}</td>
                      <td className="py-3 pr-4 text-sm">
                        {formatINR(p.price)}
                        {p.originalPrice && (
                          <span className="text-muted-foreground line-through ml-2 text-xs">{formatINR(p.originalPrice)}</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-sm">
                        <span className={p.inStock ? "text-green-700" : "text-destructive"}>
                          {p.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <button onClick={() => startEdit(p)} className="p-2 hover:text-champagne-deep" aria-label="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p)} className="p-2 hover:text-destructive" aria-label="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <OrdersPanel />
      )}

      {editing && (
        <ProductForm
          state={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            refetch();
          }}
        />
      )}
    </Layout>
  );
}

const STATUS_OPTIONS: FulfillmentStatus[] = ["pending", "processing", "confirmed", "shipped", "delivered", "cancelled"];

function OrdersPanel() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<"all" | FulfillmentStatus>("all");
  const [orderSearch, setOrderSearch] = useState("");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as OrderRow[];
    },
  });

  const filtered = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.fulfillment_status !== statusFilter) return false;
      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        o.id.slice(0, 8).toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.mobile.toLowerCase().includes(q)
      );
    });
  }, [orders, statusFilter, orderSearch]);

  const updateStatus = async (id: string, status: FulfillmentStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ fulfillment_status: status })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Order marked ${status}`);
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order? This cannot be undone.")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Order deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
  };

  return (
    <section className="py-10 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <input
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            placeholder="Search by Order ID, name or mobile…"
            className="flex-1 min-w-[220px] bg-transparent border-b border-border py-2 focus:border-champagne outline-none text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="border border-border bg-transparent px-3 py-2 text-sm tracking-luxe capitalize"
          >
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          {filtered.length} of {orders.length} · Newest first
        </div>

        {isLoading ? (
          <p className="py-12 text-center text-muted-foreground">Loading orders…</p>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground font-light">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} onStatusChange={updateStatus} onDelete={deleteOrder} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function OrderCard({ order, onStatusChange, onDelete }: { order: OrderRow; onStatusChange: (id: string, s: FulfillmentStatus) => void | Promise<void>; onDelete: (id: string) => void | Promise<void> }) {
  const [open, setOpen] = useState(false);
  const date = new Date(order.created_at);
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="border border-border bg-card">
      <div className="grid md:grid-cols-[1fr_auto] gap-4 p-5 items-start">
        <div className="min-w-0">
          <div className="flex items-center flex-wrap gap-3 mb-2">
            <span className="text-xs tracking-luxe text-champagne-deep">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground">
              {date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </span>
            <span className="text-[10px] tracking-luxe px-2 py-0.5 bg-green-700 text-white">
              PAID ONLINE
            </span>
          </div>
          <div className="text-display text-xl mb-1">{order.customer_name}</div>
          <div className="text-sm text-muted-foreground">
            📞 <a href={`tel:${order.mobile}`} className="hover:text-noir">{order.mobile}</a> · {items.length} {items.length === 1 ? "item" : "items"}
          </div>
          <div className="text-sm font-light mt-2">
            {order.address}, <strong>{order.pincode}</strong>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Landmark: {order.landmark || "—"}
          </div>
          {order.payment_reference && (
            <div className="text-[10px] text-muted-foreground tracking-luxe mt-1">
              Txn: {order.payment_reference}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="text-display text-2xl">{formatINR(Number(order.total))}</div>
          <select
            value={order.fulfillment_status}
            onChange={(e) => onStatusChange(order.id, e.target.value as FulfillmentStatus)}
            className={`border border-border bg-transparent px-3 py-2 text-xs tracking-luxe ${
              order.fulfillment_status === "delivered" ? "text-green-700"
                : order.fulfillment_status === "shipped" ? "text-champagne-deep"
                : order.fulfillment_status === "cancelled" ? "text-destructive"
                : ""
            }`}
          >
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-xs tracking-luxe text-champagne-deep hover:underline"
          >
            {open ? "Hide items" : `View ${items.length} item${items.length === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-muted/20 px-5 py-4 space-y-2">
          {items.map((it, idx) => (
            <div key={`${it.id}-${idx}`} className="flex items-center gap-3 text-sm">
              {it.image_url ? (
                <img src={it.image_url} alt="" className="w-12 h-14 object-cover bg-muted" />
              ) : (
                <div className="w-12 h-14 bg-muted" />
              )}
              <div className="flex-1 min-w-0">
                <div className="line-clamp-1">{it.name}</div>
                <div className="text-xs text-muted-foreground">{it.brand} · Qty {it.qty}</div>
              </div>
              <div className="text-sm">{formatINR(Number(it.price) * it.qty)}</div>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex justify-between text-xs text-muted-foreground">
            <span>Subtotal {formatINR(Number(order.subtotal))} · GST {formatINR(Number(order.tax))}</span>
            <span className="text-noir tracking-luxe">Total {formatINR(Number(order.total))}</span>
          </div>
        </div>
      )}
    </div>
  );
}


async function uploadAndSign(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from("product-images")
    .createSignedUrl(path, SIGNED_URL_EXPIRY);
  if (signErr || !data) throw signErr ?? new Error("Failed to sign URL");
  return data.signedUrl;
}

function ProductForm({
  state,
  onClose,
  onSaved,
}: {
  state: FormState;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(state);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pasteUrl, setPasteUrl] = useState("");

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleBrand = (slug: string) => {
    const b = BRANDS.find((x) => x.slug === slug)!;
    setForm((f) => ({ ...f, brand: b.name, brand_slug: b.slug }));
  };

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const urls = await Promise.all(Array.from(files).map(uploadAndSign));
      setForm((f) => ({ ...f, image_urls: [...f.image_urls, ...urls] }));
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const addPastedUrl = () => {
    const u = pasteUrl.trim();
    if (!u) return;
    setForm((f) => ({ ...f, image_urls: [...f.image_urls, u] }));
    setPasteUrl("");
  };

  const removeImage = (idx: number) =>
    setForm((f) => ({ ...f, image_urls: f.image_urls.filter((_, i) => i !== idx) }));

  const moveImage = (idx: number, dir: -1 | 1) => {
    setForm((f) => {
      const arr = [...f.image_urls];
      const j = idx + dir;
      if (j < 0 || j >= arr.length) return f;
      [arr[idx], arr[j]] = [arr[j], arr[idx]];
      return { ...f, image_urls: arr };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const priceN = Number(form.price);
      const discountN = form.discount_price ? Number(form.discount_price) : null;
      if (!Number.isFinite(priceN) || priceN < 0) throw new Error("Invalid price");
      if (discountN != null && (!Number.isFinite(discountN) || discountN < 0 || discountN >= priceN))
        throw new Error("Discount price must be less than price");

      const payload = {
        name: form.name.trim(),
        brand: form.brand,
        brand_slug: form.brand_slug,
        price: priceN,
        discount_price: discountN,
        description: form.description.trim(),
        in_stock: form.in_stock,
        type: form.type,
        dimensions: form.dimensions.trim(),
        badge: form.badge || null,
        image_url: form.image_urls[0] ?? "",
        image_urls: form.image_urls,
      };

      if (form.id) {
        const { error } = await supabase.from("products").update(payload).eq("id", form.id);
        if (error) throw error;
        toast.success("Product updated");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success("Product created");
      }
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-noir/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4">
      <div className="bg-ivory w-full max-w-3xl my-8 shadow-2xl">
        <div className="flex items-center justify-between px-8 py-5 border-b border-border">
          <h2 className="text-display text-2xl">{form.id ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} aria-label="Close" className="p-2 hover:text-champagne-deep">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-6">
          <div>
            <label className="tracking-luxe text-xs text-champagne-deep mb-2 block">
              Product Images {form.image_urls.length > 0 && `(${form.image_urls.length})`}
            </label>
            {form.image_urls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                {form.image_urls.map((url, i) => (
                  <div key={`${url}-${i}`} className="relative group bg-muted aspect-[4/5]">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 text-[10px] tracking-luxe bg-champagne text-noir px-1.5 py-0.5">Main</span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-noir/70 text-ivory text-xs flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => moveImage(i, -1)} className="px-2 py-1 hover:bg-noir" aria-label="Move left">
                        <GripVertical className="w-3 h-3 rotate-90" />←
                      </button>
                      <button type="button" onClick={() => removeImage(i)} className="px-2 py-1 hover:bg-destructive" aria-label="Remove">
                        <X className="w-3 h-3" />
                      </button>
                      <button type="button" onClick={() => moveImage(i, 1)} className="px-2 py-1 hover:bg-noir" aria-label="Move right">
                        →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3 flex-wrap">
              <label className="btn-outline-noir cursor-pointer inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading…" : "Upload Images"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const fs = e.target.files;
                    if (fs && fs.length) handleUpload(fs);
                    e.target.value = "";
                  }}
                />
              </label>
              <div className="flex-1 flex gap-2 min-w-[200px]">
                <input
                  value={pasteUrl}
                  onChange={(e) => setPasteUrl(e.target.value)}
                  placeholder="…or paste image URL"
                  className="flex-1 bg-transparent border-b border-border py-2 text-sm focus:border-champagne outline-none"
                />
                <button type="button" onClick={addPastedUrl} className="text-xs tracking-luxe text-champagne-deep hover:underline">
                  Add
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-light mt-2">
              First image is the main thumbnail. Hover to reorder or remove.
            </p>
          </div>

          <Field label="Product Name" required>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)} className="form-input" maxLength={200} />
          </Field>

          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Brand" required>
              <select value={form.brand_slug} onChange={(e) => handleBrand(e.target.value)} className="form-input">
                {BRANDS.map((b) => (
                  <option key={b.slug} value={b.slug}>{b.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Type">
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className="form-input">
                {["tote", "sling", "clutch", "shoulder", "bucket"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <Field label="Price (₹)" required>
              <input required type="number" min="0" step="1" value={form.price} onChange={(e) => set("price", e.target.value)} className="form-input" />
            </Field>
            <Field label="Discount Price (₹)">
              <input type="number" min="0" step="1" value={form.discount_price} onChange={(e) => set("discount_price", e.target.value)} className="form-input" placeholder="optional" />
            </Field>
            <Field label="Availability" required>
              <select
                value={form.in_stock ? "in" : "out"}
                onChange={(e) => set("in_stock", e.target.value === "in")}
                className="form-input"
              >
                <option value="in">In Stock</option>
                <option value="out">Out of Stock</option>
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className="form-input" maxLength={1000} />
          </Field>

          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Badge">
              <select value={form.badge} onChange={(e) => set("badge", e.target.value)} className="form-input">
                <option value="">None</option>
                <option value="new">New</option>
                <option value="sale">Sale</option>
                <option value="bestseller">Bestseller</option>
              </select>
            </Field>
            <Field label="Dimensions">
              <input value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} className="form-input" maxLength={100} />
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={onClose} className="btn-outline-noir">Cancel</button>
            <button type="submit" disabled={saving} className="btn-gold disabled:opacity-50">
              {saving ? "Saving…" : form.id ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="tracking-luxe text-xs text-champagne-deep mb-2 block">
        {label}{required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}
