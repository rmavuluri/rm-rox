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
    },
    build: {
      // Increase chunk size warning limit
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom'],
            'router-vendor': ['react-router-dom'],
            'okta-vendor': ['@okta/okta-auth-js', '@okta/okta-react'],
            'ui-vendor': ['lucide-react'],
            'utils-vendor': ['axios'],
            'flow-vendor': ['react-flow-renderer'],
            'diff-vendor': ['react-diff-viewer-continued'],
          },
          // Optimize chunk naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
            return `js/[name]-[hash].js`;
          },
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/\.(css)$/.test(assetInfo.name)) {
              return `css/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          }
        }
      },
      // Enable source maps for debugging (optional)
      sourcemap: false,
      // Minify options
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      }
    }
  }
})