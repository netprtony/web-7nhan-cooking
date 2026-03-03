"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import HeroBanquet from "@/components/sections/hero-banquet";
import type { BookingPlanInfo } from "@/types/pricing";

// ── Lazy-loaded sections (loaded only when scrolled into view) ──────────────
const HeroSectionEvent = dynamic(
  () => import("@/components/ui/hero-section-event"),
  { ssr: false, loading: () => <div className="h-[60vh] animate-pulse bg-orange-50 dark:bg-neutral-900" /> }
);

const LandingAccordionItem = dynamic(
  () => import("@/components/ui/interactive-image-accordion").then((m) => ({ default: m.LandingAccordionItem })),
  { ssr: false, loading: () => <div className="h-96 animate-pulse bg-gray-100 dark:bg-neutral-900" /> }
);

const WhyChooseUsCards = dynamic(
  () => import("@/components/ui/why-choose-us-cards"),
  { ssr: false, loading: () => <div className="h-96 animate-pulse bg-gray-50 dark:bg-neutral-950" /> }
);

const PricingTableBanquet = dynamic(
  () => import("@/components/ui/pricing-table-banquet"),
  { ssr: false, loading: () => <div className="h-96 animate-pulse bg-orange-50 dark:bg-neutral-950" /> }
);

const FooterRestaurant = dynamic(
  () => import("@/components/ui/footer-section").then((m) => ({ default: m.FooterRestaurant })),
  { ssr: false }
);

const BookingModal = dynamic(
  () => import("@/components/booking-modal").then((m) => ({ default: m.BookingModal })),
  { ssr: false }
);

// ============================================
// MAIN COMPONENT
// ============================================

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BookingPlanInfo | undefined>(undefined);
  const [prefillEmail, setPrefillEmail] = useState("");

  return (
    <div className="relative">
      {/* Hero Section 1: Scroll Expansion */}
      <HeroBanquet onBookingClick={() => setIsBookingOpen(true)} />

      {/* Hero Section 2: Đặt Tiệc */}
      <HeroSectionEvent
        actions={[
          {
            text: "Đặt Bàn",
            onClick: () => setIsBookingOpen(true),
            variant: "default",
          },
          {
            text: "Xem Thực Đơn",
            onClick: () => (window.location.href = "/menu"),
            variant: "outline",
          },
        ]}
      />

      {/* Featured Categories: Interactive Image Accordion */}
      <LandingAccordionItem />

      {/* Features Section: Why Choose Us */}
      <WhyChooseUsCards />

      {/* Pricing Section */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-b from-orange-50 to-white dark:from-neutral-950 dark:to-background">
        <PricingTableBanquet
          onSelectPlan={(plan) => {
            setSelectedPlan(plan);
            setIsBookingOpen(true);
          }}
        />
      </section>

      {/* Footer */}
      <FooterRestaurant
        onBookingWithEmail={(email) => {
          setPrefillEmail(email);
          setIsBookingOpen(true);
        }}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedPlan(undefined);
          setPrefillEmail("");
        }}
        mode="free"
        plan={selectedPlan}
        prefillEmail={prefillEmail}
      />
    </div>
  );
}
