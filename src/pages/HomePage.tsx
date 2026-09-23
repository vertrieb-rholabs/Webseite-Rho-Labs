import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Check, Info, Monitor } from 'lucide-react';
import Seo from '../components/Seo';
import {
  APP_VERSION,
  CONTACT_EMAIL,
  GAME_COUNT,
  HOME_PLAN,
  KAUF_EINWILLIGUNG,
  KAUF_FORM_ACTION,
  MDR_DISCLAIMER,
  PARTNER_PRUEF_URL,
  PREIS_HINWEIS,
  SYSTEM_REQUIREMENTS,
  VORTEILSCODE_LAENGE,
  VORTEILSCODE_UNGUELTIG,
  VORTEILSCODE_ZEICHEN,
  WIDERRUF_FUNKTION_LABEL,
  WIDERRUF_FUNKTION_PFAD,
} from '../constants';
import {
  VORAB_MERKMAL,
  rueckwegKasten,
  rueckwegSkript,
  vorabSchichtAusblenden,
} from '../rueckwege';

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

/**
 * Rueckweg-Kennung des Auslieferungsdienstes auf /home?fehler=…
 *
 * `eingabe` — Angaben unvollstaendig oder ungueltig; der Leser soll etwas
 * aendern. `zuviele` — Ratengrenze; warten. `zahlung` — PayPal liess sich
 * nicht starten; liegt nicht am Formular. `derzeit` — der Verkauf ist
 * gesperrt, weil dem Anbieter eine Pflichtangabe fehlt; der Kaeufer hat nichts
 * falsch gemacht und kann auch nichts aendern. Alles andere wird ignoriert,
 * damit ein unbekannter Wert nicht wie ein Tippfehler aussieht.
 *
 * ── Warum `derzeit` nachgetragen wurde (Befund 5) ──────────────────────────
 * Der Dienst sendet diesen Wert, seit die Verkaufssperre steht (`kauf.ts`,
 * ZIEL_NICHT_MOEGLICH). Diese Liste kannte ihn nicht und verwarf ihn
 * stillschweigend: Der Kaeufer sah dann dasselbe Formular ein zweites Mal —
 * ohne Grund, ohne Hinweis und ohne Weg, sich zu melden. Genau diese Luecke
 * zwischen Dienst und Seite entsteht, wenn eine Seite die Sprache des
 * Dienstes nur teilweise spricht.
 */
type Formfehler = 'eingabe' | 'zuviele' | 'zahlung' | 'derzeit';

const FORMFEHLER_TEXT: Record<Formfehler, string> = {
  eingabe:
    'Der Kauf ließ sich nicht starten. Bitte prüfen Sie die Angaben im Formular und senden Sie es erneut ab.',
  zuviele:
    'Zu viele Versuche in kurzer Zeit. Bitte warten Sie einen Moment und versuchen Sie es dann erneut.',
  zahlung:
    'Die Zahlung ließ sich gerade nicht starten. Das liegt nicht an Ihren Angaben. Bitte versuchen Sie es später erneut.',
  // Es wurde nichts abgebucht und keine Bestellung angelegt. Beides muss
  // dastehen, und eine Adresse dazu — sonst bleibt der Leser ohne Weg.
  derzeit:
    'Der Kauf ist derzeit nicht möglich. Das liegt nicht an Ihren Angaben: '
    + 'Uns fehlt noch eine Pflichtangabe, die zu jeder Bestellung gehört. '
    + 'Es wurde nichts abgebucht und keine Bestellung angelegt. Schreiben Sie '
    + `uns gern unter ${CONTACT_EMAIL} — wir melden uns, sobald der Kauf wieder `
    + 'möglich ist.',
};

function formfehlerLesen(wert: string | null): Formfehler | null {
  if (wert === 'eingabe' || wert === 'zuviele' || wert === 'zahlung' || wert === 'derzeit') {
    return wert;
  }
  return null;
}

