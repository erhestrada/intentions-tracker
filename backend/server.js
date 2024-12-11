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

/*
db.run('DROP TABLE intentions_log');
db.run('DROP TABLE required_repetitions_per_intention');
db.run('DROP TABLE achievement_statuses');
db.run('DROP TABLE streaks');
*/

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, uuid TEXT UNIQUE NOT NULL)');
db.run('CREATE TABLE IF NOT EXISTS intentions_log (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, date TEXT, intention TEXT, timestamp TEXT)');
db.run('CREATE TABLE IF NOT EXISTS required_repetitions_per_intention (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, intention TEXT, repetitions INTEGER)');
db.run('CREATE TABLE IF NOT EXISTS achievement_statuses (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, date TEXT, action TEXT, achievement_status INTEGER)');
db.run('CREATE TABLE IF NOT EXISTS streaks (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, date TEXT, action TEXT, streak INTEGER)');

//db.run('DROP TABLE streaks');
//db.run('DELETE FROM required_repetitions_per_intention'); // Deletes all rows

// users routes
app.post('/storeUser', (req, res) => {
  const { uuid } = req.body;
  console.log('uuid', uuid);
  db.run('INSERT INTO users (uuid) VALUES (?)', [uuid], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to store data' });
    }
    res.json({ message: 'Data stored successfully', id: this.lastID });
  });
});

// ----------------------------

// intentions_log routes
// Route to store data
app.post('/storeIntentionsLog', (req, res) => {
  const { intention, repetitions } = req.body; // Assuming you're sending `intention` and `repetitions` in the request body
  console.log(intention, repetitions);
  db.run('INSERT INTO required_repetitions_per_intention (intention, repetitions) VALUES (?, ?)', [intention, repetitions], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to store data' });
    }
    res.json({ message: 'Data stored successfully', id: this.lastID });
  });
});

// Route to retrieve data
app.get('/retrieveIntentionsLog', (req, res) => {
  db.all('SELECT * FROM required_repetitions_per_intention', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }
    res.json(rows);
  });
});

// ----------------------------

// required_repetitions_per_intention routes
// Route to store data
app.post('/storeRequiredRepetitionsForIntention', (req, res) => {
  const { uuid, intention, repetitions } = req.body; // Assuming you're sending `intention` and `repetitions` in the request body
  console.log(uuid, intention, repetitions);
  db.run('INSERT INTO required_repetitions_per_intention (uuid, intention, repetitions) VALUES (?, ?, ?)', [uuid, intention, repetitions], function (err) {
    if (err) {
      console.log('Error storing intention and repetitions:', err.message); // Log the specific error message
      return res.status(500).json({ error: 'Failed to store data', details: err.message });
    }
    res.json({ message: 'Data stored successfully', id: this.lastID });
  });
});

// Route to retrieve data
app.get('/retrieveRequiredRepetitionsPerIntention', (req, res) => {
  db.all('SELECT * FROM required_repetitions_per_intention', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }
    res.json(rows);
  });
});

// ---------------------

// achievement_statuses routes
// Route to store data
app.post('/storeAchievementStatuses', (req, res) => {
  const { intention, repetitions } = req.body; // Assuming you're sending `intention` and `repetitions` in the request body
  console.log(intention, repetitions);
  db.run('INSERT INTO required_repetitions_per_intention (intention, repetitions) VALUES (?, ?)', [intention, repetitions], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to store data' });
    }
    res.json({ message: 'Data stored successfully', id: this.lastID });
  });
});

// Route to retrieve data
app.get('/retrieveAchievementStatuses', (req, res) => {
  db.all('SELECT * FROM required_repetitions_per_intention', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }
    res.json(rows);
  });
});

// ---------------------

// streaks routes
// Route to store data
app.post('/storeStreaks', (req, res) => {
  const { intention, repetitions } = req.body; // Assuming you're sending `intention` and `repetitions` in the request body
  console.log(intention, repetitions);
  db.run('INSERT INTO required_repetitions_per_intention (intention, repetitions) VALUES (?, ?)', [intention, repetitions], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to store data' });
    }
    res.json({ message: 'Data stored successfully', id: this.lastID });
  });
});

// Route to retrieve data
app.get('/retrieveStreaks', (req, res) => {
  db.all('SELECT * FROM required_repetitions_per_intention', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }
    res.json(rows);
  });
});

// ---------------------

// Start server
app.listen(port, () => {
  console.log(`Server running on http://192.168.86.195:${port}`);
});

