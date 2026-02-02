
export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  photoUrl: string; // Base64
  department: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  status: 'PRESENT' | 'LATE';
}

export interface RecognitionResult {
  studentId: string | null;
  confidence: number;
  reason: string;
}

export type AppView = 'DASHBOARD' | 'RECOGNITION' | 'STUDENTS' | 'LOGS';
