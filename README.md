# WFH Attendance & Employee Monitoring App

A full-stack web application for managing Work From Home attendance with photo-based check-in and employee monitoring for HRD/Admin.

## Tech Stack

- **Backend**: NestJS + TypeScript + TypeORM + PostgreSQL + Passport JWT + Multer
- **Frontend**: React + TypeScript (Vite) + React Router + TanStack Query + Axios

## Prerequisites

- Node.js 20 LTS or newer
- PostgreSQL 14+

## Getting Started

### 1. Database Setup

Create the database:

```sql
CREATE DATABASE wfh_attendance;
```

### 2. Backend Setup

```bash
cd be
cp .env.example .env
# Edit .env with your database credentials
npm install
npm run seed       # creates admin user
npm run start:dev  # starts on http://localhost:3000
```

### 3. Frontend Setup

```bash
cd fe
cp .env.example .env
npm install
npm run dev        # starts on http://localhost:5173
```

## Default Admin Account

After running the seed script:

- **Email**: admin@company.com
- **Password**: Admin123!

## Features

### Employee View
- Daily WFH attendance check-in with photo upload
- Server-generated date/time (no client-side timestamp)
- Attendance history view
- One check-in per day enforcement

### Admin/HRD View
- Employee master data management (CRUD)
- Attendance monitoring with date range and employee filters
- Employee activation/deactivation (soft delete)
- View-only attendance records

## Environment Variables

### Backend (`be/.env`)

| Variable | Description | Default |
|---|---|---|
| PORT | Server port | 3000 |
| DATABASE_HOST | PostgreSQL host | localhost |
| DATABASE_PORT | PostgreSQL port | 5432 |
| DATABASE_USER | PostgreSQL user | postgres |
| DATABASE_PASSWORD | PostgreSQL password | postgres |
| DATABASE_NAME | Database name | wfh_attendance |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRES_IN | Token expiration | 8h |
| CORS_ORIGIN | Allowed frontend origin | http://localhost:5173 |

### Frontend (`fe/.env`)

| Variable | Description | Default |
|---|---|---|
| VITE_API_URL | Backend API URL | http://localhost:3000 |
