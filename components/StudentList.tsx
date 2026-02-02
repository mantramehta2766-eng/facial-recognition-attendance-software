
import React, { useState, useRef } from 'react';
import { Student } from '../types';

interface StudentListProps {
  students: Student[];
  onAdd: (student: Student) => void;
  onDelete: (id: string) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onAdd, onDelete }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', rollNumber: '', department: '', photoUrl: '' });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setNewStudent(prev => ({ ...prev, photoUrl: reader.result as string }));
        setIsUploading(false);
      };

      reader.onerror = () => {
        console.error("Failed to read file");
        setIsUploading(false);
        alert("Error uploading image. Please try again.");
      };

      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNewStudent(prev => ({ ...prev, photoUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.rollNumber || !newStudent.photoUrl) {
      alert("Please provide name, roll number, and a photo.");
      return;
    }

    onAdd({
      id: Math.random().toString(36).substr(2, 9),
      ...newStudent
    });
    
    // Reset form
    setNewStudent({ name: '', rollNumber: '', department: '', photoUrl: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search students..." 
            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100"
        >
          <i className="fa-solid fa-plus"></i>
          Enroll Student
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {students.map((student) => (
          <div key={student.id} className="group bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-50">
              <img src={student.photoUrl} alt={student.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  onClick={() => onDelete(student.id)}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Remove Student"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-slate-800 text-lg truncate px-2">{student.name}</h3>
              <p className="text-xs font-black text-indigo-600 uppercase tracking-widest mt-1">{student.rollNumber}</p>
              <div className="mt-3 inline-block px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-full border border-slate-100">
                {student.department || 'General'}
              </div>
            </div>
          </div>
        ))}

        {students.length === 0 && (
          <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
            <i className="fa-solid fa-user-slash text-5xl mb-4"></i>
            <p className="font-bold">No students enrolled yet.</p>
            <p className="text-sm mt-1">Start by adding your first student profile.</p>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 my-auto">
            <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">New Student Enrollment</h2>
                <p className="text-indigo-100 text-xs mt-0.5">Fill in details for facial registration</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="hover:bg-indigo-500 p-2 rounded-full transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center gap-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-40 h-40 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${
                    newStudent.photoUrl 
                      ? 'border-indigo-400 bg-white' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-indigo-300'
                  }`}
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-2"></div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Reading...</span>
                    </div>
                  ) : newStudent.photoUrl ? (
                    <>
                      <img src={newStudent.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          type="button"
                          onClick={removePhoto}
                          className="bg-white/90 text-rose-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg hover:bg-white"
                        >
                          Change Photo
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-camera text-xl"></i>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center px-4">
                        Click to Upload Face Photo
                      </span>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
                {!newStudent.photoUrl && (
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tight">JPG, PNG allowed (Max 5MB)</p>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={newStudent.name}
                    onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                    placeholder="Enter student's full name" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Roll Number</label>
                    <input 
                      required
                      type="text" 
                      value={newStudent.rollNumber}
                      onChange={e => setNewStudent({...newStudent, rollNumber: e.target.value})}
                      placeholder="e.g. CS2401" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Department</label>
                    <input 
                      type="text" 
                      value={newStudent.department}
                      onChange={e => setNewStudent({...newStudent, department: e.target.value})}
                      placeholder="e.g. Science" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={!newStudent.photoUrl || !newStudent.name || !newStudent.rollNumber || isUploading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-user-plus"></i>
                  Enroll Student
                </button>
                <p className="text-center text-[10px] text-slate-400 mt-4 px-6">
                  By enrolling, you confirm that the student's photo will be used solely for identification purposes within the system.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
