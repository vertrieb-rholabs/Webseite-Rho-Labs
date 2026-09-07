# Ergänzung: Demo-Schlüssel per Selbstbedienung

**Stand:** 3. September 2026

Die Serverseite ist **fertig, ausgerollt und getestet**. Was fehlt, ist die
Website: das Formular, drei neue Seiten und ein Absatz in der
Datenschutzerklärung. Diese Datei beschreibt genau das.

---

## Was sich für den Kunden ändert

**Bisher:** Auf `/kontakt` steht ein `mailto:`-Link „Kostenlose Demo anfragen".
Der Interessent schreibt in seinem Mailprogramm, jemand liest die Mail, legt von
Hand eine Bestellung an, dann erst geht der Schlüssel raus.

**Künftig:** Adresse ins Formular, bestätigen, Schlüssel ist da. Ohne
Zwischenschritt.

```
rholabs.de/kontakt
  Formular abschicken
        │
        ▼
POST https://fulfillment.rholabs.de/api/public/demo/anfordern
        │  prüft, merkt vor, schickt EINE Bestätigungsmail
        ▼
  303 → rholabs.de/demo/danke

Kunde klickt den Link in der Mail
        │
        ▼
GET  https://fulfillment.rholabs.de/api/public/demo/bestaetigen?token=…
        │  legt die Bestellung an, erzeugt den signierten Schlüssel, mailt ihn
        ▼
  303 → rholabs.de/demo/fertig
```

**Warum ein echtes `<form>` und kein `fetch`:** Ein `fetch` wäre ein
Cross-Origin-Aufruf und bräuchte passende CORS-Regeln; bei abgeschaltetem
JavaScript passierte gar nichts. Ein abgeschicktes Formular ist eine
Navigation — kein CORS nötig, kein JavaScript nötig. Der Server schickt den
Besucher per Weiterleitung auf die Website zurück; er merkt nicht, dass er
kurz woanders war.

---

## 1. Formular auf `/kontakt`

In `src/pages/ContactPage.tsx` den bisherigen `mailto:`-Knopf für die Demo
ersetzen. Der Rest der Seite bleibt.

```tsx
<form
  method="post"
  action="https://fulfillment.rholabs.de/api/public/demo/anfordern"
>
  <label htmlFor="demo-email">E-Mail-Adresse</label>
  <input
    id="demo-email"
    type="email"
    name="email"
    required
    autoComplete="email"
    placeholder="name@beispiel.de"
  />

  {/* Honigtopf gegen Bots: für Menschen unsichtbar, nicht per display:none
      (manche Bots erkennen das), sondern aus dem Sichtfeld geschoben.
      aria-hidden und tabIndex halten Vorleseprogramme und die Tastatur
      draußen. Das Feld heißt bewusst harmlos. */}
  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
    <label htmlFor="webseite">Webseite</label>
    <input id="webseite" type="text" name="webseite" tabIndex={-1} autoComplete="off" />
  </div>

  <label>
    <input type="checkbox" required />
    Ich bin einverstanden, dass meine E-Mail-Adresse zur Zusendung des
    Demo-Schlüssels verarbeitet wird. Näheres in der{' '}
    <Link to="/datenschutz">Datenschutzerklärung</Link>.
  </label>

  <button type="submit">Kostenlose Demo anfordern</button>
</form>
```

**Wichtig:**

- Das Feld muss `name="email"` heißen, das Honigtopf-Feld `name="webseite"`.
  Beides wertet der Server unter genau diesen Namen aus.
- Kein `enctype` setzen — die Voreinstellung
  (`application/x-www-form-urlencoded`) ist die richtige.
- Das Häkchen ist absichtlich **nicht** vorausgewählt. Eine vorausgewählte
  Einwilligung ist keine.
- Der Server antwortet **immer gleich**, egal ob die Adresse neu ist, schon
  eine Demo hat oder gesperrt wurde. Das ist Absicht: Sonst ließe sich über
  das Formular herausfinden, wer Kunde ist. Die Seite darf also nie
  behaupten, die Mail sei „sicher unterwegs" — sondern nur, dass sie
  unterwegs ist, *falls* die Adresse in Ordnung war.

---

## 2. Drei neue Seiten

In `src/App.tsx` als Routen ergänzen, damit `vite-react-ssg` sie statisch
erzeugt. Ohne diese Seiten läuft der Kunde nach dem Absenden in den 404.

