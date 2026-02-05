"use client";

import { useEffect, useState } from 'react';
import { client, urlFor } from '@/lib/sanity';
import Image from 'next/image';
import { GlassButton } from '@/components/ui/glass-button';

interface MenuItem {
  _id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image: any;
  isAvailable: boolean;
}

export function MenuSection() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const query = `*[_type == "menuItem" && isAvailable == true] | order(category asc)`;
    
    client.fetch(query).then((data) => setMenuItems(data));
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
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-4xl font-bold text-center mb-8">Thực Đơn</h2>
      
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            {item.image && (
              <div className="relative h-64 w-full">
                <Image
                  src={urlFor(item.image).width(800).url()}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <p className="text-2xl font-bold text-gray-900">
                {item.price?.toLocaleString('vi-VN')} VNĐ
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
