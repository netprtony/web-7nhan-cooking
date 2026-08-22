'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { IngredientEditor } from '@/components/dashboard/ingredient-editor'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Ingredient } from '@/types/food'

const CATEGORIES = ['appetizer', 'main_course', 'sharing_plate', 'dessert']

export default function NewMenuItemPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'main_course',
    price: 0,
    description: '',
    image_url: '',
    is_available: true,
    ingredients: [] as Ingredient[],
  })

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tên món')
      return
    }

    setSaving(true)
    const totalFoodCost = formData.ingredients.reduce(
      (sum, ing: any) => sum + ((ing.quantity || 0) * (ing.unit_cost || 0)), 0
    )

    const { error } = await supabase
      .from('menu_items')
      .insert({
        title: formData.title,
        category: formData.category,
        price: formData.price,
        description: formData.description || null,
        image_url: formData.image_url || null,
        is_available: formData.is_available,
        ingredients: formData.ingredients as unknown as import('@/types/supabase').Json,
        food_cost: totalFoodCost,
      })

    if (error) {
      console.error('Error creating:', error)
      alert('Lỗi khi tạo món. Vui lòng thử lại.')
    } else {
      router.push('/dashboard/menu')
      router.refresh()
    }
    setSaving(false)
  }

  const currentFoodCost = formData.ingredients.reduce(
    (sum, ing: any) => sum + ((ing.quantity || 0) * (ing.unit_cost || 0)), 0
  )
  const currentFoodCostPct = formData.price > 0
    ? ((currentFoodCost / formData.price) * 100)
    : 0

  const formatVND = (n: number) =>
    new Intl.NumberFormat('vi-VN').format(n) + 'đ'

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link href="/dashboard/menu" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>
        <h1 className="text-2xl font-display tracking-wider text-foreground">Thêm món mới</h1>
      </motion.div>

      {/* Live Food Cost Preview */}
      {formData.price > 0 && (
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Food Cost dự kiến</p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-lg font-bold text-primary">{formatVND(currentFoodCost)}</span>
              <span className={`text-sm font-bold ${
                currentFoodCostPct <= 28 ? 'text-green-500' :
                currentFoodCostPct <= 35 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {currentFoodCostPct.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Tên món *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="VD: Bò Wagyu nướng than"
              className="w-full h-10 px-3 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Danh mục</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full h-10 px-3 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm"
            >
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Giá bán (VND) *</label>
            <input
              type="number"
              inputMode="numeric"
              value={formData.price || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
              placeholder="0"
              className="w-full h-10 px-3 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">URL Hình ảnh</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://..."
              className="w-full h-10 px-3 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            placeholder="Mô tả ngắn về món ăn..."
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-foreground">Đang phục vụ</label>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, is_available: !prev.is_available }))}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              formData.is_available ? 'bg-primary' : 'bg-muted'
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
              formData.is_available ? 'left-6' : 'left-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <IngredientEditor
          ingredients={formData.ingredients}
          onChange={(ingredients) => setFormData(prev => ({ ...prev, ingredients }))}
        />
      </div>

      {/* Desktop Save */}
      <div className="hidden md:flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Đang tạo...' : 'Tạo món'}
        </button>
      </div>

      {/* Sticky Save - Mobile */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-card/95 backdrop-blur-md border-t border-border z-30">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-11 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Đang tạo...' : 'Tạo món'}
        </button>
      </div>
    </div>
  )
}
