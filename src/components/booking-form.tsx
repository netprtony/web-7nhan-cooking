"use client";

import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    guests: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID',
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          date: formData.date,
          guests: formData.guests,
          message: formData.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'
      );

      setStatus('success');
      setFormData({ name: '', phone: '', email: '', date: '', guests: '', message: '' });
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/assets/bg4.jpg')" }}
      />
      <div className="absolute inset-0 backdrop-blur-sm bg-orange-50/90" />
      
      <div className="relative container mx-auto px-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-900">Đặt Tiệc Ngay</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-orange-100">
          <div>
            <label className="block text-sm font-medium mb-2">Họ và Tên</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Số Điện Thoại</label>
            <Input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="0901234567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ngày Tổ Chức</label>
            <Input
              required
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Số Khách</label>
            <Input
              required
              type="number"
              min="1"
              value={formData.guests}
              onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              placeholder="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Yêu Cầu Thêm</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Ghi chú đặc biệt..."
              rows={4}
            />
          </div>

          <GlassButton
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full"
          >
            {isSubmitting ? 'Đang Gửi...' : 'Gửi Yêu Cầu Đặt Tiệc'}
          </GlassButton>

          {status === 'success' && (
            <p className="text-green-600 text-center font-medium">✓ Đã gửi thành công! Chúng tôi sẽ liên hệ sớm.</p>
          )}
          {status === 'error' && (
            <p className="text-red-600 text-center">Có lỗi xảy ra. Vui lòng thử lại.</p>
          )}
        </form>
      </div>
      </div>
    </section>
  );
}
