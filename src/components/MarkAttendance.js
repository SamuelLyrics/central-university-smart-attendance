import React, { useEffect, useState } from "react";
import { fetchStudents, markAttendance } from "../api";

const MarkAttendance = () => {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchStudents().then(setStudents);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await markAttendance(studentId, date);
      setMessage("Attendance marked!");
      setStudentId("");
      setDate("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Mark Attendance</h2>
      <select
        value={studentId}
        onChange={e => setStudentId(e.target.value)}
        required
      >
        <option value="">Select Student</option>
        {students.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />
      <button type="submit">Mark</button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default MarkAttendance;