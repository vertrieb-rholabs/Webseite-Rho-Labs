import {
  BarChart3,
  Clock,
  Database,
  FileText,
  Gauge,
  Lock,
  Network,
  Search,
  Settings2,
  WifiOff,
} from 'lucide-react';
import type {
  CategoryInfo,
  Demonstration,
  EvidenceEntry,
  Game,
  GameCategory,
  LabProject,
  PipelineItem,
  Principle,
  PricingTier,
  PrivacySection,
  ProductStatus,
  StatsFeature,
} from './types';

/* ── Feste Adressen ───────────────────────────────────────────────────────
   Der Auslieferungsdienst laeuft auf dem eigenen Server (Caddy -> Node).
   Die Ziele der Weiterleitungen sind dort fest verdrahtet und zeigen auf
   /demo/danke/, /demo/fertig/ und /demo/link-abgelaufen/ — mit
   abschliessendem Schraegstrich. Die Routen hier muessen dazu passen.
   Dasselbe gilt fuer den Kaufweg: /kauf/fertig/, /kauf/abgebrochen/ und
   /kauf/in-arbeit/.
   ---------------------------------------------------------------------- */

export const SITE_URL = 'https://rholabs.de';
export const CONTACT_EMAIL = 'kontakt.rholabs@gmail.com';
export const SALES_EMAIL = 'vertrieb.rholabs@gmail.com';

/**
 * Basisadresse des Auslieferungsdienstes.
 *
 * Ueber VITE_API_BASIS ueberschreibbar, damit ein oertlicher Lauf gegen den
 * eigenen Rechner zeigt und nicht gegen die Produktion — sonst ginge eine
 * Probebestellung als echte Bestellung durch. Ohne gesetzte Variable gilt die
 * Produktion, damit die veroeffentlichte Seite auch ohne .env stimmt.
 */
const API_BASIS = (import.meta.env.VITE_API_BASIS ?? 'https://fulfillment.rholabs.de').replace(
  /\/+$/,
  '',
);

/** POST-Ziel des Demo-Formulars. express.urlencoded — also kein enctype setzen. */
export const DEMO_FORM_ACTION = `${API_BASIS}/api/public/demo/anfordern`;

/**
 * POST-Ziel des Kaufformulars der Home-Version. Der Dienst antwortet mit einer
 * Weiterleitung auf die PayPal-Freigabeseite; von dort geht es auf
 * /kauf/fertig, /kauf/abgebrochen oder /kauf/in-arbeit zurueck.
 *
 * Scheitert der Start, leitet der Dienst auf /home zurueck — mit einer
 * Kennung, die sagt, ob der Leser etwas aendern soll oder warten muss:
 *   ?fehler=eingabe  — Angaben unvollstaendig oder ungueltig
 *   ?fehler=zuviele  — Ratengrenze, spaeter erneut
 *   ?fehler=zahlung  — PayPal-Auftrag liess sich nicht anlegen
 */
export const KAUF_FORM_ACTION = `${API_BASIS}/api/public/kauf/start`;

/**
 * Pruefung eines Vorteilscodes: GET mit ?code=… , Antwort { gueltig, preis,
 * preis_regulaer }. Wird nur abgerufen, wenn in der Adresszeile ein Code
 * steht, der dem Format unten entspricht — ohne ?ref= ruft die Seite nichts
 * ab.
 *
 * Die Antwort ist reine ANZEIGE. Massgeblich ist allein, was der Dienst beim
 * Absenden noch einmal selbst prueft und rechnet.
 */
export const PARTNER_PRUEF_URL = `${API_BASIS}/api/public/partner/pruefen`;

/* ── Format der Vorteilscodes ─────────────────────────────────────────────
   Abgestimmt mit dem Auslieferungsdienst (Codeformat im Architekturplan,
   Abschnitt D): acht Zeichen ohne I/L/O/U/0/1, weil die in Handschrift und
   Vorlesen verwechselt werden. In der Anzeige stehen sie als "ABCD-2345"
   gruppiert, deshalb toleriert die Pruefung Bindestriche und
   Kleinschreibung. Wer das hier aendert, muss den Dienst mitziehen.
   ---------------------------------------------------------------------- */

export const VORTEILSCODE_ZEICHEN = 'ABCDEFGHJKMNPQRSTVWXYZ23456789';
export const VORTEILSCODE_LAENGE = 8;

/**
 * Wert, mit dem der Dienst auf /home zurueckleitet, wenn der Code zwischen
 * Anzeige und Absenden ungueltig geworden ist. Er wird ausdruecklich NICHT
 * stillschweigend teurer verkauft — stattdessen kommt der Kaeufer mit
 * ?ref=ungueltig zurueck und sieht einen Hinweis.
 */
export const VORTEILSCODE_UNGUELTIG = 'ungueltig';

/** Leitet auf das juengste Release des Auslieferungskanals weiter. */
export const DOWNLOAD_URL = 'https://download.rholabs.de/download';

export const APP_VERSION = '1.7.0';

/* ── Unternehmensprofile ──────────────────────────────────────────────────
   Reine <a href>-Verweise: es wird nichts von Facebook oder LinkedIn
   nachgeladen, solange niemand klickt. Deshalb entsteht daraus auch kein
   neuer Empfaenger in der Datenschutzerklaerung — anders als bei einem
   eingebetteten Like-Knopf oder einem Skript der Anbieter.
   ---------------------------------------------------------------------- */

export interface SozialesProfil {
  name: string;
  href: string;
}

