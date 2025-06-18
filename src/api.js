import { fetchStudents } from './api';

export const API_BASE_URL = "http://localhost:5000/api";

// Students
export async function fetchStudents() {
  const res = await fetch(`${API_BASE_URL}/students`);
  if (!res.ok) throw new Error("Failed to fetch students");
  return res.json();
}

export async function addStudent(name, email) {
  const res = await fetch(`${API_BASE_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error("Failed to add student");
  return res.json();
}

// Attendance
export async function fetchAttendance() {
  const res = await fetch(`${API_BASE_URL}/attendance`);
  if (!res.ok) throw new Error("Failed to fetch attendance");
  return res.json();
}

export async function markAttendance(studentId, date) {
  const res = await fetch(`${API_BASE_URL}/attendance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentId, date }),
  });
  if (!res.ok) throw new Error("Failed to mark attendance");
  return res.json();
}

// Authentication
export async function register(email, password, role) {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
  if (!res.ok) throw new Error("Registration failed");
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}