import { LucideIcon } from 'lucide-react';

export interface ModuleItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  Icon: LucideIcon;
}

export interface PricingFeature {
  text: string;
  highlight?: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  subtext: string;
  subtextClass?: string;
  features: PricingFeature[];
  ctaText: string;
  ctaLink: string;
  isFeatured?: boolean;
  isEnterprise?: boolean;
  badge?: string;
  isExternalCheckout?: boolean;
}

export interface PricingSection {
  id: string;
  title: string;
  subtitle: string;
  plans: PricingTier[];
}

export interface StatItem {
  value: string;
  label: string;
}