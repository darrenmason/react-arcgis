import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    fs: {
      allow: [
        path.resolve(__dirname, '..'),
        path.resolve(__dirname, '../node_modules')
      ]
    }
  },
  resolve: {
    alias: {
      'react-arcgis': path.resolve(__dirname, '../src')
    }
  }
});
