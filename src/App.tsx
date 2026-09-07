import type { RouteRecord } from 'vite-react-ssg';
import Layout from './Layout';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import EvidencePage from './pages/EvidencePage';
import ContactPage from './pages/ContactPage';
import Imprint from './pages/Imprint';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import DemoThanks from './pages/demo/DemoThanks';
import DemoDone from './pages/demo/DemoDone';
import DemoExpired from './pages/demo/DemoExpired';

/**
 * Die drei Routen unter /demo/ sind die fest verdrahteten Weiterleitungsziele
 * des Auslieferungsdienstes (demo.ts: ZIEL_ANGEFRAGT, ZIEL_FERTIG,
 * ZIEL_ABGELAUFEN). Der Server leitet mit abschliessendem Schraegstrich
 * weiter; `dirStyle: 'nested'` erzeugt dafuer genau die passenden
 * Verzeichnisse mit index.html. Wer hier etwas umbenennt, muss den Server
 * mitziehen — sonst laeuft jeder Bestaetigungsklick in den 404.
 */
export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'kognitives-training', Component: ProductPage },
      { path: 'evidenz', Component: EvidencePage },
      { path: 'kontakt', Component: ContactPage },
      { path: 'impressum', Component: Imprint },
      { path: 'datenschutz', Component: Privacy },
      { path: 'demo/danke', Component: DemoThanks },
      { path: 'demo/fertig', Component: DemoDone },
      { path: 'demo/link-abgelaufen', Component: DemoExpired },
      { path: '*', Component: NotFound },
    ],
  },
];
