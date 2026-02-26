"use client";

import * as React from "react";
import { useState, useRef, useLayoutEffect, useCallback } from "react";

export interface TabItem {
  icon: React.ReactNode;
  color: string;
  label: string;
}

export interface AnimatedTabBarProps {
  items: TabItem[];
  defaultIndex?: number;
  onTabChange?: (index: number) => void;
}

export const AnimatedTabBar: React.FC<AnimatedTabBarProps> = ({
  items,
  defaultIndex = 0,
  onTabChange,
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuBorderRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const offsetMenuBorder = useCallback(() => {
    const activeItem = itemRefs.current[activeIndex];
    const menu = menuRef.current;
    const menuBorder = menuBorderRef.current;

    if (activeItem && menu && menuBorder) {
      const itemRect = activeItem.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const left = Math.round(
        itemRect.left - menuRect.left + (itemRect.width - menuBorder.offsetWidth) / 2
      );
      menuBorder.style.transform = `translate3d(${left}px, 0, 0)`;
    }
  }, [activeIndex]);

  useLayoutEffect(() => {
    offsetMenuBorder();
    const handleResize = () => {
      if (menuRef.current) {
        const menuStyle = menuRef.current.style;
        menuStyle.setProperty("--timeOut", "none");
      }
      offsetMenuBorder();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [offsetMenuBorder]);

  const handleItemClick = (index: number) => {
    if (menuRef.current) {
      const menuStyle = menuRef.current.style;
      menuStyle.removeProperty("--timeOut");
    }
    if (activeIndex === index) return;
    setActiveIndex(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <div 
      ref={menuRef}
      className="menu fixed top-8 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-white/90 backdrop-blur-md rounded-full px-4 py-3 shadow-2xl border border-gray-200"
      style={{ "--timeOut": "0.5s" } as React.CSSProperties}
    >
      <div 
        ref={menuBorderRef}
        className="menu__border absolute left-0 bottom-0 h-1 w-16 rounded-full transition-transform duration-500 ease-out"
        style={{ backgroundColor: items[activeIndex]?.color }}
      />
      
      {items.map((item, index) => (
        <button
          key={index}
          ref={(el) => { itemRefs.current[index] = el; }}
          className={`menu__item relative px-6 py-2 rounded-full transition-all duration-300 ${
            activeIndex === index ? "active scale-110" : "scale-100 opacity-60"
          }`}
          style={{ "--bgColorItem": item.color } as React.CSSProperties}
          onClick={() => handleItemClick(index)}
          aria-label={item.label}
        >
          <span className="flex items-center gap-2 text-gray-800 font-medium">
            {item.icon}
            <span className="hidden md:inline">{item.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
};
