# Migration Plan: Tutors Connection Platform (DRF + React Rebuild)

## 1. Executive Summary

The **Tutors Connection Platform** (also referred to as "EduConnect") is a full-stack educational web application designed to connect tutors with students and parents for personalized learning.

This migration plan outlines the architectural analysis and step-by-step Test-Driven Development (TDD) strategy to rebuild the legacy procedural PHP + MySQL + vanilla JavaScript application into a modern, decoupled full-stack architecture powered by:
- **Backend:** Python 3.11+, Django 5.x, Django REST Framework (DRF), and SQLite/PostgreSQL with Django ORM.
- **Frontend:** React 19, Vite, Tailwind CSS, Lucide icons, React Router, and Vitest/React Testing Library.
- **Testing:** Pytest, pytest-django, and Playwright for end-to-end user journeys.

---

## 2. Current Architecture & Codebase Analysis

### 2.1 Technology Stack in Legacy Application
- **Frontend:** HTML5, CSS3 (`style.css`, `notification.css`), Vanilla JavaScript (ES6 modules), FontAwesome 6, and Swiper.js.
- **Backend:** Procedural PHP scripts located in `backend/` with direct MySQL connections via `mysqli`.
- **Database:** MySQL database `tutors_platform` created on demand in `backend/Database.php`.
- **State & Auth:** Client-side `localStorage` storing user object JSON with plain password hashing via `password_hash()` in PHP, with no token expiration or signed session management.
- **Automated Tests:** None (0 tests present).

### 2.2 Data Models & Schema Inventory (from `Database.php`)
1. **`users`**:
   - `user_id` (PK, AUTO_INCREMENT)
   - `first_name` (VARCHAR 50)
   - `last_name` (VARCHAR 50)
   - `email` (VARCHAR 100, UNIQUE)
   - `password` (VARCHAR 255)
   - `role` (ENUM: 'tutor', 'parent', 'student')
   - `profile_picture_url` (VARCHAR 255)
   - `phone_number` (VARCHAR 20)
   - `address` (TEXT)
   - `created_at`, `updated_at` (TIMESTAMP)

2. **`tutor_profiles`**:
   - `tutor_id` (PK, FK -> `users.user_id` ON DELETE CASCADE)
   - `bio` (TEXT)
   - `education` (TEXT)
   - `hourly_rate` (DECIMAL 10,2)
   - `availability` (TEXT)

3. **`subjects`**:
   - `subject_id` (PK, AUTO_INCREMENT)
   - `name` (VARCHAR 100)
   - `created_at` (TIMESTAMP)

4. **`tutor_subject`**:
   - `id` (PK, AUTO_INCREMENT)
   - `tutor_id` (FK -> `users.user_id` ON DELETE CASCADE)
   - `subject_id` (FK -> `subjects.subject_id` ON DELETE CASCADE)

5. **`sessions`**:
   - `session_id` (PK, AUTO_INCREMENT)
   - `tutor_id` (FK -> `users.user_id` ON DELETE SET NULL)
   - `student_id` (FK -> `users.user_id` ON DELETE SET NULL)
   - `session_date` (DATETIME)
   - `status` (ENUM: 'scheduled', 'completed', 'cancelled', DEFAULT 'scheduled')
   - `notes` (TEXT)
   - `created_at` (TIMESTAMP)

6. **`messages`**:
   - `message_id` (PK, AUTO_INCREMENT)
   - `sender_id` (FK -> `users.user_id` ON DELETE CASCADE)
   - `receiver_id` (FK -> `users.user_id` ON DELETE CASCADE)
   - `message_content` (TEXT)
   - `created_at` (TIMESTAMP)

7. **`reviews`** (Tutor Reviews):
   - `id` (PK, AUTO_INCREMENT)
   - `tutor_id` (FK -> `users.user_id` ON DELETE SET NULL)
   - `student_id` (FK -> `users.user_id` ON DELETE SET NULL)
   - `rating` (INT)
   - `comment` (TEXT)
   - `created_at` (TIMESTAMP)

