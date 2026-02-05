"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";

export default function AnimatedFooter() {
  return (
    <footer className="relative overflow-hidden">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: "url('/assets/bg2.jpg')" }}
      />
      <div className="absolute inset-0 backdrop-blur-md bg-slate-900/80" />
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"
          animate={{
            x: [-50, 50, -50],
            y: [-50, 50, -50],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Dịch vụ nấu ăn Bảy Nhân</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Nhận tất cả các loại tiệc: Cưới hỏi, Liên hoan, Sinh nhật, Hội nghị. Với hơn 20 năm kinh nghiệm, chúng tôi cam kết thực phẩm tươi sống và giá cả hợp lý nhất.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-white hover:text-purple-400 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-purple-400 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-purple-400 transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên Kết</h4>
            <ul className="space-y-2">
              {["Thực Đơn", "Đặt Tiệc", "Liên Hệ", "Blog"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-white transition text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-300 text-sm">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-purple-400" />
                <span>Phục vụ tận nơi tại TP.HCM và các tỉnh lân cận</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <Phone className="w-5 h-5 flex-shrink-0 text-purple-400" />
                <span>0909 947 086</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300 text-sm">
                <Mail className="w-5 h-5 flex-shrink-0 text-purple-400" />
                <span>lienhe@baynhancooking.vn</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Nhận Tin Khuyến Mãi</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-400"
              />
              <GlassButton size="sm">
                Gửi
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400 text-sm">
          <p>© 2026 Nhóm Nấu 7Nhân. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
