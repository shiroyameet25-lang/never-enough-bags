import { useEffect, useState, useSyncExternalStore } from "react";
import type { Product } from "./products";

export type CartItem = { product: Product; qty: number };

const EMPTY_CART: CartItem[] = [];
const EMPTY_IDS: string[] = [];


const KEY = "neeva-cart-v1";
const listeners = new Set<() => void>();
let items: CartItem[] = [];
let hydrated = false;

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    items = raw ? JSON.parse(raw) : [];
  } catch {
    items = [];
  }
  hydrated = true;
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l());
}

export function addToCart(product: Product, qty = 1) {
  if (!hydrated) load();
  const existing = items.find((i) => i.product.id === product.id);
  if (existing) existing.qty += qty;
  else items = [...items, { product, qty }];
  persist();
}

export function removeFromCart(id: string) {
  items = items.filter((i) => i.product.id !== id);
  persist();
}

export function updateQty(id: string, qty: number) {
  if (qty <= 0) return removeFromCart(id);
  items = items.map((i) => (i.product.id === id ? { ...i, qty } : i));
  persist();
}

export function getItems() {
  if (!hydrated) load();
  return items;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useCart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!hydrated) load();
    setMounted(true);
  }, []);
  const snapshot = useSyncExternalStore(
    subscribe,
    () => items,
    () => EMPTY_CART,
  );
  return {
    items: mounted ? snapshot : [],
    count: mounted ? snapshot.reduce((s, i) => s + i.qty, 0) : 0,
    subtotal: mounted ? snapshot.reduce((s, i) => s + i.qty * i.product.price, 0) : 0,
  };
}

// Wishlist (lightweight)
const WKEY = "neeva-wishlist-v1";
const wListeners = new Set<() => void>();
let wishlist: string[] = [];
let wHydrated = false;

function wLoad() {
  if (typeof window === "undefined") return;
  try {
    wishlist = JSON.parse(localStorage.getItem(WKEY) || "[]");
  } catch {
    wishlist = [];
  }
  wHydrated = true;
}
function wPersist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(WKEY, JSON.stringify(wishlist));
  wListeners.forEach((l) => l());
}
export function toggleWishlist(id: string) {
  if (!wHydrated) wLoad();
  wishlist = wishlist.includes(id) ? wishlist.filter((x) => x !== id) : [...wishlist, id];
  wPersist();
}
export function useWishlist() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!wHydrated) wLoad();
    setMounted(true);
  }, []);
  const snap = useSyncExternalStore(
    (cb) => {
      wListeners.add(cb);
      return () => wListeners.delete(cb);
    },
    () => wishlist,
    () => EMPTY_IDS,
  );
  return { ids: mounted ? snap : [], has: (id: string) => (mounted ? snap.includes(id) : false) };
}
