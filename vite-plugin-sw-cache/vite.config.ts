import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
      },
      name: 'swCache',
    },
    sourcemap: true,
    rollupOptions: {
      external: ['path', 'vite', 'url', 'magic-string'],
    },
    minify: false,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'src/register.js',
          dest: './',
        },
        {
          src: 'src/sw.js',
          dest: './',
        },
      ],
    }),
  ],
});
