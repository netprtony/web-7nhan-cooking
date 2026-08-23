"use client";

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { X, TrendingUp, Send, CheckCircle2, Building2 } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { BookingPlanInfo } from '@/types/pricing';

export interface BookingMenuItem {
  title: string;
  quantity: number;
  price: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems?: BookingMenuItem[];
  tableCount?: number;
  serviceFeePercent?: number;
  mode?: 'menu' | 'free';
  plan?: BookingPlanInfo;
  prefillEmail?: string;
}

// Helper: Generate Investor Lead ID
function generateLeadId(): string {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AH-INV-${datePart}-${randomPart}`;
}

// Helper format tiền VND
const formatVND = (amount: number): string =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);

const INVESTMENT_TIERS = [
  'Gói Hạt Giống (500 triệu - 3% Cổ phần)',
  'Gói Tăng Trưởng (1.5 tỷ - 10% Cổ phần)',
  'Gói Chiến Lược (3 tỷ - 20% Cổ phần)',
  'Mức đầu tư khác (Thỏa thuận riêng)',
];

export function BookingModal({
  isOpen,
  onClose,
  plan,
  prefillEmail,
}: BookingModalProps) {
  const getDefaultTier = () => {
    if (plan?.title?.includes('Hạt Giống')) return INVESTMENT_TIERS[0];
    if (plan?.title?.includes('Tăng Trưởng')) return INVESTMENT_TIERS[1];
    if (plan?.title?.includes('Chiến Lược')) return INVESTMENT_TIERS[2];
    if (plan?.title) return `${plan.title} (${formatVND(plan.pricePerTable)})`;
    return INVESTMENT_TIERS[1]; // default to Growth
  };

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: prefillEmail || '',
    investorType: 'Cá nhân',
    investmentTier: getDefaultTier(),
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);

  // Sync prefill & plan updates
  useEffect(() => {
    if (prefillEmail) {
      setFormData((prev) => ({ ...prev, email: prefillEmail }));
    }
  }, [prefillEmail]);

  useEffect(() => {
    if (plan) {
      setFormData((prev) => ({
        ...prev,
        investmentTier: getDefaultTier(),
      }));
    }
  }, [plan]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setConfirmEmailSent(false);

    try {
      const leadId = generateLeadId();
      const customerEmail = formData.email;

      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
      const TEMPLATE_NOTIFY = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
      const TEMPLATE_CONFIRM = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONFIRM_BOOKING || '';

      const summaryText = `
💼 HỒ SƠ ĐĂNG KÝ ĐẦU TƯ AFTER HOURS
---------------------------------------
👤 Họ & Tên: ${formData.name}
📞 Số điện thoại: ${formData.phone}
✉️ Email: ${customerEmail || 'Không cung cấp'}
🏢 Đối tượng: ${formData.investorType}
💰 Gói đầu tư quan tâm: ${formData.investmentTier}
📝 Ghi chú / Yêu cầu: ${formData.notes || 'Không có ghi chú'}
🆔 Mã hồ sơ: ${leadId}
      `.trim();

      const commonParams = {
        from_name: formData.name,
        from_email: customerEmail || 'Không cung cấp',
        phone: formData.phone,
        date: new Date().toLocaleDateString('vi-VN'),
        tables: '1',
        address: formData.investorType,
        menu_items: summaryText,
        notes: formData.notes || 'Đăng ký nhận Pitch Deck & tư vấn đầu tư',
        order_id: leadId,
        plan_title: formData.investmentTier,
        plan_price_per_table: plan ? formatVND(plan.pricePerTable) : formData.investmentTier,
        total_price: plan ? formatVND(plan.pricePerTable) : formData.investmentTier,
      };

      // 1) Gửi email thông báo cho ban sáng lập
      if (SERVICE_ID && PUBLIC_KEY && TEMPLATE_NOTIFY) {
        await emailjs.send(
          SERVICE_ID,
          TEMPLATE_NOTIFY,
          {
            ...commonParams,
            to_email: 'huynhvikhang6a13@gmail.com',
          },
          PUBLIC_KEY
        );
      }

      // 2) Gửi email xác nhận cho nhà đầu tư
      if (customerEmail && SERVICE_ID && PUBLIC_KEY && TEMPLATE_CONFIRM) {
        try {
          await emailjs.send(
            SERVICE_ID,
            TEMPLATE_CONFIRM,
            {
              ...commonParams,
              to_email: customerEmail,
              to_name: formData.name,
            },
            PUBLIC_KEY
          );
          setConfirmEmailSent(true);
        } catch (confirmErr) {
          console.warn('Confirmation email error:', confirmErr);
        }
      }

      setStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        investorType: 'Cá nhân',
        investmentTier: INVESTMENT_TIERS[1],
        notes: '',
      });
    } catch (err) {
      console.error("Error sending investor inquiry email:", err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl z-10 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-5 border-b border-border bg-card/95 backdrop-blur-md rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Đăng Ký Tư Vấn Đầu Tư
              </h2>
              <p className="text-[11px] sm:text-xs text-muted-foreground">
                AFTER HOURS – Modern Dining
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Plan Highlight (if opened from investment packages) */}
        {plan && (
          <div className="p-4 border-b border-border bg-primary/5">
            <div className="flex items-start justify-between gap-3 bg-background border border-primary/20 rounded-xl p-3.5 shadow-sm">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">Gói Được Chọn</span>
                </div>
                <h4 className="text-sm font-bold text-primary">{plan.title}</h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Mức Đầu Tư</span>
                <span className="text-sm font-extrabold text-foreground">
                  {formatVND(plan.pricePerTable)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Subtitle description */}
        <div className="px-4 sm:px-6 pt-4 pb-1">
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Nhận đầy đủ <strong className="text-foreground">Hồ Sơ Gọi Vốn (Pitch Deck)</strong>, bảng kế hoạch tài chính và đặt lịch trao đổi bảo mật cùng Ban Điều Hành.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Họ tên & SĐT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                Họ và Tên <span className="text-destructive">*</span>
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Nguyễn Văn A"
                className="h-10 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                Số Điện Thoại <span className="text-destructive">*</span>
              </label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="VD: 0909 123 456"
                className="h-10 text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
              Email Nhận Tài Liệu <span className="text-destructive">*</span>
            </label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="investor@example.com"
              className="h-10 text-sm"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Hồ sơ Pitch Deck & số liệu tài chính sẽ được gửi tự động tới email này.
            </p>
          </div>

          {/* Gói đầu tư quan tâm & Đối tượng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                Gói Đầu Tư Quan Tâm
              </label>
              <select
                value={formData.investmentTier}
                onChange={(e) => setFormData({ ...formData, investmentTier: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                {INVESTMENT_TIERS.map((tier) => (
                  <option key={tier} value={tier}>
                    {tier}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                Tư Cách Đầu Tư
              </label>
              <select
                value={formData.investorType}
                onChange={(e) => setFormData({ ...formData, investorType: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="Nhà đầu tư cá nhân (Angel)">Nhà đầu tư cá nhân (Angel)</option>
                <option value="Quỹ đầu tư / Doanh nghiệp">Quỹ đầu tư / Doanh nghiệp</option>
                <option value="Đối tác chiến lược F&B">Đối tác chiến lược F&B</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
              Ghi chú thêm hoặc câu hỏi (nếu có)
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="VD: Muốn trao đổi trực tiếp với founder về kế hoạch mở chi nhánh..."
              rows={2}
              className="text-sm resize-none"
            />
          </div>

          {/* Submit button */}
          <GlassButton
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full mt-2"
            contentClassName="flex items-center justify-center gap-2 font-semibold"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Đang gửi thông tin...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Nhận Hồ Sơ Pitch Deck & Tư Vấn
              </>
            )}
          </GlassButton>

          {/* Feedback states */}
          {status === 'success' && (
            <div className="p-3.5 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="text-green-600 dark:text-green-400 font-semibold">Đăng ký thành công!</p>
                <p className="text-muted-foreground mt-0.5">
                  {confirmEmailSent
                    ? 'Bộ hồ sơ đã được gửi đến email của bạn. Ban Điều Hành sẽ liên hệ trong 24h.'
                    : 'Ban Điều Hành AFTER HOURS sẽ liên hệ với bạn trong thời gian sớm nhất.'}
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-center">
              <p className="text-destructive text-xs sm:text-sm font-medium">
                Có lỗi xảy ra khi gửi. Vui lòng thử lại hoặc liên hệ hotline: 038 671 4512
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
