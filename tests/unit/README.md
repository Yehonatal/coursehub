# Unit Tests for CourseHub

This directory contains **unit tests** for the core logic and utilities of the CourseHub application.

These tests run in isolation (no browser, no database, no network), are very fast, and ensure that individual functions and modules work correctly on their own.

## Status: All Tests Pass Successfully

**100% passing – no failures!**

Current coverage:

- 4 test files
- 10 total tests
- All green and stable

## Dependencies

- **Vitest** – The testing framework (fast, Vite-native)
- **vi** – Built-in mocking utility from Vitest
- No external testing libraries needed for these pure logic tests

Installed with:

```bash
pnpm add -D vitest


```

# Run all unit tests (recommended)

pnpm test

# Or directly target this folder

pnpm vitest run tests/unit

### How to Add It

In your terminal (inside the project folder):

```bash
touch tests/unit/README.md
```
