
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/mola-texture': {
        target: 'https://marsoweb.nas.nasa.gov',
        changeOrigin: true,
        secure: true,
        rewrite: () => '/globalData/images/fullscale/MOLA_cylin.jpg'
      }
    }
  }
});
