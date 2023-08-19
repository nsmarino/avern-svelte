import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

import { resolve } from 'pathe'

export default defineConfig({
  resolve: {
    alias: {
      '/@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
    },
  },  plugins: [svelte()],
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.hdr']
})
