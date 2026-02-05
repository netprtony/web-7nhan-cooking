"use client";

import { LiquidCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/liquid-glass-card"
import { GlassButton } from "@/components/ui/glass-button"
import Image from "next/image"
import { Heart, ShoppingCart, Star } from "lucide-react"

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
  discount?: number;
  onAddToCart?: () => void;
  onWishlist?: () => void;
}

export function ProductCard({
  title,
  description,
  price,
  originalPrice,
  imageUrl,
  rating = 5,
  reviewCount = 0,
  discount,
  onAddToCart,
  onWishlist,
}: ProductCardProps) {
  return (
    <LiquidCard className="w-full max-w-sm liquid-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="line-clamp-1">{description}</CardDescription>
        <CardAction>
          <GlassButton 
            size="icon" 
            onClick={onWishlist}
            className="hover:text-red-500"
          >
            <Heart className="h-5 w-5" />
          </GlassButton>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="relative overflow-hidden rounded-lg">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              width={400}
              height={400}
              className="w-full h-64 object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center">
              <span className="text-6xl">🍽️</span>
            </div>
          )}
          {discount && (
            <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{discount}%
            </span>
          )}
        </div>
        
        <div className="mt-4 space-y-3">
          {rating > 0 && (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
              {reviewCount > 0 && (
                <span className="text-sm text-gray-500 ml-2">({reviewCount} đánh giá)</span>
              )}
            </div>
          )}
          
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-orange-600">
              {price.toLocaleString('vi-VN')}₫
            </span>
            {originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {originalPrice.toLocaleString('vi-VN')}₫
                </span>
              </>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <GlassButton 
          className="flex-1" 
          onClick={onAddToCart}
          contentClassName="flex items-center justify-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Thêm vào giỏ
        </GlassButton>
        <GlassButton size="default">
          Mua ngay
        </GlassButton>
      </CardFooter>
    </LiquidCard>
  )
}
