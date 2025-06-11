
import React, { useState, FormEvent, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import FaceCaptureClient from '../components/FaceCaptureClient';
import { getStudentByIndexNumber } from '../services/studentService';
import { markAttendance } from '../services/attendanceService';
import { Student } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

enum AttendanceStep {
  EnterIndex,
  VerifyFace,
  Completed,
}

const MarkAttendancePage: React.FC = () => {
  const [indexNumber, setIndexNumber] = useState('');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [step, setStep] = useState<AttendanceStep>(AttendanceStep.EnterIndex);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    // Reset message when step changes or component mounts
    setMessage(null);
  }, [step]);

  const handleIndexSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!indexNumber.trim()) {
        setMessage({ type: 'error', text: 'Please enter an index number.' });
        return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      const student = await getStudentByIndexNumber(indexNumber.trim());
      if (student) {
        if (!student.faceData) {
            setMessage({ type: 'error', text: 'This student has no facial data registered. Cannot proceed.' });
            setIsLoading(false);
            return;
        }
        setCurrentStudent(student);
        setStep(AttendanceStep.VerifyFace);
        setMessage({ type: 'info', text: `Welcome, ${student.fullName}. Please verify your identity.` });
      } else {
        setMessage({ type: 'error', text: 'Student with this index number not found.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error fetching student data. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceVerification = async (capturedFaceData: string) => {
    // In a real app, capturedFaceData would be compared with currentStudent.faceData
    // For simulation, we'll assume it's a match.
    if (!currentStudent) {
        setMessage({ type: 'error', text: 'No student selected for verification.' });
        return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      // Simulate verification by comparing with stored face data (if it were real)
      // Here, we just proceed to mark attendance
      console.log("Simulated face verification successful for:", currentStudent.fullName);
      console.log("Captured data (simulated):", capturedFaceData ? capturedFaceData.substring(0,30) + '...' : 'No data');
      
      const attendanceRecord = await markAttendance(currentStudent.id);
      if (attendanceRecord) {
        setMessage({ type: 'success', text: `Attendance marked successfully for ${currentStudent.fullName} at ${attendanceRecord.time} on ${attendanceRecord.date}.` });
        setStep(AttendanceStep.Completed);
      } else {
         // This case might not be reached if markAttendance throws error for already marked.
        setMessage({ type: 'error', text: 'Failed to mark attendance. The student might already be marked.' });
      }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during attendance marking.';
        setMessage({ type: 'error', text: errorMessage });
        // Optionally, reset to index input or allow retry for face verification
        // setStep(AttendanceStep.EnterIndex); 
        // setCurrentStudent(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetProcess = () => {
    setIndexNumber('');
    setCurrentStudent(null);
    setStep(AttendanceStep.EnterIndex);
    setMessage(null);
  };
  
  const renderStepContent = () => {
    switch (step) {
      case AttendanceStep.EnterIndex:
        return (
          <form onSubmit={handleIndexSubmit} className="space-y-6">
            <Input
              id="indexNumber"
              label="Enter Your Index Number"
              type="text"
              value={indexNumber}
              onChange={(e) => setIndexNumber(e.target.value)}
              placeholder="e.g., CUSAS/001/24"
              required
              autoFocus
            />
            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              Proceed to Verification
            </Button>
          </form>
        );
      case AttendanceStep.VerifyFace:
        if (!currentStudent) return <p>Error: Student data missing.</p>;
        return (
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Verify Identity: {currentStudent.fullName}</h2>
            <p className="text-gray-600">Please look into the camera for facial verification.</p>
            {isLoading ? (
                <LoadingSpinner message="Verifying..."/>
            ) : (
                <FaceCaptureClient 
                    onCapture={handleFaceVerification} 
                    promptMessage="Position your face for verification." 
                    isVerification={true}
                />
            )}
            <Button variant="ghost" onClick={resetProcess} className="mt-4">Cancel / Enter Different Index</Button>
          </div>
        );
      case AttendanceStep.Completed:
        return (
          <div className="text-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-green-700">Attendance Complete!</h2>
            <Button onClick={resetProcess} variant="primary" size="lg">Mark Another Student</Button>
          </div>
        );
      default:
        return <p>An unexpected error occurred.</p>;
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-university-blue mb-6 border-b pb-3 text-center">Mark Attendance</h1>
      
      {message && (
        <div className={`p-3 mb-4 rounded-md text-sm text-center ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 
          message.type === 'error' ? 'bg-red-100 text-red-700' : 
          'bg-blue-100 text-blue-700'
        }`}>
          {message.text}
        </div>
      )}

      {renderStepContent()}
    </div>
  );
};

export default MarkAttendancePage;
