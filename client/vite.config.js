import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');

  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:5002';

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      // Define a minimal process.env to prevent ReferenceErrors in third-party libraries
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        VITE_BACKEND_URL: JSON.stringify(env.VITE_BACKEND_URL || '')
      }
    },
    server: {
      proxy: {
        // Proxy REST API calls
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
        // Proxy WebSocket for voice assistant
        '/api/voice/ws': {
          target: backendUrl.replace(/^http/, 'ws'),
          ws: true,
          changeOrigin: true,
          secure: false,
        },
      }
    }
  }
})

