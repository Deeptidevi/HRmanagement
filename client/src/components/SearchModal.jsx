import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, Users, CheckSquare, CalendarOff, FolderLock } from 'lucide-react';

export default function SearchModal({ isOpen, onClose, onNavigate }) {
  const { employees, tasks, leaves, documents } = useStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // trigger toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredEmployees = q ? employees.filter(e =>
    e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q) || e.designation.toLowerCase().includes(q)
  ) : [];

  const filteredTasks = q ? tasks.filter(t =>
    t.title.toLowerCase().includes(q) || t.department.toLowerCase().includes(q)
  ) : [];

  const filteredDocs = q ? documents.filter(d =>
    d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)
  ) : [];

  const hasResults = filteredEmployees.length > 0 || filteredTasks.length > 0 || filteredDocs.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden">
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search employees, tasks, documents (Type to search)..."
            className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-sm"
          />
          <kbd
            onClick={onClose}
            className="px-2 py-1 text-xs bg-slate-100 text-slate-500 rounded border border-slate-200 cursor-pointer"
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-3 divide-y divide-slate-50">
          {!q ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Type at least 2 characters to search across employees, deliverables, and documents.
            </div>
          ) : !hasResults ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => { onNavigate('employees'); onClose(); }}
                  className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img src={emp.avatar} alt={emp.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{emp.name}</h5>
                      <p className="text-[11px] text-slate-400">{emp.designation} • {emp.department}</p>
                    </div>
                  </div>
                  <span className="badge-pill badge-blue text-[10px]">Employee</span>
                </div>
              ))}

              {filteredTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => { onNavigate('tasks'); onClose(); }}
                  className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CheckSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{t.title}</h5>
                      <p className="text-[11px] text-slate-400">{t.department} • Status: {t.status}</p>
                    </div>
                  </div>
                  <span className="badge-pill badge-dark text-[10px]">{t.priority}</span>
                </div>
              ))}

              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => { onNavigate('documents'); onClose(); }}
                  className="p-2.5 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                      <FolderLock className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{doc.title}</h5>
                      <p className="text-[11px] text-slate-400">{doc.category} • {doc.size}</p>
                    </div>
                  </div>
                  <span className="badge-pill badge-green text-[10px]">Document</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
