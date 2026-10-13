import React, { useState } from 'react';
import { useStore } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Modal from './components/Modal';
import SearchModal from './components/SearchModal';
import ToastContainer from './components/ToastContainer';
import { Star, CheckCircle, AlertTriangle, FileText, Download, Check, Sparkles, Trash2 } from 'lucide-react';

// Views
import HrDashboard from './views/HrDashboard';
import EmployeeDashboard from './views/EmployeeDashboard';
import EmployeesView from './views/EmployeesView';
import TasksView from './views/TasksView';
import AttendanceView from './views/AttendanceView';
import LeavesView from './views/LeavesView';
import PayrollView from './views/PayrollView';
import PerformanceView from './views/PerformanceView';
import DocumentsView from './views/DocumentsView';
import AnnouncementsView from './views/AnnouncementsView';

export default function App() {
  const store = useStore();
  const [currentRoute, setCurrentRoute] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'add-employee', 'create-task', 'submit-task', 'review-task', 'apply-leave', 'upload-doc', 'create-announcement', 'view-profile', 'view-payslip'
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states for modals
  const [empForm, setEmpForm] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    designation: 'Software Engineer',
    basicSalary: 60000,
    workingFormat: 'Hybrid',
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    department: 'Engineering',
    assignedTo: 'EMP-001',
    priority: 'High',
    deadline: '2026-10-25',
    description: '',
  });

  const [submitForm, setSubmitForm] = useState({
    fileName: 'deliverable_bundle.zip',
    notes: 'Completed all milestone requirements and documentation.',
  });

  const [rubricScores, setRubricScores] = useState({
    quality: 5,
    timeliness: 4.8,
    architecture: 5,
    collaboration: 4.8,
  });

  const [reviewForm, setReviewForm] = useState({
    rating: 4.9,
    feedback: 'Excellent execution, adheres to architecture guidelines and clean code standards.',
  });

  const getCompositeScore = () => {
    const avg = (rubricScores.quality + rubricScores.timeliness + rubricScores.architecture + rubricScores.collaboration) / 4;
    return Number(avg.toFixed(1));
  };

  const [leaveForm, setLeaveForm] = useState({
    category: 'Casual',
    fromDate: '2026-10-20',
    toDate: '2026-10-21',
    days: 2,
    reason: 'Personal engagement',
  });

  const [docForm, setDocForm] = useState({
    title: '',
    category: 'Contracts',
    employeeId: 'ALL',
    size: '1.5 MB',
  });

  const [annForm, setAnnForm] = useState({
    title: '',
    priority: 'Medium',
    audience: 'All Employees',
    description: '',
  });

  const isHR = store.currentUser?.role === 'HR_ADMIN';

  // Modal Submit Handlers
  const handleAddEmployeeSubmit = (e) => {
    e.preventDefault();
    store.addEmployee({
      ...empForm,
      basicSalary: Number(empForm.basicSalary),
      hra: Math.round(Number(empForm.basicSalary) * 0.4),
      allowances: 10000,
      bonuses: 5000,
    });
    setActiveModal(null);
  };

  const handleCreateTaskSubmit = (e) => {
    e.preventDefault();
    store.createTask(taskForm);
    setActiveModal(null);
  };

  const handleSubmitTaskDeliverable = (e) => {
    e.preventDefault();
    if (selectedItem) {
      store.submitTask(selectedItem.id, submitForm);
      setActiveModal(null);
    }
  };

  const handleReviewTaskDeliverable = (statusAction = 'Approve') => {
    if (selectedItem) {
      const finalRating = statusAction === 'Rework' ? 2.5 : getCompositeScore();
      store.reviewTask(selectedItem.id, finalRating, reviewForm.feedback);
      setActiveModal(null);
    }
  };

  const handleApplyLeaveSubmit = (e) => {
    e.preventDefault();
    store.applyLeave(leaveForm);
    setActiveModal(null);
  };

  const handleUploadDocSubmit = (e) => {
    e.preventDefault();
    store.uploadDocument(docForm);
    setActiveModal(null);
  };

  const handleCreateAnnouncementSubmit = (e) => {
    e.preventDefault();
    store.createAnnouncement(annForm);
    setActiveModal(null);
  };

  // Render view
  const renderView = () => {
    switch (currentRoute) {
      case 'dashboard':
        return isHR ? (
          <HrDashboard onNavigate={setCurrentRoute} />
        ) : (
          <EmployeeDashboard
            onNavigate={setCurrentRoute}
            onOpenSubmitTask={(task) => {
              setSelectedItem(task);
              setActiveModal('submit-task');
            }}
          />
        );
      case 'employees':
        return (
          <EmployeesView
            onOpenAddEmployee={() => setActiveModal('add-employee')}
            onSelectEmployee={(emp) => {
              setSelectedItem(emp);
              setActiveModal('view-profile');
            }}
          />
        );
      case 'tasks':
        return (
          <TasksView
            onOpenCreateTask={() => setActiveModal('create-task')}
            onOpenSubmitTask={(task) => {
              setSelectedItem(task);
              setActiveModal('submit-task');
            }}
            onOpenReviewTask={(task) => {
              setSelectedItem(task);
              setActiveModal('review-task');
            }}
          />
        );
      case 'attendance':
        return <AttendanceView />;
      case 'leaves':
        return (
          <LeavesView
            onOpenApplyLeave={() => setActiveModal('apply-leave')}
            onOpenReviewLeave={(leave) => {
              setSelectedItem(leave);
              setActiveModal('review-leave');
            }}
          />
        );
      case 'payroll':
        return (
          <PayrollView
            onSelectPayslip={(payroll) => {
              setSelectedItem(payroll);
              setActiveModal('view-payslip');
            }}
          />
        );
      case 'performance':
        return <PerformanceView />;
      case 'documents':
        return <DocumentsView onOpenUploadDoc={() => setActiveModal('upload-doc')} />;
      case 'announcements':
        return (
          <AnnouncementsView
            onOpenCreateAnnouncement={() => setActiveModal('create-announcement')}
          />
        );
      default:
        return isHR ? (
          <HrDashboard onNavigate={setCurrentRoute} />
        ) : (
          <EmployeeDashboard onNavigate={setCurrentRoute} />
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F4F7FB]">
      {/* Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        setCurrentRoute={setCurrentRoute}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Topbar */}
        <Topbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigate={(route) => setCurrentRoute(route)}
          onOpenQuickAction={(action) => {
            if (action === 'add-employee') setActiveModal('add-employee');
            if (action === 'assign-task') setActiveModal('create-task');
            if (action === 'publish-announcement') setActiveModal('create-announcement');
            if (action === 'upload-doc') setActiveModal('upload-doc');
            if (action === 'apply-leave') setActiveModal('apply-leave');
            if (action === 'mark-attendance') store.markCheckIn();
          }}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* View Body */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {renderView()}
        </main>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(route) => setCurrentRoute(route)}
      />

      {/* Add Employee Modal */}
      <Modal
        isOpen={activeModal === 'add-employee'}
        onClose={() => setActiveModal(null)}
        title="Onboard New Employee (PERN)"
        footer={
          <>
            <button onClick={() => setActiveModal(null)} className="btn-secondary text-xs py-2 px-4 cursor-pointer">
              Cancel
            </button>
            <button onClick={handleAddEmployeeSubmit} className="btn-primary text-xs py-2 px-5 cursor-pointer">
              Onboard Employee
            </button>
          </>
        }
      >
        <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              required
              value={empForm.name}
              onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
              className="form-input"
              placeholder="e.g. Vikram Sharma"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                value={empForm.email}
                onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                className="form-input"
                placeholder="v.sharma@mycomp.com"
              />
            </div>
            <div>
              <label className="form-label">Monthly Base Salary (₹)</label>
              <input
                type="number"
                required
                value={empForm.basicSalary}
                onChange={(e) => setEmpForm({ ...empForm, basicSalary: e.target.value })}
                className="form-input"
                placeholder="60000"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Department</label>
              <select
                value={empForm.department}
                onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                className="form-select"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="form-label">Working Format</label>
              <select
                value={empForm.workingFormat}
                onChange={(e) => setEmpForm({ ...empForm, workingFormat: e.target.value })}
                className="form-select"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Office">Office</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Designation</label>
            <input
              type="text"
              required
              value={empForm.designation}
              onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })}
              className="form-input"
              placeholder="e.g. Senior Backend Engineer"
            />
          </div>
        </form>
      </Modal>

      {/* Create Task Modal */}
      <Modal
        isOpen={activeModal === 'create-task'}
        onClose={() => setActiveModal(null)}
        title="Assign New Task Milestone"
        footer={
          <>
            <button onClick={() => setActiveModal(null)} className="btn-secondary text-xs py-2 px-4 cursor-pointer">
              Cancel
            </button>
            <button onClick={handleCreateTaskSubmit} className="btn-primary text-xs py-2 px-5 cursor-pointer">
              Assign Task
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateTaskSubmit} className="space-y-4">
          <div>
            <label className="form-label">Task Title</label>
            <input
              type="text"
              required
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="form-input"
              placeholder="e.g. Build GraphQL Endpoint & Subscriptions"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Assignee</label>
              <select
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                className="form-select"
              >
                {store.employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Priority</label>
              <select
                value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                className="form-select"
              >
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Department</label>
              <select
                value={taskForm.department}
                onChange={(e) => setTaskForm({ ...taskForm, department: e.target.value })}
                className="form-select"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div>
              <label className="form-label">Deadline</label>
              <input
                type="date"
                required
                value={taskForm.deadline}
                onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Description / Deliverable Criteria</label>
            <textarea
              rows={3}
              required
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="form-textarea"
              placeholder="Outline deliverables and acceptance criteria..."
            />
          </div>
        </form>
      </Modal>

      {/* Submit Task Modal */}
      <Modal
        isOpen={activeModal === 'submit-task'}
        onClose={() => setActiveModal(null)}
        title={`Submit Deliverable: ${selectedItem?.title || ''}`}
        footer={
          <>
            <button onClick={() => setActiveModal(null)} className="btn-secondary text-xs py-2 px-4 cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSubmitTaskDeliverable} className="btn-primary text-xs py-2 px-5 cursor-pointer">
              Submit to HR
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmitTaskDeliverable} className="space-y-4">
          <div>
            <label className="form-label">Deliverable File / Attachment</label>
            <input
              type="text"
              required
              value={submitForm.fileName}
              onChange={(e) => setSubmitForm({ ...submitForm, fileName: e.target.value })}
              className="form-input"
              placeholder="e.g. final_build_v1.zip"
            />
          </div>

          <div>
            <label className="form-label">Submission Notes & Implementation Summary</label>
            <textarea
              rows={4}
              required
              value={submitForm.notes}
              onChange={(e) => setSubmitForm({ ...submitForm, notes: e.target.value })}
              className="form-textarea"
              placeholder="Details on test coverage, PR link, or deployment notes..."
            />
          </div>
        </form>
      </Modal>

      {/* Review Task Modal - 4-Dimension Rubric Evaluation */}
      <Modal
        isOpen={activeModal === 'review-task'}
        onClose={() => setActiveModal(null)}
        title={`Evaluate Deliverable: ${selectedItem?.title || ''}`}
        maxWidth="max-w-3xl"
        footer={
          activeModal === 'review-task' && selectedItem && (
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                onClick={() => handleReviewTaskDeliverable('Rework')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
              >
                Request Rework
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="btn-secondary text-xs py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleReviewTaskDeliverable('Approve')}
                  className="btn-primary text-xs py-2 px-5 cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Approve Deliverable ({getCompositeScore()} / 5.0)
                </button>
              </div>
            </div>
          )
        }
      >
        {activeModal === 'review-task' && selectedItem && (() => {
          const assignee = store.employees.find((e) => e.id === selectedItem?.assignedTo) || {
            name: 'Assigned Employee',
            designation: 'Contributor',
            department: selectedItem?.department || 'Engineering',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          };
          const compScore = getCompositeScore();

          return (
            <div className="space-y-5">
              {/* Deliverable Metadata Banner */}
              <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-white shadow-sm ring-2 ring-blue-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900">{assignee.name}</h4>
                      <span className="badge-pill badge-dark text-[9px] font-mono">{selectedItem.assignedTo}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{assignee.designation} • {assignee.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:text-right">
                  <span className="badge-pill badge-blue text-xs font-bold font-mono">
                    {selectedItem.id}
                  </span>
                  <span className={`badge-pill text-xs font-bold ${
                    selectedItem.priority === 'Urgent' ? 'badge-red' : selectedItem.priority === 'High' ? 'badge-amber' : 'badge-blue'
                  }`}>
                    {selectedItem.priority}
                  </span>
                </div>
              </div>

              {/* Submitted Deliverable File & Notes */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" /> Submitted Deliverable Asset
                  </span>
                  <span className="badge-pill bg-blue-100/80 text-blue-800 text-[10px] font-mono flex items-center gap-1">
                    <Download className="w-3 h-3" /> {selectedItem.submission?.fileName || 'deliverable_bundle.zip'}
                  </span>
                </div>
                <div className="text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-blue-100/60 leading-relaxed">
                  <strong className="text-blue-950 font-semibold">Contributor Notes:</strong> "
                  {selectedItem.submission?.notes || 'All milestone deliverables completed, tested, and ready for appraisal.'}
                  "
                </div>
              </div>

              {/* 4-Dimension Rubric Scoring Header & Live Gauge */}
              <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-sm flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">
                    4-Dimension Rubric Appraisal
                  </span>
                  <h4 className="text-base font-extrabold flex items-center gap-2 mt-0.5">
                    <Sparkles className="w-4 h-4 text-amber-400" /> Real-time Composite Score
                  </h4>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      {compScore} <span className="text-xs font-normal text-slate-300">/ 5.0</span>
                    </span>
                    <p className="text-[10px] text-blue-200 font-semibold">
                      {compScore >= 4.5 ? '★ Outstanding' : compScore >= 3.0 ? '✓ Approved' : '⚠ Needs Rework'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Interactive Dimension Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Quality */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-800">1. Code / Design Quality (30%)</span>
                    <span className="badge-pill badge-blue text-[11px] font-mono font-bold">
                      {rubricScores.quality.toFixed(1)} ★
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={rubricScores.quality}
                    onChange={(e) => setRubricScores({ ...rubricScores, quality: Number(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1.0 (Poor)</span>
                    <span>3.0 (Average)</span>
                    <span>5.0 (Flawless)</span>
                  </div>
                </div>

                {/* 2. Timeliness */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-800">2. Timeliness & Velocity (25%)</span>
                    <span className="badge-pill badge-blue text-[11px] font-mono font-bold">
                      {rubricScores.timeliness.toFixed(1)} ★
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={rubricScores.timeliness}
                    onChange={(e) => setRubricScores({ ...rubricScores, timeliness: Number(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1.0 (Delayed)</span>
                    <span>3.0 (On-time)</span>
                    <span>5.0 (Ahead)</span>
                  </div>
                </div>

                {/* 3. Architecture */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-800">3. Architecture & Standards (25%)</span>
                    <span className="badge-pill badge-blue text-[11px] font-mono font-bold">
                      {rubricScores.architecture.toFixed(1)} ★
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={rubricScores.architecture}
                    onChange={(e) => setRubricScores({ ...rubricScores, architecture: Number(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1.0 (Non-standard)</span>
                    <span>3.0 (Compliant)</span>
                    <span>5.0 (Exemplary)</span>
                  </div>
                </div>

                {/* 4. Collaboration */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-800">4. Teamwork & Docs (20%)</span>
                    <span className="badge-pill badge-blue text-[11px] font-mono font-bold">
                      {rubricScores.collaboration.toFixed(1)} ★
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={rubricScores.collaboration}
                    onChange={(e) => setRubricScores({ ...rubricScores, collaboration: Number(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>1.0 (Minimal)</span>
                    <span>3.0 (Good)</span>
                    <span>5.0 (Exceptional)</span>
                  </div>
                </div>
              </div>

              {/* Appraisal Feedback Comments */}
              <div>
                <label className="form-label flex items-center justify-between">
                  <span>HR Technical Appraisal & Feedback Remarks</span>
                  <span className="text-[10px] text-slate-400">Appears in employee audit dossier</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.feedback}
                  onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                  className="form-textarea"
                  placeholder="Constructive feedback, code quality remarks, commendations..."
                />
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={activeModal === 'apply-leave'}
        onClose={() => setActiveModal(null)}
        title="Apply for Leave / Time-off"
        footer={
          <>
            <button onClick={() => setActiveModal(null)} className="btn-secondary text-xs py-2 px-4 cursor-pointer">
              Cancel
            </button>
            <button onClick={handleApplyLeaveSubmit} className="btn-primary text-xs py-2 px-5 cursor-pointer">
              Submit Leave Request
            </button>
          </>
        }
      >
        <form onSubmit={handleApplyLeaveSubmit} className="space-y-4">
          <div>
            <label className="form-label">Leave Category</label>
            <select
              value={leaveForm.category}
              onChange={(e) => setLeaveForm({ ...leaveForm, category: e.target.value })}
              className="form-select"
            >
              <option value="Casual">Casual Leave (Paid)</option>
              <option value="Sick">Sick Leave (Medical)</option>
              <option value="Earned">Earned / Annual Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">From Date</label>
              <input
                type="date"
                required
                value={leaveForm.fromDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">To Date</label>
              <input
                type="date"
                required
                value={leaveForm.toDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label className="form-label">Total Days</label>
            <input
              type="number"
              min="1"
              required
              value={leaveForm.days}
              onChange={(e) => setLeaveForm({ ...leaveForm, days: Number(e.target.value) })}
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Reason / Justification</label>
            <textarea
              rows={3}
              required
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              className="form-textarea"
              placeholder="State reason for absence..."
            />
          </div>
        </form>
      </Modal>

      {/* Upload Document Modal */}
      <Modal
        isOpen={activeModal === 'upload-doc'}
        onClose={() => setActiveModal(null)}
        title="Upload Document to Vault"
        footer={
          <>
            <button onClick={() => setActiveModal(null)} className="btn-secondary text-xs py-2 px-4 cursor-pointer">
              Cancel
            </button>
            <button onClick={handleUploadDocSubmit} className="btn-primary text-xs py-2 px-5 cursor-pointer">
              Upload Document
            </button>
          </>
        }
      >
        <form onSubmit={handleUploadDocSubmit} className="space-y-4">
          <div>
            <label className="form-label">Document Title</label>
            <input
              type="text"
              required
              value={docForm.title}
              onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
              className="form-input"
              placeholder="e.g. Master Services Agreement 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Category</label>
              <select
                value={docForm.category}
                onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                className="form-select"
              >
                <option value="Contracts">Contracts</option>
                <option value="Identity Documents">Identity Documents</option>
                <option value="Company Documents">Company Documents</option>
                <option value="Education Documents">Education Documents</option>
              </select>
            </div>
            <div>
              <label className="form-label">Access / Target Employee</label>
              <select
                value={docForm.employeeId}
                onChange={(e) => setDocForm({ ...docForm, employeeId: e.target.value })}
                className="form-select"
              >
                <option value="ALL">All Company</option>
                {store.employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Create Announcement Modal */}
      <Modal
        isOpen={activeModal === 'create-announcement'}
        onClose={() => setActiveModal(null)}
        title="Publish Enterprise Announcement"
        footer={
          <>
            <button onClick={() => setActiveModal(null)} className="btn-secondary text-xs py-2 px-4 cursor-pointer">
              Cancel
            </button>
            <button onClick={handleCreateAnnouncementSubmit} className="btn-primary text-xs py-2 px-5 cursor-pointer">
              Publish Notice
            </button>
          </>
        }
      >
        <form onSubmit={handleCreateAnnouncementSubmit} className="space-y-4">
          <div>
            <label className="form-label">Notice Title</label>
            <input
              type="text"
              required
              value={annForm.title}
              onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
              className="form-input"
              placeholder="e.g. Annual Company Offsite 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Priority</label>
              <select
                value={annForm.priority}
                onChange={(e) => setAnnForm({ ...annForm, priority: e.target.value })}
                className="form-select"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="form-label">Target Audience</label>
              <select
                value={annForm.audience}
                onChange={(e) => setAnnForm({ ...annForm, audience: e.target.value })}
                className="form-select"
              >
                <option value="All Employees">All Employees</option>
                <option value="Engineering Team">Engineering Team</option>
                <option value="Leadership">Leadership Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Announcement Content</label>
            <textarea
              rows={4}
              required
              value={annForm.description}
              onChange={(e) => setAnnForm({ ...annForm, description: e.target.value })}
              className="form-textarea"
              placeholder="Write the full message details..."
            />
          </div>
        </form>
      </Modal>

      {/* 360 Profile Dossier Modal */}
      <Modal
        isOpen={activeModal === 'view-profile'}
        onClose={() => setActiveModal(null)}
        title={`360° Profile Dossier: ${selectedItem?.name || ''}`}
        footer={
          <div className="flex items-center justify-between w-full gap-2">
            {isHR && selectedItem?.role !== 'HR_ADMIN' && selectedItem?.id !== 'HR-001' && (
              <button
                id="btn-delete-employee"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to offboard/delete ${selectedItem.name} (${selectedItem.id}) from the database?`)) {
                    store.deleteEmployee(selectedItem.id);
                    setActiveModal(null);
                  }
                }}
                className="py-2 px-3.5 flex items-center gap-1.5 cursor-pointer bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition shadow-2xs"
              >
                <Trash2 className="w-3.5 h-3.5" /> Offboard / Delete Employee
              </button>
            )}
            <button onClick={() => setActiveModal(null)} className="btn-primary text-xs py-2 px-4 cursor-pointer ml-auto">
              Close Dossier
            </button>
          </div>
        }
      >
        {activeModal === 'view-profile' && selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <img
                src={selectedItem.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={selectedItem.name || 'Employee'}
                className="w-16 h-16 rounded-2xl object-cover shadow-sm"
              />
              <div>
                <h4 className="text-lg font-extrabold text-slate-900">{selectedItem.name}</h4>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedItem.designation} • {selectedItem.department}
                </p>
                <span className="badge-pill badge-dark text-[10px] font-mono mt-1">
                  {selectedItem.id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Email</span>
                <p className="font-semibold text-slate-800">{selectedItem.email}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Working Format</span>
                <p className="font-semibold text-slate-800">{selectedItem.workingFormat || 'Hybrid'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Joined Date</span>
                <p className="font-semibold text-slate-800">{selectedItem.joiningDate || '2025-06-15'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Tenure</span>
                <p className="font-semibold text-slate-800">{selectedItem.daysInCompany || 418} Days</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100">
              <span className="text-[11px] font-bold text-blue-900 uppercase">Compensation Structure (INR)</span>
              <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px]">Monthly Base:</span>
                  <p className="font-mono font-bold text-slate-900">₹{(selectedItem.basicSalary || 65000).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">HRA (40%):</span>
                  <p className="font-mono font-bold text-slate-900">₹{(selectedItem.hra || 26000).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Allowances:</span>
                  <p className="font-mono font-bold text-slate-900">₹{(selectedItem.allowances || 10000).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* View Payslip Modal */}
      <Modal
        isOpen={activeModal === 'view-payslip'}
        onClose={() => setActiveModal(null)}
        title={`Payslip - ${selectedItem?.name || ''}`}
        footer={
          <button onClick={() => setActiveModal(null)} className="btn-primary text-xs py-2 px-4 cursor-pointer">
            Close Payslip
          </button>
        }
      >
        {activeModal === 'view-payslip' && selectedItem && (
          <div className="space-y-4 p-4 border border-slate-200 rounded-2xl bg-white">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-extrabold text-slate-900">AmaHR Technologies Inc.</h4>
                <p className="text-[11px] text-slate-400">Monthly Compensation Slip</p>
              </div>
              <span className="badge-pill badge-green text-xs font-bold">PAID</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-b border-slate-100">
              <p><strong>Employee:</strong> {selectedItem.name}</p>
              <p><strong>Employee ID:</strong> {selectedItem.employeeId || selectedItem.id}</p>
              <p><strong>Department:</strong> {selectedItem.department}</p>
              <p><strong>Designation:</strong> {selectedItem.designation}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <h5 className="font-bold text-slate-700 uppercase text-[10px] mb-1">Earnings</h5>
                <div className="space-y-1">
                  <div className="flex justify-between"><span>Basic Salary:</span><span className="font-mono">₹{(selectedItem.basicSalary || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>HRA:</span><span className="font-mono">₹{(selectedItem.hra || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Allowances:</span><span className="font-mono">₹{(selectedItem.allowances || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold border-t pt-1"><span>Gross:</span><span className="font-mono">₹{(selectedItem.grossSalary || 0).toLocaleString()}</span></div>
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-700 uppercase text-[10px] mb-1">Deductions</h5>
                <div className="space-y-1">
                  <div className="flex justify-between"><span>TDS / Income Tax:</span><span className="font-mono text-rose-600">-₹{(selectedItem.taxDeduction || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span>Provident Fund (PF):</span><span className="font-mono text-rose-600">-₹{(selectedItem.pfDeduction || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold border-t pt-1"><span>Total Deductions:</span><span className="font-mono text-rose-600">-₹{(selectedItem.totalDeductions || 0).toLocaleString()}</span></div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl flex justify-between items-center text-sm font-extrabold text-emerald-900">
              <span>Net Disbursement Payable:</span>
              <span className="text-lg font-mono">₹{(selectedItem.netSalary || 0).toLocaleString()}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Session Logout / Switch Persona Modal */}
      {store.isLoggedOut && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 animate-scale-up">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-500/30 mb-3">
                <Sparkles className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">AmaHR Enterprise</h2>
              <p className="text-xs text-slate-500 mt-1">
                You have signed out. Select an Employee ID persona or HR Administrator to resume work.
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Quick 1-Click Persona Sign-In:
              </span>

              {/* HR Admin Persona */}
              <button
                id="login-as-hr"
                onClick={() => store.switchUser('HR_ADMIN')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 transition cursor-pointer text-left group shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    👑 HR
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Trisha Kyrlova</h4>
                    <p className="text-[11px] text-slate-500">Lead HR & People Operations (Admin)</p>
                  </div>
                </div>
                <span className="badge-pill bg-blue-600 text-white text-[10px] font-bold py-1 px-3">
                  Sign In HR
                </span>
              </button>

              {/* Employee Personas */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1 pt-1">
                {store.employees.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => store.switchUser(emp.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="w-9 h-9 rounded-xl object-cover border border-slate-100" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900">{emp.name}</h4>
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1 rounded">
                            {emp.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{emp.designation}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                      Enter &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400 font-medium">
                AmaHR PERN Stack 2.0 · PostgreSQL & Express.js Connected
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
