/**
 * AmaHR Enterprise HRMS — PERN Stack React API Client
 * Connects React frontend directly to Express.js REST API & PostgreSQL Database
 */
class ApiClient {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('AMAHR_AUTH_TOKEN') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('AMAHR_AUTH_TOKEN', token);
    } else {
      localStorage.removeItem('AMAHR_AUTH_TOKEN');
    }
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      return data;
    } catch (err) {
      console.warn(`[PERN API Client] Error on ${endpoint}:`, err.message);
      throw err;
    }
  }

  // Auth APIs
  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.success && res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Employees APIs
  async getEmployees(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/employees${queryString ? `?${queryString}` : ''}`);
  }

  async getEmployeeById(id) {
    return this.request(`/employees/${id}`);
  }

  async createEmployee(employeeData) {
    return this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  async updateEmployee(id, employeeData) {
    return this.request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  }

  async deleteEmployee(id) {
    return this.request(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Attendance APIs
  async getAttendance(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/attendance${queryString ? `?${queryString}` : ''}`);
  }

  async recordAttendance(attendanceData) {
    return this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify(attendanceData),
    });
  }

  // Leaves APIs
  async getLeaves(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/leaves${queryString ? `?${queryString}` : ''}`);
  }

  async applyLeave(leaveData) {
    return this.request('/leaves', {
      method: 'POST',
      body: JSON.stringify(leaveData),
    });
  }

  async reviewLeave(id, status, hrComment) {
    return this.request(`/leaves/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify({ status, hr_comment: hrComment }),
    });
  }

  // Tasks APIs
  async getTasks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/tasks${queryString ? `?${queryString}` : ''}`);
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async submitTask(taskId, submissionData) {
    return this.request(`/tasks/${taskId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  }

  async reviewTask(taskId, reviewData) {
    return this.request(`/tasks/${taskId}/review`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // Payroll APIs
  async getPayroll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/payroll${queryString ? `?${queryString}` : ''}`);
  }

  async disbursePayroll(month) {
    return this.request('/payroll/disburse', {
      method: 'POST',
      body: JSON.stringify({ month }),
    });
  }

  // Workload Health Score API
  async getWorkloadHealthScores(employeeId = null) {
    const query = employeeId ? `?employeeId=${employeeId}` : '';
    return this.request(`/workload-health${query}`);
  }

  // Server health check
  async checkBackendStatus() {
    try {
      const res = await this.request('/health');
      return res.status === 'UP';
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
