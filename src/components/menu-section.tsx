"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { GlassButton } from '@/components/ui/glass-button';

interface MenuItem {
  id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image_url: string | null;
  is_available: boolean;
}

export function MenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('id, title, category, price, description, image_url, is_available')
        .eq('is_available', true)
        .order('category', { ascending: true });
      
      if (!error && data) {
        setMenuItems(data as MenuItem[]);
      }
    };

    fetchMenu();
  }, []);

  const categories = [
    { value: 'all', label: 'Tất Cả' },
    { value: 'appetizer', label: 'Món Khai Vị' },
    { value: 'seafood', label: 'Hải Sản' },
    { value: 'specialty', label: 'Đặc Sản' },
    { value: 'hotpot', label: 'Lẩu & Súp' },
    { value: 'dessert', label: 'Tráng Miệng' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-16">
      <h2 className="text-2xl sm:text-4xl font-bold text-center mb-6 sm:mb-8">Thực Đơn</h2>
      
      <div className="flex justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 flex-wrap">
        {categories.map((cat) => (
          <GlassButton
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            size="default"
            className={selectedCategory === cat.value ? 'ring-2 ring-orange-500' : ''}
          >
            {cat.label}
          </GlassButton>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-8">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {item.image_url && (
              <div className="relative h-32 sm:h-48 lg:h-64 w-full">
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-3 sm:p-4 lg:p-6">
              <h3 className="text-sm sm:text-lg lg:text-xl font-semibold mb-1 sm:mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-2 sm:mb-4 text-xs sm:text-sm lg:text-base line-clamp-2 hidden sm:block">{item.description}</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                {item.price?.toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
