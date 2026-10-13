import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { calculateMonthlyPayroll } from '../utils/calculations';
import {
  Wallet,
  Zap,
  TrendingDown,
  CheckCircle,
  FileText,
  DollarSign
} from 'lucide-react';

export default function PayrollView({ onSelectPayslip }) {
  const store = useStore();
  const isHR = store.currentUser.role === 'HR_ADMIN';

  const employees = isHR
    ? store.employees.filter((e) => e.status === 'ACTIVE')
    : store.employees.filter((e) => e.id === (store.currentUser.employeeId || store.currentUser.id));

  const payrolls = employees.map((e) => calculateMonthlyPayroll(e.id, store.rawState)).filter(Boolean);

  const totalGross = payrolls.reduce((acc, p) => acc + p.grossSalary, 0);
  const totalDeductions = payrolls.reduce((acc, p) => acc + p.totalDeductions, 0);
  const totalNet = payrolls.reduce((acc, p) => acc + p.netSalary, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Payroll & Compensation
          </h2>
          <p className="text-xs font-medium text-slate-500">
            {isHR
              ? 'Statutory compliance (TDS, PF), gross ledger, and 1-click batch disbursement'
              : 'Detailed breakdown of monthly earnings, tax deductions, and download payslips'}
          </p>
        </div>

        {isHR && (
          <button
            onClick={() => store.disbursePayroll('October 2026')}
            className="btn-primary text-xs py-2 px-4 shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <Zap className="w-4 h-4" /> Process October 2026 Batch
          </button>
        )}
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="card-base p-6 border-l-4 border-blue-500">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Gross Salary</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">
              ₹{totalGross.toLocaleString()}
            </h3>
            <span className="badge-pill bg-blue-50 text-blue-700 text-xs font-bold">
              Base + Allowances
            </span>
          </div>
        </div>

        <div className="card-base p-6 border-l-4 border-rose-500">
          <p className="text-xs font-bold text-slate-400 uppercase mb-1">
            Total Deductions & Taxes
          </p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-rose-600">
              -₹{totalDeductions.toLocaleString()}
            </h3>
            <span className="badge-pill bg-rose-50 text-rose-700 text-xs font-bold">
              TDS + PF + Leaves
            </span>
          </div>
        </div>

        <div className="card-base p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
          <p className="text-xs font-bold text-blue-100 uppercase mb-1">Net Disbursement</p>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-white">
              ₹{totalNet.toLocaleString()}
            </h3>
            <span className="badge-pill bg-white text-blue-900 text-xs font-bold">
              Ready to Disburse
            </span>
          </div>
        </div>
      </div>

      {/* Payroll Ledger Table */}
      <div className="card-base overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800">
            Monthly Compensation Ledger (October 2026)
          </h4>
          <span className="badge-pill badge-green text-xs font-bold">INR (₹) Standard</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Basic Pay</th>
                <th>HRA & Allowances</th>
                <th>Gross Salary</th>
                <th>Deductions (TDS/PF)</th>
                <th>Net Payable</th>
                <th>Status</th>
                <th>Payslip</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((p) => (
                <tr key={p.employeeId}>
                  <td>
                    <div>
                      <p className="font-extrabold text-slate-900 text-xs">{p.name}</p>
                      <span className="font-mono text-[10px] text-slate-400">{p.employeeId}</span>
                    </div>
                  </td>
                  <td><span className="text-xs text-slate-600">{p.department}</span></td>
                  <td><span className="font-mono text-xs font-semibold text-slate-800">₹{p.basicSalary.toLocaleString()}</span></td>
                  <td><span className="font-mono text-xs text-slate-600">₹{(p.hra + p.allowances).toLocaleString()}</span></td>
                  <td><span className="font-mono text-xs font-bold text-slate-900">₹{p.grossSalary.toLocaleString()}</span></td>
                  <td><span className="font-mono text-xs font-bold text-rose-600">-₹{p.totalDeductions.toLocaleString()}</span></td>
                  <td><span className="font-mono text-xs font-extrabold text-emerald-700">₹{p.netSalary.toLocaleString()}</span></td>
                  <td><span className="badge-pill badge-green text-[10px]">{p.status}</span></td>
                  <td>
                    <button
                      onClick={() => onSelectPayslip(p)}
                      className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition cursor-pointer"
                      title="View Payslip"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
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
