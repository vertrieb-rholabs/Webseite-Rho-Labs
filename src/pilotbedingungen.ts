/**
 * Die Pilotbedingungen für das Pilotprogramm von Rho-Labs — Fassung P1-2026-10.
 *
 * ── Zeichengenau wie im Dienst ──────────────────────────────────────────────
 * Dieser Text ist der kanonische Wortlaut aus T1 Abschnitt 1 (Fassung v3,
 * alles zwischen den beiden Scherenlinien). Er steht wortgleich im Dienst
 * (`src/main/pilot-bedingungen.ts`, `PILOT_BEDINGUNGEN_TEXT`): Der Dienst bildet
 * über ihn den SHA-256, den das Zustimmungsprotokoll festhält. Weicht diese
 * Seite ab, hat die zustimmende Person einem anderen Text zugestimmt, als der
 * Dienst nachweist.
 *
 * `scripts/pilot.test.mjs` liest den Text des Dienstes (Pfad
 * `../../Software/Rholabs-fullfilment` oder `DIENST_QUELLE`) und vergleicht
 * ihn mit diesem Text nach `CRLF → LF` und `trim` — derselben Normalisierung,
 * über die der Dienst den Hash bildet. Wer hier ein Zeichen ändert, ändert es
 * dort mit, vergibt eine neue Fassungskennung und legt die Seite
 * `/pilotpartner/zustimmung` mit nach (`PILOT_FASSUNG`).
 *
 * Die Seite `/pilotbedingungen` zerlegt den Text nur an seinen Leerzeilen und
 * an den Absatzzeilen; sie fügt ihm nichts hinzu.
 */

/** Kennung der geltenden Fassung. Steht auf der Zustimmungsseite und im Protokoll des Dienstes. */
export const PILOT_FASSUNG = 'P1-2026-10';

