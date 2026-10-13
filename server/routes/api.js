const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const employeeController = require('../controllers/employeeController');
const attendanceController = require('../controllers/attendanceController');
const leaveController = require('../controllers/leaveController');
const taskController = require('../controllers/taskController');
const payrollController = require('../controllers/payrollController');
const workloadController = require('../controllers/workloadController');
const { authenticateToken, requireHRAdmin } = require('../middleware/auth');

// Auth Routes
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken, authController.getCurrentUser);

// Employee Routes
router.get('/employees', employeeController.getAllEmployees);
router.get('/employees/:id', employeeController.getEmployeeById);
router.post('/employees', authenticateToken, requireHRAdmin, employeeController.createEmployee);
router.put('/employees/:id', authenticateToken, requireHRAdmin, employeeController.updateEmployee);
router.delete('/employees/:id', employeeController.deleteEmployee);

// Attendance Routes
router.get('/attendance', attendanceController.getAttendance);
router.post('/attendance', authenticateToken, attendanceController.recordAttendance);

// Leave Routes
router.get('/leaves', leaveController.getAllLeaves);
router.post('/leaves', authenticateToken, leaveController.applyLeave);
router.put('/leaves/:id/review', authenticateToken, requireHRAdmin, leaveController.reviewLeave);

// Task Routes
router.get('/tasks', taskController.getAllTasks);
router.post('/tasks', authenticateToken, requireHRAdmin, taskController.createTask);
router.post('/tasks/:id/submit', authenticateToken, taskController.submitTaskDeliverable);
router.post('/tasks/:id/review', authenticateToken, requireHRAdmin, taskController.reviewTaskDeliverable);

// Payroll Routes
router.get('/payroll', payrollController.getAllPayroll);
router.post('/payroll/disburse', authenticateToken, requireHRAdmin, payrollController.disbursePayroll);

// Workload Health Score Route
router.get('/workload-health', workloadController.getWorkloadHealthScores);

// System Health / Ping Route
router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    system: 'AmaHR Enterprise HRMS (PERN Architecture)',
    database: 'PostgreSQL',
    backend: 'Express.js / Node.js',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