/* ── Die Rueckwege stehen zusaetzlich vorgerendert in der Seite (22.09.2026) ─
   Bis dahin wurden `?fehler=` und `?ref=ungueltig` ausschliesslich NACH der
   Hydration gelesen. Wer abgewiesen wurde und kein oder ein verspaetetes
   Buendel hatte, sah deshalb wieder das leere Formular, ohne jeden Hinweis
   darauf, dass der Dienst gerade abgewiesen hatte. Dieselben Kaesten stehen
   jetzt zusaetzlich verborgen im ausgelieferten HTML, und das synchrone
   Skript unter dem Bestellknopf macht den passenden sichtbar — waehrend der
   Browser die Seite liest. Sobald React uebernimmt, blendet es diese
   Vorab-Schicht aus und zeigt seine eigene Fassung. Einzelheiten und die
   Grenze dieses Verfahrens in `src/rueckwege.ts`.
   -------------------------------------------------------------------------- */

/** Die Kennungen, die gelten — aus derselben Pruefung wie eh und je. */
const FORMFEHLER_KENNUNGEN = Object.keys(FORMFEHLER_TEXT).filter(
  (kennung) => formfehlerLesen(kennung) !== null,
);

/** Der Hinweis auf einen abgelaufenen Vorteilslink, derselbe Weg. */
const VORTEILSLINK_ABGELAUFEN =
  'Der Vorteilslink gilt nicht mehr. Sie können die Home-Version weiterhin zum '
  + 'regulären Preis erwerben.';

/** Alle Kaesten einmal — die Fassung fuer das Formular. */
const RUECKWEG_HTML = [
  ...FORMFEHLER_KENNUNGEN.map((kennung) =>
    rueckwegKasten(kennung, FORMFEHLER_TEXT[kennung as Formfehler])),
  rueckwegKasten(VORTEILSCODE_UNGUELTIG, VORTEILSLINK_ABGELAUFEN),
].join('');

/** Dieselben Kaesten in der knappen Fassung fuer die Preiskarte. */
const RUECKWEG_HTML_KNAPP = [
  ...FORMFEHLER_KENNUNGEN.map((kennung) =>
    rueckwegKasten(kennung, FORMFEHLER_TEXT[kennung as Formfehler], 'callout callout--knapp')),
  rueckwegKasten(VORTEILSCODE_UNGUELTIG, VORTEILSLINK_ABGELAUFEN, 'callout callout--knapp'),
].join('');

/**
 * Der Hinweis, der die Luecke zwischen Inline-Skript und Hydration abdeckt.
 *
 * Sobald das Inline-Skript einen gueltigen Vorteilscode in das versteckte Feld
 * geschrieben hat, stimmt der angezeigte Preis nicht mehr sicher mit dem
 * ueberein, den der Dienst berechnen wird. Bis React den Preis nachgefragt und
 * bestaetigt hat, ist der Knopf deshalb gesperrt und dieser Kasten sichtbar.
 * React blendet ihn beim Einhaengen wieder aus und uebernimmt die Anzeige.
 */
const PREIS_SPERRE_HTML =
  `<div class="callout callout--knapp" ${VORAB_MERKMAL} data-preis-pruefung hidden>`
  + '<p>Sie sind über einen Vorteilslink hier. Der Preis wird gerade geprüft; '
  + 'solange bleibt die Bestellung gesperrt.</p>'
  + '</div>';

