"use client";

import { LiquidCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/liquid-glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import Image from "next/image"
import { Calendar, User, Clock, ArrowRight } from "lucide-react"

interface BlogCardProps {
  title: string;
  excerpt: string;
  imageUrl?: string;
  author: string;
  date: string;
  readTime?: string;
  category?: string;
  categoryColor?: string;
  onReadMore?: () => void;
}

export function BlogCard({
  title,
  excerpt,
  imageUrl,
  author,
  date,
  readTime = "5 phút đọc",
  category,
  categoryColor = "bg-orange-500",
  onReadMore,
}: BlogCardProps) {
  return (
    <LiquidCard className="w-full max-w-md liquid-card overflow-hidden">
      <div className="relative overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={250}
            className="w-full h-48 object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
            <span className="text-6xl">📝</span>
          </div>
        )}
        {category && (
          <span className={`absolute top-4 left-4 ${categoryColor} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
            {category}
          </span>
        )}
      </div>

      <CardHeader>
        <CardTitle className="text-xl line-clamp-2 group-hover:text-orange-500 transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="line-clamp-3">
          {excerpt}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readTime}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <GlassButton 
          onClick={onReadMore}
          contentClassName="flex items-center gap-2"
          className="w-full"
        >
          Đọc thêm
          <ArrowRight className="h-4 w-4" />
        </GlassButton>
      </CardFooter>
    </LiquidCard>
  )
}
