
import { User, UserRole } from './types';

export const APP_NAME = "Central University Smart Attendance";

// Dummy users for login simulation. In a real app, this would come from a backend.
export const DUMMY_USERS: User[] = [
  { id: 'lecturer1', username: 'lecturer@uni.edu', password: 'password123', role: UserRole.LECTURER },
  { id: 'prefect1', username: 'prefect@uni.edu', password: 'password123', role: UserRole.CLASS_PREFECT },
];

export const LOCAL_STORAGE_KEYS = {
  LOGGED_IN_USER: 'smartAttendance_loggedInUser',
  STUDENTS: 'smartAttendance_students',
  ATTENDANCE_RECORDS: 'smartAttendance_attendanceRecords',
};

export const ATTENDANCE_THRESHOLD_PERCENTAGE = 75; // For flagging students with low attendance
