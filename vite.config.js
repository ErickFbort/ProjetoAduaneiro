import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  base: '/static/dist/',
  build: {
    outDir: './static/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.tsx')
      },
      output: {
        manualChunks: {
          // Separar vendor libraries
          vendor: ['react', 'react-dom'],
          gsap: ['gsap'],
          // Separar componentes por funcionalidade
          cards: ['@/components/Cards'],
          news: ['@/components/News'],
          stats: ['@/components/Stats'],
          user: ['@/components/UserProfile']
        }
      }
    },
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Otimizações de bundle
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // Otimizações de desenvolvimento
  optimizeDeps: {
    include: ['react', 'react-dom', 'gsap']
  }
});
