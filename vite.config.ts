import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon.svg'],
      manifest: {
        name: 'The Hybrid Experience',
        short_name: 'Hybrid',
        description: 'Entrena, compite y conecta con la comunidad The Hybrid Experience 2026',
        lang: 'es-MX',
        start_url: '/',
        display: 'standalone',
        background_color: '#0A0A0A',
        theme_color: '#E6F2B1',
        orientation: 'portrait-primary',
        icons: [
          { src: '/icons/icon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
        categories: ['fitness', 'sports', 'health'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        globIgnores: ['r2r/**'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
  server: {
    port: 3000,
    host: true,
  },
})
