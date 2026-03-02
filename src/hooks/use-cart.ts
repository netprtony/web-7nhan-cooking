"use client"

import { useState, useEffect, useCallback } from "react"
import type { CartItem, FoodItem } from "@/types/food"

const CART_KEY = "restaurant_cart"

// ── Helper: safe localStorage read ─────────────────────────────────────────
const readCart = (): CartItem[] => {
    if (typeof window === "undefined") return []
    try {
        const raw = localStorage.getItem(CART_KEY)
        return raw ? (JSON.parse(raw) as CartItem[]) : []
    } catch {
        return []
    }
}

const writeCart = (items: CartItem[]): void => {
    if (typeof window === "undefined") return
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(items))
    } catch {
        console.error("Không thể lưu giỏ hàng")
    }
}

// ── Hook ────────────────────────────────────────────────────────────────────
export function useCart() {
    const [items, setItems] = useState<CartItem[]>([])
    const [hydrated, setHydrated] = useState(false)

    // Load từ localStorage sau khi component mount (tránh hydration mismatch)
    useEffect(() => {
        setItems(readCart())
        setHydrated(true)
    }, [])

    // Sync xuống localStorage mỗi khi items thay đổi (chỉ sau khi hydrated)
    useEffect(() => {
        if (hydrated) {
            writeCart(items)
        }
    }, [items, hydrated])

    const addItem = useCallback((food: FoodItem, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === food.id)
            if (existing) {
                return prev.map((i) =>
                    i.id === food.id ? { ...i, quantity: i.quantity + quantity } : i
                )
            }
            return [...prev, { ...food, quantity }]
        })
    }, [])

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id))
    }, [])

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((i) => i.id !== id))
        } else {
            setItems((prev) =>
                prev.map((i) => (i.id === id ? { ...i, quantity } : i))
            )
        }
    }, [])

    const clearCart = useCallback(() => {
        setItems([])
    }, [])

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

    return {
        items,
        hydrated,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
    }
}
