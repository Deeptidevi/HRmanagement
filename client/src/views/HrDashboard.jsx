import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  calculateEmployeePerformance,
  getHRDashboardAnalytics,
  calculateWorkloadHealthScore
} from '../utils/calculations';
import {
  Award,
  Layers,
  CheckCircle,
  Wallet,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Activity,
  Calendar,
  CheckSquare,
  Clock,
  Sparkles
} from 'lucide-react';

export default function HrDashboard({ onNavigate }) {
  const store = useStore();
  const analytics = getHRDashboardAnalytics(store.rawState);
  const activeEmployees = store.employees.filter((e) => e.status === 'ACTIVE');

  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [isProgressHovered, setIsProgressHovered] = useState(false);
  const [showProgressDetail, setShowProgressDetail] = useState(false);

  const currentSpotlight = activeEmployees[spotlightIndex] || activeEmployees[0] || {};
  const currentPerf = calculateEmployeePerformance(currentSpotlight.id, store.rawState);
  const currentHealth = calculateWorkloadHealthScore(currentSpotlight.id, store.rawState);

  // Dynamic real-time task progress calculation for spotlight employee
  const empTasks = (store.tasks || []).filter((t) => t.assignedTo === currentSpotlight.id);
  const totalEmpTasks = empTasks.length;
  const approvedTasks = empTasks.filter((t) => t.status === 'Approved').length;
  const submittedTasks = empTasks.filter((t) => t.status === 'Submitted').length;
  const inProgressTasks = empTasks.filter((t) => t.status === 'In Progress' || t.status === 'Rework Required').length;
  const taskProgressPercent = totalEmpTasks > 0 ? Math.round((approvedTasks / totalEmpTasks) * 100) : 100;

  const prevSpotlight = () => {
    setSpotlightIndex((prev) => (prev === 0 ? activeEmployees.length - 1 : prev - 1));
  };

  const nextSpotlight = () => {
    setSpotlightIndex((prev) => (prev === activeEmployees.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Top KPI Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Dark Hero Card: Tenure */}
        <div
          onClick={() => onNavigate('employees')}
          className="card-dark p-6 cursor-pointer hover:scale-[1.01] transition-transform"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-400">Company Tenure</span>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold tracking-tight text-white">
              {currentSpotlight.daysInCompany || 418}{' '}
              <span className="text-sm font-semibold text-slate-400">Days</span>
            </h3>
            <span className="text-xs font-bold text-blue-300 bg-blue-950/80 px-2.5 py-1 rounded-full border border-blue-700/50">
              {((currentSpotlight.daysInCompany || 418) / 365).toFixed(1)} Yrs Tenure
            </span>
          </div>
        </div>

        {/* Metric 2: Projects in Progress */}
        <div
          onClick={() => onNavigate('tasks')}
          className="card-base p-6 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Projects in progress
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-4xl font-extrabold tracking-tight text-slate-900">
              {analytics.pendingTasks || 6}
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              +1 active milestone
            </span>
          </div>
        </div>

        {/* Metric 3: Completed Projects */}
        <div
          onClick={() => onNavigate('tasks')}
          className="card-base p-6 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Completed projects
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-4xl font-extrabold tracking-tight text-slate-900">
              {analytics.completedTasks + 20 || 28}
            </h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              +4 this month
            </span>
          </div>
        </div>

        {/* Metric 4: Monthly Payroll */}
        <div
          onClick={() => onNavigate('payroll')}
          className="card-base p-6 cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Monthly Payroll
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              ₹{(analytics.totalGrossPayroll || 428500).toLocaleString()}
            </h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Full PERN Ledger
            </span>
          </div>
        </div>
      </div>

      {/* 2. Middle Grid: Person Spotlight + Working Format + Attendance/Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Person Spotlight Carousel Card */}
        <div className="lg:col-span-5 card-base p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-800">Person Spotlight</h4>
              <span className="badge-pill badge-blue text-[10px] font-mono font-bold">
                {spotlightIndex + 1} / {activeEmployees.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevSpotlight}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                title="Previous Employee"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSpotlight}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                title="Next Employee"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('employees')}
                className="text-xs font-bold text-blue-600 hover:underline ml-2"
              >
                Directory
              </button>
            </div>
          </div>

          {/* Employee Spotlight Body */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center gap-4 mb-3">
            <img
              src={currentSpotlight.avatar}
              alt={currentSpotlight.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-blue-100"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h5 className="text-base font-extrabold text-slate-900 truncate">
                  {currentSpotlight.name}
                </h5>
                <span className="badge-pill badge-dark text-[9px] font-mono font-bold">
                  {currentSpotlight.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {currentSpotlight.designation} • {currentSpotlight.department}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="badge-pill bg-blue-100 text-blue-700 text-[10px]">
                  {currentSpotlight.workingFormat || 'Hybrid'}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  Base: ₹{(currentSpotlight.basicSalary || 65000).toLocaleString()}/mo
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Task Progress Indicator with Interactive Click & Hover Calculation */}
          <div
            onMouseEnter={() => setIsProgressHovered(true)}
            onMouseLeave={() => setIsProgressHovered(false)}
            onClick={() => setShowProgressDetail((prev) => !prev)}
            className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer mb-3 select-none ${
              showProgressDetail || isProgressHovered
                ? 'bg-gradient-to-br from-blue-50/90 via-indigo-50/60 to-purple-50/80 border-blue-300 shadow-sm'
                : 'bg-slate-50/90 border-slate-100 hover:border-blue-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* SVG Radial Progress Ring */}
                <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      className="stroke-slate-200/70"
                      strokeWidth="4"
                      fill="transparent"
                    />
                    <circle
                      cx="22"
                      cy="22"
                      r="18"
                      className="stroke-blue-600 transition-all duration-700 ease-out"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 18}
                      strokeDashoffset={2 * Math.PI * 18 - (taskProgressPercent / 100) * (2 * Math.PI * 18)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[11px] font-black text-slate-800">
                    {taskProgressPercent}%
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h6 className="text-xs font-extrabold text-slate-900">
                      Real-time Milestone Progress
                    </h6>
                    <span className="badge-pill bg-blue-100 text-blue-700 text-[9px] font-bold">
                      {isProgressHovered ? 'Hover Active' : showProgressDetail ? 'Expanded' : 'Hover/Click'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    {approvedTasks} of {totalEmpTasks} deliverables verified ({taskProgressPercent}% completion)
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  {showProgressDetail ? 'Hide Formula ▲' : 'Show Formula ▼'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {totalEmpTasks} Total
                </span>
              </div>
            </div>

            {/* Real-time Calculation Breakdown (Active on Hover or Click) */}
            {(showProgressDetail || isProgressHovered) && (
              <div className="mt-3 pt-3 border-t border-blue-100/70 animate-fade-in space-y-2">
                <div className="p-2.5 bg-white/90 rounded-xl border border-blue-100 text-[11px]">
                  <span className="font-bold text-slate-700">Live Calculation Formula:</span>
                  <p className="font-mono text-blue-700 text-[10px] mt-0.5">
                    Progress = ({approvedTasks} approved / {totalEmpTasks || 1} total) × 100 = <strong className="font-bold text-blue-900">{taskProgressPercent}%</strong>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 text-emerald-800 font-bold">
                    <span className="block text-xs font-black text-emerald-700">{approvedTasks}</span>
                    Approved
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg border border-blue-100 text-blue-800 font-bold">
                    <span className="block text-xs font-black text-blue-700">{submittedTasks}</span>
                    In Review
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 font-bold">
                    <span className="block text-xs font-black text-amber-700">{inProgressTasks}</span>
                    In Progress
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Performance & Health Score Matrix Dual Display */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-blue-800 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> Performance
                </span>
                <span className="text-xs font-extrabold text-blue-600">
                  {currentPerf.compositeScore}%
                </span>
              </div>
              <p className="text-[10px] text-blue-600 font-semibold">{currentPerf.badge}</p>
            </div>

            <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5" /> Workload Health
                </span>
                <span className="text-xs font-extrabold text-emerald-600">
                  {currentHealth.score}/100
                </span>
              </div>
              <p className="text-[10px] text-emerald-600 font-semibold">{currentHealth.status}</p>
            </div>
          </div>
        </div>

        {/* Working Format Distribution */}
        <div className="lg:col-span-3 card-base p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-800 mb-1">Working Format</h4>
            <p className="text-xs text-slate-400">Enterprise arrangement</p>
          </div>

          <div className="space-y-4 my-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Hybrid Format</span>
                <span>60%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>In-Office</span>
                <span>30%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Full Remote</span>
                <span>10%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
            <span className="text-xs font-extrabold text-slate-800">
              {activeEmployees.length} Total Registered
            </span>
            <p className="text-[10px] text-slate-400 font-semibold">Active Team Members</p>
          </div>
        </div>

        {/* Live Attendance & Shift Pulse */}
        <div className="lg:col-span-4 card-base p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-bold text-slate-800">Today's Pulse</h4>
              <p className="text-xs text-slate-400">Real-time biometric log</p>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View Full
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 my-2">
            <div className="p-3 bg-emerald-50 rounded-xl text-center border border-emerald-100">
              <span className="text-xl font-extrabold text-emerald-700">
                {analytics.presentCount || activeEmployees.length - 1}
              </span>
              <p className="text-[10px] font-bold text-emerald-800 uppercase mt-0.5">Present</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-center border border-amber-100">
              <span className="text-xl font-extrabold text-amber-700">
                {analytics.lateCount || 1}
              </span>
              <p className="text-[10px] font-bold text-amber-800 uppercase mt-0.5">Late</p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl text-center border border-rose-100">
              <span className="text-xl font-extrabold text-rose-700">
                {analytics.onLeaveCount || 0}
              </span>
              <p className="text-[10px] font-bold text-rose-800 uppercase mt-0.5">Leave</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700">Shift Window</span>
            </div>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              09:00 AM - 06:00 PM
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Quick Deliverables & Corporate Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-blue-600" /> Deliverables Overview
            </h4>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              See All Tasks
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {store.tasks.slice(0, 4).map((task) => (
              <div key={task.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h5 className="text-xs font-bold text-slate-800 truncate">{task.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {task.department} • Deadline: {task.deadline}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`badge-pill text-[10px] ${
                      task.status === 'Approved'
                        ? 'badge-green'
                        : task.status === 'Submitted'
                        ? 'badge-blue'
                        : 'badge-amber'
                    }`}
                  >
                    {task.status}
                  </span>
                  {task.status === 'Submitted' && (
                    <button
                      onClick={() => onNavigate('tasks')}
                      className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-lg transition cursor-pointer"
                    >
                      Evaluate →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Announcements Preview */}
        <div className="card-base p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> Enterprise Bulletins
            </h4>
            <button
              onClick={() => onNavigate('announcements')}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              All Notices
            </button>
          </div>

          <div className="space-y-3">
            {store.announcements.slice(0, 2).map((ann) => (
              <div
                key={ann.id}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="badge-pill badge-blue text-[10px]">{ann.priority} Priority</span>
                  <span className="text-[10px] font-semibold text-slate-400 font-mono">
                    {ann.publishDate}
                  </span>
                </div>
                <h5 className="text-xs font-bold text-slate-900 mt-1">{ann.title}</h5>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ann.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
