# Anmerkungen zu Impressum und Datenschutzerklärung

**Stand:** 2. September 2026
**Geprüft:** https://rholabs.de/impressum und https://rholabs.de/datenschutz, jeweils
gegen den Quelltext der Anwendung Gedächtnistraining (`main.js`) und den
Aktivierungsdienst auf dem Server (`/opt/rholabs-fulfillment`).

> Ich bin kein Anwalt. Die Punkte unten sind belegte Abweichungen zwischen dem, was
> auf der Webseite steht, und dem, was die Software tatsächlich tut — plus zwei
> Pflichtangaben, die fehlen. Was daraus folgt, gehört anwaltlich beurteilt.

---

## 1. „Anonymisiert" trifft nicht zu — es ist pseudonym

**Auf der Seite steht:** „Eine anonymisierte Gerätekennung (Hardware-Fingerprint als
SHA-256-Hash)".

**Was die Software tut** (`generateHardwareFingerprint()` in `main.js`): Sie bildet
einen SHA-256-Hash aus Rechnername, Prozessormodell, Arbeitsspeichergröße,
Betriebssystem, **Benutzername** und Prozessorarchitektur.

**Warum das nicht anonym ist:** Der Wert ist für dasselbe Gerät immer derselbe — das
ist sein Zweck, denn er dient dazu, das Gerät bei jeder Aktivierung wiederzuerkennen
und die Gerätezahl je Lizenz durchzusetzen. Ein Merkmal, das eine Wiedererkennung
ermöglicht, ist **pseudonym**, nicht anonym. Anonym wäre es nur, wenn ein
Personenbezug nicht mehr herstellbar wäre; pseudonyme Daten bleiben personenbezogene
Daten.

Hinzu kommt: Zwei der sechs Eingangswerte — Rechnername und Benutzername — sind
üblicherweise Klarnamen („DESKTOP-PATRICK", „pfeix").

**Vorschlag:** „anonymisierte" durch „pseudonyme" ersetzen. Der Satz bleibt sonst
richtig, und die Zusicherung, dass die Ausgangswerte das Gerät nicht verlassen, ist
zutreffend und einen eigenen Satz wert — das ist ein echtes Datenschutzargument.

## 2. Die Rechtsgrundlage fehlt

Die Erklärung nennt Zwecke, aber **keine Rechtsgrundlage** für irgendeine
Verarbeitung.

Artikel 13 Absatz 1 Buchstabe c DSGVO verlangt ausdrücklich, dass bei der Erhebung
mitgeteilt werden: *„the purposes of the processing for which the personal data are
intended **as well as the legal basis for the processing**"*.

Für die Aktivierung liegt **Artikel 6 Absatz 1 Buchstabe b** nahe (Erfüllung des
Vertrages — ohne Aktivierung kann die Lizenz nicht bereitgestellt und die vereinbarte
Gerätezahl nicht eingehalten werden). Das ist eine Einschätzung, keine Festlegung.

## 3. Weitere Pflichtangaben, die ich nicht gefunden habe

Artikel 13 Absatz 2 DSGVO verlangt zusätzlich:

- **Speicherdauer** oder die Kriterien für ihre Festlegung (Buchstabe a) — wie lange
  werden Hashwert und Aktivierungsdatensatz aufbewahrt?
- **Betroffenenrechte**: Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch,
  Datenübertragbarkeit (Buchstabe b).
- **Beschwerderecht bei einer Aufsichtsbehörde** (Buchstabe d) — für Thüringen der
  Thüringer Landesbeauftragte für den Datenschutz und die Informationsfreiheit.
- Ob die Bereitstellung der Daten **erforderlich** ist und was passiert, wenn sie
  unterbleibt (Buchstabe e) — hier: ohne Aktivierung keine Nutzung.

Bitte prüfen, ob diese Punkte an anderer Stelle der Seite stehen und mir nur nicht
aufgefallen sind.

## 4. Impressum — inhaltlich stimmig, eine Angabe fehlt

Gefunden und übernommen: Rho-Labs – Einzelunternehmen, Inhaber Patrick Feix,
Feldstraße 15, 99848 Wutha-Farnroda, kontakt.rholabs@gmail.com,
USt-IdNr. DE461250542.

