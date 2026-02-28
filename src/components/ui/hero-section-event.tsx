"use client";

import { motion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

// Define the props for reusability
interface StatProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

interface ActionProps {
  text: string;
  onClick: () => void;
  variant?: ButtonProps["variant"];
  className?: string;
}

interface HeroSectionEventProps {
  title?: React.ReactNode;
  subtitle?: string;
  actions?: ActionProps[];
  stats?: StatProps[];
  images?: string[];
  className?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

// Default props phù hợp với ngữ cảnh đặt tiệc
const defaultTitle = (
  <>
    Không gian tiệc <br />
    <span className="text-orange-600 dark:text-orange-400">đẳng cấp & tinh tế</span>
  </>
);

const defaultSubtitle =
  "Trải nghiệm ẩm thực đỉnh cao với thực đơn phong phú, không gian sang trọng và dịch vụ chuyên nghiệp. Đặt bàn ngay hôm nay để có buổi tiệc hoàn hảo.";

const defaultStats: StatProps[] = [
  {
    value: "500+",
    label: "Tiệc thành công",
    icon: <span className="text-lg">🍽️</span>,
  },
  {
    value: "50+",
    label: "Món đặc sắc",
    icon: <span className="text-lg">👨‍🍳</span>,
  },
  {
    value: "4.9★",
    label: "Đánh giá khách hàng",
    icon: <span className="text-lg">⭐</span>,
  },
];

const defaultImages = [
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
];

const HeroSectionEvent = ({
  title = defaultTitle,
  subtitle = defaultSubtitle,
  actions = [],
  stats = defaultStats,
  images = defaultImages,
  className,
}: HeroSectionEventProps) => {
  return (
    <section
      className={cn(
        "w-full overflow-hidden bg-background py-12 sm:py-24 transition-colors duration-300",
        className
      )}
    >
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2 lg:gap-8">
        {/* Left Column: Text Content */}
        <motion.div
          className="flex flex-col items-center text-center lg:items-start lg:text-left"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            variants={itemVariants}
          >
            {title}
          </motion.h1>
          <motion.p
            className="mt-6 max-w-md text-lg text-muted-foreground"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start"
            variants={itemVariants}
          >
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                variant={action.variant}
                size="lg"
                className={action.className}
              >
                {action.text}
              </Button>
            ))}
          </motion.div>
          <motion.div
            className="mt-12 flex flex-wrap justify-center gap-8 lg:justify-start"
            variants={itemVariants}
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column: Image Collage */}
        <motion.div
          className="relative h-[400px] w-full sm:h-[500px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Decorative Shapes - warm restaurant colors */}
          <motion.div
            className="absolute -top-4 left-1/4 h-16 w-16 rounded-full bg-orange-200/50 dark:bg-orange-800/30"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-0 right-1/4 h-12 w-12 rounded-lg bg-red-200/50 dark:bg-red-800/30"
            variants={floatingVariants}
            animate="animate"
          />
          <motion.div
            className="absolute bottom-1/4 left-4 h-6 w-6 rounded-full bg-yellow-200/50 dark:bg-yellow-800/30"
            variants={floatingVariants}
            animate="animate"
          />

          {/* Images */}
          <motion.div
            className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-2xl bg-muted p-2 shadow-lg sm:h-64 sm:w-64"
            variants={imageVariants}
          >
            <img
              src={images[0]}
              alt="Không gian tiệc"
              className="h-full w-full rounded-xl object-cover"
            />
          </motion.div>
          <motion.div
            className="absolute right-0 top-1/3 h-40 w-40 rounded-2xl bg-muted p-2 shadow-lg sm:h-56 sm:w-56"
            variants={imageVariants}
          >
            <img
              src={images[1]}
              alt="Món ăn đặc sắc"
              className="h-full w-full rounded-xl object-cover"
            />
          </motion.div>
          <motion.div
            className="absolute bottom-0 left-0 h-32 w-32 rounded-2xl bg-muted p-2 shadow-lg sm:h-48 sm:w-48"
            variants={imageVariants}
          >
            <img
              src={images[2]}
              alt="Không gian nhà hàng"
              className="h-full w-full rounded-xl object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSectionEvent;
