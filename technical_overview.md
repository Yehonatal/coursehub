# CourseHub Technical Overview & Architecture

## 1. Authentication Features

### Overview
Authentication is a custom implementation using **Bcrypt** for password security and **JWT (JSON Web Tokens)** for session management. It supports Role-Based Access Control (RBAC) with three roles: `student`, `educator`, and `admin`.

### Data Flow & Logic

#### 1. Registration (`signUp`)
1.  **User Input**: First Name, Last Name, Email, Password, University, Account Type. Optional: School ID file.
2.  **Validation**: `SignUpSchema` (Zod) validates inputs. `db.select().from(users).where(eq(users.email, email))` checks for duplicates.
3.  **File Upload**: If a School ID is provided, it is uploaded to Supabase Storage via `uploadFile` (Path: `school-ids/...`).
4.  **University Association**: `ensureUniversity(name)` checks if the university exists in the DB. If not, it creates it instantly and returns the ID.
5.  **User Creation**:
    -   Password is hashed: `bcrypt.hash(password, 12)`.
    -   User is inserted into Postgres `users` table with `is_verified: false`.
6.  **Verification Token**: A random UUID is generated and stored in `verification_tokens` table with a 24h expiry.
7.  **Email**: An email with a link (`/api/verify-email?token=...`) is sent using `lib/email/client`.

#### 2. Login (`signIn`)
1.  **User Input**: Email, Password.
2.  **Authentication**:
    -   Fetches user by email.
    -   Verifies password: `bcrypt.compare`.
    -   **Gate**: Checks `user.is_verified`. If `false`, login is rejected.
3.  **Session**: Calls `createSession(user_id)` which generates a JWT and sets it as an HTTP-only cookie.
4.  **Redirect**: To `/dashboard`.

#### 3. Password Reset (`forgotPassword` & `resetPassword`)
1.  **Request**: User enters email. System looks up user.
2.  **Token**: Generates a UUID, deletes any old tokens for this user in `password_reset_tokens`, and inserts the new one (1h expiry).
3.  **Email**: Sends reset link (`/reset-password?token=...`).
4.  **Reset**:
    -   User submits new password on the landing page.
    -   System validates token existence and expiry.
    -   Updates `users.password_hash`.
    -   Deletes the used token.

#### Files & Components
-   **Backend Logic**: `app/actions/auth.ts`
-   **Database Models**: `db/schema.ts` (`users`, `verification_tokens`, `password_reset_tokens`).
-   **UI Components**: `components/auth/LoginForm.tsx`, `components/auth/RegisterForm.tsx`.
-   **Email Templates**: `lib/email/templates.ts`.

---

## 2. Upload & Resources Features

### Overview
The core of CourseHub is the resource repository. It uses a **Hybrid Storage Model**: metadata in Postgres, binaries in Supabase Storage. It supports versioning (via replacement), ratings, comments, and flagging.

### Data Flow & Logic

#### 1. Uploading Resources (`uploadResource`)
1.  **Input**: File (PDF/Docs), Title, Course Code, Description, Tags.
2.  **Pre-Check**: 
    -   Validates file type (PDF, Word, PPT).
    -   **Quota Check**: Calculates `user_quotas.storage_usage` + `file.size`. Limits: **100MB (Free)** vs **10GB (Pro)**.
3.  **Storage**:
    -   File is uploaded to Supabase Bucket `coursebucket` at path `resources/{userId}/{timestamp}-{filename}`.
    -   Returns a public URL.
4.  **Database**:
    -   Inserts record into `resources` table.
    -   Inserts/Updates `user_quotas`: increments `storage_usage`.
    -   Tags are stored as a comma-separated string `text("tags")`.

#### 2. Resource Management (Edit/Delete)
-   **Edit** (`updateResource`):
    -   If a new file is uploaded, the old file is deleted from Supabase using `deleteFile(oldPath)`.
    -   Updates metadata in DB.
-   **Delete** (`deleteResource`):
    -   Verifies ownership (`uploader_id === current_user_id`).
    -   Deletes file from Supabase.
    -   Deletes row from `resources`.
    -   Decrements `user_quotas.storage_usage`.