8. **`ratings_summary`**:
   - `tutor_id` (PK, FK -> `users.user_id` ON DELETE CASCADE)
   - `average_rating` (DECIMAL 3,2)
   - `total_reviews` (INT)

9. **`website_reviews`**:
   - `review_id` (PK, AUTO_INCREMENT)
   - `user_id` (FK -> `users.user_id` ON DELETE SET NULL)
   - `rating` (INT 1-5)
   - `review_text` (TEXT)
   - `created_at` (TIMESTAMP)

10. **`contact_us`**:
    - `contact_id` (PK, AUTO_INCREMENT)
    - `name` (VARCHAR 100)
    - `email` (VARCHAR 100)
    - `subject` (VARCHAR 255)
    - `message` (TEXT)
    - `created_at` (TIMESTAMP)

### 2.3 Legacy Endpoints & Business Logic
- `POST /register.php`: Creates user, validates email, hashes password, returns auto-login user payload.
- `POST /login.php`: Validates credentials, returns user payload on match.
- `GET /fetchTutors.php`: Fetches tutor list with profiles, subjects, ratings summary. Supports `?tutor_id=` and `?top_rated=1` (limit 3 ordered by rating & reviews).
- `GET /getTutorProfile.php`: Returns user and profile for a specific tutor.
- `POST /updateTutorProfile.php`: Updates personal info, tutor profile (bio, education, rate, availability), multipart image upload, and up to 7 subjects in pivot table.
- `GET /fetch_subjects.php`: Returns all available subjects.
- `GET /getTutorSubjects.php`: Returns array of subject IDs taught by a specific tutor.
- `POST /createSession.php`: Books a session with tutor_id, student_id, session_date, notes.
- `GET /fetchSessions.php`: Returns sessions where user is tutor or student.
- `POST /updateSessionStatus.php`: Updates session status (`completed`, `cancelled`).
- `POST /sendMessage.php`: Sends message from sender to receiver.
- `GET /fetchMessages.php`: Returns messages for a user.
- `GET /fetchConversation.php`: Returns 1-on-1 thread between two users.
- `POST /submitTutorReview.php`: Submits rating/review and atomically updates `ratings_summary`.
- `GET /fetchTutorReviews.php`: Returns reviews for a tutor with reviewer names.
- `POST /submitReview.php`: Submits or updates website review for a user.
- `POST /contactUs.php`: Stores contact inquiry.

---

## 3. Proposed Django REST Framework Architecture

### 3.1 Modular Django Apps
1. **`apps.accounts`**:
   - Custom User model (`AbstractBaseUser` / `AbstractUser`) with `role` (`tutor`, `student`, `parent`), contact fields, and profile picture.
   - Endpoints: `POST /api/auth/register/`, `POST /api/auth/login/`, `POST /api/auth/logout/`, `GET /api/auth/me/`.
   - Token & Session Authentication: Secure tokens with standard DRF TokenAuthentication / SessionAuthentication, returning user metadata.

2. **`apps.tutors`**:
   - Models: `TutorProfile`, `Subject`, `TutorSubject`, `RatingsSummary`.
   - Serializers: `SubjectSerializer`, `TutorProfileSerializer`, `TutorDetailSerializer`, `TutorListSerializer`.
   - Endpoints:
     * `GET /api/subjects/`: List subjects.
     * `GET /api/tutors/`: List tutors with filtering (`top_rated=true`, `subject=...`, `search=...`).
     * `GET /api/tutors/{id}/`: Tutor profile detail.
     * `PATCH /api/tutors/profile/` or `POST /api/tutors/update-profile/`: Tutor update endpoint supporting personal info, bio, education, hourly rate, availability, image upload, and subjects.

3. **`apps.sessions_app`**:
   - Model: `TutoringSession` (`tutor`, `student`, `session_date`, `status`, `notes`).
   - Business Logic: Validate session date cannot be in past, only participants can view/update.
   - Endpoints:
     * `GET /api/sessions/`: List user's sessions.
     * `POST /api/sessions/`: Book session.
     * `PATCH /api/sessions/{id}/status/`: Update status (`completed`, `cancelled`).