| Pfad | Wann | Inhalt (Vorschlag) |
| --- | --- | --- |
| `/demo/danke/` | direkt nach dem Absenden | „Fast geschafft. Wir haben dir eine E-Mail geschickt. Klick auf den Link darin, dann bekommst du deinen Demo-Schlüssel. Der Link gilt 24 Stunden. Schau notfalls im Spam-Ordner nach." |
| `/demo/fertig/` | nach dem Klick in der Mail | „Dein Demo-Schlüssel ist unterwegs — in wenigen Augenblicken liegt er in deinem Postfach. Die Demo läuft 14 Tage und enthält den vollen Funktionsumfang. Den Schlüssel gibst du in der Anwendung unter *Lizenz* ein." |
| `/demo/link-abgelaufen/` | ungültiger oder alter Link | „Dieser Bestätigungslink ist abgelaufen oder wurde schon benutzt. Fordere die Demo einfach neu an." + Verweis auf `/kontakt/` |

**Solange diese drei Seiten fehlen, landet jeder Klick im 404** — der Server
leitet korrekt dorthin weiter, aber es liegt noch nichts da. Das ist beim
Testen am 3. September genau so aufgetreten und kein Fehler des Servers.
Gefährlich wird es erst, wenn das Formular auf der Website verlinkt ist, bevor
die Seiten stehen. **Erst die Seiten, dann das Formular verlinken.**

Die Ziele tragen einen **abschließenden Schrägstrich**, weil die Website so
gebaut ist (`/kontakt` antwortet mit 301 auf `/kontakt/`). Ohne ihn hinge an
jeder Weiterleitung eine zweite.

Auf `/demo/fertig` gehört ein Hinweis, wo man die Anwendung herunterlädt —
sonst hat der Kunde einen Schlüssel, aber kein Programm.

---

## 3. Datenschutzerklärung — das ist Pflicht

Du hattest recht: Ab jetzt werden personenbezogene Daten auf **unserem** Server
gespeichert, nicht nur per Mail ausgetauscht. Das gehört in
`src/pages/Privacy.tsx`. Vorschlag als eigener Abschnitt:

