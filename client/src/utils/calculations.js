/**
 * Centralized Calculation Engine for AmaHR PERN HRMS
 * Computes Workload Health, Performance Index, Payroll, Attendance & Leave Metrics
 */

export function calculateEmployeePerformance(employeeId, data) {
  const settings = data?.settings || { weights: { tasks: 50, attendance: 20, onTime: 15, feedback: 15 } };
  const weights = settings.weights;
  
  const tasks = (data?.tasks || []).filter(t => t.assignedTo === employeeId);
  const attendance = (data?.attendance || []).filter(a => a.employeeId === employeeId);

  // 1. Task Rating Score (0 - 100)
  const ratedTasks = tasks.filter(t => t.rating !== null && t.rating !== undefined);
  let taskRatingScore = 85; // Baseline default
  if (ratedTasks.length > 0) {
    const sumRatings = ratedTasks.reduce((acc, t) => acc + Number(t.rating), 0);
    const avgRating = sumRatings / ratedTasks.length;
    taskRatingScore = (avgRating / 5) * 100;
  }

  // 2. Attendance Score (0 - 100)
  let attendanceScore = 95;
  if (attendance.length > 0) {
    const presentCount = attendance.filter(a => a.status === 'Present').length;
    const lateCount = attendance.filter(a => a.status === 'Late').length;
    const leaveCount = attendance.filter(a => a.status === 'Leave').length;
    const absentCount = attendance.filter(a => a.status === 'Absent').length;
    const totalWorking = presentCount + lateCount + leaveCount + absentCount;

    if (totalWorking > 0) {
      attendanceScore = Math.min(100, Math.round(((presentCount + leaveCount + (lateCount * 0.75)) / totalWorking) * 100));
    }
  }

  // 3. On-Time Task Completion Rate (0 - 100)
  const completedTasks = tasks.filter(t => t.status === 'Approved' || t.status === 'Submitted');
  let onTimeScore = 90;
  if (completedTasks.length > 0) {
    let onTimeCount = 0;
    completedTasks.forEach(t => {
      if (t.submission && t.submission.submittedAt) {
        const subDate = new Date(t.submission.submittedAt);
        const deadlineDate = new Date(t.deadline);
        if (subDate <= deadlineDate || isNaN(subDate.getTime())) {
          onTimeCount++;
        }
      } else {
        onTimeCount++;
      }
    });
    onTimeScore = Math.round((onTimeCount / completedTasks.length) * 100);
  }

  // 4. HR Feedback & Review Score (0 - 100)
  let feedbackScore = 90;
  const feedbackTasks = tasks.filter(t => t.feedback && t.feedback.trim().length > 0);
  if (feedbackTasks.length > 0) {
    const scoreSum = feedbackTasks.reduce((acc, t) => {
      const r = Number(t.rating || 4.2);
      return acc + (r / 5) * 100;
    }, 0);
    feedbackScore = Math.round(scoreSum / feedbackTasks.length);
  }

  // Weighted Composite Performance Index
  const compositeScore = Math.round(
    (taskRatingScore * (weights.tasks / 100)) +
    (attendanceScore * (weights.attendance / 100)) +
    (onTimeScore * (weights.onTime / 100)) +
    (feedbackScore * (weights.feedback / 100))
  );

  let badge = 'Meets Expectations';
  let badgeColor = 'blue';
  if (compositeScore >= 92) {
    badge = 'Top Performer';
    badgeColor = 'amber';
  } else if (compositeScore >= 80) {
    badge = 'Strong Performer';
    badgeColor = 'green';
  } else if (compositeScore < 70) {
    badge = 'Needs Attention';
    badgeColor = 'red';
  }

  return {
    employeeId,
    compositeScore: Math.min(100, Math.max(0, compositeScore)),
    taskRatingScore: Math.round(taskRatingScore),
    attendanceScore,
    onTimeScore,
    feedbackScore,
    badge,
    badgeColor,
    totalTasksAssigned: tasks.length,
    completedTasks: completedTasks.length,
  };
}

