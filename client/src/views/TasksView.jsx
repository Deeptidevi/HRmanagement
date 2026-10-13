import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  Star,
  CheckCircle,
  FileCheck,
  RotateCcw
} from 'lucide-react';

export default function TasksView({ onOpenCreateTask, onOpenSubmitTask, onOpenReviewTask }) {
  const store = useStore();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const isHR = store.currentUser.role === 'HR_ADMIN';

  let tasks = isHR
    ? store.tasks
    : store.tasks.filter((t) => t.assignedTo === (store.currentUser.employeeId || store.currentUser.id));

  if (statusFilter !== 'ALL') {
    tasks = tasks.filter((t) => t.status === statusFilter);
  }

  if (priorityFilter !== 'ALL') {
    tasks = tasks.filter((t) => t.priority === priorityFilter);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isHR ? 'Company Tasks & Deliverables' : 'My Assigned Deliverables'}
          </h2>
          <p className="text-xs font-medium text-slate-500">
            {isHR
              ? 'Delegate milestones, review code/design deliverables, and score 4-dimension rubrics'
              : 'Track deadlines, upload deliverable files, and receive HR evaluations'}
          </p>
        </div>

        {isHR && (
          <button
            onClick={onOpenCreateTask}
            className="btn-primary text-xs py-2 px-4 shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create New Task
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="card-base p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Submitted', 'In Progress', 'Approved', 'Rework Required'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`badge-pill cursor-pointer transition ${
                statusFilter === st
                  ? 'badge-blue'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? `All (${store.tasks.length})` : st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="form-select text-xs py-1.5 px-3 rounded-full bg-slate-50"
          >
            <option value="ALL">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="card-base p-12 text-center text-slate-400 text-xs">
            No tasks found matching the criteria.
          </div>
        ) : (
          tasks.map((task) => {
            const assignee = store.employees.find((e) => e.id === task.assignedTo);

            return (
              <div
                key={task.id}
                className="card-base p-6 hover:border-blue-200 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="badge-pill badge-dark text-[10px] font-mono">{task.id}</span>
                    <span
                      className={`badge-pill text-[10px] ${
                        task.priority === 'Urgent'
                          ? 'badge-red'
                          : task.priority === 'High'
                          ? 'badge-amber'
                          : 'badge-blue'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                    <span className="badge-pill bg-slate-100 text-slate-600 text-[10px]">
                      {task.department}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Due: {task.deadline}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">{task.title}</h3>
                  <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
                    {task.description}
                  </p>

                  {/* Submission or Review Feedback Preview */}
                  {task.submission && (
                    <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/60 text-xs max-w-2xl mt-2">
                      <p className="font-bold text-blue-900 flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-blue-600" /> Deliverable Submitted:
                      </p>
                      <p className="text-blue-800 text-[11px] mt-0.5">
                        File: <strong className="font-mono">{task.submission.fileName}</strong> • Notes: "{task.submission.notes}"
                      </p>
                    </div>
                  )}

                  {task.rating && (
                    <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/60 text-xs max-w-2xl mt-2 flex items-center gap-3">
                      <span className="badge-pill badge-green text-xs font-extrabold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-emerald-600" /> {task.rating} / 5.0
                      </span>
                      <p className="text-emerald-800 text-[11px] italic">
                        "{task.feedback}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Action / Assignee */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between gap-4 flex-shrink-0">
                  {assignee && (
                    <div className="flex items-center gap-2.5">
                      <img
                        src={assignee.avatar}
                        alt={assignee.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div className="text-left md:text-right">
                        <p className="text-xs font-bold text-slate-800">{assignee.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{assignee.designation}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span
                      className={`badge-pill text-xs ${
                        task.status === 'Approved'
                          ? 'badge-green'
                          : task.status === 'Submitted'
                          ? 'badge-blue'
                          : 'badge-amber'
                      }`}
                    >
                      {task.status}
                    </span>

                    {/* Actions */}
                    {isHR && task.status === 'Submitted' && (
                      <button
                        onClick={() => onOpenReviewTask(task)}
                        className="btn-primary text-xs py-1.5 px-3.5 cursor-pointer"
                      >
                        Evaluate
                      </button>
                    )}

                    {!isHR && task.status !== 'Approved' && task.status !== 'Submitted' && (
                      <button
                        onClick={() => onOpenSubmitTask(task)}
                        className="btn-primary text-xs py-1.5 px-3.5 cursor-pointer"
                      >
                        Submit Work
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
