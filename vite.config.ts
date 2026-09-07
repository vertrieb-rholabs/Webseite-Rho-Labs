import path from 'path';
import { renameSync, rmdirSync } from 'node:fs';
import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { } from 'vite-react-ssg';

// Alle Seiten, die vorgerendert werden. Die drei /demo-Routen sind die
// Weiterleitungsziele des Auslieferungsdienstes und muessen als eigene
// Verzeichnisse mit index.html entstehen — sonst laeuft der
// Bestaetigungsklick in den 404.
const ROUTES = [
  '/',
  '/kognitives-training',
  '/evidenz',
  '/kontakt',
  '/impressum',
  '/datenschutz',
  '/demo/danke',
  '/demo/fertig',
  '/demo/link-abgelaufen',
  '/404',
];

export default defineConfig({
  base: '/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
    // Der Trailer wird als Datei ausgeliefert, nicht als data:-URI eingebettet.
    assetsInlineLimit: 4096,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  ssgOptions: {
    entry: 'src/index.tsx',
    crittersOptions: false,
    dirStyle: 'nested',
    includedRoutes: () => Promise.resolve(ROUTES),
    // GitHub Pages erwartet docs/404.html als Top-Level-Custom-404.
    // nested-mode generiert docs/404/index.html; wir flatten das.
    onFinished: async (dir) => {
      const nested = path.resolve(dir, '404', 'index.html');
      const flat = path.resolve(dir, '404.html');
      renameSync(nested, flat);
      rmdirSync(path.resolve(dir, '404'));
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
} as UserConfig);
