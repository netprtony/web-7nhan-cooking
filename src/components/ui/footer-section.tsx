"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
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

interface FooterRestaurantProps {
  onBookingWithEmail?: (email: string) => void;
}

function FooterRestaurant({ onBookingWithEmail }: FooterRestaurantProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [emailInput, setEmailInput] = React.useState("")

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDarkMode = theme === "dark"
  const setIsDarkMode = (val: boolean) => setTheme(val ? "dark" : "light")

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput.trim()) return
    onBookingWithEmail?.(emailInput.trim())
    setEmailInput("")
  }

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Cột 1 — Đặt Bàn Ngay */}
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
              <a href="/" className="block transition-colors hover:text-primary">Trang Chủ</a>
              <a href="/menu" className="block transition-colors hover:text-primary">Thực Đơn</a>
              <a href="/blog" className="block transition-colors hover:text-primary">Blog Ẩm Thực</a>
            </nav>
          </div>

          {/* Cột 3 — Thông tin liên hệ */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liên Hệ</h3>
            <address className="space-y-2 text-sm not-italic text-muted-foreground">
              <p>📍 Tân Xuân, Hóc Môn, TPHCM</p>
              <p>📞 0939 088 227</p>
              <p>✉️ contact@afterhours.vn</p>
              <p>🕐 Nhận đặt tiệc mọi lúc</p>
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
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
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
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
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
                      <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
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
                      <a href="tel:0939088227">
                        <Phone className="h-4 w-4" />
                        <span className="sr-only">Gọi điện</span>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Gọi đặt tiệc ngay</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Dark Mode Toggle */}
            {mounted && (
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
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AFTER HOURS – MODERN DINING. Bản quyền thuộc về chúng tôi.
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="transition-colors hover:text-primary">
              Chính Sách Bảo Mật
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Điều Khoản Dịch Vụ
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { FooterRestaurant }