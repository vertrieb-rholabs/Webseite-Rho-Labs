import { Download, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import {
  ANDROID_SYSTEM_REQUIREMENTS,
  ANDROID_VERSION,
  CONTACT_EMAIL,
  ZWECKBESTIMMUNG,
} from '../constants';

/* ── PLATZHALTER: vor der Freigabe ersetzen ──────────────────────────────────
   APK_SHA256 steht absichtlich als {{APK_SHA256}} im ausgelieferten HTML, damit
   eine unfertige Seite sofort auffällt. Eingesetzt wird der Wert erst nach der
   Freigabe und dem Nachweis von `scripts/android-publish.sh promote` im
   App-Repo (Ausgabe von promote). Der Link zeigt dann auf eine Datei, die
   wirklich öffentlich liegt.

     APK_DATEI    rholabs-kognitives-training-<versionName>-<versionCode>.apk
     APK_SHA256   SHA-256 der APK                       (PLATZHALTER)
     CERT_SHA256  SHA-256-Fingerabdruck des Signaturzertifikats
                  (apksigner verify --print-certs)

   Die Version steht in ANDROID_VERSION (constants.ts); sie wird auch auf der
   Produktseite genannt. Die Prüfwerte stehen hier auf rholabs.de (GitHub
   Pages), getrennt vom Download-Server. Das Prüfen ist freiwillig (Plan R-85).
   -------------------------------------------------------------------------- */
const APK_DATEI = 'rholabs-kognitives-training-1.10.3-10100005.apk';
const APK_SHA256 = '{{APK_SHA256}}';
const CERT_SHA256 = '7B:28:D0:38:91:34:DC:DB:B9:5C:22:C1:33:C6:DF:B5:75:DD:F6:E9:13:71:65:16:8F:57:9A:55:D3:B0:C6:87';

const DOWNLOAD_URL = `https://download.rholabs.de/android/${APK_DATEI}`;

/** Lange Hex-Werte dürfen auf schmalen Bildschirmen umbrechen. */
const HEX_STIL = { overflowWrap: 'anywhere' as const, wordBreak: 'break-all' as const };

/**
 * Öffentliche Android-Seite (S2 des Android-Plans, erstes öffentliches
 * Release 1.10.3). Indexierbar und in der Sitemap. Die versteckte
 * Pilotseite /android-pilot/ bleibt daneben bestehen (Version 1.10.2).
 */
export default function Android() {
  return (
    <>
      <Seo
        path="/android/"
        title="Android-Fassung — Rho-Labs Kognitives Training"
        description="Rho-Labs Kognitives Training für Android-Tablets: Download der Installationsdatei, Systemanforderungen, Installation, Lizenz und Prüfwerte."
      />

      <div className="wrap wrap--legal section--tight">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Rho-Labs Kognitives Training · Android
        </p>
        <h1 className="h-page" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: 20 }}>
          Android-Fassung
        </h1>
        <p className="lede" style={{ marginBottom: 28 }}>
          Rho-Labs Kognitives Training gibt es auch für Android, empfohlen für Tablets. Du lädst
          die Installationsdatei (APK) von dieser Seite herunter und installierst sie selbst.
          Die Windows-Anwendung findest du unter{' '}
          <Link to="/kognitives-training/">Kognitives Training</Link>.
        </p>

        <div className="stack">
          {/* ── Download ─────────────────────────────────────────────── */}
          <div className="legal-block">
            <h2>Download</h2>
            <p style={{ marginBottom: 18 }}>
              Version <span className="legal-mono">{ANDROID_VERSION}</span>. Öffne diese Seite auf
              dem Tablet in Chrome und tippe auf den Knopf.
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
              <li>{ANDROID_SYSTEM_REQUIREMENTS[0]}.</li>
              <li>
                {ANDROID_SYSTEM_REQUIREMENTS[1]}. Die App prüft das beim Start. Die Version
                findest du unter Einstellungen › Apps › Android System WebView.
              </li>
              <li>Empfohlen ist ein Tablet, am besten ab etwa 10 Zoll.</li>
              <li>
                Internet braucht die App für die Aktivierung, die Prüfung der Lizenz und die Suche
                nach neuen Versionen. Auch neue Versionen lädst du über das Internet.
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
          </div>

          {/* ── Updates ──────────────────────────────────────────────── */}
          <div className="legal-block">
            <h2>Updates</h2>
            <p>
              Die App prüft selbst auf neue Versionen, lädt eine neue Version vorab herunter
              (derzeit etwa 13 MB; über mobiles Internet zählt das zum Datenvolumen) und bietet
              sie dir dann zur Installation an. Du bestätigst die Installation. Beim ersten Update fragt
              Android, ob die App Apps installieren darf. Auf manchen Geräten schließt Android die App
              nach dem Erlauben. Öffne sie dann einfach wieder, das Update wird dir erneut angeboten.
              Neue Versionen findest du außerdem auf dieser Seite:
              Lade die neue Datei wie oben herunter und installiere sie über die vorhandene App.
              Deinstalliere die App vorher nicht, sonst löscht Android ihre Daten.
            </p>
            <p style={{ marginTop: 14 }}>
              Installiere neue Versionen bald, vor allem wenn sie Sicherheitskorrekturen
              enthalten. Wenn du ein Update ablehnst oder offline bist, bleibt die bisherige
              Version nutzbar, und die App bietet es dir später erneut an.
            </p>
          </div>

          {/* ── Lizenz ───────────────────────────────────────────────── */}
          <div className="legal-block">
            <h2>Lizenz</h2>
            <ul>
              <li>
                Die App läuft mit einer <strong>Demo-Lizenz</strong> (14 Tage) oder mit einer
                gekauften Lizenz.
              </li>
              <li>
                Der Lizenzschlüssel ist derselbe wie für die Windows-Anwendung. Die Geräteplätze
                einer Lizenz gelten gemeinsam für Windows und Android. Die Home-Lizenz gilt für
                ein Gerät, einen Windows-PC oder ein Android-Gerät. Unter Android zählt jedes
                Nutzerprofil, in dem du die App aktivierst, als eigenes Gerät.
              </li>
              <li>
                Für Lizenz und Kauf gelten die <Link to="/agb/">AGB</Link> und die{' '}
                <Link to="/lizenzbedingungen/">Lizenzbedingungen</Link>.
              </li>
              <li>
                Eine Demo kannst du über die <Link to="/kontakt/">Kontaktseite</Link> anfordern.
                Informationen zu Lizenzen und Preisen findest du unter{' '}
                <Link to="/kognitives-training/#lizenzen">Kognitives Training</Link> und{' '}
                <Link to="/home/">Für zu Hause</Link>.
              </li>
            </ul>
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
                Die Android-Sicherung über Google und der Umzug auf ein neues Gerät sind für die
                App abgeschaltet.
              </li>
            </ul>
            <p style={{ marginTop: 16 }}>
              Was die App an unseren Lizenzdienst sendet und wie lange wir es speichern, steht in
              der{' '}
              <Link to="/datenschutz/#android">Datenschutzerklärung, Abschnitt „Android-Fassung der Anwendung“</Link>.
            </p>
          </div>

          {/* ── Hinweis zu Google (Transparenz, § 5a UWG; Wortlaut F2b Abschnitt 3) ── */}
          <div className="legal-block">
            <h2>Hinweis zu Google</h2>
            <p>
              Google verlangt künftig, dass sich Entwickler von Android-Apps registrieren, und will
              das ab 2027 auf zertifizierten Geräten weltweit einführen. Apps nicht registrierter
              Entwickler lassen sich dann nur noch über einen zusätzlichen Freischaltweg
              installieren und aktualisieren. Rho-Labs bereitet die Registrierung vor.
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
