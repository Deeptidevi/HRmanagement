const db = require('../config/db');

// GET /api/tasks
exports.getAllTasks = async (req, res) => {
  const { assignedTo, status, priority, department } = req.query;

  try {
    let query = `
      SELECT t.*, e.name as assignee_name, e.avatar_url as assignee_avatar, e.designation as assignee_designation
      FROM tasks t
      LEFT JOIN employees e ON t.assigned_to = e.id
      WHERE 1=1
    `;
    const params = [];

    if (assignedTo) {
      params.push(assignedTo);
      query += ` AND t.assigned_to = $${params.length}`;
    }

    if (status && status !== 'ALL') {
      params.push(status);
      query += ` AND t.status = $${params.length}`;
    }

    if (priority && priority !== 'ALL') {
      params.push(priority);
      query += ` AND t.priority = $${params.length}`;
    }

    if (department && department !== 'ALL') {
      params.push(department);
      query += ` AND t.department = $${params.length}`;
    }

    query += ' ORDER BY t.deadline ASC, t.id DESC';

    const result = await db.query(query, params);
    res.json({ success: true, count: result.rows.length, tasks: result.rows });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ success: false, message: 'Database error fetching tasks.', error: err.message });
  }
};

// POST /api/tasks (Create Task)
exports.createTask = async (req, res) => {
  const { title, description, assignedTo, priority, deadline, estimatedHours, department } = req.body;

  try {
    const empResult = await db.query('SELECT department FROM employees WHERE id = $1', [assignedTo]);
    const dept = department || (empResult.rows[0] ? empResult.rows[0].department : 'Engineering');

    const countResult = await db.query('SELECT COUNT(*) FROM tasks');
    const taskId = `TSK-${100 + parseInt(countResult.rows[0].count) + 1}`;

    const result = await db.query(
      `INSERT INTO tasks (id, title, description, assigned_to, department, priority, start_date, deadline, estimated_hours, status, progress)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE, $7, $8, 'In Progress', 0)
       RETURNING *`,
      [taskId, title, description, assignedTo, dept, priority || 'Medium', deadline, parseInt(estimatedHours) || 16]
    );

    res.status(201).json({ success: true, task: result.rows[0], message: 'Task assigned successfully.' });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ success: false, message: 'Database error creating task.', error: err.message });
  }
};

// POST /api/tasks/:id/submit (Employee Submit Deliverable)
exports.submitTaskDeliverable = async (req, res) => {
  const { id } = req.params;
  const { submission_notes, submission_file, progress, notes, fileName } = req.body;
  const finalNotes = submission_notes || notes || 'Work deliverable submitted for review.';
  const finalFile = submission_file || fileName || 'deliverable_bundle.zip';

  try {
    const result = await db.query(
      `UPDATE tasks 
       SET status = 'Submitted', progress = COALESCE($1, 95), submission_notes = $2, submission_file = $3
       WHERE id = $4
       RETURNING *`,
      [parseInt(progress) || 95, finalNotes, finalFile, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({ success: true, task: result.rows[0], message: 'Work deliverable submitted for review.' });
  } catch (err) {
    console.error('Error submitting deliverable:', err);
    res.status(500).json({ success: false, message: 'Database error submitting deliverable.', error: err.message });
  }
};

// POST /api/tasks/:id/review (HR Review & Score Deliverable)
exports.reviewTaskDeliverable = async (req, res) => {
  const { id } = req.params;
  const { rating, feedback, action } = req.body; // action: 'approve' | 'rework'

  try {
    const isApprove = action !== 'rework';
    const newStatus = isApprove ? 'Approved' : 'In Progress';
    const newProgress = isApprove ? 100 : 70;

    const result = await db.query(
      `UPDATE tasks 
       SET status = $1, progress = $2, rating = $3, feedback = $4
       WHERE id = $5
       RETURNING *`,
      [newStatus, newProgress, parseFloat(rating) || 5.0, feedback || 'Approved by HR Lead', id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    res.json({ success: true, task: result.rows[0], message: `Task ${newStatus.toLowerCase()} successfully.` });
  } catch (err) {
    console.error('Error reviewing deliverable:', err);
    res.status(500).json({ success: false, message: 'Database error reviewing deliverable.', error: err.message });
  }
};
