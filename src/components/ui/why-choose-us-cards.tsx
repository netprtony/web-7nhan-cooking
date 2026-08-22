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
    title: "Mô Hình Kinh Doanh Bền Vững",
    description:
      "Doanh thu ổn định, biên lợi nhuận gộp 35%. Tiềm năng tăng trưởng mạnh mẽ trong ngành F&B.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: "Thương Hiệu Mạnh",
    description:
      "Nhận diện thương hiệu cao trong phân khúc khách hàng trẻ tuổi và trung lưu. Lượng khách hàng thân thiết lớn.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    title: "Đội Ngũ Chuyên Nghiệp",
    description:
      "Ban điều hành giàu kinh nghiệm. Đội ngũ vận hành bài bản, quy trình quản lý chất lượng nghiêm ngặt.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    title: "Kế Hoạch Mở Rộng",
    description:
      "Kế hoạch mở 5 chi nhánh trong 3 năm. Lộ trình phát triển rõ ràng với chiến lược thâm nhập thị trường tối ưu.",
    icon: (
      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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
            Vì Sao Đầu Tư AFTER HOURS?
          </h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Cơ hội đầu tư hấp dẫn vào chuỗi nhà hàng hiện đại với mô hình đã được kiểm chứng và tiềm năng sinh lời vượt trội.
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
