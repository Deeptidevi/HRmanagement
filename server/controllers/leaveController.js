const db = require('../config/db');

// GET /api/leaves
exports.getAllLeaves = async (req, res) => {
  const { month, status, leaveType, search, employeeId } = req.query;

  try {
    let query = `
      SELECT l.*, e.department, e.designation, e.avatar_url 
      FROM leaves l
      JOIN employees e ON l.employee_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (employeeId) {
      params.push(employeeId);
      query += ` AND l.employee_id = $${params.length}`;
    }

    if (month && month !== 'ALL') {
      params.push(`${month}%`);
      query += ` AND l.start_date::text LIKE $${params.length}`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      query += ` AND l.status = $${params.length}`;
    }

    if (leaveType && leaveType !== 'ALL') {
      params.push(leaveType);
      query += ` AND l.leave_type = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (l.employee_name ILIKE $${params.length} OR l.reason ILIKE $${params.length})`;
    }

    query += ' ORDER BY l.applied_on DESC, l.id DESC';

    const result = await db.query(query, params);
    res.json({ success: true, count: result.rows.length, leaves: result.rows });
  } catch (err) {
    console.error('Error fetching leaves:', err);
    res.status(500).json({ success: false, message: 'Database error fetching leaves.', error: err.message });
  }
};

// POST /api/leaves (Apply Leave)
exports.applyLeave = async (req, res) => {
  const { employee_id, leave_type, start_date, end_date, reason } = req.body;

  try {
    const empResult = await db.query('SELECT name FROM employees WHERE id = $1', [employee_id]);
    if (empResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found.' });
    }

    const employee_name = empResult.rows[0].name;

    // Calculate days
    const start = new Date(start_date);
    const end = new Date(end_date);
    const diffTime = Math.abs(end - start);
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const result = await db.query(
      `INSERT INTO leaves (employee_id, employee_name, leave_type, start_date, end_date, days, reason, status, applied_on)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending', CURRENT_DATE)
       RETURNING *`,
      [employee_id, employee_name, leave_type, start_date, end_date, days, reason]
    );

    // Audit log
    await db.query(
      'INSERT INTO audit_logs (actor_name, action_type, details) VALUES ($1, $2, $3)',
      [employee_name, 'APPLY_LEAVE', `Applied for ${days} day(s) ${leave_type}`]
    );

    res.status(201).json({ success: true, leave: result.rows[0], message: 'Leave application submitted successfully.' });
  } catch (err) {
    console.error('Error applying leave:', err);
    res.status(500).json({ success: false, message: 'Database error applying leave.', error: err.message });
  }
};

// PUT /api/leaves/:id/review (Approve / Reject Leave)
exports.reviewLeave = async (req, res) => {
  const { id } = req.params;
  const { status, hr_comment } = req.body; // status: 'Approved' | 'Rejected'

  try {
    const result = await db.query(
      `UPDATE leaves 
       SET status = $1, hr_comment = $2
       WHERE id = $3
       RETURNING *`,
      [status, hr_comment || (status === 'Approved' ? 'Approved by HR Administrator' : 'Rejected due to sprint requirements'), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Leave request not found.' });
    }

    const leave = result.rows[0];

    // Audit log
    await db.query(
      'INSERT INTO audit_logs (actor_name, action_type, details) VALUES ($1, $2, $3)',
      ['Lead HR', 'REVIEW_LEAVE', `${status} leave for ${leave.employee_name} (${leave.leave_type})`]
    );

    res.json({ success: true, leave, message: `Leave request ${status.toLowerCase()} successfully.` });
  } catch (err) {
    console.error('Error reviewing leave:', err);
    res.status(500).json({ success: false, message: 'Database error reviewing leave.', error: err.message });
  }
};
