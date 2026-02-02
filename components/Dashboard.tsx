
import React from 'react';
import { Student, AttendanceRecord, AppView } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DashboardProps {
  students: Student[];
  records: AttendanceRecord[];
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ students, records, onNavigate }) => {
  const recentRecords = records.slice(0, 5);
  
  // Fake data for charts
  const attendanceData = [
    { name: 'Mon', attendance: 85 },
    { name: 'Tue', attendance: 88 },
    { name: 'Wed', attendance: 92 },
    { name: 'Thu', attendance: 78 },
    { name: 'Fri', attendance: 95 },
  ];

  const stats = [
    { label: 'Total Students', value: students.length, icon: 'fa-users', color: 'bg-blue-500' },
    { label: 'Present Today', value: records.filter(r => new Date(r.timestamp).toDateString() === new Date().toDateString()).length, icon: 'fa-calendar-check', color: 'bg-emerald-500' },
    { label: 'Attendance Rate', value: '94%', icon: 'fa-chart-line', color: 'bg-indigo-500' },
    { label: 'System Accuracy', value: '99.2%', icon: 'fa-shield-halved', color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                <i className={`fa-solid ${stat.icon} text-xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Weekly Attendance Trend</h3>
            <select className="text-sm bg-slate-50 border-none rounded-lg px-3 py-1 text-slate-600 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceData}>
                <defs>
                  <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4 flex-1">
            <button 
              onClick={() => onNavigate('RECOGNITION')}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-indigo-600 group"
            >
              <i className="fa-solid fa-camera text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
              <span className="text-xs font-bold uppercase tracking-wider">Start Scan</span>
            </button>
            <button 
              onClick={() => onNavigate('STUDENTS')}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-600 group"
            >
              <i className="fa-solid fa-user-plus text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
              <span className="text-xs font-bold uppercase tracking-wider">Add Student</span>
            </button>
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">Recent Marks</h3>
            <div className="space-y-4">
              {recentRecords.length > 0 ? recentRecords.map((record) => (
                <div key={record.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                    {record.studentName.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-slate-800 truncate">{record.studentName}</p>
                    <p className="text-xs text-slate-400">{new Date(record.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <div className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black">
                    PRESENT
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-400 italic">No recent activity.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
