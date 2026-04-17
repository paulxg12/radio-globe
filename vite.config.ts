import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['three', 'globe.gl'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  build: {
    target: 'esnext'
  }
})