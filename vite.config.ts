import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Inspect from 'vite-plugin-inspect'
import checker from 'vite-plugin-checker'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@/tests': path.resolve(__dirname, './tests'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react(),
    Inspect(),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,tsx}"',
      },
    }),
  ],
  server: {
    port: 8080,
    open: true,
  },
})
