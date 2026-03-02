# 🍽️ Implementation Plan: Scroll Velocity Món Ăn + Modal Chi Tiết + Giỏ Hàng Persistent

## 🎯 Mục tiêu
- Xóa phần `HeroExpandedContent` ("Không Gian Tiệc Đẳng Cấp") trong `scroll-expansion-hero`
- Thay bằng **2 hàng ảnh món ăn cuộn tự động** dùng `@magicui/scroll-based-velocity`
- Dữ liệu lấy từ **data source thực tế** trong dự án
- Click vào ảnh → **Modal blur** hiện chi tiết món + nút Thêm vào giỏ
- Giỏ hàng lưu **localStorage** + **không mất khi reload**
- Fix lỗi giỏ hàng hiện tại nếu có

---

## 📋 Prompt chính xác cho Claude Opus 4.6

```
Bạn là senior React/TypeScript developer. Nhiệm vụ:

1. Xóa HeroExpandedContent trong hero-banquet.tsx (phần "Không Gian Tiệc Đẳng Cấp")
2. Thay bằng ScrollVelocityFoodSection dùng @magicui/scroll-based-velocity
3. Tạo FoodDetailModal với backdrop blur, thông tin món, nút thêm giỏ hàng
4. Tạo useCart hook với localStorage persistence
5. Fix lỗi giỏ hàng mất khi reload

Chi tiết kỹ thuật ở phần dưới.
```

---

## 🗂️ Bước 1: Khảo sát dự án (BẮT BUỘC)

```bash
# 1. Tìm data source món ăn
find src/ -name "*.ts" -o -name "*.tsx" -o -name "*.json" | xargs grep -l "món\|food\|menu\|dish\|product" 2>/dev/null | head -10
find src/ -name "menu*" -o -name "food*" -o -name "dish*" -o -name "products*" | head -10

# 2. Tìm giỏ hàng hiện tại
grep -rn "cart\|Cart\|giỏ hàng\|localStorage" src/ --include="*.tsx" --include="*.ts" -l

# 3. Xem hero-banquet.tsx hiện tại
cat src/components/sections/hero-banquet.tsx 2>/dev/null

# 4. Kiểm tra magicui đã có chưa
cat package.json | grep -i "magicui\|magic-ui\|scroll-based"
ls src/registry/ 2>/dev/null || ls src/components/magicui/ 2>/dev/null

# 5. Tìm CartContext / CartProvider nếu có
grep -rn "CartContext\|CartProvider\|useCart" src/ --include="*.tsx" --include="*.ts" | head -10
```

> ⚠️ **Claude phải báo cáo** cấu trúc data món ăn tìm được trước khi viết code.

---

## 🛠️ Bước 2: Cài và setup `@magicui/scroll-based-velocity`

```bash
# Cách 1 — qua magicui CLI (khuyên dùng)
npx magicui-cli@latest add scroll-based-velocity

# Cách 2 — nếu CLI không hoạt động, tạo thủ công:
# Tạo file src/components/magicui/scroll-based-velocity.tsx
# Copy code từ https://magicui.design/docs/components/scroll-based-velocity
```

**Nếu cài thủ công**, Claude tạo file này:

```tsx
// src/components/magicui/scroll-based-velocity.tsx
"use client"
import { useRef } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion"
import { cn } from "@/lib/utils"

interface ScrollVelocityRowProps {
  children: React.ReactNode
  baseVelocity?: number
  direction?: 1 | -1
  className?: string
}

export function ScrollVelocityRow({
  children,
  baseVelocity = 5,
  direction = 1,
  className,
}: ScrollVelocityRowProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false })
  const x = useTransform(baseX, (v) => `${v % 100}%`)
  const directionFactor = useRef<number>(direction)

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)
    if (velocityFactor.get() < 0) directionFactor.current = -direction
    else if (velocityFactor.get() > 0) directionFactor.current = direction
    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  return (
    <div className={cn("flex overflow-hidden whitespace-nowrap", className)}>
      <motion.div className="flex shrink-0 items-center" style={{ x }}>
        {children}
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  )
}

export function ScrollVelocityContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("w-full overflow-hidden", className)}>{children}</div>
}
```

---

## 🛠️ Bước 3: Định nghĩa Type món ăn

### File: `src/types/food.ts`

```typescript
export interface FoodItem {
  id: string
  name: string           // "Gà Nướng Mật Ong"
  description: string    // mô tả ngắn
  price: number          // 150000
  image: string          // URL hoặc /assets/...
  category?: string      // "Món Chính" | "Khai Vị" | "Tráng Miệng"
  isNew?: boolean        // badge "Mới"
  isBestseller?: boolean // badge "Bán Chạy"
  unit?: string          // "phần" | "đĩa" | "tô"
}

export interface CartItem extends FoodItem {
  quantity: number
}
```

---

## 🛠️ Bước 4: useCart Hook với localStorage Persistence

### File: `src/hooks/use-cart.ts`

