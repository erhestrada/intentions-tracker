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
db.run('CREATE TABLE IF NOT EXISTS required_repetitions_per_intention (id INTEGER PRIMARY KEY, intention TEXT, repetitions INTEGER)');

// Route to store data
app.post('/storeRequiredRepetitionsForIntention', (req, res) => {
  const { intention, repetitions } = req.body; // Assuming you're sending `intention` and `repetitions` in the request body
  console.log(intention, repetitions);
  db.run('INSERT INTO required_repetitions_per_intention (intention, repetitions) VALUES (?, ?)', [intention, repetitions], function (err) {
    if (err) {
      console.log('hello!');
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
