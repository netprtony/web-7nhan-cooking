"use client";

import { LiquidCard, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/liquid-glass-card"
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  icon?: LucideIcon;
  description?: string;
}

export function StatsCard({
  title,
  value,
  change,
  trend = "up",
  icon: Icon,
  description,
}: StatsCardProps) {
  return (
    <LiquidCard className="liquid-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        {Icon && (
          <CardAction>
            <Icon className="h-5 w-5 text-gray-400" />
          </CardAction>
        )}
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
        </div>
        {(change || description) && (
          <div className="flex items-center gap-2 mt-2">
            {change && (
              <>
                {trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {change}
                </span>
              </>
            )}
            {description && (
              <span className="text-sm text-gray-500">{description}</span>
            )}
          </div>
        )}
      </CardContent>
    </LiquidCard>
  )
}

interface StatsGridProps {
  stats: StatsCardProps[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  )
}
