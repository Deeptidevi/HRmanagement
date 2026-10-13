import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';

const StoreContext = createContext();

const STORAGE_KEY = 'AMAHR_REACT_ENTERPRISE_HRMS_V2';

const INITIAL_DATA = {
  currentUser: {
    id: 'HR-001',
    employeeId: 'EMP-000',
    name: 'Trisha Kyrlova',
    email: 'trisha.k@mycomp.com',
    role: 'HR_ADMIN',
    designation: 'Lead HR & People Operations',
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE'
  },
  employees: [
    {
      id: 'EMP-001',
      name: 'Russel Sims',
      firstName: 'Russel',
      lastName: 'Sims',
      email: 'russel@mycomp.com',
      phone: '+1 (555) 234-8901',
      role: 'EMPLOYEE',
      designation: 'Backend Developer',
      department: 'Engineering',
      joiningDate: '2023-04-15',
      workingFormat: 'Hybrid',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      basicSalary: 65000,
      hra: 26000,
      allowances: 12000,
      bonuses: 8000,
      taxPercent: 12,
      daysInCompany: 418
    },
    {
      id: 'EMP-002',
      name: 'Arthur Taylor',
      firstName: 'Arthur',
      lastName: 'Taylor',
      email: 'arthur.t@mycomp.com',
      phone: '+1 (555) 345-6789',
      role: 'EMPLOYEE',
      designation: 'Senior Frontend Lead',
      department: 'Engineering',
      joiningDate: '2022-09-01',
      workingFormat: 'Office',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      basicSalary: 85000,
      hra: 34000,
      allowances: 15000,
      bonuses: 12000,
      taxPercent: 15,
      daysInCompany: 760
    },
    {
      id: 'EMP-003',
      name: 'Sarah Jenkins',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 'sarah.j@mycomp.com',
      phone: '+1 (555) 456-7890',
      role: 'EMPLOYEE',
      designation: 'Principal UI/UX Designer',
      department: 'Design',
      joiningDate: '2023-01-10',
      workingFormat: 'Hybrid',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      basicSalary: 72000,
      hra: 28800,
      allowances: 14000,
      bonuses: 10000,
      taxPercent: 12,
      daysInCompany: 512
    },
    {
      id: 'EMP-004',
      name: 'Alex Morgan',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex.m@mycomp.com',
      phone: '+1 (555) 567-8901',
      role: 'EMPLOYEE',
      designation: 'Lead Product Manager',
      department: 'Product',
      joiningDate: '2022-06-15',
      workingFormat: 'Office',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      basicSalary: 95000,
      hra: 38000,
      allowances: 20000,
      bonuses: 15000,
      taxPercent: 18,
      daysInCompany: 840
    },
    {
      id: 'EMP-005',
      name: 'Elena Rostova',
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'elena.r@mycomp.com',
      phone: '+1 (555) 678-9012',
      role: 'EMPLOYEE',
      designation: 'QA Automation Engineer',
      department: 'Engineering',
      joiningDate: '2023-08-20',
      workingFormat: 'Remote',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      basicSalary: 58000,
      hra: 23200,
      allowances: 10000,
      bonuses: 5000,
      taxPercent: 10,
      daysInCompany: 290
    }
  ],
  tasks: [
    {
      id: 'TSK-101',
      title: 'PostgreSQL Relational DB Migration & Indexes',
      description: 'Implement normalized schema for employees, attendance, and payroll with foreign key constraints.',
      department: 'Engineering',
      assignedTo: 'EMP-001',
      priority: 'Urgent',
      status: 'Approved',
      deadline: '2026-10-14',
      createdAt: '2026-10-01',
      rating: 4.8,
      feedback: 'Excellent schema normalization and ACID compliant transaction safety.',
      submission: {
        submittedAt: '2026-10-11T14:30:00Z',
        notes: 'Migration scripts tested successfully with cascading deletes.',
        fileName: 'schema_v2_migration.sql'
      }
    },
    {
      id: 'TSK-102',
      title: 'Full PERN Universal UI Component Architecture',
      description: 'Convert monolithic interface into modular React components with hooks, state, and Lucide icons.',
      department: 'Engineering',
      assignedTo: 'EMP-002',
      priority: 'High',
      status: 'In Progress',
      deadline: '2026-10-18',
      createdAt: '2026-10-05',
      rating: null,
      feedback: '',
      submission: null
    },
    {
      id: 'TSK-103',
      title: 'Executive Design System & Micro-animations',
      description: 'Refine Tailwind color tokens, custom scrollbars, and card micro-interactions for modern aesthetic.',
      department: 'Design',
      assignedTo: 'EMP-003',
      priority: 'Medium',
      status: 'Submitted',
      deadline: '2026-10-15',
      createdAt: '2026-10-04',
      rating: null,
      feedback: '',
      submission: {
        submittedAt: '2026-10-11T17:15:00Z',
        notes: 'All interactive states and responsive breakpoints styled.',
        fileName: 'design_tokens_v2.fig'
      }
    },
    {
      id: 'TSK-104',
      title: 'Q4 Product Roadmap & Feature Backlog',
      description: 'Prioritize enterprise modules including automated payroll disbursement and multi-tier leave approval.',
      department: 'Product',
      assignedTo: 'EMP-004',
      priority: 'High',
      status: 'In Progress',
      deadline: '2026-10-20',
      createdAt: '2026-10-08',
      rating: null,
      feedback: '',
      submission: null
    }
  ],
  attendance: [
    { id: 'ATT-001', employeeId: 'EMP-001', date: new Date().toISOString().split('T')[0], checkIn: '09:05 AM', checkOut: '06:15 PM', workingHours: '9.2 hrs', status: 'Present', shift: 'Morning Shift' },
    { id: 'ATT-002', employeeId: 'EMP-002', date: new Date().toISOString().split('T')[0], checkIn: '09:12 AM', checkOut: '06:30 PM', workingHours: '9.3 hrs', status: 'Present', shift: 'Morning Shift' },
    { id: 'ATT-003', employeeId: 'EMP-003', date: new Date().toISOString().split('T')[0], checkIn: '09:35 AM', checkOut: '06:40 PM', workingHours: '9.1 hrs', status: 'Late', shift: 'Morning Shift' },
    { id: 'ATT-004', employeeId: 'EMP-004', date: new Date().toISOString().split('T')[0], checkIn: '08:55 AM', checkOut: '05:50 PM', workingHours: '8.9 hrs', status: 'Present', shift: 'Morning Shift' },
    { id: 'ATT-005', employeeId: 'EMP-005', date: new Date().toISOString().split('T')[0], checkIn: '09:00 AM', checkOut: '06:00 PM', workingHours: '9.0 hrs', status: 'Present', shift: 'Remote Shift' }
  ],
  leaves: [
    { id: 'LV-201', employeeId: 'EMP-003', employeeName: 'Sarah Jenkins', type: 'Casual', category: 'Casual', fromDate: '2026-10-22', toDate: '2026-10-23', days: 2, reason: 'Family engagement', status: 'Pending', hrComment: '' },
    { id: 'LV-202', employeeId: 'EMP-005', employeeName: 'Elena Rostova', type: 'Sick', category: 'Sick', fromDate: '2026-10-05', toDate: '2026-10-06', days: 2, reason: 'Viral fever recovery', status: 'Approved', hrComment: 'Approved. Get well soon!' },
    { id: 'LV-203', employeeId: 'EMP-001', employeeName: 'Russel Sims', type: 'Earned', category: 'Earned', fromDate: '2026-09-12', toDate: '2026-09-15', days: 4, reason: 'Annual vacation', status: 'Approved', hrComment: 'Enjoy your vacation.' }
  ],
  payroll: [
    { id: 'PAY-1001', month: 'September 2026', totalEmployees: 5, totalDisbursed: 428500, disbursedAt: '2026-09-30', status: 'Disbursed' }
  ],
  documents: [
    { id: 'DOC-1', title: 'Enterprise Employment Contract', category: 'Contracts', employeeId: 'EMP-001', uploadedAt: '2026-04-15', status: 'Verified', size: '2.4 MB' },
    { id: 'DOC-2', title: 'Non-Disclosure Agreement (NDA)', category: 'Contracts', employeeId: 'ALL', uploadedAt: '2026-01-01', status: 'Mandatory', size: '1.1 MB' },
    { id: 'DOC-3', title: 'Income Tax Declaration FY 26-27', category: 'Identity Documents', employeeId: 'EMP-002', uploadedAt: '2026-05-10', status: 'Verified', size: '3.8 MB' },
    { id: 'DOC-4', title: 'AmaHR Code of Conduct & Ethics', category: 'Company Documents', employeeId: 'ALL', uploadedAt: '2026-01-10', status: 'Active', size: '4.2 MB' }
  ],
  announcements: [
    { id: 'ANN-1', title: 'AmaHR PERN Stack 2.0 Upgrade Completed', description: 'The entire enterprise HR system has migrated to PostgreSQL, Express.js, React JSX Universal Components, and Node.js.', priority: 'High', audience: 'All Employees', author: 'Trisha Kyrlova (HR Lead)', publishDate: '2026-10-12', expiryDate: '2026-10-31' },
    { id: 'ANN-2', title: 'Diwali Festive Holiday Schedule Announced', description: 'Office operations will remain closed from October 28 to November 2. Please plan deliverables accordingly.', priority: 'Medium', audience: 'All Employees', author: 'People Operations', publishDate: '2026-10-10', expiryDate: '2026-11-05' }
  ],
  notifications: [
    { id: 'NOTIF-1', title: 'Task Approved', message: 'Your task "PostgreSQL Relational DB Migration" was approved with 4.8 / 5.0 score.', time: '2 hours ago', read: false, type: 'task', link: 'tasks' },
    { id: 'NOTIF-2', title: 'Leave Request Received', message: 'Sarah Jenkins applied for 2 days Casual Leave.', time: 'Yesterday', read: false, type: 'leave', link: 'leaves' }
  ],
  auditLogs: [
    { id: 'LOG-501', user: 'Trisha Kyrlova (HR)', action: 'TASK_REVIEWED', details: 'Approved task TSK-101 for Russel Sims with rating 4.8', timestamp: '2026-10-12 10:15:30' },
    { id: 'LOG-502', user: 'System', action: 'DATABASE_SEED', details: 'PostgreSQL relational tables synchronized', timestamp: '2026-10-12 09:30:00' }
  ],
  settings: {
    organizationName: 'AmaHR Global Technologies Inc.',
    workStartTime: '09:00',
    workEndTime: '18:00',
    lateThresholdMinutes: 15,
    monthlyWorkingDays: 22,
    weights: { tasks: 50, attendance: 20, onTime: 15, feedback: 15 },
    leaveQuotas: { casual: 12, sick: 10, earned: 15, unpaid: 30 }
  }
};

