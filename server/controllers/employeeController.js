const db = require('../config/db');

// In-Memory Fallback Seed if PostgreSQL service is paused/offline
let memoryEmployees = [
  {
    id: 'EMP-001',
    name: 'Russel Sims',
    email: 'russel@mycomp.com',
    designation: 'Senior Backend Engineer',
    department: 'Engineering',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
    join_date: '2023-03-01',
    monthly_salary: 95000,
    working_format: 'Office',
    phone: '+91 98111 22334',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
  },
  {
    id: 'EMP-002',
    name: 'Arthur Taylor',
    email: 'arthur@mycomp.com',
    designation: 'Senior Frontend Lead',
    department: 'Engineering',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
    join_date: '2023-04-10',
    monthly_salary: 92000,
    working_format: 'Hybrid',
    phone: '+91 98222 33445',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  },
  {
    id: 'EMP-003',
    name: 'Sarah Jenkins',
    email: 'sarah@mycomp.com',
    designation: 'Principal UI/UX Designer',
    department: 'Design',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
    join_date: '2023-06-20',
    monthly_salary: 88000,
    working_format: 'Office',
    phone: '+91 98333 44556',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
  },
  {
    id: 'EMP-004',
    name: 'Alex Morgan',
    email: 'alex@mycomp.com',
    designation: 'Lead Product Manager',
    department: 'Product',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
    join_date: '2023-07-15',
    monthly_salary: 110000,
    working_format: 'Remote',
    phone: '+91 98444 55667',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150'
  },
  {
    id: 'EMP-005',
    name: 'Elena Rostova',
    email: 'elena@mycomp.com',
    designation: 'Talent Acquisition Specialist',
    department: 'Human Resources',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
    join_date: '2023-09-01',
    monthly_salary: 68000,
    working_format: 'Office',
    phone: '+91 98555 66778',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
  },
  {
    id: 'EMP-006',
    name: 'Michael Chang',
    email: 'michael@mycomp.com',
    designation: 'QA Automation Lead',
    department: 'Engineering',
    role: 'EMPLOYEE',
    status: 'ACTIVE',
    join_date: '2023-11-12',
    monthly_salary: 78000,
    working_format: 'Office',
    phone: '+91 98666 77889',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150'
  }
];

// GET /api/employees
exports.getAllEmployees = async (req, res) => {
  try {
    const { department, status, search } = req.query;
    let query = 'SELECT id, name, email, designation, department, role, status, join_date, monthly_salary, working_format, phone, avatar_url FROM employees WHERE 1=1';
    const params = [];

    if (department && department !== 'ALL') {
      params.push(department);
      query += ` AND department = $${params.length}`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length} OR id ILIKE $${params.length})`;
    }

    query += ' ORDER BY id ASC';

    const result = await db.query(query, params);
    res.json({ success: true, count: result.rows.length, employees: result.rows });
  } catch (err) {
    console.warn('Note: Serving employees from resilient memory fallback:', err.message);
    const { department, status, search } = req.query || {};
    let list = [...memoryEmployees];
    if (department && department !== 'ALL') {
      list = list.filter(e => e.department.toLowerCase() === department.toLowerCase());
    }
    if (status && status !== 'ALL') {
      list = list.filter(e => e.status.toLowerCase() === status.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.id.toLowerCase().includes(q));
    }
    res.json({ success: true, count: list.length, employees: list });
  }
};

// GET /api/employees/:id
exports.getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM employees WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      const match = memoryEmployees.find(e => e.id.toLowerCase() === id.toLowerCase());
      if (match) return res.json({ success: true, employee: match });
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    res.json({ success: true, employee: result.rows[0] });
  } catch (err) {
    const match = memoryEmployees.find(e => e.id.toLowerCase() === id.toLowerCase());
    if (match) return res.json({ success: true, employee: match });
    res.status(404).json({ success: false, message: 'Employee not found.' });
  }
};

// POST /api/employees
exports.createEmployee = async (req, res) => {
  const { name, email, designation, department, role, monthly_salary, working_format, phone, avatar_url, join_date } = req.body;

  try {
    // Generate next ID like EMP-009
    const countResult = await db.query('SELECT COUNT(*) FROM employees');
    const nextNum = parseInt(countResult.rows[0].count) + 1;
    const empId = `EMP-${String(nextNum).padStart(3, '0')}`;

    const insertResult = await db.query(
      `INSERT INTO employees (id, name, email, designation, department, role, status, join_date, monthly_salary, working_format, phone, avatar_url)
       VALUES ($1, $2, $3, $4, $5, $6, 'ACTIVE', $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        empId,
        name,
        email.toLowerCase().trim(),
        designation,
        department,
        role || 'EMPLOYEE',
        join_date || new Date().toISOString().split('T')[0],
        parseFloat(monthly_salary) || 65000.00,
        working_format || 'Office',
        phone || '+91 98000 00000',
        avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      ]
    );

    // Audit log
    await db.query(
      'INSERT INTO audit_logs (actor_name, action_type, details) VALUES ($1, $2, $3)',
      ['Lead HR', 'CREATE_EMPLOYEE', `Created new employee profile ${empId} - ${name}`]
    );

    res.status(201).json({ success: true, employee: insertResult.rows[0], message: 'Employee created successfully.' });
  } catch (err) {
    console.warn('Note: In-memory creation fallback:', err.message);
    const empId = `EMP-${String(memoryEmployees.length + 1).padStart(3, '0')}`;
    const newEmp = {
      id: empId,
      name: name || 'New Employee',
      email: (email || `${empId.toLowerCase()}@mycomp.com`).toLowerCase().trim(),
      designation: designation || 'Associate Engineer',
      department: department || 'Engineering',
      role: role || 'EMPLOYEE',
      status: 'ACTIVE',
      join_date: join_date || new Date().toISOString().split('T')[0],
      monthly_salary: parseFloat(monthly_salary) || 65000,
      working_format: working_format || 'Office',
      phone: phone || '+91 98000 00000',
      avatar_url: avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    };
    memoryEmployees.push(newEmp);
    res.status(201).json({ success: true, employee: newEmp, message: 'Employee created successfully (In-Memory Fallback).' });
  }
};