export const SOZIALE_PROFILE: SozialesProfil[] = [
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/rho-labs-de/' },
  // Noch ohne Benutzernamen — sobald einer vergeben ist, hier auf
  // facebook.com/<name> umstellen. Die Zahlenform bleibt gueltig.
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61594389323662' },
];

/**
 * Wortlaut der Newsletter-Einwilligung.
 *
 * Muss zeichengenau mit EINWILLIGUNG_V1 in `src/main/newsletter.ts` auf dem
 * Auslieferungsdienst übereinstimmen: der Server speichert diesen Text zu
 * jeder Einwilligung, damit auch nach einer Textänderung belegbar bleibt,
 * wozu jemand zugestimmt hat (Art. 7 Abs. 1 DSGVO).
 */
export const NEWSLETTER_EINWILLIGUNG =
  'Ich möchte gelegentlich Neuigkeiten zu neuen Produkten und Versionen per E-Mail erhalten. ' +
  'Die Einwilligung kann ich jederzeit formlos widerrufen.';

/**
 * Wortlaut der beiden Bestaetigungen im Kaufformular der Home-Version.
 *
 * TODO(Rechtstext): Beide Saetze sind ein PLATZHALTER und noch nicht
 * anwaltlich abgestimmt — der endgueltige Wortlaut wird zugeliefert. Danach
 * muessen sie zeichengenau mit der Fassung uebereinstimmen, die der
 * Auslieferungsdienst zu jeder Bestellung ablegt (orders.einwilligung), sonst
 * laesst sich nach einer Textaenderung nicht mehr belegen, wozu jemand
 * zugestimmt hat. Dasselbe Verfahren wie bei NEWSLETTER_EINWILLIGUNG.
 */
/**
 * Die beiden Sätze an den Ankreuzfeldern des Kaufformulars.
 *
 * WORTGLEICH zu `EINWILLIGUNG_AGB_TEXT` und `EINWILLIGUNG_SOFORT_TEXT` im
 * Auslieferungsdienst (Rholabs-fullfilment, src/main/kauf.ts). Der Dienst legt
 * bei jedem Kauf ab, WOZU zugestimmt wurde — zusammen mit Zeitstempel und IP.
 * Weicht der dortige Wortlaut von dem hier ab, bezeugt das Protokoll eine
 * Zustimmung, die der Käufer nie gesehen hat.
 *
 * Wird hier etwas geändert, MUSS es dort mitgeändert werden, und die Fassung
 * `EINWILLIGUNG_FASSUNG` bekommt eine neue Nummer.
 */
export const KAUF_EINWILLIGUNG = {
  agb:
    'Ich habe die Allgemeinen Geschäftsbedingungen und die Lizenzbedingungen ' +
    'gelesen und stimme ihnen zu.',
  sofortBereit:
    'Ich verlange ausdrücklich, dass Sie mit der Bereitstellung der Software vor ' +
    'Ablauf der Widerrufsfrist beginnen. Mir ist bekannt, dass ich mit Beginn der ' +
    'Bereitstellung mein Widerrufsrecht verliere.',
};

export const MDR_DISCLAIMER =
  'Wichtiger Hinweis: Rho-Labs Kognitives Training ist kein Medizinprodukt und kein zugelassenes Therapieinstrument im Sinne der EU-Medizinprodukteverordnung (MDR 2017/745). Die Software dient ausschließlich dem allgemeinen kognitiven Training und der persönlichen Leistungsförderung. Sie ersetzt keine ärztliche oder therapeutische Behandlung. Die dargestellten Auswertungen sind keine medizinischen Diagnosen.';

/* ── Spielekatalog ────────────────────────────────────────────────────── */

export const CATEGORIES: Record<GameCategory, CategoryInfo> = {
  merken: { name: 'Merken & Lernen', color: '#22d3ee' },
  raum: { name: 'Raum & Formen', color: '#c084fc' },
  denken: { name: 'Denken & Steuern', color: '#818cf8' },
  tempo: { name: 'Tempo & Aufmerksamkeit', color: '#fbbf24' },
};

export const CATEGORY_ORDER: GameCategory[] = ['merken', 'raum', 'denken', 'tempo'];

