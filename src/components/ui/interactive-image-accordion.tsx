"use client";

import React, { useState } from 'react';
import { GlassButton } from '@/components/ui/glass-button';

const accordionItems = [
  {
    id: 1,
    title: 'Món Khai Vị',
    imageUrl: '/assets/bg3.jpg',
  },
  {
    id: 2,
    title: 'Hải Sản Tươi Sống',
    imageUrl: '/assets/bg2.jpg',
  },
  {
    id: 3,
    title: 'Đặc Sản Ba Miền',
    imageUrl: '/assets/bg4.jpg',
  },
  {
    id: 4,
    title: 'Lẩu & Súp',
    imageUrl: '/assets/bg5.jpg',
  },
  {
    id: 5,
    title: 'Tráng Miệng',
    imageUrl: '/assets/bg1.jpg',
  },
];

interface AccordionItemProps {
  item: typeof accordionItems[0];
  isActive: boolean;
  onMouseEnter: () => void;
}

const AccordionItem = ({ item, isActive, onMouseEnter }: AccordionItemProps) => {
  return (
    <div
      className={`
        relative h-[600px] rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out
        ${isActive ? 'w-[600px]' : 'w-[80px]'}
      `}
      onMouseEnter={onMouseEnter}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <span
        className={`
          absolute text-white text-lg font-semibold whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${
            isActive
              ? 'bottom-6 left-1/2 -translate-x-1/2 rotate-0'
              : 'bottom-24 left-1/2 -translate-x-1/2 rotate-90'
          }
        `}
      >
        {item.title}
      </span>
    </div>
  );
};

export function LandingAccordionItem() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed scale-105"
        style={{ backgroundImage: "url('/assets/bg1.jpg')" }}
      />
      <div className="absolute inset-0 backdrop-blur-sm bg-white/85" />
      
      <div className="relative container mx-auto px-4 py-12 md:py-24">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight tracking-tighter">
            Dịch vụ nấu ăn Bảy Nhân
          </h1>
          <div className="mt-6 space-y-2 text-lg text-gray-600 max-w-xl mx-auto md:mx-0">
            <p className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Nhận tất cả các loại tiệc: Tiệc cưới - Liên hoan - Sinh nhật - Hội nghị...
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Chất lượng đảm bảo
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Thực phẩm tươi sống
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Đầu bếp trên 20 năm kinh nghiệm
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Giá cả hợp lý
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-500">✓</span> Thực đơn đa dạng, phong phú
              </li>
            </ul>
            <p className="mt-6 font-bold text-orange-600 text-xl">
              ☎️ Hotline: 0909.947.086
            </p>
            <p className="italic text-gray-500">Hân hạnh phục vụ quý khách!</p>
          </div>
          <div className="mt-8">
            <GlassButton size="lg">
              Đặt Lịch Ngay
            </GlassButton>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-row items-center justify-center gap-4 overflow-x-auto p-4">
          {accordionItems.map((item, index) => (
            <AccordionItem
              key={item.id}
              item={item}
              isActive={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
