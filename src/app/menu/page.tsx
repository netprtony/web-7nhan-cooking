"use client";

import { useEffect, useState } from 'react';
import { client, urlFor } from '@/lib/sanity';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Filter, Plus, Minus, ShoppingCart, X, ArrowLeft, Trash2 } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';

interface MenuItem {
  _id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image: any;
  isAvailable: boolean;
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
  const [guestCount, setGuestCount] = useState(10);
  const [loading, setLoading] = useState(true);

  // Fetch menu items from Sanity
  useEffect(() => {
    const query = `*[_type == "menuItem" && isAvailable == true] | order(category asc) {
      _id,
      title,
      category,
      price,
      description,
      image,
      isAvailable
    }`;
    
    client.fetch(query).then((data) => {
      setMenuItems(data);
      setFilteredItems(data);
      setLoading(false);
    }).catch(() => {
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
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i._id !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i._id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate totals
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const perPersonCost = guestCount > 0 ? Math.round(subtotal / guestCount) : 0;

  const getCategoryLabel = (value: string) => {
    return categories.find((c) => c.value === value)?.label || value;
  };

  const getCategoryColor = (value: string) => {
    return categories.find((c) => c.value === value)?.color || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Trang Chủ</span>
            </Link>

            <h1 className="text-2xl font-bold text-gray-900">Thực Đơn</h1>

            {/* Cart Button */}
            <GlassButton
              onClick={() => setIsCartOpen(true)}
              size="default"
              contentClassName="flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Giỏ hàng</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </GlassButton>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-gray-300"
            />
          </div>

          {/* Category Filters */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <GlassButton
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                size="sm"
                className={`flex-shrink-0 ${selectedCategory === cat.value ? 'ring-2 ring-orange-500' : ''}`}
              >
                {cat.label}
              </GlassButton>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">
              {menuItems.length === 0 
                ? "Chưa có món ăn nào trong thực đơn. Vui lòng thêm món ăn trong Sanity Studio."
                : "Không tìm thấy món ăn phù hợp"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const cartItem = cart.find((i) => i._id === item._id);
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    {item.image ? (
                      <Image
                        src={urlFor(item.image).width(400).height(300).url()}
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
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-orange-600">
                        {item.price?.toLocaleString('vi-VN')}₫
                      </p>

                      {cartItem ? (
                        <div className="flex items-center gap-2">
                          <GlassButton
                            onClick={() => updateQuantity(item._id, -1)}
                            size="icon"
                          >
                            <Minus className="w-4 h-4" />
                          </GlassButton>
                          <span className="font-semibold w-6 text-center">{cartItem.quantity}</span>
                          <GlassButton
                            onClick={() => updateQuantity(item._id, 1)}
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
                  </div>
                </div>
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
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold">Thực Đơn Dự Kiến</h2>
              <GlassButton
                onClick={() => setIsCartOpen(false)}
                size="icon"
              >
                <X className="w-6 h-6" />
              </GlassButton>
            </div>

            {/* Guest Count */}
            <div className="p-4 border-b bg-orange-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng khách dự kiến
              </label>
              <div className="flex items-center gap-3">
                <GlassButton
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                  size="icon"
                >
                  <Minus className="w-5 h-5" />
                </GlassButton>
                <input
                  type="number"
                  min="1"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center text-xl font-bold border rounded-lg py-2"
                />
                <GlassButton
                  onClick={() => setGuestCount(guestCount + 1)}
                  size="icon"
                >
                  <Plus className="w-5 h-5" />
                </GlassButton>
                <span className="text-gray-600">người</span>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Chưa có món ăn nào được chọn</p>
                  <p className="text-sm mt-2">Nhấn "Thêm" để thêm món vào thực đơn</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item._id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={urlFor(item.image).width(100).height(100).url()}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                            🍽️
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                        <p className="text-sm text-orange-600 font-semibold">
                          {item.price?.toLocaleString('vi-VN')}₫
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <GlassButton
                            onClick={() => updateQuantity(item._id, -1)}
                            size="icon"
                            className="w-6 h-6"
                          >
                            <Minus className="w-3 h-3" />
                          </GlassButton>
                          <span className="font-medium">{item.quantity}</span>
                          <GlassButton
                            onClick={() => updateQuantity(item._id, 1)}
                            size="icon"
                            className="w-6 h-6"
                          >
                            <Plus className="w-3 h-3" />
                          </GlassButton>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <GlassButton
                          onClick={() => removeFromCart(item._id)}
                          size="icon"
                          className="w-6 h-6"
                        >
                          <Trash2 className="w-4 h-4" />
                        </GlassButton>
                        <p className="font-bold text-gray-900">
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
              <div className="border-t p-4 space-y-3 bg-gray-50">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng món ({totalItems} món)</span>
                  <span className="font-medium">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ước tính/người ({guestCount} khách)</span>
                  <span className="font-medium text-orange-600">{perPersonCost.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-bold">Tổng cộng</span>
                  <span className="text-xl font-bold text-orange-600">
                    {subtotal.toLocaleString('vi-VN')}₫
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
                  <Link href="/booking" className="flex-1">
                    <GlassButton size="default" className="w-full">
                      Đặt tiệc ngay
                    </GlassButton>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