/**
 * Die Frist, nach der die Seite die Preispruefung aufgibt und den Bestellknopf
 * freigibt — EINE Zahl fuer beide Wege.
 *
 * ── Warum sie hier steht und nicht zweimal im Text ──────────────────────────
 * Den Knopf sperren kann zweierlei: das Inline-Skript unten (bevor React da
 * ist) und React selbst (`preisstand === 'prueft'`). Beide brauchen eine
 * Notbremse, und beide muessen dieselbe Frist einhalten — sonst sagt die Seite
 * „acht Sekunden" und meint an der einen Stelle etwas anderes als an der
 * anderen.
 *
 * Bis zum 22.09.2026 kannte nur das Inline-Skript eine Frist, und die galt
 * ausgerechnet fuer den seltenen Fall (Buendel laedt nicht). Fuer den
 * haeufigen — Seite hydriert, die Preisabfrage beim Dienst haengt — gab es
 * keine: `preisstand` blieb auf `prueft`, der Knopf blieb gesperrt, und ein
 * Vorteilslink konnte den Kauf unbegrenzt verhindern. Siehe den Effekt
 * „Preispruefung" weiter unten und `scripts/ablauf.test.mjs`, Test 5.
 */
const PREIS_FRIST_MS = 8000;

/**
 * Was die Seite sagt, wenn die Frist abgelaufen ist — an allen drei Stellen
 * derselbe Wortlaut: im Inline-Skript, in der Preiskarte und im
 * Pflichtangaben-Block. Er verspricht nichts, was die Seite nicht weiss, und
 * nimmt dem Leser nicht den Vorteilspreis: Der Code bleibt im Feld, und was
 * berechnet wird, entscheidet ohnehin der Dienst.
 */
const PREIS_UNBESTAETIGT_TEXT =
  'Der Vorteilspreis lässt sich gerade nicht bestätigen. Hier steht der '
  + 'reguläre Preis; falls Ihr Vorteilslink gilt, wird er beim Bezahlen '
  + 'berücksichtigt.';

/** Macht den passenden Rueckweg-Kasten sichtbar. */
const RUECKWEG_SKRIPT = rueckwegSkript([
  { parameter: 'fehler', werte: FORMFEHLER_KENNUNGEN },
  { parameter: 'ref', werte: [VORTEILSCODE_UNGUELTIG] },
]);

/**
 * Schliesst die Luecke zwischen Inline-Skript und Hydration.
 *
 * Es steht HINTER dem Bestellknopf — anders als `REF_INLINE_SKRIPT`, das
 * unmittelbar hinter dem versteckten Feld stehen muss. Beides ist dieselbe
 * Ueberlegung: ein Skript kann nur anfassen, was der Browser schon gelesen
 * hat.
 *
 * Es sperrt den Knopf NUR, wenn das Feld wirklich einen Code traegt. Ohne
 * Vorteilslink bleibt die Bestellung vom ersten Augenblick an moeglich, so wie
 * bisher.
 *
 * Die Notbremse am Ende: Laedt das Buendel nicht, haengt React den Marker
 * `data-preis-bereit` nie an, und der Knopf waere fuer immer gesperrt. Nach
 * `PREIS_FRIST_MS` gibt das Skript ihn deshalb wieder frei und sagt dazu, was
 * dann gilt — derselbe Satz wie der Stand „unbestaetigt" in React. Der Code
 * bleibt dabei im Feld stehen: ihn zu verwerfen hiesse, einen gueltigen
 * Vorteilslink wegen einer Stoerung teurer abzurechnen.
 *
 * Diese Bremse endet bewusst, sobald React uebernommen hat — ab da fuehrt
 * React die Anzeige, und die Frist fuer den haengenden Abruf haelt der Effekt
 * „Preispruefung" ein. Die Seite hat also zu JEDEM Zeitpunkt genau eine
 * Notbremse, nie keine.
 */
