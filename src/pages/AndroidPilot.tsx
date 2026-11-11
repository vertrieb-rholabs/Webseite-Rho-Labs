import { Download, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { CONTACT_EMAIL, ZWECKBESTIMMUNG } from '../constants';

/* ── PLATZHALTER: vor der Freigabe ersetzen ──────────────────────────────────
   Die vier Werte stehen absichtlich als {{…}} im ausgelieferten HTML, damit
   eine unfertige Seite sofort auffällt. Eingesetzt werden sie erst nach der
   Freigabe (F4) und dem Nachweis von `scripts/android-publish.sh promote`
   im App-Repo. Der Link zeigt dann auf eine Datei, die wirklich öffentlich
   liegt.

     APK_DATEI    rholabs-kognitives-training-<versionName>-<versionCode>.apk
     VERSION      versionName der App, z. B. 1.10.0
     APK_SHA256   SHA-256 der APK (Ausgabe von promote)
     CERT_SHA256  SHA-256-Fingerabdruck des Signaturzertifikats
                  (apksigner verify --print-certs)

   Die Prüfwerte stehen hier auf rholabs.de (GitHub Pages), getrennt vom
   Download-Server. Das Prüfen ist freiwillig (Plan R-85).
   -------------------------------------------------------------------------- */
const APK_DATEI = 'rholabs-kognitives-training-1.10.3-10100005.apk';
const VERSION = '1.10.3';
const APK_SHA256 = '{{APK_SHA256}}';
const CERT_SHA256 = '7B:28:D0:38:91:34:DC:DB:B9:5C:22:C1:33:C6:DF:B5:75:DD:F6:E9:13:71:65:16:8F:57:9A:55:D3:B0:C6:87';

const DOWNLOAD_URL = `https://download.rholabs.de/android/${APK_DATEI}`;

/** Lange Hex-Werte dürfen auf schmalen Bildschirmen umbrechen. */
const HEX_STIL = { overflowWrap: 'anywhere' as const, wordBreak: 'break-all' as const };

/**
 * Android-Fassung für Pilotpartner (S1 des Android-Plans).
 *
 * Bewusst versteckt: noindex, nicht in der Navigation, nicht in der Sitemap.
 * Der Download-Server liefert die APK ebenfalls mit `X-Robots-Tag: noindex`.
 * Bleibt nach dem öffentlichen Start bestehen (Pilotpraxis, Version 1.10.3);
 * ein Hinweis oben führt alle anderen auf /android/.
 */
export default function AndroidPilot() {
  return (
    <>
      <Seo
        path="/android-pilot/"
        title="Android-Fassung für Pilotpartner — Rho-Labs"
        description="Android-Fassung von Rho-Labs Kognitives Training für Pilotpartner: Download, Systemanforderungen und Installation."
        noindex
      />

      <div className="wrap wrap--legal section--tight">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Rho-Labs Kognitives Training · Android
        </p>
        <h1 className="h-page" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: 20 }}>
          Android-Fassung für Pilotpartner
        </h1>
        <p className="lede" style={{ marginBottom: 28 }}>
          Android-Fassung für die Pilotpraxis. Installation erst nach Bestätigung der Ergänzung A.
        </p>

        {/* Wegweiser für alle, die diese Seite ohne Pilotprogramm erreichen. */}
        <div className="callout" style={{ marginBottom: 28 }}>
          <h4>
            <Info size={15} aria-hidden="true" /> Für alle anderen: Android-Fassung
          </h4>
          <p>
            Diese Seite gilt für die Pilotpraxis (Version {VERSION}). Wenn du nicht am
            Pilotprogramm teilnimmst, findest du die aktuelle Android-Fassung auf der{' '}
            <Link to="/android/">Android-Seite</Link>.
          </p>
        </div>

        <div className="stack">
          {/* ── Download ─────────────────────────────────────────────── */}
          <div className="legal-block">
            <h2>Download</h2>
            <p style={{ marginBottom: 18 }}>
              Version <span className="legal-mono">{VERSION}</span>. Öffne diese Seite auf dem
              Tablet in Chrome und tippe auf den Knopf.
            </p>
            <div className="btn-row">
              <a className="btn btn--primary" href={DOWNLOAD_URL} rel="nofollow">
                <Download size={17} aria-hidden="true" /> APK herunterladen
              </a>
            </div>
            <p className="note" style={{ display: 'block', marginTop: 14, ...HEX_STIL }}>
              {DOWNLOAD_URL}
            </p>
          </div>

          {/* ── Systemanforderungen ──────────────────────────────────── */}
          <div className="legal-block">
            <h2>Systemanforderungen</h2>
            <ul>
              <li>Android 10 oder neuer.</li>
              <li>
                Android System WebView bzw. Chrome ab Version 105. Die App prüft das beim Start.
                Die Version findest du unter Einstellungen › Apps › Android System WebView.
              </li>
              <li>Empfohlen ist ein Tablet, am besten ab etwa 10 Zoll.</li>
              <li>
                Internet braucht die App nur für die Aktivierung und die Prüfung der Lizenz.
              </li>
            </ul>
          </div>

          {/* ── Installation ─────────────────────────────────────────── */}
          <div className="legal-block">
            <h2>Installation</h2>
            <ol>
              <li>
                Öffne diese Seite auf dem Tablet in <strong>Chrome</strong> und tippe auf
                „APK herunterladen“. Fragt Chrome nach, ob du die Datei behalten möchtest,
                bestätige das.
              </li>
              <li>
                Öffne die heruntergeladene Datei über die Meldung von Chrome oder unter
                Dateien › Downloads.
              </li>
              <li>
                Beim ersten Mal fragt Android, ob Chrome Apps installieren darf. Tippe auf
                „Einstellungen“ und erlaube die Installation aus dieser Quelle. Das ist nur
                einmal nötig. Die Bezeichnung unterscheidet sich je nach Hersteller.
              </li>
              <li>
                Auf Samsung-Geräten kann die <strong>Automatische Blockierung</strong> die
                Installation verhindern (Einstellungen › Sicherheit und Datenschutz ›
                Automatische Blockierung). Schalte sie für die Installation kurz aus und danach
                wieder ein.
              </li>
              <li>
                Google Play Protect kann melden, dass es die App nicht kennt. Tippe dann auf
                „Trotzdem installieren“, je nach Version unter „Weitere Details“.
              </li>
              <li>
                Öffne die App und füge den <strong>Lizenzschlüssel aus unserer E-Mail</strong> ein.
              </li>
            </ol>
            <p style={{ marginTop: 16 }}>
              <strong>Updates:</strong> Die App prüft selbst auf neue Versionen, lädt eine neue
              Version vorab herunter (derzeit etwa 13 MB; über mobiles Internet zählt das zum
              Datenvolumen) und bietet sie dir dann zur Installation an. Du bestätigst die
              Installation; beim ersten Update fragt Android, ob die App Apps installieren darf.
              Auf manchen Geräten schließt Android die App nach dem Erlauben. Öffne sie dann
              einfach wieder, das Update wird dir erneut angeboten.
              Neue Versionen findest du außerdem auf dieser Seite: Lade die neue Datei wie oben
              herunter und installiere sie über die vorhandene App, ohne sie vorher zu
              deinstallieren. Deine Daten und die Lizenz bleiben dabei erhalten.
            </p>
          </div>

          {/* ── Daten ────────────────────────────────────────────────── */}
          <div className="legal-block">
            <h2>Deine Daten</h2>
            <ul>
              <li>
                Alle Trainingsdaten bleiben auf dem Tablet. Es gibt keine Cloud und keine
                Synchronisation.
              </li>
              <li>
                <strong>Wenn du die App deinstallierst, löscht Android ihre Daten.</strong>{' '}
                Exportiere vorher die Berichte, die du behalten möchtest (CSV oder PDF). Wieder
                einspielen lassen sich diese Berichte nicht.
              </li>
              <li>
                Die Daten sind an das Gerät gebunden. Bei einem Gerätewechsel deaktivierst du
                die Lizenz auf dem alten Tablet und aktivierst sie auf dem neuen; der
                Trainingsverlauf zieht nicht mit um.
              </li>
              <li>
                <strong>Bericht speichern:</strong> Übernimm im Speicherdialog den vorgeschlagenen
                Namen und tippe keine vorhandene Datei an, auch nicht zum Überschreiben. Sonst
                speichert die App den Bericht nicht, und die angetippte Datei wird entfernt.
                Speichere jeden Bericht als neue Datei. Die nächste Version behebt das.
              </li>
            </ul>
            <p style={{ marginTop: 16 }}>
              Was die App an unseren Lizenzdienst sendet und wie lange wir es speichern, steht in
              der{' '}
              <Link to="/datenschutz/#android">Datenschutzerklärung, Abschnitt „Android-Fassung der Anwendung“</Link>.
            </p>
          </div>

          {/* ── Prüfwerte ────────────────────────────────────────────── */}
          <div className="legal-block">
            <h2>Prüfwerte (freiwillig)</h2>
            <p style={{ marginBottom: 16 }}>
              Wenn du die Datei vor der Installation prüfen möchtest, vergleiche sie mit den
              Werten unten. Die Werte stehen bewusst hier auf rholabs.de und nicht auf dem
              Download-Server.
            </p>
            <p className="legal-label">SHA-256 der APK</p>
            <p className="legal-mono" style={{ marginBottom: 16, ...HEX_STIL }}>
              {APK_SHA256}
            </p>
            <p className="legal-label">SHA-256-Fingerabdruck des Signaturzertifikats</p>
            <p className="legal-mono" style={{ marginBottom: 16, ...HEX_STIL }}>
              {CERT_SHA256}
            </p>
            <p className="note" style={{ display: 'block' }}>
              Unter Windows zeigt PowerShell den Hash mit <code>Get-FileHash &lt;Datei&gt;</code>.
              Den Zertifikat-Fingerabdruck zeigt <code>apksigner verify --print-certs &lt;Datei&gt;</code>{' '}
              aus dem Android-SDK.
            </p>
          </div>

          {/* Die Zweckbestimmung, wortgleich mit den übrigen Seiten. */}
          <div className="disclaimer">
            <span className="icon-box icon-box--sm icon-box--grey" aria-hidden="true">
              <Info size={17} />
            </span>
            <p>{ZWECKBESTIMMUNG}</p>
          </div>
        </div>

        <p className="note" style={{ display: 'block', marginTop: 28 }}>
          Fragen zur Installation an <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </>
  );
}
