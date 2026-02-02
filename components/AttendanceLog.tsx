
import React from 'react';
import { AttendanceRecord } from '../types';

interface AttendanceLogProps {
  records: AttendanceRecord[];
}

const AttendanceLog: React.FC<AttendanceLogProps> = ({ records }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-800">Attendance Log</h3>
        <button className="text-indigo-600 text-sm font-bold flex items-center gap-1 hover:text-indigo-700">
          <i className="fa-solid fa-file-export"></i>
          Export to CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Info</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold group-hover:scale-110 transition-transform">
                      {record.studentName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{record.studentName}</p>
                      <p className="text-xs text-slate-400">Regular Student</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {new Date(record.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">
                  {new Date(record.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs font-mono text-slate-300">
                  #{record.id.toUpperCase()}
                </td>
              </tr>
            ))}

            {records.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">
                  <div className="flex flex-col items-center">
                    <i className="fa-solid fa-box-open text-4xl mb-4 text-slate-200"></i>
                    No attendance records found yet.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 bg-slate-50/20">
        <p>Showing {records.length} entries</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-50">Prev</button>
          <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceLog;
