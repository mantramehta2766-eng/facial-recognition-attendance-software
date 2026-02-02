
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { identifyStudent } from '../services/geminiService';
import { Student } from '../types';

interface CameraViewProps {
  students: Student[];
  onAttendanceMarked: (studentId: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ students, onAttendanceMarked }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<{ name: string; status: 'success' | 'fail' | 'idle', message: string }>({
    name: '',
    status: 'idle',
    message: ''
  });

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setLastResult({ name: '', status: 'fail', message: 'Could not access camera.' });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = async () => {
    if (isProcessing || !videoRef.current || !canvasRef.current || students.length === 0) return;

    setIsProcessing(true);
    setLastResult({ name: '', status: 'idle', message: 'Analyzing face...' });

    const context = canvasRef.current.getContext('2d');
    if (context) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const base64Image = canvasRef.current.toDataURL('image/jpeg', 0.8);
      
      const result = await identifyStudent(base64Image, students);
      
      if (result.studentId) {
        const student = students.find(s => s.id === result.studentId);
        if (student) {
          setLastResult({ 
            name: student.name, 
            status: 'success', 
            message: `Identified: ${student.name} (${Math.round(result.confidence * 100)}%)` 
          });
          onAttendanceMarked(student.id);
        } else {
          setLastResult({ name: '', status: 'fail', message: 'Match found but data error.' });
        }
      } else {
        setLastResult({ name: 'Unknown', status: 'fail', message: result.reason || 'No match found.' });
      }
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <div className="relative aspect-video bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Graphics */}
          <div className="absolute inset-0 border-[60px] border-slate-900/30 pointer-events-none"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-indigo-400 rounded-[40px] shadow-[0_0_50px_rgba(99,102,241,0.5)] pointer-events-none flex items-center justify-center">
             <div className="w-4 h-4 border-t-2 border-l-2 border-white absolute top-0 left-0 rounded-tl-xl"></div>
             <div className="w-4 h-4 border-t-2 border-r-2 border-white absolute top-0 right-0 rounded-tr-xl"></div>
             <div className="w-4 h-4 border-b-2 border-l-2 border-white absolute bottom-0 left-0 rounded-bl-xl"></div>
             <div className="w-4 h-4 border-b-2 border-r-2 border-white absolute bottom-0 right-0 rounded-br-xl"></div>
             
             {isProcessing && (
               <div className="absolute inset-0 bg-indigo-500/20 backdrop-blur-[1px] rounded-[40px] animate-pulse flex items-center justify-center">
                 <div className="text-white text-xs font-black tracking-widest uppercase">Scanning...</div>
               </div>
             )}
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
            <div className="px-4 py-2 bg-slate-900/80 backdrop-blur text-white rounded-xl text-sm font-medium flex items-center gap-2">
              <i className="fa-solid fa-expand text-indigo-400"></i>
              Face Detection Active
            </div>
            <button 
              onClick={handleCapture}
              disabled={isProcessing || students.length === 0}
              className={`w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-transform active:scale-90 ${
                isProcessing || students.length === 0 ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              <i className="fa-solid fa-camera text-white text-2xl"></i>
            </button>
            <div className="w-32"></div> {/* Spacer */}
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <i className="fa-solid fa-fingerprint text-indigo-600"></i>
            Recognition Output
          </h3>

          <div className="flex-1 space-y-6">
            {lastResult.status === 'idle' && !isProcessing && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <i className="fa-solid fa-face-smile text-4xl"></i>
                </div>
                <p className="text-slate-500 text-sm">Waiting for capture...</p>
                {students.length === 0 && (
                  <p className="mt-2 text-amber-600 text-xs font-bold">Please add students first!</p>
                )}
              </div>
            )}

            {isProcessing && (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="font-bold text-indigo-600">Processing Face...</p>
                <p className="text-slate-400 text-xs mt-2">Checking encrypted directory</p>
              </div>
            )}

            {lastResult.status !== 'idle' && !isProcessing && (
              <div className={`p-6 rounded-2xl border-2 transition-all ${
                lastResult.status === 'success' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
                    lastResult.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}>
                    <i className={`fa-solid ${lastResult.status === 'success' ? 'fa-check' : 'fa-xmark'} text-xl`}></i>
                  </div>
                  <div>
                    <h4 className={`font-black text-lg ${lastResult.status === 'success' ? 'text-emerald-900' : 'text-rose-900'}`}>
                      {lastResult.status === 'success' ? 'Verification Successful' : 'Recognition Failed'}
                    </h4>
                    <p className="text-xs text-slate-500">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
                
                <p className="text-slate-700 font-medium mb-1">Result Details:</p>
                <div className="bg-white/50 p-3 rounded-lg border border-slate-200/50">
                  <p className="text-sm text-slate-600 italic">"{lastResult.message}"</p>
                </div>

                {lastResult.status === 'success' && (
                  <button 
                    onClick={() => setLastResult({ name: '', status: 'idle', message: '' })}
                    className="w-full mt-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-colors"
                  >
                    Mark Next
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-3">Live Feed Status</p>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${stream ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-xs font-bold text-slate-600">{stream ? 'Camera Active' : 'Camera Disconnected'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraView;
