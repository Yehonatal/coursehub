# End-to-End (E2E) Tests – CourseHub

This folder contains **Playwright end-to-end (E2E) tests** for the CourseHub project.  
These tests simulate real user actions in the browser to verify that key workflows in the application are working correctly.

---

## Folder Structure

tests/
└─ E2E/
├─ login.test.ts # User login flow
├─ course-enroll.test.ts # Search and enroll in a course
├─ profile-update.test.ts # Update user profile information
├─ upload-resource.test.ts # Upload course resources
└─ README.md # This file

---

## Test Files Overview

### 1. `login.test.ts`

- **Purpose:** Verify that a user can log in with valid credentials.
- **Flow:**
  1. Navigate to `/login` page.
  2. Enter email and password.
  3. Submit the form.
  4. Check that the dashboard page is visible.

### 2. `course-enroll.test.ts`

- **Purpose:** Test course search and enrollment functionality.
- **Flow:**
  1. Login as a user.
  2. Navigate to `/courses`.
  3. Search for a course (e.g., "Mathematics").
  4. Click the **Enroll** button.
  5. Verify enrollment success message is visible.

### 3. `profile-update.test.ts`

- **Purpose:** Test updating user profile information.
- **Flow:**
  1. Login as a user.
  2. Navigate to `/profile`.
  3. Update full name and bio fields.
  4. Submit the form.
  5. Confirm success message appears.

### 4. `upload-resource.test.ts`

- **Purpose:** Test uploading a resource to a course.
- **Flow:**
  1. Login as a user.
  2. Navigate to `/courses/:id/resources`.
  3. Upload a file using the file input.
  4. Submit the form.
  5. Verify the resource upload success message.

---

## Dependencies

To run these tests, you need:

- **Node.js** (v18+ recommended)
- **Playwright**

```bash
npm install -D @playwright/test
```