4. **`apps.messaging`**:
   - Model: `Message` (`sender`, `receiver`, `content`, `created_at`).
   - Endpoints:
     * `GET /api/messages/conversations/`: Get unique conversations list with last message and partner profile.
     * `GET /api/messages/{partner_id}/`: Get 1-on-1 thread.
     * `POST /api/messages/`: Send message.

5. **`apps.reviews`**:
   - Models: `TutorReview`, `WebsiteReview`, `ContactMessage`.
   - Business Logic:
     * Atomically recalculate and update `RatingsSummary` upon review creation.
     * Restrict review submission to students/parents.
     * Limit to 1 review per user per tutor.
   - Endpoints:
     * `GET /api/reviews/tutor/{tutor_id}/`: Get tutor reviews.
     * `POST /api/reviews/tutor/`: Submit tutor review.
     * `POST /api/reviews/website/`: Submit/update website review.
     * `POST /api/contact/`: Submit contact message.

---

## 4. Proposed React Frontend Architecture

### 4.1 Technology & Layout
- **Vite + React 19** with Tailwind CSS for clean, responsive styling matching EduConnect branding.
- **Routing:** React Router v7 / v6 for page navigation:
  * `/` Home (Hero, Swiper Slider, Top Rated Tutors, All Tutors, Subject tags, How it works, Footer).
  * Navigation modals & overlays for:
    - Login Modal
    - Register Modal
    - Tutor Profile Modal
    - Book Session Modal
    - My Sessions Modal / Dashboard
    - Messages / Chat Modal
    - Edit Tutor Profile Modal
    - How It Works Modal
    - Pricing Modal
    - Review Submission Modal
    - Contact Us Section / Modal
- **State & Services:**
  * `AuthContext` for login/logout/user state synced with token/storage.
  * `services/api.js`: Unified client targeting `/api/` endpoints.

---

## 5. Feature Inventory & Migration Checklist

| Feature | Legacy Status | Django DRF Target | React Target | TDD Test File | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| User Registration | Implemented | `accounts.views.RegisterView` | `RegisterModal.jsx` | `test_accounts.py` | Ready for TDD |
| User Login | Implemented | `accounts.views.LoginView` | `LoginModal.jsx` | `test_accounts.py` | Ready for TDD |
| User Profile & Auth UI | Implemented | `accounts.views.MeView` | `Navbar.jsx`, `AuthContext` | `test_accounts.py` | Ready for TDD |
| Tutor Listing & Filtering | Implemented | `tutors.views.TutorListView` | `TutorCard.jsx`, `TutorsGrid.jsx` | `test_tutors.py` | Ready for TDD |
| Top-Rated Tutors | Implemented | `tutors.views.TutorListView?top_rated=1` | `TopRatedTutors.jsx` | `test_tutors.py` | Ready for TDD |
| Subjects Listing | Implemented | `tutors.views.SubjectListView` | `SubjectsSection.jsx` | `test_tutors.py` | Ready for TDD |
| Tutor Profile Detail | Implemented | `tutors.views.TutorDetailView` | `TutorProfileModal.jsx` | `test_tutors.py` | Ready for TDD |
| Tutor Profile Edit | Implemented | `tutors.views.TutorProfileUpdateView` | `EditProfileModal.jsx` | `test_tutors.py` | Ready for TDD |
| Session Booking | Implemented | `sessions_app.views.SessionCreateView` | `BookSessionModal.jsx` | `test_sessions.py` | Ready for TDD |
| My Sessions Listing | Implemented | `sessions_app.views.SessionListView` | `SessionsModal.jsx` | `test_sessions.py` | Ready for TDD |
| Session Status Update | Implemented | `sessions_app.views.SessionStatusView`| `SessionsModal.jsx` | `test_sessions.py` | Ready for TDD |
| Conversations List | Implemented | `messaging.views.ConversationListView`| `MessagesModal.jsx` | `test_messaging.py` | Ready for TDD |
| Chat History & Send | Implemented | `messaging.views.MessageThreadView` | `ChatArea.jsx` | `test_messaging.py` | Ready for TDD |
| Tutor Reviews & Rating | Implemented | `reviews.views.TutorReviewView` | `TutorReviewsList.jsx` | `test_reviews.py` | Ready for TDD |
| Website Reviews | Implemented | `reviews.views.WebsiteReviewView` | `WebsiteReviewModal.jsx` | `test_reviews.py` | Ready for TDD |
| Contact Us Form | Implemented | `reviews.views.ContactUsView` | `ContactUsModal.jsx` | `test_reviews.py` | Ready for TDD |
| How It Works & Pricing | Static UI | Client-side modals / docs | `HowItWorksModal.jsx` | Unit / E2E | Ready for TDD |

