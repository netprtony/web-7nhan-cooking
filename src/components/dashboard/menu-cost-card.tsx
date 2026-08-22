'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { MenuItem } from '@/types/food'

function getFoodCostColor(pct: number) {
  if (pct <= 28) return 'text-green-500'
  if (pct <= 35) return 'text-primary'
  return 'text-red-500'
}

function getFoodCostBg(pct: number) {
  if (pct <= 28) return 'bg-green-500'
  if (pct <= 35) return 'bg-primary'
  return 'bg-red-500'
}

export function MenuCostCards({ items }: { items: MenuItem[] }) {
  const formatVND = (n: number) =>
    new Intl.NumberFormat('vi-VN').format(n) + 'đ'

  return (
    <div className="md:hidden space-y-3">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <Link href={`/dashboard/menu/${item.id}`} className="block">
            <div className="bg-card border border-border rounded-lg p-4 active:scale-[0.98] transition-transform">
              <div className="flex items-start gap-3">
                {item.image_url && (
                  <div className="relative w-14 h-14 rounded-md overflow-hidden flex-shrink-0">
                    <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="56px" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground truncate">{item.title}</h3>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${item.is_available ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {item.is_available ? 'Đang bán' : 'Ngưng'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground capitalize mt-0.5">{item.category}</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Giá bán</p>
                  <p className="text-sm font-semibold text-foreground">{formatVND(item.price)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Food Cost</p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(item.food_cost)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">FC%</p>
                  <p className={`text-sm font-bold ${getFoodCostColor((item.food_cost / item.price) * 100 || 0)}`}>
                    {((item.food_cost / item.price) * 100 || 0).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getFoodCostBg((item.food_cost / item.price) * 100 || 0)}`}
                  style={{ width: `${Math.min((item.food_cost / item.price) * 100 || 0, 100)}%` }}
                />
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