```typescript
"use client"

import { useState, useEffect, useCallback } from "react"
import type { CartItem, FoodItem } from "@/types/food"

const CART_KEY = "restaurant_cart"

// ── Helper: safe localStorage read ─────────────────────────────────────────
// FIX: Wrap trong try-catch + check typeof window để tránh lỗi SSR
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
  // FIX: init từ localStorage ngay khi mount, không init bằng []
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // FIX: load từ localStorage sau khi component mount (tránh hydration mismatch)
  useEffect(() => {
    setItems(readCart())
    setHydrated(true)
  }, [])

  // FIX: sync xuống localStorage mỗi khi items thay đổi (chỉ sau khi hydrated)
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
```

---

## 🛠️ Bước 5: CartContext (toàn app dùng chung)

### File: `src/context/cart-context.tsx`

```tsx
"use client"

import { createContext, useContext } from "react"
import { useCart } from "@/hooks/use-cart"

type CartContextType = ReturnType<typeof useCart>

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCart()
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>
}

export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCartContext phải dùng trong CartProvider")
  return ctx
}
```

**Wrap trong layout:**

```tsx
// src/app/layout.tsx
import { CartProvider } from "@/context/cart-context"

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ThemeProvider ...>
          <CartProvider>   {/* ← thêm CartProvider */}
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## 🛠️ Bước 6: FoodDetailModal Component

### File: `src/components/ui/food-detail-modal.tsx`

```tsx
"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div
              className="relative w-full max-w-lg rounded-2xl bg-background border border-border shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Ảnh món ăn */}
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={food.image}
                  alt={food.name}
                  className="h-full w-full object-cover"
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
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    {food.category}
                  </p>
                  <h3 className="text-2xl font-bold text-foreground">{food.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {food.description}
                  </p>
                </div>

                {/* Giá */}
                <p className="text-3xl font-bold text-primary">
                  {formatVND(food.price)}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    / {food.unit ?? "phần"}
                  </span>
                </p>

                {/* Số lượng + Thêm giỏ */}
                <div className="flex items-center gap-4 pt-2">
                  {/* Quantity control */}
                  <div className="flex items-center gap-3 rounded-xl border border-border px-3 py-2">
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
                    className="flex-1 gap-2"
                    size="lg"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Thêm vào giỏ — {formatVND(food.price * qty)}
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
```

---

## 🛠️ Bước 7: ScrollVelocityFoodSection Component

### File: `src/components/sections/scroll-velocity-food.tsx`

```tsx
"use client"

import { useState } from "react"
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/magicui/scroll-based-velocity"
import { FoodDetailModal } from "@/components/ui/food-detail-modal"
import type { FoodItem } from "@/types/food"

// ── Claude thay thế bằng data thực từ dự án ─────────────────────────────────
// Nếu dùng static data:
// import { menuItems } from "@/data/menu"
// Nếu dùng API/fetch:
// const { data: menuItems } = useSWR('/api/menu', fetcher)

interface ScrollVelocityFoodProps {
  items: FoodItem[]   // ← nhận từ parent hoặc fetch trong component
}

export function ScrollVelocityFood({ items }: ScrollVelocityFoodProps) {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)

  // Chia items thành 2 hàng
  const rowA = items.filter((_, i) => i % 2 === 0)
  const rowB = items.filter((_, i) => i % 2 !== 0)

  return (
    <div className="w-full py-12 space-y-4">
      {/* Section header */}
      <div className="text-center mb-8 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Thực Đơn Nổi Bật
        </h2>
        <p className="text-muted-foreground">
          Chạm vào món ăn để xem chi tiết và đặt ngay
        </p>
      </div>

      {/* Scroll velocity rows */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <ScrollVelocityContainer className="w-full">
          {/* Hàng 1 — cuộn phải */}
          <ScrollVelocityRow baseVelocity={4} direction={1} className="py-3">
            {rowA.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onClick={() => setSelectedFood(food)}
              />
            ))}
          </ScrollVelocityRow>

          {/* Hàng 2 — cuộn trái */}
          <ScrollVelocityRow baseVelocity={4} direction={-1} className="py-3">
            {rowB.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onClick={() => setSelectedFood(food)}
              />
            ))}
          </ScrollVelocityRow>
        </ScrollVelocityContainer>

        {/* Gradient fade edges */}
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r" />
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l" />
      </div>

      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  )
}

// ── Food Card ────────────────────────────────────────────────────────────────
function FoodCard({ food, onClick }: { food: FoodItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mx-3 inline-block group cursor-pointer focus:outline-none"
      aria-label={`Xem chi tiết ${food.name}`}
    >
      <div className="relative h-44 w-64 overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          decoding="async"
        />
        {/* Overlay khi hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-xl" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {food.isNew && (
            <span className="rounded-full bg-green-500/90 px-2 py-0.5 text-xs font-bold text-white">
              Mới
            </span>
          )}
          {food.isBestseller && (
            <span className="rounded-full bg-orange-500/90 px-2 py-0.5 text-xs font-bold text-white">
              🔥
            </span>
          )}
        </div>

        {/* Tên món + giá */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
          <p className="text-sm font-semibold text-white leading-tight line-clamp-1">
            {food.name}
          </p>
          <p className="text-xs text-orange-300 font-medium mt-0.5">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(food.price)}
          </p>
        </div>
      </div>
    </button>
  )
}
```

---

## 🔄 Bước 8: Cập nhật hero-banquet.tsx — xóa HeroExpandedContent

```tsx
// src/components/sections/hero-banquet.tsx
'use client'

