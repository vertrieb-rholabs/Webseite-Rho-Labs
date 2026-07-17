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
  paypalLink?: string;
  paypalText?: string;
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

export type ProductStatus = 'available' | 'beta-soon' | 'in-development';

export interface PipelineItem {
  id: string;
  name: string;
  status: ProductStatus;
  /** Fachliche Einordnung, z.B. "Kognition & Therapie" */
  field: string;
  description: string;
  /** Interne Route — nur bei status 'available' gesetzt. */
  href?: string;
}

export interface LabProject {
  id: string;
  name: string;
  description: string;
  href: string;
  /** Herkunft/Rahmen, z.B. "Leibniz Universität Hannover" */
  context: string;
  tag: string;
}