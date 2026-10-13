import React from 'react';
import { useStore } from '../context/StoreContext';
import { getLeaderboardRankings, calculateEmployeePerformance } from '../utils/calculations';
import {
  TrendingUp,
  Award,
  Calculator,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function PerformanceView() {
  const store = useStore();
  const leaderboard = getLeaderboardRankings(store.rawState);
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const weights = store.settings.weights;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Performance & Leaderboard
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Algorithmic evaluation index factoring deliverables, punctuality, and feedback
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-pill badge-blue text-xs py-1.5 px-3">
            <Calculator className="w-3.5 h-3.5" /> Weighted 0-100 Index
          </span>
        </div>
      </div>

      {/* Formula Weights Banner */}
      <div className="card-base p-4 bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Evaluation Weights:
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="badge-pill bg-blue-100 text-blue-700">
            Task Deliverables: {weights.tasks}%
          </span>
          <span className="badge-pill bg-emerald-100 text-emerald-700">
            Attendance: {weights.attendance}%
          </span>
          <span className="badge-pill bg-purple-100 text-purple-700">
            On-Time Delivery: {weights.onTime}%
          </span>
          <span className="badge-pill bg-amber-100 text-amber-700">
            HR Review: {weights.feedback}%
          </span>
        </div>
      </div>

      {/* Top 3 Podium Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end pt-4">
        {/* Rank 2: Silver */}
        {top2 && (
          <div className="card-base p-6 text-center border-t-4 border-slate-400 order-2 md:order-1 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center justify-center border-2 border-white shadow-sm">
              2
            </div>
            <img
              src={top2.avatar}
              alt={top2.name}
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-slate-200 shadow-md mb-3 mt-2"
            />
            <h4 className="text-base font-extrabold text-slate-900">{top2.name}</h4>
            <p className="text-xs text-slate-400 mb-3">{top2.designation}</p>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-3xl font-extrabold text-slate-800">{top2.score}%</span>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                Performance Index
              </p>
            </div>
          </div>
        )}

        {/* Rank 1: Gold (Center & Elevated) */}
        {top1 && (
          <div className="card-base p-6 text-center border-t-4 border-amber-400 order-1 md:order-2 relative transform md:-translate-y-4 shadow-xl bg-gradient-to-b from-amber-50/40 to-white">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-400 text-amber-950 font-extrabold text-base flex items-center justify-center border-2 border-white shadow-md">
              1
            </div>
            <img
              src={top1.avatar}
              alt={top1.name}
              className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-amber-300 shadow-xl mb-3 mt-2"
            />
            <h4 className="text-lg font-extrabold text-slate-900">{top1.name}</h4>
            <p className="text-xs text-amber-700 font-bold mb-3">{top1.designation}</p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/50">
              <span className="text-4xl font-extrabold text-amber-900">{top1.score}%</span>
              <p className="text-[10px] font-bold text-amber-700 uppercase mt-0.5">
                Top Performer of the Month
              </p>
            </div>
          </div>
        )}

        {/* Rank 3: Bronze */}
        {top3 && (
          <div className="card-base p-6 text-center border-t-4 border-amber-700 order-3 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-100 text-amber-900 font-extrabold text-sm flex items-center justify-center border-2 border-white shadow-sm">
              3
            </div>
            <img
              src={top3.avatar}
              alt={top3.name}
              className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-amber-700/30 shadow-md mb-3 mt-2"
            />
            <h4 className="text-base font-extrabold text-slate-900">{top3.name}</h4>
            <p className="text-xs text-slate-400 mb-3">{top3.designation}</p>
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-3xl font-extrabold text-slate-800">{top3.score}%</span>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">
                Performance Index
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="card-base overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-bold text-slate-800">Company-wide Rankings</h4>
          <span className="text-xs font-semibold text-slate-400">Total ranked: {leaderboard.length}</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Evaluation Score</th>
                <th>Classification</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item) => (
                <tr key={item.id}>
                  <td>
                    <span className="font-extrabold text-xs text-slate-700 font-mono">
                      #{item.rank}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="font-extrabold text-slate-900 text-xs">{item.name}</p>
                        <p className="text-[10px] text-slate-400">{item.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="text-xs text-slate-600">{item.department}</span></td>
                  <td>
                    <span className="font-extrabold text-sm text-slate-900">{item.score}%</span>
                  </td>
                  <td>
                    <span
                      className={`badge-pill text-[10px] ${
                        item.badgeColor === 'amber'
                          ? 'badge-amber'
                          : item.badgeColor === 'green'
                          ? 'badge-green'
                          : 'badge-blue'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
