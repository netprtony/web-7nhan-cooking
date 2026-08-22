"use client";

import React, { useState } from 'react';
import { GlassButton } from '@/components/ui/glass-button';

const accordionItems = [
  {
    id: 1,
    title: 'Món Khai Vị',
    imageUrl: '/assets/bgImageSrc/bg3.jpg',
  },
  {
    id: 2,
    title: 'Hải Sản Tươi Sống',
    imageUrl: '/assets/bgImageSrc/bg2.jpg',
  },
  {
    id: 3,
    title: 'Đặc Sản Ba Miền',
    imageUrl: '/assets/bgImageSrc/bg4.jpg',
  },
  {
    id: 4,
    title: 'Lẩu & Súp',
    imageUrl: '/assets/bgImageSrc/bg5.jpg',
  },
  {
    id: 5,
    title: 'Tráng Miệng',
    imageUrl: '/assets/bgImageSrc/bg1.jpg',
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
        relative rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out
        h-[280px] sm:h-[400px] md:h-[600px]
        ${isActive ? 'flex-[4] sm:flex-[3] md:w-[600px]' : 'flex-[1] sm:flex-[0.5] md:w-[80px]'}
        min-w-0
      `}
      onMouseEnter={onMouseEnter}
      onClick={onMouseEnter}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <span
        className={`
          absolute text-white text-sm sm:text-lg font-semibold whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${
            isActive
              ? 'bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 rotate-0'
              : 'bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 rotate-90'
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
      <div className="absolute inset-0 backdrop-blur-sm bg-white/85 dark:bg-neutral-950/85" />
      
      <div className="relative container mx-auto px-4 py-12 md:py-24">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight tracking-tighter">
            AFTER HOURS – MODERN DINING
          </h1>
          <div className="mt-4 sm:mt-6 space-y-2 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto md:mx-0">
            <p className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-700 pb-2">
              Nhận tất cả các loại tiệc: Tiệc cưới - Liên hoan - Sinh nhật - Hội nghị...
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 text-sm sm:text-base text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Chất lượng đảm bảo
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Thực phẩm tươi sống
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Đầu bếp trên 20 năm kinh nghiệm
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Giá cả hợp lý
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Thực đơn đa dạng, phong phú
              </li>
            </ul>
            <p className="mt-4 sm:mt-6 font-bold text-primary text-lg sm:text-xl">
              ☎️ Hotline: 0909.947.086
            </p>
            <p className="italic text-gray-500 dark:text-gray-400">Hân hạnh phục vụ quý khách!</p>
          </div>
          <div className="mt-6 sm:mt-8">
            <GlassButton size="lg">
              Đặt Lịch Ngay
            </GlassButton>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex flex-row items-center justify-center gap-1.5 sm:gap-2 md:gap-4 overflow-hidden px-2 sm:p-4">
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
