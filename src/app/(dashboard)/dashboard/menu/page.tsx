'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { MenuCostTable } from '@/components/dashboard/menu-cost-table'
import { MenuCostCards } from '@/components/dashboard/menu-cost-card'
import { Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { MenuItem } from '@/types/food'

export default function MenuManagementPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category')
        .order('title')

      if (!error && data) {
        setItems(data as unknown as MenuItem[])
      }
      setLoading(false)
    }
    fetchItems()
  }, [])

  const categories = ['all', ...new Set(items.map(i => i.category))]

  const filtered = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-card border border-border rounded-lg animate-pulse" />
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
          <h1 className="text-2xl md:text-3xl font-display tracking-wider text-foreground">Quản lý Menu</h1>
          <p className="text-sm text-muted-foreground mt-1">{items.length} món trong thực đơn</p>
        </div>
        <Link
          href="/dashboard/menu/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Thêm món</span>
        </Link>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm món ăn..."
            className="w-full h-10 pl-10 pr-4 bg-card border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                categoryFilter === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat === 'all' ? 'Tất cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table (desktop) + Cards (mobile) */}
      <MenuCostTable items={filtered} />
      <MenuCostCards items={filtered} />
    </div>
  )
}
