import { LandingAccordionItem } from "@/components/ui/interactive-image-accordion";
import { MenuSection } from "@/components/menu-section";
import { BookingForm } from "@/components/booking-form";

export default function Home() {
  return (
    <main className="min-h-screen">
      <LandingAccordionItem />
      <MenuSection />
      <BookingForm />
    </main>
  );
}