import { useEffect } from 'react'
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'
import { ScrollVelocityFood } from '@/components/sections/scroll-velocity-food'
import { menuItems } from '@/data/menu'  // ← Claude điều chỉnh theo data source thực

const HeroBanquet = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/assets/EXPANSION_IMAGE"
        bgImageSrc="/assets/BACKGROUND_IMAGE"
        title="Tiệc Sang Trọng"
        date="Nhà Hàng"
        scrollToExpand="Cuộn để khám phá ↓"
        textBlend={false}
      >
        {/* ← XÓA HeroExpandedContent cũ, thay bằng: */}
        <ScrollVelocityFood items={menuItems} />
      </ScrollExpandMedia>
    </div>
  )
}

export default HeroBanquet
```

---

## 🛠️ Bước 9: Fix giỏ hàng mất khi reload — kiểm tra lỗi phổ biến

Claude đọc cart code hiện tại và fix theo pattern này:

```typescript
// ❌ LỖI PHỔ BIẾN 1 — Init state bằng [] rồi mới load từ localStorage
const [items, setItems] = useState<CartItem[]>([])
useEffect(() => {
  setItems(JSON.parse(localStorage.getItem('cart') || '[]'))
}, [])
// Vẫn hoạt động nhưng gây re-render + có thể race condition

// ✅ FIX — Dùng lazy initializer
const [items, setItems] = useState<CartItem[]>(() => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch { return [] }
})

// ❌ LỖI PHỔ BIẾN 2 — Không check typeof window (crash SSR)
localStorage.getItem('cart')  // crash trên server

// ✅ FIX — luôn check
if (typeof window !== 'undefined') localStorage.getItem('cart')

// ❌ LỖI PHỔ BIẾN 3 — Lưu xuống localStorage nhưng quên sync
setItems(newItems)
// localStorage không được update!

// ✅ FIX — useEffect sync
useEffect(() => {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}, [items])
```

---

## ✅ Checklist cho Claude Opus 4.6

```
[ ] 1. Chạy lệnh khảo sát — tìm data source món ăn + cart code hiện tại
[ ] 2. Báo cáo cấu trúc FoodItem data đang có
[ ] 3. Cài @magicui/scroll-based-velocity hoặc tạo thủ công
[ ] 4. Tạo src/types/food.ts
[ ] 5. Tạo src/hooks/use-cart.ts với lazy localStorage init
[ ] 6. Tạo src/context/cart-context.tsx
[ ] 7. Wrap CartProvider trong layout.tsx
[ ] 8. Fix cart code hiện tại nếu có lỗi SSR / không sync localStorage
[ ] 9. Tạo src/components/ui/food-detail-modal.tsx
[ ] 10. Tạo src/components/sections/scroll-velocity-food.tsx
[ ] 11. Xóa HeroExpandedContent trong hero-banquet.tsx
[ ] 12. Thay bằng <ScrollVelocityFood items={...} />
[ ] 13. Map đúng fields từ data thực tế vào FoodItem interface
[ ] 14. Test: ảnh cuộn tự động 2 hàng ngược chiều
[ ] 15. Test: click vào ảnh → modal hiện với backdrop blur
[ ] 16. Test: tăng/giảm số lượng → "Thêm vào giỏ" → modal đóng
[ ] 17. Test: F5 / reload → giỏ hàng vẫn còn dữ liệu
[ ] 18. Test: không có lỗi SSR trong console
[ ] 19. Test: Escape key đóng modal
[ ] 20. Test: click backdrop đóng modal
```

---

## ⚠️ Lưu ý quan trọng cho Claude Opus 4.6

1. **Data source** — Claude phải đọc data thực từ dự án, KHÔNG tạo data giả. Nếu data từ API, dùng `useEffect` + `useState` để fetch, hoặc React Query/SWR nếu dự án đã có

2. **FoodItem interface** — Claude điều chỉnh theo fields thực tế trong data (tên field có thể là `title` thay vì `name`, `img` thay vì `image`, `gia` thay vì `price`)

3. **ScrollVelocityRow nhân bản children x4** — đảm bảo mỗi hàng có **ít nhất 4-5 items** để loop không bị gap trống. Nếu data ít, Claude duplicate array: `[...items, ...items, ...items]`

4. **Cart persistence FIX quan trọng nhất** — dùng **lazy initializer** `useState(() => readFromLS())` thay vì `useState([])` + `useEffect load` để tránh flash giỏ trống khi reload

5. **SSR safety** — `localStorage` chỉ available ở client. Luôn check `typeof window !== 'undefined'` hoặc dùng `useEffect`

6. **Modal z-index** — đặt `z-50` hoặc cao hơn Header (`z-40` thường) để modal luôn nổi trên cùng

7. **`document.body.style.overflow = "hidden"`** — khoá scroll khi modal mở để tránh scroll xuyên qua modal trên mobile
