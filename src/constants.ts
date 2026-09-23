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

/**
 * Telefonnummer des Anbieters. Eine Stelle fuer Impressum, AGB und
 * Widerrufsbelehrung.
 *
 * Art. 246a § 1 Abs. 1 Nr. 3 EGBGB verlangt sie ohne Vorbehalt, und
 * Gestaltungshinweis [2] der Anlage 1 EGBGB fuellt sich ohne sie nicht
 * vollstaendig. scripts/telefon.test.mjs haelt das fest.
 *
 * Die Nummer muss erreichbar bleiben — eine tote Nummer im Pflichtfeld waere
 * eine falsche Pflichtangabe. Wer sie aendert, aendert auch COMPANY_PHONE in
 * der .env des Fulfillment-Dienstes; beide muessen dasselbe sagen.
 */
export const KONTAKT_TELEFON = '+49 3692 118422';

export const SALES_EMAIL = 'vertrieb.rholabs@gmail.com';

/**
 * Die Adresse fuer alles, was eine BEREITS ERWORBENE Lizenz betrifft:
 * Aktivierung, Gerätewechsel, Umbindung, verlorener Lizenzschluessel.
 *
 * ── Warum es diese Konstante gibt ───────────────────────────────────────────
 * Fuer denselben Vorgang — die Umbindung einer Lizenz auf ein neues Geraet —
 * nannten die abgenommenen Lizenzbedingungen `kontakt.rholabs@gmail.com`, der
 * Aktivierungsdienst im Fehlerfall aber `vertrieb.rholabs@gmail.com`. Der
 * Kaeufer bekam zwei Adressen und musste raten.
 *
 * ES GILT `kontakt.rholabs@gmail.com`, und zwar weil diese Adresse an der
 * staerksten Stelle steht: in den abgenommenen, dreifach geprueften
 * Lizenzbedingungen (zweimal: Gerätebindung und Weitergabe) und im
 * Vertragspartner-Block der Allgemeinen Geschaeftsbedingungen. Sie ist damit
 * die vertraglich veroeffentlichte Adresse. Die andere zu waehlen hiesse, drei
 * abgenommene Texte zu aendern, damit eine Fehlermeldung recht behaelt.
 *
 * Der Aktivierungsdienst muss darauf nachgezogen werden (`routes.ts:789` im
 * Auslieferungsdienst); diese Aenderung macht nicht diese Seite.
 *
 * `SALES_EMAIL` bleibt, was es ist: der Weg fuer Angebote, Volumenlizenzen und
 * gewerbliche Bestellungen — also fuer Vertraege, die noch nicht bestehen.
 */
export const LIZENZ_SUPPORT_EMAIL = CONTACT_EMAIL;

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

/* ── Hier stand DIENST_URSPRUNG. Entfernt am 22.09.2026 ─────────────────────
   Der Ursprung des Dienstes diente an genau einer Stelle als „Nachweis": Die
   Ergebnisseite des Widerrufs verglich ihn mit `document.referrer` und
   behauptete bei Gleichheit den Eingang der Erklaerung.

   Ein Referrer ist kein Nachweis. Er sagt, welche Seite zuletzt offen war —
   nicht, dass ein Vorgang stattgefunden hat. Jede Seite unter dem Rechnernamen
   des Dienstes haette den Satz ausgeloest. Auf dem ECHTEN Weg war er dagegen
   leer, weil der Dienst auf seiner Pruefen-Seite `Referrer-Policy:
   no-referrer` setzt. Beides nachgemessen in `scripts/ablauf.test.mjs`.

   Die Ergebnisseite unterscheidet seitdem nicht mehr, woher ihr Besucher kommt
   — sie sagt allen dasselbe, und das ist immer wahr. Begruendung im Kopf von
   `src/pages/widerruf/WiderrufEingegangen.tsx`.
   -------------------------------------------------------------------------- */

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
 * POST-Ziel der Widerrufsfunktion nach § 356a BGB, erste Stufe.
 *
 * Der Dienst antwortet mit einer Weiterleitung auf SEINE EIGENE Pruefen-Seite
 * — die zweite Stufe nach § 356a Abs. 3, die den Knopf „Widerruf bestaetigen"
 * traegt. Diese Seite liefert der Dienst und nicht die Website: die Website
 * ist vorgerendert und kennt die eben eingegebenen Daten ohne JavaScript
 * nicht, und Name und Adresse gehoeren nicht in die Adresszeile einer
 * oeffentlichen Seite.
 *
 * Scheitert die Eingabe, leitet der Dienst hierher zurueck:
 *   ?fehler=eingabe  — Angaben unvollstaendig oder ungueltig
 *   ?fehler=zuviele  — Ratengrenze, spaeter erneut
 */
export const WIDERRUF_FORM_ACTION = `${API_BASIS}/api/public/widerruf/eingabe`;

/**
 * Beschriftung und Pfad der Widerrufsfunktion — WORTGLEICH an jeder Stelle.
 *
 * § 356a Abs. 1 Satz 2 verlangt, dass die Funktion „gut lesbar mit ‚Vertrag
 * widerrufen‘ oder einer anderen gleichbedeutenden eindeutigen Formulierung
 * beschriftet" ist, Satz 3 zusaetzlich, dass sie waehrend des Fristlaufs
 * staendig verfuegbar und hervorgehoben platziert ist.
 *
 * Zwei Konstanten, damit Fusszeile, Kaufseite, die beiden Kauf-Ergebnisseiten
 * und die Belehrung nicht auseinanderlaufen. Der Pfad steht wortgleich auch im
 * amtlichen Baustein der Widerrufsbelehrung und in `rechtstexte.ts` des
 * Dienstes; wer ihn hier aendert, muss beide mitziehen.
 */
export const WIDERRUF_FUNKTION_LABEL = 'Vertrag widerrufen';
export const WIDERRUF_FUNKTION_PFAD = '/vertrag-widerrufen';

