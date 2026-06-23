import bag1 from "@/assets/bag-1.jpg";
import bag2 from "@/assets/bag-2.jpg";
import bag3 from "@/assets/bag-3.jpg";
import bag4 from "@/assets/bag-4.jpg";
import bag5 from "@/assets/bag-5.jpg";
import bag6 from "@/assets/bag-6.jpg";
import bag7 from "@/assets/bag-7.jpg";
import bag8 from "@/assets/bag-8.jpg";

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

export type Product = {
  id: string;
  name: string;
  brand: string;
  brandSlug: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: "new" | "sale" | "bestseller";
  type: "tote" | "sling" | "clutch" | "shoulder" | "bucket";
  color: string;
  description: string;
  material: string;
  dimensions: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "neeva-001",
    name: "Quilted Noir Mini Flap",
    brand: "Chanel",
    brandSlug: "chanel",
    price: 18900,
    originalPrice: 24900,
    image: bag1,
    badge: "sale",
    type: "shoulder",
    color: "Black",
    description: "An iconic silhouette reimagined. Hand-quilted lambskin with a woven gold chain — the definition of timeless elegance.",
    material: "Premium lambskin leather, 24k gold-plated hardware",
    dimensions: "20 × 14 × 7 cm",
  },
  {
    id: "neeva-002",
    name: "Riviera Tan Tote",
    brand: "Louis Vuitton",
    brandSlug: "louis-vuitton",
    price: 22500,
    image: bag2,
    badge: "new",
    type: "tote",
    color: "Tan",
    description: "Effortless sophistication in supple grained leather. Designed for the modern woman who carries her world with grace.",
    material: "Saffiano-grain calfskin leather",
    dimensions: "32 × 28 × 14 cm",
  },
  {
    id: "neeva-003",
    name: "Bordeaux Saddle",
    brand: "Dior",
    brandSlug: "dior",
    price: 26900,
    image: bag3,
    badge: "bestseller",
    type: "sling",
    color: "Burgundy",
    description: "A romantic rendition of the saddle silhouette in deep bordeaux — wine for your wardrobe.",
    material: "Pebbled calfskin, brushed gold buckle",
    dimensions: "22 × 18 × 8 cm",
  },
  {
    id: "neeva-004",
    name: "Blush Crossbody",
    brand: "Prada",
    brandSlug: "prada",
    price: 16500,
    image: bag4,
    badge: "new",
    type: "sling",
    color: "Blush Pink",
    description: "Petal-soft nappa leather meets silver hardware — a quiet whisper of romance for daylight outings.",
    material: "Nappa leather, silver-tone hardware",
    dimensions: "18 × 14 × 6 cm",
  },
  {
    id: "neeva-005",
    name: "Emerald Bucket",
    brand: "Gucci",
    brandSlug: "gucci",
    price: 21900,
    image: bag5,
    type: "bucket",
    color: "Forest Green",
    description: "An heirloom-worthy bucket in jewel-toned emerald, finished with vintage brass hardware.",
    material: "Pebbled bovine leather, brass hardware",
    dimensions: "24 × 24 × 18 cm",
  },
  {
    id: "neeva-006",
    name: "Ivoire Quilted",
    brand: "YSL",
    brandSlug: "ysl",
    price: 19900,
    originalPrice: 25900,
    image: bag6,
    badge: "sale",
    type: "shoulder",
    color: "Ivory",
    description: "Pure ivory leather, hand-quilted into a soft diamond pattern with an antique-finish turn lock.",
    material: "Italian lambskin, antique gold hardware",
    dimensions: "26 × 18 × 8 cm",
  },
  {
    id: "neeva-007",
    name: "Soirée Crystal Clutch",
    brand: "Hermès",
    brandSlug: "hermes",
    price: 14500,
    image: bag7,
    badge: "new",
    type: "clutch",
    color: "Black Satin",
    description: "An evening companion — gathered silk satin centered with a hand-set crystal brooch.",
    material: "Silk satin, Swarovski crystal embellishment",
    dimensions: "26 × 16 × 6 cm",
  },
  {
    id: "neeva-008",
    name: "Toffee Top Handle",
    brand: "Fendi",
    brandSlug: "fendi",
    price: 23900,
    image: bag8,
    badge: "bestseller",
    type: "tote",
    color: "Taupe",
    description: "Architectural and refined — a structured top-handle in warm toffee leather with a signature ring closure.",
    material: "Smooth calfskin, brushed brass ring",
    dimensions: "28 × 22 × 12 cm",
  },
];

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
