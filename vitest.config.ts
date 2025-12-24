// vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';


export default defineConfig({
  

  plugins: [
    tsconfigPaths(), 
  ],

  test: {
    environment: 'jsdom',     // Needed for React component tests
    globals: true,            // Allows using test, expect, describe without imports
    // setupFiles: './tests/unit/setup.ts', // Uncomment if you have a setup file
  },
});