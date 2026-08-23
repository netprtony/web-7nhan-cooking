"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowLeft, X } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { LiquidCard, CardContent } from '@/components/ui/liquid-glass-card';
import { FoodDetailModal } from '@/components/ui/food-detail-modal';
import dynamic from 'next/dynamic';
import type { FoodItem } from '@/types/food';

const FooterRestaurant = dynamic(
  () => import('@/components/ui/footer-section').then((m) => ({ default: m.FooterRestaurant })),
  { ssr: false }
);

interface MenuItem {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image_url: string | null;
  is_available: boolean;
  ingredients: any;
  food_cost: number;
}

const categories = [
  { value: 'all', label: 'Tất Cả', color: 'bg-gray-900' },
  { value: 'appetizer', label: 'Món Khai Vị', color: 'bg-primary' },
  { value: 'main_course', label: 'Món Chính', color: 'bg-green-600' },
  { value: 'sharing_plate', label: 'Món Chia Sẻ (Sharing)', color: 'bg-blue-500' },
  { value: 'dessert', label: 'Tráng Miệng', color: 'bg-pink-500' },
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedMenuFood, setSelectedMenuFood] = useState<FoodItem | null>(null);

  // Fetch menu items from Supabase
  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('id, title, category, price, description, image_url, is_available, ingredients, food_cost')
        .eq('is_available', true)
        .order('category', { ascending: true });
      
      if (!error && data) {
        setMenuItems(data as MenuItem[]);
        setFilteredItems(data as MenuItem[]);
      }
      setLoading(false);
    };

    fetchMenu().catch(() => {
      setLoading(false);
    });
  }, []);

  // Filter items based on category and search
  useEffect(() => {
    let result = menuItems;

    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    setFilteredItems(result);
  }, [selectedCategory, searchQuery, menuItems]);

  const getCategoryLabel = (value: string) => {
    return categories.find((c) => c.value === value)?.label || value;
  };

  const getCategoryColor = (value: string) => {
    return categories.find((c) => c.value === value)?.color || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex flex-col justify-between">
      <div>
        {/* Compact Sticky Sub-Header */}
        <header className="sticky top-14 md:top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border shadow-xs">
          <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
            {/* Top row: Title + Compact Search */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <Link
                  href="/"
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-xs sm:text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Trang Chủ</span>
                </Link>
                <div className="h-4 w-px bg-border hidden sm:block" />
                <h1 className="text-base sm:text-lg font-bold text-foreground">
                  Thực Đơn
                </h1>
              </div>

              {/* Compact Sleek Search Bar */}
              <div className="relative flex-1 max-w-[180px] xs:max-w-[220px] sm:max-w-xs md:max-w-sm">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder="Tìm món..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 sm:h-9 pl-8 pr-7 text-xs sm:text-sm rounded-full bg-muted/60 hover:bg-muted/80 focus:bg-background border border-border/60 focus:border-primary focus:outline-none transition-all placeholder:text-muted-foreground"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Bottom row: Ultra-compact Category Pills */}
            <div className="mt-2 flex gap-1 sm:gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-3 px-3 sm:-mx-4 sm:px-4">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                      : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content — Maximized space for food items */}
        <main className="container mx-auto px-3 sm:px-4 py-3 sm:py-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-10 h-10 border-3 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-sm sm:text-base text-muted-foreground">
                {menuItems.length === 0 
                  ? "Chưa có món ăn nào trong thực đơn. Vui lòng thêm món ăn trong trang quản trị."
                  : "Không tìm thấy món ăn phù hợp với từ khóa."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
              {filteredItems.map((item, index) => {
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.25, delay: Math.min(index % 12, 6) * 0.03 }}
                  >
                    <LiquidCard className="liquid-card overflow-hidden group h-full cursor-pointer hover:border-primary/40 transition-colors">
                      {/* Image — click to open detail modal */}
                      <div
                        className="relative h-28 sm:h-36 w-full overflow-hidden rounded-t-xl -mt-6"
                        onClick={() => setSelectedMenuFood({
                          id: item.id,
                          name: item.title,
                          description: item.description ?? '',
                          price: item.price,
                          image: item.image_url ?? '/assets/default_food.webp',
                          category: getCategoryLabel(item.category),
                          ingredients: item.ingredients,
                          food_cost: item.food_cost
                        })}
                      >
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw"
                            loading={index < 6 ? "eager" : "lazy"}
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/15 to-accent/30 flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl">🍽️</span>
                          </div>
                        )}
                        {/* Category badge */}
                        <span className={`absolute top-2 left-2 px-1.5 py-0.5 ${getCategoryColor(item.category)} text-white text-[9px] sm:text-[10px] font-semibold rounded-full shadow-xs`}>
                          {getCategoryLabel(item.category)}
                        </span>
                        {/* Quick-detail hint */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 text-white text-[11px] font-medium bg-black/60 backdrop-blur-xs rounded-full px-2.5 py-0.5 transition-opacity">
                            Xem chi tiết
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <CardContent
                        className="p-2 sm:p-2.5"
                        onClick={() => setSelectedMenuFood({
                          id: item.id,
                          name: item.title,
                          description: item.description ?? '',
                          price: item.price,
                          image: item.image_url ?? '/assets/default_food.webp',
                          category: getCategoryLabel(item.category),
                          ingredients: item.ingredients,
                          food_cost: item.food_cost
                        })}
                      >
                        <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1 line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs sm:text-sm font-bold text-primary">
                            {item.price?.toLocaleString('vi-VN')}₫
                          </p>
                          {item.food_cost > 0 && (
                            <span className="text-[10px] text-muted-foreground font-medium hidden xs:inline">
                              FC: {((item.food_cost / item.price) * 100).toFixed(0)}%
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </LiquidCard>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <FooterRestaurant />

      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedMenuFood}
        onClose={() => setSelectedMenuFood(null)}
      />
    </div>
  );
}
