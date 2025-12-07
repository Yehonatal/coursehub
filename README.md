# CourseHub

### System Overview (SRS)

CourseHub is an open-source, centralized adaptive learning platform designed for Ethiopian university students and educators. It centralizes curriculum-aligned resources, supports community moderation, and offers optional AI-powered study aids through the Gemini Studio API. The backend leverages Supabase for authentication, PostgreSQL database, and storage, while the frontend is built with Next.js and Tailwind CSS.

## Preview

![Dashboard Preview](./public/homepage.png)
![AI Preview](./public/ai.png)
![Profile Preview](./public/userpage.png)
![Resource Page Preview](./public/singleresourceview.png)

![Resources Preview](./public/resourcespage.png)
![Community Preview](./public/universitypage.png)



### Key Features
- **Authentication**: User registration, email verification, and session management via Supabase Auth.
- **Content Submission**: Upload educational resources (e.g., PDFs, docs) with mandatory tagging by course code, semester, and university.
- **Community Moderation**: Ratings (5-star scale), comments, reporting of inappropriate content, and educator-verified tagging for prioritized visibility.
- **AI-Powered Study Aids**: Generate study notes, flashcards, and knowledge trees using the Gemini Studio API, with quota restrictions or subscription-based access.
- **Notifications**: Email/SMS alerts for account verification, password resets, content interactions, and updates on saved or trending materials.
- **Subscription & Premium Access**: Payment module for premium AI features, validated via external gateways.
- **Analytics Dashboards**: University-specific summaries of content uploads and engagement metrics, plus personal contribution statistics.

### High-Level Workflow
1. **User Authentication & Verification**: Register, verify email, and log in to establish session.
2. **Content Upload & Tagging**: Authenticated users upload resources and apply required metadata tags.
3. **Community Moderation and Search**: Search with filters (course, university, tags, semester), rate, comment, and report content.
4. **AI Study Aid Generation**: Use Gemini API to create notes, flashcards, and knowledge trees (subject to quotas).
5. **Notifications Delivery**: Send alerts for interactions, verifications, and reminders.
6. **Optional Subscription/Payment**: Manage premium access and validate subscriptions.
7. **Analytics & Feedback Loops**: View dashboards for insights and continuous improvement.

---

**Functional Requirements (traceable FR-XX)**

- [ ] FR-01: Allow users to register using email and password.
- [ ] FR-02: Verify user accounts via email using the Notification Service.
- [ ] FR-03: Allow users to log in and maintain session state.
- [ ] FR-04: Allow users to update their profile information.
- [ ] FR-05: Differentiate students and educators via a verification process.
- [ ] FR-06: Allow authenticated users to upload educational resources (PDFs, docs).
- [ ] FR-07: Require users to tag uploaded content with course code, semester, and university.
- [ ] FR-08: Allow users to download and view publicly available content.
- [ ] FR-09: Provide advanced search filtering using course codes, university, tags, and semester.
- [ ] FR-10: Allow users to rate content on a 5-star scale.
- [ ] FR-11: Allow users to comment on content.
- [ ] FR-12: Allow users to report inappropriate or low-quality content.
- [ ] FR-13: Prioritize visibility of content with higher community ratings.
- [ ] FR-14: Allow educator-contributors to formally tag and mark content as “verified”.
- [ ] FR-15: Allow users to generate AI-based study notes from uploaded content.
- [ ] FR-16: Allow users to generate flashcards and knowledge trees via the Gemini Studio API.
- [ ] FR-17: Restrict AI-powered features to free-tier quotas or require subscription for extended use.
- [ ] FR-18: Send email or SMS notifications for account verification, password resets, and content interaction events.
- [ ] FR-19: Notify users when their content receives a comment, rating, or verification tag.
- [ ] FR-20: Send regular updates or reminders regarding saved content and trending materials.
- [ ] FR-21: Generate university-specific dashboards summarizing uploaded content and engagement metrics.
- [ ] FR-22: Allow users to view their personal content contributions and engagement statistics.
- [ ] FR-23: Support a payment module for subscription to premium AI services.
- [ ] FR-24: Validate subscription status via an external payment gateway.
- [ ] FR-25: Restrict access to premium features when subscription inactive/expired.

---

