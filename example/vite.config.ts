import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { swCache } from 'vite-plugin-sw-cache';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), swCache({
    cacheName: 'testCacheName',
  })],
});
