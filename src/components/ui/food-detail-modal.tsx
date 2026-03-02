"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X, Plus, Minus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartContext } from "@/context/cart-context"
import type { FoodItem } from "@/types/food"

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

interface FoodDetailModalProps {
  food: FoodItem | null
  onClose: () => void
}

export function FoodDetailModal({ food, onClose }: FoodDetailModalProps) {
  const { addItem } = useCartContext()
  const [qty, setQty] = useState(1)

  // Reset qty khi mở món mới
  useEffect(() => {
    if (food) setQty(1)
  }, [food?.id])

  // Đóng modal bằng Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  // Khoá scroll body khi modal mở
  useEffect(() => {
    if (food) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [food])

  const handleAddToCart = () => {
    if (!food) return
    addItem(food, qty)
    onClose()
  }

  return (
    <AnimatePresence>
      {food && (
        <>
          {/* Backdrop blur */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl bg-background border border-border shadow-2xl overflow-hidden max-h-[90vh] sm:max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Ảnh món ăn */}
              <div className="relative h-48 sm:h-64 w-full overflow-hidden">
                <img
                  src={food.image}
                  alt={food.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/default_food.webp'
                  }}
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {food.isNew && (
                    <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                      Mới
                    </span>
                  )}
                  {food.isBestseller && (
                    <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                      Bán Chạy
                    </span>
                  )}
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              {/* Thông tin */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div>
                  {food.category && (
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {food.category}
                    </p>
                  )}
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">{food.name}</h3>
                  {food.description && (
                    <p className="mt-1.5 sm:mt-2 text-sm text-muted-foreground leading-relaxed">
                      {food.description}
                    </p>
                  )}
                </div>

                {/* Giá */}
                <p className="text-2xl sm:text-3xl font-bold text-primary">
                  {formatVND(food.price)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    / {food.unit ?? "phần"}
                  </span>
                </p>

                {/* Số lượng + Thêm giỏ */}
                <div className="flex items-center gap-3 sm:gap-4 pt-2 pb-2 sm:pb-0">
                  {/* Quantity control */}
                  <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-border px-3 py-2">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center font-semibold text-foreground">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Add to cart */}
                  <Button
                    className="flex-1 gap-2 text-sm sm:text-base"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                    Đặt món — {formatVND(food.price * qty)}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
