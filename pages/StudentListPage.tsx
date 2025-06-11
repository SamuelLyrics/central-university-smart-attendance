
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllStudents, deleteStudent } from '../services/studentService';
import { getAllAttendanceRecords, getAttendanceByStudentId } from '../services/attendanceService';
import { Student, AttendanceRecord } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { exportStudentsToCSV, exportAttendanceToCSV } from '../services/exportService';
import SearchIcon from '../components/icons/SearchIcon';
import ExportIcon from '../components/icons/ExportIcon';

const StudentRow: React.FC<{
  student: Student;
  attendanceCount: number;
  onViewDetails: (student: Student) => void;
  onDelete: (studentId: string, studentName: string) => void;
}> = ({ student, attendanceCount, onViewDetails, onDelete }) => (
  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
    <td className="px-4 py-3 text-sm text-gray-700">{student.fullName}</td>
    <td className="px-4 py-3 text-sm text-gray-600">{student.indexNumber}</td>
    <td className="px-4 py-3 text-sm text-gray-600">{new Date(student.registrationDate).toLocaleDateString()}</td>
    <td className="px-4 py-3 text-sm text-center text-gray-600">{attendanceCount}</td>
    <td className="px-4 py-3 text-sm text-gray-600">
      {student.faceData ? (
          <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Registered</span>
      ) : (
          <span className="px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-full">Not Set</span>
      )}
    </td>
    <td className="px-4 py-3 text-sm space-x-2">
      <Button size="sm" variant="ghost" onClick={() => onViewDetails(student)}>Details</Button>
      <Button size="sm" variant="danger" onClick={() => onDelete(student.id, student.fullName)}>Delete</Button>
    </td>
  </tr>
);

const StudentListPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [allAttendance, setAllAttendance] = useState<AttendanceRecord[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentAttendance, setStudentAttendance] = useState<AttendanceRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<{id: string, name: string} | null>(null);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [studentsData, attendanceData] = await Promise.all([
        getAllStudents(),
        getAllAttendanceRecords()
      ]);
      setStudents(studentsData);
      setAllAttendance(attendanceData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Handle error display to user
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.fullName.toLowerCase().includes(lowerSearchTerm) ||
        student.indexNumber.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const studentAttendanceCounts = useMemo(() => {
    const counts = new Map<string, number>();
    allAttendance.forEach(record => {
      counts.set(record.studentId, (counts.get(record.studentId) || 0) + 1);
    });
    return counts;
  }, [allAttendance]);

  const handleViewDetails = async (student: Student) => {
    setSelectedStudent(student);
    setIsLoading(true); // For modal content loading
    try {
      const attendance = await getAttendanceByStudentId(student.id);
      setStudentAttendance(attendance.sort((a,b) => b.timestamp - a.timestamp)); // Sort by most recent
    } catch (error) {
      console.error("Failed to fetch student attendance:", error);
      setStudentAttendance([]);
    } finally {
      setIsLoading(false);
      setIsModalOpen(true);
    }
  };
  
  const handleDeleteAttempt = (studentId: string, studentName: string) => {
    setStudentToDelete({id: studentId, name: studentName});
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    setIsLoading(true);
    try {
      await deleteStudent(studentToDelete.id);
      // Also delete related attendance records or handle as per policy (here, they remain for historical data)
      // For this example, we just refetch students.
      fetchAllData(); 
      setStudentToDelete(null); // Close confirmation modal
    } catch (error) {
      console.error("Failed to delete student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && students.length === 0) { // Initial full page load
    return <LoadingSpinner message="Loading student data..." />;
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-university-blue mb-6 border-b pb-3">Student List</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
            <Input
              type="text"
              placeholder="Search by name or index..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              IconComponent={SearchIcon}
            />
        </div>
        <Button 
          onClick={() => exportStudentsToCSV(filteredStudents)} 
          variant="secondary"
          leftIcon={<ExportIcon className="w-5 h-5"/>}
          disabled={filteredStudents.length === 0}
        >
          Export List (CSV)
        </Button>
      </div>

      {isLoading && students.length > 0 && <LoadingSpinner message="Updating data..." /> }

      {!isLoading && filteredStudents.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          {students.length === 0 ? "No students registered yet." : "No students match your search criteria."}
        </p>
      )}

      {filteredStudents.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Days</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Face Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <StudentRow 
                  key={student.id} 
                  student={student} 
                  attendanceCount={studentAttendanceCounts.get(student.id) || 0}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDeleteAttempt}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedStudent && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Attendance Details: ${selectedStudent.fullName}`} size="lg">
          {isLoading ? <LoadingSpinner message="Loading attendance..."/> : (
            <>
              <div className="mb-4">
                <p><strong>Index Number:</strong> {selectedStudent.indexNumber}</p>
                <p><strong>Registered On:</strong> {new Date(selectedStudent.registrationDate).toLocaleString()}</p>
                 <p><strong>Total Attendance Days:</strong> {studentAttendance.length}</p>
              </div>
              {studentAttendance.length > 0 ? (
                <>
                <Button 
                  onClick={() => exportAttendanceToCSV(studentAttendance, `${selectedStudent.indexNumber}_attendance.csv`)}
                  variant="secondary"
                  size="sm"
                  leftIcon={<ExportIcon className="w-4 h-4"/>}
                  className="mb-3"
                >
                  Export Student Attendance (CSV)
                </Button>
                <div className="max-h-96 overflow-y-auto border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0">
                          <tr>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                      {studentAttendance.map(record => (
                          <tr key={record.id}>
                          <td className="px-3 py-2 text-sm text-gray-600">{record.date}</td>
                          <td className="px-3 py-2 text-sm text-gray-600">{record.time}</td>
                          </tr>
                      ))}
                      </tbody>
                  </table>
                </div>
                </>
              ) : (
                <p className="text-gray-500">No attendance records found for this student.</p>
              )}
            </>
          )}
          <div className="mt-6 flex justify-end">
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </div>
        </Modal>
      )}

      {studentToDelete && (
        <Modal 
            isOpen={!!studentToDelete} 
            onClose={() => setStudentToDelete(null)} 
            title="Confirm Deletion"
            size="sm"
        >
            <p className="text-gray-700">Are you sure you want to delete student: <span className="font-semibold">{studentToDelete.name}</span>? This action cannot be undone.</p>
            <p className="text-xs text-gray-500 mt-1">Associated attendance records will remain for historical purposes but will no longer be linked if student data is removed.</p>
            <div className="mt-6 flex justify-end space-x-3">
                <Button variant="ghost" onClick={() => setStudentToDelete(null)} disabled={isLoading}>Cancel</Button>
                <Button variant="danger" onClick={confirmDeleteStudent} isLoading={isLoading}>Delete Student</Button>
            </div>
        </Modal>
      )}

    </div>
  );
};

export default StudentListPage;
