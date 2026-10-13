# HRmanagement — 🚀 AmaHR Enterprise HRMS (PERN Stack Architecture)

**AmaHR** is a modern, production-grade **Enterprise HR Management System** built on the full **PERN Stack** (**P**ostgreSQL, **E**xpress.js, **R**eact/Universal Components, **N**ode.js).

---

## 🏛️ System Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│               Frontend Layer (React / UI)              │
│  - Reactive SPA Component Architecture                 │
│  - Workload Health Score Matrix (0-100)                │
│  - 360° Employee Profile Dossier & Attendance Tracker  │
└───────────────────────────┬────────────────────────────┘
                            │ REST API Requests (JSON / JWT)
                            ▼
┌────────────────────────────────────────────────────────┐
│          Backend Layer (Node.js & Express.js)          │
│  - Express REST API Controllers & Middleware           │
│  - JWT Authentication & RBAC (HR_ADMIN vs EMPLOYEE)    │
│  - Multer File Upload Pipeline                         │
│  - Real-time Workload Health Score Calculation Engine  │
└───────────────────────────┬────────────────────────────┘
                            │ SQL Queries (pg Pool)
                            ▼
┌────────────────────────────────────────────────────────┐
│              Database Layer (PostgreSQL)               │
│  - 7 Normalized Relational Tables + Foreign Keys       │
│  - ACID Transactions, Cascading Deletes & Audit Logs   │
│  - Automated Seed Script (schema.sql)                  │
└────────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack Details

| Layer | Technology | Key Modules / Features |
| :--- | :--- | :--- |
| **P — PostgreSQL** | PostgreSQL 15+ / 16 | Relational schema (`schema.sql`), connection pool (`pg.Pool`), normalized tables with foreign keys and constraints |
| **E — Express.js** | Express 4.19 | REST API endpoints (`/api/*`), middleware pipeline, CORS handling, error handlers |
| **R — React / Frontend** | React 18 / Vite (`client/`) | Modular React components (`client/src/components/*`), JSX views (`client/src/views/*`), Context API state (`StoreContext`), Lucide React icons, Tailwind CSS |
| **N — Node.js** | Node.js Runtime | Asynchronous I/O, Promises (`async/await`), environment variable config (`dotenv`), JWT tokens (`jsonwebtoken`) |

---

## 🗄️ PostgreSQL Database Schema (`schema.sql`)

The database consists of **7 normalized relational tables**:

1. **`employees`**: Employee profiles, roles (`HR_ADMIN`, `EMPLOYEE`), designations, department, joining date, monthly base salary (in ₹ INR), working format.
2. **`attendance`**: Daily biometric logs, check-in/out timestamps, total hours, shift types, and punctuality status.
3. **`leaves`**: Multi-day leave requests, category (`Sick`, `Casual`, `Earned`), date ranges, HR approval status, comments.
4. **`payroll`**: Comprehensive monthly payroll records with INR earnings breakdown (Basic, HRA, Allowances, Bonuses) and statutory deductions (TDS, PF).
5. **`tasks`**: Task assignment, priority, deadlines, completion progress, deliverable file submission, and 4-dimension HR ratings.
6. **`performance_reviews`**: Quarterly review appraisals, ratings, competency breakdown, and HR remarks.
7. **`audit_logs`**: Immutable enterprise system audit trail capturing user logins, approvals, and data mutations.

---

## 🔌 Express REST API Reference

### 🔐 1. Authentication
- `POST /api/auth/login`: Authenticates employee credentials and returns signed JWT token.
- `GET /api/auth/me`: Returns the authenticated user's current session profile.

### 👥 2. Employees
- `GET /api/employees`: List all employees with optional filters (`department`, `status`, `search`).
- `GET /api/employees/:id`: Retrieve full 360° employee dossier.
- `POST /api/employees`: Onboard new employee (HR Admin only).
- `PUT /api/employees/:id`: Update employee records.

### ⏱️ 3. Attendance
- `GET /api/attendance`: Filtered attendance logs by `date`, `month`, `employeeId`, or `status`.
- `POST /api/attendance`: Biometric check-in/out or manual HR attendance entry.

### 🏖️ 4. Leave Management
- `GET /api/leaves`: Query leave requests with status filters.
- `POST /api/leaves`: Submit new leave application.
- `PUT /api/leaves/:id/review`: HR Approve/Reject leave with comments.

### 📋 5. Tasks & Workload Intelligence
- `GET /api/tasks`: List deliverables and tasks.
- `POST /api/tasks`: Assign new task milestone.
- `POST /api/tasks/:id/submit`: Employee deliverable submission with file attachments and notes.
- `POST /api/tasks/:id/review`: HR score deliverable using 4-dimension rubric.
- `GET /api/workload-health`: Real-time computation of **Workload Health Score (0-100)** factoring active vs overdue tasks, overtime, leaves, and performance cushion.

### 💰 6. Payroll
- `GET /api/payroll`: Monthly payslips and salary ledger.
- `POST /api/payroll/disburse`: 1-click batch payroll disbursement with TDS/PF calculation in INR (₹).

---

## ⚡ Quick Start Guide

### 1. Configure Environment Variables
Create or verify your `.env` file:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hrms_db
PG_USER=postgres
PG_PASSWORD=postgres
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=hrms_db
JWT_SECRET=amahr_enterprise_jwt_super_secret_key_2026
```

### 2. Initialize PostgreSQL Database
Execute the SQL migration script:
```bash
# Using Node migration script
npm run db:init

# Or directly in psql terminal:
psql -U postgres -d hrms_db -f schema.sql
```

### 3. Start the Express Backend Server
```bash
npm start
```
The backend API server boots up on `http://localhost:5000` (REST API: `http://localhost:5000/api`).

### 4. Start the React (Vite) Frontend
In a new terminal:
```bash
npm run client
# Or directly inside client directory:
cd client && npm install && npm run dev
```
The React frontend starts with Vite on `http://localhost:3000` (proxied to Express backend).

### 5. Production Build
```bash
npm run build
```
Builds the React application into `client/dist`, which Express serves automatically on `http://localhost:5000`.

---

## 🎤 Manager / Viva Interview Q&A Cheatsheet

### Q1: What makes this a PERN stack application?
> **Answer**: 
> - **PostgreSQL** handles persistent relational data storage with ACID compliance, relational integrity, and foreign key constraints across 7 tables.
> - **Express.js** provides the RESTful API routing, JWT authentication middleware, and input validation layer.
> - **React / Universal Component UI** powers the dynamic, responsive frontend with live state synchronization.
> - **Node.js** serves as the asynchronous runtime powering the Express server and PostgreSQL connection pooling (`pg.Pool`).

### Q2: How does the Workload Health Score work?
> **Answer**: 
> Rather than just showing raw task counts, the system computes a multi-factor Workload Health Score (0–100) using 5 operational variables:
> 1. Active task volume overload penalty
> 2. Overdue task deadline penalty
> 3. Daily overtime strain (>9.4h/day)
> 4. Rest & recovery cycle fatigue (0 leaves taken)
> 5. High-performance cushion bonus

### Q3: Where are Promises and Async/Await used?
> **Answer**: 
> - On the backend: All database queries via `db.query()` return Promises and are awaited using `async/await`.
> - On the frontend: `apiClient.js` uses native `fetch()` Promises to handle asynchronous network requests and JSON parsing.