/* ── Hier standen WIDERRUF_EINGANG_PARAMETER und _NACHWEIS. Entfernt am 22.09.2026
   ─────────────────────────────────────────────────────────────────────────────
   Die beiden Werte bildeten das Anhaengsel `?eingang=bestaetigt`, mit dem der
   Dienst der Ergebnisseite den Eingang einer Widerrufserklaerung haette
   melden sollen. Gesetzt hat er es nie; ausloesen konnte es jeder.

   Eine feste, im Erzeugnis nachlesbare Zeichenfolge in der Adresszeile ist
   kein Nachweis, sondern eine Einladung: Wer sie eintippt oder verlinkt,
   bekommt den Satz „Ihr Widerruf ist eingegangen“ zu sehen, ohne dass beim
   Dienst je etwas angekommen ist. Bei einer fristgebundenen Rechtsausuebung
   ist genau das der Schaden, den die Aenderung verhindern sollte.

   Ersatzlos gestrichen, nicht durch ein besseres Anhaengsel ersetzt: Die
   Ergebnisseite sagt jetzt allen dasselbe und behauptet keinen Eingang mehr.
   Es gibt damit auch KEINE Abrede mehr, die Dienst und Website gemeinsam
   einhalten muessten — der 303 des Dienstes bleibt, wie er ist. Begruendung
   und der Weg, auf dem der Dienst den Erfolgssatz selbst sagen kann, im Kopf
   von `src/pages/widerruf/WiderrufEingegangen.tsx`.
   ───────────────────────────────────────────────────────────────────────────── */

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
 * Die beiden Sätze an den Ankreuzfeldern des Kaufformulars.
 *
 * Wortgleich mit den freigegebenen AGB und der Widerrufsbelehrung, und
 * wortgleich zu `EINWILLIGUNG_AGB_TEXT` und `EINWILLIGUNG_SOFORT_TEXT` im
 * Auslieferungsdienst (Rholabs-fullfilment, src/main/kauf.ts). Der Dienst legt
 * bei jedem Kauf ab, wozu zugestimmt wurde. Weicht der dortige Wortlaut ab,
 * bezeugt das Protokoll eine Zustimmung, die der Käufer nie gesehen hat.
 *
 * Wird hier etwas geändert, muss es dort mitgeändert werden, und die Fassung
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
  /* ── Nachtrag 22.09.2026 ──────────────────────────────────────────────────
     Hier stand: „Nach der einmaligen Aktivierung läuft die Anwendung offline.
     Die Lizenz wird nur periodisch nachgeprüft." Der zweite Satz war für
     beide Ausführungen falsch, und zwar in entgegengesetzte Richtungen:

       Die GEKAUFTE Lizenz wird gar nicht nachgeprüft. Der Client meldet sich
       nach der Aktivierung nicht von selbst wieder (`refreshDemoClock` kehrt
       ohne Demo-Schlüssel sofort zurück, main.js:361); die README des
       Clients sagt denselben Satz.

       Die DEMO dagegen meldet sich sehr wohl — im Sekundentakt geprüft
       (`setInterval(enforce, 1000)`, main.js:1417), online höchstens alle
       fünf Minuten —, und eine erfolgreiche Prüfung gibt jeweils nur bis zu
       72 Stunden Offlinezeit frei (`demo-clock.cjs:2`, OFFLINE_MS).

     „Periodisch nachgeprüft" beschrieb also weder das eine noch das andere,
     und für den Demo-Nutzer war es die gefährlichere Hälfte: Er durfte
     annehmen, die 14 Tage stünden ihm auch ohne Netz zu. Der Abschnitt
     „Lizenzaktivierung der Anwendung" der Datenschutzerklärung sagt beides
     seit dem 22.09.2026 richtig; die Startseite sagt es jetzt auch.
     -------------------------------------------------------------------------- */
  {
    title: 'Ohne Internet nutzbar',
    text: 'Nach der einmaligen Aktivierung läuft die gekaufte Anwendung offline — sie meldet sich nicht von selbst wieder. Nur die 14-Tage-Demo prüft ihre Restlaufzeit regelmäßig online nach.',
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

/**
 * Die Systemanforderungen, wie sie der Pflichtblock unmittelbar vor dem
 * Bestellknopf ausgibt (§ 312j Abs. 2 BGB, Art. 246a § 1 Abs. 1 Nr. 1 EGBGB).
 *
 * Der erste Punkt hiess bis zum 22.09.2026 „Windows 10 oder neuer". Das ist
 * eine ANDERE Zusage als die, die die abgenommenen Vertragsbedingungen und die
 * Bestaetigungsmail tragen: „Kompatibel ist die Software derzeit nur mit
 * Windows 10 und Windows 11." Ausgerechnet an der Stelle, an der der Kaeufer
 * die wesentlichen Eigenschaften zur Kenntnis nimmt, stand damit die weitere
 * Fassung. Gleichgezogen auf den Wortlaut der abgenommenen Texte; der Kasten
 * „Systemvoraussetzung" auf /home und die Kopfzeile der Startseite sagen
 * dasselbe.
 *
 * ── Die Architektur, nachgetragen am 22.09.2026 ────────────────────────────
 * „Windows 10 oder Windows 11" ist die halbe Bedingung. Der Client wird
 * ausschliesslich fuer x64 gebaut: `package.json` des Clients traegt unter
 * `build.win.target` genau ein Ziel — `nsis` mit `arch: ['x64']` —, und
 * `scripts/check-release.cjs` weist jedes abweichende Bauziel zurueck; die
 * README des Clients sagt es in ihrer ersten Zeile („Client 1.8.0 fuer
 * Windows x64").
 *
 * Wer Windows 11 auf ARM64 oder ein 32-Bit-System hat, erfuellt also die
 * bisher veroeffentlichte Bedingung vollstaendig und kann den Installer
 * trotzdem nicht benutzen. Das ist keine Nebensache des Kleingedruckten,
 * sondern eine wesentliche Eigenschaft im Sinne von Art. 246a § 1 Abs. 1
 * Nr. 1 EGBGB, und sie steht mit diesem Eintrag da, wo § 312j Abs. 2 BGB sie
 * verlangt: unmittelbar vor dem Bestellknopf.
 *
 * Als EIGENER Punkt und nicht angehaengt an den ersten: Der erste Punkt gibt
 * den Wortlaut der abgenommenen Texte wieder, und der bleibt unangetastet.
 * Die Architektur kommt hinzu, sie widerspricht ihm nicht — die abgenommenen
 * Texte sagen zur Architektur schlicht nichts. Dass sie dazu schweigen, ist
 * ein Befund fuer sich; er gehoert in den Bericht, nicht in eine eigenmaechtige
 * Textaenderung.
 */
export const SYSTEM_REQUIREMENTS: string[] = [
  'Windows 10 oder Windows 11',
  '64-Bit (x64) — für ARM64 und 32-Bit gibt es keine Fassung',
  '4 GB RAM',
  '200 MB Speicherplatz',
  'Internetverbindung für die Erstaktivierung',
];

/* ── Preise ───────────────────────────────────────────────────────────────
   EIN Kaufweg je Karte: die vorbereitete Bestellmail. Rechnung, Zahlung und
   Lizenzschluessel laufen danach von Hand.

   ── Warum hier kein PayPal-Knopf mehr steht (22.09.2026) ──────────────────
   Bis heute trugen die Einzel- und die Team-Karte zusaetzlich einen Knopf
   „Sofort per PayPal kaufen" mit einem direkten Link auf
   paypal.com/ncp/payment/…. Damit stand auf einer oeffentlich erreichbaren
   Seite ein vollautomatischer Kaufweg — fuer jeden, der ihn anklickt.

   Das ging nicht zusammen mit dem, was die abgenommenen Texte sagen. Die
   Allgemeinen Geschaeftsbedingungen erklaeren sich ausdruecklich nur fuer die
   HOME-Lizenz zustaendig und richten sich an Verbraucher (§ 13 BGB); die
   Lizenzbedingungen ebenso. Fuer Einzel und Team gab es also einen Vertrag
   ohne Bedingungen, ohne Widerrufsbelehrung und ohne die Pflichtangaben, die
   § 312j Abs. 2 BGB unmittelbar vor dem Bestellknopf verlangt — samt
   Schaltflaechenloesung nach Abs. 3. Nichts davon liess sich nachruesten:
   Der Bestellknopf steht auf der Seite von PayPal, und die gehoert uns nicht.

   Eine blosse Ansage „nur fuer Unternehmer" neben dem Knopf haette das nicht
   geheilt. Wirksam ist eine solche Beschraenkung nur, wenn der Verkaufsweg
   sie auch durchsetzt; ein Knopf, der jeden Klick ohne Rueckfrage zur Zahlung
   fuehrt, setzt gar nichts durch.

   Geblieben ist der Weg, der schon immer danebenstand und der den Befund
   gerade NICHT traegt: die Bestellmail. Sie ist kein automatisierter
   Bestellvorgang, sondern eine Anfrage; der Vertrag kommt erst mit unserem
   Angebot und der Rechnung zustande. Wer dort als Verbraucher schreibt,
   bekommt die Pflichtangaben und die Belehrung mit dem Angebot — von Hand,
   im Einzelfall, mit einem Menschen dazwischen. Privatkunden gehoeren
   ohnehin auf /home: Dort steht der vollstaendige Verbraucher-Bestellvorgang
   mit Pflichtblock, Schaltflaechenloesung und abgenommenen Texten.

   Wer den automatischen Weg fuer Einzel und Team zurueckhaben will, braucht
   dafuer dasselbe, was /home hat — nicht einen Link. Was genau, steht im
   Bericht zu dieser Runde.

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
    // „anfragen", nicht „erwerben": Der Knopf oeffnet eine Bestellmail und
    // schliesst keinen Vertrag. Er soll auch nicht so aussehen.
    ctaText: 'Lizenz anfragen',
    ctaLink: orderMail(
      'Bestellung Einzellizenz Rho-Labs Kognitives Training',
      `Ich möchte eine Einzellizenz (119€) erwerben.${RECHNUNGS_BLOCK}`,
    ),
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
    ctaText: 'Team-Lizenz anfragen',
    ctaLink: orderMail(
      'Bestellung Team-Lizenz Rho-Labs Kognitives Training',
      `Ich möchte eine Team-Lizenz (309€ für 3 Geräte) erwerben.${RECHNUNGS_BLOCK}`,
    ),
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
    { text: 'Für Windows 10 und 11, 64-Bit (x64)', highlight: true },
  ],
};

/**
 * Pflichtangabe unter jeder Preisangabe. Steht auf /kognitives-training und
 * auf /home — deshalb an einer Stelle, damit beide Seiten nicht
 * auseinanderlaufen.
 *
 * ── Warum die Gebietsgrenze hier nicht mehr steht ───────────────────────────
 * Bis zum 22.09.2026 endete dieser Satz mit „Derzeit ausschliesslich in
 * Deutschland erhaeltlich." Diese Aussage hatte nirgends einen Halt: Weder die
 * abgenommenen Allgemeinen Geschaeftsbedingungen noch die Lizenzbedingungen
 * noch die Bestaetigungsmail kennen eine Gebietsgrenze, und der
 * Auslieferungsdienst erhebt kein Land, prueft keines und liefert nach
 * gueltiger E-Mail, Namen und Zustimmung an jeden aus. Eine Beschraenkung, die
 * nur auf der Website steht und nirgends gilt, ist eine falsche
 * Pflichtangabe — und sie stand zudem UNTERHALB des Bestellknopfs, waehrend
 * § 312j Abs. 1 BGB Lieferbeschraenkungen „spaetestens bei Beginn des
 * Bestellvorgangs" verlangt.
 *
 * Gestrichen statt durchgesetzt, und zwar aus drei Gruenden: Der Vertrag, der
 * hier geschlossen wird, ist in den abgenommenen Texten ohne Gebietsgrenze
 * beschrieben — sie einzufuehren hiesse, drei dreifach geprueften Texte und den
 * Dienst wieder aufzumachen. Durchsetzen liesse sie sich nur ueber eine
 * zusaetzlich erhobene oder aus der IP-Adresse geschaetzte Landesangabe, also
 * ueber mehr personenbezogene Daten fuer eine Grenze, die niemand will. Und ein
 * Download ohne Versand hat keinen sachlichen Grund fuer eine Gebietsgrenze:
 * geliefert wird eine Datei und ein Schluessel per E-Mail.
 *
 * Die echten Beschraenkungen — Windows und PayPal — stehen weiterhin im
 * Bestellrahmen am Beginn des Bestellvorgangs auf /home.
 */
export const PREIS_HINWEIS =
  'Alle Preise sind Endpreise. Gemäß §19 UStG wird keine Umsatzsteuer berechnet.';

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
  /* ── Lizenzaktivierung ─────────────────────────────────────────────────────
     NACHTRAG 22.09.2026, drei Stellen in einem Abschnitt. Alle drei sind
     dasselbe Muster: Die Seite sagte etwas, das der Dienst nicht tut.

     a) „genau drei Angaben". Der Satz stimmte fuer das, was die ANWENDUNG in
        den Rumpf schreibt (main.js, `requestServerActivation`: key_id,
        hardware_fingerprint, app_version) — und erweckte damit den Eindruck,
        das sei die ganze Verarbeitung. Der Dienst nimmt bei JEDEM Aufruf
        zusaetzlich die IP-Adresse und haelt sie mit Zeitstempeln im
        Arbeitsspeicher (`routes.ts`, checkRateLimit/rateLimitMap, 552-590) —
        und zwar VOR der fachlichen Pruefung (`routes.ts:705-711` laeuft vor
        dem Auslesen des Rumpfes in 713). Zweck und Rechtsgrundlage dafuer
        (lit. f) fehlten ganz, obwohl „Kauf der Home-Version" und
        „Demo-Anfrage" genau diese Verarbeitung laengst benennen. Jetzt steht
        sie auch hier.

     b) Die Demo meldet sich wieder. Der Abschnitt beschrieb die Aktivierung
        als einmaligen Vorgang. Fuer die Demo stimmt das nicht: `main.js`
        ruft `enforce` im Sekundentakt (1417) und `refreshDemoClock` (361)
        fragt daraus hoechstens alle fuenf Minuten die Serverzeit ueber
        DENSELBEN Endpunkt ab. Ohne diesen Abgleich liesse sich die
        14-Tage-Frist durch Zurueckstellen der Uhr verlaengern. Die gekauften
        Ausfuehrungen tun das nicht (`refreshDemoClock` kehrt bei
        tierCode !== 'dm' sofort zurueck).

     c) Die Loeschzusage. Hier stand: „Aktivierungsdatensaetze bewahren wir
        fuer die Laufzeit der Lizenz auf und loeschen sie danach." Beide
        Haelften trugen nicht. Der einzige Loeschpfad im ganzen Dienst ist
        `deleteActivation` (database.ts:1449) am manuellen Geraete-Reset
        (routes.ts:393-400); einen Ablauf- oder Bereinigungslauf gibt es
        nicht — `DELETE FROM activations` kommt im Dienst genau einmal vor.
        Und „Ende der Laufzeit" gibt es fuer die gekauften Ausfuehrungen gar
        nicht: home/einzel/team/enterprise tragen kein `defaultValidDays`
        (`types.ts` TIER_CONFIG), der Server faellt auf 36500 Tage zurueck.
        Eine Frist zuzusagen, die es nicht gibt, fuer eine Loeschung, die
        nicht stattfindet — davon war nichts zu retten.

     Gestrichen statt durchgesetzt, und die Begruendung gehoert hierher, weil
     sie die Richtung fuer den Dienst vorgibt: Fuer eine unbefristete Lizenz
     ist der Datensatz so lange erforderlich, wie die Lizenz besteht — er IST
     die Einhaltung der Geraetezahl. Ein Bereinigungslauf waere dort nicht nur
     unnoetig, er naehme der Zusage „1 Geraet" ihre Grundlage. Ein echtes
     Ablaufdatum hat allein die Demo (14 Tage). Genau dort — und nur dort —
     ist ein Bereinigungslauf faellig; was er koennen muesste, steht im
     Bericht zu dieser Runde. Entsteht er, gehoert die Zusage fuer die Demo
     hierher zurueck; `scripts/befunde.test.mjs` (Test 12) haelt beides
     zusammen, wie Test 10 es fuer `widerrufe` tut.

     NACHTRAG 23.09.2026 — der zweite Loeschweg. Test 12 fiel, und zwar
     richtig: `DELETE FROM activations` steht im Dienst jetzt zweimal. Die
     zweite Stelle ist KEIN Bereinigungslauf, sondern eine Selbstbedienung
     (Befund Sol Runde 5, Client): `activationFreigeben` in `database.ts`,
     aufgerufen allein vom oeffentlichen Endpunkt `POST /api/public/deactivate`
     in `routes.ts`. Nachgelesen, was er tut:

       WER  — ausgeloest vom Knopf „Lizenz deaktivieren" im Client
              (`main.js`, IPC `license-deactivate`). Der Dienst gibt nur frei,
              wenn der VOLLE Lizenzschluessel (zeichengenau gegen die
              Bestellung) und der Fingerabdruck des Geraets vorliegen; eine
              gesperrte Aktivierung (`is_revoked = 1`) fasst er nicht an.
       WAS  — genau EINE Zeile: `WHERE key_id = ? AND hardware_fingerprint = ?
              AND is_revoked = 0`. Andere Geraete derselben Lizenz bleiben.
              Danach ein Vermerk `aktivierung_freigegeben` im `audit_log` der
              Bestellung — Key-ID und Quelle, kein Fingerabdruck, keine IP.
       WANN — sofort in der Anfrage; `deactivated: true` geht erst hinaus,
              nachdem die Zeile geloescht ist. Die IP wird wie bei
              `/activate` vorher nur fuer die Ratenbegrenzung im Speicher
              gehalten.

     Die Loeschzusage mit Frist kommt deshalb NICHT zurueck — einen Lauf, der
     nach einer Frist loescht, gibt es weiterhin nicht, und die Begruendung
     oben gilt unveraendert. Der Text nennt jetzt beide Wege und sagt beim
     zweiten nur, was der Dienst selbst durchsetzt. Ob der Knopf im Client
     heute tatsaechlich freigibt, sagt er bewusst NICHT: Stand 23.09.2026
     schickt der Client `key_id`, der Dienst verlangt `license_key` — die
     Freigabe scheitert also mit 400, und der Client meldet ehrlich „nicht
     bestaetigt". Der Satz hier bleibt in beiden Zustaenden wahr. Test 12
     haelt jede dieser Einzelheiten gegen den Dienst fest; aendert sich eine
     davon, faellt er.
     -------------------------------------------------------------------------- */
  {
    title: 'Lizenzaktivierung der Anwendung',
    paragraphs: [
      'Bei der Aktivierung sendet die Anwendung drei Angaben an unseren Aktivierungsdienst: die Kennung des Lizenzschlüssels, einen Prüfwert des Geräts und die Version der Anwendung.',
      'Der Prüfwert ist ein SHA-256-Hash aus Rechnername, Prozessormodell, Arbeitsspeichergröße, Betriebssystem, Benutzername und Prozessorarchitektur. Er ist für dasselbe Gerät immer derselbe, weil er das Gerät wiedererkennen und die vereinbarte Gerätezahl je Lizenz einhalten soll. Er ist damit pseudonym und nicht anonym — pseudonyme Daten bleiben personenbezogene Daten. Die Ausgangswerte selbst verlassen das Gerät nicht.',
      'Deine IP-Adresse: Jeder dieser Aufrufe — auch die Freigabe eines Geräteplatzes, siehe unten — erreicht uns über das Netz, und dabei erfährt unser Dienst deine IP-Adresse. Er hält sie zusammen mit den Zeitpunkten der Aufrufe im Arbeitsspeicher, um zu viele Anfragen von derselben Adresse abzuweisen — das geschieht, bevor er die Lizenz überhaupt prüft. Diese Einträge stehen nur im Arbeitsspeicher und gehen bei jedem Neustart des Dienstes verloren; in unsere Datenbank gelangen sie nicht, und zu einem Aktivierungsdatensatz wird deine IP-Adresse nicht gespeichert.',
      'Die Demo-Version meldet sich wieder: Solange sie läuft, fragt sie höchstens alle fünf Minuten über denselben Weg die Uhrzeit unseres Dienstes ab, mit denselben Angaben wie oben. Das ist nötig, weil die Testphase auf 14 Tage begrenzt ist und sich sonst durch Zurückstellen der Uhr des Geräts verlängern ließe. Die gekauften Ausführungen tun das nicht — sie melden sich nach der Aktivierung nicht von selbst wieder.',
      'Freigabe eines Geräteplatzes: Die Schaltfläche „Lizenz deaktivieren“ in der Anwendung bittet unseren Aktivierungsdienst, den Platz dieses Geräts freizugeben — etwa vor einem Wechsel auf einen neuen Rechner. Der Dienst gibt einen Platz nur frei, wenn ihm dafür der vollständige Lizenzschlüssel und der Prüfwert genau dieses Geräts vorliegen und die Lizenz nicht gesperrt ist. Dann löscht er den Aktivierungsdatensatz dieses einen Geräts; die Datensätze anderer Geräte derselben Lizenz bleiben unberührt. Meldet er die Freigabe als erfolgt, ist der Datensatz bereits gelöscht. Dass und wann ein Platz auf diesem Weg freigegeben wurde, vermerken wir bei der zugehörigen Bestellung — mit der Kennung des Lizenzschlüssels, ohne den Prüfwert des Geräts und ohne deine IP-Adresse.',
      'Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Erfüllung des Vertrages). Ohne Aktivierung kann die Lizenz nicht bereitgestellt und die Gerätezahl nicht eingehalten werden; die Bereitstellung dieser Angaben ist für die Nutzung erforderlich. Dasselbe gilt für die Freigabe eines Geräteplatzes. Für den Vermerk über eine Freigabe Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist, nachvollziehen zu können, wann ein Geräteplatz einer Lizenz frei wurde. Für die Verarbeitung der IP-Adresse zur Abwehr zu häufiger Anfragen zusätzlich Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der Schutz des Aktivierungsdienstes vor automatisierten Massenanfragen.',
      'Der Aktivierungsdienst wird bei der Hetzner Online GmbH, Industriestr. 25, 91710 Gunzenhausen, Deutschland, betrieben.',
      'Speicherdauer: Ein Aktivierungsdatensatz bleibt gespeichert, bis er auf einem von zwei Wegen gelöscht wird — er ist es, der die vereinbarte Gerätezahl einhält. Gelöscht wird er, wenn du den Platz des Geräts wie oben beschrieben selbst freigibst, oder wenn wir eine Lizenz auf ein anderes Gerät umbinden — diesen Geräte-Reset kannst du jederzeit unter kontakt.rholabs@gmail.com verlangen. Einen Lauf, der Aktivierungsdatensätze nach einer Frist von selbst löscht, gibt es nicht: Die gekauften Ausführungen sind zeitlich nicht begrenzt, und auch den Datensatz einer abgelaufenen Demo löschen wir nicht von selbst. Du kannst seine Löschung jederzeit verlangen (Art. 17 DSGVO). Der Vermerk über eine Freigabe bleibt bei der Bestellung gespeichert; auch ihn löschen wir nicht von selbst.',
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
      'Abruf beim Auslieferungsdienst: Das Kaufformular sendet unmittelbar an unseren eigenen Auslieferungsdienst unter fulfillment.rholabs.de. Dabei erfährt dieser Dienst deine IP-Adresse und die üblichen Verbindungsdaten. Er läuft auf unserem Server in Deutschland; ein Dritter ist daran nicht beteiligt.',
      'Preisabfrage über einen Vorteilslink: Rufst du /home über den Vorteilslink einer Einrichtung auf — erkennbar an einem Anhängsel „?ref=…“ in der Adresszeile —, fragt dein Browser schon beim Öffnen der Seite bei demselben Auslieferungsdienst nach, ob dieser Code gilt und welcher Preis dann gilt. Übertragen werden dabei nur der Code aus der Adresszeile, deine IP-Adresse und die üblichen Verbindungsdaten; dein Name und deine E-Mail-Adresse sind zu diesem Zeitpunkt noch nicht dabei, und es wird nichts bestellt. Zweck ist, dir den Preis anzuzeigen, den du tatsächlich zahlst, bevor du bestellst. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vorvertragliche Maßnahme auf deine Anfrage). Steht kein solches Anhängsel in der Adresszeile, unterbleibt diese Abfrage; ohne JavaScript unterbleibt sie ebenfalls.',
      'Speicherdauer: Bestellung, Rechnung und Einwilligungsprotokoll bewahren wir für die Dauer der gesetzlichen Aufbewahrungsfristen auf (§ 147 AO, § 257 HGB).',
      'Empfänger: PayPal für die Zahlung (siehe Zahlungsabwicklung) und unser E-Mail-Anbieter für den Versand von Lizenzschlüssel und Rechnung. Eine darüber hinausgehende Weitergabe findet nicht statt.',
    ],
  },
  /* ── Widerruf über die Widerrufsfunktion ───────────────────────────────────
     Nachgetragen am 22.09.2026. Die Funktion nach § 356a BGB stand auf der
     Seite, in dieser Erklaerung aber kam sie nicht vor — obwohl das Formular
     fuer Einzelheiten ausdruecklich hierher verweist und dabei Name, bis zu
     2.000 Zeichen Freitext und eine Kontaktadresse erhoben werden. Die
     Angaben unten sind am Dienst nachgeprueft (`widerruf.ts`, Tabelle
     `widerrufe` in `database.ts`): gespeichert werden Name, Vertragsangaben,
     Adresse fuer die Eingangsbestaetigung, IP, die Zeitpunkte und ein
     Pruefwert des Bestaetigungslinks — der Link selbst nicht im Klartext.

     NACHTRAG 22.09.2026, Speicherdauer. Hier stand: „Eine begonnene, aber nicht
     bestaetigte Eingabe verfaellt nach kurzer Zeit." Das war falsch. Am Dienst
     nachgesehen: `widerrufAnlegen` (database.ts) legt schon im ERSTEN Schritt
     eine Zeile mit Name, Freitext, Adresse und IP an; nach `TOKEN_GUELTIG_MS`
     (30 Minuten, widerruf.ts) wird lediglich der zweite Schritt abgelehnt. Ein
     `DELETE` auf `widerrufe` gibt es im gesamten Dienst nicht — der Entwurf
     bleibt also stehen. Der Satz sagt jetzt genau das und nennt den Weg zur
     Loeschung. Legt der Dienst spaeter einen Loeschlauf an, gehoert die Zusage
     hierher zurueck; `scripts/befunde.test.mjs` (Test 10) haelt beides
     zusammen.
     -------------------------------------------------------------------------- */
  {
    title: 'Widerruf über die Widerrufsfunktion',
    paragraphs: [
      'Wenn du deinen Vertrag über die Funktion „Vertrag widerrufen“ auf /vertrag-widerrufen erklärst, verarbeiten wir die drei Angaben, die § 356a Absatz 2 BGB dafür vorsieht: deinen Namen, deine Angaben zur Identifizierung des Vertrages (ein Freitext von bis zu 2.000 Zeichen — was du hineinschreibst, entscheidest du) und die E-Mail-Adresse, an die die Eingangsbestätigung gehen soll. Hinzu kommen deine IP-Adresse, der Zeitpunkt des Eingangs, der Zeitpunkt des Versands der Eingangsbestätigung und ein Prüfwert des Bestätigungslinks; der Link selbst wird nicht im Klartext gespeichert.',
      'Zwei Schritte, beide bei uns: Das Formular sendet unmittelbar an unseren eigenen Auslieferungsdienst unter fulfillment.rholabs.de. Dieser zeigt dir deine Angaben noch einmal an und nimmt dort auch den zweiten Knopf entgegen, mit dem der Widerruf erklärt ist. Der Dienst läuft auf unserem Server in Deutschland; ein Dritter ist daran nicht beteiligt. Deine Angaben stehen dabei nie in einer Adresszeile — beide Schritte sind Formularsendungen.',
      'Zweck: die Entgegennahme deiner Widerrufserklärung, die unverzügliche Eingangsbestätigung mit Datum und Uhrzeit auf einem dauerhaften Datenträger, der Nachweis dieses Eingangs und die anschließende Rückabwicklung des Vertrages. Zu diesem Zweck versuchen wir außerdem, deine Erklärung deiner Bestellung zuzuordnen; dafür gleichen wir die genannte Adresse und Adressen aus deinem Freitext mit unseren Bestellungen ab. Passt mehr als eine Bestellung, ordnen wir nichts zu.',
      'Rechtsgrundlage: Art. 6 Absatz 1 lit. c DSGVO in Verbindung mit § 356a BGB — die Funktion, die Eingangsbestätigung und deren Nachweis sind uns gesetzlich vorgeschrieben. Für die Rückabwicklung des Vertrages zusätzlich Art. 6 Absatz 1 lit. b DSGVO. Für die Speicherung der IP-Adresse zusätzlich Art. 6 Absatz 1 lit. f DSGVO; unser berechtigtes Interesse ist der Schutz der Funktion vor automatisierten Massenanfragen. Ohne diese Angaben können wir eine Widerrufserklärung nicht entgegennehmen und ihren Eingang nicht bestätigen.',
      'Anschließende E-Mail-Kommunikation: Die Eingangsbestätigung und alles, was wir zur Rückabwicklung mit dir besprechen, läuft über E-Mail. Dafür gilt der Abschnitt „E-Mail-Kommunikation“ weiter unten.',
      'Speicherdauer: Deine Erklärung und den Nachweis ihres Eingangs bewahren wir auf, solange die Rückabwicklung läuft und solange wir belegen können müssen, dass und wann dein Widerruf eingegangen ist; darüber hinaus für die Dauer der gesetzlichen Aufbewahrungsfristen (§ 147 AO, § 257 HGB), soweit die Erklärung zu einem abgerechneten Vorgang gehört. Brichst du nach dem ersten Schritt ab, bleiben die dort gemachten Angaben gespeichert: Der Bestätigungslink gilt nur 30 Minuten — danach lässt sich der zweite Schritt nicht mehr abschließen, und eine Erklärung ist dann nicht abgegeben —, die Eingabe selbst löschen wir jedoch nicht von selbst. Du kannst ihre Löschung jederzeit unter kontakt.rholabs@gmail.com verlangen (Art. 17 DSGVO).',
      'Empfänger: unser E-Mail-Anbieter für den Versand der Eingangsbestätigung. Eine darüber hinausgehende Weitergabe findet nicht statt.',
      'Der Weg über die Funktion ist ein Angebot, keine Bedingung: Du kannst deinen Widerruf ebenso formlos per E-Mail oder Brief erklären. Dann verarbeiten wir nur, was du uns dabei mitteilst.',
    ],
  },
  /* ── Demo-Anfrage ─────────────────────────────────────────────────────────
     NACHTRAG 22.09.2026. Nicht gemeldet, beim vollstaendigen Durchgang dieser
     Erklaerung gegen den Dienst gefunden — zweimal dasselbe Muster wie oben.

     a) Der NAME fehlte in der Aufzaehlung. Das Formular auf /kontakt erhebt
        ihn („freiwillig, fuer die Anrede", ContactPage.tsx), und der Dienst
        schreibt ihn bei JEDER Anfrage mit, unabhaengig vom Newsletter-Haekchen
        (`demo.ts:235-237`, Spalte `name` in `demo_requests`). Genannt war er
        nur im Newsletter-Abschnitt — also genau dort, wo er NICHT allein
        herkommt.

     b) Die Loeschzusagen. Hier stand: „Bestaetigte Anfragen bewahren wir ein
        Jahr auf" und „Unbestaetigte Anfragen werden nach 24 Stunden
        gegenstandslos und geloescht." Beides stimmt nicht. `DELETE FROM
        demo_requests` gibt es im gesamten Dienst nicht — der einzige DELETE
        ueberhaupt steht auf `activations`. Nach `TOKEN_GUELTIG_MS` (24
        Stunden, demo.ts:59) wird lediglich die Einloesung abgelehnt
        (demo.ts:281); die Zeile mit Adresse, Name und IP bleibt stehen. Und
        die bestaetigten Zeilen bleiben laenger als ein Jahr, denn geloescht
        wird nie — das Jahr ist die Grenze der Wiederholungspruefung
        (`WIEDERHOLUNG_MS`, demo.ts:61), keine Speicherdauer.

     Die Zusagen sind gestrichen; der Text sagt jetzt, was wirklich geschieht,
     und nennt den Weg zur Loeschung. Legt der Dienst einen Bereinigungslauf
     an, gehoeren sie hierher zurueck; `scripts/befunde.test.mjs` (Test 13)
     haelt beides zusammen.

     NACHGETRAGEN 22.09.2026, weil die Entscheidung sonst beim naechsten Mal
     neu getroffen wird — und anders ausfallen koennte als oben bei der
     Aktivierung. Die beiden Faelle sehen gleich aus, sind es aber nicht:

       Der Aktivierungsdatensatz TRAEGT bei einer unbefristeten Lizenz die
       Zusage „1 Geraet". Ihn nach einer Frist zu loeschen naehme ihr die
       Grundlage; ein Bereinigungslauf waere dort ein Schaden. Deshalb steht
       oben die Speicherdauer ohne Frist — und zwar auf Dauer, nicht
       vorlaeufig.

       Eine Zeile in `demo_requests` traegt nach ihrer Frist nichts mehr. Die
       bestaetigte haelt die Grenze „eine Demo je Adresse und Jahr"
       (`WIEDERHOLUNG_MS`, demo.ts:61); fuer die Abfrage in demo.ts:208-216
       ist sie nach diesem Jahr unsichtbar. Die unbestaetigte haelt 24 Stunden
       lang den Pruefwert des Links und die Sperre gegen eine zweite
       Bestaetigungsmail (`TOKEN_GUELTIG_MS`, demo.ts:59, Abfrage 219-227);
       danach ist sie fuer beides tot. Ein Loeschlauf genau zu den zugesagten
       Fristen waere hier also VERLUSTFREI — keine Funktion haengt daran.

     Hier ist der Bereinigungslauf somit nicht nur moeglich, sondern die
     richtige Loesung, und die gestrichene Zusage war die richtige ZUSAGE.
     Gestrichen ist sie trotzdem, denn dieser Text muss sagen, was der Dienst
     HEUTE tut, und der Dienst wurde in dieser Runde nicht angefasst. Was er
     dafuer braeuchte, steht im Bericht zu dieser Runde; Test 13 holt die
     Zusage zurueck, sobald es so weit ist.
     -------------------------------------------------------------------------- */
  {
    title: 'Demo-Anfrage',
    paragraphs: [
      'Wenn du über das Formular auf unserer Website eine kostenlose Demo anforderst, verarbeiten wir deine E-Mail-Adresse, deinen Namen, falls du ihn angibst, deine IP-Adresse zum Zeitpunkt der Anfrage und den Zeitpunkt der Anfrage und der Bestätigung. Der Name ist freiwillig; er dient allein der Anrede in unseren Nachrichten.',
      'Zweck: Zusendung des Demo-Schlüssels und Schutz vor missbräuchlicher Nutzung des Formulars (Versandmissbrauch, automatisierte Massenanfragen).',
      'Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Durchführung vorvertraglicher Maßnahmen auf deine Anfrage). Für die Speicherung der IP-Adresse zusätzlich Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der Schutz unseres Systems und unseres E-Mail-Versands vor Missbrauch.',
      // „Ohne Bestätigung geschieht nichts weiter" stand hier bis zum
      // 22.09.2026 ohne Zusatz. Der Satz war im Zusammenhang richtig — ohne
      // Klick kein Schlüssel —, aber es ist derselbe Satz, mit dem die
      // Bestätigungsmail des Dienstes zu viel versprach („und wir speichern
      // die Anfrage nicht dauerhaft", mailer.ts). Ein Text, der einen Satz
      // benutzt, den eine unserer Mails falsch weiterdreht, sagt jetzt in
      // derselben Zeile, was er NICHT heißt.
      // Stand 23.09.2026: Die Mail ist nachgezogen (`sendDemoConfirmationEmail`
      // sagt jetzt, dass die Anfrage gespeichert bleibt, bis ihre Löschung
      // verlangt wird). Test 19 hält sie dort.
      'Doppelte Bestätigung: Nach dem Absenden erhältst du zunächst nur eine E-Mail mit einem Bestätigungslink. Erst wenn du diesen Link anklickst, erzeugen wir den Demo-Schlüssel und senden ihn zu. Ohne Bestätigung erzeugen und versenden wir keinen Schlüssel; gespeichert ist deine Anfrage in diesem Augenblick aber schon — siehe Speicherdauer. Dieses Verfahren stellt sicher, dass niemand fremde Adressen bei uns einträgt.',
      'Speicherdauer: Je Adresse ist eine Demo pro Jahr vorgesehen; dafür müssen wir mindestens ein Jahr lang wissen, wann die letzte Demo ausgegeben wurde. Danach löschen wir den Eintrag nicht von selbst — er bleibt gespeichert, bis du seine Löschung verlangst (Art. 17 DSGVO, kontakt.rholabs@gmail.com). Dasselbe gilt für eine Anfrage, die du nie bestätigt hast: Der Bestätigungslink gilt nur 24 Stunden, danach lässt sich damit keine Demo mehr abrufen — die Zeile mit deiner Adresse und deiner IP-Adresse bleibt jedoch stehen. Der Bestätigungslink selbst wird nicht im Klartext gespeichert, sondern nur als Prüfwert.',
      'Empfänger: Der Versand erfolgt über unseren E-Mail-Anbieter. Eine darüber hinausgehende Weitergabe findet nicht statt. Die Daten liegen auf unserem Server in Deutschland.',
      'Getrennt vom Newsletter: Die Demo-Anfrage allein ist keine Anmeldung zu Werbung. Ohne das zusätzliche, freiwillige Häkchen verwenden wir deine Adresse ausschließlich für die Demo und die damit zusammenhängenden Nachrichten.',
    ],
  },
  /* ── Neuigkeiten per E-Mail ───────────────────────────────────────────────
     NACHTRAG 22.09.2026 (Sol Runde 5, mittel). Hier stand: „Empfänger: keine."

     Gemeint war: kein Newsletter-Versanddienstleister, keine Mailchimps
     dieser Welt. Das stimmt auch — `newsletter.ts` kennt keine Versandfunktion,
     der Verteiler wird als Liste ausgegeben und von Hand angeschrieben.

     Nur ist „von Hand" kein Weg am E-Mail-Anbieter vorbei. Geschrieben wird
     aus `kontakt.rholabs@gmail.com` (so sagt es `newsletter.ts` selbst), und
     der Dienst versendet über `smtp.gmail.com` (`mailer.ts`, getTransporter).
     Empfängeradresse und Nachrichteninhalt gehen dabei durch die Systeme des
     Anbieters — das ist genau das, was Art. 13 Abs. 1 lit. e DSGVO mit
     „Empfänger oder Kategorien von Empfängern" meint. „Keine" war damit die
     einzige Stelle dieser Erklärung, die einen Empfänger verneinte, den jeder
     andere Abschnitt richtig nennt („unser E-Mail-Anbieter", zweimal oben).

     Der Satz sagt jetzt beides: welche Kategorie es gibt, und was es weiterhin
     NICHT gibt. Die Verneinung war ja nicht erfunden, sie war nur zu weit.
     -------------------------------------------------------------------------- */
  {
    title: 'Neuigkeiten per E-Mail',
    paragraphs: [
      'Im Demo-Formular kannst du zusätzlich ankreuzen, dass du gelegentlich Neuigkeiten zu neuen Produkten und Versionen erhalten möchtest. Das Häkchen ist freiwillig und nicht vorausgewählt; die Demo bekommst du auch ohne.',
      'Verarbeitet werden dafür deine E-Mail-Adresse, dein Name, falls du ihn angegeben hast, der Zeitpunkt der Einwilligung, deine IP-Adresse zu diesem Zeitpunkt und der Wortlaut, dem du zugestimmt hast. Den Wortlaut speichern wir, damit auch nach einer späteren Textänderung nachvollziehbar bleibt, wozu du ja gesagt hast.',
      'Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung), für den Versand zusätzlich § 7 Abs. 2 Nr. 2 UWG. Die Einwilligung wird erst mit dem Klick auf den Bestätigungslink wirksam — bis dahin stehst du nicht im Verteiler.',
      'Empfänger: unser E-Mail-Anbieter. Die Nachrichten schreiben wir von Hand aus unserem eigenen Postfach, und sie laufen dabei über dessen Server — dabei verarbeitet er deine Adresse und den Inhalt der Nachricht. Ein Newsletter-Versanddienstleister ist nicht eingeschaltet, und über den Versand hinaus geben wir deine Daten nicht weiter. Es findet keine Öffnungs- oder Klickmessung statt, und wir bilden keine Profile.',
      'Speicherdauer: bis zum Widerruf. Danach bewahren wir den Eintrag mit dem Vermerk des Widerrufs auf, solange wir nachweisen können müssen, dass und wann du widersprochen hast.',
      'Widerruf: jederzeit und formlos — eine Antwort auf eine unserer Nachrichten genügt, ebenso eine kurze Mail an kontakt.rholabs@gmail.com. Die Rechtmäßigkeit der Verarbeitung bis zum Widerruf bleibt davon unberührt (Art. 7 Abs. 3 DSGVO).',
    ],
  },
  {
    title: 'Auslieferung dieser Website',
    paragraphs: [
      'Die Website wird als vorgerenderte, statische Seite über GitHub Pages (GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA) ausgeliefert. Beim Abruf verarbeitet GitHub technisch notwendige Verbindungsdaten wie IP-Adresse, Zeitpunkt und angeforderte Datei in Server-Protokollen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist der sichere und zuverlässige Betrieb der Website. Grundlage der Übermittlung in die USA sind die Standardvertragsklauseln der EU-Kommission. Einzelheiten: https://docs.github.com/site-policy/privacy-policies/github-privacy-statement',
      'Schriften, Bilder und der Trailer werden von unserer eigenen Domain geladen. Es werden keine Schriften, Skripte oder Bibliotheken von Dritten nachgeladen. Wir setzen keine Cookies, betreiben keine Analyse und binden kein Tracking ein.',
      'Das gilt auch für die Seite der Home-Version: Sie lädt nichts von PayPal und nichts von Dritten nach. Mit unserem eigenen Auslieferungsdienst verbindet sich dein Browser, sobald du das Kaufformular absendest — und außerdem schon beim Öffnen der Seite, wenn du sie über einen Vorteilslink mit „?ref=…“ aufrufst; Näheres dazu im Abschnitt „Kauf der Home-Version“. Erst nach dem Absenden der Bestellung leitet der Dienst dich zu PayPal weiter.',
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
