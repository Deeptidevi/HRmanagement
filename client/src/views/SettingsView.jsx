import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Settings, Save, Building, CalendarOff, Calculator, Clock } from 'lucide-react';

export default function SettingsView() {
  const store = useStore();
  const [form, setForm] = useState(store.settings);

  const handleSave = () => {
    store.updateSettings(form);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Organization Settings & Policies
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Configure evaluation parameters, work shifts, and annual leave quotas
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-primary text-xs py-2 px-4 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Settings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Organization & Schedule */}
        <div className="card-base p-6 space-y-4">
          <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" /> Organization Schedule
          </h4>

          <div>
            <label className="form-label">Company Name</label>
            <input
              type="text"
              value={form.organizationName}
              onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Work Shift Start</label>
              <input
                type="time"
                value={form.workStartTime}
                onChange={(e) => setForm({ ...form, workStartTime: e.target.value })}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Work Shift End</label>
              <input
                type="time"
                value={form.workEndTime}
                onChange={(e) => setForm({ ...form, workEndTime: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">Late Threshold (Mins)</label>
              <input
                type="number"
                value={form.lateThresholdMinutes}
                onChange={(e) =>
                  setForm({ ...form, lateThresholdMinutes: Number(e.target.value) })
                }
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Monthly Working Days</label>
              <input
                type="number"
                value={form.monthlyWorkingDays}
                onChange={(e) =>
                  setForm({ ...form, monthlyWorkingDays: Number(e.target.value) })
                }
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Evaluation Weights */}
        <div className="card-base p-6 space-y-4">
          <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-600" /> Algorithmic Evaluation Weights (%)
          </h4>

          <div>
            <label className="form-label">Task Deliverables Weight (%)</label>
            <input
              type="number"
              value={form.weights.tasks}
              onChange={(e) =>
                setForm({
                  ...form,
                  weights: { ...form.weights, tasks: Number(e.target.value) },
                })
              }
              className="form-input"
            />
          </div>

          <div>
            <label className="form-label">Attendance Weight (%)</label>
            <input
              type="number"
              value={form.weights.attendance}
              onChange={(e) =>
                setForm({
                  ...form,
                  weights: { ...form.weights, attendance: Number(e.target.value) },
                })
              }
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="form-label">On-Time Weight (%)</label>
              <input
                type="number"
                value={form.weights.onTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    weights: { ...form.weights, onTime: Number(e.target.value) },
                  })
                }
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">HR Feedback Weight (%)</label>
              <input
                type="number"
                value={form.weights.feedback}
                onChange={(e) =>
                  setForm({
                    ...form,
                    weights: { ...form.weights, feedback: Number(e.target.value) },
                  })
                }
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
