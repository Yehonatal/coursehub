# CourseHub – Unit Tests Overview

## Fully Passing Test Suites (Green ✅)

The following test files are **100% passing** and provide solid coverage for core functionality:

### 1. `tests/unit/mappers.test.ts` (12 tests – All Passed)

**Purpose**: Validates the data transformation and mapping logic used throughout the application.

**What it covers**:

- Correct mapping of raw data structures to domain models
- Edge cases in object transformation
- Consistency of output formats expected by the UI and AI processors

**Confidence provided**: Any refactoring of data models or mappers can be done safely knowing these transformations remain correct.

### 2. `tests/unit/generateStudyNotes.test.ts` (6 tests – All Passed)

**Purpose**: Ensures the AI-powered study notes generation works reliably and handles errors gracefully.

**Key behaviors verified**:

- Successful generation of structured study notes from input content
- Proper handling of malformed JSON responses (triggers reformat prompt retry)
- Correct error propagation:
  - Throws `RATE_LIMIT_EXCEEDED` on HTTP 503 (service unavailable / rate limit)
  - Throws generic error on network/connection failures
- Uses provided API key and model name correctly

**Confidence provided**: The study notes feature is robust against common AI API issues and will fail gracefully in production.

### 3. `tests/unit/generateKnowledgeTree.test.ts` (6 tests – All Passed)

**Purpose**: Tests the generation of hierarchical knowledge trees (concept mapping) from course material.

**Key behaviors verified**:

- Successful creation of valid knowledge tree structures
- Automatic retry with reformat prompt when initial JSON parse fails
- Proper error handling:
  - Throws `RATE_LIMIT_EXCEEDED` on 503 responses
  - Throws meaningful generic errors on network timeouts or other failures

**Confidence provided**: Knowledge tree generation is resilient and maintains data integrity even when the AI response needs correction.

## Summary of Green Suites

These three test files (total **24 passing tests**) cover:

- Critical data mapping
- Two major AI-powered features (study notes + knowledge trees)
- Robust error and retry handling for real-world API interactions

You can confidently merge changes that don’t break these tests — they protect the core user value of generating high-quality, structured learning materials from uploaded files.

---

_Note: Other test files currently have failures (helpers, flashcards, file parsing/chunking). See individual test output for details._
