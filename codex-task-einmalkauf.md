# Task: Rho-Labs Website — Umstellung von Abo-Modell auf Einmalkauf

## Ziel

Alle Inhalte der Rho-Labs Webseite, die sich auf das bisherige Abo-/Subscription-Modell beziehen, auf ein **Einmalkauf-Modell** umstellen. Design, Layout, Komponenten-Struktur, Tailwind-Klassen und das bestehende Wording/Tonalität (professionell, sachlich, deutsch) bleiben **exakt erhalten**. Nur die inhaltlichen Texte und Preisdaten ändern sich.

---

## Betroffene Dateien

1. **`src/constants.ts`** — `PRICING_SECTIONS`, `PARTNER_INFO`-Text
2. **`src/pages/ProductPage.tsx`** — Pricing-Einleitungstext, USP-Texte, Footer-Hinweiszeilen unter Pricing-Cards
3. Ggf. Hero-Texte oder andere Stellen, die "monatlich kündbar", "Pro Monat" oder Abo-Sprache enthalten

---

## 1. Neue Preisstruktur (`src/constants.ts` → `PRICING_SECTIONS`)

### B2C-Sektion (`id: "b2c"`)

**Sektion-Titel:** `"Für Privatanwender"` (bleibt)  
**Sektion-Subtitle:** `"Einmal kaufen — dauerhaft nutzen"`

#### Plan: Standard
```ts
{
  id: "b2c-standard",
  name: "Standard",
  price: "19€",
  subtext: "Einmalig (inkl. MwSt.)",
  ctaText: "Jetzt kaufen",
  ctaLink: "PLACEHOLDER_CHECKOUT_LINK_B2C_STANDARD",
  isExternalCheckout: true,
  features: [
    { text: "1 Gerät / Installation" },
    { text: "Alle 7 Trainingsmodule" },
    { text: "Lokale Datenspeicherung" },
    { text: "Kostenlose Patches & Bugfixes", highlight: true },
    { text: "Vollständig offline nutzbar", highlight: true },
  ]
}
```

#### Plan: Pro
```ts
{
  id: "b2c-pro",
  name: "Pro",
  price: "29€",
  subtext: "Einmalig (inkl. MwSt.)",
  ctaText: "Jetzt kaufen",
  ctaLink: "PLACEHOLDER_CHECKOUT_LINK_B2C_PRO",
  isExternalCheckout: true,
  features: [
    { text: "1 Gerät / Installation" },
    { text: "Alle 7 Trainingsmodule" },
    { text: "Detaillierte Statistiken & Auswertungen", highlight: true },
    { text: "Export-Funktion (PDF/CSV)", highlight: true },
    { text: "Lokale Datenspeicherung" },
    { text: "Kostenlose Patches & Bugfixes", highlight: true },
    { text: "Vollständig offline nutzbar", highlight: true },
  ]
}
```

### B2B-Sektion (`id: "b2b"`)

**Sektion-Titel:** `"Für Einrichtungen & Teams"` (bleibt)  
**Sektion-Subtitle:** `"Professioneller Einsatz — einmalige Investition, dauerhafter Nutzen"`

#### Plan: Einzel-Lizenz
```ts
{
  id: "b2b-normal",
  name: "Einzel-Lizenz",
  price: "119€",
  subtext: "Einmalig (zzgl. MwSt.)",
  ctaText: "Lizenz erwerben",
  ctaLink: "PLACEHOLDER_CHECKOUT_LINK_B2B_EINZEL",
  isExternalCheckout: true,
  features: [
    { text: "1 Gerät / Installation" },
    { text: "Alle 7 Trainingsmodule" },
    { text: "Unbegrenzte Nutzerprofile", highlight: true },
    { text: "Detaillierte Statistiken & Auswertungen", highlight: true },
    { text: "Export-Funktion (PDF/CSV)", highlight: true },
    { text: "Lokale Datenspeicherung" },
    { text: "Kostenlose Patches & Bugfixes", highlight: true },
    { text: "Vollständig offline nutzbar", highlight: true },
  ]
}
```

#### Plan: Team-Lizenz
```ts
{
  id: "b2b-team",
  name: "Team-Lizenz",
  price: "309€",
  subtext: "Einmalig für 3 Lizenzen (zzgl. MwSt.)",
  subtextClass: "text-brand-cyan font-bold",
  isFeatured: true,
  badge: "Bestseller",
  ctaText: "Team-Lizenz erwerben",
  ctaLink: "PLACEHOLDER_CHECKOUT_LINK_B2B_TEAM",
  isExternalCheckout: true,
  features: [
    { text: "3 Geräte / Installationen", highlight: true },
    { text: "Alle 7 Trainingsmodule" },
    { text: "Unbegrenzte Nutzerprofile", highlight: true },
    { text: "Detaillierte Statistiken & Auswertungen", highlight: true },
    { text: "Export-Funktion (PDF/CSV)", highlight: true },
    { text: "Technischer Support inklusive", highlight: true },
    { text: "Lokale Datenspeicherung" },
    { text: "Kostenlose Patches & Bugfixes", highlight: true },
    { text: "Vollständig offline nutzbar", highlight: true },
  ]
}
```

