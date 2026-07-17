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
import { ModuleItem, PricingTier, PricingSection, StatItem, PipelineItem, LabProject, ProductStatus } from './types';

export const CONTACT_EMAIL = "kontakt.rholabs@gmail.com";
export const SALES_EMAIL = "vertrieb.rholabs@gmail.com";

export const MDR_DISCLAIMER = "Wichtiger Hinweis: Rho-Labs Kognitives Training ist kein Medizinprodukt und kein zugelassenes Therapieinstrument im Sinne der EU-Medizinprodukteverordnung (MDR 2017/745). Die Software dient ausschlie\u00DFlich dem allgemeinen kognitiven Training und der pers\u00F6nlichen Leistungsf\u00F6rderung. Sie ersetzt keine \u00E4rztliche oder therapeutische Behandlung. Die dargestellten Auswertungen sind keine medizinischen Diagnosen.";

export const STATS: StatItem[] = [
  { value: "7+", label: "Trainingsmodule" },
  { value: "Lokal", label: "Datenspeicherung" },
  { value: "\u221E", label: "Nutzerprofile" },
  { value: "Einmalig", label: "Einmalkauf" },
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
    title: "Aufmerksamkeit",
    subtitle: "Konzentration & Reaktion",
    description: "Training der Daueraufmerksamkeit, Reaktionskontrolle und Konzentration \u00FCber drei \u00DCbungsbl\u00F6cke mit detaillierter Auswertung.",
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
    description: "Ihre Daten geh\u00F6ren Ihnen. Nach einmaliger Aktivierung funktioniert die Software komplett ohne Internet.",
    Icon: ShieldCheck
  },
  {
    title: "Made in Germany",
    description: "Entwickelt unter Ber\u00FCcksichtigung der Datenschutz-Grundverordnung (DSGVO). Alle Nutzerdaten verbleiben lokal auf Ihrem Ger\u00E4t.",
    Icon: Award
  }
];

export const STATUS_LABELS: Record<ProductStatus, string> = {
  'available': "Verf\u00FCgbar",
  'beta-soon': "Beta in Vorbereitung",
  'in-development': "In Entwicklung"
};

// Single Source of Truth f\u00FCr Landing-Page-Sektion und Footer.
// Status ehrlich halten: 'available' nur, was auch gekauft werden kann.
export const PIPELINE: PipelineItem[] = [
  {
    id: "kognitives-training",
    name: "Kognitives Training",
    status: "available",
    field: "Kognition & Training",
    description: "Sieben Module f\u00FCr Ged\u00E4chtnis, Aufmerksamkeit und kognitive Flexibilit\u00E4t. Profilbasiert, auswertbar und vollst\u00E4ndig offline nutzbar.",
    href: "/kognitives-training"
  },
  {
    id: "rhocoat",
    name: "RhoCoat",
    status: "beta-soon",
    field: "Optik & D\u00FCnnschicht",
    description: "Berechnung und Optimierung optischer D\u00FCnnschichtsysteme nach Transfer-Matrix- und S-Matrix-Verfahren \u2014 mit Materialdatenbank und mehrkriterieller Optimierung.",
  },
  {
    id: "medipen",
    name: "MediPen",
    status: "beta-soon",
    field: "Therapie & Dokumentation",
    description: "Aus Stichpunkten strukturierte Therapieberichte f\u00FCr Ergo- und Logop\u00E4die-Praxen. Das Sprachmodell l\u00E4uft lokal \u2014 keine Patientendaten verlassen den Rechner.",
  },
  {
    id: "rhooptix",
    name: "RhoOptix",
    status: "in-development",
    field: "Optik & Photonik",
    description: "Optische Systeme aufbauen, simulieren und analysieren: geometrische Optik und Wellenoptik in einer Desktop-Anwendung, inklusive Auswertung und Toleranzanalyse.",
  }
];

// Offene Projekte ohne Verkaufsabsicht \u2014 bewusst getrennt von PIPELINE.
export const LAB_PROJECTS: LabProject[] = [
  {
    id: "klimalabor",
    name: "Klimalabor",
    description: "Vier Klimamodelle unterschiedlicher Komplexit\u00E4t, interaktiv nachvollziehbar. Zeigt, wie stark sich die Aussagen \u00E4ndern, wenn man an den Annahmen dreht.",
    href: "https://klimalabor.rholabs.de/index.html",
    context: "Schl\u00FCsselkompetenzen-Projekt, Leibniz Universit\u00E4t Hannover",
    tag: "Lernwerkzeug"
  },
  {
    id: "modeforge",
    name: "ModeForge",
    description: "Werkzeug zum Entwurf von Laser-Strahlf\u00FChrungen \u2014 quelloffen und frei nutzbar.",
    href: "https://modeforge.rholabs.de",
    context: "Frei verf\u00FCgbar, ohne Registrierung",
    tag: "Open Source"
  }
];

