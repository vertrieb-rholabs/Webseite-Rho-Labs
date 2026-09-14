import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Info, Monitor } from 'lucide-react';
import Seo from '../components/Seo';
import {
  APP_VERSION,
  GAME_COUNT,
  HOME_PLAN,
  KAUF_EINWILLIGUNG,
  KAUF_FORM_ACTION,
  MDR_DISCLAIMER,
  PARTNER_PRUEF_URL,
  PREIS_HINWEIS,
  SALES_EMAIL,
  SYSTEM_REQUIREMENTS,
  VORTEILSCODE_LAENGE,
  VORTEILSCODE_UNGUELTIG,
  VORTEILSCODE_ZEICHEN,
} from '../constants';

/* ── Vorteilscode aus der Adresszeile ──────────────────────────────────────
   Der Code nimmt ZWEI Wege in das versteckte Formularfeld, und beide werden
   gebraucht:

   1. Das synchrone Inline-Skript weiter unten. Es läuft, während der Browser
      das vorgerenderte HTML liest — also lange bevor das Bündel geladen und
      React eingehängt ist. Ohne diesen Weg könnte ein schneller Absender das
      Formular abschicken, bevor React den Code gesetzt hat, und trotz
      gültigem Vorteilslink den vollen Preis zahlen. Genau dieser stille
      Aufschlag ist verboten.
   2. Die Auswertung in React (useSearchParams), ausgewertet erst NACH dem
      Einhängen. Sie trägt den Fall, den das Inline-Skript nicht sehen kann:
      einen Seitenwechsel innerhalb der Seite, bei dem kein HTML mehr geparst
      und folglich kein Inline-Skript mehr ausgeführt wird. Sie ist zugleich
      die einzige Stelle, die den Preis nachfragen darf.

   Beide Wege prüfen das Format gleich, damit sie nicht auseinanderlaufen.
   -------------------------------------------------------------------------- */

/** Kennung des versteckten Feldes — das Inline-Skript findet es darüber. */
const REF_FELD_ID = 'kauf-ref';

const VORTEILSCODE_MUSTER = new RegExp(`^[${VORTEILSCODE_ZEICHEN}]{${VORTEILSCODE_LAENGE}}$`);

/**
 * Großschrift, ohne Bindestriche und Leerzeichen — und nur, wenn danach genau
 * das vereinbarte Format übrig bleibt. Alles andere (auch der Rückweg-Marker
 * `ungueltig`) ergibt einen leeren Code und damit keinen Rabatt.
 */
function vorteilscodeNormalisieren(roh: string | null): string {
  if (!roh) return '';
  const code = roh.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return VORTEILSCODE_MUSTER.test(code) ? code : '';
}

/**
 * Dasselbe ohne React und ohne Abhängigkeiten, damit es im Tempo des
 * Seitenaufbaus läuft.
 *
 * Es steht bewusst unmittelbar HINTER dem versteckten Feld und nicht im
 * <head>: ein Skript im Kopf liefe zwar noch früher, fände das Feld dort aber
 * gar nicht vor — der Browser hat den Rumpf zu dem Zeitpunkt noch nicht
 * gelesen. An dieser Stelle ist das Feld gerade fertig geparst, und das
 * Bündel der Seite (type="module", also aufgeschoben) hat noch keine Zeile
 * ausgeführt.
 */
const REF_INLINE_SKRIPT = [
  '(function(){try{',
  'var t=/[?&]ref=([^&#]*)/.exec(location.search);if(!t)return;',
  "var c=decodeURIComponent(t[1].replace(/\\+/g,' ')).toUpperCase().replace(/[^A-Z0-9]/g,'');",
  `if(!/^[${VORTEILSCODE_ZEICHEN}]{${VORTEILSCODE_LAENGE}}$/.test(c))return;`,
  `var f=document.getElementById('${REF_FELD_ID}');if(f)f.value=c;`,
  '}catch(e){}})();',
].join('');

/** Antwort von GET /api/public/partner/pruefen — reine Anzeigewerte. */
interface PartnerAntwort {
  gueltig?: boolean;
  preis?: number;
  preis_regulaer?: number;
}

/**
 * Stand der Preisprüfung. Solange sie läuft, bleibt der Absendeknopf gesperrt:
 * wer bestellt, soll den Preis gesehen haben, den er zahlt.
 */
