"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Users } from "lucide-react";
import type { PricingPlan, TableTier, BookingPlanInfo } from "@/types/pricing";

// ─── Dữ liệu gói dịch vụ ────────────────────────────────────────────────────
const PLANS: PricingPlan[] = [
  {
    id: "basic",
    title: "Gói Cơ Bản",
    pricePerTable: {
      tier10: 2_500_000,
      tier50: 2_200_000,
    },
    description: "Phù hợp cho tiệc gia đình nhỏ, sinh nhật, thôi nôi",
    features: [
      "Thực đơn 8 món cơ bản",
      "Bàn tròn 10 người / bàn",
      "Nước ngọt & trà miễn phí",
      "Trang trí bàn tiệc đơn giản",
      "Nhân viên phục vụ chuyên nghiệp",
    ],
    ctaText: "Đặt Gói Cơ Bản",
    isFeatured: false,
  },
  {
    id: "standard",
    title: "Gói Tiêu Chuẩn",
    pricePerTable: {
      tier10: 3_500_000,
      tier50: 3_000_000,
    },
    description: "Lý tưởng cho tiệc cưới, hội nghị, kỷ niệm",
    features: [
      "Thực đơn 10 món đặc sắc",
      "Bàn tròn 10 người / bàn",
      "Bia, nước ngọt & trà miễn phí",
      "Trang trí hoa tươi theo chủ đề",
      "Nhân viên phục vụ riêng mỗi 5 bàn",
      "Bánh kem / cắt băng khai mạc",
      "Âm thanh & ánh sáng cơ bản",
    ],
    ctaText: "Đặt Gói Tiêu Chuẩn",
    isFeatured: true,
  },
  {
    id: "premium",
    title: "Gói Cao Cấp",
    pricePerTable: {
      tier10: 5_500_000,
      tier50: 4_800_000,
    },
    description: "Sang trọng tuyệt đối cho sự kiện đẳng cấp",
    features: [
      "Thực đơn 12 món cao cấp",
      "Bàn tròn 10 người / bàn",
      "Rượu vang, bia, nước ngọt không giới hạn",
      "Trang trí cao cấp theo yêu cầu",
      "Nhân viên phục vụ riêng mỗi 3 bàn",
      "MC chuyên nghiệp (2 tiếng)",
      "Âm thanh & ánh sáng chuyên nghiệp",
      "Chụp ảnh & quay phim sự kiện",
      "Hỗ trợ lên thực đơn riêng",
    ],
    ctaText: "Đặt Gói Cao Cấp",
    isFeatured: false,
  },
];

// ─── Helper format tiền VND ──────────────────────────────────────────────────
const formatVND = (amount: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

// ─── Animated digit component ────────────────────────────────────────────────
const AnimatedDigit: React.FC<{ digit: string; index: number }> = ({
  digit,
  index,
}) => (
  <div className="relative overflow-hidden inline-block min-w-[1ch] text-center">
    <AnimatePresence mode="wait">
      <motion.span
        key={digit}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="block"
      >
        {digit}
      </motion.span>
    </AnimatePresence>
  </div>
);

const ScrollingPrice: React.FC<{ value: number }> = ({ value }) => {
  const formatted = formatVND(value);
  return (
    <div className="flex items-center">
      {formatted.split("").map((char, i) => (
        <AnimatedDigit key={`${value}-${i}`} digit={char} index={i} />
      ))}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
interface PricingTableBanquetProps {
  onSelectPlan: (plan: BookingPlanInfo) => void;
}

const PricingTableBanquet: React.FC<PricingTableBanquetProps> = ({
  onSelectPlan,
}) => {
  const [tableTier, setTableTier] = useState<TableTier>(10);

  const handleSelectPlan = (plan: PricingPlan) => {
    const pricePerTable =
      tableTier === 10 ? plan.pricePerTable.tier10 : plan.pricePerTable.tier50;
    onSelectPlan({
      id: plan.id,
      title: plan.title,
      pricePerTable,
      defaultTableCount: tableTier,
    });
  };

  const getSavingPercent = (plan: PricingPlan): number => {
    const diff = plan.pricePerTable.tier10 - plan.pricePerTable.tier50;
    return Math.round((diff / plan.pricePerTable.tier10) * 100);
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Bảng Giá Dịch Vụ
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Chọn gói phù hợp với quy mô tiệc của bạn. Giá tính theo số bàn —
            càng nhiều bàn càng tiết kiệm.
          </p>
        </div>

        {/* Toggle +10 Bàn / +50 Bàn */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Tabs
            value={tableTier === 10 ? "tier10" : "tier50"}
            onValueChange={(v) => setTableTier(v === "tier10" ? 10 : 50)}
          >
            <TabsList className="flex w-full h-12">
              <TabsTrigger
                value="tier10"
                className="text-base font-medium flex items-center gap-2 flex-1 px-4 cursor-pointer"
              >
                <Users className="size-4" />
                ~10 Bàn
              </TabsTrigger>
              <TabsTrigger
                value="tier50"
                className="text-base font-medium flex items-center gap-2 flex-1 px-4 cursor-pointer"
              >
                <Users className="size-4" />
                ~50 Bàn
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium">
                  Ưu đãi
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
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
        {PLANS.map((plan, index) => {
          const pricePerTable =
            tableTier === 10
              ? plan.pricePerTable.tier10
              : plan.pricePerTable.tier50;
          const totalEstimate = pricePerTable * tableTier;
          const saving = getSavingPercent(plan);

          return (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              className="relative"
            >
              {/* Featured badge */}
              {plan.isFeatured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-primary to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    ⭐ Phổ biến nhất
                  </div>
                </div>
              )}

              <div
                className={`
                relative h-full p-6 sm:p-8 rounded-xl border-2 transition-all duration-300
                ${
                  plan.isFeatured
                    ? "border-primary bg-gradient-to-br from-accent to-red-50 dark:from-primary/15 dark:to-red-950/20 shadow-lg"
                    : "border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                }
              `}
              >
                {/* Plan Header */}
                <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                    {plan.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {plan.description}
                  </p>

                  {/* Giá / bàn với animation */}
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center flex-wrap gap-1">
                      <ScrollingPrice value={pricePerTable} />
                      <span className="text-sm sm:text-base text-muted-foreground font-normal">
                        /bàn
                      </span>
                    </div>

                    {/* Tổng tạm tính */}
                    <p className="text-sm text-muted-foreground">
                      ≈ {formatVND(totalEstimate)} cho {tableTier} bàn
                    </p>

                    {/* Badge tiết kiệm khi chọn 50 bàn */}
                    {tableTier === 50 && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full font-medium"
                      >
                        Tiết kiệm {saving}% so với gói ~10 bàn
                      </motion.span>
                    )}
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
          );
        })}
      </motion.div>
    </div>
  );
};

export default PricingTableBanquet;
