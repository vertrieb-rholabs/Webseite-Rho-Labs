import {
  MapPin,
  BrainCircuit,
  Target,
  Music,
  ListTodo,
  Grid3X3,
  ShieldCheck,
  BarChart3,
  Settings2,
  Database,
  Search,
  Users,
  Award,
  Layers
} from 'lucide-react';
import { ModuleItem, PricingTier, PricingSection, StatItem } from './types';

export const CONTACT_EMAIL = "kontakt.rholabs@gmail.com";
export const PARTNER_INFO = {
  name: "Lemon Squeezy",
  role: "Vertrieb & Lizenzierung",
  email: "via LemonSqueezy.com"
};

export const MDR_DISCLAIMER = "Wichtiger Hinweis: Rho-Labs Kognitives Training ist kein Medizinprodukt und kein zugelassenes Therapieinstrument im Sinne der EU-Medizinprodukteverordnung (MDR 2017/745). Die Software dient ausschlie\u00DFlich dem allgemeinen kognitiven Training und der pers\u00F6nlichen Leistungsf\u00F6rderung. Sie ersetzt keine \u00E4rztliche oder therapeutische Behandlung. Die dargestellten Auswertungen sind keine medizinischen Diagnosen.";

export const STATS: StatItem[] = [
  { value: "7+", label: "Trainingsmodule" },
  { value: "Lokal", label: "Datenspeicherung" },
  { value: "\u221E", label: "Nutzerprofile" },
  { value: "Flexibel", label: "Abo-Modell" },
];

export const MODULES: ModuleItem[] = [
  {
    id: "spatial",
    title: "Was liegt wo?",
    subtitle: "R\u00E4umliches Ged\u00E4chtnis",
    description: "Objektpositionen in Raumszenarien merken. Basiert auf Corsi-Block-verwandten Paradigmen zur Erfassung der visuell-r\u00E4umlichen Merkspanne.",
    Icon: MapPin
  },
  {
    id: "memo",
    title: "Memo-Match",
    subtitle: "Visuelles Ged\u00E4chtnis & Mustererkennung",
    description: "Klassisches Paar-Zuordnungsspiel mit konfigurierbarer Feldgr\u00F6\u00DFe. Trainiert visuelles Wiedererkennen und r\u00E4umliche Ged\u00E4chtnisstrategien.",
    Icon: Layers
  },
  {
    id: "nback",
    title: "N-Back",
    subtitle: "Arbeitsged\u00E4chtnis",
    description: "Der Gold-Standard des Arbeitsged\u00E4chtnistrainings (Kirchner, 1958). Vergleichen Sie aktuelle Reize mit vorherigen Sequenzen auf konfigurierbaren N-Stufen.",
    Icon: BrainCircuit
  },
  {
    id: "cpt",
    title: "Aufmerksamkeit (CPT)",
    subtitle: "Vigilanz & Impulskontrolle",
    description: "Continuous Performance Test zur Messung der Daueraufmerksamkeit, Reaktionskontrolle und Vigilanz \u00FCber drei Testbl\u00F6cke mit detaillierter Blockanalyse.",
    Icon: Target
  },
  {
    id: "simon",
    title: "Simon",
    subtitle: "Sequenzged\u00E4chtnis",
    description: "Reproduzieren auditiv-visueller Sequenzen mit steigender Komplexit\u00E4t. Trainiert die serielle Merkspanne analog zu klassischen Span-Aufgaben.",
    Icon: Music
  },
  {
    id: "words",
    title: "Wortliste",
    subtitle: "Verbales Ged\u00E4chtnis",
    description: "Einpr\u00E4gen und Abrufen von Wortlisten zur St\u00E4rkung der verbalen Merkspanne. Angelehnt an etablierte Wortlistenparadigmen (Rey, 1941).",
    Icon: ListTodo
  },
  {
    id: "patterns",
    title: "Muster merken",
    subtitle: "Visuelles Kurzzeitged\u00E4chtnis",
    description: "Komplexe Rastermuster auf konfigurierbaren Gittern erkennen und reproduzieren. Basiert auf dem Visual Patterns Test (Della Sala et al., 1997).",
    Icon: Grid3X3
  }
];

