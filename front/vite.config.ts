import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El destino del proxy se puede cambiar sin tocar el código:
//   $env:VITE_PROXY_TARGET="http://localhost:9090"; npm run dev
const objetivoApi = process.env.VITE_PROXY_TARGET ?? 'http://localhost:8080'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: objetivoApi,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
})
