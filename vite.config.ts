import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://94.250.255.173:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
