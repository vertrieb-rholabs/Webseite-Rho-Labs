import type { LucideIcon } from 'lucide-react';

export type GameCategory = 'merken' | 'raum' | 'denken' | 'tempo';

export interface CategoryInfo {
  name: string;
  color: string;
}

export interface Game {
  label: string;
  cat: GameCategory;
  text: string;
}

export interface Principle {
  title: string;
  text: string;
  Icon: LucideIcon;
}

export interface StatsFeature {
  title: string;
  text: string;
  Icon: LucideIcon;
}

export interface Demonstration {
  /** Dateiname unter /bilder, ohne Pfad. */
  image: string;
  alt: string;
  title: string;
  text: string;
}

export interface Shot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface PricingFeature {
  text: string;
  highlight?: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  /** Vorteilspreis über einen Partnerlink. Wird erst mit der ?ref=-Auswertung angezeigt. */
  vorteilspreis?: string;
  subtext: string;
  badge?: string;
  isFeatured?: boolean;
  features: PricingFeature[];
  ctaText: string;
  ctaLink: string;
  /**
   * Der Knopf zeigt auf ein Ziel innerhalb der Seite — eine Route oder eine
   * Sprungmarke. Ohne diese Angabe ist `ctaLink` eine äußere Adresse
   * (mailto:) und wird als solche ausgezeichnet.
   */
  ctaIntern?: boolean;
  /*
   * Hier stand `paypalLink?: string`. Entfernt am 22.09.2026 samt seiner
   * beiden Werte und dem Knopf in `ProductPage.tsx`: Ein direkter
   * PayPal-Link ist ein vollautomatischer Kaufweg, und den kann eine
   * statische Seite nicht mit dem ausstatten, was § 312j BGB davor verlangt.
   * Die Begründung in voller Länge steht über `PLANS` in `constants.ts`.
   *
   * Das Feld ist nicht nur leer gelassen, sondern weg — sonst genügt eine
   * Zeile, um den Weg wieder zu öffnen, ohne dass jemand die Begründung zu
   * sehen bekommt. `scripts/befunde.test.mjs` (Test 16) hält beides zusammen.
   */
}

export type ProductStatus = 'available' | 'beta-soon' | 'in-development';

export interface PipelineItem {
  id: string;
  name: string;
  status: ProductStatus;
  /** Fachliche Einordnung, z.B. "Optik & Duennschicht" */
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
  /** Herkunft/Rahmen, z.B. "Leibniz Universitaet Hannover" */
  context: string;
  tag: string;
}

export interface EvidenceEntry {
  module: string;
  references: string[];
}

export interface PrivacySection {
  title: string;
  paragraphs: string[];
}
