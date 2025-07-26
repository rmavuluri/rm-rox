import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    define: {
      'process.env.REACT_APP_OKTA_ISSUER': JSON.stringify(env.REACT_APP_OKTA_ISSUER),
      'process.env.REACT_APP_OKTA_CLIENT_ID': JSON.stringify(env.REACT_APP_OKTA_CLIENT_ID),
      'process.env.NODE_ENV': JSON.stringify(mode)
    },
    server: {
      proxy: {
      // '/api': 'http://backend:4000'
      '/api': 'http://localhost:4000'
      }
    }
  }
})