**Non-Functional Requirements (NFR)**
- [ ] NFR-01: Respond to 90% of search and page-navigation requests within 3s under typical load (≤50 concurrent active users).
- [ ] NFR-02: File uploads up to 50 MB complete within 10s in 90% of cases.
- [ ] NFR-03: AI study-aid generation completes within 15s in 90% of requests (assuming typical external latency).
- [ ] NFR-04: Support modern desktop and mobile browsers without plugins.
- [ ] NFR-05: First-time users can upload and tag a resource within 5 minutes with ≤3 navigation errors.
- [ ] NFR-06: Conform to WCAG 2.1 Level AA accessibility.
- [ ] NFR-07: All data in transit protected using HTTPS/TLS 1.2+.
- [ ] NFR-08: Store passwords as salted bcrypt hashes (work factor ≥ 12).
- [ ] NFR-09: Default session persistence up to one week; “Remember me” up to four weeks.
- [ ] NFR-10: Validate and sanitize all user inputs against SQLi, XSS, and similar vulnerabilities.

---

**Design & Implementation Constraints (DI)**
- DI-1: Frontend shall use Next.js (v13+) and Tailwind CSS (v3+).
- DI-2: Backend functionality to use Supabase free-tier (≤2 GB storage, ≤500 req/min).
- DI-3: AI integration limited to Gemini Studio API quotas (60 req/min recommended).
- DI-4: Mobile-first responsive design (320 px — 1920 px) and modern browser support.
- DI-5: Data handling must follow privacy/GDPR principles and IEEE 830 naming/doc standards.

**Dependencies**
- D1: Supabase (Auth, DB, Storage)
- D2: Gemini Studio API (AI study aids)
- D3: Notification Service (SendGrid or similar)
- D4: Vercel + GitHub Actions for deployment and CI/CD

---


### Technical Stack

#### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library with shadcn/ui
- **State Management**: React Server Components + Client Components

#### Backend
- **Database**: PostgreSQL (Supabase) + MongoDB (Analytics)
- **ORM**: Drizzle ORM for type-safe queries
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: Google Gemini Studio API

#### Infrastructure
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions
- **Package Manager**: pnpm
- **Runtime**: Node.js 22.20.0
- **TypeScript**: Strict mode configuration


#### Security Features:
- Data Isolation: Users can only see/modify their own private data
- Public Education: Core content remains accessible to all
- Fraud Prevention: No self-rating, unique constraints
- Moderation: Reporting system with educator oversight
- Subscription Control: AI features can be gated by subscription
- Admin Controls: University structure management
  
#### Performance Optimizations:
- Indexes: All foreign keys have covering indexes
- Composite Uniques: Prevent duplicate ratings/saves
- Optimized RLS: Uses (SELECT auth.uid()) for performance
- Constraint Checks: Efficient foreign key validation

### Getting Started

#### Prerequisites
- Node.js 22.20.0 or later
- pnpm package manager
- Supabase account and project
- MongoDB Atlas account
- Google Gemini API key
- SendGrid account (for notifications)

#### Environment Setup
1. Copy `env.example` to `.env.local`
2. Configure the following variables:
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_DATABASE_URL=your_database_url
   SUPABASE_DB_POOL_URL=your_pooler_url

   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # AI
   GEMINI_API_KEY=your_gemini_api_key

   # Notifications
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```

#### Database Setup
1. **Initialize MongoDB collections and indexes** (run once):
   ```bash
   pnpm run db:setup
   ```

2. **Run database migrations**:
   ```bash
   pnpm dlx drizzle-kit generate
   pnpm dlx drizzle-kit migrate
   ```

3. **Enable Row Level Security (RLS) policies** (critical for security):
   ```bash
   # Copy and run the SQL from scripts/enable-rls.sql in Supabase SQL Editor
   # This enables RLS on all tables with optimized performance policies
   ```

4. **Seed databases with initial data**:
   ```bash
   # Seed both databases
   pnpm run db:seed

   # Or seed individually
   pnpm run db:seed:pg      # PostgreSQL only
   pnpm run db:seed:mongo   # MongoDB only
   ```

   **Available Database Scripts:**
   - `pnpm run db:setup` - Initialize MongoDB collections and indexes
   - `pnpm run db:seed:pg` - Seed PostgreSQL with initial user data
   - `pnpm run db:seed:mongo` - Seed MongoDB with sample analytics data
   - `pnpm run db:seed` - Run both PostgreSQL and MongoDB seeding

#### Development
1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start development server:
   ```bash
   pnpm dev
   ```

3. Run tests:
   ```bash
   pnpm test
   ```

#### Production Deployment
- Automated CI/CD via GitHub Actions
- Deployed on Vercel with environment variables configured
- Database seeding runs automatically on deployment

