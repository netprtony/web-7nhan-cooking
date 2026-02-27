"use client";

import React, { useState, useEffect } from "react";
import ScrollMorphHero from "@/components/ui/scroll-morph-hero";
import { LandingAccordionItem } from "@/components/ui/interactive-image-accordion";
import { AnimatedTabBar, TabItem } from "@/components/ui/animated-tab-bar";
import AnimatedFooter from "@/components/ui/animated-footer";
import { UtensilsCrossed, Calendar, Phone, BookOpen } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { FeatureCards } from "@/components/examples/feature-card";
import { PricingCards } from "@/components/examples/pricing-card";
import { supabase } from "@/lib/supabase";
import { BookingModal } from "@/components/booking-modal";

// ============================================
// IMAGE ARRAYS
// ============================================

// Fallback / Hero 1: Food Images (12 món ăn)
const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80",
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=300&q=80",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&q=80",
  "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=300&q=80",
  "https://images.unsplash.com/photo-1562059390-a761a084768e?w=300&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&q=80",
  "https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&q=80",
  "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&q=80",
];

// ============================================
// TAB CONFIGURATION
// ============================================

const bgColorsBody = ["#ff6b35", "#4ecdc4", "#95e1d3", "#f38181"];

const tabItems: TabItem[] = [
  {
    color: "#ff6b35",
    label: "Thực Đơn",
    icon: <UtensilsCrossed className="w-5 h-5" />,
  },
  {
    color: "#4ecdc4",
    label: "Đặt Tiệc",
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    color: "#95e1d3",
    label: "Liên Hệ",
    icon: <Phone className="w-5 h-5" />,
  },
  {
    color: "#f38181",
    label: "Blog",
    icon: <BookOpen className="w-5 h-5" />,
  },
];

// ============================================
// TAB CONTENT COMPONENT
// ============================================

const TabContent = ({ activeTab, onBookingClick }: { activeTab: number; onBookingClick: () => void }) => {
  const content = [
    {
      title: "Thực Đơn Đặc Biệt",
      description: "Khám phá những món ăn tinh túy từ khắp ba miền Việt Nam",
      cta: "Xem Thực Đơn",
      link: "/menu"
    },
    {
      title: "Đặt Tiệc Sang Trọng",
      description: "Không gian hoàn hảo cho mọi sự kiện của bạn",
      cta: "Đặt Tiệc Ngay",
      action: 'booking',
    },
    {
      title: "Liên Hệ Với Chúng Tôi",
      description: "Chúng tôi luôn sẵn sàng phục vụ quý khách",
      cta: "Gọi Ngay",
    },
    {
      title: "Blog Ẩm Thực",
      description: "Khám phá câu chuyện đằng sau mỗi món ăn",
      cta: "Đọc Thêm",
      link: "/blog"
    },
  ];

  const current = content[activeTab];

  return (
    <section className="min-h-[60vh] sm:min-h-screen flex items-center justify-center px-4 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-8">
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-gray-900 tracking-tight">
          {current.title}
        </h2>
        <p className="text-base sm:text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
          {current.description}
        </p>
        <GlassButton 
          size="lg"
          onClick={() => {
            if (current.action === 'booking') {
              onBookingClick();
            } else if (current.link) {
              window.location.href = current.link;
            }
          }}
        >
          {current.cta}
        </GlassButton>
      </div>
    </section>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function Home() {
  const [bgColor, setBgColor] = useState(bgColorsBody[0]);
  const [activeTab, setActiveTab] = useState(0);
  const [foodImages, setFoodImages] = useState<string[]>(FOOD_IMAGES);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    // Fetch menu item images from Supabase
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('menu_items')
        .select('image_url')
        .eq('is_available', true)
        .limit(12);

      if (!error && data && data.length > 0) {
        const images = (data as { image_url: string | null }[])
          .filter((item) => item.image_url)
          .map((item) => item.image_url as string);

        if (images.length > 0) {
          // Pad with fallback images if needed
          const paddedImages = [...images];
          while (paddedImages.length < 12) {
            paddedImages.push(FOOD_IMAGES[paddedImages.length % FOOD_IMAGES.length]);
          }
          setFoodImages(paddedImages.slice(0, 12));
        }
      }
    };
    
    fetchImages().catch(err => console.error("Supabase fetch error:", err));
  }, []);

  const handleTabChange = (index: number) => {
    setBgColor(bgColorsBody[index]);
    setActiveTab(index);
  };

  return (
    <div className="relative">
      {/* Fixed Tab Bar */}
      <AnimatedTabBar
        items={tabItems}
        defaultIndex={0}
        onTabChange={handleTabChange}
      />

      {/* Hero Section 1: Food Gallery */}
      <div className="w-full h-screen">
        <ScrollMorphHero
          images={foodImages}
          title="Tinh Hoa Ẩm Thực Việt"
          subtitle="CUỘN ĐỂ KHÁM PHÁ"
          description="Món Ngon Mỗi Ngày"
        />
      </div>

      {/* Tab-based Content Section */}
      <div
        className="transition-colors duration-700"
        style={{ backgroundColor: bgColor + "20" }}
      >
        <TabContent activeTab={activeTab} onBookingClick={() => setIsBookingOpen(true)} />
      </div>

      {/* Featured Categories: Interactive Image Accordion */}
      <LandingAccordionItem />

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-b from-white to-orange-50">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Với hơn 10 năm kinh nghiệm, chúng tôi tự hào mang đến dịch vụ nấu tiệc tại nhà chất lượng cao
            </p>
          </div>
          <FeatureCards />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Bảng Giá Dịch Vụ
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Đa dạng gói dịch vụ phù hợp với mọi nhu cầu và ngân sách
            </p>
          </div>
          <PricingCards />
        </div>
      </section>

      {/* Animated Footer */}
      <AnimatedFooter />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        mode="free"
      />
    </div>
  );
}
