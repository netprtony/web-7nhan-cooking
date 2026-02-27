"use client";

import { useState } from 'react';
import { GlassButton } from '@/components/ui/glass-button';
import { BookingModal } from '@/components/booking-modal';
import { Calendar } from 'lucide-react';

export function BookingForm() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  return (
    <section className="relative py-8 sm:py-16 overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/assets/bg4.jpg')" }}
      />
      <div className="absolute inset-0 backdrop-blur-sm bg-orange-50/90" />
      
      <div className="relative container mx-auto px-3 sm:px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
            Đặt Tiệc Ngay
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-lg mx-auto">
            Hãy để chúng tôi phục vụ bữa tiệc hoàn hảo cho bạn. Điền thông tin để nhận báo giá ngay!
          </p>
          <GlassButton
            size="lg"
            onClick={() => setIsBookingOpen(true)}
            contentClassName="flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Đặt Tiệc Ngay
          </GlassButton>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        mode="free"
      />
    </section>
  );
}
