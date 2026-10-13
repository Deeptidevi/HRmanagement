import React from 'react';
import { useStore } from '../context/StoreContext';
import { Megaphone, Plus, Clock, Users } from 'lucide-react';

export default function AnnouncementsView({ onOpenCreateAnnouncement }) {
  const store = useStore();
  const isHR = store.currentUser.role === 'HR_ADMIN';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Company Announcements
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Official company notices, holiday schedules, and organizational updates
          </p>
        </div>

        {isHR && (
          <button
            onClick={onOpenCreateAnnouncement}
            className="btn-primary text-xs py-2 px-4 shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Publish Announcement
          </button>
        )}
      </div>

      {/* Announcements Feed */}
      <div className="space-y-4">
        {store.announcements.length === 0 ? (
          <div className="card-base p-12 text-center text-slate-400 text-xs">
            No active announcements.
          </div>
        ) : (
          store.announcements.map((ann) => (
            <div
              key={ann.id}
              className="card-base p-6 hover:border-blue-200 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`badge-pill text-[10px] ${
                      ann.priority === 'High'
                        ? 'badge-red'
                        : ann.priority === 'Medium'
                        ? 'badge-amber'
                        : 'badge-blue'
                    }`}
                  >
                    {ann.priority} Priority
                  </span>
                  <span className="badge-pill badge-dark text-[10px]">{ann.audience}</span>
                </div>
                <span className="text-xs font-semibold text-slate-400 font-mono">
                  Published: {ann.publishDate}
                </span>
              </div>

              <h3 className="text-lg font-extrabold text-slate-900">{ann.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{ann.description}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Author: <strong className="text-slate-700 font-bold">{ann.author}</strong>
                </span>
                <span>Expires: {ann.expiryDate || 'Open-ended'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
