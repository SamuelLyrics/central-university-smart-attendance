
import { AttendanceRecord, Student } from '../types';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { getStudentById } from './studentService';


const getAttendanceRecords = (): AttendanceRecord[] => {
  const recordsJson = localStorage.getItem(LOCAL_STORAGE_KEYS.ATTENDANCE_RECORDS);
  return recordsJson ? JSON.parse(recordsJson) : [];
};

const saveAttendanceRecords = (records: AttendanceRecord[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify(records));
};

export const markAttendance = async (studentId: string): Promise<AttendanceRecord | null> => {
  return new Promise(async (resolve, reject) => {
    setTimeout(async () => {
      const student = await getStudentById(studentId);
      if (!student) {
        reject(new Error("Student not found."));
        return;
      }

      const records = getAttendanceRecords();
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Check if already marked today
      const alreadyMarked = records.some(r => r.studentId === studentId && r.date === dateStr);
      if (alreadyMarked) {
        reject(new Error(`Student ${student.fullName} (${student.indexNumber}) has already been marked present today.`));
        return;
      }

      const newRecord: AttendanceRecord = {
        id: `att_${Date.now()}_${studentId}`,
        studentId: student.id,
        studentFullName: student.fullName,
        studentIndexNumber: student.indexNumber,
        timestamp: now.getTime(),
        date: dateStr,
        time: now.toLocaleTimeString('en-GB'), // HH:MM:SS
        month: ('0' + (now.getMonth() + 1)).slice(-2), // MM
        year: now.getFullYear().toString(), // YYYY
      };
      records.push(newRecord);
      saveAttendanceRecords(records);
      resolve(newRecord);
    }, 500); // Simulate processing delay
  });
};

export const getAllAttendanceRecords = async (): Promise<AttendanceRecord[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getAttendanceRecords());
        }, 200);
    });
};

export const getAttendanceByStudentId = async (studentId: string): Promise<AttendanceRecord[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const records = getAttendanceRecords();
            resolve(records.filter(r => r.studentId === studentId));
        }, 100);
    });
};

export const getAttendanceByDate = async (date: string): Promise<AttendanceRecord[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const records = getAttendanceRecords();
            resolve(records.filter(r => r.date === date));
        }, 100);
    });
};

// More complex queries can be added here, e.g., by month, year, or combinations.