const KNOPF_SPERRE_SKRIPT = [
  '(function(){try{',
  `var f=document.getElementById('${REF_FELD_ID}');`,
  'if(!f||!f.form||!f.value)return;',
  "var b=f.form.querySelector('.form__submit');",
  'if(!b)return;',
  'b.disabled=true;',
  "var k=document.querySelectorAll('[data-preis-pruefung]');",
  'for(var i=0;i<k.length;i++)k[i].hidden=false;',
  'setTimeout(function(){',
  "if(document.documentElement.hasAttribute('data-preis-bereit'))return;",
  'b.disabled=false;',
  'for(var j=0;j<k.length;j++){',
  "var p=k[j].getElementsByTagName('p')[0];",
  `if(p)p.textContent=${JSON.stringify(PREIS_UNBESTAETIGT_TEXT)};}`,
  `},${PREIS_FRIST_MS});`,
  '}catch(e){}})();',
].join('');

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
  // Rueckweg des Dienstes, wenn der Kauf nicht gestartet werden konnte.
  // Die Kennung sagt, ob der Leser etwas aendern soll oder warten muss.
  // Bis React so weit ist, traegt die Vorab-Schicht denselben Hinweis.
  const [formfehler, setFormfehler] = useState<Formfehler | null>(null);
  const refFeld = useRef<HTMLInputElement>(null);
  /* Der Code, den das versteckte Feld tragen SOLL. Er steht in einer Referenz
     und nicht im Zustand: Er gehört nicht zur Anzeige, und ein Zustand löste
     bei jedem Setzen ein weiteres Rendern aus — genau das, was unten das Feld
     leert. Siehe den Effekt „Nach jedem Rendern". */
  const gehaltenerCode = useRef('');
  // Erst nach dem Einhängen wahr. Der vorgerenderte Knopf bleibt dadurch
  // absendbar, auch ohne JavaScript. Siehe den Effekt unten.
  const [eingehaengt, setEingehaengt] = useState(false);

  /* Auswertung erst nach dem Einhängen. Würde der Code schon beim Rendern
     gelesen, unterschiede sich die erste Darstellung im Browser von der
     vorgerenderten Fassung — eine Hydrations-Differenz. Die Seite liest
     bisher nirgends Query-Parameter; das Muster entsteht hier. */
  useEffect(() => {
    const roh = suchParameter.get('ref');

    // Rückweg des Dienstes: der Code war beim Absenden nicht mehr gültig.
    // Ruhiger Hinweis, keine Schuldzuweisung — gekauft werden kann trotzdem.
    setLinkAbgelaufen((roh ?? '').trim().toLowerCase() === VORTEILSCODE_UNGUELTIG);
    setFormfehler(formfehlerLesen(suchParameter.get('fehler')));

    const code = vorteilscodeNormalisieren(roh);
    // Deckungsgleich mit dem Inline-Skript; trägt zusätzlich den Seitenwechsel
    // innerhalb der Seite, bei dem kein HTML mehr geparst wird.
    gehaltenerCode.current = code;
    if (refFeld.current) refFeld.current.value = code;

    if (!code) {
      setPreisstand({ art: 'regulaer' });
      return;
    }

    const abbruch = new AbortController();
    setPreisstand({ art: 'prueft' });

    /* ── Die Frist der Preispruefung ────────────────────────────────────────
       `fetch` hat von sich aus KEINEN Zeitablauf. Antwortet der Dienst nicht
       — nicht mit einem Fehler, sondern gar nicht; eine offene Verbindung,
       die haengt —, dann bliebe `preisstand` auf „prueft", und der
       Bestellknopf bliebe gesperrt, solange die Seite offen ist. Ein
       Vorteilslink haette den Kauf damit unbegrenzt verhindert.

       Die Notbremse im Inline-Skript faengt diesen Fall NICHT: Sie tritt
       zurueck, sobald `data-preis-bereit` steht, also sobald React eingehaengt
       ist — und genau dann faengt dieser Abruf erst an.

       Nach `PREIS_FRIST_MS` wird deshalb abgebrochen und derselbe Stand
       gesetzt wie bei einem Fehlschlag: regulaerer Preis als Obergrenze, Code
       bleibt im Feld, Knopf frei. Das ist dieselbe Zusage, die die Seite ohne
       JavaScript macht — und jetzt haelt sie sie auch mit. */
    let fristAbgelaufen = false;
    const frist = setTimeout(() => {
      fristAbgelaufen = true;
      abbruch.abort();
      setPreisstand({ art: 'unbestaetigt' });
    }, PREIS_FRIST_MS);

    fetch(`${PARTNER_PRUEF_URL}?code=${encodeURIComponent(code)}`, {
      signal: abbruch.signal,
      headers: { Accept: 'application/json' },
    })
      .then((antwort) => {
        if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);
        return antwort.json() as Promise<PartnerAntwort>;
      })
      .then((daten) => {
        // Die Frist war schneller. Dann bleibt es bei dem, was schon dasteht:
        // Ein spaeter Preiswechsel unter den Augen des Lesers waere genau der
        // stille Aufschlag in die andere Richtung.
        if (fristAbgelaufen) return;
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
        gehaltenerCode.current = '';
        if (refFeld.current) refFeld.current.value = '';
        setPreisstand({ art: 'regulaer' });
      })
      .catch(() => {
        // Ein Abbruch durch die Frist hat den Stand schon gesetzt; ein
        // Abbruch durch das Aufräumen darf nichts mehr setzen.
        if (abbruch.signal.aborted) return;
        // Die Prüfung war nicht erreichbar. Der Code bleibt im Feld stehen:
        // ihn jetzt zu verwerfen hieße, einen gültigen Vorteilslink wegen
        // einer Störung teurer abzurechnen — der stille Aufschlag von der
        // anderen Seite. Angezeigt wird der reguläre Preis als Obergrenze;
        // den tatsächlichen Betrag bestätigt der Käufer ohnehin bei PayPal.
        setPreisstand({ art: 'unbestaetigt' });
      })
      .finally(() => clearTimeout(frist));

    return () => {
      clearTimeout(frist);
      abbruch.abort();
    };
  }, [suchParameter]);

  /* Die Sperre des Knopfs erst nach dem Einhängen setzen. Der erste Stand ist
     „prüft“ — im vorgerenderten HTML und ohne JavaScript bliebe ein dort
     gesperrter Knopf für immer gesperrt, und bestellen ließe sich nicht mehr.
     Ohne Skript gilt der reguläre Preis; das sagt der Hinweis im Formular. */
  useEffect(() => {
    setEingehaengt(true);

    /* Von hier an fuehrt React die Anzeige. Der Marker sagt der Notbremse im
       Sperr-Skript, dass sie nicht mehr gebraucht wird; die Vorab-Schicht
       weicht den Fassungen, die React selbst rendert. */
    document.documentElement.setAttribute('data-preis-bereit', '');
    vorabSchichtAusblenden();
  }, []);

  /* ── Nach JEDEM Rendern: den Code wieder ins Feld ─────────────────────────
     React setzt den Wert eines unkontrollierten Feldes bei jeder
     Aktualisierung auf `defaultValue` zurück. Das versteckte ref-Feld war
     deshalb nach dem ersten Zustandswechsel wieder leer — am Bildschirm
     nachgemessen: Seite mit gültigem `?ref=`, Antwort des Dienstes
     „gueltig", Anzeige 35,90 €, Feldinhalt „". Abgesendet worden wäre eine
     Bestellung ohne Code, und der Dienst hätte 39,90 € berechnet. Angezeigter
     und berechneter Preis wären auseinandergefallen — der stille Aufschlag,
     den das Inline-Skript gerade verhindern soll.

     Dieser Effekt hat ABSICHTLICH keine Abhängigkeitsliste: Er läuft nach
     jedem Rendern und stellt den Wert wieder her. Er schreibt nur, wenn ein
     Code gehalten wird und das Feld ihn nicht trägt — ein leerer gehaltener
     Code löscht hier nichts, das tut allein die Prüfung oben. */
  useEffect(() => {
    const feld = refFeld.current;
    const code = gehaltenerCode.current;
    if (feld && code && feld.value !== code) feld.value = code;
  });

  /* Reine ANZEIGE. Der Auslieferungsdienst ermittelt den Preis beim Absenden
     noch einmal selbst aus seinem Katalog und prüft den Code erneut; was hier
     steht, geht in keine Rechnung ein. Deshalb wandert auch kein Betrag ins
     Formular — übermittelt wird höchstens der Code, nie eine Summe. */
  const preisAktuell = preisstand.art === 'vorteil' ? preisstand.preis : HOME_PLAN.price;
  const prueftNoch = preisstand.art === 'prueft';
  const knopfGesperrt = eingehaengt && prueftNoch;

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
              ist ein Kaufkriterium, kein Kleingedrucktes. Und sie ist seit
              dem 22.09.2026 vollständig: Der Installer wird ausschließlich
              für x64 gebaut (`package.json` des Clients, `build.win.target`),
              „Windows 10/11" allein hätte einen ARM64-Käufer nicht gewarnt. */}
          <p className="hero__meta">
            Für Windows 10/11 (64-Bit) · Einmaliger Kauf · Nach der Aktivierung
            offline nutzbar
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
                <strong>Windows 10 und Windows 11 in 64-Bit (x64)</strong>.
                Fassungen für macOS und Linux sind nicht verfügbar, ebenso
                wenig für <strong>ARM64</strong> — etwa Copilot+-Geräte mit
                Snapdragon — oder für 32-Bit-Systeme. Bitte vor dem Kauf
                prüfen: Windows zeigt das unter Einstellungen → System → Info
                als „Systemtyp“.
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

            {/* Rueckwege des Dienstes. Ohne diese Hinweise stuende der Kaeufer
                vor einem stillschweigend veraenderten Preis oder einer
                Meldung, die einen Serverfehler wie einen Tippfehler aussehen
                laesst. */}
            {/* Vorab-Schicht: vorgerendert, verborgen, vom Skript unter dem
                Bestellknopf aufgedeckt — und von React ausgeblendet, sobald es
                uebernimmt. */}
            <div
              className="rueckwege"
              dangerouslySetInnerHTML={{ __html: RUECKWEG_HTML_KNAPP }}
            />
            {linkAbgelaufen && (
              <div className="callout callout--knapp">
                <p>{VORTEILSLINK_ABGELAUFEN}</p>
              </div>
            )}
            {formfehler && (
              <div className="callout callout--knapp">
                <p>{FORMFEHLER_TEXT[formfehler]}</p>
              </div>
            )}
            {preisstand.art === 'unbestaetigt' && (
              <div className="callout callout--knapp">
                <p>{PREIS_UNBESTAETIGT_TEXT}</p>
              </div>
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
          {/* § 356a Abs. 1 Satz 3 — „hervorgehoben platziert und für den
              Verbraucher leicht zugänglich". Die Fußzeile trägt die ständige
              Verfügbarkeit; dieser Satz trägt die Hervorhebung dort, wo
              Verträge entstehen. Er steht bewusst UNTER der Überschrift und
              nicht neben dem Kaufknopf: die Widerrufsfunktion soll leicht zu
              finden sein, aber nicht mit der Bestellung konkurrieren. */}
          <p className="widerruf-hinweis">
            Schon gekauft und möchten den Vertrag widerrufen?{' '}
            <Link to={WIDERRUF_FUNKTION_PFAD}>{WIDERRUF_FUNKTION_LABEL}</Link>
          </p>
        </div>

        <div className="form-card">
          <p className="eyebrow" style={{ letterSpacing: '0.2em', marginBottom: 14 }}>
            {preisAktuell} · einmalig · für Windows 10/11 (64-Bit)
          </p>
          <h2>Rho-Labs Kognitives Training — Home</h2>
          <p className="form-card__lede">
            Nach der Zahlung über PayPal kommen Lizenzschlüssel und Rechnung per
            E-Mail. Verkäufer ist Rho-Labs, Inhaber Patrick Feix, Feldstraße 15,
            99848 Wutha-Farnroda.
          </p>

          {/* Dieselbe Vorab-Schicht noch einmal am Formular, wo der Kaeufer
              sie braucht. Zwei Behaelter, ein Skript: es deckt jeden Kasten
              mit der passenden Kennung auf, gleich wie oft er vorkommt. */}
          <div
            className="rueckwege"
            dangerouslySetInnerHTML={{ __html: RUECKWEG_HTML }}
          />

          {formfehler && (
            <div className="callout" style={{ marginBottom: 24 }}>
              <p>{FORMFEHLER_TEXT[formfehler]}</p>
            </div>
          )}

          {/* § 312j Abs. 1 — spätestens hier, am Beginn der Bestellung.
              Die Architektur steht seit dem 22.09.2026 mit drin: Sie ist
              Teil der Lieferbeschränkung und nicht erst der wesentlichen
              Eigenschaften, denn für ein ARM64- oder 32-Bit-System gibt es
              die Software schlicht nicht. */}
          <div className="bestellrahmen">
            <p>
              <strong>Lieferbeschränkung.</strong> Die Software gibt es nur für
              Windows 10 und Windows 11 in 64-Bit (x64). Für ARM64- und
              32-Bit-Systeme gibt es keine Fassung.
            </p>
            <p>
              <strong>Zahlungsmittel.</strong> Akzeptiert wird nur PayPal.
            </p>
          </div>

          <form method="post" action={KAUF_FORM_ACTION} className="form">
            {/* Ohne JavaScript bleibt das versteckte ref-Feld leer: der Code
                aus der Adresszeile kommt nicht an, und der Dienst rechnet den
                Vollpreis. Der Kauf selbst geht trotzdem — das muss hier
                stehen, sonst sucht, wer einen Vorteilslink hat, den Fehler
                bei sich. */}
            <noscript>
              <div className="callout">
                <p>
                  Der Kauf funktioniert auch ohne JavaScript, zum regulären
                  Preis. Ein Vorteilslink kann ohne JavaScript nicht
                  berücksichtigt werden.{' '}
                  <strong>Sehen Sie dieses Formular nach dem Absenden erneut,
                  ließ sich der Kauf nicht starten</strong> — meist wegen einer
                  unvollständigen Angabe oder weil von Ihrem Anschluss zu viele
                  Versuche kamen; warum genau, kann diese Seite ohne JavaScript
                  nicht anzeigen. Es wurde dann nichts abgebucht und keine
                  Bestellung angelegt. Bei Fragen erreichen Sie uns unter{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
                </p>
              </div>
            </noscript>

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

            {/* Vorteilscode aus dem Partnerlink.
                Er wird auf ZWEI Wegen gefüllt, und beide sind nötig:

                1. Das Inline-Skript direkt darunter. Es läuft synchron beim
                   Aufbau der Seite — also bevor React auch nur geladen ist.
                   Ohne diesen Weg könnte ein schneller Absender das Formular
                   abschicken, während die Seite noch 35,90 € anzeigt, der
                   Dienst aber mangels Code 39,90 € berechnet. Genau dieser
                   stille Aufschlag ist verboten.
                2. Der useEffect weiter oben, über `refFeld`. Er trägt den
                   Seitenwechsel innerhalb der Anwendung, bei dem kein HTML
                   mehr geparst wird und das Inline-Skript folglich nicht
                   noch einmal läuft.

                Deshalb braucht das Feld BEIDES: eine `id` für den ersten Weg
                und `ref` für den zweiten. */}
            <input
              type="hidden"
              id={REF_FELD_ID}
              name="ref"
              ref={refFeld}
              defaultValue=""
            />
            <script dangerouslySetInnerHTML={{ __html: REF_INLINE_SKRIPT }} />

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
                (§ 356 Abs. 6 BGB). Ohne sie könnte die Lizenz nicht sofort
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

            {/* § 312j Abs. 2 — unmittelbar vor dem Knopf. Der Preis hier ist
                der angezeigte, also 35,90 € bei bestätigtem Vorteilslink.
                Solange die Prüfung läuft, steht hier noch kein Betrag: der
                Knopf ist dann gesperrt, und ein vorläufiger Preis wäre der
                falsche. Ohne JavaScript bleibt der reguläre Preis stehen. */}
            <div className="pflichtblock">
              <p className="pflichtblock__kopf">Angaben zu dieser Bestellung</p>
              <p>
                <strong>Wesentliche Eigenschaften.</strong> Home-Lizenz von
                Rho-Labs Kognitives Training: Download einer Windows-Anwendung
                und ein Lizenzschlüssel per E-Mail. Alle {GAME_COUNT} Übungen,
                Statistik, Export der eigenen Daten und genau ein Profil. Die
                Lizenz gilt für ein Gerät und wird bei der Aktivierung an
                dieses Gerät gebunden. Es wird keine Ware versendet.
              </p>
              <p>
                <strong>Systemanforderungen.</strong>
              </p>
              <ul className="pflichtblock__liste">
                {SYSTEM_REQUIREMENTS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {knopfGesperrt ? (
                <p className="pflichtblock__preis">
                  <strong>Gesamtpreis einschließlich aller Steuern.</strong> Der
                  Preis wird gerade geprüft. Solange bleibt die Bestellung
                  gesperrt.
                </p>
              ) : (
                <p className="pflichtblock__preis">
                  <strong>Gesamtpreis einschließlich aller Steuern.</strong>{' '}
                  {preisAktuell} einmalig. Das ist der Endpreis. Gemäß § 19 UStG
                  wird keine Umsatzsteuer berechnet. Weitere Kosten fallen nicht
                  an.
                </p>
              )}
              {preisstand.art === 'vorteil' && (
                <p>Vorteilspreis über Ihre Einrichtung, statt {preisstand.regulaer}.</p>
              )}
              {preisstand.art === 'unbestaetigt' && (
                <p>{PREIS_UNBESTAETIGT_TEXT}</p>
              )}
              <p>
                <strong>Preisbildung.</strong> Der Preis ist nicht personalisiert.
              </p>
              <p>
                <strong>Laufzeit.</strong> Kein unbefristeter Vertrag und kein
                Abonnement. Der Erwerb ist einmalig, es gibt keine wiederkehrende
                Zahlung. Die Nutzung der Lizenz ist unbefristet. Der Vertrag
                verlängert sich nicht und eine Kündigung ist nicht erforderlich.
                Eine Mindestdauer gibt es nicht.
              </p>
            </div>

            {/* Der Sperr-Hinweis fuer die Zeit vor der Hydration. Er steht
                ausserhalb der React-Anzeige, damit das Skript ihn aufdecken
                kann, bevor React ueberhaupt geladen ist; React blendet ihn
                beim Einhaengen wieder aus. */}
            <div dangerouslySetInnerHTML={{ __html: PREIS_SPERRE_HTML }} />

            <button type="submit" className="form__submit" disabled={knopfGesperrt}>
              Zahlungspflichtig bestellen
            </button>

            {/* Zwei synchrone Skripte, beide hinter dem, was sie anfassen:
                das erste deckt die Rueckwege des Dienstes auf, das zweite
                sperrt den Knopf, solange ein Vorteilscode im Feld steht und
                der Preis dazu noch nicht bestaetigt ist. */}
            <script dangerouslySetInnerHTML={{ __html: RUECKWEG_SKRIPT }} />
            <script dangerouslySetInnerHTML={{ __html: KNOPF_SPERRE_SKRIPT }} />
          </form>

          <p className="form__note">
            Mit „Zahlungspflichtig bestellen“ werden Sie zu PayPal
            weitergeleitet und schließen dort die Zahlung ab. Bricht die
            Zahlung ab, wird nichts berechnet.
          </p>
        </div>

        <p className="price-note">{PREIS_HINWEIS}</p>
      </section>

      {/* SmartScreen-Hinweis und MDR. Die Systemanforderungen stehen im
          Pflichtblock vor dem Knopf, nicht noch einmal hier. */}
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
