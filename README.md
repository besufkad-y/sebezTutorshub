# EduConnect - Tutors Connection Platform

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.2-092e20.svg)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/Django_REST_Framework-3.18-red.svg)](https://www.django-rest-framework.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Pytest](https://img.shields.io/badge/Pytest-17%20Passed-brightgreen.svg)](https://docs.pytest.org/)

**EduConnect** is a modern full-stack web application designed to connect tutors with students and parents. It enables seamless tutor discovery, subject-based filtering, direct messaging, lesson scheduling with validation, profile customization, and verified review collection.

Rebuilt from the ground up from the original PHP/MySQL architecture into a robust, decoupled **Django REST Framework (DRF)** backend and high-performance **React 19 + TypeScript** frontend using strict **Red-Green-Refactor Test-Driven Development (TDD)**.

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture & Dual-Server Setup](#architecture--dual-server-setup)
- [Tech Stack](#tech-stack)
- [Project Directory Structure](#project-directory-structure)
- [Quickstart & Installation](#quickstart--installation)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup (Django REST Framework)](#1-backend-setup-django-rest-framework)
  - [2. Frontend Setup (React + Vite)](#2-frontend-setup-react--vite)
- [Running the Application](#running-the-application)
- [Database Migrations & Seeding](#database-migrations--seeding)
- [REST API Reference](#rest-api-reference)
- [Automated Testing](#automated-testing)
  - [Backend Tests (Pytest)](#backend-tests-pytest)
  - [Frontend Unit Tests](#frontend-unit-tests)
- [Git & Contribution Guide](#git--contribution-guide)

---

## Key Features

- **Multi-Role Authentication & Authorization**: Dedicated user accounts and workflows for **Students**, **Parents**, and **Tutors** with secure token authentication.
- **Tutor Directory & Smart Filtering**:
  - Filter by academic subject categories (Mathematics, Science, Languages, Computer Science, Economics, etc.).
  - Real-time keyword search across tutor names, qualifications, and bios.
  - Ranked "Top Rated Tutors" showcase based on average ratings and verified review volume.
- **Tutor Profiles & Bio Overlays**:
  - Detailed profiles showcasing education credentials, subject specializations, availability schedule, and hourly rates.
  - Student reviews list with star rating breakdowns.
- **Session Scheduling with Validation**:
  - Seamless appointment booking with calendar date/time selection.
  - Validation enforcing future dates and valid schedules.
  - Session lifecycle tracking (`scheduled`, `completed`, `cancelled`).
- **Real-Time Direct Messaging**:
  - 2-pane messaging client with conversation previews and chronological chat history.
  - Instant communication between students/parents and tutors.
- **Tutor Profile Customization**:
  - Tutors can update personal details, bio, hourly rates, availability, and profile photo.
  - Subject specialization management with strict 7-subject limit enforcement.
- **Ratings & Reviews**:
  - Verified students can leave star ratings and written reviews.
  - Automatic atomic recalculation of tutor ratings summary (`average_rating` & `total_reviews`).
  - Constraint preventing duplicate reviews from the same student for a tutor.
- **Platform Inquiries & Feedback**:
  - Overall platform rating mechanism.
  - Contact support inquiry form.

---

## Architecture & Dual-Server Setup

EduConnect runs with a decoupled frontend and backend connected through Vite's reverse proxy:

```text
               ┌────────────────────────────────────────────────────────┐
               │              Browser / User Interface                  │
               └───────────────────────────┬────────────────────────────┘
                                           │
                                           ▼ (Port 3000)
               ┌────────────────────────────────────────────────────────┐
               │                    Vite Dev Server                     │
               │  - Serves React 19 SPA (HTML, TSX, Tailwind CSS)       │
               │  - Built-in Reverse Proxy:                             │
               │    • /api/*   ──────► Forwarded to Port 8001           │
               │    • /media/* ──────► Forwarded to Port 8001           │
               └───────────────────────────┬────────────────────────────┘
                                           │ Proxy Forwarding
                                           ▼ (Port 8001)
               ┌────────────────────────────────────────────────────────┐
               │            Django REST Framework (DRF)                 │
               │  - apps.accounts     : Auth, User profiles, Tokens     │
               │  - apps.tutors       : Profiles, Subjects, Ratings     │
               │  - apps.sessions_app : Bookings & Lifecycle            │
               │  - apps.messaging    : Conversations & Direct Messages │
               │  - apps.reviews      : Reviews, Summaries & Contact    │
               │  - Database          : SQLite / PostgreSQL ORM         │
               └────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8 with Tailwind CSS v4 Vite plugin
- **Icons**: Lucide React
- **Styling**: Tailwind CSS
- **Unit Testing**: Node test runner (`node:test`) + `tsx`

### Backend
- **Framework**: Python 3.11+, Django 5.2
- **API**: Django REST Framework (DRF) 3.18
- **Authentication**: Token-based authentication (`rest_framework.authtoken`)
- **CORS**: `django-cors-headers`
- **Image Processing**: Pillow
- **Testing**: Pytest, `pytest-django`

---

## Project Directory Structure

```text
.
├── backend/                        # Django REST Framework application
│   ├── apps/
│   │   ├── accounts/               # User model, authentication & registration
│   │   ├── tutors/                 # Tutor profiles, subjects & ratings
│   │   ├── sessions_app/           # Tutoring session bookings & status
│   │   ├── messaging/              # 1-on-1 direct messaging & conversations
│   │   └── reviews/                # Tutor reviews, website reviews & contact
│   ├── config/                     # Django project configuration & settings
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── tests/                      # Pytest test suite (17 tests)
│   │   ├── conftest.py
│   │   ├── test_accounts.py
│   │   ├── test_tutors.py
│   │   ├── test_sessions.py
│   │   ├── test_messaging.py
│   │   └── test_reviews.py
│   ├── manage.py
│   ├── pytest.ini
│   ├── requirements.txt
│   └── seed_data.py                # Database population script
├── src/                            # React 19 frontend
│   ├── components/
│   │   ├── modals/                 # Feature modals (Auth, Profile, Booking, Chat, etc.)
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── HeroSlider.tsx
│   │   ├── Navbar.tsx
│   │   ├── Toast.tsx
│   │   ├── TopRatedTutors.tsx
│   │   └── TutorsSection.tsx
│   ├── context/
│   │   └── AuthContext.tsx         # User authentication state & token persistence
│   ├── services/
│   │   └── api.ts                  # Typed API client for all backend endpoints
│   ├── utils/
│   │   ├── validation.ts           # Business rules and validation utilities
│   │   └── rules.test.ts           # Frontend unit test suite
│   ├── App.tsx                     # Main application container
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Global Tailwind CSS imports
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts                  # Vite config with Django proxy & port mappings
└── README.md
```

---

## Quickstart & Installation

### Prerequisites
- **Node.js** >= 18
- **Python** >= 3.10
- **pip**

### 1. Backend Setup (Django REST Framework)

```bash
# Navigate to backend directory
cd backend

# Create and activate a Python virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python3 manage.py migrate

# Seed initial subjects and tutors
python3 seed_data.py
```

### 2. Frontend Setup (React + Vite)

From the project root directory:

```bash
# Install npm dependencies
npm install
```

---

## Running the Application

### Option A: Run Both Servers Simultaneously

1. **Start Django Backend (Port 8001)**:
   ```bash
   cd backend
   python3 manage.py runserver 127.0.0.1:8001
   ```

2. **Start Vite Dev Server (Port 3000)** (in a separate terminal):
   ```bash
   npm run dev
   ```

3. Open your browser at **`http://localhost:3000`**. Vite automatically proxies any `/api/*` and `/media/*` requests to `http://127.0.0.1:8001`.

---

## Database Migrations & Seeding

The platform includes a database seeding script (`backend/seed_data.py`) that provisions:
- **13 core academic subjects**: Mathematics, Physics, Chemistry, Biology, Computer Science, Spanish, French, History, etc.
- **6 realistic verified tutor profiles** with educational backgrounds, hourly rates, availability, ratings, and avatars.
- **Pre-configured test accounts**:
  - Student: `student@example.com` / password: `password123`
  - Parent: `parent@example.com` / password: `password123`
  - Tutor: `eleanor@tutors.org` / password: `password123`

To reset and re-seed the database at any time:
```bash
python3 backend/seed_data.py
```

---

## REST API Reference

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/auth/register/` | `POST` | Public | Register new user (`student`, `tutor`, `parent`) |
| `/api/auth/login/` | `POST` | Public | Authenticate user & receive auth token |
| `/api/auth/me/` | `GET` | Bearer/Token | Retrieve current authenticated user profile |
| `/api/auth/logout/` | `POST` | Bearer/Token | Revoke token and log out |
| `/api/subjects/` | `GET` | Public | List all available subjects |
| `/api/tutors/` | `GET` | Public | List tutors with optional filters: `?top_rated=1`, `?subject=<id>`, `?search=<term>` |
| `/api/tutors/<id>/` | `GET` | Public | Retrieve detailed tutor profile |
| `/api/tutors/<id>/subjects/` | `GET` | Public | Get subject IDs taught by a specific tutor |
| `/api/tutors/update-profile/` | `POST` | Tutor Only | Update bio, hourly rate, availability, image, and subjects (max 7) |
| `/api/sessions/` | `GET` | Authenticated | List sessions for current user (tutor or student) |
| `/api/sessions/` | `POST` | Authenticated | Book session with future date validation |
| `/api/sessions/update-status/` | `POST` | Tutor/Student | Update session status (`completed`, `cancelled`) |
| `/api/messages/` | `POST` | Authenticated | Send direct message to a user |
| `/api/messages/conversations/` | `GET` | Authenticated | List user conversations with last message preview |
| `/api/messages/<partner_id>/` | `GET` | Authenticated | Fetch chronological message thread |
| `/api/reviews/tutor/` | `POST` | Student Only | Submit star rating (1-5) and review for a tutor |
| `/api/reviews/tutor/<id>/` | `GET` | Public | Retrieve verified reviews for a tutor |
| `/api/reviews/website/` | `GET`, `POST` | Public / Auth | View and submit platform feedback |
| `/api/contact/` | `POST` | Public | Submit contact support inquiry |

---

## Automated Testing

### Backend Tests (Pytest)

The backend features 17 comprehensive test cases verifying business logic and security across all apps:

```bash
cd backend && pytest
```

```text
tests/test_accounts.py::test_user_registration_success PASSED            [  5%]
tests/test_accounts.py::test_user_registration_missing_fields PASSED     [ 11%]
tests/test_accounts.py::test_user_registration_duplicate_email PASSED    [ 17%]
tests/test_accounts.py::test_user_login_success PASSED                   [ 23%]
tests/test_accounts.py::test_user_login_invalid_credentials PASSED       [ 29%]
tests/test_messaging.py::test_send_and_fetch_messages PASSED             [ 35%]
tests/test_messaging.py::test_send_message_empty_content_fails PASSED    [ 41%]
tests/test_reviews.py::test_submit_tutor_review_and_ratings_summary_update PASSED [ 47%]
tests/test_reviews.py::test_duplicate_review_by_same_student_fails PASSED [ 52%]
tests/test_reviews.py::test_contact_us_submission PASSED                 [ 58%]
tests/test_sessions.py::test_create_session_success PASSED               [ 64%]
tests/test_sessions.py::test_create_session_past_date_fails PASSED       [ 70%]
tests/test_sessions.py::test_list_and_update_session_status PASSED       [ 76%]
tests/test_tutors.py::test_subjects_listing PASSED                       [ 82%]
tests/test_tutors.py::test_tutors_listing_and_filtering PASSED           [ 88%]
tests/test_tutors.py::test_tutor_profile_update PASSED                   [ 94%]
tests/test_tutors.py::test_tutor_profile_subjects_limit PASSED           [100%]
============================== 17 passed in 10.62s ==============================
```

### Frontend Unit Tests

```bash
npx --yes tsx --test src/utils/rules.test.ts
```

```text
TAP version 13
# Subtest: validateSessionDate rejects past dates
ok 1 - validateSessionDate rejects past dates
# Subtest: validateSessionDate accepts future dates
ok 2 - validateSessionDate accepts future dates
# Subtest: validateSubjectLimit enforces 7 subjects maximum
ok 3 - validateSubjectLimit enforces 7 subjects maximum
# Subtest: formatRating handles missing, 0, and numeric ratings
ok 4 - formatRating handles missing, 0, and numeric ratings
1..4
# tests 4 | pass 4 | fail 0
```

---

## Git & Contribution Guide

### Push to GitHub

To push changes to your GitHub repository:

```bash
# Set your remote repository URL (if not already set)
git remote add origin https://github.com/besu179/tutors-connection-platform.git

# Stage all files
git add .

# Commit changes
git commit -m "Rebuild Tutors Connection Platform: Django REST Framework + React 19"

# Push to main branch
git branch -M main
git push -u origin main
```

---

## License

This project is licensed under the [MIT License](LICENSE).