export const GAMES: Game[] = [
  { label: 'Was liegt wo?', cat: 'raum', text: 'Gegenstände in einem Raum ansehen, danach jeden einzeln auf seinen Platz zurücklegen.' },
  { label: 'Muster', cat: 'raum', text: 'Aufleuchtende Felder auf einem Raster von 3×3 bis 5×5 wiedererkennen und nachlegen.' },
  { label: 'Rückwärts-Muster', cat: 'raum', text: 'Dieselbe Folge, aber in umgekehrter Reihenfolge antippen.' },
  { label: 'Spiegelbild', cat: 'raum', text: 'Welcher der Vorschläge ist die Spiegelung der Figur an der roten Achse?' },
  { label: 'Drehen im Kopf', cat: 'raum', text: 'Eine Figur gedanklich drehen und unter gedrehten Varianten wiederfinden.' },
  { label: 'Wegfinder', cat: 'raum', text: 'Einen Weg über Knotenpunkte und Landmarken einprägen und später nachgehen.' },
  { label: 'Memo-Match', cat: 'merken', text: 'Paare aufdecken, allein oder im Duell. Feldgröße von 4 bis 12 Paaren.' },
  { label: 'Wortliste', cat: 'merken', text: 'Drei bis zehn Wörter einprägen und danach frei wiedergeben.' },
  { label: 'Simon', cat: 'merken', text: 'Farb- und Tonfolgen nachspielen, die mit jeder Runde länger werden.' },
  { label: 'Zahlen merken', cat: 'merken', text: 'Zahlenreihen nachsprechen — vorwärts, rückwärts oder gemischt.' },
  { label: 'Figur aus dem Gedächtnis', cat: 'merken', text: 'Eine Strichfigur ansehen und auf dem Punktraster nachzeichnen, auch nach Wartezeit.' },
  { label: 'Bildpaare merken', cat: 'merken', text: 'Bilder gehören zu Orten. Nach den Lerndurchgängen ist jedes Bild wieder zuzuordnen.' },
  { label: 'Auftrag merken', cat: 'merken', text: 'Einen Auftrag annehmen, nebenbei weiterarbeiten und ihn beim richtigen Hinweis ausführen.' },
  { label: 'Schon gesehen?', cat: 'merken', text: 'Bilder lernen, Pause, danach entscheiden: schon gesehen oder neu?' },
  { label: 'Was passt nicht?', cat: 'merken', text: 'Aus einer Gruppe von Zeichen das eine heraussuchen, das nicht dazugehört.' },
  { label: 'Was kam zuerst?', cat: 'merken', text: 'Nach einer Folge entscheiden, welches von zwei Dingen früher zu sehen war.' },
  { label: 'Rückblick-Spiel', cat: 'denken', text: 'Den aktuellen Reiz mit dem von einem, zwei oder drei Schritten vorher vergleichen.' },
  { label: 'Farb-Falle', cat: 'denken', text: 'Die Schriftfarbe angeben, nicht das gelesene Wort — auch unter Zeitdruck.' },
  { label: 'Regel-Finder', cat: 'denken', text: 'Aus Rückmeldungen die verborgene Regel erschließen und danach weiterentscheiden.' },
  { label: 'Merken & Logik', cat: 'denken', text: 'Symbole behalten und zwischendurch Logikaufgaben lösen, ohne die Symbole zu verlieren.' },
  { label: 'Wechselpfad', cat: 'denken', text: 'Einen Pfad abarbeiten und dabei zwischen zwei Regeln hin und her wechseln.' },
  { label: 'Zug um Zug', cat: 'denken', text: 'Ein Ziel in möglichst wenigen Zügen erreichen — vorher durchdenken lohnt sich.' },
  { label: 'Aufmerksamkeit halten', cat: 'tempo', text: 'Über mehrere Blöcke auf ein Zielsignal reagieren und auf alles andere nicht.' },
  { label: 'Rundblick', cat: 'tempo', text: 'Mitte im Blick behalten und zugleich erkennen, was am Rand kurz aufblitzt.' },
  { label: 'Schwarm im Blick', cat: 'tempo', text: 'Einzelne Punkte in einer bewegten Menge verfolgen und am Ende wiederfinden.' },
];

export const GAME_COUNT = GAMES.length;

export function countByCategory(cat: GameCategory): number {
  return GAMES.filter((g) => g.cat === cat).length;
}

/* ── Startseite ───────────────────────────────────────────────────────── */

export const PRINCIPLES: Principle[] = [
  {
    title: 'Daten bleiben lokal',
    text: 'Profile, Verlaufsdaten und Berichte werden auf dem Gerät erzeugt und dort gespeichert. Nichts wird zu uns übertragen.',
    Icon: Database,
  },
  {
    title: 'Verfahren mit Herkunft',
    text: 'Jede Übung geht auf ein etabliertes Verfahren der kognitiven Psychologie zurück. Die Quellen stehen auf der Seite.',
    Icon: Search,
  },
  {
    title: 'Ohne Internet nutzbar',
    text: 'Nach der einmaligen Aktivierung läuft die Anwendung offline. Die Lizenz wird nur periodisch nachgeprüft.',
    Icon: WifiOff,
  },
  {
    title: 'Einmal kaufen',
    text: 'Kein Abo, keine Nutzerstaffel. Sicherheits-Patches und Bugfixes sind kostenlos.',
    Icon: Lock,
  },
];

export const STATUS_LABELS: Record<ProductStatus, string> = {
  available: 'Verfügbar',
  'beta-soon': 'Beta in Vorbereitung',
  'in-development': 'In Entwicklung',
};

export const STATUS_CLASS: Record<ProductStatus, string> = {
  available: 'badge badge--available',
  'beta-soon': 'badge badge--beta',
  'in-development': 'badge badge--dev',
};

// Einzige Quelle fuer Startseiten-Sektion und Fusszeile.
// Status ehrlich halten: 'available' nur, was auch gekauft werden kann.
export const PIPELINE: PipelineItem[] = [
  {
    id: 'kognitives-training',
    name: 'Kognitives Training',
    status: 'available',
    field: 'Kognition & Training',
    description: `${GAME_COUNT} Übungen für Gedächtnis, räumliches Denken, Handlungssteuerung und Aufmerksamkeit. Profilbasiert, auswertbar, offline nutzbar.`,
    href: '/kognitives-training',
  },
  {
    id: 'rhocoat',
    name: 'RhoCoat',
    status: 'beta-soon',
    field: 'Optik & Dünnschicht',
    description:
      'Berechnung und Optimierung optischer Dünnschichtsysteme nach Transfer-Matrix- und S-Matrix-Verfahren — mit Materialdatenbank und mehrkriterieller Optimierung.',
  },
  {
    id: 'medipen',
    name: 'MediPen',
    status: 'beta-soon',
    field: 'Berichte & Dokumentation',
    description:
      'Aus Stichpunkten strukturierte Berichte für Fachteams. Das Sprachmodell läuft lokal — keine Nutzerdaten verlassen den Rechner.',
  },
  {
    id: 'rhooptix',
    name: 'RhoOptix',
    status: 'in-development',
    field: 'Optik & Photonik',
    description:
      'Optische Systeme aufbauen, simulieren und analysieren: geometrische Optik und Wellenoptik in einer Desktop-Anwendung, inklusive Auswertung und Toleranzanalyse.',
  },
];

