import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  calculateEmployeePerformance,
  calculateWorkloadHealthScore
} from '../utils/calculations';
import {
  Search,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  Building,
  TrendingUp,
  Activity,
  Eye
} from 'lucide-react';

export default function EmployeesView({ onOpenAddEmployee, onSelectEmployee }) {
  const store = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const isHR = store.currentUser.role === 'HR_ADMIN';

  let employees = store.employees;

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    employees = employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q)
    );
  }

  if (departmentFilter !== 'ALL') {
    employees = employees.filter((e) => e.department === departmentFilter);
  }

  if (statusFilter !== 'ALL') {
    employees = employees.filter((e) => e.status === statusFilter);
  }

  const departments = ['ALL', 'Engineering', 'Product', 'Design', 'Human Resources', 'Finance'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Employees Directory
          </h2>
          <p className="text-xs font-medium text-slate-500">
            360° dossiers, salary structures, performance ratings, and workload health indexes
          </p>
        </div>

        {isHR && (
          <button
            onClick={onOpenAddEmployee}
            className="btn-primary text-xs py-2 px-4 shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Add New Employee
          </button>
        )}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="card-base p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-80 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, ID, designation..."
            className="w-full bg-transparent border-none outline-none text-xs text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400">Dept:</span>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="form-select text-xs py-1.5 px-3 rounded-full bg-slate-50"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select text-xs py-1.5 px-3 rounded-full bg-slate-50"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.length === 0 ? (
          <div className="col-span-full card-base p-12 text-center text-slate-400 text-xs">
            No employees found matching the filters.
          </div>
        ) : (
          employees.map((emp) => {
            const perf = calculateEmployeePerformance(emp.id, store.rawState);
            const health = calculateWorkloadHealthScore(emp.id, store.rawState);

            return (
              <div
                key={emp.id}
                className="card-base p-6 flex flex-col justify-between hover:border-blue-300 transition"
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-blue-50"
                      />
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 leading-tight">
                          {emp.name}
                        </h4>
                        <span className="badge-pill badge-dark text-[9px] font-mono mt-1">
                          {emp.id}
                        </span>
                      </div>
                    </div>
                    <span className="badge-pill badge-green text-[10px]">{emp.status}</span>
                  </div>

                  {/* Role & Dept */}
                  <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 mb-4 border border-slate-100 text-xs">
                    <p className="font-extrabold text-slate-800">{emp.designation}</p>
                    <p className="text-slate-500 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" /> {emp.department}
                    </p>
                    <p className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {emp.email}
                    </p>
                  </div>

                  {/* Performance & Health Scores */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-2.5 bg-blue-50/70 rounded-xl text-center border border-blue-100/50">
                      <span className="text-xs font-bold text-blue-600 uppercase flex items-center justify-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Perf: {perf.compositeScore}%
                      </span>
                      <p className="text-[10px] text-blue-700 font-semibold truncate mt-0.5">
                        {perf.badge}
                      </p>
                    </div>
                    <div className="p-2.5 bg-emerald-50/70 rounded-xl text-center border border-emerald-100/50">
                      <span className="text-xs font-bold text-emerald-600 uppercase flex items-center justify-center gap-1">
                        <Activity className="w-3 h-3" /> Health: {health.score}
                      </span>
                      <p className="text-[10px] text-emerald-700 font-semibold truncate mt-0.5">
                        {health.status}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Monthly Base</p>
                    <p className="text-xs font-extrabold text-slate-900">
                      ₹{(emp.basicSalary || 65000).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectEmployee(emp)}
                    className="btn-secondary text-xs py-1.5 px-3.5 flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" /> 360° Profile
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
