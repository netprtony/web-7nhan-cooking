"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { LiquidCard, CardContent } from '@/components/ui/liquid-glass-card';
import { Input } from '@/components/ui/input';
import { useCartContext } from '@/context/cart-context';
import { useCartUI } from '@/context/cart-ui-context';
import { FoodDetailModal } from '@/components/ui/food-detail-modal';
import type { FoodItem } from '@/types/food';

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

interface CartItem extends MenuItem {
  quantity: number;
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
  const { items: cart, addItem, removeItem, updateQuantity: cartUpdateQty, totalItems } = useCartContext();
  const { openCart } = useCartUI();
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

  // Cart helper: convert MenuItem to FoodItem for addItem
  const addToCart = (item: MenuItem) => {
    const foodItem: FoodItem = {
      id: item.id,
      name: item.title,
      description: item.description ?? '',
      price: item.price,
      image: item.image_url ?? '/assets/default_food.webp',
      category: item.category,
    };
    addItem(foodItem, 1);
  };

  const removeFromCart = (itemId: string) => {
    removeItem(itemId);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    const existing = cart.find((i) => i.id === itemId);
    if (existing) {
      cartUpdateQty(itemId, existing.quantity + delta);
    }
  };

  const getCategoryLabel = (value: string) => {
    return categories.find((c) => c.value === value)?.label || value;
  };

  const getCategoryColor = (value: string) => {
    return categories.find((c) => c.value === value)?.color || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="sticky top-16 z-40 bg-white dark:bg-neutral-900 shadow-md dark:shadow-neutral-900/50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <Link href="/" className="flex items-center gap-1.5 sm:gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Trang Chủ</span>
            </Link>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Thực Đơn</h1>

            {/* Cart Button */}
            <GlassButton
              onClick={openCart}
              size="sm"
              contentClassName="flex items-center gap-1.5 sm:gap-2"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-primary text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </GlassButton>
          </div>

          {/* Search Bar */}
          <div className="mt-3 sm:mt-4 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-full border-gray-300 text-sm sm:text-base"
            />
          </div>

          {/* Category Filters */}
          <div className="mt-3 sm:mt-4 flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 sm:-mx-4 sm:px-4">
            {categories.map((cat) => (
              <GlassButton
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                size="sm"
                className={`flex-shrink-0 text-xs sm:text-sm ${selectedCategory === cat.value ? 'ring-2 ring-primary' : ''}`}
              >
                {cat.label}
              </GlassButton>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-base sm:text-xl text-gray-500 dark:text-gray-400">
              {menuItems.length === 0 
                ? "Chưa có món ăn nào trong thực đơn. Vui lòng thêm món ăn trong trang quản trị."
                : "Không tìm thấy món ăn phù hợp"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
            {filteredItems.map((item, index) => {
              const cartItem = cart.find((i: { id: string }) => i.id === item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.3, delay: Math.min(index % 10, 6) * 0.05 }}
                >
                  <LiquidCard className="liquid-card overflow-hidden group h-full">
                    {/* Image — click to open detail modal */}
                    <div
                      className="relative h-28 sm:h-36 w-full overflow-hidden rounded-t-xl -mt-6 cursor-pointer"
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
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                          loading={index === 0 ? "eager" : "lazy"}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-pink-200 dark:from-primary/30 dark:to-pink-900/40 flex items-center justify-center">
                          <span className="text-3xl">🍽️</span>
                        </div>
                      )}
                      {/* Category badge */}
                      <span className={`absolute top-2 left-2 px-2 py-0.5 ${getCategoryColor(item.category)} text-white text-[10px] font-semibold rounded-full`}>
                        {getCategoryLabel(item.category)}
                      </span>
                      {/* Quick-detail hint */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold bg-black/50 rounded-full px-2 py-0.5 transition-opacity">
                          Xem chi tiết
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent className="p-2 sm:p-3">
                      <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-1 line-clamp-2 leading-tight">{item.title}</h3>
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <p className="text-sm sm:text-base font-bold text-primary">
                          {item.price?.toLocaleString('vi-VN')}₫
                        </p>

                        {cartItem ? (
                          <div className="flex items-center gap-1.5">
                            <GlassButton
                              onClick={() => updateQuantity(item.id, -1)}
                              size="icon"
                              className="w-6 h-6"
                            >
                              <Minus className="w-3 h-3" />
                            </GlassButton>
                            <span className="text-sm font-semibold w-5 text-center">{cartItem.quantity}</span>
                            <GlassButton
                              onClick={() => updateQuantity(item.id, 1)}
                              size="icon"
                              className="w-6 h-6"
                            >
                              <Plus className="w-3 h-3" />
                            </GlassButton>
                          </div>
                        ) : (
                          <GlassButton
                            onClick={() => addToCart(item)}
                            size="sm"
                            contentClassName="flex items-center gap-0.5 text-xs"
                            className="h-7 px-2"
                          >
                            <Plus className="w-3 h-3" />
                            Thêm
                          </GlassButton>
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

      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedMenuFood}
        onClose={() => setSelectedMenuFood(null)}
      />
    </div>
  );
}
