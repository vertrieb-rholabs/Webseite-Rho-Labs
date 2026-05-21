import path from 'path';
import { renameSync, rmdirSync } from 'node:fs';
import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { } from 'vite-react-ssg';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  ssgOptions: {
    entry: 'src/index.tsx',
    crittersOptions: false,
    dirStyle: 'nested',
    includedRoutes: () => Promise.resolve([
      '/',
      '/kognitives-training',
      '/evidenz',
      '/kontakt',
      '/impressum',
      '/datenschutz',
      '/404',
    ]),
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
