import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarCheck, Check, MessagesSquare, Puzzle, X } from 'lucide-react';
import Seo from '../components/Seo';
import {
  CATEGORIES,
  CATEGORY_ORDER,
  CONTACT_EMAIL,
  DEMONSTRATIONS,
  GAME_COUNT,
  GAMES,
  PILOT_BEWERBUNG_ACTION,
  SHOT_KATALOG,
  SHOT_RADAR,
  SHOT_VERLAUF,
  SHOT_VORFUEHRUNG,
  ZWECKBESTIMMUNG,
} from '../constants';
import { rueckwegKasten, rueckwegSkript, vorabSchichtAusblenden } from '../rueckwege';

/* ── Rückweg-Kennung des Auslieferungsdienstes ─────────────────────────────
   Scheitert die Bewerbung, leitet der Dienst auf
   `/pilotpartner?fehler=<kennung>#bewerbung` zurück. Die Kennungen sind fest:

     eingabe   — ein Pflichtfeld fehlt oder ist zu lang
     zu_viele  — Ratengrenze, später erneut
     intern    — Fehler im Dienst

   Alles andere wird ignoriert; der Wert aus der Adresszeile gelangt nie in die
   Seite, nur in einen Vergleich (wie bei `HomePage` und `WiderrufErklaeren`).

   Gelesen wird zweimal, nach dem Muster aus `src/rueckwege.ts`: vorgerendert
   und verborgen im HTML, sichtbar gemacht von einem synchronen Skript hinter
   dem Formular — und danach von React, das die Vorab-Schicht ausblendet und die
   Anzeige selbst führt. Für Leser ganz ohne JavaScript gibt es einen
   `<noscript>`-Hinweis. Die Texte sind die aus T1 Abschnitt 3.
   -------------------------------------------------------------------------- */
type Formfehler = 'eingabe' | 'zu_viele' | 'intern';

export const FORMFEHLER_TEXT: Record<Formfehler, string> = {
  eingabe: 'Bitte prüfen Sie Ihre Angaben — ein Pflichtfeld fehlt oder ist zu lang.',
  zu_viele: 'Zu viele Anfragen. Bitte versuchen Sie es in einer Stunde erneut.',
  intern:
    'Das hat leider nicht geklappt. Bitte versuchen Sie es später erneut oder schreiben Sie an kontakt.rholabs@gmail.com.',
};

function formfehlerLesen(wert: string | null): Formfehler | null {
  if (wert === 'eingabe' || wert === 'zu_viele' || wert === 'intern') return wert;
  return null;
}

const FORMFEHLER_KENNUNGEN = Object.keys(FORMFEHLER_TEXT).filter(
  (kennung) => formfehlerLesen(kennung) !== null,
);

const RUECKWEG_HTML = FORMFEHLER_KENNUNGEN.map((kennung) =>
  rueckwegKasten(kennung, FORMFEHLER_TEXT[kennung as Formfehler]),
).join('');

const RUECKWEG_SKRIPT = rueckwegSkript([{ parameter: 'fehler', werte: FORMFEHLER_KENNUNGEN }]);

/**
 * Die Auswahl „Art der Einrichtung“. Die Werte (`wert`) sind die des Dienstes
 * (`PILOT_ARTEN` in `pilot.ts`); die Beschriftungen sind die aus T1. Eine
 * neutrale, organisatorische Liste — kein Berufsbild, das einen
 * therapeutischen Zweck nahelegt (R1, Revision v2).
 */
export const PILOT_ARTEN = [
  { wert: 'praxis', label: 'Praxis oder Beratungsstelle' },
  { wert: 'einrichtung', label: 'Stationäre oder ambulante Einrichtung' },
  { wert: 'senioren', label: 'Seniorenarbeit' },
  { wert: 'pflege', label: 'Pflege oder Betreuung' },
  { wert: 'bildung', label: 'Bildung, Verein oder Freizeit' },
  { wert: 'sonstige', label: 'Sonstige' },
] as const;

