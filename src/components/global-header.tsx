"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Trang Chủ" },
  { href: "/menu", label: "Thực Đơn" },
  { href: "/blog", label: "Hoạt Động" },
];

export default function GlobalHeader() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-md transition-all duration-300",
        isScrolled && "shadow-sm"
      )}
    >
      <div
        className={cn(
          "container mx-auto flex items-center justify-between px-4 transition-all duration-300",
          isScrolled ? "h-14 md:h-16" : "h-24 md:h-28"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/main_logo.png"
            alt="AFTER HOURS Cooking"
            width={220}
            height={80}
            className={cn(
              "object-contain transition-all duration-300",
              isScrolled ? "h-8 md:h-10" : "h-14 md:h-20"
            )}
            style={{ width: 'auto' }}
            priority
            unoptimized
          />
          <div className={cn(
            "flex flex-col transition-all duration-300",
            isScrolled && "scale-90 origin-left"
          )}>
            <span className={cn(
              "font-bold transition-all duration-300",
              isScrolled ? "text-lg" : "text-2xl"
            )}>AFTER HOURS</span>
            <span className={cn(
              "font-medium text-muted-foreground transition-all duration-300",
              isScrolled ? "text-[10px]" : "text-sm"
            )}>MODERN DINING</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 sm:gap-2 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-4 py-2.5 text-sm font-medium transition-colors",
                  isScrolled && "px-3 py-2",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Mobile Menu */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "\u0110\u00f3ng menu" : "M\u1edf menu"}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
