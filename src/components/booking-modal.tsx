"use client";

import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { X, UtensilsCrossed, Send, ChevronRight } from 'lucide-react';
import { GlassButton } from '@/components/ui/glass-button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import type { BookingPlanInfo } from '@/types/pricing';

// ============================================
// TYPES
// ============================================

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

// ============================================
// HELPER: Generate order ID
// ============================================
function generateOrderId(): string {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `7N-${datePart}-${randomPart}`;
}

// ============================================
// BOOKING MODAL COMPONENT
// ============================================

// Helper format tiền VND
const formatVND = (amount: number): string =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);

export function BookingModal({
  isOpen,
  onClose,
  menuItems = [],
  tableCount = 1,
  serviceFeePercent = 0,
  mode = 'free',
  plan,
  prefillEmail,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: prefillEmail || '',
    date: '',
    tables: plan?.defaultTableCount?.toString() || '1',
    address: '',
    customMenu: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);

  // Sync prefillEmail from footer into form when modal opens
  useEffect(() => {
    if (prefillEmail) {
      setFormData((prev) => ({ ...prev, email: prefillEmail }));
    }
  }, [prefillEmail]);

  if (!isOpen) return null;

  // Build menu summary text for email
  const buildMenuSummary = (): string => {
    if (mode === 'menu' && menuItems.length > 0) {
      const lines = menuItems.map(
        (item) =>
          `- ${item.title} x${item.quantity} (${(item.price * item.quantity).toLocaleString('vi-VN')}₫)`
      );
      const itemsTotal = menuItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const totalWithTables = itemsTotal * tableCount;
      const serviceFeeAmount = Math.round(totalWithTables * (serviceFeePercent / 100));
      const grandTotal = totalWithTables + serviceFeeAmount;

      lines.push('');
      lines.push(`Số bàn: ${tableCount}`);
      lines.push(`Tổng món ăn: ${itemsTotal.toLocaleString('vi-VN')}₫`);
      lines.push(`Tổng x ${tableCount} bàn: ${totalWithTables.toLocaleString('vi-VN')}₫`);
      if (serviceFeePercent > 0) {
        lines.push(`Phí phục vụ (${serviceFeePercent}%): ${serviceFeeAmount.toLocaleString('vi-VN')}₫`);
      }
      lines.push(`TỔNG CỘNG: ${grandTotal.toLocaleString('vi-VN')}₫`);
      return lines.join('\n');
    }
    return formData.customMenu || '(Khách chưa chọn món)';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setConfirmEmailSent(false);

    try {
      const menuSummary = buildMenuSummary();
      const tablesValue = mode === 'menu' ? String(tableCount) : formData.tables;
      const orderId = generateOrderId();
      const customerEmail = formData.email; // lưu email trước khi reset form

      const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';
      const TEMPLATE_NOTIFY = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
      const TEMPLATE_CONFIRM = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONFIRM_BOOKING || '';

      // Kiểm tra cấu hình EmailJS
      if (!SERVICE_ID || !PUBLIC_KEY || !TEMPLATE_NOTIFY) {
        console.error('EmailJS config missing:', { SERVICE_ID: !!SERVICE_ID, PUBLIC_KEY: !!PUBLIC_KEY, TEMPLATE_NOTIFY: !!TEMPLATE_NOTIFY });
        throw new Error('Thiếu cấu hình EmailJS');
      }

      // Build plan summary for email
      const planSummary = plan
        ? `\n📦 GÓI DỊCH VỤ: ${plan.title}\n💰 GIÁ / BÀN: ${formatVND(plan.pricePerTable)}\n🍽️ SỐ BÀN: ${tablesValue} bàn\n💵 TỔNG TẠM TÍNH: ${formatVND(plan.pricePerTable * Number(tablesValue))}\n`
        : '';

      const commonParams = {
        from_name: formData.name,
        from_email: customerEmail || 'Không cung cấp',
        phone: formData.phone,
        date: formData.date,
        tables: tablesValue,
        address: formData.address,
        menu_items: planSummary ? planSummary + '\n' + menuSummary : menuSummary,
        notes: formData.notes || 'Không có ghi chú',
        order_id: orderId,
        plan_title: plan?.title ?? '',
        plan_price_per_table: plan ? formatVND(plan.pricePerTable) : '',
        total_price: plan ? formatVND(plan.pricePerTable * Number(tablesValue)) : '',
      };

      // 1) Gửi email thông báo cho chủ tiệc
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_NOTIFY,
        {
          ...commonParams,
          to_email: 'huynhvikhang6a13@gmail.com',
        },
        PUBLIC_KEY
      );

      // 2) Gửi email xác nhận cho khách hàng
      if (customerEmail && TEMPLATE_CONFIRM) {
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
          console.log('Confirmation email sent to:', customerEmail);
        } catch (confirmErr) {
          console.warn('Confirmation email failed:', confirmErr);
          // Không fail toàn bộ submission nếu email xác nhận lỗi
        }
      } else {
        if (!customerEmail) console.log('No customer email provided, skipping confirmation');
        if (!TEMPLATE_CONFIRM) console.warn('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONFIRM_BOOKING is not configured');
      }

      setStatus('success');
      setFormData({
        name: '',
        phone: '',
        email: '',
        date: '',
        tables: plan?.defaultTableCount?.toString() || '1',
        address: '',
        customMenu: '',
        notes: '',
      });
    } catch (err) {
      console.error("Error sending booking email:", err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-3 sm:mx-4 max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-5 border-b dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Đặt Tiệc</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Pre-filled Menu Items (mode = 'menu') */}
        {mode === 'menu' && menuItems.length > 0 && (
          <div className="p-4 sm:p-5 border-b dark:border-neutral-700 bg-accent/50 dark:bg-primary/15">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Thực đơn đã chọn:</h3>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {menuItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {item.title} <span className="text-gray-400 dark:text-gray-500">x{item.quantity}</span>
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-primary/30 dark:border-primary/60 space-y-1 text-sm">
              {(() => {
                const itemsTotal = menuItems.reduce((s, i) => s + i.price * i.quantity, 0);
                const totalWithTables = itemsTotal * tableCount;
                const serviceFeeAmount = Math.round(totalWithTables * (serviceFeePercent / 100));
                const grandTotal = totalWithTables + serviceFeeAmount;
                return (
                  <>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Tổng món ăn</span>
                      <span>{itemsTotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>× {tableCount} bàn</span>
                      <span>{totalWithTables.toLocaleString('vi-VN')}₫</span>
                    </div>
                    {serviceFeePercent > 0 && (
                      <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>Phí phục vụ ({serviceFeePercent}%)</span>
                        <span>{serviceFeeAmount.toLocaleString('vi-VN')}₫</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-primary pt-1">
                      <span>Tổng cộng</span>
                      <span>{grandTotal.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* Plan Info (when opened from pricing table) */}
        {plan && (
          <div className="p-4 sm:p-5 border-b dark:border-neutral-700 bg-accent/50 dark:bg-primary/15">
            <div className="rounded-lg border border-primary/30 dark:border-primary/60 bg-white dark:bg-neutral-900 p-4 space-y-1">
              <p className="font-semibold text-foreground">📦 {plan.title}</p>
              <p className="text-sm text-muted-foreground">
                {formatVND(plan.pricePerTable)} / bàn
              </p>
              <p className="text-sm font-medium text-primary dark:text-primary/70">
                Tổng tạm tính: {formatVND(plan.pricePerTable * Number(formData.tables || plan.defaultTableCount))}
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {/* Free-form menu (mode = 'free') */}
          {mode === 'free' && !plan && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Món ăn mong muốn
                </label>
                <Link
                  href="/menu"
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary font-medium"
                  onClick={onClose}
                >
                  Xem thực đơn <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <Textarea
                value={formData.customMenu}
                onChange={(e) => setFormData({ ...formData, customMenu: e.target.value })}
                placeholder="VD: Gà nướng mật ong, Tôm hùm hấp, Lẩu thái hải sản..."
                rows={3}
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Bạn có thể ghi tên món hoặc xem thực đơn để tham khảo
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Họ và Tên <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Số Điện Thoại <span className="text-red-500">*</span>
              </label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0901234567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email <span className="text-xs text-gray-400 dark:text-gray-500">(để nhận xác nhận đặt tiệc)</span>
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Ngày Tổ Chức <span className="text-red-500">*</span>
              </label>
              <Input
                required
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            {mode === 'free' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Số Bàn <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={formData.tables}
                  onChange={(e) => setFormData({ ...formData, tables: e.target.value })}
                  placeholder="10"
                />
              </div>
            )}
            {mode === 'menu' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Số Bàn
                </label>
                <div className="flex items-center h-10 px-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {tableCount} bàn
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Địa Chỉ Tổ Chức <span className="text-red-500">*</span>
            </label>
            <Input
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Số nhà, đường, quận/huyện, TP..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Ghi chú thêm
            </label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm, thời gian phục vụ..."
              rows={2}
            />
          </div>

          {/* Email hint */}
          {!formData.email && (
            <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg">
              💡 Nhập email để nhận xác nhận đặt tiệc tự động
            </p>
          )}

          {/* Submit */}
          <GlassButton
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full"
            contentClassName="flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Gửi Yêu Cầu Đặt Tiệc
              </>
            )}
          </GlassButton>

          {status === 'success' && (
            <div className="text-center p-3 bg-green-50 dark:bg-green-950/30 rounded-xl">
              <p className="text-green-600 font-medium">✅ Đã gửi thành công!</p>
              <p className="text-green-500 text-sm mt-1">
                {confirmEmailSent
                  ? 'Kiểm tra email để nhận xác nhận đặt tiệc.'
                  : 'Chúng tôi sẽ liên hệ với bạn sớm nhất.'}
              </p>
            </div>
          )}
          {status === 'error' && (
            <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-xl">
              <p className="text-red-600 font-medium">Có lỗi xảy ra. Vui lòng thử lại.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
