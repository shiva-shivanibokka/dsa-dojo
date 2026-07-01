import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Published to https://shiva-shivanibokka.github.io/dsa-dojo/
// so every asset must be served from that sub-path.
export default defineConfig({
  base: '/dsa-dojo/',
  plugins: [react()],
})
