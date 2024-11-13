import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ViteObfuscator from 'vite-plugin-obfuscator';

export default defineConfig({
  plugins: [
    react(),
   // ViteObfuscator({
     // global: true,
      //disable: false, // Enable obfuscation even in development
      //options: {
        //compact: true,
       // controlFlowFlattening: true,
       // stringArrayEncoding: ['base64'],
       // stringArrayThreshold: 0.75,
       // transformObjectKeys: true,
       //renameGlobals: true, 
     // }
   //})
  ],
  build: {
    minify: 'esbuild', // Enable minification
    sourcemap: false, // Disable source maps
  },
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

