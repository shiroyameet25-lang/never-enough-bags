import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const BRANDS = [
  { slug: "gucci", name: "Gucci" },
  { slug: "louis-vuitton", name: "Louis Vuitton" },
  { slug: "dior", name: "Dior" },
  { slug: "prada", name: "Prada" },
  { slug: "hermes", name: "Hermès" },
  { slug: "chanel", name: "Chanel" },
  { slug: "ysl", name: "YSL" },
  { slug: "fendi", name: "Fendi" },
  { slug: "burberry", name: "Burberry" },
  { slug: "coach", name: "Coach" },
  { slug: "michael-kors", name: "Michael Kors" },
  { slug: "celine", name: "Celine" },
  { slug: "bvlgari", name: "Bvlgari" },
  { slug: "tory-burch", name: "Tory Burch" },
  { slug: "miu-miu", name: "Miu Miu" },
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

export const productsQueryOptions = queryOptions({
  queryKey: ["products"],
  queryFn: fetchProducts,
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
