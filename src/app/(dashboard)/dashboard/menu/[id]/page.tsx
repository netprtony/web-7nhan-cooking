'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { IngredientEditor } from '@/components/dashboard/ingredient-editor'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { MenuItem, Ingredient } from '@/types/food'

const CATEGORIES = ['appetizer', 'main_course', 'sharing_plate', 'dessert']

export default function MenuItemEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [item, setItem] = useState<MenuItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'main_course',
    price: 0,
    description: '',
    image_url: '',
    is_available: true,
    ingredients: [] as Ingredient[],
    food_cost: 0,
  })

  useEffect(() => {
    const fetchItem = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) {
        const menuItem = data as unknown as MenuItem
        setItem(menuItem)
        setFormData({
          title: menuItem.title,
          category: menuItem.category,
          price: menuItem.price,
          description: menuItem.description || '',
          image_url: menuItem.image_url || '',
          is_available: menuItem.is_available,
          ingredients: menuItem.ingredients || [],
          food_cost: menuItem.food_cost || 0,
        })
      }
      setLoading(false)
    }
    fetchItem()
  }, [id])

  const handleSave = async () => {
    setSaving(true)
    const totalFoodCost = formData.ingredients.reduce(
      (sum, ing: any) => sum + ((ing.quantity || 0) * (ing.unit_cost || 0)), 0
    )

    const { error } = await supabase
      .from('menu_items')
      .update({
        title: formData.title,
        category: formData.category,
        price: formData.price,
        description: formData.description || null,
        image_url: formData.image_url || null,
        is_available: formData.is_available,
        ingredients: formData.ingredients as unknown as import('@/types/supabase').Json,
        food_cost: totalFoodCost,
      })
      .eq('id', id)

    if (error) {
      console.error('Error saving:', error)
      alert('Lỗi khi lưu. Vui lòng thử lại.')
    } else {
      router.push('/dashboard/menu')
      router.refresh()
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc muốn xoá món này?')) return

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)

    if (!error) {
      router.push('/dashboard/menu')
      router.refresh()
    }
  }

  const formatVND = (n: number) =>
    new Intl.NumberFormat('vi-VN').format(n) + 'đ'

  const currentFoodCost = formData.ingredients.reduce(
    (sum, ing: any) => sum + ((ing.quantity || 0) * (ing.unit_cost || 0)), 0
  )
  const currentFoodCostPct = formData.price > 0
    ? ((currentFoodCost / formData.price) * 100)
    : 0

  if (loading) {
    return <div className="h-96 bg-card border border-border rounded-lg animate-pulse" />
  }

  if (!item) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Không tìm thấy món ăn</p>
        <Link href="/dashboard/menu" className="text-primary underline mt-2 inline-block">Quay lại</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 md:pb-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link href="/dashboard/menu" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>
        <h1 className="text-2xl font-display tracking-wider text-foreground">Chỉnh sửa món</h1>
      </motion.div>

      {/* Food Cost Summary Bar */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-wrap items-center gap-4">
        {formData.image_url && (
          <div className="relative w-16 h-16 rounded-md overflow-hidden">
            <Image src={formData.image_url} alt={formData.title} fill className="object-cover" sizes="64px" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground truncate">{formData.title || 'Tên món'}</h2>
          <div className="flex items-center gap-4 mt-1 text-sm">
            <span className="text-muted-foreground">Giá bán: <span className="text-foreground font-medium">{formatVND(formData.price)}</span></span>
            <span className="text-muted-foreground">Food Cost: <span className="text-primary font-medium">{formatVND(currentFoodCost)}</span></span>
            <span className={`font-bold ${
              currentFoodCostPct <= 28 ? 'text-green-500' :
              currentFoodCostPct <= 35 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {currentFoodCostPct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Tên món</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full h-10 px-3 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm"
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
            <label className="block text-sm font-medium text-foreground mb-1.5">Giá bán (VND)</label>
            <input
              type="number"
              inputMode="numeric"
              value={formData.price || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
              className="w-full h-10 px-3 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">URL Hình ảnh</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              className="w-full h-10 px-3 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm resize-none"
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

      {/* Actions - Desktop */}
      <div className="hidden md:flex items-center justify-between">
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Xoá món
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      {/* Sticky Save Bar - Mobile */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-card/95 backdrop-blur-md border-t border-border z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="w-11 h-11 flex items-center justify-center rounded-md border border-destructive/30 text-destructive"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 h-11 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  )
}
