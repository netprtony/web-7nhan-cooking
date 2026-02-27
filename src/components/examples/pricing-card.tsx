"use client";

import { LiquidCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/liquid-glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import { Check } from "lucide-react"

interface PricingPlan {
  name: string;
  price: string | number;
  unit?: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText?: string;
  onSelect?: () => void;
}

export function PricingCard({
  name,
  price,
  unit = "/khách",
  description,
  features,
  popular = false,
  ctaText = "Chọn Gói Này",
  onSelect,
}: PricingPlan) {
  return (
    <LiquidCard 
      className={`liquid-card ${popular ? "ring-2 ring-orange-500 relative" : ""}`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            PHỔ BIẾN NHẤT
          </span>
        </div>
      )}

      <CardHeader className={popular ? "pt-4" : ""}>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="mb-4 sm:mb-6">
          <span className="text-2xl sm:text-4xl font-bold text-orange-600">
            {typeof price === "number" ? price.toLocaleString("vi-VN") : price}
            <span className="text-lg font-normal text-gray-500">₫</span>
          </span>
          <span className="text-gray-500">{unit}</span>
        </div>

        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <GlassButton 
          className="w-full"
          onClick={onSelect}
        >
          {ctaText}
        </GlassButton>
      </CardFooter>
    </LiquidCard>
  )
}

// Pre-defined pricing plans for restaurant
const restaurantPricingPlans: PricingPlan[] = [
  {
    name: "Gói Tiết Kiệm",
    price: 250000,
    description: "Phù hợp cho tiệc nhỏ, gia đình",
    features: [
      "5-7 món ăn cơ bản",
      "Nguyên liệu tươi ngon",
      "Phục vụ tại nhà",
      "Dọn dẹp sau tiệc",
    ]
  },
  {
    name: "Gói Tiêu Chuẩn",
    price: 350000,
    description: "Lựa chọn được ưa thích nhất",
    features: [
      "8-10 món đa dạng",
      "Hải sản tươi sống",
      "Đầu bếp chuyên nghiệp",
      "Phục vụ và dọn dẹp",
      "Trang trí bàn tiệc",
    ],
    popular: true
  },
  {
    name: "Gói Cao Cấp",
    price: 500000,
    description: "Trải nghiệm ẩm thực đỉnh cao",
    features: [
      "12-15 món đặc sắc",
      "Đặc sản vùng miền",
      "Đầu bếp 5 sao",
      "Phục vụ VIP",
      "Trang trí sang trọng",
      "MC và âm thanh",
    ]
  }
]

export function PricingCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {restaurantPricingPlans.map((plan, index) => (
        <PricingCard key={index} {...plan} />
      ))}
    </div>
  )
}

export { restaurantPricingPlans }