// Produktspezifische Pricing-Daten f\u00FCr "Kognitives Training"
export const PRICING_SECTIONS: PricingSection[] = [
  {
    id: "b2b",
    title: "F\u00FCr Einrichtungen & Teams",
    subtitle: "Professioneller Einsatz \u2014 einmalige Investition, dauerhafter Nutzen",
    plans: [
      {
        id: "b2b-normal",
        name: "Einzel-Lizenz",
        price: "119\u20AC",
        subtext: "Einmaliger Kauf",
        ctaText: "Lizenz erwerben",
        ctaLink: "mailto:vertrieb.rholabs@gmail.com?subject=Bestellung%20Einzellizenz%20Rho-Labs%20Kognitives%20Training&body=Ich%20m\u00F6chte%20eine%20Einzellizenz%20(119\u20AC)%20erwerben.%0A%0ABitte%20senden%20Sie%20mir%20eine%20Rechnung.%0A%0AName%2FFirma%3A%20%0AAdresse%3A%20%0ARechnungs-Email%3A%20%0A%0AGew\u00FCnschte%20Zahlungsart%3A%20PayPal%20%2F%20Bank\u00FCberweisung",
        isExternalCheckout: false,
        paypalLink: "https://www.paypal.com/ncp/payment/GLU7XDSD8ZMXJ",
        paypalText: "Sofort per PayPal kaufen",
        features: [
          { text: "1 Ger\u00E4t / Installation" },
          { text: "Alle 7 Trainingsmodule" },
          { text: "Unbegrenzte Nutzerprofile", highlight: true },
          { text: "Detaillierte Statistiken & Auswertungen", highlight: true },
          { text: "Export-Funktion (PDF/CSV)", highlight: true },
          { text: "Lokale Datenspeicherung" },
          { text: "Kostenlose Patches & Bugfixes", highlight: true },
          { text: "Vollst\u00E4ndig offline nutzbar", highlight: true }
        ]
      },
      {
        id: "b2b-team",
        name: "Team-Lizenz",
        price: "309\u20AC",
        subtext: "Einmaliger Kauf \u00B7 3 Lizenzen",
        subtextClass: "text-brand-cyan font-bold",
        isFeatured: true,
        badge: "Bestseller",
        ctaText: "Team-Lizenz erwerben",
        ctaLink: "mailto:vertrieb.rholabs@gmail.com?subject=Bestellung%20Team-Lizenz%20Rho-Labs%20Kognitives%20Training&body=Ich%20m\u00F6chte%20eine%20Team-Lizenz%20(309\u20AC%20f\u00FCr%203%20Ger\u00E4te)%20erwerben.%0A%0ABitte%20senden%20Sie%20mir%20eine%20Rechnung.%0A%0AName%2FFirma%3A%20%0AAdresse%3A%20%0ARechnungs-Email%3A%20%0A%0AGew\u00FCnschte%20Zahlungsart%3A%20PayPal%20%2F%20Bank\u00FCberweisung",
        isExternalCheckout: false,
        paypalLink: "https://www.paypal.com/ncp/payment/7RPJTHYFAX4QQ",
        paypalText: "Sofort per PayPal kaufen",
        features: [
          { text: "3 Ger\u00E4te / Installationen", highlight: true },
          { text: "Alle 7 Trainingsmodule" },
          { text: "Unbegrenzte Nutzerprofile", highlight: true },
          { text: "Detaillierte Statistiken & Auswertungen", highlight: true },
          { text: "Export-Funktion (PDF/CSV)", highlight: true },
          { text: "Technischer Support inklusive", highlight: true },
          { text: "Lokale Datenspeicherung" },
          { text: "Kostenlose Patches & Bugfixes", highlight: true },
          { text: "Vollst\u00E4ndig offline nutzbar", highlight: true }
        ]
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: "Individuell",
        isEnterprise: true,
        subtext: "Ab 5+ Lizenzen",
        ctaText: "Kontakt aufnehmen",
        ctaLink: `mailto:${SALES_EMAIL}?subject=Anfrage%20Enterprise-Lizenz`,
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
