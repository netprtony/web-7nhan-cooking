# 🦶 Implementation Plan: Thay Thế Footer + Xóa Tab Bar + Tích Hợp Dark Mode Toàn Website

## 🎯 Mục tiêu
- Thay thế **Footer cũ** bằng `footer-section.tsx` đã tuỳ chỉnh cho nhà hàng
- **Xóa thanh Tab Bar** (bottom navigation nếu có)
- **Toggle Dark Mode** trong footer điều khiển toàn bộ website
- **Ô email** → khi submit mở `booking-modal.tsx` với email đã fill sẵn
- Quick Links, địa chỉ, social media cập nhật thực tế nhà hàng

---

## 📋 Prompt chính xác cho Claude Opus 4.6

```
Bạn là senior React/TypeScript developer. Nhiệm vụ:

1. Tìm và thay thế Footer cũ bằng footer-section.tsx tuỳ chỉnh cho nhà hàng
2. Tìm và xóa hoàn toàn thanh Tab Bar (bottom navigation)
3. Tích hợp dark mode toggle trong footer điều khiển toàn website
4. Ô nhập email → submit → mở BookingModal với email fill sẵn
5. Cập nhật nội dung tiếng Việt phù hợp nhà hàng đặt tiệc

Chi tiết kỹ thuật ở phần dưới.
```

---

## 🗂️ Bước 1: Khảo sát dự án (BẮT BUỘC làm trước)

```bash
# 1. Tìm Footer hiện tại
grep -rn "footer\|Footer\|<footer" src/ --include="*.tsx" -l

# 2. Tìm Tab Bar / Bottom Navigation
grep -rn "TabBar\|tab-bar\|BottomNav\|bottom-nav\|bottomNav\|NavigationBar\|tabBar" src/ --include="*.tsx" -l
grep -rn "fixed bottom\|sticky bottom\|bottom-0" src/ --include="*.tsx" | grep -v "node_modules"

# 3. Tìm cơ chế dark mode hiện tại
grep -rn "dark\|theme\|ThemeProvider\|useTheme\|darkMode\|isDark" src/ --include="*.tsx" --include="*.ts" -l
grep -rn "next-themes\|ThemeProvider" src/ --include="*.tsx" | head -5
cat package.json | grep "next-themes"

# 4. Tìm BookingModal
find src/ -name "booking-modal*" -o -name "BookingModal*"
grep -rn "BookingModal\|booking-modal" src/ --include="*.tsx" | head -5

# 5. Xem layout chính
cat src/app/layout.tsx 2>/dev/null || cat src/pages/_app.tsx 2>/dev/null
```

> ⚠️ **Claude phải báo cáo kết quả** của tất cả lệnh trên trước khi bắt đầu code.

---

## 🛠️ Bước 2: Xử lý Dark Mode — phân nhánh theo dự án

### Trường hợp A — Dự án đang dùng `next-themes`

```bash
cat package.json | grep next-themes  # nếu có → Case A
```

**Không cần làm gì thêm** — chỉ dùng `useTheme()` hook trong footer:

```tsx
// Trong footer component
import { useTheme } from 'next-themes'

const { theme, setTheme } = useTheme()
const isDarkMode = theme === 'dark'
const setIsDarkMode = (val: boolean) => setTheme(val ? 'dark' : 'light')
```

### Trường hợp B — Dự án CHƯA có next-themes

**Bước B1**: Cài package:
```bash
npm install next-themes
```

**Bước B2**: Wrap layout với ThemeProvider:
```tsx
// src/app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Bước B3**: Trong footer dùng useTheme như Case A.

### Trường hợp C — Dự án dùng manual class toggle (như code gốc)

Giữ nguyên logic `document.documentElement.classList.add("dark")` nhưng **đưa state lên context** để các component khác đọc được:

```tsx
// src/context/theme-context.tsx
'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext<{
  isDark: boolean
  setIsDark: (v: boolean) => void
}>({ isDark: false, setIsDark: () => {} })

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => useContext(ThemeContext)
```

> Claude chọn đúng trường hợp sau khi khảo sát.

---

## 🛠️ Bước 3: Tạo Footer component tuỳ chỉnh

### File: `src/components/ui/footer-section.tsx`

```tsx
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"   // ← dùng Button CÓ SẴN
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Moon, Phone, Send, Sun, Youtube } from "lucide-react"
// ← Bỏ Twitter/LinkedIn (ít phù hợp nhà hàng VN), thêm Youtube/Phone
import BookingModal from "@/components/booking-modal"  // ← import modal CÓ SẴN

// Dark mode: Claude chọn đúng import theo kết quả khảo sát
// Option A: import { useTheme } from 'next-themes'
// Option C: import { useThemeContext } from '@/context/theme-context'