// PUT /api/employees/:id
exports.updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { name, email, designation, department, role, status, monthly_salary, working_format, phone } = req.body;

  try {
    const result = await db.query(
      `UPDATE employees 
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           designation = COALESCE($3, designation),
           department = COALESCE($4, department),
           role = COALESCE($5, role),
           status = COALESCE($6, status),
           monthly_salary = COALESCE($7, monthly_salary),
           working_format = COALESCE($8, working_format),
           phone = COALESCE($9, phone)
       WHERE id = $10
       RETURNING *`,
      [name, email, designation, department, role, status, monthly_salary, working_format, phone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    res.json({ success: true, employee: result.rows[0], message: 'Employee updated successfully.' });
  } catch (err) {
    console.warn('Note: In-memory update fallback:', err.message);
    const idx = memoryEmployees.findIndex(e => e.id.toLowerCase() === id.toLowerCase());
    if (idx !== -1) {
      memoryEmployees[idx] = {
        ...memoryEmployees[idx],
        name: name || memoryEmployees[idx].name,
        email: email || memoryEmployees[idx].email,
        designation: designation || memoryEmployees[idx].designation,
        department: department || memoryEmployees[idx].department,
        status: status || memoryEmployees[idx].status,
        monthly_salary: monthly_salary || memoryEmployees[idx].monthly_salary,
      };
      return res.json({ success: true, employee: memoryEmployees[idx], message: 'Employee updated successfully.' });
    }
    res.status(404).json({ success: false, message: 'Employee not found.' });
  }
};

// DELETE /api/employees/:id (Offboard / Delete Employee)
exports.deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const empCheck = await db.query('SELECT name, role FROM employees WHERE id = $1', [id]);
    if (empCheck.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    if (empCheck.rows[0].role === 'HR_ADMIN' || id === 'HR-001') {
      return res.status(403).json({ success: false, message: 'HR Administrator profile cannot be deleted.' });
    }

    const employeeName = empCheck.rows[0].name;

    await db.query('DELETE FROM employees WHERE id = $1', [id]);

    res.json({ success: true, message: `Employee ${employeeName} (${id}) has been removed successfully.` });
  } catch (err) {
    console.warn('Note: In-memory deletion fallback:', err.message);
    const idx = memoryEmployees.findIndex(e => e.id.toLowerCase() === id.toLowerCase());
    if (idx !== -1) {
      const removed = memoryEmployees.splice(idx, 1)[0];
      return res.json({ success: true, message: `Employee ${removed.name} (${id}) has been removed successfully.` });
    }
    res.status(404).json({ success: false, message: 'Employee not found.' });
  }
};

