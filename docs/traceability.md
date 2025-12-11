# Traceability Matrix (first-pass)

This document maps the SRS/SDD Functional Requirements (FR), Non-Functional Requirements (NFR), and Business Rules (BR) to the likely files and modules in this repository. This is a first-pass mapping to help examiners and my teammates find where requirements should be implemented and tested. Update entries as implementation evolves.

---

## How to read this file
- Left column: Requirement ID from the SRS/SDD.
- Right column: Suggested files/modules in this repo that implement or should implement the requirement.

> Notes: paths reference repository layout under `app/`, `lib/`, `components/`, `services/`, and `tests/`.

---

## Functional Requirements (FR)

- FR-01 (Register using email/password): `app/(auth)/register/`, `lib/supabase/auth.ts`, `lib/supabase/client.ts`, `components/forms/*`
- FR-02 (Email verification): `lib/supabase/auth.ts`, `services/notifications/*`, `app/(auth)/verify/`
- FR-03 (Login & session): `app/(auth)/login/`, `lib/supabase/auth.ts`, `proxy.ts` (session protection)
- FR-04 (Profile updates): `app/(dashboard)/dashboard/profile`, `lib/supabase/queries.ts`
- FR-05 (Student / educator verification): `app/(dashboard)/instructor/`, `services/verification/*`, `lib/supabase/queries.ts`
- FR-06 (Upload resources): `app/resources/upload/`, `lib/supabase/client.ts`, `lib/supabase/queries.ts`, `lib/supabase/storage` (if added)
- FR-07 (Require metadata tags): `app/resources/upload/`, `components/forms/*`, `lib/validators.ts`, `lib/supabase/queries.ts`
- FR-08 (Download/view content): `app/resources/[id]/`, `lib/supabase/queries.ts`, `lib/supabase/client.ts`
- FR-09 (Search & filters): `app/page.tsx` (search entry), `app/resources/`, `lib/supabase/queries.ts` (indexed queries)
- FR-10 (Ratings): `app/resources/[id]/components/ratings`, `lib/supabase/queries.ts`
- FR-11 (Comments): `app/comments/`, `components/resources/Comment*`, `lib/supabase/queries.ts`
- FR-12 (Report inappropriate): `app/resources/[id]/report`, `lib/supabase/queries.ts`, `services/moderation/*`
- FR-13 (Visibility by rating): `lib/supabase/queries.ts` (ranking logic), `app/resources/listing` (UI)
- FR-14 (Educator verification tagging): `app/resources/[id]/verify`, `lib/supabase/queries.ts`
- FR-15 (Generate AI-based notes): `components/ai/*`, `lib/ai/gemini.ts`, `lib/ai/prompts.ts`
- FR-16 (Generate flashcards & trees via Gemini): `lib/ai/flashcard.ts`, `lib/ai/gemini.ts`, `components/ai/*`
- FR-17 (Quota/subscription restrict AI): `services/subscriptions/*`, `lib/ai/gemini.ts` (quota checks), `lib/supabase/queries.ts`
- FR-18 (Email/SMS notifications): `services/notifications/*`, `lib/supabase/queries.ts`
- FR-19 (Notify on comments/ratings/verify): `services/notifications/*`, triggers in `lib/supabase/queries.ts` or DB functions
- FR-20 (Regular updates/trending): `services/analytics/*`, `app/analytics/`, background job or serverless function
- FR-21 (University dashboards): `app/dashboard/university/`, `services/analytics/*`
- FR-22 (User contribution stats): `app/dashboard/student/`, `services/analytics/*`
- FR-23 (Payment module): `services/payments/*`, `app/dashboard/subscription/`
- FR-24 (Validate subscription): `services/payments/*`, `lib/supabase/queries.ts`
- FR-25 (Restrict premium features): `proxy.ts`, `services/subscriptions/*`, `lib/ai/gemini.ts`

---

## Business Rules (BR)

- BR-01 (Auth required for upload/download): `proxy.ts`, `app/resources/*`, `lib/supabase/auth.ts`
- BR-02 (Tagging metadata required): `app/resources/upload/`, `components/forms/*`, `lib/validators.ts`
- BR-03 (Visibility uses min 3 ratings): `lib/supabase/queries.ts`, `app/resources/listing`
- BR-04 (Premium AI requires subscription): `services/subscriptions/*`, `lib/ai/*`
- BR-05 (Retention policy 1 year): `services/retention/*`, DB policy (migrations)

---

## Non-Functional Requirements (NFR)

- NFR-01 (Performance: search & nav ≤3s): implement caching and indexed DB queries in `lib/supabase/queries.ts`, server-side caching in Vercel or edge functions
- NFR-02 (Upload performance): `app/resources/upload/`, use resumable uploads where possible and show progress
- NFR-03 (AI response time): `lib/ai/gemini.ts`, ensure async handling and UI timeouts
- NFR-04..NFR-06 (usability/accessibility): `app/` UI components and `components/*`
- NFR-07..NFR-10 (security): `proxy.ts`, `lib/validators.ts`, secrets in env, password hashing and session config in `lib/supabase/auth.ts`

---

## Design Constraints & Dependencies

- DI-1 (Next.js + Tailwind): `app/`, `app/globals.css`, `postcss.config.mjs`
- DI-2 (Supabase free-tier): `lib/supabase/*` — ensure storage and request budgets in code
- DI-3 (Gemini quota): `lib/ai/gemini.ts` — rate limiting and request batching
- DI-4..DI-5 (responsive, GDPR): UI components and data-handling code across repo

---

## Tests & Verification Locations (suggested)
- Unit tests: `tests/unit/` — `lib/` utilities and adapters (e.g., `lib/ai/gemini.ts`, `lib/supabase/client.ts`)
- Integration tests: `tests/integration/` — API routes under `app/api/`, upload flow, auth flows

---
