export type TableTier = 10 | 50;

export interface PricingPlan {
  id: string;
  title: string;
  pricePerTable: {
    tier10: number;
    tier50: number;
  };
  description: string;
  features: string[];
  ctaText: string;
  isFeatured?: boolean;
}

export interface BookingPlanInfo {
  id: string;
  title: string;
  pricePerTable: number;
  defaultTableCount: number;
}
