'use client'

import { motion } from 'framer-motion'
import { UtensilsCrossed, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react'

interface KPIData {
  totalItems: number
  avgFoodCostPercentage: number
  highestFoodCostItem: { title: string; percentage: number } | null
  estimatedRevenue: number | null
}

export function KPICards({ data }: { data: KPIData }) {
  const cards = [
    {
      title: 'Tổng số món',
      value: data.totalItems.toString(),
      subtitle: 'đang phục vụ',
      icon: UtensilsCrossed,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Food Cost TB',
      value: `${data.avgFoodCostPercentage.toFixed(1)}%`,
      subtitle: data.avgFoodCostPercentage <= 30 ? 'Tốt' : data.avgFoodCostPercentage <= 35 ? 'Trung bình' : 'Cần xem lại',
      icon: TrendingUp,
      color: data.avgFoodCostPercentage <= 30 ? 'text-green-500' : data.avgFoodCostPercentage <= 35 ? 'text-yellow-500' : 'text-red-500',
      bgColor: data.avgFoodCostPercentage <= 30 ? 'bg-green-500/10' : data.avgFoodCostPercentage <= 35 ? 'bg-yellow-500/10' : 'bg-red-500/10',
    },
    {
      title: 'FC% cao nhất',
      value: data.highestFoodCostItem ? `${data.highestFoodCostItem.percentage.toFixed(1)}%` : 'N/A',
      subtitle: data.highestFoodCostItem?.title || 'Chưa có dữ liệu',
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Doanh thu ước tính',
      value: data.estimatedRevenue
        ? new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(data.estimatedRevenue) + 'đ'
        : 'Sắp ra mắt',
      subtitle: data.estimatedRevenue ? 'tháng này' : 'Tính năng đang phát triển',
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className="bg-card border border-border rounded-lg p-4 md:p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground font-medium">{card.title}</span>
            <div className={`w-8 h-8 rounded-md ${card.bgColor} flex items-center justify-center`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          <p className={`text-2xl md:text-3xl font-bold ${card.color}`}>
            {card.value}
          </p>
          <p className="text-xs text-muted-foreground mt-1 truncate">{card.subtitle}</p>
        </motion.div>
      ))}
    </div>
  )
}
