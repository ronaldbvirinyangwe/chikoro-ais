import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  sourcemap: false, // Disable source maps
  server: {
    proxy: {
      '/bhadhara': {
        target: 'http://localhost:3080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});

