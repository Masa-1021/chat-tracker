import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-ui': ['@serendie/ui', '@serendie/symbols'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-amplify': ['aws-amplify'],
        },
      },
    },
  },
})
