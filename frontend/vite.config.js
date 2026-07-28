import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/swiper')) {
            return 'vendor-swiper';
          }
          if (id.includes('node_modules/@tanstack') || id.includes('node_modules/axios')) {
            return 'vendor-query';
          }
          if (id.includes('node_modules/react-icons')) {
            return 'vendor-icons';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
