import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    
  },
  resolve: {
    alias: {
      'three/build/three.webgpu.js': 'three'
    }
  },

  server: {
    host: '0.0.0.0', // This exposes the server to the local network
    allowedHosts: ['hemuserver-io.onrender.com']
  },
});
