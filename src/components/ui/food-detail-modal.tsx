"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FoodItem } from "@/types/food"

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n)

interface FoodDetailModalProps {
  food: FoodItem | null
  onClose: () => void
}

export function FoodDetailModal({ food, onClose }: FoodDetailModalProps) {
  const [isIngredientsExpanded, setIsIngredientsExpanded] = useState(false)

  // Reset states khi mở món mới
  useEffect(() => {
    if (food) {
      setIsIngredientsExpanded(false)
    }
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
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
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

                  {/* Hiển thị thành phần & giá vốn (Theo yêu cầu DEV) */}
                  {food.ingredients && food.ingredients.length > 0 && (
                    <div className="bg-muted/30 rounded-lg p-3 sm:p-4 mt-3 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                          Thành phần món ăn
                        </h4>
                        {food.food_cost ? (
                          <span className="text-[10px] sm:text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Food Cost: {new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(food.food_cost)} ({((food.food_cost / food.price) * 100).toFixed(1)}%)
                          </span>
                        ) : null}
                      </div>

                      <div className={`space-y-4 overflow-hidden relative transition-all duration-300 ${isIngredientsExpanded ? 'max-h-[800px] overflow-y-auto pr-1' : 'max-h-[140px]'}`}>
                        {food.ingredients[0]?.category ? (
                          // Grouped items
                          food.ingredients.map((group: any, gIdx: number) => (
                            <div key={gIdx}>
                              <h5 className="text-xs font-bold text-foreground/80 mb-1.5">{group.category}</h5>
                              <ul className="text-xs text-muted-foreground space-y-1.5 border-l-2 border-border/50 pl-2">
                                {group.items?.map((ing: any, idx: number) => (
                                  <li key={idx} className="flex flex-col pb-1.5 border-b border-border/20 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                      <span className="font-medium text-foreground mr-2">{ing.name}</span>
                                      <span className="text-right whitespace-nowrap opacity-90">
                                        {ing.quantity !== null ? `${ing.quantity} ${ing.unit}` : ing.unit}
                                        {ing.unit_cost && ing.quantity && (
                                          <span className="opacity-70 ml-1">({formatVND(ing.unit_cost * ing.quantity)})</span>
                                        )}
                                      </span>
                                    </div>
                                    {ing.notes && <span className="text-[10px] italic opacity-70 mt-0.5">Lưu ý: {ing.notes}</span>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))
                        ) : (
                          // Flat items
                          <ul className="text-xs text-muted-foreground space-y-1.5">
                            {food.ingredients.map((ing: any, idx: number) => (
                              <li key={idx} className="flex justify-between items-center pb-1.5 border-b border-border/40 last:border-0 last:pb-0">
                                <span>{ing.name}</span>
                                <div className="text-right">
                                  <span className="font-medium text-foreground">
                                    {ing.quantity !== null ? `${ing.quantity} ${ing.unit}` : ing.unit}
                                  </span>
                                  {ing.unit_cost && ing.quantity && (
                                    <span className="opacity-70 ml-2">
                                      ({formatVND(ing.unit_cost * ing.quantity)})
                                    </span>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}

                        {!isIngredientsExpanded && (
                          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-muted/30 to-transparent flex items-end justify-center pb-1">
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => setIsIngredientsExpanded(!isIngredientsExpanded)}
                        className="w-full mt-2 py-1.5 text-xs font-semibold text-primary/80 hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                      >
                        {isIngredientsExpanded ? 'Ẩn bớt' : 'Xem toàn bộ thành phần'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Giá */}
                <p className="text-2xl sm:text-3xl font-bold text-primary pb-2 sm:pb-0">
                  {formatVND(food.price)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    / {food.unit ?? "phần"}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
