import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Sparkles,
  LayoutDashboard,
  Users,
  CheckSquare,
  CalendarCheck,
  CalendarOff,
  Wallet,
  TrendingUp,
  FolderLock,
  Megaphone,
  Menu,
  LogOut,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ currentRoute, setCurrentRoute, isCollapsed, setIsCollapsed }) {
  const { currentUser, switchRole, switchUser, logout, employees } = useStore();
  const isHR = currentUser?.role === 'HR_ADMIN';
  const activeEmpId = currentUser?.id || currentUser?.employeeId || 'HR-001';

  const navItems = isHR ? [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Employees', icon: Users },
    { id: 'tasks', label: 'Tasks & Projects', icon: CheckSquare },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'leaves', label: 'Leaves', icon: CalendarOff },
    { id: 'payroll', label: 'Payroll', icon: Wallet },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'documents', label: 'Documents', icon: FolderLock },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ] : [
    { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'attendance', label: 'My Attendance', icon: CalendarCheck },
    { id: 'leaves', label: 'My Leaves', icon: CalendarOff },
    { id: 'payroll', label: 'My Payslips', icon: Wallet },
    { id: 'performance', label: 'My Performance', icon: TrendingUp },
    { id: 'documents', label: 'My Documents', icon: FolderLock },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
  ];

  return (
    <aside className={`sidebar-container ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand-header flex items-center justify-between px-2 mb-8">
        <div className="sidebar-brand-content flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="sidebar-brand-text min-w-0">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
              Ama<span className="text-blue-600">HR</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enterprise PERN</p>
          </div>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer flex-shrink-0"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentRoute(item.id)}
              className={`sidebar-nav-item w-full text-left ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon flex-shrink-0">
                <Icon className="w-5 h-5" />
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Quick Role & Employee ID Switcher Footer */}
      <div className="pt-4 border-t border-slate-100 mt-4">
        {!isCollapsed ? (
          <>
            <div className="sidebar-role-info p-3 bg-slate-50 rounded-2xl border border-slate-200/80 mb-2.5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isHR ? 'bg-blue-600' : 'bg-emerald-500'} animate-pulse`}></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Role: <strong className="text-slate-900">{isHR ? 'HR Admin' : 'Employee'}</strong>
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                  {activeEmpId}
                </span>
              </div>

              {/* HR / Employee Toggle Pills */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <button
                  id="role-toggle-hr"
                  onClick={() => switchUser('HR_ADMIN')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                    isHR ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  HR Admin
                </button>
                <button
                  id="role-toggle-employee"
                  onClick={() => switchRole('EMPLOYEE')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition cursor-pointer flex items-center justify-center gap-1 ${
                    !isHR ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Employee
                </button>
              </div>

              {/* Employee ID Selector Dropdown */}
              <div className="pt-2 border-t border-slate-200/60">
                <label className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  <span className="flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-slate-400" />
                    Switch Employee ID:
                  </span>
                  {!isHR && <span className="text-emerald-600 font-semibold lowercase text-[9px]">active</span>}
                </label>
                <select
                  id="sidebar-employee-select"
                  value={isHR ? 'HR_ADMIN' : activeEmpId}
                  onChange={(e) => switchUser(e.target.value)}
                  className="w-full text-xs font-semibold bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm transition"
                >
                  <option value="HR_ADMIN">👑 Trisha Kyrlova (HR Admin)</option>
                  <optgroup label="Team Employees (By ID)">
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.id} · {emp.name} ({emp.designation?.split(' ')[0] || emp.department})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Logout Button */}
            <button
              id="sidebar-logout-btn"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-100 shadow-sm transition cursor-pointer mb-2"
              title="Sign out of current session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              id="sidebar-collapsed-logout"
              onClick={logout}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-rose-100 transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="sidebar-footer-text px-2 text-[10px] text-slate-400 font-medium text-center">
          AmaHR PERN Stack v2.0
        </div>
      </div>
    </aside>
  );
}
