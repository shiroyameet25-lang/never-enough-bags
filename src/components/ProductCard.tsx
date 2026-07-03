import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";
import { formatINR } from "@/lib/products";
import { toggleWishlist, useWishlist } from "@/lib/cart-store";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { has } = useWishlist();
  const liked = has(product.id);
  const oos = !product.inStock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group [perspective:1200px]"
    >
      <Link to="/products/$id" params={{ id: product.id }} className="block">
        <div className="product-card relative bg-card overflow-hidden transition-transform duration-500 ease-out will-change-transform group-hover:[transform:rotateX(2deg)_rotateY(-2deg)_translateZ(0)]">
          <div className="relative aspect-[4/5] overflow-hidden bg-muted">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                width={800}
                height={1000}
                className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-display italic text-xl">
                {product.brand}
              </div>
            )}
            {product.badge && (
              <div className="absolute top-4 left-4">
                <span
                  className={`tracking-luxe px-3 py-1.5 ${
                    product.badge === "sale"
                      ? "bg-noir text-ivory"
                      : product.badge === "new"
                      ? "bg-champagne text-noir"
                      : "bg-ivory text-noir border border-noir/20"
                  }`}
                >
                  {product.badge === "sale" ? "Sale" : product.badge === "new" ? "New" : "Bestseller"}
                </span>
              </div>
            )}
            {oos && (
              <div className="absolute inset-0 bg-noir/40 flex items-center justify-center">
                <span className="tracking-luxe bg-ivory text-noir px-4 py-2">Sold Out</span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(product.id);
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-ivory/90 backdrop-blur flex items-center justify-center hover:bg-champagne transition-all"
              aria-label="Add to wishlist"
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-noir text-noir" : "text-noir"}`} />
            </button>
          </div>
          <div className="pt-5 pb-2 text-center">
            <div className="tracking-luxe text-champagne-deep mb-1.5">{product.brand}</div>
            <h3 className="text-display text-lg text-noir mb-2 leading-tight">{product.name}</h3>
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="text-noir font-medium">{formatINR(product.price)}</span>
              {product.originalPrice && (
                <span className="text-muted-foreground line-through text-xs">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
