"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, TrendingUp, Shield, Star } from "lucide-react";
import type { BookingPlanInfo } from "@/types/pricing";

const formatVND = (amount: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

interface InvestmentPlan {
  id: string;
  title: string;
  amount: number;
  equity: string;
  description: string;
  features: string[];
  ctaText: string;
  isFeatured: boolean;
  icon: React.ReactNode;
  highlight?: string;
}

const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: "seed",
    title: "Gói Hạt Giống",
    amount: 500_000_000,
    equity: "3%",
    description: "Đồng hành từ những bước đầu, nhận cổ phần ưu đãi",
    features: [
      "Cổ phần 3% vốn điều lệ",
      "Báo cáo tài chính hàng quý",
      "Ưu đãi 20% khi dùng bữa tại nhà hàng",
      "Tham dự sự kiện cổ đông thường niên",
      "Quyền ưu tiên tăng vốn đợt tiếp theo",
    ],
    ctaText: "Tìm Hiểu Gói Hạt Giống",
    isFeatured: false,
    icon: <TrendingUp className="size-5" />,
  },
  {
    id: "growth",
    title: "Gói Tăng Trưởng",
    amount: 1_500_000_000,
    equity: "10%",
    description: "Gói chiến lược dành cho nhà đầu tư nghiêm túc",
    features: [
      "Cổ phần 10% vốn điều lệ",
      "Ghế Hội đồng Cố vấn",
      "Báo cáo tài chính & vận hành hàng tháng",
      "Ưu đãi 30% khi dùng bữa tại nhà hàng",
      "Quyền biểu quyết các quyết định lớn",
      "Chia sẻ lợi nhuận theo quý",
      "Quyền ưu tiên mở rộng chi nhánh",
    ],
    ctaText: "Tìm Hiểu Gói Tăng Trưởng",
    isFeatured: true,
    icon: <Star className="size-5" />,
    highlight: "Phổ biến nhất",
  },
  {
    id: "strategic",
    title: "Gói Chiến Lược",
    amount: 3_000_000_000,
    equity: "20%",
    description: "Đối tác chiến lược, cùng định hình tương lai thương hiệu",
    features: [
      "Cổ phần 20% vốn điều lệ",
      "Ghế Hội đồng Quản trị",
      "Toàn quyền truy cập báo cáo real-time",
      "Miễn phí dùng bữa tại nhà hàng (VIP Card)",
      "Quyền biểu quyết & phủ quyết",
      "Chia sẻ lợi nhuận ưu tiên",
      "Đồng quyết định mở rộng & nhượng quyền",
      "Thương hiệu cá nhân trên vật phẩm nhà hàng",
      "Ưu tiên nhượng quyền chi nhánh mới",
    ],
    ctaText: "Liên Hệ Đầu Tư Chiến Lược",
    isFeatured: false,
    icon: <Shield className="size-5" />,
  },
];

interface PricingTableBanquetProps {
  onSelectPlan: (plan: BookingPlanInfo) => void;
}

const PricingTableBanquet: React.FC<PricingTableBanquetProps> = ({
  onSelectPlan,
}) => {
  const handleSelectPlan = (plan: InvestmentPlan) => {
    onSelectPlan({
      id: plan.id,
      title: plan.title,
      pricePerTable: plan.amount,
      defaultTableCount: 1,
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-12 sm:space-y-16">
      {/* Header */}
      <motion.div
        className="text-center space-y-6 sm:space-y-8"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <div className="space-y-3 sm:space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium">
            Cơ Hội Đầu Tư
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Chọn Gói Đầu Tư
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Gọi vốn <span className="font-bold text-primary">3 tỷ VND</span> cho{" "}
            <span className="font-bold text-primary">20% cổ phần</span> — Cùng
            xây dựng thương hiệu ẩm thực hiện đại hàng đầu.
          </p>
        </div>

        {/* Key metrics */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-primary">15 tỷ</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Định giá công ty</p>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">35%</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Biên lợi nhuận gộp</p>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">2 năm</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Hoàn vốn dự kiến</p>
          </div>
        </div>
      </motion.div>

      {/* Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
          },
        }}
      >
        {INVESTMENT_PLANS.map((plan, index) => (
          <motion.div
            key={plan.id}
            variants={cardVariants}
            className="relative"
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-primary to-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                  ⭐ {plan.highlight}
                </div>
              </div>
            )}

            <div
              className={`
                relative h-full p-6 sm:p-8 rounded-xl border-2 transition-all duration-300
                ${
                  plan.isFeatured
                    ? "border-primary bg-gradient-to-br from-accent to-primary/5 dark:from-primary/15 dark:to-amber-950/20 shadow-lg"
                    : "border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                }
              `}
            >
              {/* Plan Header */}
              <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
                  {plan.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  {plan.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {plan.description}
                </p>

                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-bold text-foreground">
                    {formatVND(plan.amount)}
                  </div>
                  <p className="text-lg font-semibold text-primary">
                    {plan.equity} cổ phần
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6 sm:mb-8">
                {plan.features.map((feature, fi) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.3 + index * 0.1 + fi * 0.05,
                    }}
                    className="flex items-start gap-3"
                  >
                    <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                variant={plan.isFeatured ? "default" : "outline"}
                size="lg"
                className="w-full"
                onClick={() => handleSelectPlan(plan)}
              >
                {plan.ctaText}
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Trust note */}
      <motion.p
        className="text-center text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        Mọi thông tin đầu tư được bảo mật. Liên hệ trực tiếp để nhận bản
        Pitch Deck chi tiết và lịch họp với ban điều hành.
      </motion.p>
    </div>
  );
};

export default PricingTableBanquet;
