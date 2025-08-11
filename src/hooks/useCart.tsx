import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { MenuItem } from "@/data/menu";

export type CartItem = {
  key: string; // unique per item + special requests
  menuItemId?: string | number;
  name: string;
  price: number;
  quantity: number;
  specialRequests?: string;
};

interface CartContextType {
  items: CartItem[];
  addItem: (item: { menuItemId?: string | number; name: string; price: number; quantity?: number; specialRequests?: string }) => void;
  updateQuantity: (key: string, quantity: number) => void;
  updateSpecialRequests: (key: string, specialRequests: string) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const storageKey = "reservation_cart_v1";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const addItem: CartContextType["addItem"] = ({ menuItemId, name, price, quantity = 1, specialRequests = "" }) => {
    const key = `${menuItemId ?? name}-${specialRequests}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { key, menuItemId, name, price, quantity, specialRequests }];
    });
  };

  const updateQuantity: CartContextType["updateQuantity"] = (key, quantity) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, quantity) } : i)));
  };

  const updateSpecialRequests: CartContextType["updateSpecialRequests"] = (key, specialRequests) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, specialRequests } : i)));
  };

  const removeItem: CartContextType["removeItem"] = (key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  };

  const clearCart = () => setItems([]);

  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

  const value: CartContextType = { items, addItem, updateQuantity, updateSpecialRequests, removeItem, clearCart, total };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
