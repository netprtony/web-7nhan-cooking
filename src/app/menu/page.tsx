"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Plus, Minus, ShoppingCart, X, ArrowLeft, Trash2, Percent } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { LiquidCard, CardContent } from '@/components/ui/liquid-glass-card';
import { Input } from '@/components/ui/input';
import { BookingModal, BookingMenuItem } from '@/components/booking-modal';

interface MenuItem {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image_url: string | null;
  is_available: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const categories = [
  { value: 'all', label: 'Tất Cả', color: 'bg-gray-900' },
  { value: 'appetizer', label: 'Món Khai Vị', color: 'bg-orange-500' },
  { value: 'main', label: 'Món Chính', color: 'bg-green-600' },
  { value: 'seafood', label: 'Hải Sản', color: 'bg-blue-500' },
  { value: 'specialty', label: 'Đặc Sản', color: 'bg-red-500' },
  { value: 'hotpot', label: 'Lẩu & Súp', color: 'bg-amber-500' },
  { value: 'dessert', label: 'Tráng Miệng', color: 'bg-pink-500' },
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tableCount, setTableCount] = useState(1);
  const [serviceFee, setServiceFee] = useState(10);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch menu items from Supabase
  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('id, title, category, price, description, image_url, is_available')
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

  // Cart functions
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate totals: items × tables × service fee
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const itemsSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWithTables = itemsSubtotal * tableCount;
  const serviceFeeAmount = Math.round(totalWithTables * (serviceFee / 100));
  const grandTotal = totalWithTables + serviceFeeAmount;

