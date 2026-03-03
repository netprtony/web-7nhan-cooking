"use client";

import { createContext, useContext, useState } from "react";

interface CartUIContextType {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartUIContext = createContext<CartUIContextType>({
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
});

export function CartUIProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartUIContext.Provider
      value={{
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartUIContext.Provider>
  );
}

export function useCartUI() {
  return useContext(CartUIContext);
}