/** Die häufigen Fragen — Antworten wörtlich aus T1 Abschnitt 3. */
const FAQ: { frage: string; antwort: string }[] = [
  {
    frage: 'Was kostet die Teilnahme?',
    antwort:
      'Nichts. Der Pilot endet nach sechs Wochen automatisch und geht nicht in einen kostenpflichtigen Vertrag über.',
  },
  {
    frage: 'Was passiert nach den sechs Wochen?',
    antwort:
      'Training ist dann nur mit einer regulären Lizenz möglich. Ihre Profile, Ergebnisse und Trainingsabläufe bleiben erhalten; Sie können sie weiterhin ansehen, exportieren und löschen. Mit einer regulären Lizenz arbeiten Sie nahtlos weiter.',
  },
  {
    frage: 'Müssen wir jede Woche mitmachen?',
    antwort: 'Nein. Der wöchentliche Austausch ist ein Angebot.',
  },
  {
    frage: 'Welche Daten sieht Rho-Labs?',
    antwort:
      'Ihre Bewerbungsangaben, die Kontaktdaten Ihrer Ansprechperson und die Lizenz- und technischen Aktivierungsdaten, die bei Aktivierung und Lizenzprüfung übertragen werden. Profile und Trainingsergebnisse bleiben auf Ihren Geräten; in der Einführung arbeiten wir mit fiktiven Beispieldaten.',
  },
  {
    frage: 'Ist die Software ein Medizinprodukt?',
    antwort: ZWECKBESTIMMUNG,
  },
  {
    frage: 'Wie wählen Sie aus?',
    antwort:
      'Wir achten auf unterschiedliche organisatorische Einsatzformen und auf die technische Passung. Ein therapeutischer oder diagnostischer Zweck ist kein Auswahlkriterium. Wir melden uns in jedem Fall.',
  },
  {
    frage: 'Werden wir als Referenz genannt?',
    antwort:
      'Nur, wenn Sie das nach dem Pilot ausdrücklich möchten. Das ist freiwillig und keine Bedingung für die Teilnahme.',
  },
];

/** Was gemeinsam herausgefunden werden soll — T1, Abschnitt 3 (die Punkte der Aufzählung). */
const HERAUSFINDEN: string[] = [
  'Welche Übungen im Alltag tatsächlich eingesetzt werden',
  'wo Schwierigkeitsgrade oder Bedienung nicht passen',
  'was im Arbeitsalltag fehlt',
  'welche Zusammenstellungen sich bei Vorbereitung und Bedienung gut verwenden lassen',
  'welche Darstellungen von Übungswerten und welche Exportformate für die Organisation fehlen',
  'was die Bedienung für unterschiedliche Nutzergruppen leichter macht',
];

const VORAUSSETZUNGEN: string[] = [
  'Windows 10 oder 11 (64 Bit) mit laufenden Sicherheitsupdates',
  'Internetverbindung zur Aktivierung und spätestens alle sieben Tage zur Lizenzprüfung',
  'eine feste Ansprechperson',
  'Interesse an kurzem, freiwilligem Feedback',
];

/**
 * Die Pilotseite: Pilotpartner gesucht (T1 Abschnitt 3).
 *
 * Alle Texte stehen dort und werden hier wörtlich übernommen. Die Seite
 * beschreibt Bedienung, Organisation und Praxistauglichkeit — keine Wirkung,
 * keine Krankheitsbilder, keine Zielgruppe mit gesundheitlichem Bezug
 * (R1 Abschnitt 1.4). Wer hier etwas ergänzt, prüft es dagegen.
 *
 * Das Formular ist ein echtes HTML-Formular und funktioniert ohne JavaScript:
 * POST, `application/x-www-form-urlencoded`, an den Auslieferungsdienst, der mit
 * 303 zurückleitet. Spam-Schutz wie bei den anderen Formularen: Lockfeld
 * `webseite` und die Ratenbegrenzung des Dienstes. Felder, Pflicht und Längen
 * entsprechen dem Dienst; `scripts/pilot.test.mjs` hält das fest.
 */
