import React, { useEffect, useState } from "react";
import { fetchStudents } from "../api";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents()
      .then(setStudents)
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <h2>Student List</h2>
      {error && <div style={{color: "red"}}>{error}</div>}
      <ul>
        {students.map(s => (
          <li key={s.id}>{s.name} ({s.email})</li>
        ))}
      </ul>
    </div>
  );
};

export default StudentList;