export function calculateMonthlyPayroll(employeeId, data) {
  const emp = (data?.employees || []).find(e => e.id === employeeId);
  if (!emp) return null;

  const basicSalary = emp.basicSalary || 50000;
  const hra = emp.hra || (basicSalary * 0.4);
  const allowances = emp.allowances || 5000;
  const bonuses = emp.bonuses || 0;
  const grossSalary = basicSalary + hra + allowances + bonuses;

  // Leaves deduction calculation
  const approvedLeaves = (data?.leaves || []).filter(l => l.employeeId === employeeId && l.status === 'Approved');
  let unpaidDays = 0;
  approvedLeaves.forEach(l => {
    if (l.type === 'Unpaid' || l.category === 'Unpaid') {
      unpaidDays += Number(l.days || 1);
    }
  });

  const dailyRate = grossSalary / 30;
  const unpaidLeaveDeduction = Math.round(unpaidDays * dailyRate);

  // Statutory Tax & PF Deductions (TDS ~ 10%, PF ~ 12% of basic)
  const taxDeduction = Math.round((grossSalary * (emp.taxPercent || 10)) / 100);
  const pfDeduction = Math.round(basicSalary * 0.12);

  const totalDeductions = unpaidLeaveDeduction + taxDeduction + pfDeduction;
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    employeeId: emp.id,
    name: emp.name,
    designation: emp.designation,
    department: emp.department,
    basicSalary,
    hra,
    allowances,
    bonuses,
    grossSalary,
    unpaidDays,
    unpaidLeaveDeduction,
    taxDeduction,
    pfDeduction,
    totalDeductions,
    netSalary,
    currency: '₹',
    status: 'Processed',
  };
}

export function calculateWorkloadHealthScore(employeeId, data) {
  const empTasks = (data?.tasks || []).filter(t => t.assignedTo === employeeId);
  const activeTasks = empTasks.filter(t => t.status === 'In Progress' || t.status === 'Assigned');
  const overdueTasks = empTasks.filter(t => {
    if (t.status === 'Approved') return false;
    return new Date(t.deadline) < new Date();
  });

  const attendance = (data?.attendance || []).filter(a => a.employeeId === employeeId);
  const leaves = (data?.leaves || []).filter(l => l.employeeId === employeeId && l.status === 'Approved');

  let score = 100;

  // Factor 1: Active task volume penalty
  if (activeTasks.length > 5) score -= (activeTasks.length - 5) * 6;

  // Factor 2: Overdue tasks penalty
  score -= overdueTasks.length * 12;

  // Factor 3: Overtime strain
  const totalHours = attendance.reduce((acc, a) => acc + (parseFloat(a.workingHours) || 8), 0);
  const avgDailyHours = attendance.length > 0 ? totalHours / attendance.length : 8;
  if (avgDailyHours > 9.5) score -= 14;

  // Factor 4: Burnout cushion / leave rest
  if (leaves.length === 0 && attendance.length > 20) score -= 8;

  score = Math.max(15, Math.min(100, Math.round(score)));

  let status = 'Optimal';
  let color = 'emerald';
  if (score < 50) {
    status = 'Critical Burnout Risk';
    color = 'rose';
  } else if (score < 75) {
    status = 'Heavy Load';
    color = 'amber';
  }

  return {
    employeeId,
    score,
    status,
    color,
    activeTasks: activeTasks.length,
    overdueTasks: overdueTasks.length,
    avgDailyHours: avgDailyHours.toFixed(1),
  };
}

export function getHRDashboardAnalytics(data) {
  const employees = (data?.employees || []).filter(e => e.status === 'ACTIVE');
  const tasks = data?.tasks || [];
  const attendance = data?.attendance || [];
  const leaves = data?.leaves || [];

  const completedTasks = tasks.filter(t => t.status === 'Approved').length;
  const pendingTasks = tasks.filter(t => t.status !== 'Approved').length;

  const totalGrossPayroll = employees.reduce((acc, e) => {
    const pay = calculateMonthlyPayroll(e.id, data);
    return acc + (pay ? pay.grossSalary : 0);
  }, 0);

  const today = new Date().toISOString().split('T')[0];
  const todayAtt = attendance.filter(a => a.date === today);
  const presentCount = todayAtt.filter(a => a.status === 'Present').length;
  const lateCount = todayAtt.filter(a => a.status === 'Late').length;
  const onLeaveCount = todayAtt.filter(a => a.status === 'Leave').length;

  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;

  return {
    totalEmployees: employees.length,
    completedTasks,
    pendingTasks,
    totalGrossPayroll,
    presentCount,
    lateCount,
    onLeaveCount,
    pendingLeaves,
  };
}

export function getLeaderboardRankings(data) {
  const employees = (data?.employees || []).filter(e => e.status === 'ACTIVE');
  const ranked = employees.map(emp => {
    const perf = calculateEmployeePerformance(emp.id, data);
    return {
      id: emp.id,
      name: emp.name,
      designation: emp.designation,
      department: emp.department,
      avatar: emp.avatar,
      score: perf.compositeScore,
      badge: perf.badge,
      badgeColor: perf.badgeColor,
    };
  });

  return ranked.sort((a, b) => b.score - a.score).map((r, index) => ({
    ...r,
    rank: index + 1,
  }));
}
