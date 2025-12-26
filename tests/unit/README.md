# Unit Tests for CourseHub

This directory (`tests/unit/`) contains **unit tests** for the core logic and utilities of the CourseHub application.

Unit tests run **in complete isolation** — no browser, no real database, no network calls. They are extremely fast and focus on verifying that individual functions and modules behave exactly as expected.

## Current Status: All Tests Passing

**100% passing — no failures!**
c
As of December 26, 2025:

- **6 test files**
- **41 total tests**
- **All green and stable**

✓ tests/unit/auth.test.ts (12 tests)
✓ tests/unit/gemini.test.ts (8 tests)
✓ tests/unit/generateFlashcards.test.ts (6 tests)
✓ tests/unit/generatestudynote.test.ts (6 tests)
✓ tests/unit/helpers.test.ts (5 tests)
✓ tests/unit/quota.test.ts (8 tests)
✓ tests/unit/resource.test.ts (8 tests)

## Tested Modules

| Test File                    | Number of Tests | Purpose & Key Scenarios Covered                                                                                                                                |
| ---------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `auth.test.ts`               | 12              | JWT generation/verification, session creation/retrieval/deletion, validateRequest (including subscription expiry downgrade), getCurrentUser, invalidateSession |
| `gemini.test.ts`             | 8               | Gemini API key handling, model selection, env fallback, pre-initialized model, secure logging                                                                  |
| `generateFlashcards.test.ts` | 6               | Flashcard generation flow, malformed JSON recovery, heuristic repair, follow-up prompts, rate-limit & error handling                                           |
| `generatestudynote.test.ts`  | 6               | Study note generation pipeline, error recovery, rate limiting                                                                                                  |
| `helpers.test.ts`            | 5               | JSON extraction from LLM responses, knowledge tree node defaults                                                                                               |
| `quota.test.ts`              | 8               | Free vs Pro daily limits, quota reset on new day, new user creation, increment logic                                                                           |
| `resource.test.ts`           | 8               | Resource fetching with joins, stats aggregation (ratings, comments, views, downloads), row mapping (author/verifier/tags), resource creation with tags         |

These tests protect the most critical parts of CourseHub: AI generation, quota enforcement, authentication, and resource management.

## Dependencies

The test suite uses:

- **Vitest** – Ultra-fast testing framework built for Vite projects
- **vi** – Vitest's built-in mocking utility

No additional testing libraries are required.

Installed via:

```bash
pnpm add -D vitest
# Optional: for coverage reports
pnpm add -D @vitest/coverage-v8
```

How to Run the Tests

# Run all tests in the project (recommended)

pnpm vitest

# Run only the unit tests in this folder

pnpm vitest tests/unit

# Run a single specific test file

pnpm vitest resource.test.ts
pnpm vitest auth.test.ts

# etc.

# Watch mode – automatically re-runs tests when you save files (perfect for development)

pnpm vitest --watch

# Run with code coverage report

pnpm vitest --coverage