#### 3. Global Search (`globalSearch`)
-   **Logic**: Performs two parallel queries:
    1.  `universities`: Matches `name` or `description`.
    2.  `resources`: Matches `title`, `course_code`, or `university`.
-   **Algorithm**: Uses `ilike` (Postgres case-insensitive match). Sorts results by "Starts With" priority, then alphabetical. Returns a unified `SearchResult` array.

#### Files & Components
-   **Backend Logic**: `app/actions/resource.ts`, `app/actions/search.ts`
-   **UI Components**: 
    -   `components/resources/UploadModal.tsx` (Handles huge file uploads).
    -   `components/resources/EditResourceModal.tsx`.
    -   `components/resources/ResourceContent.tsx` (Displays PDF/Content).
    -   `components/resources/ResourceHeader.tsx` (Actions: Download, Save, Share).
-   **Database Models**: `db/schema.ts` (`resources`, `user_quotas`, `ratings`, `comments`, `report_flags`).

---

## 3. AI Features

### Overview
CourseHub functions as an "AI Study Partner". It uses **Postgres** for quota tracking and **MongoDB** for storing the complex, unstructured chat history and generated artifacts (Flashcards/Notes).

### Data Flow & Logic

#### 1. Chat Interface (`sendChatMessage`)
1.  **Input**: User message + Context (Resource content).
2.  **Quota**: Checks `user_quotas.ai_chat_count`. Free users have strict limits.
3.  **Processing**:
    -   Formats history for **Google Gemini API**.
    -   Adds a "System Instruction" context (the resource content).
    -   Streams response text.
4.  **Persistence**:
    -   Saves the exchange to MongoDB `AIChatSessions` collection (`messages`: array of user/model objects).
    -   Increments Postgres `ai_chat_count`.

#### 2. Generators (Flashcards/Notes/Trees)
-   **Triggers**: "Generate Flashcards" button on resource page.
-   **Flow**:
    1.  `createFlashcards` (server action) is called with resource text.
    2.  Calls Gemini with specific JSON-schema prompt (e.g., "Return a JSON array of front/back cards").
    3.  Validates and parses JSON response.
    4.  Saves result to MongoDB `AIGenerations` collection (linked to `resourceId`).
    5.  Increments `user_quotas.ai_generations_count`.

#### 3. Parsers
-   **OfficeParser**: Extracts raw text from `.docx` and `.pptx` files.
-   **PDF Parsing**: Done via `pdf-parse` (or similar utility in `utils/parser`) to feed text into the AI context window.

#### Files & Components
-   **Backend Logic**: `app/actions/ai.ts`.
-   **MongoDB Models**: `lib/mongodb/models.ts` (`AIChatSession`, `AIGeneration`).
-   **UI Components**:
    -   `components/ai/ChatInterface.tsx`: Main chat window.
    -   `components/ai/AIStudyAssistant.tsx`: Floating assistant.
    -   `components/ai/FlashcardModal.tsx`: Displays generated cards.
    -   `components/ai/AIUploadModal.tsx`: Upload specifically for AI analysis.

---

## 4. Premium Features

### Overview
Monetization is handled via **Chapa** (Ethiopian Payment Gateway). The system uses a "Pending -> Completed" transaction model.

### Data Flow & Logic

#### 1. Purchase Flow
1.  **Initiation** (`buyPremium`):
    -   Creates a unique `tx_ref`.
    -   Inserts a `pending` record into `transactions` table.
    -   Calls Chapa API to get a checkout URL.
    -   Redirects user to Chapa.
2.  **Verification** (`completeSubscription`):
    -   User returns to `/dashboard/settings?payment=verifying`.
    -   System verifies `tx_ref` against Chapa API (or trusts the callback).
    -   Updates `transactions` status to `completed`.
    -   Updates `users`:
        -   `subscription_status` = `'pro'`.
        -   `subscription_expiry` = `Now + 30 Days`.
    -   Sends "Welcome Premium" email.

