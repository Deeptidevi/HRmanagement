import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function AuditLogsView() {
  const store = useStore();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Audit Trails & Security
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Immutable enterprise audit log tracking role logins, task reviews, and salary disbursements
          </p>
        </div>

        <span className="badge-pill badge-green text-xs py-1.5 px-3">
          <ShieldCheck className="w-3.5 h-3.5" /> Immutable Audit Active
        </span>
      </div>

      {/* Logs Table */}
      <div className="card-base overflow-hidden">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Actor / User</th>
                <th>Action Type</th>
                <th>Event Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {store.auditLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {log.id}
                    </span>
                  </td>
                  <td>
                    <span className="font-extrabold text-slate-800 text-xs">{log.user}</span>
                  </td>
                  <td>
                    <span className="badge-pill badge-blue text-[10px] font-mono">
                      {log.action}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-600">{log.details}</span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-400 font-mono">{log.timestamp}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
