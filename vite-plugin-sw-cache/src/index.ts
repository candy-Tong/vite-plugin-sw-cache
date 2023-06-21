import { Plugin, ResolvedConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { OutputChunk } from 'rollup';
import MagicString from 'magic-string';

interface Options{
  cacheName: string
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function swCache(options: Options): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'vite-plugin-sw-cache',
    apply: 'build',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    buildStart() {
      this.emitFile({
        type: 'chunk',
        id: path.resolve(__dirname, './register'),
        fileName: 'register.js',
      });
      this.emitFile({
        type: 'chunk',
        id: path.resolve(__dirname, './sw'),
        fileName: 'sw.js',
      });
    },
    transform(code, id) {
      if (!id.includes('sw.js')) {
        return undefined;
      }
      const s = new MagicString(code);
      s.replace('<CACHE_NAME>', options.cacheName);
      return {
        code: s.toString(),
        map: s.generateMap(),
      };
    },
    transformIndexHtml(_, { bundle }) {
      const registerBundle = bundle?.['register.js'] as OutputChunk;
      if (!registerBundle) {
        throw new Error('[vite-plugin-sw-cache] 找不到 register bundle');
      }
      const code = registerBundle.code
        .replace('<SW_URL>', path.posix
          .join(config.base, '/sw.js'));
      return [
        {
          tag: 'script',
          injectTo: 'head-prepend',
          children: code,
        },
      ];
    },
    // 生成 sw.js
    // async buildEnd() {
    //   await build({
    //     build: {
    //       outDir: config.build.outDir,
    //       emptyOutDir: false,
    //       lib: {
    //         entry: resolve(__dirname, './sw.ts'),
    //         name: 'sw',
    //         formats: ['es'],
    //         fileName: 'sw.js',
    //       },
    //     },
    //   });
    // },
  };
}