type Preisstand =
  | { art: 'prueft' }
  | { art: 'regulaer' }
  | { art: 'vorteil'; preis: string; regulaer: string }
  | { art: 'unbestaetigt' };

const EURO = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });

/** Gibt den formatierten Betrag zurück, wenn die Zahl brauchbar ist. */
function euro(betrag: number | undefined): string | null {
  return typeof betrag === 'number' && Number.isFinite(betrag) ? EURO.format(betrag) : null;
}

/**
 * Produktseite und Kaufstrecke der Home-Version.
 *
 * Diese Seite ist keine zusätzliche Hürde vor der Zahlung, sondern die
 * rechtlich notwendige Station davor: Preis, Verkäufer, Widerrufsbelehrung und
 * die Zustimmung zu den Bedingungen müssen vor dem Auslösen der Zahlung zu
 * sehen sein, und der auslösende Knopf muss eindeutig als zahlungspflichtig
 * beschriftet sein (§ 312j BGB, „Button-Lösung“).
 */
export default function HomePage() {
  // Nur gelesen, nie geschrieben: unter dem statischen Router beim Vorrendern
  // wäre ein Schreiben gar nicht möglich, und nötig ist es auch nicht.
  const [suchParameter] = useSearchParams();
  const [preisstand, setPreisstand] = useState<Preisstand>({ art: 'prueft' });
  const [linkAbgelaufen, setLinkAbgelaufen] = useState(false);
  const refFeld = useRef<HTMLInputElement>(null);

  /* Auswertung erst nach dem Einhängen. Würde der Code schon beim Rendern
     gelesen, unterschiede sich die erste Darstellung im Browser von der
     vorgerenderten Fassung — eine Hydrations-Differenz. Die Seite liest
     bisher nirgends Query-Parameter; das Muster entsteht hier. */
  useEffect(() => {
    const roh = suchParameter.get('ref');

    // Rückweg des Dienstes: der Code war beim Absenden nicht mehr gültig.
    // Ruhiger Hinweis, keine Schuldzuweisung — gekauft werden kann trotzdem.
    setLinkAbgelaufen((roh ?? '').trim().toLowerCase() === VORTEILSCODE_UNGUELTIG);

    const code = vorteilscodeNormalisieren(roh);
    // Deckungsgleich mit dem Inline-Skript; trägt zusätzlich den Seitenwechsel
    // innerhalb der Seite, bei dem kein HTML mehr geparst wird.
    if (refFeld.current) refFeld.current.value = code;

    if (!code) {
      setPreisstand({ art: 'regulaer' });
      return;
    }

    const abbruch = new AbortController();
    setPreisstand({ art: 'prueft' });

    fetch(`${PARTNER_PRUEF_URL}?code=${encodeURIComponent(code)}`, {
      signal: abbruch.signal,
      headers: { Accept: 'application/json' },
    })
      .then((antwort) => {
        if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);
        return antwort.json() as Promise<PartnerAntwort>;
      })
      .then((daten) => {
        if (daten?.gueltig === true) {
          setPreisstand({
            art: 'vorteil',
            preis: euro(daten.preis) ?? HOME_PLAN.vorteilspreis ?? HOME_PLAN.price,
            regulaer: euro(daten.preis_regulaer) ?? HOME_PLAN.price,
          });
          return;
        }
        // Unbekannter oder abgeschalteter Code. Ohne Fehlermeldung zurück auf
        // den Normalpreis — und das Feld leeren, damit der Dienst denselben
        // Preis errechnet, der hier steht.
        if (refFeld.current) refFeld.current.value = '';
        setPreisstand({ art: 'regulaer' });
      })
      .catch(() => {
        if (abbruch.signal.aborted) return;
        // Die Prüfung war nicht erreichbar. Der Code bleibt im Feld stehen:
        // ihn jetzt zu verwerfen hieße, einen gültigen Vorteilslink wegen
        // einer Störung teurer abzurechnen — der stille Aufschlag von der
        // anderen Seite. Angezeigt wird der reguläre Preis als Obergrenze;
        // den tatsächlichen Betrag bestätigt der Käufer ohnehin bei PayPal.
        setPreisstand({ art: 'unbestaetigt' });
      });

    return () => abbruch.abort();
  }, [suchParameter]);

  /* Reine ANZEIGE. Der Auslieferungsdienst ermittelt den Preis beim Absenden
     noch einmal selbst aus seinem Katalog und prüft den Code erneut; was hier
     steht, geht in keine Rechnung ein. Deshalb wandert auch kein Betrag ins
     Formular — übermittelt wird höchstens der Code, nie eine Summe. */
  const preisAktuell = preisstand.art === 'vorteil' ? preisstand.preis : HOME_PLAN.price;
  const prueftNoch = preisstand.art === 'prueft';

  return (
    <>
      <Seo
        path="/home"
        title="Home-Version für zu Hause — Rho-Labs Kognitives Training"
        description={`Kognitives Training für den privaten Gebrauch: alle ${GAME_COUNT} Übungen, ein persönliches Profil, eigene Statistik und Export. 39,90 € einmalig, kein Abo, für Windows 10/11.`}
      />

      {/* ── Held ─────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true">
          <div className="mesh" />
          <div className="hero__glow" style={{ width: 1000, height: 560, top: -300 }} />
        </div>
        <div className="hero__inner hero__inner--slim">
          <span className="pill" style={{ marginBottom: 28 }}>
            <span className="pill__dot" aria-hidden="true" />
            Für den privaten Gebrauch · Version {APP_VERSION}
          </span>
          <h1 className="hero__title hero__title--product">
            Kognitives Training <span className="grad grad--duo">für zu Hause</span>
          </h1>
          <p className="hero__lede" style={{ marginBottom: 20 }}>
            Dieselbe Anwendung, die Fachteams einsetzen — zugeschnitten auf eine
            Person. Alle {GAME_COUNT} Übungen, ein persönliches Profil, die
            eigene Statistik und der Export der eigenen Daten.{' '}
            <span className="mark">{preisAktuell} einmalig</span>, kein Abonnement.
          </p>
          <div className="btn-row btn-row--center">
            <a href="#kaufen" className="btn btn--primary">
              {HOME_PLAN.ctaText}
            </a>
            <Link to="/kontakt" className="btn btn--ghost">
              Erst 14 Tage testen
            </Link>
          </div>
          {/* Die Systemvoraussetzung gehört bei Privatkunden nach vorne: sie
              ist ein Kaufkriterium, kein Kleingedrucktes. */}
          <p className="hero__meta">
            Für Windows 10/11 · Einmaliger Kauf · Nach der Aktivierung offline
            nutzbar
          </p>
        </div>
      </section>

      {/* ── Leistungsumfang und Preis ────────────────────────────────── */}
      <section className="wrap wrap--narrow section">
        <div className="grid grid--split">
          <div>
            <p className="eyebrow">Home-Version</p>
            <h2
              className="h-section"
              style={{ fontSize: 'clamp(26px, 3vw, 38px)', marginBottom: 20 }}
            >
              Alle {GAME_COUNT} Übungen, ein Profil, kein Abo
            </h2>
            <p className="lede" style={{ marginBottom: 24 }}>
              Home ist nicht beschnitten, sondern anders geschnitten: Der
              Übungskatalog ist vollständig, die Auswertung ebenso. Was fehlt,
              ist die Verwaltung fremder Klienten — die braucht zu Hause
              niemand.
            </p>
            <ul className="checklist" style={{ marginBottom: 24 }}>
              <li>
                <Check size={17} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
                Ein persönliches Profil, ohne Profilauswahl beim Start
              </li>
              <li>
                <Check size={17} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
                Persönliche Statistik und Trainingsverlauf über die Zeit
              </li>
              <li>
                <Check size={17} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
                Export der eigenen Daten als PDF und CSV
              </li>
              <li>
                <Check size={17} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
                Trainingsdaten bleiben auf dem Gerät
              </li>
            </ul>

            <div className="callout">
              <h4>
                <Monitor size={15} aria-hidden="true" /> Systemvoraussetzung
              </h4>
              <p>
                Die Home-Version gibt es derzeit ausschließlich für{' '}
                <strong>Windows 10 und Windows 11</strong>. Fassungen für macOS
                und Linux sind nicht verfügbar. Bitte vor dem Kauf prüfen.
              </p>
            </div>
          </div>

          {/* Preiskarte aus HOME_PLAN. Bewusst nicht aus PLANS: dort führt
              jeder Knopf nach draußen (mailto: oder PayPal), hier führt er
              zum Kaufformular weiter unten (ctaIntern). */}
          <div className="plan plan--featured card--edge" data-edge="1">
            <div className="plan__head">
              <h3>{HOME_PLAN.name}</h3>
              <span className="badge badge--available">Neu</span>
            </div>
            <p className="plan__price">
              {preisAktuell}
              {preisstand.art === 'vorteil' && (
                <span className="plan__price-alt">statt {preisstand.regulaer}</span>
              )}
            </p>
            {preisstand.art === 'vorteil' && (
              <p className="vorteil-note">Vorteilspreis über Ihre Einrichtung</p>
            )}
            <p className="plan__sub">{HOME_PLAN.subtext}</p>

            <ul className="plan__features">
              {HOME_PLAN.features.map((feature) => (
                <li key={feature.text} data-hi={feature.highlight ? 'true' : 'false'}>
                  <Check size={16} color="#22d3ee" strokeWidth={2.4} aria-hidden="true" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>

            <a href={HOME_PLAN.ctaLink} className="plan__cta plan__cta--primary">
              {HOME_PLAN.ctaText}
            </a>
          </div>
        </div>
      </section>

      {/* ── Abgrenzung zu Demo und Professional ──────────────────────── */}
      <section className="band band--closed">
        <div className="wrap wrap--narrow section">
          <div className="intro" style={{ marginBottom: 32 }}>
            <p className="eyebrow">Einordnung</p>
            <h2 className="h-section" style={{ fontSize: 'clamp(26px, 3vw, 38px)' }}>
              Was die Demo zeigt und was Home kann
            </h2>
          </div>

          <div className="grid grid--auto-300">
            <div className="info-card info-card--cyan">
              <h3>
                <Info size={17} aria-hidden="true" /> Die Demo zeigt mehr als Home
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: '#cbd5e1', margin: 0 }}>
                Die kostenlose Demo läuft 14 Tage mit dem vollen
                Professional-Umfang — also mit Klientenverwaltung und
                Trainingsablauf-Editor. Die Home-Version hat{' '}
                <span className="mark">ein Profil</span> und keine
                Klientenverwaltung. Wer von der Demo zu Home wechselt, behält
                alle {GAME_COUNT} Übungen, Statistik und Export, verliert aber
                die mehreren Profile und die Trainingsabläufe.
              </p>
            </div>

            <div className="info-card info-card--purple">
              <h3>Für Einrichtungen und Praxen</h3>
              <p>
                Wer mit mehreren Klienten arbeitet, Trainingsabläufe
                zusammenstellt und auf mehreren Geräten installieren möchte, ist
                bei den gewerblichen Lizenzen richtig.
              </p>
              <Link to="/kognitives-training" className="link-arrow">
                Gewerbliche Lizenzen ansehen <ArrowRight size={15} strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Kaufformular ─────────────────────────────────────────────────
          Echtes HTML-Formular an den Auslieferungsdienst, nach dem Muster des
          Demo-Formulars auf der Kontaktseite. Der Dienst antwortet mit einer
          Weiterleitung auf die PayPal-Freigabeseite. Es ist kein JavaScript
          nötig: die Seite rechnet nichts aus, der Preis steht serverseitig
          fest.
          ------------------------------------------------------------------ */}
      <section className="wrap wrap--form section" id="kaufen">
        <div className="intro intro--center" style={{ marginBottom: 32 }}>
          <p className="eyebrow">Bestellung</p>
          <h2 className="h-section" style={{ fontSize: 'clamp(26px, 3vw, 38px)' }}>
            Home-Lizenz kaufen
          </h2>
        </div>

        <div className="form-card">
          <p className="eyebrow" style={{ letterSpacing: '0.2em', marginBottom: 14 }}>
            {HOME_PLAN.price} · einmalig · für Windows 10/11
          </p>
          <h2>Rho-Labs Kognitives Training — Home</h2>
          <p className="form-card__lede">
            Nach der Zahlung über PayPal kommen Lizenzschlüssel und Rechnung per
            E-Mail. Verkäufer ist Rho-Labs, Inhaber Patrick Feix, Feldstraße 15,
            99848 Wutha-Farnroda.
          </p>

          <form method="post" action={KAUF_FORM_ACTION} className="form">
            <div className="field">
              <label htmlFor="kauf-email">E-Mail-Adresse</label>
              <input
                id="kauf-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                maxLength={120}
                placeholder="name@beispiel.de"
              />
            </div>

            <div className="field">
              <label htmlFor="kauf-name">
                Name <span className="field__hint">— steht auf der Rechnung</span>
              </label>
              <input
                id="kauf-name"
                type="text"
                name="name"
                required
                autoComplete="name"
                maxLength={80}
                placeholder="Vor- und Nachname"
              />
            </div>

            {/* Vorteilscode aus einem Partnerlink. Bleibt vorerst leer — die
                Auswertung von ?ref= kommt in einer späteren Welle. Das Feld
                steht schon hier, damit der Feldvertrag zum Dienst passt. */}
            <input type="hidden" name="ref" defaultValue="" />

            {/* Honigtopf. Für Menschen unsichtbar, für Bots verlockend — ist
                das Feld gefüllt, verwirft der Server die Anfrage. */}
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="kauf-webseite">Webseite</label>
              <input
                id="kauf-webseite"
                type="text"
                name="webseite"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <label className="consent">
              <input type="checkbox" name="agb" value="ja" required />
              <span>
                {KAUF_EINWILLIGUNG.agb}{' '}
                <span className="consent__aside">
                  <Link to="/agb">AGB</Link> ·{' '}
                  <Link to="/lizenzbedingungen">Lizenzbedingungen</Link> ·{' '}
                  <Link to="/datenschutz">Datenschutz</Link>
                </span>
              </span>
            </label>

            {/* Zweite Bestätigung, deutlich abgesetzt: sie betrifft etwas
                anderes als die AGB und muss gesondert erklärt werden
                (§ 356 Abs. 5 BGB). Ohne sie könnte die Lizenz nicht sofort
                ausgeliefert werden — deshalb Pflichtfeld. */}
            <label className="consent consent--optional">
              <input type="checkbox" name="sofort_bereit" value="ja" required />
              <span>
                {KAUF_EINWILLIGUNG.sofortBereit}{' '}
                <span className="consent__aside">
                  Einzelheiten in der <Link to="/widerruf">Widerrufsbelehrung</Link>.
                </span>
              </span>
            </label>

            <button type="submit" className="form__submit">
              Zahlungspflichtig bestellen
            </button>
          </form>

          <p className="form__note">
            Mit „Zahlungspflichtig bestellen“ wirst du zu PayPal weitergeleitet
            und schließt dort die Zahlung ab. Bricht die Zahlung ab, wird nichts
            berechnet.
          </p>
        </div>

        <p className="price-note">{PREIS_HINWEIS}</p>
      </section>

      {/* ── Systemanforderungen und MDR-Hinweis ──────────────────────── */}
      <section
        className="wrap wrap--narrow"
        style={{ paddingBottom: 'clamp(56px, 7vw, 96px)' }}
      >
        <div className="grid grid--auto-300">
          <div
            className="card card--edge card--hover-purple"
            data-edge="1"
            style={{ padding: 28 }}
          >
            <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 18px' }}>
              Systemanforderungen
            </h3>
            <ul className="plain-list" style={{ marginBottom: 24 }}>
              {SYSTEM_REQUIREMENTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="callout">
              <h4>
                <Info size={15} aria-hidden="true" /> Beim ersten Start
              </h4>
              <p>
                Die Anwendung hat noch kein kommerzielles
                Code-Signing-Zertifikat. Windows Defender SmartScreen kann
                deshalb eine Warnung zeigen: „Weitere Informationen“ und dann
                „Trotzdem ausführen“.
              </p>
            </div>
          </div>

          {/* Derselbe Baustein wie auf der Produkt- und der Evidenzseite:
              Home ist ebenso wenig ein Medizinprodukt. */}
          <div className="disclaimer">
            <span className="icon-box icon-box--sm icon-box--grey" aria-hidden="true">
              <Info size={17} />
            </span>
            <p>{MDR_DISCLAIMER}</p>
          </div>
        </div>
      </section>
    </>
  );
}
