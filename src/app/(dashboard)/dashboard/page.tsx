'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { FoodCostChart } from '@/components/dashboard/food-cost-chart'
import { MenuCostTable } from '@/components/dashboard/menu-cost-table'
import { MenuCostCards } from '@/components/dashboard/menu-cost-card'
import { motion } from 'framer-motion'
import type { MenuItem } from '@/types/food'

interface DashboardData {
  items: MenuItem[]
  totalItems: number
  avgFoodCostPercentage: number
  highestFoodCostItem: { title: string; percentage: number } | null
  chartData: { category: string; avgFoodCostPercentage: number; count: number }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: items, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('food_cost_percentage', { ascending: false })

      if (error || !items) {
        console.error('Error fetching menu items:', error)
        setLoading(false)
        return
      }

      const menuItems = items as unknown as MenuItem[]
      const totalItems = menuItems.length
      const avgFoodCost = totalItems > 0
        ? menuItems.reduce((sum, item) => sum + (item.food_cost_percentage || 0), 0) / totalItems
        : 0
      const highestItem = menuItems[0] && menuItems[0].food_cost_percentage > 0
        ? { title: menuItems[0].title, percentage: menuItems[0].food_cost_percentage }
        : null

      // Group by category for chart
      const categoryMap = new Map<string, { total: number; count: number }>()
      menuItems.forEach(item => {
        const cat = item.category || 'Khác'
        const current = categoryMap.get(cat) || { total: 0, count: 0 }
        categoryMap.set(cat, {
          total: current.total + (item.food_cost_percentage || 0),
          count: current.count + 1,
        })
      })

      const chartData = Array.from(categoryMap.entries()).map(([category, val]) => ({
        category,
        avgFoodCostPercentage: val.count > 0 ? val.total / val.count : 0,
        count: val.count,
      }))

      setData({
        items: menuItems,
        totalItems,
        avgFoodCostPercentage: avgFoodCost,
        highestFoodCostItem: highestItem,
        chartData,
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-card border border-border rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Không thể tải dữ liệu. Vui lòng thử lại.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl md:text-3xl font-display tracking-wider text-foreground">
          Tổng quan
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Bảng điều khiển quản lý nhà hàng</p>
      </motion.div>

      <KPICards data={{
        totalItems: data.totalItems,
        avgFoodCostPercentage: data.avgFoodCostPercentage,
        highestFoodCostItem: data.highestFoodCostItem,
        estimatedRevenue: null,
      }} />

      <FoodCostChart data={data.chartData} />

      {/* Recent items with highest food cost */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Món có Food Cost % cao nhất</h2>
        <MenuCostTable items={data.items.slice(0, 10)} />
        <MenuCostCards items={data.items.slice(0, 10)} />
      </div>
    </div>
  )
}
