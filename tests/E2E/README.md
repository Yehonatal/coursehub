# CourseHub – Adaptive Learning Platform

CourseHub is a modern, open-source learning platform built with Next.js, designed to help students, educators, and universities share, discover, and interact with educational resources using AI-powered tools.

## Features

- User authentication (login, registration, profile management)
- Resource upload and management (PDFs, notes, presentations)
- AI-powered tools: flashcards, study notes, knowledge trees
- University-specific dashboards and resource filtering
- Search for courses/resources
- Comments, ratings, and premium feature gating
- Responsive design with dark/light mode support

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: Gemini API integration
- **File Parsing**: officeparser, pdf-parse
- **Testing**: Vitest (unit), Playwright (E2E)
- **Package Manager**: pnpm

## Testing

This project has comprehensive test coverage:

### Unit Tests (`tests/unit/`)

- Test individual functions and components in isolation
- Use Vitest + React Testing Library
- Run with: `pnpm test:unit`

### End-to-End Tests (`tests/E2E/`)

- Simulate real user flows in a browser using **Playwright**
- Cover critical journeys: registration, login, upload, view resources, AI generation, search, profile, logout

#### Available E2E Tests

| Test File                    | What It Tests                                          |
| ---------------------------- | ------------------------------------------------------ |
| login-flow.test.ts           | Successful login and dashboard redirect                |
| register-flow.test.ts        | New user registration and auto-login                   |
| resource-upload.test.ts      | Uploading a resource with title, description, file     |
| resource-view.test.ts        | Viewing resource, generating AI flashcards, commenting |
| search-and-enroll.test.ts    | Searching and accessing results                        |
| profile-update.test.ts       | Editing profile name, bio, and settings                |
| university-browse.test.ts    | Selecting university and viewing filtered content      |
| dashboard-navigation.test.ts | Dashboard stats, tabs, and internal navigation         |
| logout-premium.test.ts       | Premium gating and successful logout                   |

#### How to Run E2E Tests

1. Start the development server:
   ```bash
   pnpm dev
   ```

######

In a second terminal, run the tests:
Bash
npx playwright test tests/E2E
Debug options:
Bash
npx playwright test tests/E2E --headed # See browser
npx playwright test tests/E2E --ui # Interactive UI mode

Dependencies for Testing

@playwright/test – For E2E browser automation
vitest + @testing-library/react – For unit tests

Install browsers once:
Bash
npx playwright install

Scripts
Bash
pnpm dev # Start development server
pnpm build # Build for production
pnpm start # Run production build
pnpm test # Run all tests (unit + E2E)
pnpm test:unit # Run only unit tests
npx playwright test tests/E2E # Run E2E tests
