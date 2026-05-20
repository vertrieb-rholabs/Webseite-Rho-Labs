import path from 'path';
import { copyFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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
  plugins: [
    react(),
    {
      name: 'spa-fallback-404',
      closeBundle() {
        copyFileSync(
          path.resolve(__dirname, 'docs/index.html'),
          path.resolve(__dirname, 'docs/404.html'),
        );
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
});