export const EVIDENZ_SOURCES = [
  {
    module: "N-Back (Arbeitsged\u00E4chtnis)",
    references: [
      "Kirchner, W.K. (1958). Age differences in short-term retention of rapidly changing information. Journal of Experimental Psychology, 55(4), 352\u2013358.",
      "Jaeggi, S.M., Buschkuehl, M., Jonides, J. & Perrig, W.J. (2008). Improving fluid intelligence with training on working memory. PNAS, 105(19), 6829\u20136833. DOI: 10.1073/pnas.0801268105",
      "Owen, A.M., McMillan, K.M., Laird, A.R. & Bullmore, E. (2005). N-back working memory paradigm: A meta-analysis of normative functional neuroimaging studies. Human Brain Mapping, 25(1), 46\u201359."
    ]
  },
  {
    module: "CPT (Daueraufmerksamkeit)",
    references: [
      "Rosvold, H.E., Mirsky, A.F., Sarason, I., Bransome, E.D. & Beck, L.H. (1956). A continuous performance test of brain damage. Journal of Consulting Psychology, 20(5), 343\u2013350.",
      "Riccio, C.A., Reynolds, C.R. & Lowe, P.A. (2001). Clinical Applications of Continuous Performance Tests. New York: Wiley.",
      "Conners, C.K. (2000). Conners\u2019 Continuous Performance Test II (CPT II). Toronto: Multi-Health Systems."
    ]
  },
  {
    module: "Was liegt wo? (R\u00E4umliches Ged\u00E4chtnis)",
    references: [
      "Corsi, P.M. (1972). Human memory and the medial temporal region of the brain. Dissertation Abstracts International, 34(2-B), 891.",
      "Kessels, R.P.C., van Zandvoort, M.J.E., Postma, A., Kappelle, L.J. & de Haan, E.H.F. (2000). The Corsi Block-Tapping Task: Standardization and normative data. Applied Neuropsychology, 7(4), 252\u2013258. DOI: 10.1207/S15324826AN0704_8",
      "Berch, D.B., Krikorian, R. & Huha, E.M. (1998). The Corsi block-tapping task: Methodological and theoretical considerations. Brain and Cognition, 38(3), 317\u2013338."
    ]
  },
  {
    module: "Simon (Sequenzged\u00E4chtnis)",
    references: [
      "Baddeley, A.D. (2000). The episodic buffer: A new component of working memory? Trends in Cognitive Sciences, 4(11), 417\u2013423.",
      "Conway, C.M. & Christiansen, M.H. (2001). Sequential learning in non-human primates. Trends in Cognitive Sciences, 5(12), 539\u2013546.",
      "Kessels, R.P.C., van den Berg, E., Ruis, C. & Brands, A.M.A. (2008). The backward span of the Corsi Block-Tapping Task and its association with the WAIS-III Digit Span. Assessment, 15(4), 426\u2013434."
    ]
  },
  {
    module: "Wortliste (Verbales Ged\u00E4chtnis)",
    references: [
      "Rey, A. (1941). L\u2019examen psychologique dans les cas d\u2019enc\u00E9phalopathie traumatique. Archives de Psychologie, 28, 215\u2013285.",
      "Helmstaedter, C., Lendt, M. & Lux, S. (2001). Verbaler Lern- und Merkf\u00E4higkeitstest (VLMT). G\u00F6ttingen: Beltz Test.",
      "Lezak, M.D., Howieson, D.B., Bigler, E.D. & Tranel, D. (2012). Neuropsychological Assessment (5th ed.). New York: Oxford University Press."
    ]
  },
  {
    module: "Muster merken (Visuelles Kurzzeitged\u00E4chtnis)",
    references: [
      "Della Sala, S., Gray, C., Baddeley, A. & Wilson, L. (1997). The Visual Patterns Test: A new test of short-term visual recall. Feltham, UK: Thames Valley Test Company.",
      "Luck, S.J. & Vogel, E.K. (1997). The capacity of visual working memory for features and conjunctions. Nature, 390(6657), 279\u2013281. DOI: 10.1038/36846",
      "Alvarez, G.A. & Cavanagh, P. (2004). The capacity of visual short-term memory is set both by visual information load and by number of objects. Psychological Science, 15(2), 106\u2013111."
    ]
  },
  {
    module: "Memo-Match (Visuelles Wiedererkennen)",
    references: [
      "Klingberg, T., Fernell, E., Olesen, P.J. et al. (2005). Computerized training of working memory in children with ADHD \u2014 A randomized, controlled trial. Journal of the American Academy of Child & Adolescent Psychiatry, 44(2), 177\u2013186.",
      "Gathercole, S.E. & Alloway, T.P. (2008). Working Memory and Learning: A Practical Guide for Teachers. London: SAGE Publications.",
      "Unsworth, N. & Engle, R.W. (2007). The nature of individual differences in working memory capacity: Active maintenance in primary memory and controlled search from secondary memory. Psychological Review, 114(1), 104\u2013132."
    ]
  }
];

