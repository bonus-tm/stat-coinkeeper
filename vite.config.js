/// <reference types="vitest" />
import {dirname, resolve} from 'path'
import {fileURLToPath} from 'url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  server: {port: 3333},
  resolve: {
    alias: {
      '@': resolve(_dirname, './src'),
    }
  },
  plugins: [vue()],
  test: {},
})
