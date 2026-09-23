import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { CONTACT_EMAIL, KONTAKT_TELEFON } from '../constants';

export default function Agb() {
  return (
    <>
      <Seo
        path="/agb"
        title="Allgemeine Geschäftsbedingungen — Rho-Labs"
        description="Allgemeine Geschäftsbedingungen für den Kauf von Rho-Labs Kognitives Training."
      />

      <div className="wrap wrap--legal section--tight">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Rechtliches
        </p>
        <h1 className="h-page" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: 20 }}>
          Allgemeine Geschäftsbedingungen
        </h1>
        <p className="lede" style={{ marginBottom: 28 }}>
          {"für den Erwerb der Home-Lizenz von „Rho-Labs Kognitives Training“ über die Website rholabs.de."}
        </p>

        <div className="stack">
        <div className="legal-block">
          <h2>Geltungsbereich</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Diese Allgemeinen Geschäftsbedingungen gelten für Verträge über die Home-Lizenz der Software „Rho-Labs Kognitives Training“, die über die Website rholabs.de mit uns geschlossen werden."}</p>
            <p>{"Sie richten sich an Verbraucher im Sinne des § 13 BGB, also an natürliche Personen, die den Vertrag zu Zwecken abschließen, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können."}</p>
            <p>{"Es gilt die Fassung dieser Bedingungen, die auf der Website bereitsteht, wenn Sie die Bestellung absenden. Abweichende Bedingungen von Ihrer Seite werden nicht Vertragsinhalt."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Vertragspartner und Vertragsgegenstand</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>
{
        "Ihr Vertragspartner ist Rho-Labs, Einzelunternehmen, Inhaber Patrick Feix, Feldstraße 15, 99848 Wutha-Farnroda, Deutschland, Telefon: " +
        KONTAKT_TELEFON +
        ", E-Mail: " +
        CONTACT_EMAIL +
        " (im Folgenden: der Anbieter oder wir)."
      }
            </p>
            <p>{"Vertragsgegenstand ist die Home-Lizenz der Software „Rho-Labs Kognitives Training“. Es handelt sich um digitale Inhalte, die nicht auf einem körperlichen Datenträger geliefert werden: den Download einer Windows-Anwendung und einen Lizenzschlüssel per E-Mail. Es wird keine Ware versendet."}</p>
            <p>{"Die Home-Lizenz umfasst alle 25 Übungen, Statistik, den Export der eigenen Daten und genau ein Profil. Nicht enthalten sind Mehrprofilbetrieb und Trainingsabläufe."}</p>
            <p>{"Die Nutzung ist unbefristet. Es handelt sich nicht um ein Abonnement."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Zustandekommen des Vertrages</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Die Angaben auf der Seite /home (Preis, Leistung, Anbieter) sind unverbindlich. Sie sind eine Aufforderung an Sie, ein Angebot abzugeben."}</p>
            <p>{"Der Vertrag kommt in folgendem Ablauf zustande:"}</p>
            <ol>
              <li>{"Sie öffnen die Seite /home. Dort stehen Preis, Leistung und Anbieter. Rufen Sie die Seite über den Vorteilslink einer Einrichtung auf, wird 35,90 € statt 39,90 € angezeigt."}</li>
              <li>
                {"Sie tragen Ihren Namen und Ihre E-Mail-Adresse ein und setzen die folgenden beiden Häkchen. Beide sind Pflicht:"}
                <ul>
                  <li>{"„Ich habe die Allgemeinen Geschäftsbedingungen und die Lizenzbedingungen gelesen und stimme ihnen zu.“"}</li>
                  <li>{"„Ich verlange ausdrücklich, dass Sie mit der Bereitstellung der Software vor Ablauf der Widerrufsfrist beginnen. Mir ist bekannt, dass ich mit Beginn der Bereitstellung mein Widerrufsrecht verliere.“"}</li>
                </ul>
              </li>
              <li>{"Sie klicken auf die Schaltfläche „Zahlungspflichtig bestellen“. Damit geben Sie ein verbindliches Angebot zum Abschluss eines Vertrages über die Home-Lizenz zum auf der Seite /home angezeigten Preis ab. Bis zu diesem Klick können Sie Eingaben in den Formularfeldern erkennen und berichtigen."}</li>
              <li>{"Sie werden zu PayPal weitergeleitet und geben dort die Zahlung frei."}</li>
              <li>{"Der Vertrag kommt zustande, sobald wir den Betrag über PayPal erfolgreich einziehen. In diesem Einzug liegt unsere Annahme Ihres Angebots. Kommt die PayPal-Zahlung nicht zustande, kommt kein Vertrag zustande."}</li>
              <li>{"Nach dem Zahlungseingang senden wir Ihnen den Lizenzschlüssel und die Rechnung per E-Mail an die von Ihnen angegebene Adresse."}</li>
            </ol>
          </div>
        </div>
        <div className="legal-block">
          <h2>Preise und Zahlung</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Der Preis der Home-Lizenz beträgt 39,90 €. Über den Vorteilslink einer Einrichtung beträgt er 35,90 €. Maßgeblich ist der Preis, der auf der Seite /home angezeigt wird, bevor Sie auf „Zahlungspflichtig bestellen“ klicken."}</p>
            <p>{"Der Preis ist ein einmaliger Endpreis. Es entstehen keine Folgekosten und keine Versandkosten."}</p>
            <p>{"Der Anbieter ist Kleinunternehmer im Sinne des § 19 UStG. Es wird keine Umsatzsteuer berechnet und keine Umsatzsteuer ausgewiesen."}</p>
            <p>{"Die Zahlung erfolgt ausschließlich über PayPal, durch den Einzug nach Abschnitt 3."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Bereitstellung der Software und des Lizenzschlüssels</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Wir stellen die Software unverzüglich nach dem erfolgreichen Zahlungseingang bereit. Das ist der Termin der Leistung. Die Bereitstellung erfolgt als Download der Windows-Anwendung (Installer im Format .exe) und durch Übersendung des Lizenzschlüssels per E-Mail."}</p>
            <p>{"Kompatibel ist die Software derzeit nur mit Windows 10 und Windows 11."}</p>
            <p>{"Die Home-Lizenz wird über einen Server des Anbieters aktiviert und an den Fingerabdruck eines Geräts gebunden. Die Aktivierung und die Gerätebindung sind technische Schutzmaßnahmen."}</p>
            <p>{"Beginn der Bereitstellung im Rechtssinne ist der Versand des Lizenzschlüssels per E-Mail."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Widerrufsrecht</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Als Verbraucher haben Sie ein gesetzliches Widerrufsrecht. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsschlusses (§ 356 Absatz 2 Nummer 2 BGB)."}</p>
            <p>{"Ihr Widerrufsrecht erlischt vorzeitig, wenn alle folgenden Voraussetzungen erfüllt sind (§ 356 Absatz 6 Nummer 2 BGB):"}</p>
            <ol>
              <li>{"Wir haben mit der Vertragserfüllung begonnen."}</li>
              <li>{"Sie haben ausdrücklich zugestimmt, dass wir vor Ablauf der Widerrufsfrist damit beginnen."}</li>
              <li>{"Sie haben bestätigt, dass Sie dadurch Ihr Widerrufsrecht verlieren."}</li>
              <li>{"Wir haben Ihnen eine Bestätigung des Vertrags nach § 312f BGB auf einem dauerhaften Datenträger zur Verfügung gestellt."}</li>
            </ol>
            <p>{"Zustimmung und Kenntnisbestätigung nach den Nummern 2 und 3 geben Sie mit dem zweiten Pflicht-Häkchen im Bestellformular ab. Beginn der Vertragserfüllung ist der Versand des Lizenzschlüssels per E-Mail."}</p>
            <p>{"Solange nicht alle vier Voraussetzungen vorliegen, bleibt Ihr Widerrufsrecht bestehen."}</p>
            <p>{"Die Widerrufsbelehrung und das Muster-Widerrufsformular stehen unter /widerruf. Sie werden in diesen AGB nicht wiederholt."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Nutzungsrechte</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Mit der Bereitstellung des Lizenzschlüssels räumen wir Ihnen die Nutzungsrechte ein, die in den Lizenzbedingungen beschrieben sind. Die Home-Lizenz gilt für ein Gerät."}</p>
            <p>{"Die Einzelheiten — einschließlich Aktivierung, Gerätebindung, Weitergabe und Aktualisierungen — stehen ausschließlich in den Lizenzbedingungen unter /lizenzbedingungen. Diese AGB enthalten keine abweichende Nutzungsregelung."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Gewährleistung</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Für die digitalen Produkte besteht das gesetzliche Mängelhaftungsrecht. Es gilt die gesetzliche Mängelhaftung nach den §§ 327 ff. BGB."}</p>
            <p>{"Dazu gehört die Pflicht, Ihnen die Aktualisierungen bereitzustellen, die für den Erhalt der Vertragsmäßigkeit der Software erforderlich sind, und Sie über diese Aktualisierungen zu informieren. Zu den erforderlichen Aktualisierungen gehören auch Sicherheitsaktualisierungen. Bei diesem einmaligen Erwerb besteht die Pflicht für den Zeitraum, den Sie aufgrund der Art und des Zwecks der Software und unter Berücksichtigung der Umstände und der Art des Vertrags erwarten können (§ 327f Absatz 1 BGB)."}</p>
            <p>{"Unterlassen Sie die Installation einer bereitgestellten Aktualisierung innerhalb angemessener Frist, haftet der Anbieter für einen Mangel, der allein auf das Fehlen dieser Aktualisierung zurückzuführen ist, nur dann nicht, wenn zwei Voraussetzungen erfüllt sind (§ 327f Absatz 2 BGB). Erstens: Der Anbieter hat Sie über die Verfügbarkeit der Aktualisierung und über die Folgen einer unterlassenen Installation informiert. Zweitens: Dass Sie die Aktualisierung nicht oder unsachgemäß installiert haben, beruht nicht auf einer Ihnen bereitgestellten mangelhaften Installationsanleitung."}</p>
            <p>{"Diese Rechte können Ihnen als Verbraucher nicht zum Nachteil abbedungen werden. Eine Verkürzung oder ein Ausschluss der Mängelhaftung ist in diesen AGB nicht vereinbart."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Haftung</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Der Anbieter haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit sowie bei der Verletzung von Leben, Körper oder Gesundheit. Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt."}</p>
            <p>{"Bei einfacher Fahrlässigkeit haftet der Anbieter nur für die Verletzung von Pflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung Sie regelmäßig vertrauen dürfen (Kardinalpflichten). In diesem Fall ist die Haftung der Höhe nach auf den vertragstypischen, vorhersehbaren Schaden begrenzt."}</p>
            <p>{"Im Übrigen ist die Haftung ausgeschlossen. Die vorstehenden Regelungen gelten auch für gesetzliche Vertreter und Erfüllungsgehilfen des Anbieters."}</p>
            <p>{"Die Software ist kein Medizinprodukt und kein zugelassenes Therapieinstrument im Sinne der Verordnung (EU) 2017/745 (MDR). Sie dient ausschließlich dem allgemeinen kognitiven Training. Sie ersetzt keine ärztliche oder therapeutische Behandlung. Auswertungen sind keine medizinischen Diagnosen. Dieser Absatz bestimmt den Vertragsgegenstand. Er schränkt die Haftung für Verletzungen von Leben, Körper oder Gesundheit nicht ein."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Streitbeilegung</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Der Anbieter ist nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Schlussbestimmungen</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Vertragssprache ist Deutsch."}</p>
            <p>{"Es wird kein Gerichtsstand vereinbart."}</p>
            <p>{"Es wird keine Rechtswahl getroffen."}</p>
          </div>
        </div>
        </div>

        <p className="note" style={{ display: 'block', marginTop: 28 }}>
          Anbieterangaben im <Link to="/impressum">Impressum</Link>. Zur
          Verarbeitung personenbezogener Daten siehe{' '}<Link to="/datenschutz">Datenschutzerklärung</Link>.
        </p>
      </div>
    </>
  );
}
