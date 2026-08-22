'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Edit2, ArrowUpDown } from 'lucide-react'
import type { MenuItem } from '@/types/food'

type SortKey = 'title' | 'price' | 'food_cost' | 'food_cost_percentage'
type SortDir = 'asc' | 'desc'

function getFoodCostColor(pct: number) {
  if (pct <= 28) return 'text-green-500'
  if (pct <= 35) return 'text-yellow-500'
  return 'text-red-500'
}

function getFoodCostBg(pct: number) {
  if (pct <= 28) return 'bg-green-500'
  if (pct <= 35) return 'bg-yellow-500'
  return 'bg-red-500'
}

export function MenuCostTable({ items }: { items: MenuItem[] }) {
  const [sortKey, setSortKey] = useState<SortKey>('food_cost_percentage')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const sorted = [...items].sort((a, b) => {
    const aVal = a[sortKey] ?? 0
    const bVal = b[sortKey] ?? 0
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return sortDir === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal)
  })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const formatVND = (n: number) =>
    new Intl.NumberFormat('vi-VN').format(n) + 'đ'

  return (
    <div className="hidden md:block bg-card border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Món ăn</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Danh mục</th>
            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('price')}>
              <span className="inline-flex items-center gap-1">Giá bán <ArrowUpDown className="w-3 h-3" /></span>
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('food_cost')}>
              <span className="inline-flex items-center gap-1">Food Cost <ArrowUpDown className="w-3 h-3" /></span>
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none" onClick={() => toggleSort('food_cost_percentage')}>
              <span className="inline-flex items-center gap-1">FC% <ArrowUpDown className="w-3 h-3" /></span>
            </th>
            <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Trạng thái</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map((item) => (
            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  {item.image_url && (
                    <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="40px" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground capitalize">{item.category}</span>
              </td>
              <td className="py-3 px-4 text-right text-sm text-foreground">{formatVND(item.price)}</td>
              <td className="py-3 px-4 text-right text-sm text-foreground">
                {new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(item.food_cost)}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getFoodCostBg((item.food_cost / item.price) * 100 || 0)}`}
                      style={{ width: `${Math.min((item.food_cost / item.price) * 100 || 0, 100)}%` }}
                    />
                  </div>
                  <span className={`text-sm font-semibold ${getFoodCostColor((item.food_cost / item.price) * 100 || 0)}`}>
                    {((item.food_cost / item.price) * 100 || 0).toFixed(1)}%
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`text-xs px-2 py-1 rounded-full ${item.is_available ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {item.is_available ? 'Đang bán' : 'Tạm ngưng'}
                </span>
              </td>
              <td className="py-3 px-4">
                <Link href={`/dashboard/menu/${item.id}`} className="p-2 rounded-md hover:bg-muted transition-colors inline-flex">
                  <Edit2 className="w-4 h-4 text-muted-foreground" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