export function StoreProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_DATA;
    } catch {
      return INITIAL_DATA;
    }
  });

  const [toasts, setToasts] = useState([]);
  const [backendConnected, setBackendConnected] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to sync to localStorage', err);
    }
  }, [data]);

  // Check Backend Connection & Initial Load from Express / PostgreSQL
  useEffect(() => {
    async function initBackend() {
      try {
        const isUp = await apiClient.checkBackendStatus();
        if (isUp) {
          setBackendConnected(true);
          // Attempt to load live employees and tasks from Postgres
          try {
            const empRes = await apiClient.getEmployees();
            if (empRes?.success && empRes?.data?.length > 0) {
              setData(prev => ({ ...prev, employees: empRes.data }));
            }
          } catch (e) {
            console.log('Using initial employees', e);
          }
        }
      } catch {
        setBackendConnected(false);
      }
    }
    initBackend();
  }, []);

  // Toast Helper
  const showToast = (title, message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // User & Role Switching (Switch any Employee ID or HR Admin)
  const switchUser = (identifier) => {
    setIsLoggedOut(false);
    if (identifier === 'HR_ADMIN' || identifier === 'HR-001' || identifier === 'EMP-000') {
      setData(prev => ({
        ...prev,
        currentUser: INITIAL_DATA.currentUser
      }));
      showToast('Active Persona', 'Logged in as Trisha Kyrlova (HR Administrator)', 'success');
      return;
    }

    const emp = data.employees.find(e => e.id === identifier || e.email === identifier) ||
      INITIAL_DATA.employees.find(e => e.id === identifier);

    if (emp) {
      setData(prev => ({
        ...prev,
        currentUser: {
          ...emp,
          role: 'EMPLOYEE',
          employeeId: emp.id
        }
      }));
      showToast('Active Persona', `Active as ${emp.name} (${emp.id} · ${emp.designation})`, 'info');
    } else {
      showToast('User Not Found', `Employee ID ${identifier} not found in roster.`, 'amber');
    }
  };

  const switchRole = (role, specificId) => {
    if (role === 'HR_ADMIN') {
      switchUser('HR_ADMIN');
    } else {
      const targetId = specificId || (data.currentUser?.role === 'EMPLOYEE' ? data.currentUser.id : 'EMP-001');
      switchUser(targetId);
    }
  };

  const logout = () => {
    apiClient.setToken(null);
    setIsLoggedOut(true);
    showToast('Signed Out', 'Session ended. Choose an Employee ID or HR persona to resume.', 'info');
  };

  const loginWithCredentials = async (email, password) => {
    try {
      const res = await apiClient.login(email, password);
      if (res?.success) {
        if (res.user?.role === 'HR_ADMIN') {
          switchUser('HR_ADMIN');
        } else {
          switchUser(res.user?.id || 'EMP-001');
        }
        setIsLoggedOut(false);
        showToast('Login Successful', `Welcome back, ${res.user?.name || 'User'}!`, 'success');
        return { success: true };
      }
    } catch (err) {
      // Fallback for demo if offline/demo credentials
      const lower = email.toLowerCase().trim();
      if (lower.includes('trisha') || lower.includes('admin') || password === 'admin123') {
        switchUser('HR_ADMIN');
        setIsLoggedOut(false);
        showToast('Welcome HR Admin', 'Logged in successfully (Demo Mode)', 'success');
        return { success: true };
      }
      const matched = data.employees.find(e => e.email.toLowerCase() === lower || e.id.toLowerCase() === lower);
      if (matched) {
        switchUser(matched.id);
        setIsLoggedOut(false);
        showToast('Welcome', `Logged in as ${matched.name} (Demo Mode)`, 'success');
        return { success: true };
      }
      showToast('Login Failed', err.message || 'Invalid email or password.', 'rose');
      return { success: false, error: err.message };
    }
  };

  // Employees Actions
  const addEmployee = async (newEmp) => {
    const id = `EMP-00${data.employees.length + 1}`;
    const empRecord = {
      ...newEmp,
      id,
      status: 'ACTIVE',
      daysInCompany: 1,
      joiningDate: new Date().toISOString().split('T')[0],
      avatar: newEmp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };

    setData(prev => ({
      ...prev,
      employees: [empRecord, ...prev.employees],
      auditLogs: [
        {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          user: prev.currentUser.name,
          action: 'EMPLOYEE_ONBOARDED',
          details: `Added new employee ${empRecord.name} (${empRecord.designation})`,
          timestamp: new Date().toLocaleString()
        },
        ...prev.auditLogs
      ]
    }));

    showToast('Employee Added', `${empRecord.name} has been onboarded successfully.`, 'success');
  };

  const updateEmployee = (id, updatedFields) => {
    setData(prev => ({
      ...prev,
      employees: prev.employees.map(e => e.id === id ? { ...e, ...updatedFields } : e)
    }));
    showToast('Profile Updated', 'Employee details have been saved.', 'success');
  };

  const deleteEmployee = async (id) => {
    const emp = data.employees.find(e => e.id === id);
    const empName = emp?.name || id;

    setData(prev => ({
      ...prev,
      employees: prev.employees.filter(e => e.id !== id),
      auditLogs: [
        {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          user: prev.currentUser.name,
          action: 'EMPLOYEE_OFFBOARDED',
          details: `Offboarded / Removed employee ${empName} (${id})`,
          timestamp: new Date().toLocaleString()
        },
        ...prev.auditLogs
      ]
    }));

    try {
      await apiClient.deleteEmployee(id);
    } catch (err) {
      console.warn('[PERN Sync] Backend delete employee note:', err.message);
    }

    showToast('Employee Offboarded', `${empName} (${id}) removed from active directory.`, 'rose');
  };

  // Task Actions
  const createTask = async (newTask) => {
    const id = `TSK-${data.tasks.length + 101}`;
    const taskRecord = {
      ...newTask,
      id,
      status: 'In Progress',
      createdAt: new Date().toISOString().split('T')[0],
      rating: null,
      feedback: '',
      submission: null
    };

    setData(prev => ({
      ...prev,
      tasks: [taskRecord, ...prev.tasks],
      notifications: [
        {
          id: `NOTIF-${Date.now()}`,
          title: 'New Task Assigned',
          message: `Task: ${taskRecord.title}`,
          time: 'Just now',
          read: false,
          type: 'task',
          link: 'tasks'
        },
        ...prev.notifications
      ]
    }));

    showToast('Task Created', `Task "${taskRecord.title}" assigned successfully.`, 'success');
  };

  const submitTask = async (taskId, submissionData) => {
    const task = data.tasks.find(t => t.id === taskId);
    const emp = data.employees.find(e => e.id === task?.assignedTo) || { name: data.currentUser.name || 'Employee' };
    const taskTitle = task?.title || taskId;

    const newNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: 'Task Deliverable Submitted',
      message: `${emp.name} submitted work deliverable for "${taskTitle}".`,
      time: 'Just now',
      read: false,
      type: 'task',
      link: 'tasks',
      taskId: taskId
    };

    const newAudit = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user: emp.name,
      action: 'TASK_SUBMITTED',
      details: `Submitted work for ${taskTitle} (${submissionData.fileName || 'bundle.zip'})`,
      timestamp: new Date().toLocaleString()
    };

    setData(prev => {
      const otherTasks = prev.tasks.filter(t => t.id !== taskId);
      const targetTask = prev.tasks.find(t => t.id === taskId);
      const updatedTarget = targetTask ? {
        ...targetTask,
        status: 'Submitted',
        submission: {
          ...submissionData,
          submittedAt: new Date().toISOString(),
        }
      } : null;

      return {
        ...prev,
        tasks: updatedTarget ? [updatedTarget, ...otherTasks] : prev.tasks,
        notifications: [newNotification, ...prev.notifications],
        auditLogs: [newAudit, ...prev.auditLogs]
      };
    });

    // Sync to backend Express / PostgreSQL database
    try {
      await apiClient.submitTask(taskId, submissionData);
    } catch (err) {
      console.warn('[PERN Sync] Note on backend submit sync:', err.message);
    }

    showToast('Deliverable Submitted', `Task "${taskTitle}" submitted to HR for evaluation.`, 'success');
  };

  const reviewTask = async (taskId, rating, feedback) => {
    const task = data.tasks.find(t => t.id === taskId);
    const taskTitle = task?.title || taskId;
    const isApproved = Number(rating) >= 3;

    const newNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: isApproved ? 'Task Approved' : 'Rework Requested',
      message: `HR reviewed "${taskTitle}" with score ${rating} / 5.0.`,
      time: 'Just now',
      read: false,
      type: 'task',
      link: 'tasks',
      taskId: taskId
    };

    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status: isApproved ? 'Approved' : 'Rework Required',
            rating: Number(rating),
            feedback
          };
        }
        return t;
      }),
      notifications: [newNotification, ...prev.notifications],
      auditLogs: [
        {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          user: prev.currentUser.name,
          action: 'TASK_REVIEWED',
          details: `Evaluated ${taskTitle} with score ${rating}/5.0`,
          timestamp: new Date().toLocaleString()
        },
        ...prev.auditLogs
      ]
    }));

    // Sync to backend Express / PostgreSQL database
    try {
      await apiClient.reviewTask(taskId, { rating: Number(rating), feedback });
    } catch (err) {
      console.warn('[PERN Sync] Note on backend review sync:', err.message);
    }

    showToast('Task Evaluated', `Review saved with score ${rating}/5.0.`, 'success');
  };

  // Attendance Actions
  const markCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const empId = data.currentUser.employeeId || data.currentUser.id;

    setData(prev => {
      const existing = prev.attendance.find(a => a.employeeId === empId && a.date === today);
      if (existing) {
        return prev;
      }
      const newAtt = {
        id: `ATT-${Date.now().toString().slice(-4)}`,
        employeeId: empId,
        date: today,
        checkIn: timeString,
        checkOut: null,
        workingHours: 'In Progress',
        status: 'Present',
        shift: 'General Shift'
      };
      return {
        ...prev,
        attendance: [newAtt, ...prev.attendance]
      };
    });

    showToast('Checked In', `Good morning! Check-in recorded at ${timeString}.`, 'success');
  };

  const markCheckOut = () => {
    const today = new Date().toISOString().split('T')[0];
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const empId = data.currentUser.employeeId || data.currentUser.id;

    setData(prev => ({
      ...prev,
      attendance: prev.attendance.map(a => {
        if (a.employeeId === empId && a.date === today) {
          return {
            ...a,
            checkOut: timeString,
            workingHours: '8.8 hrs'
          };
        }
        return a;
      })
    }));

    showToast('Checked Out', `Great job today! Check-out recorded at ${timeString}.`, 'info');
  };

  // Leave Actions
  const applyLeave = (leaveData) => {
    const newLeave = {
      ...leaveData,
      id: `LV-${Date.now().toString().slice(-4)}`,
      employeeId: data.currentUser.employeeId || data.currentUser.id,
      employeeName: data.currentUser.name,
      status: 'Pending',
      hrComment: ''
    };

    setData(prev => ({
      ...prev,
      leaves: [newLeave, ...prev.leaves]
    }));

    showToast('Leave Applied', 'Your request has been submitted for HR approval.', 'success');
  };

  const reviewLeave = (leaveId, status, hrComment) => {
    setData(prev => ({
      ...prev,
      leaves: prev.leaves.map(l => {
        if (l.id === leaveId) {
          return {
            ...l,
            status,
            hrComment
          };
        }
        return l;
      }),
      auditLogs: [
        {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          user: prev.currentUser.name,
          action: 'LEAVE_REVIEWED',
          details: `${status} leave ${leaveId} with comment: "${hrComment || 'None'}"`,
          timestamp: new Date().toLocaleString()
        },
        ...prev.auditLogs
      ]
    }));

    showToast(`Leave ${status}`, `Leave request has been marked as ${status}.`, status === 'Approved' ? 'success' : 'amber');
  };

  // Payroll Actions
  const disbursePayroll = (month) => {
    const activeEmployees = data.employees.filter(e => e.status === 'ACTIVE');
    const totalDisbursed = activeEmployees.reduce((acc, e) => acc + (e.basicSalary + e.hra + e.allowances), 0);

    const record = {
      id: `PAY-${Date.now().toString().slice(-4)}`,
      month,
      totalEmployees: activeEmployees.length,
      totalDisbursed,
      disbursedAt: new Date().toISOString().split('T')[0],
      status: 'Disbursed'
    };

    setData(prev => ({
      ...prev,
      payroll: [record, ...prev.payroll],
      auditLogs: [
        {
          id: `LOG-${Date.now().toString().slice(-4)}`,
          user: prev.currentUser.name,
          action: 'PAYROLL_DISBURSED',
          details: `Processed batch payroll for ${month} totaling ₹${totalDisbursed.toLocaleString()}`,
          timestamp: new Date().toLocaleString()
        },
        ...prev.auditLogs
      ]
    }));

    showToast('Payroll Disbursed', `Successfully processed ₹${totalDisbursed.toLocaleString()} for ${month}.`, 'success');
  };

  // Announcements Actions
  const createAnnouncement = (annData) => {
    const record = {
      ...annData,
      id: `ANN-${Date.now().toString().slice(-4)}`,
      author: data.currentUser.name,
      publishDate: new Date().toISOString().split('T')[0]
    };

    setData(prev => ({
      ...prev,
      announcements: [record, ...prev.announcements]
    }));

    showToast('Announcement Published', `Notice "${record.title}" is now live.`, 'success');
  };

  // Document Actions
  const uploadDocument = (docData) => {
    const record = {
      ...docData,
      id: `DOC-${Date.now().toString().slice(-4)}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    setData(prev => ({
      ...prev,
      documents: [record, ...prev.documents]
    }));

    showToast('Document Uploaded', `${record.title} saved to the secure repository.`, 'success');
  };

  // Settings Actions
  const updateSettings = (newSettings) => {
    setData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings
      }
    }));

    showToast('Settings Saved', 'Organization policies and evaluation parameters updated.', 'success');
  };

  const markAllNotificationsRead = () => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  return (
    <StoreContext.Provider
      value={{
        ...data,
        rawState: data,
        backendConnected,
        toasts,
        showToast,
        removeToast,
        switchRole,
        switchUser,
        logout,
        loginWithCredentials,
        isLoggedOut,
        setIsLoggedOut,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        createTask,
        submitTask,
        reviewTask,
        markCheckIn,
        markCheckOut,
        applyLeave,
        reviewLeave,
        disbursePayroll,
        createAnnouncement,
        uploadDocument,
        updateSettings,
        markAllNotificationsRead,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
