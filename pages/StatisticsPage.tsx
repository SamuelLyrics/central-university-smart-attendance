
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getAllStudents } from '../services/studentService';
import { getAllAttendanceRecords } from '../services/attendanceService';
import { Student, AttendanceRecord, ChartData } from '../types';
import BarChartComponent from '../components/BarChartComponent';
import LoadingSpinner from '../components/LoadingSpinner';
import { ATTENDANCE_THRESHOLD_PERCENTAGE } from '../constants';
import { exportAttendanceToCSV } from '../services/exportService';
import Button from '../components/Button';
import ExportIcon from '../components/icons/ExportIcon';

interface DailyAttendance {
  date: string;
  count: number;
}

interface StudentAttendanceSummary extends Student {
  attendanceDays: number;
  attendancePercentage: number; // Assuming a fixed number of total possible days for simplicity
}

const TOTAL_POSSIBLE_DAYS = 30; // Example: total school days in a period for percentage calculation

const StatisticsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'daily' | 'student' | 'flagged'>('daily');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [studentsData, recordsData] = await Promise.all([
        getAllStudents(),
        getAllAttendanceRecords()
      ]);
      setStudents(studentsData);
      setAttendanceRecords(recordsData.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())); // Sort by date
    } catch (error) {
      console.error("Error fetching statistics data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dailyAttendanceData: ChartData[] = useMemo(() => {
    const dailyCounts: { [date: string]: number } = {};
    attendanceRecords.forEach(record => {
      dailyCounts[record.date] = (dailyCounts[record.date] || 0) + 1;
    });
    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ name: date, value: count }))
      .sort((a,b) => new Date(a.name).getTime() - new Date(b.name).getTime()) // Ensure sorted by date
      .slice(-30); // Show last 30 days for clarity
  }, [attendanceRecords]);

  const studentAttendanceSummary: StudentAttendanceSummary[] = useMemo(() => {
    return students.map(student => {
      const daysAttended = attendanceRecords.filter(r => r.studentId === student.id).length;
      // For percentage, we need a defined total number of instructional days.
      // This is a simplification. A real system would have a calendar of instructional days.
      const uniqueAttendanceDays = new Set(attendanceRecords.filter(r => r.studentId === student.id).map(r => r.date)).size;
      const percentage = TOTAL_POSSIBLE_DAYS > 0 ? (uniqueAttendanceDays / TOTAL_POSSIBLE_DAYS) * 100 : 0;
      return {
        ...student,
        attendanceDays: uniqueAttendanceDays,
        attendancePercentage: parseFloat(percentage.toFixed(1)),
      };
    }).sort((a,b) => b.attendanceDays - a.attendanceDays); // Sort by most attendance
  }, [students, attendanceRecords]);

  const studentChartData: ChartData[] = useMemo(() => {
    return studentAttendanceSummary
      .map(s => ({ name: s.fullName.split(' ')[0] + ` (${s.indexNumber.slice(-4)})`, value: s.attendanceDays }))
      .slice(0, 20); // Top 20 students by attendance
  }, [studentAttendanceSummary]);


  const flaggedStudents = useMemo(() => {
    return studentAttendanceSummary.filter(s => s.attendancePercentage < ATTENDANCE_THRESHOLD_PERCENTAGE);
  }, [studentAttendanceSummary]);


  if (isLoading) {
    return <LoadingSpinner message="Loading statistics..." />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'daily':
        return (
          <>
            <BarChartComponent 
                data={dailyAttendanceData} 
                xAxisKey="name" 
                barDataKey="value" 
                barName="Students Present" 
                title="Daily Attendance Trend (Last 30 Days)" 
            />
            <div className="mt-6 bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Attendance Data</h3>
              <Button 
                onClick={() => exportAttendanceToCSV(attendanceRecords, 'all_attendance_records.csv')}
                variant="secondary" size="sm" leftIcon={<ExportIcon className="w-4 h-4"/>} className="mb-3">
                Export All Attendance (CSV)
              </Button>
              {attendanceRecords.length > 0 ? (
                <div className="max-h-96 overflow-y-auto border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Index No.</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {attendanceRecords.slice().reverse().slice(0, 50).map(record => ( // Show last 50 records
                      <tr key={record.id}>
                        <td className="px-3 py-2 text-sm text-gray-600">{record.date}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{record.studentFullName}</td>
                        <td className="px-3 py-2 text-sm text-gray-600">{record.studentIndexNumber}</td>
                        <td className="px-3 py-2 text-sm text-gray-600">{record.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              ) : <p className="text-gray-500">No attendance records yet.</p>}
            </div>
          </>
        );
      case 'student':
         return (
          <>
            <BarChartComponent 
                data={studentChartData} 
                xAxisKey="name" 
                barDataKey="value" 
                barName="Days Present" 
                title="Student Attendance Comparison (Top 20)" 
                fillColor="#FFC72C" // university-gold
            />
             <div className="mt-6 bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Student Attendance Summary</h3>
              {studentAttendanceSummary.length > 0 ? (
                <div className="max-h-96 overflow-y-auto border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Index No.</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Days Present</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Attendance % (of {TOTAL_POSSIBLE_DAYS} days)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {studentAttendanceSummary.map(student => (
                      <tr key={student.id} className={student.attendancePercentage < ATTENDANCE_THRESHOLD_PERCENTAGE ? "bg-red-50" : ""}>
                        <td className="px-3 py-2 text-sm text-gray-700">{student.fullName}</td>
                        <td className="px-3 py-2 text-sm text-gray-600">{student.indexNumber}</td>
                        <td className="px-3 py-2 text-sm text-gray-600">{student.attendanceDays}</td>
                        <td className={`px-3 py-2 text-sm font-medium ${student.attendancePercentage < ATTENDANCE_THRESHOLD_PERCENTAGE ? "text-red-600" : "text-green-600"}`}>
                            {student.attendancePercentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              ) : <p className="text-gray-500">No student data to summarize.</p>}
            </div>
          </>
        );
      case 'flagged':
        return (
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-red-700 mb-2">Students Below {ATTENDANCE_THRESHOLD_PERCENTAGE}% Attendance</h3>
            <p className="text-sm text-gray-600 mb-3">Assuming a total of {TOTAL_POSSIBLE_DAYS} instructional days for percentage calculation.</p>
            {flaggedStudents.length > 0 ? (
              <div className="max-h-96 overflow-y-auto border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-red-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-red-700 uppercase">Student Name</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-red-700 uppercase">Index No.</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-red-700 uppercase">Days Present</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-red-700 uppercase">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {flaggedStudents.map(student => (
                    <tr key={student.id}>
                      <td className="px-3 py-2 text-sm text-gray-700">{student.fullName}</td>
                      <td className="px-3 py-2 text-sm text-gray-600">{student.indexNumber}</td>
                      <td className="px-3 py-2 text-sm text-red-600 font-medium">{student.attendanceDays}</td>
                      <td className="px-3 py-2 text-sm text-red-600 font-bold">{student.attendancePercentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            ) : <p className="text-gray-500">No students are currently below the attendance threshold.</p>}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-university-blue border-b pb-3">Attendance Statistics</h1>
      
      <div className="flex space-x-1 border-b border-gray-300">
        {(['daily', 'student', 'flagged'] as const).map(tabName => (
            <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none 
                ${activeTab === tabName 
                    ? 'border-b-2 border-university-blue text-university-blue' 
                    : 'text-gray-500 hover:text-university-blue-light'}`}
            >
                {tabName === 'daily' ? 'Daily Trends' : tabName === 'student' ? 'Student Summary' : 'Flagged Students'}
            </button>
        ))}
      </div>
      
      {renderContent()}
    </div>
  );
};

export default StatisticsPage;