**Keine Telefonnummer angegeben.** § 5 Absatz 1 Nummer 2 DDG verlangt Angaben, die
eine **unmittelbare und effiziente Kontaktaufnahme** ermöglichen. Der EuGH hat
entschieden, dass ein Telefon nicht zwingend ist, wenn ein anderer unmittelbarer Weg
besteht (Rechtssache C-298/07, *deutsche internet versicherung*) — eine E-Mail-Adresse
plus ein zweiter zügiger Rückkanal genügt in der Regel. Da hier nur eine
E-Mail-Adresse steht, wäre ein zweiter Weg (Rückrufformular oder Telefon) die sichere
Seite. **Ohne Gewähr, das gehört geprüft.**

## 5. Tarife: ein Fehler gefunden und behoben, einer bleibt offen

Kein Webseiten-Punkt, aber beim Nachsehen der Gerätezahlen aufgefallen.

### Behoben am 2. September 2026

**Enterprise-Schlüssel schalteten keine einzige Funktion frei.** Der
Aktivierungsdienst stellt sie mit dem Tarifcode `ent` aus (`TIER_CODES` in
`keygen.ts`). Die Anwendung kannte in ihrer `TIER_MAP` nur `bcs`, `bcp`, `bbs`,
`bbt` und `dm` — `resolveTier('ent')` fiel deshalb auf `{ tier: 'unknown',
features: [] }` zurück. Ein Enterprise-Kunde hätte erfolgreich aktiviert und
danach keine Mehrfachprofile, keine Statistik, keinen Export und keinen
Trainingsablauf gehabt.

Zusätzlich fehlte `enterprise` ganz in der `TIER_CONFIG` des Servers, sodass das
Aktivierungszertifikat mit leerer Funktionsliste ausgestellt wurde.

Beides ist behoben: `ent` steht in der Anwendung, `enterprise` in der
Serverkonfiguration. Der Dienst wurde neu gebaut und neu gestartet; die
Gerätezahlen sind nachgemessen:

| Stufe | Geräte |
|---|---|
| b2b-single | 1 |
| b2b-team | 3 |
| enterprise ohne Angabe | 1 (sichere Untergrenze) |
| enterprise mit „Enterprise: 7 Lizenzen" im notes-Feld | 7 |

### Weiterhin offen — das ist eine Produktentscheidung, keine Korrektur

**`b2c-standard` und `b2c-pro` kennt nur die Anwendung.** Der Server führt diese
Stufen nicht. Entweder werden sie verkauft, dann fehlen sie im Server — oder
nicht, dann können sie aus der Anwendung raus.

**Der Trainingsablauf steht in zwei Listen unterschiedlich.** Die Anwendung
schaltet ihn bei den gewerblichen Stufen frei, die Serverkonfiguration führt ihn
dort nicht. Maßgeblich für den Nutzer ist die Anwendung — der Kunde bekommt ihn
also. Die Serverliste wirkt auf Zertifikat, Rechnung und Anzeige.

Welche der beiden Listen die richtige ist, kann ich nicht entscheiden: Entweder
gehört der Trainingsablauf zum gewerblichen Umfang, dann fehlt er im Server, oder
er gehört nicht dazu, dann gibt die Anwendung ihn zu Unrecht frei. **Bitte
festlegen**, dann ziehe ich die andere Seite nach.

### Eine Beobachtung am Rande

Die individuelle Gerätezahl hängt an einem Freitextfeld: `getMaxDevices` sucht im
notes-Feld nach dem Muster `Enterprise: N Lizenzen`. Ein Tippfehler — Kleinschreibung,
„Lizenz" statt „Lizenzen", eine andere Formulierung — führt stillschweigend zurück
auf ein Gerät. Der Kunde merkt es erst beim zweiten Rechner. Ein eigenes Zahlenfeld
in der Bestellung wäre robuster als ein Muster über Freitext.

---

## Womit geprüft

- Impressum und Datenschutzerklärung: abgerufen am 2. September 2026.
- `main.js` der Anwendung: `generateHardwareFingerprint()`, `TIER_MAP`,
  `requestServerActivation()` — übertragen werden genau drei Angaben
  (Schlüsselkennung, Hashwert, App-Version).
- `/opt/rholabs-fulfillment/src/main/routes.ts` (`getMaxDevices`),
  `src/shared/types.ts` (`TIER_CONFIG`) und `src/main/keygen.ts` (`TIER_CODES`).
- Nach der Änderung: Dienst neu gebaut, Tests gelaufen (59 bestanden, 1
  vorbestehender veralteter Test zur Zertifikats-Schemaversion — `keygen.js` ist
  vor und nach der Änderung byteidentisch, der Fehlschlag kommt nicht daher),
  Dienst neu gestartet, Erreichbarkeit und Gerätezahlen nachgemessen.
- DSGVO Artikel 13: Wortlaut abgerufen aus dem konsolidierten Text (EUR-Lex).
