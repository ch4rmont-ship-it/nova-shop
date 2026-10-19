"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine } from "@/types";

type StoreContextValue = {
  cart: CartLine[];
  favorites: string[];
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const CART_KEY = "nova_cart_v1";
const FAVORITES_KEY = "nova_favorites_v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const localCart = safeParse<CartLine[]>(localStorage.getItem(CART_KEY), []);
    const localFavorites = safeParse<string[]>(localStorage.getItem(FAVORITES_KEY), []);
    setCart(localCart);
    setFavorites(localFavorites);
    setHydrated(true);

    fetch("/api/cart", { cache: "no-store" }).then(async (r) => {
      if (!r.ok) return;
      const body = await r.json() as { items: CartLine[] };
      const merged = new Map<string, number>();
      [...body.items, ...localCart].forEach((item) => merged.set(item.productId, Math.max(merged.get(item.productId) || 0, item.quantity)));
      const result = Array.from(merged, ([productId, quantity]) => ({ productId, quantity }));
      setCart(result);
      localStorage.setItem(CART_KEY, JSON.stringify(result));
      void fetch("/api/cart", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ items: result }) });
    }).catch(() => undefined);

    fetch("/api/favorites", { cache: "no-store" }).then(async (r) => {
      if (!r.ok) return;
      const body = await r.json() as { productIds: string[] };
      const merged = Array.from(new Set([...body.productIds, ...localFavorites]));
      setFavorites(merged);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(merged));
    }).catch(() => undefined);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart, hydrated]);
  useEffect(() => { if (hydrated) localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }, [favorites, hydrated]);

  const syncCart = useCallback((items: CartLine[]) => {
    void fetch("/api/cart", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ items }) }).catch(() => undefined);
  }, []);

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCart((prev) => {
      const found = prev.find((item) => item.productId === productId);
      const next = found ? prev.map((item) => item.productId === productId ? { ...item, quantity: Math.min(99, item.quantity + quantity) } : item) : [...prev, { productId, quantity }];
      syncCart(next); return next;
    });
  }, [syncCart]);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) => {
      const next = quantity <= 0 ? prev.filter((item) => item.productId !== productId) : prev.map((item) => item.productId === productId ? { ...item, quantity: Math.min(99, quantity) } : item);
      syncCart(next); return next;
    });
  }, [syncCart]);

  const removeFromCart = useCallback((productId: string) => setQuantity(productId, 0), [setQuantity]);
  const clearCart = useCallback(() => { setCart([]); syncCart([]); }, [syncCart]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      void fetch("/api/favorites", { method: exists ? "DELETE" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ productId }) }).catch(() => undefined);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ cart, favorites, cartCount: cart.reduce((sum, i) => sum + i.quantity, 0), addToCart, setQuantity, removeFromCart, clearCart, toggleFavorite }), [cart, favorites, addToCart, setQuantity, removeFromCart, clearCart, toggleFavorite]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
