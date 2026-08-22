'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface ChartData {
  category: string
  avgFoodCostPercentage: number
  count: number
}

export function FoodCostChart({ data }: { data: ChartData[] }) {
  const getBarColor = (percentage: number) => {
    if (percentage <= 28) return 'oklch(0.72 0.19 145)' // green
    if (percentage <= 35) return 'oklch(0.78 0.15 85)' // gold/primary
    return 'oklch(0.63 0.24 25)' // red
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Food Cost % theo danh mục</h3>
        <p className="text-sm text-muted-foreground">Trung bình % giá vốn trên giá bán</p>
      </div>

      <div className="flex items-center gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'oklch(0.72 0.19 145)' }} />
          <span className="text-muted-foreground">&lt;28% Tốt</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'oklch(0.78 0.15 85)' }} />
          <span className="text-muted-foreground">28-35% TB</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: 'oklch(0.63 0.24 25)' }} />
          <span className="text-muted-foreground">&gt;35% Cao</span>
        </div>
      </div>

      <div className="h-[300px] md:h-[350px]">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            Chưa có dữ liệu. Thêm food cost cho các món ăn để xem biểu đồ.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0 0)" />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: 'oklch(0.65 0 0)' }}
                axisLine={{ stroke: 'oklch(0.25 0 0)' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'oklch(0.65 0 0)' }}
                axisLine={{ stroke: 'oklch(0.25 0 0)' }}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.16 0 0)',
                  border: '1px solid oklch(0.25 0 0)',
                  borderRadius: '8px',
                  color: 'oklch(0.93 0.02 85)',
                  fontSize: '13px',
                }}
                formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Food Cost']}
                labelFormatter={(label) => `Danh mục: ${String(label)}`}
              />
              <Bar dataKey="avgFoodCostPercentage" radius={[4, 4, 0, 0]} maxBarSize={50}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.avgFoodCostPercentage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
