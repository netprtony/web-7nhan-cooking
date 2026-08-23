import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { LoadingScreen } from "@/components/ui/loading-screen";
import "./globals.css";

export const metadata: Metadata = {
  title: "AFTER HOURS – MODERN DINING | Investor Portal",
  description: "AFTER HOURS – MODERN DINING. Cổng quản trị và thông tin dành cho chủ đầu tư: theo dõi menu, food cost, hiệu suất kinh doanh nhà hàng.",
  icons: {
    icon: [
      { url: "/image-logo.jpg", href: "/image-logo.jpg" }
    ],
    shortcut: "/image-logo.jpg",
    apple: "/image-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/image-logo.jpg" sizes="any" />
        <link rel="apple-touch-icon" href="/image-logo.jpg" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <LoadingScreen />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
