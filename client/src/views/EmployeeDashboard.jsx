import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  calculateEmployeePerformance,
  calculateMonthlyPayroll,
  getLeaderboardRankings,
  calculateWorkloadHealthScore
} from '../utils/calculations';
import {
  LogIn,
  LogOut,
  CheckSquare,
  Activity,
  Award,
  Wallet,
  CalendarOff,
  Clock,
  TrendingUp,
  FileText
} from 'lucide-react';

export default function EmployeeDashboard({ onNavigate, onOpenSubmitTask }) {
  const store = useStore();
  const emp = store.employees.find((e) => e.id === store.currentUser.id) || store.employees[0] || {};
  const perf = calculateEmployeePerformance(emp.id, store.rawState);
  const payroll = calculateMonthlyPayroll(emp.id, store.rawState);
  const health = calculateWorkloadHealthScore(emp.id, store.rawState);
  const myTasks = store.tasks.filter((t) => t.assignedTo === emp.id);

  const today = new Date().toISOString().split('T')[0];
  const todayAtt = store.attendance.find((a) => a.employeeId === emp.id && a.date === today);

  const leaderboard = getLeaderboardRankings(store.rawState);
  const myRank = leaderboard.find((l) => l.id === emp.id)?.rank || 1;

  const myLeaves = store.leaves.filter((l) => l.employeeId === emp.id && l.status === 'Approved');
  const usedCasual = myLeaves.filter(l => l.category === 'Casual').reduce((a, b) => a + (b.days || 1), 0);
  const usedSick = myLeaves.filter(l => l.category === 'Sick').reduce((a, b) => a + (b.days || 1), 0);
  const usedEarned = myLeaves.filter(l => l.category === 'Earned').reduce((a, b) => a + (b.days || 1), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Top Greeting & Employee Profile Hero Banner */}
      <div className="card-base p-6 md:p-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            <img
              src={emp.avatar}
              alt={emp.name}
              className="w-24 h-24 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 justify-center md:justify-start mb-1">
                <h3 className="text-2xl font-extrabold tracking-tight">{emp.name}</h3>
                <span className="px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold font-mono">
                  {emp.id}
                </span>
              </div>
              <p className="text-blue-100 text-sm font-medium">
                {emp.designation} • {emp.department}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-blue-200 justify-center md:justify-start">
                <span>Joined {emp.joiningDate}</span>
                <span>•</span>
                <span>{emp.daysInCompany || 418} Days in Company</span>
                <span>•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-emerald-950 font-bold text-[10px]">
                  {emp.workingFormat || 'Hybrid'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Check-in/out Action Box */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col items-center gap-3 min-w-[220px]">
            <div className="text-center">
              <p className="text-[11px] font-bold text-blue-200 uppercase">Today's Attendance</p>
              <p className="text-sm font-extrabold text-white mt-0.5">
                {todayAtt ? (todayAtt.checkIn ? `Checked In: ${todayAtt.checkIn}` : 'Not Checked In') : 'Not Checked In'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!todayAtt || !todayAtt.checkIn ? (
                <button
                  onClick={store.markCheckIn}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-extrabold rounded-full transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" /> Check In
                </button>
              ) : todayAtt.checkOut ? (
                <span className="px-4 py-1.5 bg-white/20 text-white text-xs font-bold rounded-full">
                  Shift Completed ({todayAtt.checkOut})
                </span>
              ) : (
                <button
                  onClick={store.markCheckOut}
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-extrabold rounded-full transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Check Out
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Employee Operational Matrices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Workload Health Matrix */}
        <div className="card-base p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Workload Health</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">{health.score}/100</h3>
            <span className="badge-pill bg-emerald-50 text-emerald-700 text-xs font-bold">
              {health.status}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            {health.activeTasks} Active Tasks • {health.avgDailyHours}h Avg Daily
          </p>
        </div>

        {/* Performance Score */}
        <div className="card-base p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Performance Index</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">{perf.compositeScore}%</h3>
            <span className="badge-pill bg-blue-50 text-blue-700 text-xs font-bold">
              Rank #{myRank}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            On-Time Delivery: {perf.onTimeScore}%
          </p>
        </div>

        {/* Monthly Net Salary in INR */}
        <div className="card-base p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Monthly Net Pay</span>
            <Wallet className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">
              ₹{(payroll?.netSalary || 84000).toLocaleString()}
            </h3>
            <span className="badge-pill bg-purple-50 text-purple-700 text-[10px] font-bold">
              ₹ INR
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            Gross: ₹{(payroll?.grossSalary || 111000).toLocaleString()}
          </p>
        </div>

        {/* Casual Leave Balance */}
        <div className="card-base p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Leave Available</span>
            <CalendarOff className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">
              {12 - usedCasual} <span className="text-sm text-slate-400">Days</span>
            </h3>
            <span className="badge-pill bg-amber-50 text-amber-700 text-[10px] font-bold">
              Casual Quota
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">
            Sick: {10 - usedSick}d • Earned: {15 - usedEarned}d
          </p>
        </div>
      </div>

      {/* 3. My Tasks & Submissions */}
      <div className="card-base p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-600" /> My Current Tasks ({myTasks.length})
            </h4>
            <p className="text-xs text-slate-400">Deliverables assigned to you for review</p>
          </div>
          <button
            onClick={() => onNavigate('tasks')}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Go to Task Board
          </button>
        </div>

        <div className="space-y-3">
          {myTasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              You currently have no tasks assigned!
            </div>
          ) : (
            myTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-pill badge-dark text-[10px] font-mono">{task.id}</span>
                    <span className="badge-pill badge-red text-[10px]">{task.priority}</span>
                    <span className="text-xs font-bold text-slate-400">Due: {task.deadline}</span>
                  </div>
                  <h5 className="text-sm font-extrabold text-slate-900">{task.title}</h5>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span
                    className={`badge-pill text-xs ${
                      task.status === 'Approved'
                        ? 'badge-green'
                        : task.status === 'Submitted'
                        ? 'badge-blue'
                        : 'badge-amber'
                    }`}
                  >
                    {task.status}
                  </span>

                  {task.status !== 'Approved' && task.status !== 'Submitted' && (
                    <button
                      onClick={() => onOpenSubmitTask(task)}
                      className="btn-primary text-xs py-1.5 px-3.5 shadow-sm cursor-pointer"
                    >
                      Submit Work
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