export const CORE_VALUES = [
  {
    title: "Datensparsam",
    description: "Alle Trainings- und Nutzerdaten werden ausschlie\u00DFlich lokal auf Ihrem Ger\u00E4t gespeichert.",
    Icon: Database
  },
  {
    title: "Wissenschaftlich fundiert",
    description: "Trainingsparadigmen basieren auf etablierter Forschung der kognitiven Psychologie und Neuropsychologie.",
    Icon: Search
  },
  {
    title: "Kein Cloud-Zwang",
    description: "Ihre Daten geh\u00F6ren Ihnen. Nur die Lizenzpr\u00FCfung erfordert eine Internetverbindung.",
    Icon: ShieldCheck
  },
  {
    title: "Made in Germany",
    description: "Entwickelt unter Ber\u00FCcksichtigung der Datenschutz-Grundverordnung (DSGVO). Alle Nutzerdaten verbleiben lokal auf Ihrem Ger\u00E4t.",
    Icon: Award
  }
];

// Produktspezifische Pricing-Daten f\u00FCr "Kognitives Training"
export const PRICING_SECTIONS: PricingSection[] = [
  {
    id: "b2c",
    title: "F\u00FCr Privatanwender",
    subtitle: "Kognitives Training f\u00FCr den pers\u00F6nlichen Gebrauch",
    plans: [
      {
        id: "b2c-standard",
        name: "Standard",
        price: "3,99\u20AC",
        subtext: "Pro Monat (inkl. MwSt.)",
        ctaText: "Jetzt starten",
        ctaLink: "https://rholabs.lemonsqueezy.com/checkout?cart=1320039",
        isExternalCheckout: true,
        features: [
          { text: "1 Ger\u00E4t / Installation" },
          { text: "Alle 7 Trainingsmodule" },
          { text: "Lokale Datenspeicherung" },
          { text: "Monatlich k\u00FCndbar" }
        ]
      },
      {
        id: "b2c-premium",
        name: "Premium",
        price: "4,99\u20AC",
        subtext: "Pro Monat (inkl. MwSt.)",
        ctaText: "Jetzt starten",
        ctaLink: "https://rholabs.lemonsqueezy.com/checkout?cart=1320602",
        isExternalCheckout: true,
        features: [
          { text: "1 Ger\u00E4t / Installation" },
          { text: "Alle 7 Trainingsmodule" },
          { text: "Detaillierte Statistiken & Auswertungen", highlight: true },
          { text: "Export-Funktion (PDF/CSV)", highlight: true },
          { text: "Lokale Datenspeicherung" },
          { text: "Monatlich k\u00FCndbar" }
        ]
      }
    ]
  },
  {
    id: "b2b",
    title: "F\u00FCr Einrichtungen & Teams",
    subtitle: "Professioneller Einsatz mit Mehrnutzer-Verwaltung",
    plans: [
      {
        id: "b2b-normal",
        name: "Einzel-Lizenz",
        price: "14,90\u20AC",
        subtext: "Pro Monat (zzgl. MwSt.)",
        ctaText: "Lizenz erwerben",
        ctaLink: "https://rholabs.lemonsqueezy.com/checkout?cart=1319966",
        isExternalCheckout: true,
        features: [
          { text: "1 Ger\u00E4t / Installation" },
          { text: "Alle 7 Trainingsmodule" },
          { text: "Unbegrenzte Nutzerprofile", highlight: true },
          { text: "Detaillierte Statistiken & Auswertungen", highlight: true },
          { text: "Export-Funktion (PDF/CSV)", highlight: true },
          { text: "Lokale Datenspeicherung" },
          { text: "Monatlich k\u00FCndbar" }
        ]
      },
      {
        id: "b2b-team",
        name: "Team-Lizenz",
        price: "39,90\u20AC",
        subtext: "Pro Monat (zzgl. MwSt.)",
        subtextClass: "text-brand-cyan font-bold",
        isFeatured: true,
        badge: "Bestseller",
        ctaText: "Team-Lizenz erwerben",
        ctaLink: "https://rholabs.lemonsqueezy.com/checkout?cart=1319970",
        isExternalCheckout: true,
        features: [
          { text: "3 Ger\u00E4te / Installationen", highlight: true },
          { text: "Alle 7 Trainingsmodule" },
          { text: "Unbegrenzte Nutzerprofile", highlight: true },
          { text: "Detaillierte Statistiken & Auswertungen", highlight: true },
          { text: "Export-Funktion (PDF/CSV)", highlight: true },
          { text: "Technischer Support inklusive", highlight: true },
          { text: "Lokale Datenspeicherung" },
          { text: "Monatlich k\u00FCndbar" }
        ]
      },
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
          { text: "Feature-Entwicklung auf Wunsch" }
        ]
      }
    ]
  }
];
