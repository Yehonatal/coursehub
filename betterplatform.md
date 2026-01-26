# CourseHub "Study Mode" Implementation Checklist
## Phase 1: Foundation, Schema & Navigation [Backend/Architecture]

We need to support "Classes", "Tasks", "Calendar Events", and "Progress Tracking" which are central to the new mode.

- [x] **Schema Migration: User Classes & Tasks**
    - [x] Create `user_courses` table in Postgres (Drizzle) to representing a user's collection of classes.
        - Fields: `id` (uuid), `user_id`, `course_name`, `course_code` (optional link to global), `color_theme`, `semester`, `schedule_config` (JSON for recurring class times).
    - [x] Create `course_resources` join table.
        - Fields: `user_course_id`, `resource_id`, `added_at`. Links global resources to personal classes.
    - [x] Create `tasks` table in Postgres for the Planner.
        - Fields: `id`, `user_id`, `title`, `description`, `due_date`, `start_time` (for calendar), `end_time`, `status` (todo, in_progress, done), `associated_course_id`, `priority`, `reminder_at`.
    - [x] Create `study_activities` table (or Mongo collection) for **Progress Tracking**.
        - Fields: `user_id`, `type` (flashcard_session, reading, quiz), `duration_seconds`, `resource_id` (optional), `timestamp`.
    - [x] Run Drizzle migration to update DB.

- [x] **Route Configuration**
    - [x] Create a new Route Group: `app/(study)/`.
    - [x] Define routes:
        - `app/(study)/study/dashboard` (Home)
        - `app/(study)/study/planner` (Calendar & Tasks)
        - `app/(study)/study/library`
        - `app/(study)/study/progress` (Analytics)
        - `app/(study)/study/classes/[classId]`
        - `app/(study)/study/workspace/[resourceId]` (The split-screen view)

- [x] **Shared State Implementation**
    - [x] Create a `ModeContext` or use URL-based logic to track if user is in "Social" or "Study" mode.
    - [x] Implement the **"Mode Switcher"** component in the main Navbar.
        - [x] Toggle button: "Explore" (Social) vs "Focus" (Study).
        - [x] Ensure smooth transition/redirection between `/dashboard` and `/study/dashboard`.

## Phase 2: Study Mode Shell & Layout [Frontend]

Implement the "Neuroly-like" sidebar and clean layout.

- [x] **Study Layout (`app/(study)/layout.tsx`)**
    - [x] Create a distinct layout separate from the main marketing/social layout.
    - [x] **Sidebar Component**:
        - [x] Navigation Links: Home, Planner, My Library, Progress.
        - [x] **My Classes Accordion**: Fetch user's enrolled courses from `user_courses`.
        - [ ] "Add Class" Action.
        - [ ] User Profile/Upgrade footer.
    - [x] **Mobile Responsiveness**: Ensure sidebar collapses/is accessible on mobile.

## Phase 3: The "Study Home" Dashboard [Frontend]

 The landing page for Study Mode.

- [ ] **Header Section**
    - [x] Dynamic Greeting ("Good evening, [Name]").
    - [x] "Study Tools" Quick Actions Row (Icons + Labels):
        - [x] *Study Plan* (Link to Planner or AI generator).
        - [x] *Flashcards* (Link to Library filtered by flashcards).
        - [x] *Study Guide* (Trigger upload -> AI summary).
        - [x] *Record Lecture* (New feature placeholder or audio upload).
- [ ] **"Ask / Upload" Input Field**
    - [ ] Central input area handling two actions:
        1.  Text input: Sends directly to Global AI Chat.
        2.  Upload area: Drag & Drop files (Re-use `UploadModal` logic but styled inline).
- [ ] **Recents Section**
    - [ ] Query `study_activities` or `resources` for recently accessed items.
    - [ ] Display as horizontal scrollable cards.
- [ ] **Classes Grid**
    - [ ] Display cards for `user_courses`.
    - [ ] "New class" dashed card to trigger creation.

## Phase 4: The "Planner" & Calendar [Feature]

A dedicated space for task management and scheduling.

- [ ] **Calendar Integration**
    - [x] **Calendar UI**: Full-month/week view using a library (e.g., `react-big-calendar` or custom).
    - [ ] **Event Overlay**:
        - [ ] Display `tasks` with due dates on the calendar.
        - [ ] Display Class Schedules (parsed from `user_courses.schedule_config`).
    - [ ] **External Sync (Future Proofing)**: UI entry point for "Import .ICS" or "Connect Google Calendar".
- [ ] **Task Board/List**
    - [x] Kanban or List view of tasks, filterable by Course.
    - [x] **Add Task Modal**:
        - [x] Title, Date/Time, Course Link, Priority.
- [ ] **Backend Actions (`actions/planner.ts`)**
    - [ ] `createTask`, `updateTask`, `deleteTask`.
    - [ ] `getTasks(dateRange)`.

## Phase 5: Classes & Library [Integration]

Bridging the global resources into personal collections.

- [x] **Class Detail Page (`/study/classes/[id]`)**
    - [x] **Header**: Class Name, Color Theme, Progress Bar (Tasks completed for this class).
    - [x] **Resources Tab**:
        - [x] List resources linked via `course_resources`.
        - [ ] "Add Resource" button: Select from Global Library or Upload New.
    - [ ] **Assignments/Tasks Tab**: Filtered view of the Planner for this class.
- [x] **My Library Page (`/study/library`)**
    - [x] **Data Source**: Aggregated `user_courses` resources + Saved global resources + AI Artifacts.
    - [ ] **Filters**: By Class, By Type (PDF, Flashcard, Quiz), By Date.
    - [x] **UI**: Grid/List view with context menu (Move to Class, Generate AI, Delete).

## Phase 6: The "Study Workspace" (Split Screen) [Core Feature]

This is the most complex view, combining the PDF viewer and AI tools.

- [x] **Split Layout Framework**
    - [x] Implement a resizable split-pane component (Left: AI/Tools, Right: Content).
- [x] **Right Pane: Content Viewer**
    - [x] **Tabs**: Materials (PDF/Doc), Notes (Rich Text), Upload (Drag,link,type and also list materials)
    - [x] **PDF/Doc Viewer**: Embed viewer with "Sticky Note" capability.
- [x] **Left Pane: AI Study Companion**
    - [x] **Tabs Navigation**: Chat, Study Guide, Flashcards, Quiz.
    - [x] **Chat Tab**: RAG-enabled chat constrained to this document.
    - [x] **Study Guide Tab**: AI Summary view.
    - [x] **Flashcards Tab**: Spaced repetition interface.
- [ ] **Context Awareness**:
    - [ ] Ensure AI knows which Class this resource belongs to (for better prompt context).

## Phase 7: Progress Tracking [Analytics]

- [ ] **Progress Page (`/study/progress`)**
    - [ ] **Study Stats**:
        - [ ] "Time Spent Studying" (Aggregated from `study_activities`).
        - [ ] "Tasks Completed" vs "Total".
    - [ ] **Streaks**: Daily login/study streak calculation.
    - [ ] **Charts**: Bar chart of activity over the last 7/30 days.
