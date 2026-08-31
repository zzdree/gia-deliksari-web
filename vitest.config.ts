import { defineConfig } from 'vitest/config';
import path from 'node:path';

/**
 * Vitest config for component-level mutation tests.
 *
 * Runs jsdom + RTL. Fast feedback loop (no network, no Playwright).
 * Path alias matches tsconfig.json so imports of @/components/* work.
 */
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./tests/unit/setup.tsx'],
    css: false, // tailwind classes are static; no need to compile them for unit tests
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});