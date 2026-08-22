'use client'

import { useState, useCallback, useMemo } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Ingredient } from '@/types/food'

interface IngredientEditorProps {
  ingredients: Ingredient[]
  onChange: (ingredients: Ingredient[]) => void
}

const UNITS = ['g', 'kg', 'ml', 'lít', 'cái', 'con', 'lá', 'bó', 'muỗng', 'chén']

export function IngredientEditor({ ingredients, onChange }: IngredientEditorProps) {
  const [editingIngredients, setEditingIngredients] = useState<Ingredient[]>(ingredients)

  const totalFoodCost = useMemo(() =>
    editingIngredients.reduce((sum, ing) => sum + ((ing.quantity || 0) * (ing.unit_cost || 0)), 0),
    [editingIngredients]
  )

  const updateAndNotify = useCallback((updated: Ingredient[]) => {
    setEditingIngredients(updated)
    onChange(updated)
  }, [onChange])

  const addIngredient = () => {
    updateAndNotify([...editingIngredients, { name: '', quantity: 0, unit: 'g', unit_cost: 0 }])
  }

  const removeIngredient = (index: number) => {
    updateAndNotify(editingIngredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = editingIngredients.map((ing, i) =>
      i === index ? { ...ing, [field]: value } : ing
    )
    updateAndNotify(updated)
  }

  const formatVND = (n: number) =>
    new Intl.NumberFormat('vi-VN').format(n) + 'đ'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Nguyên liệu</h3>
        <button
          type="button"
          onClick={addIngredient}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm
        </button>
      </div>

      {/* Header row - desktop only */}
      <div className="hidden md:grid md:grid-cols-[1fr_100px_80px_120px_40px] gap-2 text-xs text-muted-foreground font-medium px-1">
        <span>Tên nguyên liệu</span>
        <span>Số lượng</span>
        <span>Đơn vị</span>
        <span>Đơn giá (VND)</span>
        <span></span>
      </div>

      <AnimatePresence mode="popLayout">
        {editingIngredients.map((ing, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border border-border rounded-md p-3 md:p-0 md:border-0"
          >
            <div className="grid grid-cols-2 md:grid-cols-[1fr_100px_80px_120px_40px] gap-2 items-center">
              {/* Name */}
              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] text-muted-foreground md:hidden mb-1 block">Tên nguyên liệu</label>
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder="VD: Ức gà"
                  className="w-full h-9 px-3 text-sm bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                />
              </div>
              {/* Quantity */}
              <div>
                <label className="text-[10px] text-muted-foreground md:hidden mb-1 block">Số lượng</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={ing.quantity || ''}
                  onChange={(e) => updateIngredient(index, 'quantity', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full h-9 px-3 text-sm bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                />
              </div>
              {/* Unit */}
              <div>
                <label className="text-[10px] text-muted-foreground md:hidden mb-1 block">Đơn vị</label>
                <select
                  value={ing.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  className="w-full h-9 px-2 text-sm bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              {/* Unit Cost */}
              <div>
                <label className="text-[10px] text-muted-foreground md:hidden mb-1 block">Đơn giá</label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={ing.unit_cost || ''}
                  onChange={(e) => updateIngredient(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full h-9 px-3 text-sm bg-background border border-input rounded-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                />
              </div>
              {/* Delete */}
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="w-9 h-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {/* Per-row subtotal on mobile */}
            <div className="md:hidden mt-2 text-right text-xs text-muted-foreground">
              Thành tiền: <span className="text-foreground font-medium">{formatVND((ing.quantity || 0) * (ing.unit_cost || 0))}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {editingIngredients.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          Chưa có nguyên liệu. Bấm &quot;Thêm&quot; để bắt đầu.
        </div>
      )}

      {/* Total Food Cost */}
      <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <span className="text-sm font-medium text-foreground">Tổng giá vốn (Food Cost)</span>
        <span className="text-lg font-bold text-primary">{formatVND(totalFoodCost)}</span>
      </div>
    </div>
  )
}
