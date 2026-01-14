
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Memastikan process.env.API_KEY tetap terbaca di client-side
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env': process.env
  },
  build: {
    outDir: 'dist',
    target: 'esnext'
  },
  server: {
    port: 3000
  }
});
