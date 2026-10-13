import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  CalendarOff,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X
} from 'lucide-react';

export default function LeavesView({ onOpenApplyLeave, onOpenReviewLeave }) {
  const store = useStore();
  const isHR = store.currentUser.role === 'HR_ADMIN';

  const allLeaves = store.leaves;
  const myLeaves = isHR
    ? allLeaves
    : allLeaves.filter(
        (l) => l.employeeId === (store.currentUser.employeeId || store.currentUser.id)
      );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Leave Management
          </h2>
          <p className="text-xs font-medium text-slate-500">
            {isHR
              ? 'Review employee time-off requests, approve quotas, and monitor departmental coverage'
              : 'Submit time-off requests and track approval statuses and quota balances'}
          </p>
        </div>

        <button
          onClick={onOpenApplyLeave}
          className="btn-primary text-xs py-2 px-4 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      {/* Quotas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="card-base p-5 border-l-4 border-blue-500">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Casual Leave</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">12 Days</h3>
            <span className="badge-pill bg-blue-50 text-blue-700 text-xs font-bold">Available</span>
          </div>
        </div>

        <div className="card-base p-5 border-l-4 border-emerald-500">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Sick Leave</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">10 Days</h3>
            <span className="badge-pill bg-emerald-50 text-emerald-700 text-xs font-bold">Medical</span>
          </div>
        </div>

        <div className="card-base p-5 border-l-4 border-purple-500">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Earned / Annual</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">15 Days</h3>
            <span className="badge-pill bg-purple-50 text-purple-700 text-xs font-bold">Paid</span>
          </div>
        </div>

        <div className="card-base p-5 border-l-4 border-amber-500">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Unpaid Leave</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">30 Days</h3>
            <span className="badge-pill bg-amber-50 text-amber-700 text-xs font-bold">Quota</span>
          </div>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="card-base overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800">Leave Applications & History</h4>
          <span className="text-xs font-semibold text-slate-400">
            Total records: {myLeaves.length}
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Category</th>
                <th>Duration</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
                <th>HR Comment</th>
                {isHR && <th>Review Action</th>}
              </tr>
            </thead>
            <tbody>
              {myLeaves.length === 0 ? (
                <tr>
                  <td colSpan={isHR ? 8 : 7} className="text-center py-8 text-slate-400 text-xs">
                    No leave applications recorded.
                  </td>
                </tr>
              ) : (
                myLeaves.map((lv) => (
                  <tr key={lv.id}>
                    <td>
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs">
                          {lv.employeeName || lv.employeeId}
                        </p>
                        <span className="font-mono text-[10px] text-slate-400">{lv.id}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge-pill badge-blue text-[10px] font-bold">
                        {lv.category || lv.type}
                      </span>
                    </td>
                    <td>
                      <span className="font-mono text-xs text-slate-700">
                        {lv.fromDate} to {lv.toDate}
                      </span>
                    </td>
                    <td>
                      <span className="font-bold text-xs text-slate-800">{lv.days}d</span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-600 max-w-xs block truncate">
                        {lv.reason}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge-pill text-[10px] ${
                          lv.status === 'Approved'
                            ? 'badge-green'
                            : lv.status === 'Pending'
                            ? 'badge-amber'
                            : 'badge-red'
                        }`}
                      >
                        {lv.status}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs text-slate-500 italic">
                        {lv.hrComment || '--'}
                      </span>
                    </td>

                    {isHR && (
                      <td>
                        {lv.status === 'Pending' ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => store.reviewLeave(lv.id, 'Approved', 'Approved by HR')}
                              className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition"
                              title="Quick Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => store.reviewLeave(lv.id, 'Rejected', 'Coverage constraints')}
                              className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition"
                              title="Quick Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-semibold">Reviewed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
