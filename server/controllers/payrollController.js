const db = require('../config/db');

// GET /api/payroll
exports.getAllPayroll = async (req, res) => {
  const { month, department, search, employeeId } = req.query;

  try {
    let query = `
      SELECT p.*, e.name as employee_name, e.department, e.designation, e.avatar_url
      FROM payroll p
      JOIN employees e ON p.employee_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (employeeId) {
      params.push(employeeId);
      query += ` AND p.employee_id = $${params.length}`;
    }

    if (month && month !== 'ALL') {
      params.push(month);
      query += ` AND p.month = $${params.length}`;
    }

    if (department && department !== 'ALL') {
      params.push(department);
      query += ` AND e.department = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (e.name ILIKE $${params.length} OR p.id ILIKE $${params.length})`;
    }

    query += ' ORDER BY p.payment_date DESC, p.id DESC';

    const result = await db.query(query, params);
    res.json({ success: true, count: result.rows.length, payroll: result.rows });
  } catch (err) {
    console.error('Error fetching payroll:', err);
    res.status(500).json({ success: false, message: 'Database error fetching payroll.', error: err.message });
  }
};

// POST /api/payroll/disburse
exports.disbursePayroll = async (req, res) => {
  const { month } = req.body;
  const targetMonth = month || 'October 2026';

  try {
    const employees = await db.query('SELECT * FROM employees WHERE status = $1', ['ACTIVE']);

    for (const emp of employees.rows) {
      const baseSalary = parseFloat(emp.monthly_salary) || 65000;
      const hra = Math.round(baseSalary * 0.40);
      const allowance = Math.round(baseSalary * 0.20);
      const bonus = 4000;
      const gross = baseSalary + hra + allowance + bonus;
      const tds = Math.round(gross * 0.08);
      const pf = 4500;
      const deductions = tds + pf;
      const net = gross - deductions;

      const payId = `PAY-${targetMonth.replace(/\s+/g, '-').toUpperCase()}-${emp.id}`;

      await db.query(
        `INSERT INTO payroll (id, employee_id, month, base_salary, hra, special_allowance, performance_bonus, gross_earnings, tds_tax, provident_fund, total_deductions, net_salary, disbursed_status, payment_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Paid', CURRENT_DATE)
         ON CONFLICT (id) DO UPDATE 
         SET net_salary = EXCLUDED.net_salary, disbursed_status = 'Paid', payment_date = CURRENT_DATE`,
        [payId, emp.id, targetMonth, baseSalary, hra, allowance, bonus, gross, tds, pf, deductions, net]
      );
    }

    res.json({ success: true, message: `Payroll successfully disbursed for ${targetMonth} in INR (₹).` });
  } catch (err) {
    console.error('Error disbursing payroll:', err);
    res.status(500).json({ success: false, message: 'Database error disbursing payroll.', error: err.message });
  }
};