> ### Demo-Anfrage
>
> Wenn du über das Formular auf unserer Website eine kostenlose Demo
> anforderst, verarbeiten wir:
>
> - deine **E-Mail-Adresse**,
> - deine **IP-Adresse** zum Zeitpunkt der Anfrage,
> - den **Zeitpunkt** der Anfrage und der Bestätigung.
>
> **Zweck:** Zusendung des Demo-Schlüssels und Schutz vor missbräuchlicher
> Nutzung des Formulars (Versandmissbrauch, automatisierte Massenanfragen).
>
> **Rechtsgrundlage:** Art. 6 Abs. 1 lit. b DSGVO (Durchführung
> vorvertraglicher Maßnahmen auf deine Anfrage). Für die Speicherung der
> IP-Adresse zusätzlich Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes
> Interesse ist der Schutz unseres Systems und unseres E-Mail-Versands vor
> Missbrauch.
>
> **Doppelte Bestätigung:** Nach dem Absenden erhältst du zunächst nur eine
> E-Mail mit einem Bestätigungslink. Erst wenn du diesen Link anklickst,
> erzeugen wir den Demo-Schlüssel und senden ihn zu. Ohne Bestätigung
> geschieht nichts weiter. Dieses Verfahren stellt sicher, dass niemand
> fremde Adressen bei uns einträgt.
>
> **Speicherdauer:** Bestätigte Anfragen bewahren wir **ein Jahr** auf, weil
> je Adresse eine Demo pro Jahr vorgesehen ist. Unbestätigte Anfragen werden
> nach **24 Stunden** gegenstandslos und gelöscht. Der Bestätigungslink wird
> nicht im Klartext gespeichert, sondern nur als Prüfwert.
>
> **Empfänger:** Der Versand erfolgt über unseren E-Mail-Anbieter (siehe
> Abschnitt „E-Mail-Kommunikation"). Eine darüber hinausgehende Weitergabe
> findet nicht statt. Die Daten liegen auf unserem Server in Deutschland.
>
> **Kein Newsletter:** Die Demo-Anfrage ist keine Anmeldung zu Werbung. Wir
> verwenden deine Adresse ausschließlich für die Demo und die damit
> zusammenhängenden Nachrichten.

**Noch offen und getrennt zu klären:** Die Löschung nach einem Jahr passiert
zurzeit **nicht von selbst** — die Zeilen bleiben in der Datenbank stehen. Was
die Erklärung verspricht, muss die Technik auch tun. Entweder ergänzen wir eine
regelmäßige Löschung auf dem Server, oder der Text nennt eine andere Frist.
Ich empfehle die Löschung; sag Bescheid, dann baue ich sie ein.

---

## 4. Was auf der Website sonst noch angefasst werden sollte

- **`src/pages/ContactPage.tsx`:** Der bisherige `mailto:`-Text für die Demo
  kann ganz weg. Die übrigen Kontaktwege bleiben.
- **Verweise auf die Demo** (Landing Page, Produktseite): Wenn dort irgendwo
  „Demo anfragen" steht und auf `mailto:` zeigt, sollte das auf das Formular
  zeigen. Sonst gibt es zwei Wege, von denen einer weiter Handarbeit macht.
- **Bestellungen bleiben vorerst wie sie sind.** Einzel- und Team-Lizenz laufen
  weiter über `mailto:` mit vorausgefülltem Rechnungstext
  (`src/constants.ts`). Dasselbe Formularmuster würde auch dort funktionieren
  — aber erst, wenn die Demo eine Weile störungsfrei läuft. Bei der Demo
  fließt kein Geld; ein Fehler tut niemandem weh.

---

## 5. Was auf dem Server bereits läuft

Zum Nachlesen, falls jemand anders weiterarbeitet.

**Neu:** `src/main/demo.ts` (Endpunkte und Regeln),
`sendDemoConfirmationEmail` in `src/main/mailer.ts`, Tabelle `demo_requests`,
Einbindung in `src/main/server.ts`.

**Unverändert:** Schlüsselerzeugung, Signatur, Auslieferung und Mailversand.
Der neue Weg legt dieselbe Bestellung an wie das Dashboard und ruft dieselbe
Auslieferung auf. Jede Demo-Anfrage taucht deshalb im Dashboard als Bestellung
auf — nichts wird unsichtbar.

**Die Regeln:**

| | |
| --- | --- |
| Laufzeit | 14 Tage (unverändert) |
| Funktionsumfang | voll (Mehrfachprofile, Statistik, Export, Trainingsablauf) |
| Geräte | 1 |
| Wiederholung | eine Demo je Adresse und Jahr |
| Bestätigungslink | 24 Stunden gültig, nur als Prüfwert gespeichert |
| Ratenbegrenzung | 3 Anfragen je Stunde und Herkunft, 40 je Stunde insgesamt |

**Abgesichert gegen:** Versandmissbrauch (doppelte Bestätigung), Einschleusen
von Mail-Kopfzeilen (strenge Adressprüfung ohne Steuerzeichen), Bots
(Honigtopf), Ausspähen des Kundenstamms (immer dieselbe Antwort), offene
Weiterleitung (Ziele fest verdrahtet), Erraten von Links (32 Byte Zufall, nur
als Hash gespeichert), Datenbank-Einschleusung (ausschließlich vorbereitete
Anweisungen).

**Geprüft am 3. September 2026:** ungültige Adresse, gefüllter Honigtopf,
erfundener Link, Link mit Sonderzeichen, vollständiger Durchstich (Anfrage →
Bestätigungsmail → Klick → Bestellung #36 → Schlüssel `f068bc36` → Demo-Mail),
zweiter Klick auf denselben Link (kein zweiter Schlüssel), erneute Anfrage
derselben Adresse (Jahressperre greift). Bestehende Endpunkte danach
unverändert: Admin ohne Zugang 401, Aktivierung 400, Oberfläche 200.

---

## 6. Ein Fund am Rande — dringender als das hier

Beim Prüfen ist etwas aufgefallen, das **nichts mit der Demo zu tun hat** und
schon länger so ist:

**Die Fulfillment-Anwendung ist über `http://162.55.219.1:3080` offen aus dem
Internet erreichbar — unverschlüsselt.** Das ist dieselbe Anwendung, die unter
`https://fulfillment.rholabs.de` läuft, nur ohne TLS. Wer sich dort am
Dashboard anmeldet, überträgt Benutzername und Passwort im Klartext; wer
mitliest, hat vollen Zugriff auf Bestellungen, Kundendaten und die
Schlüsselvergabe.

Behoben ist das mit einer Zeile — den Port in der Firewall schließen:

```
ufw delete allow 3080/tcp
```

Über `https://fulfillment.rholabs.de` bleibt alles erreichbar, verschlüsselt.
**Ich habe das nicht selbst gemacht**, weil ich nicht weiß, ob du den Port
irgendwo eingetragen hast. Prüf das kurz, dann sollte er zu.
