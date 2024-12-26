import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function excludeFastRefreshPlugin(excludeFiles: string[]) {
  return {
    name: 'exclude-fast-refresh',
    enforce: 'pre' as const,
    transform(code: string, id: string) {
      if (excludeFiles.some((file) => id.includes(file))) {
        return code.replace(/\/\*\s*@vite\/react-refresh\s*\*\//g, '');
      }
      return code;
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    excludeFastRefreshPlugin([
      'app/components/EffectsView.tsx',
      'app/components/RawWebGlCanvas.tsx',
    ]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
    },
  },
  optimizeDeps: {
    exclude: ['node_modules'],
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['node_modules'],
    },
  },
});
