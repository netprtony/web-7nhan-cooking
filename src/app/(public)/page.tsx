"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import HeroBanquet from "@/components/sections/hero-banquet";
import type { BookingPlanInfo } from "@/types/pricing";

const HeroSectionEvent = dynamic(
  () => import("@/components/ui/hero-section-event"),
  { ssr: false, loading: () => <div className="h-[60vh] animate-pulse bg-primary/5 dark:bg-neutral-900" /> }
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
  { ssr: false, loading: () => <div className="h-96 animate-pulse bg-primary/5 dark:bg-neutral-950" /> }
);

const FooterRestaurant = dynamic(
  () => import("@/components/ui/footer-section").then((m) => ({ default: m.FooterRestaurant })),
  { ssr: false }
);

const BookingModal = dynamic(
  () => import("@/components/booking-modal").then((m) => ({ default: m.BookingModal })),
  { ssr: false }
);

const ChatWidget = dynamic(
  () => import("@/components/ui/chat-widget").then((m) => ({ default: m.ChatWidget })),
  { ssr: false }
);

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BookingPlanInfo | undefined>(undefined);
  const [prefillEmail, setPrefillEmail] = useState("");

  return (
    <div className="relative">
      {/* Hero Section 1: Scroll Expansion */}
      <HeroBanquet onBookingClick={() => setIsBookingOpen(true)} />

      {/* Hero Section 2: Giới thiệu dự án */}
      <HeroSectionEvent
        actions={[
          {
            text: "Xem Gói Đầu Tư",
            onClick: () => {
              const el = document.getElementById('investment-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            },
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

      {/* Features Section: Why Invest */}
      <WhyChooseUsCards />

      {/* Investment Section */}
      <section id="investment-section" className="py-12 sm:py-20 px-4 bg-gradient-to-b from-accent to-white dark:from-neutral-950 dark:to-background">
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

      {/* Contact Modal */}
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

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}
