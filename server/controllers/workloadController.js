const db = require('../config/db');

// GET /api/workload-health (All employees or single)
exports.getWorkloadHealthScores = async (req, res) => {
  const { employeeId } = req.query;

  try {
    let empQuery = 'SELECT id, name, designation, department, avatar_url FROM employees WHERE status = $1';
    const params = ['ACTIVE'];

    if (employeeId) {
      params.push(employeeId);
      empQuery += ' AND id = $2';
    }

    const employees = await db.query(empQuery, params);
    const todayStr = new Date().toISOString().split('T')[0];

    const healthScores = await Promise.all(
      employees.rows.map(async (emp) => {
        // Active & Overdue Tasks
        const taskResult = await db.query(
          'SELECT id, deadline, priority, status FROM tasks WHERE assigned_to = $1',
          [emp.id]
        );
        const allTasks = taskResult.rows;
        const activeTasks = allTasks.filter((t) => t.status !== 'Approved');
        const overdueTasks = activeTasks.filter((t) => t.deadline && t.deadline < todayStr);
        const highPriority = activeTasks.filter((t) => t.priority === 'High' || t.priority === 'Urgent');

        // Attendance / Work hours
        const attResult = await db.query(
          'SELECT working_hours FROM attendance WHERE employee_id = $1',
          [emp.id]
        );
        let avgHours = 8.4;
        if (attResult.rows.length > 0) {
          let totalMins = 0;
          let count = 0;
          attResult.rows.forEach((a) => {
            if (a.working_hours && a.working_hours.includes('h')) {
              const parts = a.working_hours.split('h');
              const h = parseInt(parts[0]) || 0;
              const m = parseInt(parts[1]) || 0;
              if (h > 0) {
                totalMins += h * 60 + m;
                count++;
              }
            }
          });
          if (count > 0) avgHours = Number((totalMins / count / 60).toFixed(1));
        }

        // Leaves taken
        const leaveResult = await db.query(
          'SELECT days FROM leaves WHERE employee_id = $1 AND status = $2',
          [emp.id, 'Approved']
        );
        const leavesTaken = leaveResult.rows.reduce((sum, l) => sum + (l.days || 1), 0);

        // Calculate Workload Health Score (Baseline 100)
        let score = 100;
        if (activeTasks.length >= 8) score -= 22;
        else if (activeTasks.length >= 6) score -= 14;
        else if (activeTasks.length >= 4) score -= 6;

        if (overdueTasks.length >= 3) score -= 24;
        else if (overdueTasks.length >= 2) score -= 16;
        else if (overdueTasks.length === 1) score -= 8;

        if (avgHours >= 9.5) score -= 20;
        else if (avgHours >= 9.0) score -= 12;
        else if (avgHours >= 8.6) score -= 6;

        if (avgHours >= 8.8 && leavesTaken === 0) score -= 8;

        score = Math.max(25, Math.min(100, Math.round(score)));

        let status = 'Healthy';
        let badgeColor = 'emerald';
        let emoji = '🟢';
        let label = 'Balanced Capacity';

        if (score < 65) {
          status = 'Critical';
          badgeColor = 'rose';
          emoji = '🔴';
          label = 'High Burnout Risk';
        } else if (score < 85) {
          status = 'Moderate';
          badgeColor = 'amber';
          emoji = '🟡';
          label = 'Moderate Strain';
        }

        return {
          employeeId: emp.id,
          employeeName: emp.name,
          designation: emp.designation,
          department: emp.department,
          avatar: emp.avatar_url,
          score,
          status,
          badgeColor,
          emoji,
          label,
          activeTasksCount: activeTasks.length,
          overdueTasksCount: overdueTasks.length,
          highPriorityCount: highPriority.length,
          avgWorkHours: `${avgHours}h`,
          leavesTakenDays: leavesTaken,
          performanceScore: 88,
        };
      })
    );

    res.json({ success: true, count: healthScores.length, healthScores });
  } catch (err) {
    console.error('Workload Health Calculation Error:', err);
    res.status(500).json({ success: false, message: 'Database error calculating workload health.', error: err.message });
  }
};