function FooterRestaurant() {
  // ── Dark mode state (Claude điều chỉnh theo kết quả khảo sát) ──────────
  // next-themes:
  // const { theme, setTheme } = useTheme()
  // const isDarkMode = theme === 'dark'
  // const setIsDarkMode = (v: boolean) => setTheme(v ? 'dark' : 'light')

  // manual (fallback):
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  // ── Booking modal state ─────────────────────────────────────────────────
  const [bookingOpen, setBookingOpen] = React.useState(false)
  const [prefillEmail, setPrefillEmail] = React.useState("")
  const [emailInput, setEmailInput] = React.useState("")

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput.trim()) return
    setPrefillEmail(emailInput)
    setBookingOpen(true)
    setEmailInput("")   // reset input sau khi mở modal
  }

  return (
    <>
      <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
        <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

            {/* Cột 1 — Đặt Bàn Ngay (thay "Stay Connected") */}
            <div className="relative">
              <h2 className="mb-4 text-3xl font-bold tracking-tight">
                Đặt Bàn Ngay
              </h2>
              <p className="mb-6 text-muted-foreground">
                Nhập email để đặt bàn nhanh chóng. Chúng tôi sẽ xác nhận trong vòng 30 phút.
              </p>
              <form className="relative" onSubmit={handleEmailSubmit}>
                <Input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="pr-12 backdrop-blur-sm"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Đặt bàn</span>
                </Button>
              </form>
              <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            </div>

            {/* Cột 2 — Liên kết nhanh */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Liên Kết Nhanh</h3>
              <nav className="space-y-2 text-sm">
                {/* Claude điều chỉnh href theo route thực trong dự án */}
                <a href="/" className="block transition-colors hover:text-primary">Trang Chủ</a>
                <a href="#gioi-thieu" className="block transition-colors hover:text-primary">Giới Thiệu</a>
                <a href="#thuc-don" className="block transition-colors hover:text-primary">Thực Đơn</a>
                <a href="#bang-gia" className="block transition-colors hover:text-primary">Bảng Giá</a>
                <a href="#lien-he" className="block transition-colors hover:text-primary">Liên Hệ</a>
              </nav>
            </div>

            {/* Cột 3 — Thông tin liên hệ */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">Liên Hệ</h3>
              <address className="space-y-2 text-sm not-italic text-muted-foreground">
                {/* Claude điền thông tin thực từ dự án */}
                <p>📍 123 Đường Nguyễn Văn A, Q.1, TP.HCM</p>
                <p>📞 (028) 1234 5678</p>
                <p>📱 0912 345 678</p>
                <p>✉️ datban@nhahangtienan.com</p>
                <p>🕐 Mở cửa: 10:00 – 22:00 hàng ngày</p>
              </address>
            </div>

            {/* Cột 4 — Mạng xã hội + Dark mode toggle */}
            <div className="relative">
              <h3 className="mb-4 text-lg font-semibold">Kết Nối</h3>
              <div className="mb-6 flex space-x-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full" asChild>
                        <a href="https://facebook.com/nhahangtienan" target="_blank" rel="noopener noreferrer">
                          <Facebook className="h-4 w-4" />
                          <span className="sr-only">Facebook</span>
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Theo dõi Facebook</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full" asChild>
                        <a href="https://instagram.com/nhahangtienan" target="_blank" rel="noopener noreferrer">
                          <Instagram className="h-4 w-4" />
                          <span className="sr-only">Instagram</span>
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Theo dõi Instagram</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full" asChild>
                        <a href="https://youtube.com/@nhahangtienan" target="_blank" rel="noopener noreferrer">
                          <Youtube className="h-4 w-4" />
                          <span className="sr-only">YouTube</span>
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Xem YouTube</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full" asChild>
                        <a href="tel:02812345678">
                          <Phone className="h-4 w-4" />
                          <span className="sr-only">Gọi điện</span>
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Gọi đặt bàn ngay</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Dark Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
                <Moon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="dark-mode" className="text-sm text-muted-foreground ml-1">
                  {isDarkMode ? "Tối" : "Sáng"}
                </Label>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Nhà Hàng Tiệc Ân. Bản quyền thuộc về chúng tôi.
            </p>
            <nav className="flex gap-4 text-sm">
              <a href="/chinh-sach-bao-mat" className="transition-colors hover:text-primary">
                Chính Sách Bảo Mật
              </a>
              <a href="/dieu-khoan" className="transition-colors hover:text-primary">
                Điều Khoản Dịch Vụ
              </a>
            </nav>
          </div>
        </div>
      </footer>

      {/* Booking Modal — email được fill sẵn từ input footer */}
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        prefillEmail={prefillEmail}   // ← prop mới cần bổ sung vào BookingModal
      />
    </>
  )
}

export { FooterRestaurant }
```

---

## 🛠️ Bước 4: Bổ sung `prefillEmail` vào BookingModal

Claude đọc `booking-modal.tsx` rồi bổ sung:

```tsx
// Thêm vào interface props của BookingModal
interface BookingModalProps {
  open: boolean
  onClose: () => void
  prefillEmail?: string    // ← THÊM MỚI
  plan?: { ... }           // giữ nguyên props cũ
}

// Trong form email input của BookingModal:
<Input
  type="email"
  name="email"
  defaultValue={prefillEmail ?? ""}   // ← fill sẵn từ footer
  placeholder="Email của bạn"
/>
```

---

## 🗑️ Bước 5: Xóa Tab Bar

```bash
# Tìm chính xác file Tab Bar
grep -rn "fixed bottom\|sticky bottom\|bottom-0.*z-" src/ --include="*.tsx"
```

### Cách xóa an toàn:

```tsx
// CÁCH 1 — Xóa import và JSX trong layout/page:
// Trong src/app/layout.tsx hoặc page chứa TabBar:
// TRƯỚC:
import TabBar from '@/components/TabBar'
<TabBar />

// SAU: xóa cả 2 dòng trên

// CÁCH 2 — Nếu TabBar có nhiều logic phức tạp, comment out trước:
{/* <TabBar /> */}
```

> ⚠️ Nếu Tab Bar chứa navigation links quan trọng, Claude phải **đảm bảo các links đó đã có trong footer** trước khi xóa Tab Bar.

---

## 🔄 Bước 6: Thay thế Footer trong layout

```tsx
// src/app/layout.tsx hoặc src/components/layout/layout.tsx

// TRƯỚC:
import OldFooter from '@/components/Footer'
<OldFooter />

// SAU:
import { FooterRestaurant } from '@/components/ui/footer-section'
<FooterRestaurant />
```

---

## 📦 Bước 7: Kiểm tra dependencies

```bash
# Kiểm tra các shadcn components cần thiết
ls src/components/ui/ | grep -E "input|label|switch|tooltip"

# Nếu thiếu, thêm via shadcn CLI:
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add switch
npx shadcn@latest add tooltip

# next-themes (nếu Case B)
npm install next-themes
```

---

## ✅ Checklist cho Claude Opus 4.6

```
[ ] 1. Chạy tất cả lệnh khảo sát, báo cáo kết quả
[ ] 2. Xác định cơ chế dark mode hiện tại (next-themes / manual / chưa có)
[ ] 3. Setup ThemeProvider phù hợp trong layout nếu cần
[ ] 4. Xác định file và component Tab Bar cần xóa
[ ] 5. Kiểm tra Tab Bar có navigation links nào cần giữ lại không
[ ] 6. Di chuyển links từ Tab Bar vào Quick Links của footer
[ ] 7. Xóa Tab Bar khỏi layout/page
[ ] 8. Tạo src/components/ui/footer-section.tsx (nội dung nhà hàng VN)
[ ] 9. Bổ sung prop `prefillEmail` vào BookingModal
[ ] 10. Thay thế Footer cũ trong layout
[ ] 11. Cập nhật thông tin thực: địa chỉ, SĐT, email, social links
[ ] 12. Test dark mode toggle: toàn trang chuyển sáng/tối đúng
[ ] 13. Test email submit: mở BookingModal với email fill sẵn đúng
[ ] 14. Test Tab Bar đã biến mất hoàn toàn (không còn ở bottom)
[ ] 15. Test responsive: footer đẹp trên mobile (1 cột) và desktop (4 cột)
```

---

## ⚠️ Lưu ý quan trọng cho Claude Opus 4.6

1. **Dark mode phải toàn website** — không chỉ footer. Nếu dùng manual toggle, phải đưa state lên ThemeProvider/Context để các component khác đọc được
2. **`suppressHydrationWarning`** — bắt buộc thêm vào `<html>` tag nếu dùng next-themes, tránh hydration mismatch
3. **Email submit → modal** — KHÔNG navigate, KHÔNG reload trang; chỉ `setBookingOpen(true)`
4. **Tab Bar links** — đảm bảo không mất navigation nào quan trọng trước khi xóa
5. **Social links** — Claude điền URL placeholder, thông báo người dùng cần cập nhật URL thực
6. **`© {new Date().getFullYear()}`** — dùng dynamic year thay vì hardcode "2024"
7. **Input email reset** — sau khi submit và mở modal, clear input để UX sạch hơn
