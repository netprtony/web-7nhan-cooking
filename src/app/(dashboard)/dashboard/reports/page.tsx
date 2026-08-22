'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { FoodCostChart } from '@/components/dashboard/food-cost-chart'
import { MenuCostTable } from '@/components/dashboard/menu-cost-table'
import { MenuCostCards } from '@/components/dashboard/menu-cost-card'
import { motion } from 'framer-motion'
import { FileText, Download } from 'lucide-react'
import type { MenuItem } from '@/types/food'

export default function ReportsPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('food_cost_percentage', { ascending: false })

      if (!error && data) {
        setItems(data as unknown as MenuItem[])
      }
      setLoading(false)
    }
    fetchItems()
  }, [])

  // Group by category
  const chartData = (() => {
    const map = new Map<string, { total: number; count: number }>()
    items.forEach(item => {
      const cat = item.category || 'Khác'
      const current = map.get(cat) || { total: 0, count: 0 }
      map.set(cat, {
        total: current.total + (item.food_cost_percentage || 0),
        count: current.count + 1,
      })
    })
    return Array.from(map.entries()).map(([category, val]) => ({
      category,
      avgFoodCostPercentage: val.count > 0 ? val.total / val.count : 0,
      count: val.count,
    }))
  })()

  // Alert items (food cost > 35%)
  const alertItems = items.filter(i => i.food_cost_percentage > 35)
  // Top profit items (food cost < 25%)
  const profitItems = items.filter(i => i.food_cost_percentage > 0 && i.food_cost_percentage < 25)

  const formatVND = (n: number) =>
    new Intl.NumberFormat('vi-VN').format(n) + 'đ'

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-card border border-border rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-display tracking-wider text-foreground">Báo cáo Food Cost</h1>
          <p className="text-sm text-muted-foreground mt-1">Phân tích chi tiết giá vốn theo danh mục</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Xuất báo cáo</span>
          </button>
        </div>
      </motion.div>

      {/* Chart */}
      <FoodCostChart data={chartData} />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <h3 className="text-sm font-medium text-foreground">Cần xem lại (FC% &gt; 35%)</h3>
          </div>
          <p className="text-3xl font-bold text-red-500">{alertItems.length}</p>
          <p className="text-xs text-muted-foreground mt-1">món có giá vốn cao</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <h3 className="text-sm font-medium text-foreground">Lãi tốt (FC% &lt; 25%)</h3>
          </div>
          <p className="text-3xl font-bold text-green-500">{profitItems.length}</p>
          <p className="text-xs text-muted-foreground mt-1">món có biên lợi nhuận cao</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <h3 className="text-sm font-medium text-foreground">Tổng giá trị menu</h3>
          </div>
          <p className="text-3xl font-bold text-primary">
            {formatVND(items.reduce((sum, i) => sum + i.price, 0))}
          </p>
          <p className="text-xs text-muted-foreground mt-1">tổng giá bán tất cả món</p>
        </div>
      </div>

      {/* Alert Items */}
      {alertItems.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-red-500" />
            Món cần xem lại
          </h2>
          <MenuCostTable items={alertItems} />
          <MenuCostCards items={alertItems} />
        </div>
      )}

      {/* All Items */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Toàn bộ menu (sắp theo FC%)</h2>
        <MenuCostTable items={items} />
        <MenuCostCards items={items} />
      </div>
    </div>
  )
}
