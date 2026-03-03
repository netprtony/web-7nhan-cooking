"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity"
import { FoodDetailModal } from "@/components/ui/food-detail-modal"
import { TextAnimate } from "@/components/ui/text-animate"
import type { FoodItem } from "@/types/food"
import Link from "next/link"
import { GlassButton } from "@/components/ui/glass-button"
import { ArrowRight } from "lucide-react"

const DEFAULT_FOOD_IMAGE = "/assets/default_food.webp"

// Supabase menu_items row type
interface SupabaseMenuItem {
  id: string
  title: string
  category: string
  price: number
  description: string | null
  image_url: string | null
  is_available: boolean
}

// Category label map
const categoryLabels: Record<string, string> = {
  appetizer: "Món Khai Vị",
  main: "Món Chính",
  seafood: "Hải Sản",
  specialty: "Đặc Sản",
  hotpot: "Lẩu & Súp",
  dessert: "Tráng Miệng",
}

export function ScrollVelocityFood() {
  const [items, setItems] = useState<FoodItem[]>([])
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)

  // Fetch từ Supabase
  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("id, title, category, price, description, image_url, is_available")
        .eq("is_available", true)
        .order("category", { ascending: true })

      if (!error && data) {
        const rows = data as SupabaseMenuItem[]
        const mapped: FoodItem[] = rows.map((item) => ({
          id: item.id,
          name: item.title,
          description: item.description ?? "",
          price: item.price,
          image: item.image_url ?? DEFAULT_FOOD_IMAGE,
          category: categoryLabels[item.category] ?? item.category,
        }))
        setItems(mapped)
      }
    }
    fetchMenu()
  }, [])

  // Chia items thành 2 hàng
  const rowA = items.filter((_, i) => i % 2 === 0)
  const rowB = items.filter((_, i) => i % 2 !== 0)

  if (items.length === 0) return null

  return (
    <div className="w-full py-12 space-y-4">
      {/* Section header */}
      <div className="text-center mb-8 px-4">
        <TextAnimate
          animation="blurInUp"
          by="word"
          as="h2"
          once
          className="text-3xl md:text-4xl font-bold text-foreground mb-2"
        >
          Thực Đơn Nổi Bật
        </TextAnimate>
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
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r" />
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l" />
      </div>

      <div className="flex justify-center !mt-8">
        <Link href="/menu">
          <GlassButton size="lg" contentClassName="flex items-center gap-2">
            Xem tất cả món ăn
            <ArrowRight className="w-4 h-4" />
          </GlassButton>
        </Link>
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
  const [imgSrc, setImgSrc] = useState(food.image)

  return (
    <button
      onClick={onClick}
      className="mx-3 inline-block group cursor-pointer focus:outline-none"
      aria-label={`Xem chi tiết ${food.name}`}
    >
      <div className="relative h-44 w-64 overflow-hidden rounded-xl shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
        <img
          src={imgSrc}
          alt={food.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          decoding="async"
          onError={() => setImgSrc(DEFAULT_FOOD_IMAGE)}
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
