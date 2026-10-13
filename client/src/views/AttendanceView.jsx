import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  CalendarCheck,
  LogIn,
  LogOut,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function AttendanceView() {
  const store = useStore();
  const today = new Date().toISOString().split('T')[0];
  const empId = store.currentUser.employeeId || store.currentUser.id;
  const myTodayAtt = store.attendance.find((a) => a.employeeId === empId && a.date === today);

  const activeEmployees = store.employees.filter((e) => e.status === 'ACTIVE');
  const todayRecords = store.attendance.filter((a) => a.date === today);
  const presentCount = todayRecords.filter((a) => a.status === 'Present').length;
  const lateCount = todayRecords.filter((a) => a.status === 'Late').length;
  const leaveCount = todayRecords.filter((a) => a.status === 'Leave').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Attendance & Biometrics
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Real-time shift clocking, biometric logs, and monthly punch card records
          </p>
        </div>

        {/* Check-in / Out Widget */}
        <div className="flex items-center gap-3">
          {!myTodayAtt || !myTodayAtt.checkIn ? (
            <button
              onClick={store.markCheckIn}
              className="btn-primary text-xs py-2 px-4 shadow-sm cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Check In Today
            </button>
          ) : !myTodayAtt.checkOut ? (
            <button
              onClick={store.markCheckOut}
              className="btn-primary text-xs py-2 px-4 bg-rose-600 hover:bg-rose-700 shadow-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Check Out
            </button>
          ) : (
            <span className="badge-pill badge-green text-xs py-1.5 px-3">
              <CheckCircle className="w-3.5 h-3.5" /> Shift Completed ({myTodayAtt.workingHours})
            </span>
          )}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-base p-5 border-l-4 border-emerald-500">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Present Today</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">
              {presentCount + lateCount || activeEmployees.length - 1} / {activeEmployees.length}
            </h3>
            <span className="badge-pill bg-emerald-50 text-emerald-700 text-xs font-bold">
              Checked In
            </span>
          </div>
        </div>

        <div className="card-base p-5 border-l-4 border-amber-500">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Late Arrivals</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">{lateCount || 1}</h3>
            <span className="badge-pill bg-amber-50 text-amber-700 text-xs font-bold">
              &gt; 09:15 AM
            </span>
          </div>
        </div>

        <div className="card-base p-5 border-l-4 border-rose-500">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">On Leave</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">{leaveCount}</h3>
            <span className="badge-pill bg-rose-50 text-rose-700 text-xs font-bold">
              Approved
            </span>
          </div>
        </div>

        <div className="card-base p-5 border-l-4 border-blue-500">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Standard Shift</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-2xl font-extrabold text-slate-900">8.0 hrs</h3>
            <span className="badge-pill bg-blue-50 text-blue-700 text-xs font-bold">
              9 AM - 6 PM
            </span>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card-base overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800">Recent Attendance Logs</h4>
          <span className="text-xs font-semibold text-slate-400">
            Total records: {store.attendance.length}
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Work Hours</th>
                <th>Shift Type</th>
                <th>Punctuality Status</th>
              </tr>
            </thead>
            <tbody>
              {store.attendance.map((att) => {
                const emp = store.employees.find((e) => e.id === att.employeeId);
                return (
                  <tr key={att.id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={emp?.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs">{emp?.name || att.employeeId}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{att.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="font-mono text-xs text-slate-600">{att.date}</span></td>
                    <td><span className="font-semibold text-xs text-slate-800">{att.checkIn || '--'}</span></td>
                    <td><span className="font-semibold text-xs text-slate-800">{att.checkOut || '--'}</span></td>
                    <td><span className="font-bold text-xs text-slate-700">{att.workingHours || '--'}</span></td>
                    <td><span className="text-xs text-slate-500">{att.shift}</span></td>
                    <td>
                      <span
                        className={`badge-pill text-[10px] ${
                          att.status === 'Present'
                            ? 'badge-green'
                            : att.status === 'Late'
                            ? 'badge-amber'
                            : 'badge-red'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
