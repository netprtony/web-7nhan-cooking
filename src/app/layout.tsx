import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { CartProvider } from "@/context/cart-context";
import { CartUIProvider } from "@/context/cart-ui-context";
import { CartSidebar } from "@/components/cart-sidebar";
import GlobalHeader from "@/components/global-header";
import { LoadingScreen } from "@/components/ui/loading-screen";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dịch vụ nấu ăn Bảy Nhân - Đặt Tiệc Tại Gia Chuyên Nghiệp",
  description: "Bảy Nhân nhận đặt tất cả các loại tiệc: Cưới hỏi, Liên hoan, Sinh nhật, Hội nghị với hơn 20 năm kinh nghiệm. Cam kết thực phẩm tươi sống, giá cả hợp lý.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <CartProvider>
            <CartUIProvider>
              <LoadingScreen />
              <GlobalHeader />
              <CartSidebar />
              <main className="pt-24 md:pt-28">{children}</main>
            </CartUIProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