// Offene Projekte ohne Verkaufsabsicht — bewusst getrennt von PIPELINE.
export const LAB_PROJECTS: LabProject[] = [
  {
    id: 'klimalabor',
    name: 'Klimalabor',
    description:
      'Vier Klimamodelle unterschiedlicher Komplexität, interaktiv nachvollziehbar. Zeigt, wie stark sich die Aussagen ändern, wenn man an den Annahmen dreht.',
    href: 'https://klimalabor.rholabs.de/index.html',
    context: 'Schlüsselkompetenzen-Projekt, Leibniz Universität Hannover',
    tag: 'Lernwerkzeug',
  },
  {
    id: 'modeforge',
    name: 'ModeForge',
    description: 'Werkzeug zum Entwurf von Laser-Strahlführungen — quelloffen und frei nutzbar.',
    href: 'https://modeforge.rholabs.de',
    context: 'Frei verfügbar, ohne Registrierung',
    tag: 'Open Source',
  },
];

/* ── Produktseite ─────────────────────────────────────────────────────── */

export const STATS_FEATURES: StatsFeature[] = [
  {
    title: 'Fortschritt über die Zeit',
    text: 'Verlauf je Übung oder über alle. Trainingspausen werden als Lücke dargestellt und nicht überzeichnet.',
    Icon: BarChart3,
  },
  {
    title: 'Netzdiagramm der Bereiche',
    text: 'Die vier Aufgabenbereiche als Netz — je Schwierigkeitsstufe und als Gesamtsicht, wenn eine Stufe zu dünn belegt ist.',
    Icon: Network,
  },
  {
    title: 'Bestleistungen',
    text: 'Je Übung die eigene Bestmarke: größte Spanne, höchste Trefferquote, wenigste Fehlversuche.',
    Icon: Gauge,
  },
  {
    title: 'Tagesübersicht',
    text: 'Beteiligte Übungen heute, Durchschnitt pro Tag, Dauer je Einheit, aktive Module.',
    Icon: Clock,
  },
  {
    title: 'PDF-Bericht',
    text: 'Ein Blatt mit Spieletabelle, Bestleistungen und Diagrammen — geeignet zum Ablegen oder Mitgeben.',
    Icon: FileText,
  },
  {
    title: 'CSV-Export',
    text: 'Alle Einheiten als Tabelle, für eigene Auswertungen in Excel oder R.',
    Icon: Settings2,
  },
];

/* Alle Anwendungsbilder liegen unter /bilder als verlustfreies WebP: bei
   flaechigen Oberflaechen ist das kleiner als PNG (529 statt 2305 KB) und
   zugleich pixelgenau gleich. Die Masse stehen dabei, damit beim Nachladen
   nichts springt. */

export const SHOT_KATALOG = { width: 2528, height: 2960 };
export const SHOT_VERLAUF = { width: 2422, height: 868 };
export const SHOT_RADAR = { width: 2422, height: 1148 };
export const SHOT_VORFUEHRUNG = { width: 2040, height: 1719 };

export const DEMONSTRATIONS: Demonstration[] = [
  {
    image: 'app-vorfuehrung-muster.webp',
    alt: 'Vorführung Muster: ausgewählte Felder, noch nicht bewertet',
    title: 'Muster',
    text: 'Auswählen, überprüfen, dann die Auflösung: grün richtig, orange übersehen, rot daneben.',
  },
  {
    image: 'app-vorfuehrung-spiegelbild.webp',
    alt: 'Vorführung Spiegelbild: Figur auf dem 4×4-Raster mit roter Achse und vier Vorschlägen',
    title: 'Spiegelbild',
    text: 'Figur auf dem 4×4-Raster, die rote Achse mittendurch, vier Vorschläge daneben.',
  },
  {
    image: 'app-vorfuehrung-auftrag.webp',
    alt: 'Vorführung Auftrag merken: Stern-Hinweis erscheint, Auftrag wird ausgeführt',
    title: 'Auftrag merken',
    text: 'Auftrag annehmen, weiterarbeiten, beim Hinweis ausführen.',
  },
  {
    image: 'app-vorfuehrung-bildpaare.webp',
    alt: 'Vorführung Bildpaare merken: Bilder werden Orten zugeordnet',
    title: 'Bildpaare merken',
    text: 'Orte sind leere Kästen mit kleiner Nummer in der Ecke; die Bilder kommen zurück.',
  },
];

export const USE_CASES: string[] = [
  'Teams in der kognitiven Förderung',
  'Senioren- und Betreuungseinrichtungen, Tagesbetreuung',
  'Betriebliches Gesundheitsmanagement',
  'Forschung und Lehre',
  'Privater Gebrauch',
];

export const SYSTEM_REQUIREMENTS: string[] = [
  'Windows 10 oder neuer',
  '4 GB RAM',
  '200 MB Speicherplatz',
  'Internetverbindung für die Erstaktivierung',
];

/* ── Preise ───────────────────────────────────────────────────────────────
   Zwei Kaufwege je Karte: vorbereitete Bestellmail (Rechnung) und ein
   echter PayPal-Link. Die Enterprise-Karte hat bewusst keinen PayPal-Knopf,
   weil der Preis erst vereinbart wird.

   PLANS ist die Liste der gewerblichen Lizenzen und nichts sonst. Die
   Home-Version steht bewusst NICHT darin, sondern als eigener Eintrag
   HOME_PLAN darunter: ProductPage.tsx rendert jeden PLANS-Eintrag mit
   ctaLink als aeussere Adresse (mailto: oder PayPal). Eine hier angehaengte
   Home-Karte bekaeme damit einen Kaufknopf, der am Checkout vorbeifuehrt —
   und an der Button-Loesung nach § 312j BGB gleich mit. Auf
   /kognitives-training wird auf Home nur verwiesen, gekauft wird auf /home.
   ---------------------------------------------------------------------- */

