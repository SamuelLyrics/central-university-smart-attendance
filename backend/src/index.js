const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database!');
});

app.get('/', (req, res) => {
  res.send('API is working!');
});

// --- Students Endpoints ---

// Get all students
app.get('/api/students', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add a new student
app.post('/api/students', (req, res) => {
  const { name, email } = req.body;
  db.query(
    'INSERT INTO students (name, email) VALUES (?, ?)',
    [name, email],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, name, email });
    }
  );
});

// --- Attendance Endpoints ---

// Get all attendance records
app.get('/api/attendance', (req, res) => {
  db.query('SELECT * FROM attendance', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Mark attendance
app.post('/api/attendance', (req, res) => {
  const { studentId, date } = req.body;
  db.query(
    'INSERT INTO attendance (student_id, date) VALUES (?, ?)',
    [studentId, date],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, studentId, date });
    }
  );
});

// --- Authentication Endpoints ---

// Register user
app.post('/api/register', (req, res) => {
  const { email, password, role } = req.body;
  db.query(
    'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
    [email, password, role],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: result.insertId, email, role });
    }
  );
});

// Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
      res.json({ user: results[0] });
    }
  );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;