import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Externalize heavy deps so production static uploads stay under MCP size limits.
// index.html import map provides the runtime modules from jsDelivr ESM.
const externals = [
  'react',
  'react-dom',
  'react-dom/client',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
  'react-router-dom',
  '@supabase/supabase-js',
  'leaflet',
]

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 200,
    rolldownOptions: {
      external: externals,
    },
  },
})
