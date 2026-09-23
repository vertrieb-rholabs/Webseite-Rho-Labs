import path from 'path';
import { renameSync, rmdirSync, rmSync } from 'node:fs';
import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { } from 'vite-react-ssg';

// Alle Seiten, die vorgerendert werden. Die drei /demo- und die drei
// /kauf-Routen sind die Weiterleitungsziele des Auslieferungsdienstes und
// muessen als eigene Verzeichnisse mit index.html entstehen — sonst laeuft
// der Bestaetigungsklick oder der Rueckweg der Zahlung in den 404.
const ROUTES = [
  '/',
  '/kognitives-training',
  '/home',
  '/evidenz',
  '/kontakt',
  '/impressum',
  '/datenschutz',
  '/agb',
  '/widerruf',
  '/lizenzbedingungen',
  '/demo/danke',
  '/demo/fertig',
  '/demo/link-abgelaufen',
  '/kauf/fertig',
  '/kauf/abgebrochen',
  '/kauf/in-arbeit',
  '/vertrag-widerrufen',
  '/vertrag-widerrufen/eingegangen',
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

      /* Und das Bauverzeichnis raus, bevor es veroeffentlicht wird.
         ------------------------------------------------------------------
         `docs/.vite/` entsteht beim Bauen und wird zum Vorrendern gebraucht
         — danach von niemandem mehr. Die Seite laedt es nicht, der Browser
         fragt es nie an. Veroeffentlicht wird es trotzdem: Die eingesetzte
         Action `actions/upload-pages-artifact@v3` packt Punktverzeichnisse
         mit ein, ausgenommen nur `.git` und `.github`.

         Darin steht der gesamte Modulbestand mit ABSOLUTEN Pfaden. Oertlich
         gebaut sind das die Pfade dieses Rechners, samt Kontoname; im
         Lauf der Werkbank die Verzeichnisstruktur des Laeufers. Beides
         gehoert nicht auf eine oeffentliche Seite und wird dort fuer nichts
         gebraucht.

         `onFinished` laeuft, wenn alle Seiten geschrieben sind; danach
         greift niemand mehr darauf zu. `force` haelt den Lauf am Leben,
         falls eine kuenftige Fassung das Verzeichnis gar nicht erst
         anlegt. */
      rmSync(path.resolve(dir, '.vite'), { recursive: true, force: true });
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
} as UserConfig);
