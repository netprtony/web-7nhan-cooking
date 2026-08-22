"use client";

import React, { useState } from 'react';

const chefTeam = [
  {
    id: 1,
    name: 'Đỗ Minh Sơn',
    role: 'Bếp Trưởng (Head Chef)',
    imageUrl: '/chef/dominhson.jpg',
    experience: '20+ năm kinh nghiệm',
  },
  {
    id: 2,
    name: 'Trần Đình Duy',
    role: 'Phó Bếp Trưởng',
    imageUrl: '/chef/trandinhduy.jpg',
    experience: '15 năm kinh nghiệm',
  },
  {
    id: 3,
    name: 'Trần Văn Quyến',
    role: 'Đầu Bếp Món Chính',
    imageUrl: '/chef/tranvanquyen.jpg',
    experience: '12 năm kinh nghiệm',
  },
  {
    id: 4,
    name: 'Nguyễn Bá Quốc Minh',
    role: 'Đầu Bếp Hải Sản',
    imageUrl: '/chef/nguyenbaquocminh.jpg',
    experience: '10 năm kinh nghiệm',
  },
  {
    id: 5,
    name: 'Vũ Thúy Nga',
    role: 'Đầu Bếp Món Khai Vị',
    imageUrl: '/chef/vuthuynga.jpg',
    experience: '8 năm kinh nghiệm',
  },
  {
    id: 6,
    name: 'Nguyễn Thị Bâng Bâng',
    role: 'Đầu Bếp Tráng Miệng (Pastry)',
    imageUrl: '/chef/nguyenthibangbang.jpg',
    experience: '7 năm kinh nghiệm',
  },
  {
    id: 7,
    name: 'Trần Minh Ngọc Ánh',
    role: 'Đầu Bếp Lẩu & Nướng',
    imageUrl: '/chef/tranminhngocanh.jpg',
    experience: '6 năm kinh nghiệm',
  },
];

interface ChefCardProps {
  chef: typeof chefTeam[0];
  isActive: boolean;
  onMouseEnter: () => void;
}

const ChefCard = ({ chef, isActive, onMouseEnter }: ChefCardProps) => {
  return (
    <div
      className={`
        relative rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-700 ease-in-out
        h-[280px] sm:h-[400px] md:h-[600px]
        ${isActive ? 'flex-[4] sm:flex-[3]' : 'flex-[0.6] sm:flex-[0.4]'}
        min-w-0
      `}
      onMouseEnter={onMouseEnter}
      onClick={onMouseEnter}
    >
      <img
        src={chef.imageUrl}
        alt={chef.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className={`absolute inset-0 transition-all duration-500 ${isActive ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' : 'bg-black/50'}`} />

      {/* Info khi active */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 p-3 sm:p-5
          transition-all duration-500
          ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        <p className="text-primary text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] mb-0.5 sm:mb-1">
          {chef.role}
        </p>
        <h3 className="text-white text-base sm:text-xl font-bold">
          {chef.name}
        </h3>
        <p className="text-white/70 text-xs sm:text-sm mt-0.5">
          {chef.experience}
        </p>
      </div>

      {/* Tên xoay khi không active */}
      <span
        className={`
          absolute text-white text-xs sm:text-sm font-semibold whitespace-nowrap
          transition-all duration-300 ease-in-out
          ${
            isActive
              ? 'opacity-0'
              : 'bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2 rotate-90 opacity-100'
          }
        `}
      >
        {chef.name}
      </span>
    </div>
  );
};

export function LandingAccordionItem() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed scale-105"
        style={{ backgroundImage: "url('/Lau1.png')" }}
      />
      <div className="absolute inset-0 backdrop-blur-sm bg-white/85 dark:bg-neutral-950/85" />

      <div className="relative container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          {/* Left: Giới thiệu đội ngũ */}
          <div className="w-full md:w-2/5 text-center md:text-left">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-medium mb-3">
              Đội ngũ đầu bếp
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tighter">
              7 Đầu Bếp Tài Hoa
            </h2>
            <div className="mt-4 sm:mt-6 space-y-3 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto md:mx-0">
              <p>
                Đội ngũ bếp của <span className="font-bold text-foreground">AFTER HOURS</span> là những
                nghệ nhân ẩm thực với tổng cộng hơn <span className="font-bold text-primary">78 năm kinh nghiệm</span>,
                từng làm việc tại các nhà hàng 4-5 sao trên khắp Việt Nam.
              </p>
              <ul className="grid grid-cols-1 gap-2 mt-4 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold text-lg">①</span> Bếp Trưởng — 20+ năm, chuyên gia ẩm thực Á–Âu
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold text-lg">②</span> Phó Bếp — quản lý vận hành bếp 200+ suất/ngày
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary font-bold text-lg">③</span> 5 Đầu Bếp chuyên biệt cho từng phân khúc món
                </li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground italic">
                Hover hoặc chạm vào ảnh bên cạnh để xem từng thành viên →
              </p>
            </div>
          </div>

          {/* Right: Accordion */}
          <div className="w-full md:w-3/5 flex flex-row items-center justify-center gap-1 sm:gap-1.5 md:gap-2 overflow-hidden px-1 sm:p-2">
            {chefTeam.map((chef, index) => (
              <ChefCard
                key={chef.id}
                chef={chef}
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
