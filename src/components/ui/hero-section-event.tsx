"use client";

import { motion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import { TextAnimate } from "@/components/ui/text-animate";
import { LatestBlogCards } from "@/components/sections/latest-blog-cards";
import { cn } from "@/lib/utils";
import React from "react";;

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

// Default props phù hợp với ngữ cảnh đặt tiệc
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

const HeroSectionEvent = ({
  subtitle = defaultSubtitle,
  actions = [],
  stats = defaultStats,
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
          <div className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
            <TextAnimate
              animation="blurInUp"
              by="word"
              as="h1"
              once
              className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            >
              Không gian tiệc đẳng cấp và tinh tế
            </TextAnimate>
          </div>
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

        {/* Right Column: Latest Blog Cards */}
        <motion.div
          className="w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <LatestBlogCards />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSectionEvent;
