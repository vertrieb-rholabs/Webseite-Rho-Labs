import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { CONTACT_EMAIL } from '../constants';
import { PILOT_BEDINGUNGEN_TEXT, PILOT_FASSUNG } from '../pilotbedingungen';

/* ── Der Text, zerlegt — nichts hinzugefügt ──────────────────────────────────
   `PILOT_BEDINGUNGEN_TEXT` ist der kanonische Wortlaut (T1 Abschnitt 1), den
   der Dienst zeichengenau ebenso trägt. Diese Seite zerlegt ihn nur:

     Leerzeile            trennt die Blöcke;
     erste Zeile          Überschrift des Blocks („§ 1 Gegenstand“,
                          „Anhang: …“); der erste Block ist der Kopf mit dem
                          Titel und der Fassungszeile;
     weitere Zeilen       je ein Absatz — „(1) …“ in den Paragrafen, „1. …“ im
                          Anhang.

   Dieselbe Normalisierung wie beim Hash des Dienstes (CRLF → LF, trim), damit
   Zeilenenden den Text nicht unterscheiden. Ob die Seite wirklich jede Zeile
   zeigt, prüft `scripts/pilot.test.mjs` am ausgelieferten HTML.
   -------------------------------------------------------------------------- */

interface Block {
  ueberschrift: string;
  zeilen: string[];
}

function zerlegen(text: string): { titel: string; fassung: string; paragrafen: Block[]; anhang: Block | null } {
  const bloecke = text
    .replace(/\r\n/g, '\n')
    .trim()
    .split(/\n{2,}/)
    .map((roh) => roh.split('\n'))
    .map(([ueberschrift, ...zeilen]) => ({ ueberschrift, zeilen }));

  const [kopf, ...rest] = bloecke;
  const anhang = rest.find((b) => b.ueberschrift.startsWith('Anhang')) ?? null;
  return {
    titel: kopf.ueberschrift,
    fassung: kopf.zeilen[0] ?? '',
    paragrafen: rest.filter((b) => b !== anhang),
    anhang,
  };
}

const TEXT = zerlegen(PILOT_BEDINGUNGEN_TEXT);

/** „(1) Text“ → die Nummer abgesetzt, der Text unverändert dahinter. */
function Absatz({ zeile }: { zeile: string }) {
  const treffer = /^(\(\d+\))\s+([\s\S]*)$/.exec(zeile);
  if (!treffer) return <p>{zeile}</p>;
  return (
    <p>
      <span className="para-nr">{treffer[1]}</span> {treffer[2]}
    </p>
  );
}

/**
 * Die Pilotbedingungen, Fassung P1-2026-10.
 *
 * Gerendert wie `Lizenzbedingungen.tsx`: ein `.legal-block` je Paragraf. Der
 * Anhang („Datenschutzhinweise für Pilotpartner“) steht als eigener Abschnitt
 * darunter, abgesetzt, weil er Empfehlungen enthält und keine Vertragspflichten.
 */
export default function PilotBedingungen() {
  return (
    <>
      <Seo
        path="/pilotbedingungen"
        title="Pilotbedingungen — Rho-Labs"
        description={`Pilotbedingungen für das Pilotprogramm von Rho-Labs, Fassung ${PILOT_FASSUNG}: Gegenstand, Ablauf, Nutzungsrecht, Daten auf den Geräten, Haftung.`}
      />

      <div className="wrap wrap--legal section--tight">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Rechtliches
        </p>
        <h1 className="h-page" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: 20 }}>
          {TEXT.titel}
        </h1>
        <p className="lede" style={{ marginBottom: 28 }}>
          {TEXT.fassung}
        </p>

        <div className="stack">
          {TEXT.paragrafen.map((block) => (
            <div className="legal-block" key={block.ueberschrift}>
              <h2>{block.ueberschrift}</h2>
              <div className="stack" style={{ gap: 14 }}>
                {block.zeilen.map((zeile) => (
                  <Absatz zeile={zeile} key={zeile} />
                ))}
              </div>
            </div>
          ))}

          {TEXT.anhang && (
            <div className="legal-block legal-block--anhang" id="anhang">
              <h2>{TEXT.anhang.ueberschrift}</h2>
              <ol>
                {TEXT.anhang.zeilen.map((zeile) => (
                  <li key={zeile}>{zeile.replace(/^\d+\.\s+/, '')}</li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <p className="note" style={{ display: 'block', marginTop: 28 }}>
          Zur <Link to="/pilotpartner">Pilotseite</Link> mit Ablauf und Bewerbung. Fragen
          zu den Bedingungen an <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          Anbieterangaben im <Link to="/impressum">Impressum</Link>, Hinweise zum
          Datenschutz in der{' '}
          <Link to="/datenschutz">Datenschutzerklärung</Link>.
        </p>
      </div>
    </>
  );
}
