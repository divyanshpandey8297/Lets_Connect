import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // optional (default for Vite)
    proxy: {
      "/api": {
        target: "http://localhost:4200",
        changeOrigin: true
      },
      "/socket.io": {
        target: "http://localhost:4200",
        ws: true
      }
    }
  }
})
