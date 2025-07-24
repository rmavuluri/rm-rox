import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
    // '/api': 'http://backend:4000'
    '/api': 'http://localhost:4000'
    }
  }
})