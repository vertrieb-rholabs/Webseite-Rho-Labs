import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { CONTACT_EMAIL } from '../constants';

export default function Lizenzbedingungen() {
  return (
    <>
      <Seo
        path="/lizenzbedingungen"
        title="Lizenzbedingungen — Rho-Labs"
        description="Lizenzbedingungen für die Nutzung von Rho-Labs Kognitives Training."
      />

      <div className="wrap wrap--legal section--tight">
        <p className="eyebrow" style={{ marginBottom: 16 }}>
          Rechtliches
        </p>
        <h1 className="h-page" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', marginBottom: 20 }}>
          Lizenzbedingungen
        </h1>
        <p className="lede" style={{ marginBottom: 28 }}>
          {"Home-Lizenz für „Rho-Labs Kognitives Training“"}
        </p>

        <div className="stack">
        <div className="legal-block">
          <div className="stack" style={{ gap: 14 }}>
            <p>
{
        "Diese Bedingungen gelten für die Nutzung der Home-Lizenz der Software „Rho-Labs Kognitives Training“. Anbieter ist Rho-Labs, Einzelunternehmen, Inhaber Patrick Feix, Feldstraße 15, 99848 Wutha-Farnroda, Deutschland, E-Mail " +
        CONTACT_EMAIL +
        "."
      }
            </p>
            <p>{"Stand: 21. September 2026"}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Gegenstand der Lizenz</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Die Home-Lizenz betrifft die Windows-Anwendung „Rho-Labs Kognitives Training“ als digitalen Inhalt, der nicht auf einem körperlichen Datenträger überlassen wird. Sie erhalten die Anwendung als Download eines Installers und einen Lizenzschlüssel per E-Mail. Die Anwendung ist derzeit für Windows 10 und Windows 11 bestimmt."}</p>
            <p>{"Mit der Home-Lizenz räumen wir Ihnen ein einfaches Recht ein, die Anwendung in der Home-Ausstattung nach diesen Bedingungen zu nutzen. Das Urheberrecht an der Anwendung bleibt, soweit es uns zusteht, bei uns."}</p>
            <p>{"Die Software ist kein Medizinprodukt und kein zugelassenes Therapieinstrument im Sinne der Verordnung (EU) 2017/745 über Medizinprodukte (MDR). Sie dient ausschließlich dem allgemeinen kognitiven Training. Sie ersetzt keine ärztliche oder therapeutische Behandlung. Auswertungen sind keine medizinischen Diagnosen. Das beschreibt den Vertragsgegenstand."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Umfang der Nutzung und Anzahl der Geräte</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Die Home-Lizenz gilt für ein Gerät."}</p>
            <p>{"Sie schaltet frei: alle 25 Übungen, die Statistik, den Export der eigenen Daten und genau ein Profil."}</p>
            <p>{"Nicht enthalten sind der Mehrprofilbetrieb und Trainingsabläufe. Das sind Merkmale der gewerblichen Professional-Lizenz."}</p>
            <p>{"Die Home-Lizenz berechtigt zur Nutzung für das eigene kognitive Training. Die gewerbliche Nutzung mit Klienten ist nicht umfasst."}</p>
            <p>{"Zwingende gesetzliche Nutzungsbefugnisse, insbesondere nach den §§ 69d und 69e UrhG, bleiben unberührt."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Aktivierung und Gerätebindung</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Den Lizenzschlüssel erhalten Sie per E-Mail. Er ist mit dem Verfahren Ed25519 signiert und enthält eine Kennung der Lizenzstufe. Die Anwendung prüft die Signatur lokal."}</p>
            <p>{"Die Aktivierung läuft über einen von uns betriebenen Server und bindet die Lizenz an einen Fingerabdruck des Geräts. Aktiviert werden kann die Home-Lizenz auf einem Gerät."}</p>
            <p>{"Wechseln Sie das Gerät, tauschen Sie die Festplatte aus oder setzen Sie Windows neu auf, ändert sich der Fingerabdruck in der Regel. Die Lizenz endet dadurch nicht."}</p>
            <p>
{
        "Ein automatischer Weg, die Bindung in der Anwendung selbst auf das neue Gerät zu übertragen, besteht nicht. Schreiben Sie uns in diesem Fall an " +
        CONTACT_EMAIL +
        ". Wir binden die Lizenz auf Ihre Anfrage an das neue Gerät um. Sie dürfen die Anwendung auf dem bisherigen Gerät danach nicht weiter nutzen und haben sie dort zu entfernen."
      }
            </p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Aktualisierungen und Fehlerbehebungen</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Aktualisierungen stellen wir über GitHub Releases bereit. Bei kleinen Versionssprüngen lädt die Anwendung sie selbsttätig."}</p>
            <p>{"Wir sagen nicht zu, dass die Anwendung um neue Funktionen erweitert wird. Eine bestimmte Mindestdauer der Weiterentwicklung oder Pflege sagen wir nicht zu."}</p>
            <p>{"Gesetzliche Pflichten zur Aktualisierung, insbesondere nach § 327f BGB, bleiben unberührt. Zu den Aktualisierungen, die für den Erhalt der Vertragsmäßigkeit erforderlich sind, gehören auch Sicherheitsaktualisierungen."}</p>
            <p>{"Eine Aktualisierung, die wir Ihnen nach § 327f Absatz 1 BGB bereitstellen, haben Sie innerhalb einer angemessenen Frist zu installieren. Das ist eine Obliegenheit Ihrerseits. Für einen Produktmangel, der allein auf das Fehlen dieser Aktualisierung zurückgeht, haften wir nach § 327f Absatz 2 BGB nur dann nicht, wenn wir Sie über die Verfügbarkeit der Aktualisierung und über die Folgen einer unterlassenen Installation informiert haben und das Ausbleiben oder die unsachgemäße Installation nicht auf eine Ihnen bereitgestellte mangelhafte Installationsanleitung zurückgeht."}</p>
            <p>{"Mängel der Anwendung unterfallen der gesetzlichen Mängelhaftung nach Abschnitt 8."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Weitergabe und Untersagungen</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Die Home-Lizenz dürfen Sie als Ganzes auf eine andere Person übertragen. Dafür müssen Sie die Nutzung endgültig einstellen, die Anwendung von Ihrem Gerät entfernen und Ihre Kopie einschließlich des Lizenzschlüssels für sich unbrauchbar machen. Eine gleichzeitige Nutzung durch Sie und die erwerbende Person ist nicht erlaubt. Eine Aufspaltung der Lizenz ist nicht möglich."}</p>
            <p>
{
        "Ein automatischer Weg, die Gerätebindung auf die erwerbende Person umzustellen, besteht in der Anwendung nicht. Die erwerbende Person schreibt uns an " +
        CONTACT_EMAIL +
        ". Wir binden die Lizenz auf diese Anfrage an deren Gerät um. Diese Mitwirkung betrifft die technische Umbindung. Sie ist nicht Voraussetzung dafür, dass Sie die Lizenz veräußern dürfen."
      }
            </p>
            <p>{"Untersagt ist:"}</p>
            <ul>
              <li>{"die Umgehung der Lizenzprüfung,"}</li>
              <li>{"die Manipulation des Lizenzschlüssels,"}</li>
              <li>{"die Weitergabe des Schlüssels an Dritte, während Sie die Anwendung selbst weiter nutzen,"}</li>
              <li>{"die Vermietung der Anwendung,"}</li>
              <li>{"die gewerbliche Nutzung mit Klienten."}</li>
            </ul>
          </div>
        </div>
        <div className="legal-block">
          <h2>Bestandteile Dritter und Open-Source-Komponenten</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Die Anwendung enthält im Auslieferungsstand Bestandteile Dritter:"}</p>
            <ul>
              <li>{"Chart.js (MIT)"}</li>
              <li>{"jsPDF (MIT)"}</li>
              <li>{"qrcode (MIT)"}</li>
              <li>{"Electron (MIT); Electron enthält Chromium (BSD-3-Clause und weitere Lizenzen) und Node.js (MIT)"}</li>
              <li>{"electron-updater (MIT)"}</li>
              <li>{"semver (ISC)"}</li>
            </ul>
            <p>{"Für diese Bestandteile gelten die jeweiligen Open-Source-Lizenzen. Soweit deren zwingende Bedingungen von diesen Lizenzbedingungen abweichen, gehen sie für den betroffenen Bestandteil vor."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Laufzeit und Beendigung</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Die Home-Lizenz ist unbefristet. Es gibt kein Abonnement und keine wiederkehrende Zahlung. Ein Gerätewechsel beendet die Lizenz nicht."}</p>
            <p>{"Ihre Berechtigung endet, wenn Sie die Lizenz nach Abschnitt 5 übertragen, wenn der zugrunde liegende Vertrag rückabgewickelt wird oder wenn wir das Nutzungsrecht wegen einer erheblichen Pflichtverletzung beenden. Eine erhebliche Pflichtverletzung liegt insbesondere vor, wenn Sie die Lizenzprüfung umgehen, den Lizenzschlüssel manipulieren, den Schlüssel weitergeben und die Anwendung zugleich weiter nutzen oder die Anwendung gewerblich mit Klienten einsetzen. Soweit eine Abmahnung nicht entbehrlich ist, geht der Beendigung eine Abmahnung voraus."}</p>
            <p>{"Nach dem Ende der Berechtigung dürfen Sie die Anwendung nicht weiter nutzen und müssen sie von Ihrem Gerät entfernen."}</p>
            <p>{"Wenn Sie die Nutzung von sich aus einstellen, entsteht daraus kein Anspruch auf Rückzahlung. Unberührt bleiben das Widerrufsrecht und die gesetzlichen Mängelrechte."}</p>
          </div>
        </div>
        <div className="legal-block">
          <h2>Gewährleistung und Haftung</h2>
          <div className="stack" style={{ gap: 14 }}>
            <p>{"Es gilt die gesetzliche Mängelhaftung für digitale Produkte nach den §§ 327 ff. BGB. Gegenüber Verbrauchern kann sie nicht ausgeschlossen, beschränkt oder verkürzt werden."}</p>
            <p>{"Für die Haftung gelten die Allgemeinen Geschäftsbedingungen unter /agb. Diese Lizenzbedingungen enthalten keine eigene Haftungsregelung."}</p>
            <p>{"Die Einordnung der Software in Abschnitt 1 (kein Medizinprodukt, kein Therapieinstrument, keine Diagnose) beschreibt den Vertragsgegenstand. Sie ist kein Ausschluss der gesetzlichen Haftung, insbesondere nicht bei einer Verletzung von Leben, Körper oder Gesundheit."}</p>
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
