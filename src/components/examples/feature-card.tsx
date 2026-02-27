"use client";

import { LiquidCard, CardContent, CardTitle, CardDescription } from "@/components/ui/liquid-glass-card"
import { LucideIcon, Zap, Shield, Rocket, Clock, Heart, Star } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = "text-orange-500",
}: FeatureCardProps) {
  return (
    <LiquidCard className="text-center liquid-card">
      <CardContent className="pt-4 sm:pt-6">
        <div className={`mx-auto w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-3 sm:mb-4`}>
          <Icon className={`h-5 w-5 sm:h-7 sm:w-7 ${iconColor}`} />
        </div>
        <CardTitle className="mb-1.5 sm:mb-2 text-base sm:text-xl">{title}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          {description}
        </CardDescription>
      </CardContent>
    </LiquidCard>
  )
}

// Pre-defined feature cards for restaurant website
const restaurantFeatures = [
  {
    icon: Clock,
    title: "Phục Vụ Nhanh Chóng",
    description: "Đội ngũ chuyên nghiệp, sẵn sàng phục vụ tiệc của bạn trong thời gian ngắn nhất"
  },
  {
    icon: Heart,
    title: "Tâm Huyết Từng Món",
    description: "Mỗi món ăn được chế biến với tình yêu và sự tỉ mỉ trong từng chi tiết"
  },
  {
    icon: Star,
    title: "Chất Lượng Đảm Bảo",
    description: "Nguyên liệu tươi ngon, an toàn vệ sinh thực phẩm đạt chuẩn"
  },
  {
    icon: Zap,
    title: "Linh Hoạt Menu",
    description: "Tùy chỉnh thực đơn theo yêu cầu và ngân sách của khách hàng"
  },
  {
    icon: Shield,
    title: "An Toàn Thực Phẩm",
    description: "Quy trình chế biến đảm bảo vệ sinh an toàn thực phẩm"
  },
  {
    icon: Rocket,
    title: "Đặt Tiệc Dễ Dàng",
    description: "Quy trình đặt tiệc đơn giản, nhanh chóng chỉ với vài bước"
  }
]

export function FeatureCards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {restaurantFeatures.map((feature, index) => (
        <FeatureCard
          key={index}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  )
}

export { restaurantFeatures }
