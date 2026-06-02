"use client";
import React, { createContext, useContext, useState } from "react";

interface CartItem { id: string; qty: number; }

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([
    { id: "p1", qty: 1 }, { id: "p5", qty: 1 }, { id: "p7", qty: 2 },
  ]);

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  const addToCart = (id: string, qty = 1) => setCart(c => {
    const ex = c.find(x => x.id === id);
    if (ex) return c.map(x => x.id === id ? { ...x, qty: x.qty + qty } : x);
    return [...c, { id, qty }];
  });

  const setQty = (id: string, qty: number) =>
    setCart(c => qty <= 0 ? c.filter(x => x.id !== id) : c.map(x => x.id === id ? { ...x, qty } : x));

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, setQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