---

## 6. Database Migration & Seeding Strategy

1. **Schema Definition:**
   - Define Django models in `backend/apps/{accounts,tutors,sessions_app,messaging,reviews}/models.py` with identical field constraints, foreign keys, and cascading behaviors.
2. **Initial Migrations:**
   - Run `python manage.py makemigrations` and `python manage.py migrate`.
3. **Data Seeding Fixture:**
   - Provide a database seeder (`seed_data.py`) with pre-populated subjects (Mathematics, Science, Languages, Computer Science, Test Preparation, Business, Physics, Chemistry, History), sample tutors with profiles and bios, and initial reviews so the app has immediate high-fidelity data upon startup.

---

## 7. Mandatory Test-Driven Development (TDD) Strategy

For every feature across backend and frontend, we strictly adhere to:
1. **RED:** Write automated test assertions defining the required behavior (status codes, response schema, validation rules, error handling). Run the test runner and verify the failure reason is expected.
2. **GREEN:** Write the minimal implementation satisfying the test. Run the test and verify it passes.
3. **REFACTOR:** Clean up code, remove redundancy, verify type safety and architecture, and re-run all regression tests.

### Test Matrix:
- **Backend Tests:**
  * `tests/test_accounts.py`: Registration, validation, password hashing, login, token auth, me endpoint.
  * `tests/test_tutors.py`: Subject listing, tutor profiles, top-rated filter, profile update, up to 7 subjects limit.
  * `tests/test_sessions.py`: Booking validation, past-date prevention, listing, status updates.
  * `tests/test_messaging.py`: Message creation, thread fetching, conversation aggregation.
  * `tests/test_reviews.py`: Rating submission, recalculation of averages and counts, duplicate prevention, contact messages.
- **Frontend Unit Tests:**
  * Component rendering, modal triggers, form validation, auth UI transitions.
- **End-to-End Tests:**
  * Full user journey: Register/Login -> Browse tutors -> View tutor profile -> Book session -> Send message -> Leave review -> Update profile.

---

## 8. Implementation Phases

- **Phase 1: Analysis & Migration Plan** (Completed - `MIGRATION_PLAN.md`).
- **Phase 2: Environment Setup & Scaffold**
  * Create backend and frontend project structures.
  * Install dependencies: `django`, `djangorestframework`, `django-cors-headers`, `pytest`, `pytest-django`, `requests`.
  * Configure Django settings, CORS, REST Framework, and test runner.
  * Verify initial test execution.
- **Phase 3: Backend TDD Development**
  * Accounts & Authentication (Red -> Green -> Refactor).
  * Tutors & Subjects (Red -> Green -> Refactor).
  * Sessions Scheduling & Management (Red -> Green -> Refactor).
  * Messaging & Conversations (Red -> Green -> Refactor).
  * Reviews & Contact Us (Red -> Green -> Refactor).
- **Phase 4: Frontend Development & API Integration**
  * Auth state & Modal system.
  * Navbar, Hero slider, and informational modals (How It Works, Pricing).
  * Tutors list, Subject filtering, and Top-rated tutors carousel/grid.
  * Tutor profile overlay, booking modal, and reviews submission.
  * Messaging overlay & chat interface.
  * My Sessions management view.
  * Tutor profile editor.
- **Phase 5: Full-Stack Integration & Dev Server**
  * Express/Vite proxy to Django REST API (or integrated API client).
  * Database seeding for immediate testing.
- **Phase 6: Final Verification & End-to-End Journey Verification**
  * Run complete backend test suite.
  * Run frontend tests.
  * Verification in browser via Playwright.
  * Document all commands in `README.md`.
