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

/*
db.run('DELETE FROM achievement_statuses WHERE date = ?', ['12/12/2024'], (err) => {
  if (err) {
    console.error('Error deleting row:', err);
  } else {
    console.log('Row deleted successfully');
  }
});
*/

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, uuid TEXT UNIQUE NOT NULL)');
db.run('CREATE TABLE IF NOT EXISTS intentions_log (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, date TEXT, intention TEXT, timestamp TEXT)');
db.run('CREATE TABLE IF NOT EXISTS required_repetitions_per_intention (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, intention TEXT, repetitions INTEGER)');
db.run('CREATE TABLE IF NOT EXISTS achievement_statuses (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, date TEXT, action TEXT, achievement_status INTEGER, UNIQUE (uuid, date, action) )');
db.run('CREATE TABLE IF NOT EXISTS streaks (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, date TEXT, action TEXT, streak INTEGER, UNIQUE (uuid, date, action))');

/*
// Step 1: Create the new table with the UNIQUE constraint
db.run(`
  CREATE TABLE IF NOT EXISTS new_achievement_statuses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT NOT NULL,
    date TEXT,
    action TEXT,
    achievement_status INTEGER,
    UNIQUE (uuid, date, action)  -- Add the UNIQUE constraint on uuid, date, and action
  )
`, function(err) {
  if (err) {
    console.error('Error creating new table:', err.message);
    return;
  }

  // Step 2: Copy the data from the old table to the new table
  db.run(`
    INSERT INTO new_achievement_statuses (id, uuid, date, action, achievement_status)
    SELECT id, uuid, date, action, achievement_status
    FROM achievement_statuses
  `, function(err) {
    if (err) {
      console.error('Error copying data to new table:', err.message);
      return;
    }

    // Step 3: Drop the old table
    db.run('DROP TABLE achievement_statuses', function(err) {
      if (err) {
        console.error('Error dropping old table:', err.message);
        return;
      }

      // Step 4: Rename the new table to the original table name
      db.run('ALTER TABLE new_achievement_statuses RENAME TO achievement_statuses', function(err) {
        if (err) {
          console.error('Error renaming new table:', err.message);
          return;
        }

        console.log('Table updated successfully with UNIQUE constraint on (uuid, date, action)');
      });
    });
  });
});
*/

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

app.post('/storeIntentionsLogEntry', (req, res) => {
  const { uuid, date, intention, timestamp } = req.body;
  
  db.run('INSERT INTO intentions_log (uuid, date, intention, timestamp) VALUES (?, ?, ?, ?)', [uuid, date, intention, timestamp], function (err) {
    if (err) {
      console.log('Error storing intention and repetitions:', err.message); // Log the specific error message
      return res.status(500).json({ error: 'Failed to store data', details: err.message });
    }
    res.json({ message: 'Data stored successfully', id: this.lastID });
  });
});

// Route to retrieve data
app.get('/retrieveIntentionsLog', (req, res) => {
  const { uuid } = req.query; // Extract uuid from the query string

  db.all('SELECT * FROM intentions_log WHERE uuid = ?', [uuid], (err, rows) => {
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
  const { uuid } = req.query; // Extract uuid from the query string

  db.all('SELECT * FROM required_repetitions_per_intention WHERE uuid = ?', [uuid], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }
    res.json(rows);
  });
});

// ---------------------

app.post('/initializeAchievementStatuses', (req, res) => {
  const { achievementStatusesRows } = req.body; // Assuming you're sending `intention` and `repetitions` in the request body
  console.log(achievementStatusesRows);
  for (const row of achievementStatusesRows) {
    db.run('INSERT INTO achievement_statuses (uuid, date, action, achievement_status) VALUES (?, ?, ?, ?)', row, function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to store data' });
      }
      res.json({ message: 'Data stored successfully', id: this.lastID });
    });    
  }
});

// Route to retrieve data
app.get('/retrieveAchievementStatuses', (req, res) => {
  const { uuid } = req.query; // Extract uuid from the query string

  db.all('SELECT * FROM achievement_statuses WHERE uuid = ?', [uuid], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }
    res.json(rows);
  });
});

//db.run('CREATE TABLE IF NOT EXISTS achievement_statuses (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, date TEXT, action TEXT, achievement_status INTEGER)');
app.post('/storeAchievementStatus', (req, res) => {
  const { uuid, date, intention, achievementStatus } = req.body;
  console.log('abc', uuid, date, intention, achievementStatus);
  
  const query = 'INSERT OR REPLACE INTO achievement_statuses (uuid, date, action, achievement_status) VALUES (?, ?, ?, ?)';
  //const query = 'INSERT INTO achievement_statuses (uuid, date, action, achievement_status) VALUES (?, ?, ?, ?)';

  db.run(query, [uuid, date, intention, achievementStatus], function (err) {
    if (err) {
      console.log('Error storing achievement status:', err.message); // Log the specific error message
      return res.status(500).json({ error: 'Failed to store data', details: err.message });
      //return res.status(500).json({ error: 'Failed to store data' });
    }
    res.json({ message: 'Data stored successfully', id: this.lastID });
  });
  
});

// ---------------------

app.post('/storeStreak', (req, res) => {
  const { uuid, date, action, streak } = req.body;
  
  const query = 'INSERT OR REPLACE INTO streaks (uuid, date, action, streak) VALUES (?, ?, ?, ?)';

  db.run(query, [uuid, date, action, streak], function (err) {
    if (err) {
      console.log('Error storing streak:', err.message); // Log the specific error message
      return res.status(500).json({ error: 'Failed to store data', details: err.message });
    }
    res.json({ message: 'Data stored successfully', id: this.lastID });
  });
  
});

// Route to retrieve data
app.get('/retrieveStreaks', (req, res) => {
  const { uuid } = req.query; // Extract uuid from the query string

  db.all('SELECT * FROM streaks WHERE uuid = ?', [uuid], (err, rows) => {
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

