"use client"

import type React from "react"
import { Warp } from "@paper-design/shaders-react"

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
}

const features: Feature[] = [
  {
    title: "Không Gian Sang Trọng",
    description:
      "Hệ thống phòng tiệc đa dạng từ 50 đến 500 khách, trang trí tinh tế theo từng chủ đề sự kiện riêng biệt.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    title: "Thực Đơn Phong Phú",
    description:
      "Hơn 50 món ăn đặc sắc từ ẩm thực Việt Nam và quốc tế, được chế biến bởi đội ngũ đầu bếp 5 sao.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.05zM1 21.99V21h15.03v.99c0 .55-.45 1-1.01 1H2.01c-.56 0-1.01-.45-1.01-1zm15.03-7c0-5.22-6.5-5.22-6.5-5.22H1v4c0 1.1.9 2 2 2h14.03v-.78z" />
      </svg>
    ),
  },
  {
    title: "Đội Ngũ Chuyên Nghiệp",
    description:
      "Hơn 200 nhân viên phục vụ được đào tạo bài bản, tận tâm chăm sóc từng chi tiết để buổi tiệc diễn ra hoàn hảo.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    title: "Giá Cả Minh Bạch",
    description:
      "Báo giá rõ ràng, không phát sinh chi phí ẩn. Nhiều gói dịch vụ linh hoạt phù hợp với mọi ngân sách.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
      </svg>
    ),
  },
  {
    title: "Đặt Tiệc Dễ Dàng",
    description:
      "Đặt bàn online 24/7, xác nhận ngay lập tức. Hỗ trợ tư vấn tận tình qua điện thoại và Zalo.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
      </svg>
    ),
  },
  {
    title: "10 Năm Kinh Nghiệm",
    description:
      "Hơn 500 buổi tiệc thành công, được tin tưởng bởi hàng nghìn khách hàng và doanh nghiệp trên toàn quốc.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
]

// Shader config — tông đỏ/cam/vàng/nâu cho nhà hàng
const shaderConfigs = [
  {
    proportion: 0.35,
    softness: 0.9,
    distortion: 0.15,
    swirl: 0.7,
    swirlIterations: 10,
    shape: "checks" as const,
    shapeScale: 0.1,
    colors: [
      "hsl(0, 80%, 25%)",
      "hsl(15, 100%, 55%)",
      "hsl(5, 90%, 35%)",
      "hsl(20, 100%, 65%)",
    ],
  },
  {
    proportion: 0.4,
    softness: 1.1,
    distortion: 0.2,
    swirl: 0.85,
    swirlIterations: 12,
    shape: "stripes" as const,
    shapeScale: 0.12,
    colors: [
      "hsl(30, 100%, 30%)",
      "hsl(50, 100%, 60%)",
      "hsl(40, 90%, 40%)",
      "hsl(45, 100%, 70%)",
    ],
  },
  {
    proportion: 0.38,
    softness: 0.95,
    distortion: 0.17,
    swirl: 0.75,
    swirlIterations: 9,
    shape: "checks" as const,
    shapeScale: 0.09,
    colors: [
      "hsl(25, 70%, 25%)",
      "hsl(35, 90%, 55%)",
      "hsl(30, 80%, 30%)",
      "hsl(40, 100%, 65%)",
    ],
  },
  {
    proportion: 0.42,
    softness: 1.0,
    distortion: 0.18,
    swirl: 0.8,
    swirlIterations: 11,
    shape: "stripes" as const,
    shapeScale: 0.11,
    colors: [
      "hsl(345, 80%, 28%)",
      "hsl(10, 100%, 58%)",
      "hsl(355, 85%, 35%)",
      "hsl(15, 100%, 68%)",
    ],
  },
  {
    proportion: 0.36,
    softness: 0.85,
    distortion: 0.16,
    swirl: 0.65,
    swirlIterations: 8,
    shape: "checks" as const,
    shapeScale: 0.1,
    colors: [
      "hsl(42, 90%, 28%)",
      "hsl(55, 100%, 55%)",
      "hsl(48, 85%, 33%)",
      "hsl(52, 100%, 65%)",
    ],
  },
  {
    proportion: 0.44,
    softness: 1.05,
    distortion: 0.21,
    swirl: 0.9,
    swirlIterations: 13,
    shape: "edge" as const,
    shapeScale: 0.13,
    colors: [
      "hsl(340, 75%, 22%)",
      "hsl(5, 95%, 52%)",
      "hsl(350, 80%, 30%)",
      "hsl(360, 100%, 62%)",
    ],
  },
]

const getShaderConfig = (index: number) =>
  shaderConfigs[index % shaderConfigs.length]

export default function WhyChooseUsCards() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-background dark:to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
            Tại Sao Chọn Chúng Tôi?
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Hơn 10 năm kinh nghiệm tổ chức tiệc — chúng tôi cam kết mang đến
            buổi tiệc hoàn hảo, đáng nhớ cho mọi dịp đặc biệt của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const cfg = getShaderConfig(index)
            return (
              <div key={index} className="relative h-72 sm:h-80">
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <Warp
                    style={{ height: "100%", width: "100%" }}
                    proportion={cfg.proportion}
                    softness={cfg.softness}
                    distortion={cfg.distortion}
                    swirl={cfg.swirl}
                    swirlIterations={cfg.swirlIterations}
                    shape={cfg.shape}
                    shapeScale={cfg.shapeScale}
                    scale={1}
                    rotation={0}
                    speed={0.8}
                    colors={cfg.colors}
                  />
                </div>
                <div className="relative z-10 p-6 sm:p-8 rounded-3xl h-full flex flex-col bg-black/75 border border-white/20 dark:border-white/10">
                  <div className="mb-4 sm:mb-5 filter drop-shadow-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed flex-grow text-gray-100 font-medium text-sm">
                    {feature.description}
                  </p>
                  <div className="mt-4 sm:mt-5 flex items-center text-sm font-bold text-gray-200">
                    <span className="mr-2">Tìm hiểu thêm</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
