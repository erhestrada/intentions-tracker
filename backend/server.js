const express = require('express');
const cors = require('cors');  // Add this
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;  // Change to a different port

app.use(cors({
  origin: true,  // This allows all origins
  credentials: true
}));
app.use(express.json());

// Setup SQLite database
const db = new sqlite3.Database('./data.db');

// Initialize the database table if it doesn't exist
db.run('CREATE TABLE IF NOT EXISTS store_data (id INTEGER PRIMARY KEY, value INTEGER)');

// Route to store data
app.post('/store', (req, res) => {
  const { value } = req.body;
  db.run('INSERT INTO store_data (value) VALUES (?)', [value], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to store data' });
    }
    res.json({ message: 'Data stored successfully', id: this.lastID });
  });
});

// Route to retrieve data
app.get('/retrieve', (req, res) => {
  db.all('SELECT * FROM store_data', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }
    res.json(rows);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://192.168.86.195:${port}`);
});
