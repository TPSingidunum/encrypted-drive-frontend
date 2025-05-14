import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import ui from '@nuxt/ui/vite'

const env = loadEnv(
  "all",
  process.cwd()
);

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: parseInt(env.VITE_PORT) || 5173,
  },
  plugins: [
    vue(),
    vueDevTools(),
    ui({
        ui: {
          colors: {
            primary: 'blue',
            neutral: 'zinc'
          }
        }
      })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
