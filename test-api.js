/**
 * AmaHR Enterprise HRMS — Automated Endpoint Testing Script
 * Tests all REST API routes and displays formatted outputs in the terminal.
 * 
 * Usage: node test-api.js
 */

const BASE_URL = 'http://localhost:5000/api';

async function request(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = {
    method,
    headers,
  };
  if (body) options.body = JSON.stringify(body);

  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}${path}`, options);
    const time = Date.now() - start;
    let data;
    try {
      data = await res.json();
    } catch {
      data = await res.text();
    }
    return { status: res.status, ok: res.ok, time, data };
  } catch (err) {
    return { status: 'ERR', ok: false, time: Date.now() - start, error: err.message };
  }
}

function logResult(step, title, res) {
  const statusBadge = res.ok ? `\x1b[32m[PASS ${res.status}]\x1b[0m` : `\x1b[31m[FAIL ${res.status}]\x1b[0m`;
  console.log(`\n------------------------------------------------------------`);
  console.log(`${step}. ${title} ${statusBadge} (${res.time}ms)`);
  if (res.data) {
    const preview = typeof res.data === 'object' ? JSON.stringify(res.data, null, 2) : res.data;
    const lines = preview.split('\n');
    console.log(lines.slice(0, 15).join('\n'));
    if (lines.length > 15) {
      console.log(`   ... [truncated ${lines.length - 15} lines]`);
    }
  } else if (res.error) {
    console.log(`   \x1b[31mError:\x1b[0m ${res.error}`);
  }
}

async function runTests() {
  console.log('\x1b[36m============================================================\x1b[0m');
  console.log('\x1b[36m  🚀 AmaHR Enterprise HRMS — Full API Endpoint Test Suite   \x1b[0m');
  console.log(`  Target: ${BASE_URL}`);
  console.log('\x1b[36m============================================================\x1b[0m');

  // 1. Health Check
  const healthRes = await request('GET', '/health');
  logResult('1', 'GET /api/health (Server & DB Ping)', healthRes);

  // 2. Auth Login (HR Admin)
  const loginRes = await request('POST', '/auth/login', {
    email: 'trisha@mycomp.com',
    password: 'admin123'
  });
  logResult('2', 'POST /api/auth/login (Admin Login)', loginRes);
  const token = loginRes.data?.token;

  if (!token) {
    console.log('\x1b[31mCould not retrieve JWT token. Subsequent protected routes will fail.\x1b[0m');
  }

  // 3. Auth Me
  const meRes = await request('GET', '/auth/me', null, token);
  logResult('3', 'GET /api/auth/me (Current Authenticated User)', meRes);

  // 4. Employees List
  const empListRes = await request('GET', '/employees');
  logResult('4', 'GET /api/employees (List Employees)', empListRes);

  // 5. Employee Detail
  const empDetailRes = await request('GET', '/employees/EMP-001');
  logResult('5', 'GET /api/employees/:id (Get Single Employee EMP-001)', empDetailRes);

  // 6. Create Employee (Admin Protected)
  const createEmpRes = await request('POST', '/employees', {
    name: 'David Miller',
    email: `david.miller.${Date.now()}@mycomp.com`,
    designation: 'DevOps Specialist',
    department: 'Engineering',
    role: 'EMPLOYEE',
    monthly_salary: 88000,
    working_format: 'Hybrid',
    phone: '+91 98888 77665'
  }, token);
  logResult('6', 'POST /api/employees (Create New Employee)', createEmpRes);

  // 7. Update Employee (Admin Protected)
  const updateEmpRes = await request('PUT', '/employees/EMP-001', {
    designation: 'Principal Backend Architect'
  }, token);
  logResult('7', 'PUT /api/employees/EMP-001 (Update Designation)', updateEmpRes);

  // 8. Attendance List
  const attRes = await request('GET', '/attendance');
  logResult('8', 'GET /api/attendance (List Attendance Records)', attRes);

  // 9. Record Attendance
  const markAttRes = await request('POST', '/attendance', {
    employee_id: 'EMP-001',
    date: new Date().toISOString().split('T')[0],
    check_in: '09:00:00',
    check_out: '18:00:00',
    working_hours: '9h 00m',
    status: 'Present',
    remarks: 'Automated test check-in'
  }, token);
  logResult('9', 'POST /api/attendance (Check-In / Log Attendance)', markAttRes);

  // 10. Leaves List
  const leavesRes = await request('GET', '/leaves');
  logResult('10', 'GET /api/leaves (List Leave Applications)', leavesRes);

  // 11. Apply Leave
  const applyLeaveRes = await request('POST', '/leaves', {
    employee_id: 'EMP-001',
    leave_type: 'Casual Leave',
    start_date: '2026-10-20',
    end_date: '2026-10-21',
    reason: 'Family occasion test leave request'
  }, token);
  logResult('11', 'POST /api/leaves (Apply for Leave)', applyLeaveRes);

  // 12. Tasks List
  const tasksRes = await request('GET', '/tasks');
  logResult('12', 'GET /api/tasks (List Tasks)', tasksRes);

  // 13. Create Task
  const createTaskRes = await request('POST', '/tasks', {
    title: 'Migrate Microservice Telemetry',
    description: 'Set up OpenTelemetry logging metrics for employee service',
    assignedTo: 'EMP-001',
    priority: 'High',
    deadline: '2026-10-30',
    estimatedHours: 24,
    department: 'Engineering'
  }, token);
  logResult('13', 'POST /api/tasks (Assign New Task)', createTaskRes);

  // 14. Payroll Ledger
  const payrollRes = await request('GET', '/payroll');
  logResult('14', 'GET /api/payroll (Payroll Ledger)', payrollRes);

  // 15. Workload Health Scores
  const workloadRes = await request('GET', '/workload-health');
  logResult('15', 'GET /api/workload-health (Workload Health & Burnout Index)', workloadRes);

  console.log('\n\x1b[36m============================================================\x1b[0m');
  console.log('\x1b[32m  🎉 API Testing Completed!\x1b[0m');
  console.log('\x1b[36m============================================================\x1b[0m\n');
}

runTests();