const orderMail = (subject: string, body: string) =>
  `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const RECHNUNGS_BLOCK =
  '\n\nBitte senden Sie mir eine Rechnung.\n\nName/Firma: \nAdresse: \nRechnungs-Email: \n\nGewünschte Zahlungsart: PayPal / Banküberweisung';

export const PLANS: PricingTier[] = [
  {
    id: 'einzel',
    name: 'Einzel-Lizenz',
    price: '119 €',
    subtext: 'Einmaliger Kauf · 1 Gerät',
    ctaText: 'Lizenz erwerben',
    ctaLink: orderMail(
      'Bestellung Einzellizenz Rho-Labs Kognitives Training',
      `Ich möchte eine Einzellizenz (119€) erwerben.${RECHNUNGS_BLOCK}`,
    ),
    paypalLink: 'https://www.paypal.com/ncp/payment/GLU7XDSD8ZMXJ',
    features: [
      { text: '1 Gerät / Installation' },
      { text: `Alle ${GAME_COUNT} Übungen` },
      { text: 'Klientenverwaltung: unbegrenzt viele Profile', highlight: true },
      { text: 'Trainingsablauf-Editor', highlight: true },
      { text: 'Statistik & Auswertungen je Profil' },
      { text: 'Export als PDF und CSV' },
      { text: 'Kostenlose Patches & Bugfixes' },
      { text: 'Offline nutzbar' },
    ],
  },
  {
    id: 'team',
    name: 'Team-Lizenz',
    price: '309 €',
    subtext: 'Einmaliger Kauf · 3 Geräte',
    badge: 'Bestseller',
    isFeatured: true,
    ctaText: 'Team-Lizenz erwerben',
    ctaLink: orderMail(
      'Bestellung Team-Lizenz Rho-Labs Kognitives Training',
      `Ich möchte eine Team-Lizenz (309€ für 3 Geräte) erwerben.${RECHNUNGS_BLOCK}`,
    ),
    paypalLink: 'https://www.paypal.com/ncp/payment/7RPJTHYFAX4QQ',
    features: [
      { text: '3 Geräte / Installationen', highlight: true },
      { text: `Alle ${GAME_COUNT} Übungen` },
      { text: 'Klientenverwaltung: unbegrenzt viele Profile', highlight: true },
      { text: 'Trainingsablauf-Editor', highlight: true },
      { text: 'Statistik & Auswertungen je Profil' },
      { text: 'Export als PDF und CSV' },
      { text: 'Technischer Support inklusive', highlight: true },
      { text: 'Kostenlose Patches & Bugfixes' },
      { text: 'Offline nutzbar' },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Individuell',
    subtext: 'Ab 5 Lizenzen',
    ctaText: 'Kontakt aufnehmen',
    ctaLink: `mailto:${SALES_EMAIL}?subject=${encodeURIComponent('Anfrage Enterprise-Lizenz')}`,
    features: [
      { text: 'Volumenrabatte' },
      { text: 'Anpassung der Normwerte' },
      { text: 'White-Labeling auf Anfrage' },
      { text: 'Feature-Entwicklung auf Wunsch' },
      { text: 'Gerätezahl nach Absprache', highlight: true },
    ],
  },
];

/**
 * Die Home-Version fuer Privatkunden — einzeln gefuehrt, nicht in PLANS.
 *
 * Gekauft wird ausschliesslich ueber das Formular auf /home; der Knopf zeigt
 * deshalb auf die Sprungmarke des Formulars und nicht nach draussen
 * (`ctaIntern`). Den Preis rechnet der Server selbst aus seinem Katalog — die
 * Angabe hier ist Anzeige, nie Grundlage der Zahlung.
 */
export const HOME_PLAN: PricingTier = {
  id: 'home',
  name: 'Home-Lizenz',
  price: '39,90 €',
  // Wird nur angezeigt, wenn der Dienst einen Vorteilscode bestaetigt hat.
  // Die Zahl dient als Rueckfallebene fuer die Anzeige, falls die Antwort
  // keinen brauchbaren Betrag enthaelt — gerechnet wird sie nie hier.
  vorteilspreis: '35,90 €',
  subtext: 'Einmaliger Kauf · 1 Gerät · kein Abo',
  ctaText: 'Zum Kaufformular',
  ctaLink: '#kaufen',
  ctaIntern: true,
  features: [
    { text: `Alle ${GAME_COUNT} Übungen`, highlight: true },
    { text: 'Ein persönliches Profil', highlight: true },
    { text: 'Persönliche Statistik und Auswertung' },
    { text: 'Trainingsverlauf über die Zeit' },
    { text: 'Export der eigenen Daten als PDF und CSV' },
    { text: 'Einmaliger Kauf, kein Abonnement', highlight: true },
    { text: 'Kostenlose Patches & Bugfixes' },
    { text: 'Offline nutzbar' },
    { text: 'Für Windows 10 und 11', highlight: true },
  ],
};

/**
 * Pflichtangabe unter jeder Preisangabe. Steht auf /kognitives-training und
 * auf /home — deshalb an einer Stelle, damit beide Seiten nicht
 * auseinanderlaufen.
 */
export const PREIS_HINWEIS =
  'Alle Preise sind Endpreise. Gemäß §19 UStG wird keine Umsatzsteuer berechnet. ' +
  'Derzeit ausschließlich in Deutschland erhältlich.';

/* ── Wissenschaftlicher Hintergrund ───────────────────────────────────── */

export const EVIDENCE: EvidenceEntry[] = [
  {
    module: 'Rückblick-Spiel (Arbeitsgedächtnis)',
    references: [
      'Kirchner, W.K. (1958). Age differences in short-term retention of rapidly changing information. Journal of Experimental Psychology, 55(4), 352–358.',
      'Jaeggi, S.M., Buschkuehl, M., Jonides, J. & Perrig, W.J. (2008). Improving fluid intelligence with training on working memory. PNAS, 105(19), 6829–6833. DOI: 10.1073/pnas.0801268105',
      'Owen, A.M., McMillan, K.M., Laird, A.R. & Bullmore, E. (2005). N-back working memory paradigm: A meta-analysis of normative functional neuroimaging studies. Human Brain Mapping, 25(1), 46–59.',
    ],
  },
  {
    module: 'Aufmerksamkeit halten (Daueraufmerksamkeit)',
    references: [
      'Rosvold, H.E., Mirsky, A.F., Sarason, I., Bransome, E.D. & Beck, L.H. (1956). A continuous performance test of brain damage. Journal of Consulting Psychology, 20(5), 343–350.',
      'Riccio, C.A., Reynolds, C.R. & Lowe, P.A. (2001). Clinical Applications of Continuous Performance Tests. New York: Wiley.',
      'Conners, C.K. (2000). Conners’ Continuous Performance Test II (CPT II). Toronto: Multi-Health Systems.',
    ],
  },
  {
    module: 'Was liegt wo? und Muster (räumliche Merkspanne)',
    references: [
      'Corsi, P.M. (1972). Human memory and the medial temporal region of the brain. Dissertation Abstracts International, 34(2-B), 891.',
      'Kessels, R.P.C., van Zandvoort, M.J.E., Postma, A., Kappelle, L.J. & de Haan, E.H.F. (2000). The Corsi Block-Tapping Task: Standardization and normative data. Applied Neuropsychology, 7(4), 252–258. DOI: 10.1207/S15324826AN0704_8',
      'Berch, D.B., Krikorian, R. & Huha, E.M. (1998). The Corsi block-tapping task: Methodological and theoretical considerations. Brain and Cognition, 38(3), 317–338.',
    ],
  },
  {
    module: 'Rückwärts-Muster (Manipulation statt Speicherung)',
    references: [
      'Kessels, R.P.C., van Zandvoort, M.J.E., Postma, A., Kappelle, L.J. & de Haan, E.H.F. (2000). The Corsi Block-Tapping Task: Standardization and normative data. Applied Neuropsychology, 7(4), 252–258. DOI: 10.1207/S15324826AN0704_8',
      'Melby-Lervåg, M., Redick, T.S. & Hulme, C. (2016). Working memory training does not improve performance on measures of intelligence or other measures of „far transfer“. Perspectives on Psychological Science. DOI: 10.1177/1745691616635612',
    ],
  },
  {
    module: 'Simon (Sequenzgedächtnis)',
    references: [
      'Baddeley, A.D. (2000). The episodic buffer: A new component of working memory? Trends in Cognitive Sciences, 4(11), 417–423.',
      'Conway, C.M. & Christiansen, M.H. (2001). Sequential learning in non-human primates. Trends in Cognitive Sciences, 5(12), 539–546.',
      'Kessels, R.P.C., van den Berg, E., Ruis, C. & Brands, A.M.A. (2008). The backward span of the Corsi Block-Tapping Task and its association with the WAIS-III Digit Span. Assessment, 15(4), 426–434.',
    ],
  },
  {
    module: 'Wortliste (verbales Gedächtnis)',
    references: [
      'Rey, A. (1941). L’examen psychologique dans les cas d’encéphalopathie traumatique. Archives de Psychologie, 28, 215–285.',
      'Helmstaedter, C., Lendt, M. & Lux, S. (2001). Verbaler Lern- und Merkfähigkeitstest (VLMT). Göttingen: Beltz Test.',
      'Lezak, M.D., Howieson, D.B., Bigler, E.D. & Tranel, D. (2012). Neuropsychological Assessment (5th ed.). New York: Oxford University Press.',
    ],
  },
  {
    module: 'Muster merken (visuelles Kurzzeitgedächtnis)',
    references: [
      'Della Sala, S., Gray, C., Baddeley, A. & Wilson, L. (1997). The Visual Patterns Test: A new test of short-term visual recall. Feltham, UK: Thames Valley Test Company.',
      'Luck, S.J. & Vogel, E.K. (1997). The capacity of visual working memory for features and conjunctions. Nature, 390(6657), 279–281. DOI: 10.1038/36846',
      'Alvarez, G.A. & Cavanagh, P. (2004). The capacity of visual short-term memory is set both by visual information load and by number of objects. Psychological Science, 15(2), 106–111.',
    ],
  },
  {
    module: 'Memo-Match (visuelles Wiedererkennen)',
    references: [
      'Klingberg, T., Fernell, E., Olesen, P.J. et al. (2005). Computerized training of working memory in children with ADHD — A randomized, controlled trial. Journal of the American Academy of Child & Adolescent Psychiatry, 44(2), 177–186.',
      'Gathercole, S.E. & Alloway, T.P. (2008). Working Memory and Learning: A Practical Guide for Teachers. London: SAGE Publications.',
      'Unsworth, N. & Engle, R.W. (2007). The nature of individual differences in working memory capacity. Psychological Review, 114(1), 104–132.',
    ],
  },
];

/* ── Datenschutz ──────────────────────────────────────────────────────── */

export const PRIVACY_SECTIONS: PrivacySection[] = [
  {
    title: 'Lizenzaktivierung der Anwendung',
    paragraphs: [
      'Bei der Aktivierung überträgt die Anwendung genau drei Angaben an unseren Aktivierungsdienst: die Kennung des Lizenzschlüssels, einen Prüfwert des Geräts und die Version der Anwendung.',
      'Der Prüfwert ist ein SHA-256-Hash aus Rechnername, Prozessormodell, Arbeitsspeichergröße, Betriebssystem, Benutzername und Prozessorarchitektur. Er ist für dasselbe Gerät immer derselbe, weil er das Gerät wiedererkennen und die vereinbarte Gerätezahl je Lizenz einhalten soll. Er ist damit pseudonym und nicht anonym — pseudonyme Daten bleiben personenbezogene Daten. Die Ausgangswerte selbst verlassen das Gerät nicht.',
      'Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Erfüllung des Vertrages). Ohne Aktivierung kann die Lizenz nicht bereitgestellt und die Gerätezahl nicht eingehalten werden; die Bereitstellung dieser Angaben ist für die Nutzung erforderlich.',
      'Der Aktivierungsdienst wird bei der Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Deutschland, betrieben. Aktivierungsdatensätze bewahren wir für die Laufzeit der Lizenz auf und löschen sie danach.',
    ],
  },
  {
    title: 'Zahlungsabwicklung',
    paragraphs: [
      'Für die Zahlung bieten wir PayPal und Banküberweisung an. Die Home-Version wird ausschließlich über PayPal bezahlt.',
      'Bei Zahlung per PayPal werden Sie auf die Website der PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxemburg, weitergeleitet. Dort gelten die Datenschutzbestimmungen von PayPal: https://www.paypal.com/de/webapps/mpp/ua/privacy-full',
      'Beim Kauf der Home-Version legt unser Auslieferungsdienst die Zahlung bei PayPal an und leitet Sie anschließend zur Freigabe dorthin weiter. Übermittelt werden dabei der Verwendungszweck und der Betrag; eine Lieferanschrift wird nicht abgefragt. Nach der Freigabe kehren Sie auf unsere Seite zurück. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO — ohne Zahlung kommt der Kauf nicht zustande.',
      'Bei Zahlung per Banküberweisung werden keine Daten an Dritte übermittelt.',
    ],
  },
  {
    title: 'Trainings- und Nutzerdaten',
    paragraphs: [
      'Profile, Trainingsergebnisse, Verlaufsdaten und Berichte entstehen auf dem Gerät und bleiben dort. Sie werden nicht an uns oder an Dritte übertragen. Der Lizenzschlüssel wird verschlüsselt über den Schlüsselspeicher des Betriebssystems abgelegt.',
    ],
  },
  {
    title: 'Kauf der Home-Version',
    paragraphs: [
      'Wenn du über das Kaufformular auf /home die Home-Version bestellst, verarbeiten wir deine E-Mail-Adresse, deinen Namen, deine IP-Adresse zum Zeitpunkt der Bestellung und den Zeitpunkt selbst.',
      'Zweck: Abwicklung des Kaufs, Ausstellung des Lizenzschlüssels, Erstellung der Rechnung und Schutz des Formulars vor missbräuchlicher Nutzung. Der Name erscheint auf der Rechnung. Eine Postanschrift fragen wir nicht ab; bei einer Kleinbetragsrechnung nach § 33 UStDV ist sie nicht erforderlich.',
      'Einwilligungsprotokoll: Zu deiner Bestätigung der Allgemeinen Geschäftsbedingungen und deiner Zustimmung zur sofortigen Bereitstellung speichern wir jeweils den Wortlaut, dem du zugestimmt hast, den Zeitpunkt und deine IP-Adresse. Wir müssen belegen können, dass und wozu du zugestimmt hast; ohne diesen Nachweis könnten wir dir die Lizenz nicht sofort ausliefern.',
      'Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Erfüllung des Vertrages). Für die Speicherung der IP-Adresse im Einwilligungsprotokoll zusätzlich Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit den Nachweispflichten aus §§ 312f, 356 BGB sowie Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der Schutz des Formulars vor Missbrauch.',
      'Abruf beim Auslieferungsdienst: Das Kaufformular sendet unmittelbar an unseren eigenen Auslieferungsdienst unter fulfillment.rholabs.de. Dabei erfährt dieser Dienst deine IP-Adresse und die üblichen Verbindungsdaten. Er läuft auf unserem Server in Deutschland; ein Dritter ist daran nicht beteiligt. Solange du das Formular nicht absendest, wird von dort nichts geladen und nichts abgerufen.',
      'Speicherdauer: Bestellung, Rechnung und Einwilligungsprotokoll bewahren wir für die Dauer der gesetzlichen Aufbewahrungsfristen auf (§ 147 AO, § 257 HGB).',
      'Empfänger: PayPal für die Zahlung (siehe Zahlungsabwicklung) und unser E-Mail-Anbieter für den Versand von Lizenzschlüssel und Rechnung. Eine darüber hinausgehende Weitergabe findet nicht statt.',
    ],
  },
  {
    title: 'Demo-Anfrage',
    paragraphs: [
      'Wenn du über das Formular auf unserer Website eine kostenlose Demo anforderst, verarbeiten wir deine E-Mail-Adresse, deine IP-Adresse zum Zeitpunkt der Anfrage und den Zeitpunkt der Anfrage und der Bestätigung.',
      'Zweck: Zusendung des Demo-Schlüssels und Schutz vor missbräuchlicher Nutzung des Formulars (Versandmissbrauch, automatisierte Massenanfragen).',
      'Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen auf deine Anfrage). Für die Speicherung der IP-Adresse zusätzlich Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der Schutz unseres Systems und unseres E-Mail-Versands vor Missbrauch.',
      'Doppelte Bestätigung: Nach dem Absenden erhältst du zunächst nur eine E-Mail mit einem Bestätigungslink. Erst wenn du diesen Link anklickst, erzeugen wir den Demo-Schlüssel und senden ihn zu. Ohne Bestätigung geschieht nichts weiter. Dieses Verfahren stellt sicher, dass niemand fremde Adressen bei uns einträgt.',
      'Speicherdauer: Bestätigte Anfragen bewahren wir ein Jahr auf, weil je Adresse eine Demo pro Jahr vorgesehen ist. Unbestätigte Anfragen werden nach 24 Stunden gegenstandslos und gelöscht. Der Bestätigungslink wird nicht im Klartext gespeichert, sondern nur als Prüfwert.',
      'Empfänger: Der Versand erfolgt über unseren E-Mail-Anbieter. Eine darüber hinausgehende Weitergabe findet nicht statt. Die Daten liegen auf unserem Server in Deutschland.',
      'Getrennt vom Newsletter: Die Demo-Anfrage allein ist keine Anmeldung zu Werbung. Ohne das zusätzliche, freiwillige Häkchen verwenden wir deine Adresse ausschließlich für die Demo und die damit zusammenhängenden Nachrichten.',
    ],
  },
  {
    title: 'Neuigkeiten per E-Mail',
    paragraphs: [
      'Im Demo-Formular kannst du zusätzlich ankreuzen, dass du gelegentlich Neuigkeiten zu neuen Produkten und Versionen erhalten möchtest. Das Häkchen ist freiwillig und nicht vorausgewählt; die Demo bekommst du auch ohne.',
      'Verarbeitet werden dafür deine E-Mail-Adresse, dein Name, falls du ihn angegeben hast, der Zeitpunkt der Einwilligung, deine IP-Adresse zu diesem Zeitpunkt und der Wortlaut, dem du zugestimmt hast. Den Wortlaut speichern wir, damit auch nach einer späteren Textänderung nachvollziehbar bleibt, wozu du ja gesagt hast.',
      'Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), für den Versand zusätzlich § 7 Abs. 2 Nr. 2 UWG. Die Einwilligung wird erst mit dem Klick auf den Bestätigungslink wirksam — bis dahin stehst du nicht im Verteiler.',
      'Empfänger: keine. Die Nachrichten schreiben wir von Hand aus unserem eigenen Postfach; es ist kein Versanddienstleister eingeschaltet. Es findet keine Öffnungs- oder Klickmessung statt, und wir bilden keine Profile.',
      'Speicherdauer: bis zum Widerruf. Danach bewahren wir den Eintrag mit dem Vermerk des Widerrufs auf, solange wir nachweisen können müssen, dass und wann du widersprochen hast.',
      'Widerruf: jederzeit und formlos — eine Antwort auf eine unserer Nachrichten genügt, ebenso eine kurze Mail an kontakt.rholabs@gmail.com. Die Rechtmäßigkeit der Verarbeitung bis zum Widerruf bleibt davon unberührt (Art. 7 Abs. 3 DSGVO).',
    ],
  },
  {
    title: 'Auslieferung dieser Website',
    paragraphs: [
      'Die Website wird als vorgerenderte, statische Seite über GitHub Pages (GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA) ausgeliefert. Beim Abruf verarbeitet GitHub technisch notwendige Verbindungsdaten wie IP-Adresse, Zeitpunkt und angeforderte Datei in Server-Protokollen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der sichere und zuverlässige Betrieb der Website. Grundlage der Übermittlung in die USA sind die Standardvertragsklauseln der EU-Kommission. Einzelheiten: https://docs.github.com/site-policy/privacy-policies/github-privacy-statement',
      'Schriften, Bilder und der Trailer werden von unserer eigenen Domain geladen. Es werden keine Schriften, Skripte oder Bibliotheken von Dritten nachgeladen. Wir setzen keine Cookies, betreiben keine Analyse und binden kein Tracking ein.',
      'Das gilt auch für die Seite der Home-Version: Sie lädt nichts von PayPal und nichts von unserem Auslieferungsdienst nach. Erst wenn du das Kaufformular absendest, verbindet sich dein Browser mit unserem Auslieferungsdienst — und erst danach leitet dieser dich zu PayPal weiter.',
    ],
  },
  {
    title: 'E-Mail-Kommunikation',
    paragraphs: [
      'Wenn du uns schreibst, verarbeiten wir die Angaben aus deiner Nachricht, um sie zu beantworten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bei vertraglichen und vorvertraglichen Anliegen, sonst Art. 6 Abs. 1 lit. f DSGVO. Wir bewahren Korrespondenz so lange auf, wie es für die Bearbeitung und für gesetzliche Aufbewahrungspflichten nötig ist.',
    ],
  },
  {
    title: 'Deine Rechte',
    paragraphs: [
      `Du hast das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) und Widerspruch (Art. 21 DSGVO). Wende dich dafür an ${CONTACT_EMAIL}.`,
      'Außerdem kannst du dich bei einer Aufsichtsbehörde beschweren. Für uns zuständig ist der Thüringer Landesbeauftragte für den Datenschutz und die Informationsfreiheit.',
    ],
  },
];
