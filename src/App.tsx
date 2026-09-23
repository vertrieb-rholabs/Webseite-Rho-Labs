import type { RouteRecord } from 'vite-react-ssg';
import Layout from './Layout';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import HomePage from './pages/HomePage';
import EvidencePage from './pages/EvidencePage';
import ContactPage from './pages/ContactPage';
import Imprint from './pages/Imprint';
import Privacy from './pages/Privacy';
import Agb from './pages/Agb';
import Widerruf from './pages/Widerruf';
import Lizenzbedingungen from './pages/Lizenzbedingungen';
import NotFound from './pages/NotFound';
import DemoThanks from './pages/demo/DemoThanks';
import DemoDone from './pages/demo/DemoDone';
import DemoExpired from './pages/demo/DemoExpired';
import KaufFertig from './pages/kauf/KaufFertig';
import KaufAbgebrochen from './pages/kauf/KaufAbgebrochen';
import KaufInArbeit from './pages/kauf/KaufInArbeit';
import WiderrufErklaeren from './pages/WiderrufErklaeren';
import WiderrufEingegangen from './pages/widerruf/WiderrufEingegangen';

/**
 * Die drei Routen unter /demo/ sind die fest verdrahteten Weiterleitungsziele
 * des Auslieferungsdienstes (demo.ts: ZIEL_ANGEFRAGT, ZIEL_FERTIG,
 * ZIEL_ABGELAUFEN). Der Server leitet mit abschliessendem Schraegstrich
 * weiter; `dirStyle: 'nested'` erzeugt dafuer genau die passenden
 * Verzeichnisse mit index.html. Wer hier etwas umbenennt, muss den Server
 * mitziehen — sonst laeuft jeder Bestaetigungsklick in den 404.
 *
 * Fuer die drei Routen unter /kauf/ gilt dasselbe: sie sind die Rueckwege des
 * Checkouts (Zahlung fertig, abgebrochen, bezahlt aber noch nicht
 * ausgeliefert).
 *
 * /vertrag-widerrufen traegt die Widerrufsfunktion nach § 356a BGB. Ihre
 * Adresse steht wortgleich im amtlichen Baustein der Widerrufsbelehrung
 * (`seite-widerruf.md` und `rechtstexte.ts` im Dienst); wer sie umbenennt,
 * laesst eine Belehrung ins Leere zeigen. /vertrag-widerrufen/eingegangen ist
 * das Weiterleitungsziel des Dienstes nach geglueckter Eingangsbestaetigung.
 *
 * Jede neue Route gehoert an drei weitere Stellen: die ROUTES-Liste in
 * vite.config.ts (Vorrendern), die Liste in scripts/hydration-check.mjs und
 * — wenn sie fuer die Suche taugt — public/sitemap.xml.
 */
export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'kognitives-training', Component: ProductPage },
      { path: 'home', Component: HomePage },
      { path: 'evidenz', Component: EvidencePage },
      { path: 'kontakt', Component: ContactPage },
      { path: 'impressum', Component: Imprint },
      { path: 'datenschutz', Component: Privacy },
      { path: 'agb', Component: Agb },
      { path: 'widerruf', Component: Widerruf },
      { path: 'lizenzbedingungen', Component: Lizenzbedingungen },
      { path: 'demo/danke', Component: DemoThanks },
      { path: 'demo/fertig', Component: DemoDone },
      { path: 'demo/link-abgelaufen', Component: DemoExpired },
      { path: 'kauf/fertig', Component: KaufFertig },
      { path: 'kauf/abgebrochen', Component: KaufAbgebrochen },
      { path: 'kauf/in-arbeit', Component: KaufInArbeit },
      // Die Widerrufsfunktion nach § 356a BGB. `vertrag-widerrufen` ist die
      // Adresse, die WORTGLEICH im amtlichen Baustein der Widerrufsbelehrung
      // steht — hier umbenennen heisst: eine Belehrung, die ins Leere zeigt.
      // `vertrag-widerrufen/eingegangen` ist das Weiterleitungsziel des
      // Dienstes nach geglueckter Eingangsbestaetigung, mit abschliessendem
      // Schraegstrich wie die /demo- und /kauf-Seiten.
      { path: 'vertrag-widerrufen', Component: WiderrufErklaeren },
      { path: 'vertrag-widerrufen/eingegangen', Component: WiderrufEingegangen },
      { path: '*', Component: NotFound },
    ],
  },
];
