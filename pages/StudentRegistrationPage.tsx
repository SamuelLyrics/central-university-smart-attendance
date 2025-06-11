
import React, { useState, FormEvent } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import FaceCaptureClient from '../components/FaceCaptureClient';
import { addStudent } from '../services/studentService';
import { Student } from '../types'; // Ensure Student type is imported

const StudentRegistrationPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [indexNumber, setIndexNumber] = useState('');
  const [faceData, setFaceData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFaceCapture = (data: string) => {
    setFaceData(data);
    setMessage({ type: 'success', text: 'Face data captured successfully.' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !indexNumber) {
      setMessage({ type: 'error', text: 'Full name and index number are required.' });
      return;
    }
    if (!faceData) {
      setMessage({ type: 'error', text: 'Face capture is required for registration.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    try {
      const studentData: Omit<Student, 'id' | 'registrationDate'> = { fullName, indexNumber, faceData };
      await addStudent(studentData);
      setMessage({ type: 'success', text: `Student ${fullName} registered successfully!` });
      setFullName('');
      setIndexNumber('');
      setFaceData(null); 
      // Optionally clear the captured image display if you have one
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setMessage({ type: 'error', text: `Registration failed: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-university-blue mb-6 border-b pb-3">Student Registration</h1>
      
      {message && (
        <div className={`p-4 mb-4 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="fullName"
          label="Full Name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g., John Doe"
          required
        />
        <Input
          id="indexNumber"
          label="Index Number"
          type="text"
          value={indexNumber}
          onChange={(e) => setIndexNumber(e.target.value)}
          placeholder="e.g., CUSAS/001/24"
          required
        />
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Facial Recognition Data</label>
          <FaceCaptureClient onCapture={handleFaceCapture} promptMessage="Capture student's face for registration." />
          {faceData && (
            <div className="mt-2 p-2 border border-green-300 bg-green-50 rounded-md">
              <p className="text-xs text-green-700">
                Face data captured. Preview:
              </p>
              {faceData.startsWith('data:image') ? (
                <img src={faceData} alt="Captured face" className="mt-1 w-24 h-24 object-cover rounded"/>
              ) : (
                <p className="text-xs text-green-600">Placeholder data stored.</p>
              )}
            </div>
          )}
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
          Register Student
        </Button>
      </form>
    </div>
  );
};

export default StudentRegistrationPage;
