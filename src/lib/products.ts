import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Wordmark style hints — typography-only rendering to avoid using trademarked logo files.
// `style` controls the visual treatment in the brand grid.
export type BrandStyle = "serif" | "sans" | "mono" | "italic";

export const BRANDS: { slug: string; name: string; tagline?: string; style: BrandStyle }[] = [
  { slug: "coach", name: "COACH", tagline: "New York 1941", style: "serif" },
  { slug: "dior", name: "Dior", tagline: "Christian Dior · Paris", style: "serif" },
  { slug: "ysl", name: "SAINT LAURENT", tagline: "Yves Saint Laurent", style: "sans" },
  { slug: "celine", name: "CELINE", tagline: "Paris", style: "sans" },
  { slug: "burberry", name: "BURBERRY", tagline: "London England", style: "sans" },
  { slug: "guess", name: "GUESS", tagline: "Los Angeles", style: "sans" },
  { slug: "bvlgari", name: "BVLGARI", tagline: "Roma", style: "serif" },
  { slug: "hermes", name: "HERMÈS", tagline: "Paris", style: "serif" },
  { slug: "aldo", name: "ALDO", tagline: "Since 1972", style: "sans" },
  { slug: "louis-vuitton", name: "LOUIS VUITTON", tagline: "Malletier à Paris", style: "serif" },
  { slug: "gucci", name: "GUCCI", tagline: "Firenze 1921", style: "serif" },
  { slug: "prada", name: "PRADA", tagline: "Milano", style: "serif" },
  { slug: "michael-kors", name: "MICHAEL KORS", tagline: "New York", style: "sans" },
  { slug: "charles-keith", name: "CHARLES & KEITH", tagline: "Singapore", style: "sans" },
  { slug: "fendi", name: "FENDI", tagline: "Roma 1925", style: "sans" },
  { slug: "miu-miu", name: "Miu Miu", tagline: "Milano", style: "italic" },
  { slug: "zolee", name: "ZOLEE", tagline: "Imported", style: "serif" },
  { slug: "diesel", name: "DIESEL", tagline: "Only the Brave", style: "sans" },
  { slug: "tommy-hilfiger", name: "TOMMY HILFIGER", tagline: "Est. 1985", style: "sans" },
  { slug: "tory-burch", name: "TORY BURCH", tagline: "New York", style: "serif" },
];

export type ProductRow = {
  id: string;
  name: string;
  brand: string;
  brand_slug: string;
  price: number | string;
  discount_price: number | string | null;
  image_url: string;
  description: string;
  stock_quantity: number;
  type: string;
  color: string;
  material: string;
  dimensions: string;
  badge: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  brandSlug: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  description: string;
  stockQuantity: number;
  type: string;
  color: string;
  material: string;
  dimensions: string;
  badge?: "new" | "sale" | "bestseller" | null;
  createdAt: string;
};

export function mapProduct(r: ProductRow): Product {
  const price = Number(r.price);
  const discount = r.discount_price != null ? Number(r.discount_price) : null;
  const hasDiscount = discount != null && discount > 0 && discount < price;
  return {
    id: r.id,
    name: r.name,
    brand: r.brand,
    brandSlug: r.brand_slug,
    price: hasDiscount ? discount! : price,
    originalPrice: hasDiscount ? price : undefined,
    imageUrl: r.image_url,
    description: r.description,
    stockQuantity: r.stock_quantity,
    type: r.type,
    color: r.color,
    material: r.material,
    dimensions: r.dimensions,
    badge: (r.badge as Product["badge"]) ?? null,
    createdAt: r.created_at,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as ProductRow[]).map(mapProduct);
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as ProductRow) : null;
}

export async function searchProducts(term: string): Promise<Product[]> {
  const q = term.trim();
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (q.length > 0) {
    const esc = q.replace(/[%,()]/g, " ").trim();
    const pattern = `%${esc}%`;
    query = query.or(
      `name.ilike.${pattern},description.ilike.${pattern},type.ilike.${pattern},color.ilike.${pattern},brand.ilike.${pattern}`,
    );
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as ProductRow[]).map(mapProduct);
}

export const productsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: fetchProducts,
});

export const productsSearchQueryOptions = (term: string) =>
  queryOptions({
    queryKey: ["products", "search", term.trim().toLowerCase()],
    queryFn: () => searchProducts(term),
  });

export const productQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["products", id],
    queryFn: () => fetchProduct(id),
  });

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
