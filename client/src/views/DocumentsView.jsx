import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  FolderLock,
  UploadCloud,
  FileText,
  Download,
  FolderOpen,
  CheckCircle2
} from 'lucide-react';

export default function DocumentsView({ onOpenUploadDoc }) {
  const store = useStore();
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const isHR = store.currentUser.role === 'HR_ADMIN';

  let docs = store.documents;
  if (!isHR) {
    docs = docs.filter(
      (d) =>
        d.employeeId === (store.currentUser.employeeId || store.currentUser.id) ||
        d.employeeId === 'ALL'
    );
  }

  if (categoryFilter !== 'ALL') {
    docs = docs.filter((d) => d.category === categoryFilter);
  }

  const categories = [
    'ALL',
    'Contracts',
    'Identity Documents',
    'Company Documents',
    'Education Documents'
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Documents & Compliance Vault
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Encrypted file storage for contracts, identity credentials, and policies
          </p>
        </div>

        <button
          onClick={onOpenUploadDoc}
          className="btn-primary text-xs py-2 px-4 shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Categories Toolbar */}
      <div className="card-base p-4 flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`badge-pill cursor-pointer transition ${
              categoryFilter === c
                ? 'badge-blue'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {c === 'ALL' ? 'All Files' : c}
          </button>
        ))}
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {docs.length === 0 ? (
          <div className="col-span-full card-base p-12 text-center text-slate-400 text-xs">
            <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            No documents found in this category.
          </div>
        ) : (
          docs.map((doc) => (
            <div
              key={doc.id}
              className="card-base p-5 flex flex-col justify-between hover:border-blue-300 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="badge-pill badge-blue text-[10px]">{doc.category}</span>
                  <span className="badge-pill badge-green text-[10px]">{doc.status}</span>
                </div>

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Uploaded on {doc.uploadedAt} • {doc.size || '1.8 MB'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Target: {doc.employeeId}</span>
                <button
                  onClick={() => store.showToast('Download Started', `Downloading ${doc.title}...`, 'info')}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
