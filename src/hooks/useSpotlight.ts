import { useEffect } from 'react';

/**
 * Lichtkante, die dem Zeiger folgt.
 *
 * Ein einziger Zuhoerer am Dokument statt einer Bindung je Karte: bei rund
 * fuenfzig Karten auf der Produktseite ist das der Unterschied zwischen einem
 * Ereignis und fuenfzig. Gesetzt werden nur CSS-Variablen — die Zeichnung
 * uebernimmt `.card--edge::before`.
 */
export default function useSpotlight() {
  useEffect(() => {
    // Auf Zeigegeraeten ohne Schwebezustand (Touch) bringt der Effekt nichts.
    if (!window.matchMedia('(hover: hover)').matches) return;

    let last: HTMLElement | null = null;

    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const el = target?.closest?.('[data-edge]') as HTMLElement | null;

      if (last && last !== el) {
        last.style.setProperty('--edge', '0');
        last = null;
      }
      if (!el) return;

      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${Math.round(event.clientX - rect.left)}px`);
      el.style.setProperty('--my', `${Math.round(event.clientY - rect.top)}px`);
      el.style.setProperty('--edge', '1');
      last = el;
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);
}
