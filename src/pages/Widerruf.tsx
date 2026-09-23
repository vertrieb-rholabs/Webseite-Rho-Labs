import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import {
  CONTACT_EMAIL,
  KONTAKT_TELEFON,
  SITE_URL,
  WIDERRUF_FUNKTION_LABEL,
  WIDERRUF_FUNKTION_PFAD,
} from '../constants';

export default function Widerruf() {
  return (
    <>
      <Seo
        path="/widerruf"
        title="Widerrufsbelehrung — Rho-Labs"
        description="Widerrufsbelehrung für Verbraucher beim Kauf von Rho-Labs Kognitives Training."
      />

      <div className="wrap wrap--legal section--tight">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Rechtliches
        </p>
        <h1 className="h-page" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: 20 }}>
          Widerrufsbelehrung
        </h1>
        <p className="lede" style={{ marginBottom: 20 }}>
          {"Für Verbraucher beim Kauf der Home-Version. Verkäufer ist Rho-Labs, Inhaber Patrick Feix, Feldstraße 15, 99848 Wutha-Farnroda."}
        </p>

        {/* Diese Seite BELEHRT. Wer hierher findet, will aber oft AUSÜBEN —
            und soll dann nicht erst den Mustertext nach der Adresse absuchen
            müssen. § 356a Abs. 1 Satz 3 verlangt ohnehin leichte
            Zugänglichkeit. Der Satz im Mustertext unten bleibt davon
            unberührt: er ist der amtliche Baustein und trägt die
            Gesetzlichkeitsfiktion, dieser Hinweis hier ist nur der kurze Weg
            dorthin. */}
        <p className="widerruf-hinweis" style={{ marginBottom: 28 }}>
          Sie möchten Ihren Vertrag jetzt widerrufen?{' '}
          <Link to={WIDERRUF_FUNKTION_PFAD}>{WIDERRUF_FUNKTION_LABEL}</Link>
        </p>

        <div className="stack">
        <div className="legal-block">
          <h2>Widerrufsrecht</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen."}</p>
            <p>{"Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses."}</p>
            <p>
{
        "Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Rho-Labs, Einzelunternehmen, Inhaber: Patrick Feix, Feldstraße 15, 99848 Wutha-Farnroda, Deutschland, Telefon: " +
        KONTAKT_TELEFON +
        ", E-Mail: " +
        CONTACT_EMAIL +
        ") mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist."
      }
            </p>
            {/* AMTLICHER Gestaltungshinweis der Anlage 1 zu Art. 246a § 1
                Abs. 2 EGBGB für die Widerrufsfunktion nach § 356a BGB. Er
                lautet dort: „Wenn Sie dazu verpflichtet sind, eine Funktion
                bereitzustellen, mit der der Verbraucher den online
                geschlossenen Vertrag widerrufen kann, fügen Sie Folgendes
                ein: ‚Sie können Ihr Widerrufsrecht auch online unter …
                [Internetadresse oder anderen geeigneten Hinweis darüber
                eingeben, wo die Widerrufsfunktion verfügbar ist] ausüben. …‘"

                Er ist ein Baustein DES MUSTERS und gehört deshalb HINEIN und
                nicht daneben — dann bleibt die Gesetzlichkeitsfiktion des
                Art. 246a § 1 Abs. 2 Satz 2 EGBGB erhalten. Der Klammerzusatz
                deckt die PLATZIERUNG bereits mit ab; ein selbst formulierter
                Zusatzsatz daneben wäre das Risiko, nicht die Absicherung.

                Der Wortlaut steht zeichengleich in `seite-widerruf.md` und in
                `rechtstexte.ts` des Auslieferungsdienstes, der ihn in die
                Vertragsbestätigung nach § 312f BGB schreibt. Alle drei
                Stellen müssen gleich lauten; wer eine ändert, ändert einen
                abgenommenen Rechtstext. */}
            <p>
{
        "Sie können Ihr Widerrufsrecht auch online unter " +
        SITE_URL + WIDERRUF_FUNKTION_PFAD +
        " ausüben. Wenn Sie diese Online-Funktion nutzen, übermitteln wir Ihnen auf einem dauerhaften Datenträger (z. B. durch eine E-Mail) unverzüglich eine Eingangsbestätigung mit Informationen zum Inhalt der Widerrufserklärung sowie dem Datum und der Uhrzeit ihres Eingangs."
      }
            </p>
            <p>{"Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Folgen des Widerrufs</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Vorzeitiges Erlöschen des Widerrufsrechts bei digitalen Inhalten</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Bei einem Vertrag über digitale Inhalte, die nicht auf einem körperlichen Datenträger geliefert werden, beginnt die Widerrufsfrist mit dem Vertragsschluss (§ 356 Absatz 2 Nummer 2 BGB)."}</p>
            <p>{"Ihr Widerrufsrecht erlischt vorzeitig, wenn alle folgenden Voraussetzungen erfüllt sind (§ 356 Absatz 6 Nummer 2 BGB):"}</p>
            <ol>
              <li>{"Wir haben mit der Vertragserfüllung begonnen."}</li>
              <li>{"Sie haben ausdrücklich zugestimmt, dass wir vor Ablauf der Widerrufsfrist damit beginnen."}</li>
              <li>{"Sie haben bestätigt, dass Sie dadurch Ihr Widerrufsrecht verlieren."}</li>
              <li>{"Wir haben Ihnen eine Bestätigung des Vertrags nach § 312f BGB auf einem dauerhaften Datenträger zur Verfügung gestellt."}</li>
            </ol>
            <p>{"Ihre Zustimmung und Ihre Kenntnisbestätigung nach den Nummern 2 und 3 geben Sie beim Kauf mit dem zweiten Pflichtfeld ab. Es lautet:"}</p>
            <blockquote>
              <p>{"„Ich verlange ausdrücklich, dass Sie mit der Bereitstellung der Software vor Ablauf der Widerrufsfrist beginnen. Mir ist bekannt, dass ich mit Beginn der Bereitstellung mein Widerrufsrecht verliere.\""}</p>
            </blockquote>
            <p>{"Die Bestätigung nach Nummer 4 erhalten Sie zusammen mit Ihrem Lizenzschlüssel per E-Mail. Beginn der Vertragserfüllung ist der Versand des Lizenzschlüssels."}</p>
            <p>{"Solange nicht alle vier Voraussetzungen vorliegen, bleibt Ihr Widerrufsrecht bestehen."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Muster-Widerrufsformular</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)"}</p>
            <ul>
              <li>
{
        "An Rho-Labs, Einzelunternehmen, Inhaber: Patrick Feix, Feldstraße 15, 99848 Wutha-Farnroda, Deutschland, E-Mail: " +
        CONTACT_EMAIL +
        ":"
      }
              </li>
              <li>{"Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)"}</li>
              <li>{"Bestellt am (*)/erhalten am (*)"}</li>
              <li>{"Name des/der Verbraucher(s)"}</li>
              <li>{"Anschrift des/der Verbraucher(s)"}</li>
              <li>{"Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)"}</li>
              <li>{"Datum"}</li>
            </ul>
            <p>{"(*) Unzutreffendes streichen."}</p>
          </div>
        </div>
        </div>

        <p className="note" style={{ display: 'block', marginTop: 28 }}>
          Anbieterangaben im <Link to="/impressum">Impressum</Link>. Die
          Vertragsbedingungen stehen in den <Link to="/agb">AGB</Link>.
        </p>
      </div>
    </>
  );
}
