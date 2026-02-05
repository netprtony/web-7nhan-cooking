import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
