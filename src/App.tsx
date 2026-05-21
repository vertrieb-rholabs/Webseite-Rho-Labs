import type { RouteRecord } from 'vite-react-ssg';
import Layout from './Layout';
import LandingPage from './pages/LandingPage';
import ProductPage from './pages/ProductPage';
import EvidencePage from './pages/EvidencePage';
import ContactPage from './pages/ContactPage';
import Imprint from './pages/Imprint';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';

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
      { path: '*', Component: NotFound },
    ],
  },
];
