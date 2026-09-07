import { Fragment, type ReactNode } from 'react';

/**
 * Rendert die drei Auszeichnungen, die in den Evidenztexten des Registers
 * vorkommen: **fett**, *kursiv* und [Text](url).
 *
 * Bewusst ein eigener Mini-Renderer statt einer Markdown-Bibliothek mit
 * `dangerouslySetInnerHTML`: hier entstehen React-Knoten, kein HTML aus einer
 * Zeichenkette. Damit gibt es keinen Weg, ueber den Registertext Markup in die
 * Seite zu bringen — und es spart eine Abhaengigkeit fuer drei Konstrukte.
 */

const MUSTER = /\*\*([^*]+)\*\*|\*([^*]+)\*|\[([^\]]+)\]\(([^)]+)\)/g;

export default function EvidenzText({ text }: { text: string }) {
  const teile: ReactNode[] = [];
  let zuletzt = 0;
  let treffer: RegExpExecArray | null;
  let i = 0;

  MUSTER.lastIndex = 0;
  while ((treffer = MUSTER.exec(text)) !== null) {
    if (treffer.index > zuletzt) teile.push(text.slice(zuletzt, treffer.index));

    const [ganz, fett, kursiv, linktext, url] = treffer;
    if (fett) {
      teile.push(<strong key={i++}>{fett}</strong>);
    } else if (kursiv) {
      teile.push(<em key={i++}>{kursiv}</em>);
    } else if (linktext && /^https?:\/\//i.test(url)) {
      teile.push(
        <a key={i++} href={url} target="_blank" rel="noopener noreferrer">
          {linktext}
        </a>,
      );
    } else {
      // Kein Schema, das wir zulassen — dann lieber den Rohtext zeigen.
      teile.push(ganz);
    }
    zuletzt = treffer.index + ganz.length;
  }

  if (zuletzt < text.length) teile.push(text.slice(zuletzt));

  return (
    <>
      {teile.map((t, n) => (
        <Fragment key={n}>{t}</Fragment>
      ))}
    </>
  );
}