#### 2. Quota Enforcement
-   **Storage**: Checked in `uploadResource`.
-   **AI**: Checked in `app/actions/ai.ts` -> `checkQuota`.
-   **Logic**: `user_quotas` table is the source of truth. It is NOT reset automatically yet (would require a cron job), but usually resets monthly `last_reset_date`.

#### Files & Components
-   **Backend Logic**: `app/actions/subscription.ts`.
-   **UI Components**:
    -   `components/settings/UpgradePlanModal.tsx`.
    -   `components/settings/BillingSection.tsx` (Shows transaction history).
-   **Database**: `db/schema.ts` (`transactions`, `user_quotas`).

---

## 5. Notification Features

### Overview
Notifications are **action-driven** (triggered by events) rather than real-time sockets. They cover both in-app alerts and emails.

### Data Flow & Logic
1.  **Preferences**: Stored in MongoDB `NotificationPreferences`.
    -   `emailNotifications`: Boolean.
    -   `resourceUpdates`: Boolean.
2.  **Triggering**:
    -   Function `createNotification` in `actions/notifications.ts` is called by other actions (e.g., when a resource is verified).
    -   Inserts record into `notifications` (Postgres).
    -   If priority is high (e.g., password change), it *also* calls `sendEmail`.
3.  **Viewing**:
    -   `getNotifications` fetches unwatched items from Postgres.
    -   Polled by the UI or fetched on page load.
    -   "Mark as Read" updates the `is_read` boolean.

#### Files & Components
-   **Backend Logic**: `app/actions/notifications.ts`.
-   **UI Components**: `components/settings/NotificationsSection.tsx`.
-   **Schema**: Postgres (`notifications`), Mongo (`NotificationPreferences`).

---

## 6. Presentation (UI) Features

### Component Decomposition
The UI is built using a **Atomic/Domain** hybrid structure:
-   **`/ui`**: Generic atoms (Buttons, Inputs, Dialogs) - mostly Radix UI wrappers.
-   **`/resources`**, **`/ai`**, **`/dashboard`**: Domain-specific molecules and organisms.
-   **Reasoning**: This keeps business logic close to the UI that uses it.

### Dynamic Theming Engine
**File**: `app/globals.css` + `components/providers/ThemeProvider.tsx`
-   **Mechanism**: The entire app uses CSS variables for atomic values.
    -   `--radius`: Controls border-radius (0px to 2rem).
    -   `--border-width`: Controls outline thickness.
    -   `--primary`: HSL/Oklch color values.
-   **Runtime Changes**: `ThemeProvider` context writes these variables directly to the `document.documentElement.style`. This allows instant "Theme Switching" without page reloads or CSS recompilation.
-   **Themes**: Pre-defined presets (Ocean, Forest, Midnight) sets batches of these variables.

### Data Flow on Pages
-   **Server Components** (`page.tsx`) fetch data directly from DB.
-   **Client Components** (`.tsx` with `"use client"`) receive data as props or fetch via Server Actions (`useEffect`).
-   **Streaming**: Suspense boundaries are used for heavy widgets (e.g., `ProfileStats`, `UniversityStats`).

---

## 7. Dependencies & Tools

| Tool | Why it was chosen |
| :--- | :--- |
| **Next.js 15 (App Router)** | Facilitates Server Actions (eliminating separate API layer) and simplified routing logic. |
| **Drizzle ORM** | Lightweight, type-safe SQL builder. Preferable to Prisma for cold-start performance in serverless/edge environments. |
| **Postgres (Supabase)** | Relational integrity is mandatory for User accounts, transactions, and resource ownership. |
| **MongoDB** | Schema flexibility is required for AI Chat logs (variable length/structure) and JSON-blob storage (Flashcards). |
| **TailwindCSS** | Enables the "Variables-based" theming engine. Standard classes map to dynamic variables (e.g., `bg-primary` -> `var(--primary)`). |
| **Radix UI** | Unstyled, accessible primitives. Essential for building a custom design system that doesn't look like generic Material UI or Bootstrap. |
| **Google Gemini** | Large context window (1M+ tokens) is critical for analyzing entire PDF textbooks in one pass. |
