
import React, { useState, useEffect } from 'react';
import { AppView, Student, AttendanceRecord } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CameraView from './components/CameraView';
import StudentList from './components/StudentList';
import AttendanceLog from './components/AttendanceLog';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('DASHBOARD');
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  // Load initial data
  useEffect(() => {
    const savedStudents = localStorage.getItem('attendance_students');
    const savedRecords = localStorage.getItem('attendance_records');
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedRecords) setRecords(JSON.parse(savedRecords));
  }, []);

  // Sync data to localStorage
  useEffect(() => {
    localStorage.setItem('attendance_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('attendance_records', JSON.stringify(records));
  }, [records]);

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const logAttendance = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      studentId,
      studentName: student.name,
      timestamp: new Date().toISOString(),
      status: 'PRESENT'
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-20 lg:pt-8 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              {activeView === 'DASHBOARD' && 'Campus Dashboard'}
              {activeView === 'RECOGNITION' && 'Facial Attendance'}
              {activeView === 'STUDENTS' && 'Student Directory'}
              {activeView === 'LOGS' && 'Attendance History'}
            </h1>
            <p className="text-slate-500 mt-1">
              {activeView === 'DASHBOARD' && 'Real-time overview of college attendance metrics.'}
              {activeView === 'RECOGNITION' && 'Align face within frame for automated scanning.'}
              {activeView === 'STUDENTS' && 'Manage student profiles and enrollment data.'}
              {activeView === 'LOGS' && 'Review detailed logs of daily attendance activities.'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white shadow-sm border border-slate-200 px-4 py-2 rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">System Online</span>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {activeView === 'DASHBOARD' && (
            <Dashboard 
              students={students} 
              records={records} 
              onNavigate={(v) => setActiveView(v)} 
            />
          )}
          {activeView === 'RECOGNITION' && (
            <CameraView 
              students={students} 
              onAttendanceMarked={logAttendance} 
            />
          )}
          {activeView === 'STUDENTS' && (
            <StudentList 
              students={students} 
              onAdd={addStudent} 
              onDelete={deleteStudent} 
            />
          )}
          {activeView === 'LOGS' && (
            <AttendanceLog 
              records={records} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
