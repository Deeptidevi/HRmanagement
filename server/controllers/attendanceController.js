const db = require('../config/db');

// GET /api/attendance
exports.getAttendance = async (req, res) => {
  const { date, month, employeeId, status } = req.query;

  try {
    let query = `
      SELECT a.*, e.name as employee_name, e.department, e.designation, e.avatar_url 
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      WHERE 1=1
    `;
    const params = [];

    if (month && month !== 'ALL') {
      params.push(`${month}%`);
      query += ` AND a.date::text LIKE $${params.length}`;
    }

    if (date) {
      params.push(date);
      query += ` AND a.date = $${params.length}`;
    }

    if (employeeId && employeeId !== 'ALL') {
      params.push(employeeId);
      query += ` AND a.employee_id = $${params.length}`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      query += ` AND a.status = $${params.length}`;
    }

    query += ' ORDER BY a.date DESC, a.id DESC';

    const result = await db.query(query, params);
    res.json({ success: true, count: result.rows.length, attendance: result.rows });
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ success: false, message: 'Database error fetching attendance.', error: err.message });
  }
};

// POST /api/attendance (Record / Mark Attendance)
exports.recordAttendance = async (req, res) => {
  const { employee_id, date, check_in, check_out, working_hours, status, remarks } = req.body;

  try {
    // Check if record exists for this employee and date
    const existing = await db.query(
      'SELECT id FROM attendance WHERE employee_id = $1 AND date = $2',
      [employee_id, date]
    );

    let record;
    if (existing.rows.length > 0) {
      const updateResult = await db.query(
        `UPDATE attendance 
         SET check_in = $1, check_out = $2, working_hours = $3, status = $4, remarks = $5
         WHERE id = $6 RETURNING *`,
        [check_in, check_out, working_hours || '8h 00m', status || 'Present', remarks, existing.rows[0].id]
      );
      record = updateResult.rows[0];
    } else {
      const insertResult = await db.query(
        `INSERT INTO attendance (employee_id, date, check_in, check_out, working_hours, status, remarks)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [employee_id, date, check_in, check_out, working_hours || '8h 00m', status || 'Present', remarks]
      );
      record = insertResult.rows[0];
    }

    res.json({ success: true, attendance: record, message: 'Attendance recorded successfully.' });
  } catch (err) {
    console.error('Error recording attendance:', err);
    res.status(500).json({ success: false, message: 'Database error recording attendance.', error: err.message });
  }
};
