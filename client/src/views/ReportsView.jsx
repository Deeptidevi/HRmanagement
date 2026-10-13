import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { calculateMonthlyPayroll } from '../utils/calculations';
import { Download, FileText, BarChart3, TrendingUp } from 'lucide-react';

export default function ReportsView() {
  const store = useStore();
  const [activeTab, setActiveTab] = useState('attendance');

  const employees = store.employees.filter((e) => e.status === 'ACTIVE');

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeTab === 'attendance') {
      csvContent += 'Employee,Date,CheckIn,CheckOut,Hours,Status\n';
      store.attendance.forEach((a) => {
        csvContent += `${a.employeeId},${a.date},${a.checkIn || ''},${a.checkOut || ''},${a.workingHours || ''},${a.status}\n`;
      });
    } else {
      csvContent += 'Employee,Department,BasicSalary,HRA,GrossSalary\n';
      employees.forEach((e) => {
        csvContent += `${e.name},${e.department},${e.basicSalary},${e.hra},${e.basicSalary + e.hra}\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `amahr_${activeTab}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    store.showToast('Report Exported', 'CSV report has been downloaded successfully.', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Executive HR Reports
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Cross-departmental attendance audits, task velocity, and compensation reports
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="btn-primary text-xs py-2 px-4 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Download className="w-4 h-4" /> Export Report (CSV)
        </button>
      </div>

      {/* Tabs */}
      <div className="card-base p-2 flex flex-wrap items-center gap-1.5">
        {[
          { id: 'attendance', label: 'Attendance Audit' },
          { id: 'tasks', label: 'Deliverables & Velocity' },
          { id: 'payroll', label: 'Monthly Payroll Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Data */}
      <div className="card-base overflow-hidden">
        <div className="table-container">
          {activeTab === 'attendance' ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Shift Format</th>
                  <th>Present Days</th>
                  <th>Late Marks</th>
                  <th>Approved Leaves</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => {
                  const empAtt = store.attendance.filter((a) => a.employeeId === e.id);
                  const present = empAtt.filter((a) => a.status === 'Present').length;
                  const late = empAtt.filter((a) => a.status === 'Late').length;
                  const leaves = store.leaves.filter((l) => l.employeeId === e.id && l.status === 'Approved').length;

                  return (
                    <tr key={e.id}>
                      <td>
                        <span className="font-extrabold text-xs text-slate-800">{e.name}</span>
                      </td>
                      <td><span className="text-xs text-slate-600">{e.department}</span></td>
                      <td><span className="badge-pill badge-blue text-[10px]">{e.workingFormat}</span></td>
                      <td><span className="font-bold text-xs text-emerald-700">{present}</span></td>
                      <td><span className="font-bold text-xs text-amber-700">{late}</span></td>
                      <td><span className="font-bold text-xs text-slate-700">{leaves}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : activeTab === 'tasks' ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task Title</th>
                  <th>Assignee</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {store.tasks.map((t) => {
                  const emp = store.employees.find((e) => e.id === t.assignedTo);
                  return (
                    <tr key={t.id}>
                      <td><span className="font-bold text-xs text-slate-800">{t.title}</span></td>
                      <td><span className="text-xs text-slate-700">{emp?.name || t.assignedTo}</span></td>
                      <td><span className="text-xs text-slate-500">{t.department}</span></td>
                      <td><span className="badge-pill badge-dark text-[10px]">{t.priority}</span></td>
                      <td><span className="font-mono text-xs text-slate-600">{t.deadline}</span></td>
                      <td>
                        <span className={`badge-pill text-[10px] ${t.status === 'Approved' ? 'badge-green' : 'badge-amber'}`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Basic Salary</th>
                  <th>HRA Allowance</th>
                  <th>Special Allowances</th>
                  <th>Total Gross</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => {
                  const pay = calculateMonthlyPayroll(e.id, store.rawState);
                  return (
                    <tr key={e.id}>
                      <td><span className="font-extrabold text-xs text-slate-800">{e.name}</span></td>
                      <td><span className="font-mono text-xs">₹{pay.basicSalary.toLocaleString()}</span></td>
                      <td><span className="font-mono text-xs">₹{pay.hra.toLocaleString()}</span></td>
                      <td><span className="font-mono text-xs">₹{pay.allowances.toLocaleString()}</span></td>
                      <td><span className="font-mono text-xs font-bold text-slate-900">₹{pay.grossSalary.toLocaleString()}</span></td>
                      <td><span className="badge-pill badge-green text-[10px]">Processed</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
