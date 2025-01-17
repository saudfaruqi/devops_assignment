const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'user_management',
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to the database.');
  }
});

// Routes
// Get all users
app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(results);
    }
  });
});

// Add a new user
app.post('/api/users', (req, res) => {
  const { fullName, email, age, gender, address } = req.body;
  const id = uuidv4(); // Generate a unique ID
  const query = 'INSERT INTO users (id, fullName, email, age, gender, address) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(query, [id, fullName, email, age, gender, address], (err, result) => {
    if (err) {
      console.error('Error adding user:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ id, fullName, email, age, gender, address });
    }
  });
});

// Update a user
app.put('/api/users', (req, res) => {
  const { id, fullName, email, age, gender, address } = req.body;
  const query = 'UPDATE users SET fullName = ?, email = ?, age = ?, gender = ?, address = ? WHERE id = ?';

  db.query(query, [fullName, email, age, gender, address, id], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ id, fullName, email, age, gender, address });
    }
  });
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
