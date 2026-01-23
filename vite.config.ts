import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  // Vercel 使用根路径，GitHub Pages 使用 /1/，Capacitor 使用 /
  base: process.env.CAPACITOR ? '/' : (process.env.VERCEL ? '/' : (process.env.NODE_ENV === 'production' ? '/1/' : '/')),
  plugins: [
    react(),
    mkcert(), // 启用 HTTPS
    VitePWA({
      registerType: 'autoUpdate', // 自动更新 Service Worker
      includeAssets: ['vite.svg'],
      manifest: {
        name: '缘心福',
        short_name: '缘心福',
        description: '极简艺术应用 - 探索莆田地区',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/1/',
        scope: '/1/',
        icons: [
          {
            src: 'vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: '/1/index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/]
      }
    })
  ],
  server: {
    port: 5173,
    host: true,
    open: true,
    https: true // 启用 HTTPS
  }
})
