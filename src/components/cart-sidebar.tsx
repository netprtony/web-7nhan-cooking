"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, X, Plus, Minus, Trash2, Percent } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { BookingModal, BookingMenuItem } from "@/components/booking-modal";
import { useCartContext } from "@/context/cart-context";
import { useCartUI } from "@/context/cart-ui-context";

export function CartSidebar() {
  const { isCartOpen, closeCart } = useCartUI();
  const {
    items: cart,
    removeItem,
    updateQuantity: cartUpdateQty,
    clearCart,
    totalItems,
  } = useCartContext();

  const [tableCount, setTableCount] = useState(1);
  const [serviceFee, setServiceFee] = useState(10);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const updateQuantity = (itemId: string, delta: number) => {
    const existing = cart.find((i) => i.id === itemId);
    if (existing) {
      cartUpdateQty(itemId, existing.quantity + delta);
    }
  };

  const itemsSubtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalWithTables = itemsSubtotal * tableCount;
  const serviceFeeAmount = Math.round(totalWithTables * (serviceFee / 100));
  const grandTotal = totalWithTables + serviceFeeAmount;

  const bookingMenuItems: BookingMenuItem[] = cart.map((item) => ({
    title: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[60]">
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeCart}
            />

            {/* Sidebar panel */}
            <motion.div
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-full max-w-[95vw] sm:max-w-md bg-white dark:bg-neutral-900 shadow-2xl flex flex-col"
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b dark:border-neutral-700">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                  <h2 className="text-lg sm:text-xl font-bold dark:text-white">
                    Thực Đơn Dự Kiến
                  </h2>
                  {totalItems > 0 && (
                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </div>
                <GlassButton onClick={closeCart} size="icon">
                  <X className="w-5 h-5" />
                </GlassButton>
              </div>

              {/* ── Table count ── */}
              <div className="px-4 py-3 sm:px-6 border-b dark:border-neutral-700 bg-primary/5 dark:bg-primary/20">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Số lượng bàn
                </p>
                <div className="flex items-center gap-3">
                  <GlassButton
                    onClick={() => setTableCount(Math.max(1, tableCount - 1))}
                    size="icon"
                  >
                    <Minus className="w-4 h-4" />
                  </GlassButton>
                  <input
                    type="number"
                    min="1"
                    value={tableCount}
                    onChange={(e) =>
                      setTableCount(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center text-lg font-bold border rounded-lg py-1.5 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
                  />
                  <GlassButton
                    onClick={() => setTableCount(tableCount + 1)}
                    size="icon"
                  >
                    <Plus className="w-4 h-4" />
                  </GlassButton>
                  <span className="text-sm text-gray-600 dark:text-gray-400">bàn</span>
                </div>
              </div>

              {/* ── Service fee ── */}
              <div className="px-4 py-3 sm:px-6 border-b dark:border-neutral-700 bg-accent/50 dark:bg-primary/15">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Phí phục vụ
                </p>
                <div className="flex items-center gap-3">
                  <GlassButton
                    onClick={() => setServiceFee(Math.max(0, serviceFee - 5))}
                    size="icon"
                  >
                    <Minus className="w-4 h-4" />
                  </GlassButton>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={serviceFee}
                      onChange={(e) =>
                        setServiceFee(
                          Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                        )
                      }
                      className="w-14 text-center text-lg font-bold border rounded-lg py-1.5 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
                    />
                    <Percent className="w-4 h-4 ml-1 text-gray-500 dark:text-gray-400" />
                  </div>
                  <GlassButton
                    onClick={() => setServiceFee(Math.min(100, serviceFee + 5))}
                    size="icon"
                  >
                    <Plus className="w-4 h-4" />
                  </GlassButton>
                </div>
              </div>

              {/* ── Cart items ── */}
              <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 py-16 text-gray-400 dark:text-gray-500">
                    <ShoppingCart className="w-16 h-16 opacity-20" />
                    <p className="font-medium">Chưa có món ăn nào</p>
                    <p className="text-sm text-center">
                      Vào trang{" "}
                      <button
                        onClick={closeCart}
                        className="text-primary font-semibold underline"
                      >
                        Thực Đơn
                      </button>{" "}
                      để chọn món
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex gap-3 bg-gray-50 dark:bg-neutral-800 rounded-xl p-3"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary/10 dark:bg-primary/40 flex items-center justify-center text-xl">
                              🍽️
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-primary font-semibold mt-0.5">
                            {item.price?.toLocaleString("vi-VN")}₫
                          </p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <GlassButton
                              onClick={() => updateQuantity(item.id, -1)}
                              size="icon"
                              className="w-6 h-6"
                            >
                              <Minus className="w-3 h-3" />
                            </GlassButton>
                            <span className="text-sm font-semibold w-5 text-center">
                              {item.quantity}
                            </span>
                            <GlassButton
                              onClick={() => updateQuantity(item.id, 1)}
                              size="icon"
                              className="w-6 h-6"
                            >
                              <Plus className="w-3 h-3" />
                            </GlassButton>
                          </div>
                        </div>

                        {/* Right col */}
                        <div className="flex flex-col items-end justify-between">
                          <GlassButton
                            onClick={() => removeItem(item.id)}
                            size="icon"
                            className="w-6 h-6"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </GlassButton>
                          <p className="text-xs font-bold text-gray-800 dark:text-white">
                            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Summary & actions ── */}
              {cart.length > 0 && (
                <div className="border-t dark:border-neutral-700 px-4 py-3 sm:px-6 space-y-2 sm:space-y-3 bg-gray-50 dark:bg-neutral-800/80">
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Tổng món ({totalItems} món)</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {itemsSubtotal.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>× {tableCount} bàn</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {totalWithTables.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  {serviceFee > 0 && (
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>Phí phục vụ ({serviceFee}%)</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {serviceFeeAmount.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t dark:border-neutral-700 pt-2 sm:pt-3">
                    <span className="text-base font-bold dark:text-white">Tổng cộng</span>
                    <span className="text-lg font-bold text-primary">
                      {grandTotal.toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <GlassButton
                      onClick={clearCart}
                      size="default"
                      className="flex-1 text-sm"
                    >
                      Xóa tất cả
                    </GlassButton>
                    <GlassButton
                      onClick={() => {
                        closeCart();
                        setIsBookingOpen(true);
                      }}
                      size="default"
                      className="flex-1 bg-primary/20 text-sm font-semibold"
                    >
                      Đặt tiệc ngay
                    </GlassButton>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Modal – rendered outside sidebar so it works after sidebar closes */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        menuItems={bookingMenuItems}
        tableCount={tableCount}
        serviceFeePercent={serviceFee}
        mode="menu"
      />
    </>
  );
}