  // Build booking items for modal
  const bookingMenuItems: BookingMenuItem[] = cart.map((item) => ({
    title: item.title,
    quantity: item.quantity,
    price: item.price,
  }));

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
              onClick={() => setIsCartOpen(true)}
              size="sm"
              contentClassName="flex items-center gap-1.5 sm:gap-2"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center">
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
                className={`flex-shrink-0 text-xs sm:text-sm ${selectedCategory === cat.value ? 'ring-2 ring-orange-500' : ''}`}
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
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredItems.map((item) => {
              const cartItem = cart.find((i) => i.id === item.id);
              return (
                <LiquidCard
                  key={item.id}
                  className="liquid-card overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative h-32 sm:h-48 w-full overflow-hidden rounded-t-xl -mt-6">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-200 to-pink-200 flex items-center justify-center">
                        <span className="text-4xl">🍽️</span>
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 px-3 py-1 ${getCategoryColor(item.category)} text-white text-xs font-medium rounded-full`}>
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  {/* Content */}
                  <CardContent>
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white mb-0.5 sm:mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 line-clamp-2 hidden sm:block">{item.description}</p>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-0">
                      <p className="text-base sm:text-xl font-bold text-orange-600">
                        {item.price?.toLocaleString('vi-VN')}₫
                      </p>

                      {cartItem ? (
                        <div className="flex items-center gap-2">
                          <GlassButton
                            onClick={() => updateQuantity(item.id, -1)}
                            size="icon"
                          >
                            <Minus className="w-4 h-4" />
                          </GlassButton>
                          <span className="font-semibold w-6 text-center">{cartItem.quantity}</span>
                          <GlassButton
                            onClick={() => updateQuantity(item.id, 1)}
                            size="icon"
                          >
                            <Plus className="w-4 h-4" />
                          </GlassButton>
                        </div>
                      ) : (
                        <GlassButton
                          onClick={() => addToCart(item)}
                          size="sm"
                          contentClassName="flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Thêm
                        </GlassButton>
                      )}
                    </div>
                  </CardContent>
                </LiquidCard>
              );
            })}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Sidebar */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-neutral-700">
              <h2 className="text-xl font-bold dark:text-white">Thực Đơn Dự Kiến</h2>
              <GlassButton
                onClick={() => setIsCartOpen(false)}
                size="icon"
              >
                <X className="w-6 h-6" />
              </GlassButton>
            </div>

            {/* Table Count */}
            <div className="p-4 border-b dark:border-neutral-700 bg-orange-50 dark:bg-orange-950/30">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số lượng bàn
              </label>
              <div className="flex items-center gap-3">
                <GlassButton
                  onClick={() => setTableCount(Math.max(1, tableCount - 1))}
                  size="icon"
                >
                  <Minus className="w-5 h-5" />
                </GlassButton>
                <input
                  type="number"
                  min="1"
                  value={tableCount}
                  onChange={(e) => setTableCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center text-xl font-bold border rounded-lg py-2 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
                />
                <GlassButton
                  onClick={() => setTableCount(tableCount + 1)}
                  size="icon"
                >
                  <Plus className="w-5 h-5" />
                </GlassButton>
                <span className="text-gray-600 dark:text-gray-400">bàn</span>
              </div>
            </div>

            {/* Service Fee */}
            <div className="p-4 border-b dark:border-neutral-700 bg-orange-50/50 dark:bg-orange-950/20">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phí phục vụ
              </label>
              <div className="flex items-center gap-3">
                <GlassButton
                  onClick={() => setServiceFee(Math.max(0, serviceFee - 5))}
                  size="icon"
                >
                  <Minus className="w-5 h-5" />
                </GlassButton>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={serviceFee}
                    onChange={(e) => setServiceFee(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                    className="w-16 text-center text-xl font-bold border rounded-lg py-2 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
                  />
                  <Percent className="w-5 h-5 ml-1 text-gray-500 dark:text-gray-400" />
                </div>
                <GlassButton
                  onClick={() => setServiceFee(Math.min(100, serviceFee + 5))}
                  size="icon"
                >
                  <Plus className="w-5 h-5" />
                </GlassButton>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Chưa có món ăn nào được chọn</p>
                  <p className="text-sm mt-2">Nhấn "Thêm" để thêm món vào thực đơn</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 bg-gray-50 dark:bg-neutral-800 rounded-xl p-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image_url ? (
                          <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                            🍽️
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">{item.title}</h4>
                        <p className="text-sm text-orange-600 font-semibold">
                          {item.price?.toLocaleString('vi-VN')}₫
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <GlassButton
                            onClick={() => updateQuantity(item.id, -1)}
                            size="icon"
                            className="w-6 h-6"
                          >
                            <Minus className="w-3 h-3" />
                          </GlassButton>
                          <span className="font-medium">{item.quantity}</span>
                          <GlassButton
                            onClick={() => updateQuantity(item.id, 1)}
                            size="icon"
                            className="w-6 h-6"
                          >
                            <Plus className="w-3 h-3" />
                          </GlassButton>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <GlassButton
                          onClick={() => removeFromCart(item.id)}
                          size="icon"
                          className="w-6 h-6"
                        >
                          <Trash2 className="w-4 h-4" />
                        </GlassButton>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            {cart.length > 0 && (
              <div className="border-t dark:border-neutral-700 p-4 space-y-3 bg-gray-50 dark:bg-neutral-800">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tổng món ({totalItems} món)</span>
                  <span className="font-medium">{itemsSubtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">× {tableCount} bàn</span>
                  <span className="font-medium">{totalWithTables.toLocaleString('vi-VN')}₫</span>
                </div>
                {serviceFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Phí phục vụ ({serviceFee}%)</span>
                    <span className="font-medium">{serviceFeeAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="border-t dark:border-neutral-700 pt-3 flex justify-between">
                  <span className="text-lg font-bold dark:text-white">Tổng cộng</span>
                  <span className="text-xl font-bold text-orange-600">
                    {grandTotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <GlassButton
                    onClick={clearCart}
                    size="default"
                    className="flex-1"
                  >
                    Xóa tất cả
                  </GlassButton>
                  <GlassButton
                    onClick={() => { setIsCartOpen(false); setIsBookingOpen(true); }}
                    size="default"
                    className="flex-1"
                  >
                    Đặt tiệc ngay
                  </GlassButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        menuItems={bookingMenuItems}
        tableCount={tableCount}
        serviceFeePercent={serviceFee}
        mode="menu"
      />
    </div>
  );
}
