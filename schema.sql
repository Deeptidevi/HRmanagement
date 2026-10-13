-- ==========================================================
-- AmaHR Enterprise HR Management System — PostgreSQL Schema
-- Database: hrms_db
-- ==========================================================

-- 1. Create Tables
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS performance_reviews CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS payroll CASCADE;
DROP TABLE IF EXISTS leaves CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS employees CASCADE;

-- Employees Table
CREATE TABLE employees (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL DEFAULT 'emp123',
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(80) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'EMPLOYEE',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    join_date DATE NOT NULL,
    monthly_salary NUMERIC(12, 2) NOT NULL DEFAULT 65000.00,
    working_format VARCHAR(30) NOT NULL DEFAULT 'Office',
    phone VARCHAR(30),
    avatar_url TEXT
);

-- Attendance & Time Tracking Table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    working_hours VARCHAR(20) DEFAULT '0h 00m',
    status VARCHAR(20) NOT NULL DEFAULT 'Present',
    remarks TEXT
);

-- Leave Management Table
CREATE TABLE leaves (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) REFERENCES employees(id) ON DELETE CASCADE,
    employee_name VARCHAR(100) NOT NULL,
    leave_type VARCHAR(30) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INT NOT NULL DEFAULT 1,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending',
    applied_on DATE NOT NULL DEFAULT CURRENT_DATE,
    hr_comment TEXT
);

