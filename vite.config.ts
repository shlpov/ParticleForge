import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ParticleForge',
      fileName: 'index',
      formats: ['es']
    },
    outDir: 'dist',
    sourcemap: true,
    emptyOutDir: true
  },
  test: {
    globals: true,
    environment: 'node'
  }
});
