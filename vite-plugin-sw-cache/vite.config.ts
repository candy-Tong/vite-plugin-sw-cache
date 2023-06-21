import { defineConfig } from 'vite';


// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        register: 'src/register.ts',
        sw: 'src/sw.ts',
      },
      formats: ['es'],
      fileName(_, entryName) {
        return `${entryName}.js`;
      },
    },
    sourcemap: true,
    rollupOptions: {
      external: ['path', 'vite', 'url'],
    },
  },
});
