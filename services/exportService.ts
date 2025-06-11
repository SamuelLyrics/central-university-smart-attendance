
import { AttendanceRecord, Student } from '../types';

const convertToCSV = <T extends object,>(data: T[]): string => {
  if (!data || data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => JSON.stringify(row[header as keyof T], (_, value) => value === null ? '' : value)).join(',')
    ),
  ];
  return csvRows.join('\n');
};

const downloadCSV = (csvString: string, filename: string): void => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const exportAttendanceToCSV = (records: AttendanceRecord[], filename: string = 'attendance_records.csv'): void => {
  if (records.length === 0) {
    alert("No attendance records to export.");
    return;
  }
  const csvData = convertToCSV(records);
  downloadCSV(csvData, filename);
};

export const exportStudentsToCSV = (students: Student[], filename: string = 'student_list.csv'): void => {
  if (students.length === 0) {
    alert("No students to export.");
    return;
  }
  // Remove faceData before exporting if it's too large or sensitive
  const studentsForExport = students.map(({ faceData, ...rest }) => rest);
  const csvData = convertToCSV(studentsForExport);
  downloadCSV(csvData, filename);
};


// Backup and Restore (simple JSON)
export const backupData = (students: Student[], attendanceRecords: AttendanceRecord[]): void => {
  const backup = {
    students,
    attendanceRecords,
    timestamp: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `smart_attendance_backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

export const restoreDataFromFile = (file: File): Promise<{ students: Student[], attendanceRecords: AttendanceRecord[] }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (event.target && typeof event.target.result === 'string') {
          const data = JSON.parse(event.target.result);
          if (data && Array.isArray(data.students) && Array.isArray(data.attendanceRecords)) {
            resolve({ students: data.students, attendanceRecords: data.attendanceRecords });
          } else {
            reject(new Error("Invalid backup file format."));
          }
        } else {
          reject(new Error("Failed to read file."));
        }
      } catch (error) {
        reject(new Error(`Error parsing backup file: ${error instanceof Error ? error.message : String(error)}`));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file."));
    reader.readAsText(file);
  });
};
