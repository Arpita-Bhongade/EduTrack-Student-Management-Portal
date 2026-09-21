# EduTrack — Student Management Portal

A full-stack student management portal built for a frontend developer portfolio/interview. It demonstrates React, TypeScript, reusable frontend architecture, REST API integration, analytics, search/filtering, responsive UI, and rule-based student risk detection.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Routing: React Router
- API client: Axios
- Charts: Recharts
- Icons: Lucide React
- Backend: Node.js + Express
- Data: JSON file persistence (no database installation required)

## Features

- Demo authentication + protected routes
- Dashboard analytics
- Student CRUD
- Search, filters, sort-ready data tables
- Attendance marking
- Academic performance tracking
- Assignment tracking
- Early Warning System for at-risk students
- Responsive sidebar/dashboard UI
- REST API architecture

## Quick Start

1. Open this project folder in VS Code.
2. Open the terminal in the project root.
3. Run:

```bash
npm install
npm run dev
```

4. Open the URL shown by Vite, usually:

```text
http://localhost:5173
```

## Demo Login

- Email: `admin@edutrack.app`
- Password: `admin123`

> Demo credentials are intentionally hard-coded for this portfolio project. Do not use this authentication design in production.

## API

Backend runs on `http://localhost:5000`.

Main endpoints:

- `POST /api/auth/login`
- `GET /api/dashboard`
- `GET /api/students`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`
- `GET /api/attendance`
- `POST /api/attendance`
- `GET /api/assignments`
- `POST /api/assignments`
- `PATCH /api/assignments/:id/status`

## Interview Pitch

“EduTrack is a React and TypeScript student management dashboard that helps institutions manage students, attendance, academic performance, and assignments. I structured the UI using reusable components, integrated REST APIs with Axios, implemented client-side search/filtering, protected routes, analytics, and a rule-based Early Warning System for students with low attendance, declining academic scores, or pending assignments.”
