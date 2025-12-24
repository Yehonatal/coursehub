/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,                  // use test(), expect() without imports
    environment: 'jsdom',           // simulate browser
    setupFiles: './tests/unit/setup.ts', // optional setup file
    include: ['tests/unit/**/*.test.{ts,tsx}'], // test file pattern
  },
});
