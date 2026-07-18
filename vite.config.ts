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
        name: 'The Hybrid Event',
        short_name: 'Hybrid',
        description: 'Entrena, compite y conecta con la comunidad The Hybrid Event 2026',
        lang: 'es-MX',
        start_url: '/',
        display: 'standalone',
        background_color: '#0A0A0A',
        theme_color: '#FF3D00',
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
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/3e9sriq7\.function2\.insforge\.app\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 300 },
            },
          },
          {
            urlPattern: /^https:\/\/api\.enforma\.mx\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'r2r-api-cache',
              expiration: { maxEntries: 30, maxAgeSeconds: 120 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 3000,
    host: true,
  },
})