-- Payroll Records Table (Amounts in INR)
CREATE TABLE payroll (
    id VARCHAR(30) PRIMARY KEY,
    employee_id VARCHAR(20) REFERENCES employees(id) ON DELETE CASCADE,
    month VARCHAR(20) NOT NULL,
    base_salary NUMERIC(12, 2) NOT NULL,
    hra NUMERIC(12, 2) NOT NULL DEFAULT 0,
    special_allowance NUMERIC(12, 2) NOT NULL DEFAULT 0,
    performance_bonus NUMERIC(12, 2) NOT NULL DEFAULT 0,
    gross_earnings NUMERIC(12, 2) NOT NULL,
    unpaid_leave_deductions NUMERIC(12, 2) NOT NULL DEFAULT 0,
    tds_tax NUMERIC(12, 2) NOT NULL DEFAULT 0,
    provident_fund NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_deductions NUMERIC(12, 2) NOT NULL DEFAULT 0,
    net_salary NUMERIC(12, 2) NOT NULL,
    disbursed_status VARCHAR(20) NOT NULL DEFAULT 'Paid',
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Tasks & Milestones Table
CREATE TABLE tasks (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to VARCHAR(20) REFERENCES employees(id) ON DELETE CASCADE,
    department VARCHAR(80) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
    start_date DATE NOT NULL,
    deadline DATE NOT NULL,
    estimated_hours INT DEFAULT 20,
    status VARCHAR(30) NOT NULL DEFAULT 'In Progress',
    progress INT DEFAULT 0,
    rating NUMERIC(3, 1),
    feedback TEXT,
    submission_notes TEXT,
    submission_file VARCHAR(150)
);

-- Performance Reviews Table
CREATE TABLE performance_reviews (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) REFERENCES employees(id) ON DELETE CASCADE,
    quarter VARCHAR(20) NOT NULL,
    overall_score NUMERIC(3, 1) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    technical_skills INT NOT NULL,
    productivity INT NOT NULL,
    communication INT NOT NULL,
    leadership INT NOT NULL,
    reviewer VARCHAR(100) NOT NULL DEFAULT 'Trisha Kyrlova (Lead HR)',
    review_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    actor_name VARCHAR(100) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 2. Insert Seed Data
-- ==========================================================

-- Insert Employees
INSERT INTO employees (id, name, email, password_hash, designation, department, role, status, join_date, monthly_salary, working_format, phone, avatar_url) VALUES
('HR-001', 'Trisha Kyrlova', 'trisha@mycomp.com', 'admin123', 'Lead HR Administrator', 'Human Resources', 'HR_ADMIN', 'ACTIVE', '2023-01-15', 125000.00, 'Office', '+91 98765 43210', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
('EMP-001', 'Russel Sims', 'russel@mycomp.com', 'emp123', 'Senior Backend Engineer', 'Engineering', 'EMPLOYEE', 'ACTIVE', '2023-03-01', 95000.00, 'Office', '+91 98111 22334', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'),
('EMP-002', 'Arthur Taylor', 'arthur@mycomp.com', 'emp123', 'Senior Frontend Lead', 'Engineering', 'EMPLOYEE', 'ACTIVE', '2023-04-10', 92000.00, 'Hybrid', '+91 98222 33445', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'),
('EMP-003', 'Sarah Jenkins', 'sarah@mycomp.com', 'emp123', 'Principal UI/UX Designer', 'Design', 'EMPLOYEE', 'ACTIVE', '2023-06-20', 88000.00, 'Office', '+91 98333 44556', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'),
('EMP-004', 'Alex Morgan', 'alex@mycomp.com', 'emp123', 'Lead Product Manager', 'Product', 'EMPLOYEE', 'ACTIVE', '2023-07-15', 110000.00, 'Remote', '+91 98444 55667', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'),
('EMP-005', 'Elena Rostova', 'elena@mycomp.com', 'emp123', 'Talent Acquisition Specialist', 'Human Resources', 'EMPLOYEE', 'ACTIVE', '2023-09-01', 68000.00, 'Office', '+91 98555 66778', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'),
('EMP-006', 'Michael Chang', 'michael@mycomp.com', 'emp123', 'QA Automation Lead', 'Engineering', 'EMPLOYEE', 'ACTIVE', '2023-11-12', 78000.00, 'Office', '+91 98666 77889', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'),
('EMP-007', 'Priya Sharma', 'priya@mycomp.com', 'emp123', 'Senior Financial Analyst', 'Finance', 'EMPLOYEE', 'ACTIVE', '2024-01-08', 85000.00, 'Office', '+91 98777 88990', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150'),
('EMP-008', 'David Kim', 'david@mycomp.com', 'emp123', 'DevOps & Cloud Architect', 'Engineering', 'EMPLOYEE', 'ACTIVE', '2024-02-14', 98000.00, 'Hybrid', '+91 98888 99001', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150');

-- Insert Attendance Records (October 2026 Sample)
INSERT INTO attendance (employee_id, date, check_in, check_out, working_hours, status, remarks) VALUES
('EMP-001', '2026-10-08', '09:14:00', NULL, '3h 15m', 'Present', 'Punctual shift entry'),
('EMP-002', '2026-10-08', '08:58:00', NULL, '3h 30m', 'Present', 'Early arrival'),
('EMP-003', '2026-10-08', '09:35:00', '13:14:00', '8h 20m', 'Late', 'Traffic delay on Ring Road'),
('EMP-004', '2026-10-08', '09:02:00', NULL, '3h 25m', 'Present', 'Regular check-in'),
('EMP-005', '2026-10-08', NULL, NULL, '0h 00m', 'Leave', 'Approved Sick Leave'),
('EMP-006', '2026-10-08', '09:05:00', NULL, '3h 20m', 'Present', 'On-time biometric check-in'),
('EMP-007', '2026-10-08', '08:50:00', NULL, '3h 40m', 'Present', 'Early check-in'),
('EMP-008', '2026-10-08', NULL, NULL, '0h 00m', 'Absent', 'Unannounced absence');

-- Insert Leaves
INSERT INTO leaves (employee_id, employee_name, leave_type, start_date, end_date, days, reason, status, applied_on, hr_comment) VALUES
('EMP-005', 'Elena Rostova', 'Sick Leave', '2026-10-08', '2026-10-09', 2, 'Severe viral infection and fever.', 'Approved', '2026-10-07', 'Approved by HR. Get well soon!'),
('EMP-002', 'Arthur Taylor', 'Casual Leave', '2026-10-14', '2026-10-15', 2, 'Attending family wedding ceremony.', 'Pending', '2026-10-06', NULL),
('EMP-001', 'Russel Sims', 'Earned Leave', '2026-10-22', '2026-10-25', 4, 'Annual festive holiday with family.', 'Pending', '2026-10-05', NULL);

-- Insert Payroll (October 2026 in INR)
INSERT INTO payroll (id, employee_id, month, base_salary, hra, special_allowance, performance_bonus, gross_earnings, unpaid_leave_deductions, tds_tax, provident_fund, total_deductions, net_salary, disbursed_status, payment_date) VALUES
('PAY-2026-10-001', 'EMP-001', 'October 2026', 95000.00, 38000.00, 19000.00, 5000.00, 157000.00, 0.00, 12500.00, 4500.00, 17000.00, 140000.00, 'Paid', '2026-10-01'),
('PAY-2026-10-002', 'EMP-002', 'October 2026', 92000.00, 36800.00, 18400.00, 4500.00, 151700.00, 0.00, 11800.00, 4500.00, 16300.00, 135400.00, 'Paid', '2026-10-01'),
('PAY-2026-10-003', 'EMP-003', 'October 2026', 88000.00, 35200.00, 17600.00, 4000.00, 144800.00, 0.00, 10500.00, 4500.00, 15000.00, 129800.00, 'Paid', '2026-10-01'),
('PAY-2026-10-006', 'EMP-006', 'October 2026', 78000.00, 31200.00, 15600.00, 3000.00, 127800.00, 0.00, 8500.00, 4500.00, 13000.00, 114800.00, 'Paid', '2026-10-01');

-- Insert Tasks
INSERT INTO tasks (id, title, description, assigned_to, department, priority, start_date, deadline, estimated_hours, status, progress, rating, feedback, submission_notes, submission_file) VALUES
('TSK-103', 'Develop automated testing pipeline for payroll calculations', 'Create test fixtures for edge-case unpaid leaves and prorated salary deductions.', 'EMP-006', 'Engineering', 'Medium', '2026-10-02', '2026-10-18', 20, 'Submitted', 90, NULL, NULL, 'Complete test suite added covering 45 regression test cases.', 'payroll_suite_v2.test.js'),
('TSK-104', 'AmaHR Design System 3.0 Component Library', 'Craft high-fidelity components, glassmorphism overlays and accessible data tables.', 'EMP-003', 'Design', 'High', '2026-09-15', '2026-10-10', 35, 'Approved', 100, 5.0, 'World-class visual aesthetics and impeccable accessibility standards!', 'Figma tokens and SVG icon sets published.', 'AmaHR_DS_Tokens_v3.fig');
