
export enum UserRole {
  LECTURER = 'Lecturer',
  CLASS_PREFECT = 'Class Prefect',
}

export interface User {
  id: string;
  username: string;
  password?: string; // Password should not be stored in frontend state long-term
  role: UserRole;
}

export interface Student {
  id: string;
  fullName: string;
  indexNumber: string;
  faceData: string | null; // Placeholder for face recognition data
  registrationDate: string; // ISO string
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentFullName: string;
  studentIndexNumber: string;
  timestamp: number; // Unix timestamp
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  month: string; // MM (e.g., 01 for January)
  year: string; // YYYY
}

export interface NavigationItem {
  name: string;
  path: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  allowedRoles: UserRole[];
}

export interface ChartData {
  name: string;
  value: number;
}
