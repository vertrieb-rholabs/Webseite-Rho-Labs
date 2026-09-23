/* ── Rueckwege des Auslieferungsdienstes, ohne React ───────────────────────
   Der Dienst schickt einen Besucher mit einer Kennung in der Adresszeile
   zurueck: `?fehler=eingabe`, `?fehler=zuviele`, `?ref=ungueltig` und so fort.
   Bis zum 22.09.2026 las die Website diese Kennungen ausschliesslich NACH der
   Hydration, in einem `useEffect`. Das hatte zwei Loecher:

     1. Ohne JavaScript wurde gar nichts gelesen. Der Dienst wies ab, leitete
        zurueck — und der Besucher sah dasselbe leere Formular ein zweites Mal,
        ohne Grund und ohne Hinweis. Bei einer fristgebundenen Rechtsausuebung
        heisst das: Er haelt die Funktion fuer kaputt und bricht ab.
     2. Auch MIT JavaScript blieb ein Fenster: zwischen dem Aufbau der Seite
        und dem Einhaengen von React steht die Meldung noch nicht da.

   Deshalb stehen die Hinweise jetzt VORGERENDERT im ausgelieferten HTML,
   verborgen mit dem `hidden`-Attribut, und ein synchrones Skript unmittelbar
   dahinter macht den passenden sichtbar — waehrend der Browser die Seite
   liest, lange bevor das Buendel geladen ist. Dasselbe Muster wie das
   Inline-Skript fuer den Vorteilscode auf der Kaufseite.

   Diese Kaesten sind eine VORAB-SCHICHT und kein zweiter Anzeigeweg. Sobald
   React eingehaengt ist, blendet es sie mit `vorabSchichtAusblenden()` aus und
   fuehrt die Anzeige selbst. Das ist keine Zierde, sondern noetig: React baut
   den Inhalt eines Behaelters mit `dangerouslySetInnerHTML` beim Uebernehmen
   neu auf und setzt das `hidden`-Attribut dabei zurueck. Am Bildschirm
   nachgemessen: unmittelbar nach dem Aufbau der Seite steht der Kasten
   (`hidden=false`, Hoehe 84 px), zweieinhalb Sekunden spaeter ist er wieder
   verborgen. Wer sich allein auf das Skript verliesse, haette die Meldung
   genau so lange, bis das Buendel geladen ist — und danach nie wieder.

   Bleibt das Buendel aus, bleibt die Vorab-Schicht stehen. Genau dafuer ist
   sie da.

   Was BLEIBT, ist der Fall ganz ohne JavaScript: Eine vorgerenderte Seite auf
   statischem Web-Speicher kann eine Abfrage nicht ohne Skript lesen. Dafuer
   traegt jede der beiden Seiten einen `<noscript>`-Kasten, der sagt, was ein
   erneut erscheinendes Formular bedeutet und welcher Weg ohne Skript offen
   steht.
   -------------------------------------------------------------------------- */

/**
 * Kennzeichen jedes Stuecks der Vorab-Schicht.
 *
 * Alles mit diesem Attribut gilt nur, solange React nicht uebernommen hat.
 */
export const VORAB_MERKMAL = 'data-vorab';

/** Maskiert die vier Zeichen, die in HTML eine eigene Bedeutung haben. */
export function htmlText(wert: string): string {
  return wert
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Ein vorgerenderter, zunaechst verborgener Hinweiskasten.
 *
 * `data-rueckweg` traegt die Kennung des Dienstes — ein Attribut und keine
 * `id`, weil derselbe Hinweis auf der Kaufseite an zwei Stellen steht
 * (Preiskarte und Formular) und `id` nur einmal vorkommen darf.
 */
export function rueckwegKasten(kennung: string, text: string, klassen = 'callout'): string {
  return (
    `<div class="${htmlText(klassen)}" ${VORAB_MERKMAL} `
    + `data-rueckweg="${htmlText(kennung)}" hidden>`
    + `<p>${htmlText(text)}</p>`
    + '</div>'
  );
}

/**
 * React uebernimmt: die ganze Vorab-Schicht verschwindet.
 *
 * Aufzurufen in dem Effekt, der einmalig nach dem Einhaengen laeuft — vor
 * jeder Anzeige, die React selbst verantwortet. Danach gibt es zu jedem
 * Hinweis genau eine Quelle, und zwar React.
 */
export function vorabSchichtAusblenden(): void {
  document.querySelectorAll(`[${VORAB_MERKMAL}]`).forEach((stueck) => {
    (stueck as HTMLElement).hidden = true;
  });
}

/** Eine Abfrage und die Werte, die zu ihr gelten sollen. */
export interface RueckwegQuelle {
  /** Name der Abfrage in der Adresszeile, zum Beispiel `fehler`. */
  parameter: string;
  /** Erlaubte Werte. Alles andere wird uebergangen — siehe unten. */
  werte: string[];
}

/**
 * Das synchrone Skript, das die passenden Kaesten sichtbar macht.
 *
 * Es prueft gegen eine feste Liste erlaubter Werte, genau wie die Auswertung
 * in React es tat. Ein unbekannter Wert bleibt damit wirkungslos: Er darf
 * weder wie ein Tippfehler des Lesers aussehen noch ueber die Adresszeile
 * einen Text in die Seite bringen. Der Wert wandert ausserdem nie in die
 * Seite, sondern nur in einen Vergleich.
 */
export function rueckwegSkript(quellen: RueckwegQuelle[]): string {
  const zeilen = quellen.map(({ parameter, werte }) => {
    const bedingung = werte.map((wert) => `w===${JSON.stringify(wert)}`).join('||');
    return `w=l(${JSON.stringify(parameter)});if(${bedingung})z(w);`;
  });

  return [
    '(function(){try{',
    "var z=function(w){var n=document.querySelectorAll('[data-rueckweg=\"'+w+'\"]');",
    'for(var i=0;i<n.length;i++)n[i].hidden=false;};',
    "var l=function(p){var t=new RegExp('[?&]'+p+'=([^&#]*)').exec(location.search);",
    "return t?decodeURIComponent(t[1].replace(/\\+/g,' ')).trim().toLowerCase():'';};",
    'var w;',
    ...zeilen,
    '}catch(e){}})();',
  ].join('');
}
