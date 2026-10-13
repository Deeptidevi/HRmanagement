import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Menu,
  Search,
  Plus,
  Bell,
  UserPlus,
  CheckSquare,
  Megaphone,
  UploadCloud,
  CalendarOff,
  Clock,
  FileUp,
  Database,
  LogOut,
  ChevronDown,
  Check,
  UserCheck
} from 'lucide-react';

export default function Topbar({ onOpenSearch, onOpenQuickAction, onToggleMobileSidebar, onNavigate }) {
  const {
    currentUser,
    notifications,
    markAllNotificationsRead,
    backendConnected,
    employees,
    switchUser,
    logout
  } = useStore();
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const isHR = currentUser?.role === 'HR_ADMIN';
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  const activeEmpId = currentUser?.id || currentUser?.employeeId || 'HR-001';

  return (
    <header className="topbar-container">
      {/* Left: Mobile Toggle & Welcome Greeting */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Hello {currentUser?.name?.split(' ')[0] || 'User'}
            <span className="text-xl">👋</span>
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs font-medium text-slate-500 hidden sm:inline">
              {isHR ? 'Enterprise HR Management System' : `Welcome to your employee workspace (${activeEmpId})`}
            </p>
            {backendConnected && (
              <span className="badge-pill bg-emerald-50 text-emerald-700 text-[10px] py-0.5 px-2 font-mono flex items-center gap-1 border border-emerald-200">
                <Database className="w-3 h-3 text-emerald-600" /> PostgreSQL Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions, Search, Notifications, Logout, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-600 hover:border-slate-300 transition text-xs font-medium shadow-sm"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search anything...</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] bg-slate-100 text-slate-500 rounded border border-slate-200">
            ⌘K
          </kbd>
        </button>

        {/* Quick Action Button & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowQuickMenu(!showQuickMenu)}
            className="btn-primary text-xs py-2 px-3.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Quick Action</span>
          </button>

          {showQuickMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in">
              {isHR ? (
                <>
                  <button
                    onClick={() => { setShowQuickMenu(false); onOpenQuickAction('add-employee'); }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <UserPlus className="w-4 h-4 text-blue-600" /> Add New Employee
                  </button>
                  <button
                    onClick={() => { setShowQuickMenu(false); onOpenQuickAction('assign-task'); }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <CheckSquare className="w-4 h-4 text-emerald-600" /> Assign New Task
                  </button>
                  <button
                    onClick={() => { setShowQuickMenu(false); onOpenQuickAction('publish-announcement'); }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Megaphone className="w-4 h-4 text-amber-600" /> Publish Announcement
                  </button>
                  <button
                    onClick={() => { setShowQuickMenu(false); onOpenQuickAction('upload-doc'); }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <UploadCloud className="w-4 h-4 text-purple-600" /> Upload Document
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setShowQuickMenu(false); onOpenQuickAction('apply-leave'); }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <CalendarOff className="w-4 h-4 text-blue-600" /> Apply for Leave
                  </button>
                  <button
                    onClick={() => { setShowQuickMenu(false); onOpenQuickAction('mark-attendance'); }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Clock className="w-4 h-4 text-emerald-600" /> Mark Attendance
                  </button>
                  <button
                    onClick={() => { setShowQuickMenu(false); onOpenQuickAction('upload-doc'); }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <FileUp className="w-4 h-4 text-purple-600" /> Upload Document
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn-icon relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-fade-in">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-800">
                  Notifications ({unreadCount} unread)
                </h4>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 p-2">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.link && onNavigate) {
                          onNavigate(n.link);
                        }
                        setShowNotifications(false);
                      }}
                      className={`p-3 hover:bg-slate-50 rounded-xl transition cursor-pointer flex gap-3 ${
                        !n.read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">
                          {n.time}
                        </span>
                      </div>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 self-center"></span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dedicated Quick Logout Button */}
        <button
          id="topbar-quick-logout"
          onClick={logout}
          className="btn-icon text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition cursor-pointer"
          title="Sign Out / Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>

        {/* User Profile Pill & Dropdown Switcher */}
        <div className="relative pl-1 border-l border-slate-200">
          <button
            id="topbar-profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 sm:gap-3 p-1 rounded-2xl hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1.5">
                <p className="text-xs font-bold text-slate-900 leading-tight">{currentUser?.name || 'User'}</p>
                <span className="text-[9px] font-mono font-bold text-blue-600 bg-blue-50 px-1 py-0.2 rounded border border-blue-200">
                  {activeEmpId}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">
                {currentUser?.designation?.split('&')[0] || (isHR ? 'Lead HR' : 'Team Member')}
              </p>
            </div>
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name || 'Avatar'}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-blue-100"
            />
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-fade-in divide-y divide-slate-100">
              {/* Profile Card Header */}
              <div className="px-4 pb-3 flex items-center gap-3">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-200 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-extrabold text-slate-900 truncate">{currentUser?.name}</h4>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isHR ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {isHR ? 'HR ADMIN' : 'EMPLOYEE'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {activeEmpId}</p>
                </div>
              </div>

              {/* Persona Switcher Section */}
              <div className="py-2 px-2">
                <div className="px-2 mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-slate-400" />
                    Switch Employee ID
                  </span>
                  <span className="text-[9px] text-slate-400">1-Click Swap</span>
                </div>

                <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
                  {/* HR Admin Option */}
                  <button
                    onClick={() => {
                      switchUser('HR_ADMIN');
                      setShowProfileMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                      isHR ? 'bg-blue-50 text-blue-900 font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                        HR
                      </div>
                      <div className="truncate">
                        <p className="text-xs truncate">Trisha Kyrlova</p>
                        <p className="text-[10px] text-slate-400">HR Administrator (Lead HR)</p>
                      </div>
                    </div>
                    {isHR && <Check className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" />}
                  </button>

                  {/* Employees List */}
                  {employees.map(emp => {
                    const isActive = !isHR && (activeEmpId === emp.id);
                    return (
                      <button
                        key={emp.id}
                        onClick={() => {
                          switchUser(emp.id);
                          setShowProfileMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                          isActive ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-slate-50 text-slate-700 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                          />
                          <div className="truncate">
                            <p className="text-xs truncate flex items-center gap-1.5">
                              {emp.name}
                              <span className="font-mono text-[9px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded font-semibold">
                                {emp.id}
                              </span>
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">{emp.designation}</p>
                          </div>
                        </div>
                        {isActive && <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Logout Button in Dropdown */}
              <div className="pt-2 px-2">
                <button
                  id="profile-dropdown-logout"
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out / Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