export const PILOT_BEDINGUNGEN_TEXT = `Pilotbedingungen für das Pilotprogramm von Rho-Labs
Fassung P1-2026-10 vom 6. Oktober 2026

§ 1 Gegenstand
(1) Diese Bedingungen gelten für die Teilnahme am Pilotprogramm von Rho-Labs, Inhaber Patrick Feix, Feldstraße 15, 99848 Wutha-Farnroda, kontakt.rholabs@gmail.com (Rho-Labs). Vertragspartner ist der rechtliche Träger der ausgewählten Praxis oder Einrichtung, der auf der Bestätigungsseite bezeichnet ist (Pilotpartner).
(2) Rho-Labs überlässt dem Pilotpartner die Software „Rho-Labs Kognitives Training“ für Windows mit dem Funktionsumfang der Version für Praxen und Einrichtungen für einen begrenzten Zeitraum kostenlos zur Erprobung im Arbeitsalltag. Ziel ist, die Software anhand der Erfahrungen aus der Praxis weiterzuentwickeln. Das Pilotprogramm ist keine Studie und keine Prüfung von Wirkungen an Menschen.
(3) Das Pilotprogramm richtet sich an Unternehmer im Sinne von § 14 BGB, juristische Personen des öffentlichen Rechts und öffentlich-rechtliche Sondervermögen, nicht an Verbraucher.
(4) Für die Pilotnutzung gehen diese Bedingungen allgemeinen Vertrags- oder Lizenzbedingungen von Rho-Labs vor, auch solchen, die in der Software angezeigt werden. Abweichende Bedingungen des Pilotpartners gelten nicht; im Einzelfall ausdrücklich getroffene Abreden haben Vorrang. Eine kostenpflichtige Nutzung nach dem Pilot erfordert einen gesonderten Vertrag.

§ 2 Zustandekommen
(1) Die Bewerbung über rholabs.de/pilotpartner ist unverbindlich und kostenlos. Ein Anspruch auf Teilnahme besteht nicht. Rho-Labs wählt die Pilotpartner nach eigenem Ermessen aus.
(2) Rho-Labs übermittelt der Ansprechperson des ausgewählten Pilotpartners einen persönlichen Bestätigungslink. Die Bestätigungsseite nennt das Angebot: den Pilotpartner, den geplanten Pilotstart und die Zahl der Geräte. Der Vertrag kommt zustande, wenn die Ansprechperson diese Bedingungen dort annimmt. Sie bestätigt dabei, dass sie berechtigt ist, für den Pilotpartner zu handeln, und dass der Pilotpartner in Ausübung seiner gewerblichen oder selbständigen beruflichen Tätigkeit oder als öffentliche Stelle handelt. Vor dem Absenden können die Eingaben im Formular geändert werden. Vertragssprache ist Deutsch.
(3) Rho-Labs bestätigt die Annahme unverzüglich per E-Mail und sendet diese Bedingungen dabei in speicherbarer Form mit. Rho-Labs speichert den Vertragstext zusammen mit den Angaben des Angebots.
(4) Öffentliche Einrichtungen prüfen selbst, ob sie die unentgeltliche Nutzung und eine spätere Anpassung nach § 8 annehmen dürfen.

§ 3 Pilotzeitraum und Beendigung
(1) Der Pilotzeitraum umfasst 42 Kalendertage. Er beginnt am vereinbarten Pilotstart; dieser Tag ist der erste Nutzungstag. Rho-Labs stellt den Lizenzschlüssel zum Pilotstart aus und nennt dabei den letzten Nutzungstag. Technisch endet der Zeitraum mit Ablauf des letzten Nutzungstags nach koordinierter Weltzeit (UTC), in Deutschland also in der folgenden Nacht um 1 Uhr (Winterzeit) oder 2 Uhr (Sommerzeit). Verzögert sich die Ausstellung aus Gründen, die Rho-Labs zu vertreten hat, verkürzt das die 42 Tage nicht.
(2) Das Pilotprogramm endet automatisch. Es verlängert sich nicht und geht nicht in einen kostenpflichtigen Vertrag über. Eine Kaufverpflichtung besteht nicht.
(3) Kann der Pilotpartner die Software aus Gründen, die er nicht zu vertreten hat, erst später einsetzen, stellt Rho-Labs auf Wunsch einen neuen Lizenzschlüssel mit neuem Pilotstart aus, soweit das organisatorisch möglich ist, und sperrt den bisherigen.
(4) Der Pilotpartner kann die Teilnahme jederzeit ohne Angabe von Gründen in Textform beenden. Rho-Labs kann die Teilnahme vor Ablauf des Pilotzeitraums nur aus wichtigem Grund in Textform beenden, insbesondere wenn der Pilotpartner den Lizenzschlüssel an Dritte weitergibt oder die Aktivierung umgeht oder wenn eine konkrete Sicherheitsgefährdung besteht. Soweit zumutbar, setzt Rho-Labs vorher eine angemessene Frist zur Abhilfe. Ausbleibendes freiwilliges Feedback und eine nicht erteilte Referenzfreigabe sind keine Gründe für eine Beendigung. Mit dem Ende sperrt Rho-Labs den Lizenzschlüssel; § 4 Abs. 5 und § 9 Abs. 2 gelten auch in diesem Fall.

§ 4 Nutzungsrecht und Funktionsumfang
(1) Rho-Labs räumt dem Pilotpartner für den Pilotzeitraum das einfache, nicht übertragbare und nicht unterlizenzierbare Recht ein, die Software für die eigenen Zwecke seiner Praxis oder Einrichtung zu nutzen, auch durch seine Beschäftigten und durch die Personen, die dort mit der Software trainieren. Alle übrigen Rechte an der Software verbleiben bei Rho-Labs.
(2) Der Funktionsumfang umfasst alle Übungen, Profile für mehrere Personen, Trainingsabläufe, den Trainingsverlauf mit Statistik sowie den Export. Auf wie vielen Geräten der Lizenzschlüssel gleichzeitig aktiviert sein darf, steht auf der Bestätigungsseite; es sind höchstens drei.
(3) Die Aktivierung erfordert eine Internetverbindung. Danach ist die Software bis zu sieben Tage ohne Verbindung nutzbar; spätestens dann ist eine kurze Online-Prüfung der Lizenz erforderlich, die beim Start mit Internetverbindung automatisch erfolgt.
(4) Der Pilotpartner gibt den Lizenzschlüssel nicht an Dritte weiter. Zwingende gesetzliche Nutzungsbefugnisse (§§ 69d, 69e UrhG) bleiben unberührt.
(5) Nach Ablauf des Pilotzeitraums oder einer vorzeitigen Beendigung darf der Pilotpartner die Software kostenfrei weiter nutzen, um bereits gespeicherte Daten anzusehen, zu exportieren und zu löschen. Eine Sperre des Trainings berührt diese Datenverwaltung nicht.

§ 5 Zweckbestimmung der Software
(1) Rho-Labs Kognitives Training ist eine Software für kognitives Training. Sie bietet Übungen zu Gedächtnis, Aufmerksamkeit, räumlichem Denken und Denken/Planen mit einstellbarer Schwierigkeit sowie eine Übersicht über den eigenen Trainingsverlauf. Die Software ist kein Medizinprodukt. Sie ist nicht dazu bestimmt, Krankheiten, Verletzungen oder Behinderungen zu erkennen, zu überwachen, zu behandeln, zu lindern, auszugleichen oder ihnen vorzubeugen. Die Trainingsergebnisse sind keine Diagnose und keine Grundlage für medizinische oder therapeutische Entscheidungen.
(2) Die Erprobung betrifft Bedienung, Organisation und nichtmedizinische Übungsangebote innerhalb dieser Zweckbestimmung. Rho-Labs plant oder unterstützt im Pilotprogramm keine Anwendungen zur Diagnose, Behandlung, Linderung oder Kompensation von Krankheiten, Verletzungen oder Behinderungen und keine Nutzung der Ergebnisse für medizinische oder therapeutische Entscheidungen. Setzt der Pilotpartner die Software dennoch in einem solchen Zusammenhang ein, geschieht das außerhalb der Zweckbestimmung und in seiner alleinigen fachlichen Verantwortung. Gesundheitliche oder therapeutische Wirkungen sagt Rho-Labs nicht zu.
(3) Dieser Paragraf beschreibt den Vertragsgegenstand. Er schränkt die Haftung nach § 10 nicht ein.

§ 6 Leistungen von Rho-Labs während des Pilots
(1) Rho-Labs bietet zum Pilotstart eine persönliche Einführung in Bedienung und Einrichtung per Videokonferenz oder Telefon an. Die Teilnahme ist freiwillig; der Pilot kann auch ohne Einführung beginnen.
(2) Während des Pilotzeitraums steht Rho-Labs für Fragen per E-Mail und nach Absprache per Videokonferenz oder Telefon zur Verfügung und bietet etwa einmal pro Woche einen kurzen Austausch an. Die Teilnahme daran ist freiwillig. Rho-Labs bemüht sich, Anfragen innerhalb von zwei Werktagen zu beantworten. Eine bestimmte prozentuale Verfügbarkeit sagt Rho-Labs nicht zu; Rho-Labs hält den für die vereinbarte Nutzung erforderlichen Lizenzdienst mit angemessener Sorgfalt vor und informiert über erhebliche Störungen.
(3) Rho-Labs kann während des Pilotzeitraums aktualisierte Versionen der Software bereitstellen. Aktualisierungen schränken den in § 4 Abs. 2 beschriebenen Funktionsumfang und die Datenverwaltung nach § 4 Abs. 5 nicht wesentlich ein, es sei denn, dies ist zur Abwehr eines Sicherheitsrisikos erforderlich.

§ 7 Feedback
(1) Feedback ist freiwillig. Rho-Labs schlägt dafür kurze wöchentliche Fragen und ein Abschlussgespräch am Ende des Pilotzeitraums vor. Fragen per E-Mail schickt Rho-Labs nur, wenn der Pilotpartner das auf der Bestätigungsseite gewählt hat; die Wahl kann jederzeit widerrufen werden. Im Abschlussgespräch informiert Rho-Labs auch über die Möglichkeiten einer weiteren Nutzung.
(2) Feedback betrifft die Software, ihre Bedienung und die Organisation im Arbeitsalltag. Es enthält keine Angaben zu einzelnen Personen, die mit der Software trainieren, keine Trainingsergebnisse einzelner Personen, keine Diagnosen oder Gesundheitsangaben und keine Fallbeschreibungen.
(3) Rho-Labs darf freiwillig mitgeteilte Ideen und Verbesserungsvorschläge unentgeltlich zur Weiterentwicklung der Software verwenden; der Pilotpartner wird dabei nicht genannt. Soweit dafür urheberrechtlich geschützte Beiträge genutzt werden und der Pilotpartner über die erforderlichen Rechte verfügt, räumt er Rho-Labs daran ein einfaches, zeitlich und räumlich unbeschränktes Nutzungsrecht für diesen Zweck ein. Zwingende gesetzliche Rechte bleiben unberührt. Personenbezogene Angaben in Feedback-Nachrichten verarbeitet und löscht Rho-Labs nach der Datenschutzerklärung. Ein Anspruch auf Umsetzung von Vorschlägen besteht nicht.

§ 8 Pilotpartner-Anpassung
(1) Rho-Labs bietet dem Pilotpartner nach Ablauf des Pilotzeitraums eine kleinere, praxisbezogene Anpassung der Software ohne zusätzliche Entwicklungskosten an. Das Angebot gilt auch, wenn Rho-Labs die Teilnahme aus Sicherheitsgründen vorzeitig beendet. Es entfällt, wenn der Pilotpartner die Teilnahme vorzeitig beendet oder Rho-Labs sie wegen Weitergabe des Lizenzschlüssels oder Umgehung der Aktivierung beendet.
(2) Innerhalb von acht Wochen nach Ende des Pilotzeitraums legen beide Seiten in Textform eine Funktionsbeschreibung, ihre Grenzen und einen verbindlichen Bereitstellungstermin fest; Rho-Labs wirkt daran redlich mit. Erst diese Festlegung begründet die Zusage zur Umsetzung. Kommt in dieser Frist keine Festlegung zustande, entfällt das Angebot. Einen Anspruch auf Umsetzung eines bestimmten Vorschlags gibt es ohne Festlegung nicht.
(3) In Betracht kommt eine Anpassung, die einen Aufwand von höchstens zwei Personentagen erfordert, technisch und sicherheitstechnisch vertretbar ist, zur Architektur der Software passt und Datenschutz und Sicherheit nicht schwächt. Ein Personentag umfasst acht Arbeitsstunden einschließlich Entwicklung, Prüfung und Bereitstellung. Die Anpassung wird vorzugsweise als Einstellung oder Option der regulären Software umgesetzt.
(4) Nicht umfasst sind insbesondere Schnittstellen zu anderen Systemen, Datenübernahmen, Server- und Unternehmensfunktionen sowie Funktionen mit medizinischer Zweckbestimmung, etwa Normwerte oder diagnostische Auswertungen. Rho-Labs kann Vorschläge, die Absatz 3 nicht erfüllen, mit Begründung ablehnen und eine gleichwertige Alternative vorschlagen. Größere Entwicklungen kann Rho-Labs gesondert anbieten.
(5) Die Rechte an der Anpassung liegen bei Rho-Labs; Rho-Labs darf sie in die Standardsoftware übernehmen. Rechte an vorbestehenden Materialien und Beiträgen des Pilotpartners bleiben unberührt. Die Anpassung steht in der regulären Software zur Verfügung. Ihre Nutzung setzt, wie jede Nutzung nach dem Pilotzeitraum, eine reguläre, kostenpflichtige Lizenz voraus; eine Kaufverpflichtung entsteht dadurch nicht.

§ 9 Daten auf den Geräten des Pilotpartners, Verschwiegenheit
(1) Profile, Trainingsergebnisse und Trainingsabläufe speichert die Software ausschließlich auf den Geräten des Pilotpartners. Sie werden nicht an Rho-Labs übertragen. Für ihre Verarbeitung ist allein der Pilotpartner nach dem für ihn anwendbaren Datenschutzrecht verantwortlich. Bei der vereinbarten lokalen Nutzung ohne Datenzugriff verarbeitet Rho-Labs diese Daten nicht im Auftrag des Pilotpartners.
(2) Nach dem Ende des Pilotprogramms, auch nach einer vorzeitigen Beendigung, bleiben die Daten erhalten. Der Pilotpartner kann sie in der Software nach § 4 Abs. 5 weiterhin ansehen, exportieren und löschen; neues Training ist nur mit einer regulären Lizenz möglich. Für Sicherung, Aufbewahrung und Löschung der Daten ist der Pilotpartner verantwortlich. Die „Datenschutzhinweise für Pilotpartner“ im Anhang enthalten Empfehlungen.
(3) Einführung und Unterstützung erfolgen mit ausschließlich fiktiven Beispieldaten. Bei einer Bildschirmfreigabe teilt der Pilotpartner nur das erforderliche Fenster; echte Profile, Ergebnislisten, Dateinamen und Benachrichtigungen dürfen nicht sichtbar sein. Aufzeichnungen, Transkriptionen und automatische Gesprächszusammenfassungen finden nicht statt. Der Pilotpartner übermittelt Rho-Labs keine Exporte, Datendateien oder sonstigen Daten betreuter Personen; Rho-Labs fordert solche Daten nicht an. Wird dennoch ein Datum einer betreuten Person sichtbar, unterbricht Rho-Labs die Freigabe sofort, fertigt keine Aufzeichnungen oder Notizen dazu an und setzt erst danach mit Beispieldaten fort. Ist eine Unterstützung an echten Daten ausnahmsweise unvermeidbar, prüfen die Parteien vorher Rolle, Rechtsgrundlage, Schutzmaßnahmen und Offenbarungsbefugnis und schließen, soweit eine Auftragsverarbeitung vorliegt, vorher eine Vereinbarung nach Art. 28 der Datenschutz-Grundverordnung.
(4) Rho-Labs verpflichtet sich, über fremde Geheimnisse, insbesondere über Personen, die der Pilotpartner betreut, die Rho-Labs bei Gelegenheit seiner Tätigkeit im Pilotprogramm bekannt werden, Stillschweigen zu bewahren, sich Kenntnis davon nur zu verschaffen, soweit dies für die Unterstützung des Pilotpartners zwingend erforderlich ist, und sie nicht anderweitig zu verwenden. Rho-Labs gibt solche Geheimnisse nicht in E-Mails, Aufgabenlisten oder Videodienste ein. Rho-Labs ist bekannt, dass eine unbefugte Offenbarung nach § 203 Abs. 4 StGB strafbar sein kann. Rho-Labs setzt im Pilotprogramm keine weiteren Personen ein; geschieht dies doch, verpflichtet Rho-Labs sie und gegebenenfalls weitere Mitwirkende in einer Dienstleisterkette vorher in Textform ebenso und begrenzt ihren Zugang auf das Erforderliche. Diese Pflicht gilt über das Ende des Pilotprogramms hinaus.
(5) Daten der Ansprechpersonen des Pilotpartners verarbeitet Rho-Labs nach der Datenschutzerklärung unter rholabs.de/datenschutz.

§ 10 Haftung
(1) Rho-Labs haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit von Rho-Labs und seinen Erfüllungsgehilfen, für schuldhaft verursachte Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit, nach dem Produkthaftungsgesetz, aufgrund sonstiger zwingender gesetzlicher Vorschriften und bei arglistig verschwiegenen Mängeln.
(2) Im Übrigen haftet Rho-Labs bei leichter Fahrlässigkeit nur für die Verletzung einer Pflicht, deren Erfüllung die ordnungsgemäße Durchführung des Pilotprogramms überhaupt erst ermöglicht und auf deren Einhaltung der Pilotpartner regelmäßig vertrauen darf, und nur begrenzt auf den bei Vertragsschluss vorhersehbaren, vertragstypischen Schaden. Im Übrigen ist die Haftung für leichte Fahrlässigkeit ausgeschlossen.
(3) Die Absätze 1 und 2 gelten unabhängig von der rechtlichen Einordnung der unentgeltlichen Überlassung.
(4) Der Pilotpartner erstellt angemessene, zumutbare Datensicherungen. Hat er diese Pflicht schuldhaft verletzt und ist das für einen Datenverlust mitursächlich, wird dies nach § 254 BGB berücksichtigt.
(5) Die Software wird zur Erprobung in ihrem jeweiligen Entwicklungsstand überlassen; die in § 4 Abs. 2 und 5 beschriebenen Funktionen bleiben geschuldet. Treten Mängel auf, behebt Rho-Labs sie nach Kräften im Rahmen des Pilotprogramms, auch durch Bereitstellen einer aktualisierten Version. Weitergehende Rechte wegen Mängeln bestehen nicht, es sei denn, Rho-Labs hat den Mangel arglistig verschwiegen. Schadensersatzansprüche richten sich nach den Absätzen 1 bis 4. Eine Garantie übernimmt Rho-Labs nicht.

§ 11 Referenzen
Eine öffentliche Nennung des Pilotpartners, Zitate, Logos, Fotos oder Praxisberichte sind nicht Teil dieser Vereinbarung. Rho-Labs fragt nach Ende des Pilotzeitraums gesondert, ob der Pilotpartner dazu bereit ist. Die Entscheidung ist freiwillig und hat keinen Einfluss auf die Teilnahme, die Pilotpartner-Anpassung oder spätere Angebote.

§ 12 Vertraulichkeit
(1) Rho-Labs behandelt Informationen über den Pilotpartner, seine Organisation und seine Arbeitsabläufe vertraulich und gibt sie nicht an Dritte weiter, soweit nicht der Pilotpartner zugestimmt hat oder eine gesetzliche Pflicht besteht. Der Einsatz der in der Datenschutzerklärung genannten Dienstleister bleibt zulässig.
(2) Der Pilotpartner behandelt Informationen über noch nicht veröffentlichte Funktionen vertraulich, wenn Rho-Labs sie als vertraulich bezeichnet.
(3) Die Vertraulichkeit erfasst keine Informationen, die nachweislich bereits rechtmäßig bekannt waren, ohne Pflichtverletzung öffentlich werden oder unabhängig entwickelt wurden. Gesetzlich zulässige oder vorgeschriebene Offenbarungen sowie Offenbarungen an zur Verschwiegenheit verpflichtete Berater bleiben zulässig.
(4) Diese Pflichten gelten drei Jahre über das Ende des Pilotprogramms hinaus. § 9 Abs. 4 und gesetzliche Geheimhaltungs- und Datenschutzpflichten bleiben unberührt.

§ 13 Schlussbestimmungen
(1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
(2) Änderungen dieser Bedingungen während eines laufenden Pilotprogramms gelten nur mit Zustimmung des Pilotpartners in Textform.
(3) Erklärungen nach diesen Bedingungen bedürfen der Textform, etwa per E-Mail. Der Vorrang im Einzelfall getroffener Abreden bleibt unberührt.

Anhang: Datenschutzhinweise für Pilotpartner (Empfehlungen)
1. Verwenden Sie für Profile Kürzel oder Pseudonyme, keine vollständigen Namen und keine Geburtsdaten. Führen Sie die Zuordnung getrennt und verschlossen. Pseudonyme heben den Personenbezug nicht auf.
2. Schalten Sie auf den Geräten die Windows-Geräteverschlüsselung oder BitLocker ein. Sie schützt vor allem ausgeschaltete oder gesperrte Geräte, nicht vor Personen, die dasselbe angemeldete Windows-Konto benutzen.
3. Die App hat keine eigene Anmeldung. Die Daten liegen unverschlüsselt im Windows-Benutzerkonto im Ordner %APPDATA%\\gedaechtnistraining; wer dieses Konto benutzt, kann darauf zugreifen. Legen Sie deshalb fest, wer welches Konto nutzt, verwenden Sie für jede Fachkraft möglichst ein eigenes, kennwortgeschütztes Konto und sperren Sie Geräte beim Verlassen.
4. Sichern Sie diesen Ordner regelmäßig und verschlüsselt und prüfen Sie, ob sich die Sicherung wiederherstellen lässt. Legen Sie Exporte (PDF, CSV) nicht in allgemein zugänglichen Ordnern ab und versenden Sie sie nicht unverschlüsselt.
5. Löschen Sie Profile in der Software, wenn Sie sie nicht mehr benötigen; denken Sie dabei auch an Exporte und Sicherungen. Eigene Aufbewahrungspflichten Ihrer Einrichtung bleiben unberührt.
6. Informieren Sie die betreuten Personen über die Nutzung der Software und prüfen Sie die Rechtsgrundlage Ihrer Verarbeitung.
7. Zeigen Sie in Videokonferenzen mit Rho-Labs keine echten Daten betreuter Personen und teilen Sie nur das erforderliche Fenster.
8. Die Software ist nicht die Behandlungs- oder Verlaufsdokumentation Ihrer Einrichtung. Behandlungsrelevante Angaben gehören gegebenenfalls in Ihre eigene Dokumentation; Exporte ersetzen sie nicht.
9. Verwenden Sie bei der Verarbeitung personenbezogener Daten ein Betriebssystem, das noch Sicherheitsupdates erhält.`;
