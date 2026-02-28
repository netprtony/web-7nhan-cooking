"use client";

import React, { useState } from "react";
import HeroBanquet from "@/components/sections/hero-banquet";
import { LandingAccordionItem } from "@/components/ui/interactive-image-accordion";
import { FooterRestaurant } from "@/components/ui/footer-section";
import { BookingModal } from "@/components/booking-modal";
import HeroSectionEvent from "@/components/ui/hero-section-event";
import PricingTableBanquet from "@/components/ui/pricing-table-banquet";
import WhyChooseUsCards from "@/components/ui/why-choose-us-cards";
import type { BookingPlanInfo } from "@/types/pricing";

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