export default function PilotPartner() {
  const [suchParameter] = useSearchParams();
  const [formfehler, setFormfehler] = useState<Formfehler | null>(null);
  const fehlerRef = useRef<HTMLDivElement>(null);

  /* Auswertung erst nach dem Einhängen — sonst unterschiede sich die erste
     Darstellung im Browser von der vorgerenderten (Hydrations-Differenz). Bis
     dahin trägt die Vorab-Schicht. */
  useEffect(() => {
    vorabSchichtAusblenden();
    setFormfehler(formfehlerLesen(suchParameter.get('fehler')));
  }, [suchParameter]);

  /* Nach dem Rückweg gehört der Fokus auf die Meldung: Tastatur- und
     Screenreader-Nutzer landen sonst am Seitenanfang oder im leeren Formular. */
  useEffect(() => {
    if (formfehler) fehlerRef.current?.focus();
  }, [formfehler]);

  const uebungenJeBereich = CATEGORY_ORDER.map((key) => ({
    key,
    info: CATEGORIES[key],
    uebungen: GAMES.filter((g) => g.cat === key),
  }));

  return (
    <>
      <Seo
        path="/pilotpartner"
        title="Pilotpartner gesucht — Rho-Labs Kognitives Training"
        description="Rho-Labs sucht drei bis fünf Praxen und Einrichtungen, die die Trainingssoftware sechs Wochen kostenlos im Arbeitsalltag erproben und mitgestalten. Unverbindlich bewerben."
      />

      {/* ── Held ─────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <div className="mesh" />
          <div className="hero__glow" style={{ width: 1000, height: 560, top: -300 }} />
        </div>
        <div className="hero__inner hero__inner--slim">
          <span className="pill" style={{ marginBottom: 28 }}>
            Pilotprogramm
          </span>
          <h1 className="hero__title hero__title--product">
            Pilotpartner für <span className="grad grad--duo">kognitives Training</span> gesucht
          </h1>
          <p className="hero__lede" style={{ marginBottom: 32 }}>
            Wir suchen ausgewählte Praxen und Einrichtungen, die Rho-Labs Kognitives Training
            sechs Wochen im realen Arbeitsalltag erproben und gemeinsam mit uns
            weiterentwickeln möchten.
          </p>
          <div className="btn-row btn-row--center">
            <a href="#bewerbung" className="btn btn--primary">
              Als Pilotpartner bewerben
            </a>
            <Link to="/pilotbedingungen" className="btn btn--ghost">
              Pilotbedingungen lesen
            </Link>
          </div>
          <p className="hero__meta">Drei bis fünf Plätze · kostenlos · keine Kaufverpflichtung</p>
        </div>
      </section>

      {/* ── Drei Karten ──────────────────────────────────────────────── */}
      <section className="wrap section">
        <div className="grid grid--auto-290">
          <div className="card card--edge card--hover-purple card--flow" data-edge="1">
            <span className="icon-box" style={{ marginBottom: 18 }} aria-hidden="true">
              <CalendarCheck size={19} />
            </span>
            <h2 className="card__title">6 Wochen kostenlos</h2>
            <p className="card__text">
              Voller Zugang zur Version für Praxen und Einrichtungen. Der Pilot endet automatisch;
              es gibt keine Kaufverpflichtung.
            </p>
          </div>

          <div className="card card--edge card--hover-purple card--flow" data-edge="1">
            <span className="icon-box icon-box--purple" style={{ marginBottom: 18 }} aria-hidden="true">
              <MessagesSquare size={19} />
            </span>
            <h2 className="card__title">Direkter Austausch</h2>
            <p className="card__text">
              Persönliches Onboarding und direkter Kontakt zum Entwickler. Etwa einmal pro Woche
              ein kurzer Austausch — freiwillig, per E-Mail, Telefon oder Videokonferenz.
            </p>
          </div>

          <div className="card card--edge card--hover-purple card--flow" data-edge="1">
            <span className="icon-box" style={{ marginBottom: 18 }} aria-hidden="true">
              <Puzzle size={19} />
            </span>
            <h2 className="card__title">Software mitgestalten</h2>
            <p className="card__text">
              Ihre Rückmeldungen lesen wir selbst und prüfen sie vorrangig für die
              Weiterentwicklung. Im vereinbarten Rahmen kann nach dem Pilot zusätzlich eine
              kleinere, praxisbezogene Anpassung umgesetzt werden.<span aria-hidden="true">*</span>
            </p>
          </div>
        </div>
        <p className="card__footnote card__footnote--frei">
          <span aria-hidden="true">* </span>
          Für die vereinbarte kleinere Anpassung berechnen wir keine zusätzlichen
          Entwicklungskosten. Wir legen sie binnen acht Wochen nach dem Pilot gemeinsam fest
          (Aufwand bis zu zwei Personentage). Sie wird Teil der regulären Software; ihre
          Nutzung nach dem Pilot setzt eine reguläre, kostenpflichtige Lizenz voraus — eine
          Kaufverpflichtung besteht nicht. Größere Entwicklungen, Schnittstellen oder
          Unternehmensfunktionen sind nicht Teil des Pilotprogramms. Einen Anspruch auf
          Umsetzung von Rückmeldungen gibt es nicht; Einzelheiten in den{' '}
          <Link to="/pilotbedingungen">Pilotbedingungen</Link>.
        </p>
      </section>

      {/* ── Was Sie erproben ─────────────────────────────────────────── */}
      <section className="band band--closed" id="erproben">
        <div className="wrap wrap--narrow section">
          <div className="intro" style={{ marginBottom: 32 }}>
            <p className="eyebrow">Funktionsumfang</p>
            <h2 className="h-section" style={{ marginBottom: 14 }}>
              Was Sie erproben
            </h2>
            <p className="lede">
              Rho-Labs Kognitives Training ist eine Software für kognitives Training unter
              Windows. Sie ist für Menschen unterschiedlichen Alters und unterschiedlicher
              Leistungsniveaus gestaltet: einstellbare Schwierigkeit, ruhige Darstellung, große
              Bedienelemente.
            </p>
          </div>

          <ul className="checklist" style={{ marginBottom: 20 }}>
            <li>
              <Check size={17} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
              <span>
                <strong style={{ color: '#f1f5f9' }}>{GAME_COUNT} Übungen in vier Bereichen</strong>{' '}
                — Merken &amp; Lernen, Raum &amp; Formen, Denken &amp; Steuern, Tempo &amp;
                Aufmerksamkeit.
              </span>
            </li>
          </ul>

          <div className="faq" style={{ marginBottom: 28 }}>
            <details>
              <summary>Alle {GAME_COUNT} Übungen ansehen</summary>
              <div className="uebungen">
                {uebungenJeBereich.map(({ key, info, uebungen }) => (
                  <div key={key}>
                    <h3 style={{ color: info.color }}>{info.name}</h3>
                    <ul>
                      {uebungen.map((u) => (
                        <li key={u.label}>{u.label}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          </div>

          <ul className="checklist" style={{ marginBottom: 44 }}>
            <li>
              <Check size={17} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
              <span>
                <strong style={{ color: '#f1f5f9' }}>Profile für mehrere Personen</strong> — jede
                Person trainiert unter einem eigenen Kürzel.
              </span>
            </li>
            <li>
              <Check size={17} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
              <span>
                <strong style={{ color: '#f1f5f9' }}>Trainingsabläufe</strong> — Übungen in fester
                Reihenfolge zusammenstellen und wiederverwenden.
              </span>
            </li>
            <li>
              <Check size={17} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
              <span>
                <strong style={{ color: '#f1f5f9' }}>Trainingsverlauf und Statistik</strong> — die
                Werte aus den ausgeführten Übungen im Zeitverlauf; keine normierte oder
                diagnostische Bewertung.
              </span>
            </li>
            <li>
              <Check size={17} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
              <span>
                <strong style={{ color: '#f1f5f9' }}>Export</strong> — Verlauf als PDF oder CSV.
              </span>
            </li>
            <li>
              <Check size={17} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
              <span>
                <strong style={{ color: '#f1f5f9' }}>Trainingsdaten bleiben bei Ihnen</strong> —
                Profile und Ergebnisse werden nur auf Ihren Geräten gespeichert und nicht an uns
                übertragen. Bei der Aktivierung und der regelmäßigen Lizenzprüfung erhält unser
                Lizenzdienst nur Lizenz- und technische Aktivierungsdaten.
              </span>
            </li>
          </ul>

          {/* Screenshots: ein Beispielprofil mit Kürzel, keine Klarnamen. Die
              Alt-Texte beschreiben, was zu sehen ist — keine Wirkaussage. */}
          <div className="pilot-shots">
            <figure className="shotfig">
              <div className="shot">
                <img
                  src="/bilder/app-katalog.webp"
                  alt={`Übungskatalog der Anwendung: die ${GAME_COUNT} Übungen als Karten, geordnet nach den vier Aufgabenbereichen, mit einstellbarer Schwierigkeitsstufe`}
                  width={SHOT_KATALOG.width}
                  height={SHOT_KATALOG.height}
                  loading="lazy"
                />
              </div>
              <figcaption>Der Übungskatalog der Anwendung.</figcaption>
            </figure>

            <figure className="shotfig">
              <div className="shot">
                <img
                  src={`/bilder/${DEMONSTRATIONS[0].image}`}
                  alt={DEMONSTRATIONS[0].alt}
                  width={SHOT_VORFUEHRUNG.width}
                  height={SHOT_VORFUEHRUNG.height}
                  loading="lazy"
                />
              </div>
              <figcaption>
                Vor dem Start erklärt eine kurze Vorführung die Übung — hier „{DEMONSTRATIONS[0].title}“.
              </figcaption>
            </figure>

            <figure className="shotfig">
              <div className="shot shot--sm">
                <img
                  src="/bilder/app-verlauf.webp"
                  alt="Trainingsverlauf eines fiktiven Beispielprofils: Übungswerte über 21 Tage, getrennt nach den vier Aufgabenbereichen"
                  width={SHOT_VERLAUF.width}
                  height={SHOT_VERLAUF.height}
                  loading="lazy"
                />
              </div>
              <figcaption>Übungswerte aus einem fiktiven Beispielprofil.</figcaption>
            </figure>

            <figure className="shotfig">
              <div className="shot shot--sm">
                <img
                  src="/bilder/app-radar.webp"
                  alt="Netzdiagramm der vier Aufgabenbereiche für ein fiktives Beispielprofil, je Schwierigkeitsstufe eine eigene Fläche"
                  width={SHOT_RADAR.width}
                  height={SHOT_RADAR.height}
                  loading="lazy"
                />
              </div>
              <figcaption>Übungswerte aus einem fiktiven Beispielprofil.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ── Was wir herausfinden wollen ──────────────────────────────── */}
      <section className="wrap wrap--narrow section">
        <div className="grid grid--split">
          <div>
            <p className="eyebrow eyebrow--purple">Erfahrungen aus der Praxis</p>
            <h2 className="h-section" style={{ fontSize: 'clamp(26px, 3vw, 38px)', marginBottom: 20 }}>
              Was wir gemeinsam herausfinden wollen
            </h2>
            <ul className="checklist">
              {HERAUSFINDEN.map((punkt) => (
                <li key={punkt}>
                  <Check size={17} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
                  {punkt}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="card card--edge card--hover-purple"
            data-edge="1"
            style={{ padding: 28, alignSelf: 'start' }}
          >
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 18px' }}>Voraussetzungen</h3>
            <ul className="plain-list">
              {VORAUSSETZUNGEN.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── So läuft der Pilot ab ────────────────────────────────────── */}
      <section className="wrap wrap--narrow section--tight" style={{ paddingTop: 0 }}>
        <div className="howto">
          <h2>So läuft der Pilot ab</h2>
          <div
            className="grid"
            style={{ gap: 28, gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}
          >
            <div className="howto__step">
              <p>1 — Start</p>
              <p>
                Einführung in Bedienung und Einrichtung und Abstimmung, wie die Software in Ihre
                Abläufe passt. Zum vereinbarten Pilotstart erhalten Sie Ihren Lizenzschlüssel; ab
                dann laufen die sechs Wochen.
              </p>
            </div>
            <div className="howto__step">
              <p>2 — Woche 1–5</p>
              <p>
                Einsatz im Arbeitsalltag. Etwa einmal pro Woche ein kurzes, freiwilliges Feedback.
              </p>
            </div>
            <div className="howto__step">
              <p>3 — Woche 6</p>
              <p>
                Abschlussgespräch: Was hat sich in der Bedienung bewährt, welche Funktion hat
                gefehlt?
              </p>
            </div>
            <div className="howto__step">
              <p>4 — Danach</p>
              <p>
                Wir entscheiden, welche Verbesserungen in die Software kommen, und legen
                gegebenenfalls die vereinbarte Pilotpartner-Anpassung fest. Ihre Daten bleiben auf
                Ihren Geräten erhalten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Was der Pilot ist — und was nicht ────────────────────────── */}
      <section className="wrap wrap--narrow section--tight">
        <h2 className="h-section" style={{ fontSize: 'clamp(26px, 3vw, 38px)', marginBottom: 24 }}>
          Was der Pilot ist — und was nicht
        </h2>
        <div className="grid grid--auto-300" style={{ marginBottom: 20 }}>
          <div className="info-card info-card--cyan">
            <h3>
              <Check size={17} aria-hidden="true" /> Der Pilot ist
            </h3>
            <p>eine gemeinsame Erprobung von Bedienung und Praxistauglichkeit.</p>
          </div>
          <div className="info-card">
            <h3
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                fontSize: 16,
                fontWeight: 700,
                margin: '0 0 12px',
              }}
            >
              <X size={17} aria-hidden="true" /> Der Pilot ist nicht
            </h3>
            <ul className="plain-list">
              <li>eine Studie oder Prüfung von Wirkungen</li>
              <li>ein Abonnement</li>
              <li>eine Weitergabe von Daten der Personen, die Sie betreuen</li>
            </ul>
          </div>
        </div>

        {/* Die Zweckbestimmung, wortgleich, im kleinen Kasten. */}
        <div className="disclaimer">
          <p>{ZWECKBESTIMMUNG}</p>
        </div>
      </section>

      {/* ── Häufige Fragen ───────────────────────────────────────────── */}
      <section className="wrap wrap--narrow section--tight" id="fragen">
        <h2 className="h-section" style={{ fontSize: 'clamp(26px, 3vw, 38px)', marginBottom: 24 }}>
          Häufige Fragen
        </h2>
        <div className="faq">
          {FAQ.map(({ frage, antwort }) => (
            <details key={frage}>
              <summary>{frage}</summary>
              <p className="faq__answer">{antwort}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Bewerbung ────────────────────────────────────────────────────
          Echtes HTML-Formular an den Auslieferungsdienst, nach dem Muster der
          anderen Formulare der Seite. Der Dienst antwortet mit 303: bei Erfolg
          auf /pilotpartner/danke, sonst hierher zurück mit `?fehler=…#bewerbung`.
          Ohne JavaScript nutzbar. Keine Mail geht an die Bewerberadresse; die
          Seite verspricht nur, was der Dienst tut.
          ------------------------------------------------------------------ */}
      <section className="wrap wrap--form section" id="bewerbung">
        <div className="form-card">
          <h2>Als Pilotpartner bewerben</h2>
          <p className="form-card__lede">
            Die Bewerbung ist unverbindlich und kostenlos. Sie begründet keinen Vertrag. Wir
            melden uns innerhalb von fünf Werktagen per E-Mail.
          </p>

          {/* Vorab-Schicht: dieselben Hinweise, vorgerendert und verborgen,
              sichtbar gemacht vom Skript unter dem Formular. `aria-live`, damit
              eine eingeblendete Meldung angesagt wird. */}
          <div
            className="rueckwege"
            aria-live="polite"
            dangerouslySetInnerHTML={{ __html: RUECKWEG_HTML }}
          />

          {/* Und die Fassung, die React verantwortet, sobald es übernommen hat. */}
          <div aria-live="polite">
            {formfehler && (
              <div
                className="callout"
                style={{ marginBottom: 24 }}
                tabIndex={-1}
                ref={fehlerRef}
              >
                <p>{FORMFEHLER_TEXT[formfehler]}</p>
              </div>
            )}
          </div>

          <form method="post" action={PILOT_BEWERBUNG_ACTION} className="form">
            <noscript>
              <div className="callout">
                <p>
                  Die Bewerbung funktioniert auch ohne JavaScript. Was ohne JavaScript nicht geht,
                  ist die Rückmeldung bei einem Fehler: Weist der Dienst Ihre Angaben zurück,
                  schickt er Sie auf diese Seite zurück, und sie kann Ihnen dann nicht anzeigen,
                  warum.{' '}
                  <strong>
                    Sehen Sie nach dem Absenden dieses Formular erneut, ist Ihre Bewerbung nicht
                    angekommen.
                  </strong>{' '}
                  Prüfen Sie dann, ob alle Pflichtfelder ausgefüllt sind, oder schreiben Sie an{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
              </div>
            </noscript>

            <p className="form__required">Alle Felder außer dem Telefon sind Pflichtfelder.</p>

            <div className="field">
              <label htmlFor="pilot-einrichtung">Name der Praxis oder Einrichtung</label>
              <input
                id="pilot-einrichtung"
                type="text"
                name="einrichtung"
                required
                minLength={2}
                maxLength={150}
                autoComplete="organization"
              />
            </div>

            <div className="field">
              <label htmlFor="pilot-ansprechperson">Ansprechperson</label>
              <input
                id="pilot-ansprechperson"
                type="text"
                name="ansprechperson"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
              />
            </div>

            <div className="field">
              <label htmlFor="pilot-email">Geschäftliche E-Mail-Adresse</label>
              <input
                id="pilot-email"
                type="email"
                name="email"
                required
                maxLength={254}
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label htmlFor="pilot-telefon">Telefon (freiwillig)</label>
              <input
                id="pilot-telefon"
                type="tel"
                name="telefon"
                inputMode="tel"
                maxLength={40}
                pattern="[0-9 +\(\)\-]*"
                title="Ziffern, Leerzeichen und + ( ) -"
                autoComplete="tel"
                aria-describedby="pilot-telefon-hinweis"
              />
              <p className="field__help" id="pilot-telefon-hinweis">
                Nur für Rückfragen zu dieser Bewerbung.
              </p>
            </div>

            <div className="field">
              <label htmlFor="pilot-art">Art der Einrichtung</label>
              <select
                id="pilot-art"
                name="art"
                required
                defaultValue=""
                aria-describedby="pilot-art-hinweis"
              >
                <option value="" disabled>
                  Bitte wählen
                </option>
                {PILOT_ARTEN.map(({ wert, label }) => (
                  <option value={wert} key={wert}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="field__help" id="pilot-art-hinweis">
                Die Angabe dient nur der organisatorischen Einordnung.
              </p>
            </div>

            <div className="field">
              <label htmlFor="pilot-zielgruppe">Mit welchen Personengruppen arbeiten Sie ungefähr?</label>
              <input
                id="pilot-zielgruppe"
                type="text"
                name="zielgruppe"
                required
                minLength={2}
                maxLength={300}
                aria-describedby="pilot-zielgruppe-hinweis"
              />
              <p className="field__help" id="pilot-zielgruppe-hinweis">
                Zum Beispiel „ältere Menschen in Gruppenangeboten“. Bitte keine Angaben zu
                einzelnen Personen, Diagnosen oder Krankheitsbildern.
              </p>
            </div>

            <div className="field">
              <label htmlFor="pilot-einsatz">Wie würden Sie die Software voraussichtlich einsetzen?</label>
              <textarea
                id="pilot-einsatz"
                name="einsatz"
                required
                rows={5}
                minLength={10}
                maxLength={1500}
                aria-describedby="pilot-einsatz-hinweis"
              />
              <p className="field__help" id="pilot-einsatz-hinweis">
                Ein paar Sätze zum organisatorischen Rahmen genügen. Bitte keine Angaben zu
                einzelnen Personen oder deren Gesundheit.
              </p>
            </div>

            {/* Lockfeld. Für Menschen unsichtbar, für Bots verlockend — ist es
                gefüllt, tut der Dienst so, als ob, und speichert nichts. */}
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="pilot-webseite">Webseite</label>
              <input
                id="pilot-webseite"
                type="text"
                name="webseite"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <label className="check">
              <input type="checkbox" name="datenschutz" value="ja" required />
              <span>
                Ich habe die{' '}
                <a href="/datenschutz#pilotprogramm" target="_blank" rel="noopener noreferrer">
                  Datenschutzhinweise
                  <span className="sr-only"> (öffnet in neuem Tab)</span>
                </a>{' '}
                gelesen. Die Angaben werden zur Bearbeitung der Bewerbung gespeichert und nach den
                dort genannten Fristen gelöscht.
              </span>
            </label>

            <button type="submit" className="form__submit">
              Als Pilotpartner bewerben
            </button>
          </form>

          {/* Synchron, unmittelbar hinter Kästen und Formular: läuft, während der
              Browser die Seite liest — also lange bevor das Bündel geladen ist. */}
          <script dangerouslySetInnerHTML={{ __html: RUECKWEG_SKRIPT }} />
        </div>
      </section>
    </>
  );
}