#### Plan: Enterprise (bleibt inhaltlich gleich)
```ts
{
  id: "enterprise",
  name: "Enterprise",
  price: "Individuell",
  isEnterprise: true,
  subtext: "Ab 5+ Lizenzen",
  ctaText: "Kontakt aufnehmen",
  ctaLink: `mailto:${CONTACT_EMAIL}?subject=Anfrage%20Enterprise-Lizenz`,
  isExternalCheckout: false,
  features: [
    { text: "Volumenrabatte" },
    { text: "Anpassung der Normwerte" },
    { text: "White-Labeling Optionen" },
    { text: "Feature-Entwicklung auf Wunsch" },
  ]
}
```

---

## 2. Textersetzungen (wortgenau)

### In `src/pages/ProductPage.tsx`

#### Pricing-Einleitungstext (unter `<h2>Software-Lizenzen</h2>`)
**ALT:**
```
Der professionelle Bezug erfolgt über unseren Partner Lemon Squeezy. Transparent, sicher und monatlich kündbar.
```
**NEU:**
```
Einmal kaufen, dauerhaft nutzen. Der sichere Bezug erfolgt über unseren Partner Lemon Squeezy. Größere Feature-Updates werden als optionale Upgrades angeboten — Sicherheits-Patches und Bugfixes sind kostenlos.
```

#### Footer-Zeile unter B2C-Pricing-Cards
**ALT:**
```
Alle Preise inkl. gesetzlicher MwSt. • Monatlich kündbar
```
**NEU:**
```
Alle Preise inkl. gesetzlicher MwSt. • Einmaliger Kauf — keine laufenden Kosten
```

#### Footer-Zeile unter B2B-Pricing-Cards
**ALT:**
```
Alle Preise zzgl. gesetzlicher MwSt. • Monatlich kündbar
```
**NEU:**
```
Alle Preise zzgl. gesetzlicher MwSt. • Einmaliger Kauf — keine laufenden Kosten
```

#### USP "Lokale Datenhoheit" — Beschreibungstext
**ALT:**
```
Keine Cloud-Übertragung. Alle Nutzerdaten bleiben auf Ihrem Rechner. Nur zur Lizenzprüfung ist eine periodische Internetverbindung nötig.
```
**NEU:**
```
Keine Cloud-Übertragung. Alle Nutzerdaten bleiben auf Ihrem Rechner. Nach der einmaligen Lizenzaktivierung ist die Software vollständig offline nutzbar.
```

#### USP-Feature-Box "Kein Cloud-Zwang" (in den 4 Feature-Icons-Grid, falls vorhanden in constants oder ProductPage)
**ALT:**
```
Ihre Daten gehören Ihnen. Nur die Lizenzprüfung erfordert eine Internetverbindung.
```
**NEU:**
```
Ihre Daten gehören Ihnen. Nach einmaliger Aktivierung funktioniert die Software komplett ohne Internet.
```

---

## 3. `PricingTier`-Interface (`src/types.ts`)

Entferne das optionale Feld `period?: string;` falls es noch existiert — es wird nicht mehr benötigt. Falls es nirgends verwendet wird, kann es bleiben, aber es darf nicht in der UI auftauchen.

---

## 4. Entfernung von "netto"-Label

In `src/pages/ProductPage.tsx` gibt es in der Pricing-Card-Renderfunktion den Text `"netto"` neben dem Preis:
```tsx
{!plan.isEnterprise && <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">netto</span>}
```
**Ersetze** `"netto"` durch `"einmalig"`.

---

## 5. Checkliste — Was sich NICHT ändern darf

- [ ] Kein CSS/Tailwind-Klasse ändern
- [ ] Kein Layout/Grid umbauen
- [ ] Keine Komponenten-Struktur ändern (ScrollReveal, PricingCard-Wrapper etc.)
- [ ] Kein Design-Token (Farben, Fonts, Rundungen) ändern
- [ ] Enterprise-Plan bleibt inhaltlich gleich
- [ ] MDR-Disclaimer bleibt unverändert
- [ ] Alle `isExternalCheckout: true` bleiben true (außer Enterprise)
- [ ] Alle Lemon Squeezy Checkout-Links als `PLACEHOLDER_CHECKOUT_LINK_*` setzen (ich ersetze die URLs manuell danach)

## 6. Zusammenfassung der Kernbotschaft

Die Website soll folgende Kernbotschaft transportieren:
- **Einmalkauf:** Einmal kaufen, dauerhaft nutzen — kein Abo, keine monatlichen Kosten
- **Patches kostenlos:** Sicherheits-Updates und Bugfixes sind im Kauf enthalten
- **Größere Updates kostenpflichtig:** Major Feature-Releases werden als optionale, separate Einmalkäufe angeboten
- **Offline nach Aktivierung:** Nach der ersten Lizenzaktivierung läuft die Software komplett offline — keine periodische Lizenzprüfung nötig
