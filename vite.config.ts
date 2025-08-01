import { fileURLToPath, URL } from 'node:url'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

import { crx } from '@crxjs/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import manifest from './src/manifest'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const production = mode === 'production'

  return {
    build: {
      cssCodeSplit: true,
      emptyOutDir: true,
      outDir: 'build',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/chunk-[hash].js',
        },
      },
    },
    plugins: [crx({ manifest }), vue(), obfuscatorPlugin({
      include: ['src/**/*.ts'],
      exclude: [/node_modules/, /.css/, /.html/],
      apply: 'build',
      options: {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArray: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1,
        target: 'browser',
        selfDefending: true,
      },
    }),],
    legacy: {
      skipWebSocketTokenCheck: true,
    }, resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
