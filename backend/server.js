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

//db.run('DROP TABLE groups');
//db.run('DROP TABLE groups_per_user');


/*
db.run('DELETE FROM users WHERE uuid = ?', ['37ddb973-131d-45c7-b814-c930b6d5cd67'], (err) => {
  if (err) {
    console.error('Error deleting row:', err);
  } else {
    console.log('Row deleted successfully');
  }
});
*/

db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, uuid TEXT UNIQUE NOT NULL)');
db.run('CREATE TABLE IF NOT EXISTS usernames (id INTEGER PRIMARY KEY, uuid TEXT UNIQUE NOT NULL, username TEXT)');
db.run('CREATE TABLE IF NOT EXISTS intentions_log (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, date TEXT, intention TEXT, timestamp TEXT)');
db.run('CREATE TABLE IF NOT EXISTS required_repetitions_per_intention (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, intention TEXT, repetitions INTEGER)');
db.run('CREATE TABLE IF NOT EXISTS achievement_statuses (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, date TEXT, action TEXT, achievement_status INTEGER, UNIQUE (uuid, date, action) )');
db.run('CREATE TABLE IF NOT EXISTS streaks (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, date TEXT, action TEXT, streak INTEGER, UNIQUE (uuid, date, action))');
db.run('CREATE TABLE IF NOT EXISTS chat_history (id INTEGER PRIMARY KEY, uuid TEXT NOT NULL, chat_message TEXT)');
db.run('CREATE TABLE IF NOT EXISTS bond_requests (id INTEGER PRIMARY KEY, receiver_id TEXT, sender_id TEXT, bonded_intentions TEXT, acceptance_status TEXT)');
db.run('CREATE TABLE IF NOT EXISTS bonds_per_user_intention (id INTEGER PRIMARY KEY, user_id TEXT, intention TEXT, bonded_intentions TEXT)');
db.run('CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY, group_name TEXT UNIQUE, group_description TEXT, owner TEXT NOT NULL)');
db.run(`
  CREATE TABLE IF NOT EXISTS groups_per_user (
    id INTEGER PRIMARY KEY,
    uuid TEXT,
    group_id INTEGER,
    FOREIGN KEY(uuid) REFERENCES users(uuid),
    FOREIGN KEY(group_id) REFERENCES groups(id),
    UNIQUE(uuid, group_id)
  )
`);

//db.run('CREATE TABLE IF NOT EXISTS groups_per_user (id INTEGER PRIMARY KEY, uuid TEXT UNIQUE NOT NULL, groups TEXT UNIQUE, descriptions_per_group TEXT)');


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

//db.run('DELETE FROM bonds_per_user_intention'); // Deletes all rows
//db.run('DELETE FROM usernames WHERE id = ?', [2] );

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

app.get('/retrieveUsers', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }
    res.json(rows);
  });
});

// ---------------------

app.post('/storeUsername', (req, res) => {
  const { uuid, username } = req.body;
  db.run('INSERT OR IGNORE INTO usernames (uuid, username) VALUES (?, ?)', [uuid, username], function(err) {
    if (err) {
      console.log('Error storing username:', err.message);
      return res.status(500).json({ error: 'Failed to store username', details: err.message });
    }
    res.json({'message': `username: ${username} stored successfully`});
  });
});

app.get('/retrieveUsername', (req, res) => {
  const { uuid } = req.query;  
  db.get('SELECT * FROM usernames WHERE uuid = ?', [uuid], function(err, row) {
    if (err) {
      console.log('Error retrieving username:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve data', details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Username not found' });
    } 
    res.json(row);
  });
});

app.get('/retrieveUsernames', (req, res) => {
  db.all('SELECT * FROM usernames', [], function(err, rows) {
    if (err) {
      console.log('Error retrieving usernames:', err.message);
      return res.status(500).json({ error: 'Failed to retrieve data', details: err.message });
    }
    res.json(rows);
  });
});

// ---------------------

app.get('/retrieveAcceptanceStatuses', (req, res) => {
  const { bondedIntentionsJson } = req.query;

  db.all('SELECT * FROM bond_requests WHERE bonded_intentions = ?', [bondedIntentionsJson], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }
    res.json(rows);
  });
});

// ---------------------

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

app.delete('/removeIntentionFromIntentionsLog', (req, res) => {
  const { uuid, intention } = req.body;

  db.run('DELETE FROM intentions_log WHERE uuid = ? AND intention = ?', [uuid, intention], function(err) {
    if (err) {
      console.log('Error removing intention entries:', err.message);
      return res.status(500).json({ error: 'Failed to remove data', details: err.message });
    }
    res.json({ message: 'Intention entries removed successfully', changes: this.changes });
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

app.delete('/removeIntentionFromRequiredRepetitionsPerIntention', (req, res) => {
  const { uuid, intention } = req.body;

  db.run('DELETE FROM required_repetitions_per_intention WHERE uuid = ? AND intention = ?', [uuid, intention], function(err) {
    if (err) {
      console.log('Error removing intention and repetitions:', err.message);
      return res.status(500).json({ error: 'Failed to remove data', details: err.message });
    }
    res.json({ message: 'Intention removed successfully', changes: this.changes });
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

app.post('/storeChatMessage', (req, res) => {
  const { uuid, chatMessage } = req.body;
  
  db.run('INSERT INTO chat_history (uuid, chat_message) VALUES (?, ?)', [uuid, chatMessage], function (err) {
    if (err) {
      console.log('Error storing intention and repetitions:', err.message); // Log the specific error message
      return res.status(500).json({ error: 'Failed to store data', details: err.message });
    }
    res.json({ message: 'Data stored successfully', id: this.lastID });
  });
});

app.get('/retrieveChatHistory', (req, res) => {
  db.all('SELECT * FROM chat_history', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }
    res.json(rows);
  });
});

// ---------------------

app.post('/storeBondRequest', (req, res) => {
  const { senderId, receiverId, bondedIntentions, acceptanceStatus } = req.body;
  const bondedIntentionsJson = JSON.stringify(bondedIntentions);

  db.run('INSERT OR IGNORE INTO bond_requests (receiver_id, sender_id, bonded_intentions, acceptance_status) VALUES (?, ?, ?, ?)', [receiverId, senderId, bondedIntentionsJson, acceptanceStatus], function (err) {
    if (err) {
      console.log('Error storing bond request:', err.message); // Log the specific error message
      return res.status(500).json({ error: 'Failed to store data', details: err.message });
    }
    res.json({ message: 'Bond request stored successfully', id: this.lastID });
  });
});

app.post('/updateBondRequest', (req, res) => {
  const { receiverId, bondedIntentionsJson, updatedStatus } = req.body;
  console.log(receiverId, bondedIntentionsJson, updatedStatus);

  db.run(
    'UPDATE bond_requests SET acceptance_status = ? WHERE receiver_id = ? AND bonded_intentions = ?',[updatedStatus, receiverId, bondedIntentionsJson], function (err) {
      if (err) {
        console.log('Error updating bond request:', err.message);
        return res.status(500).json({ error: 'Failed to update bond request', details: err.message });
      }

      // Check if any rows were updated
      if (this.changes === 0) {
        // No rows were updated (meaning no matching record was found)
        return res.status(404).json({ error: 'Bond request not found or no changes made' });
      }

      res.json({ message: 'Bond request updated successfully' });
    }
  );
});

app.get('/retrieveBondRequestsForUser', (req, res) => {
  const { uuid } = req.query;

  db.all('SELECT * FROM bond_requests WHERE receiver_id = ?', [uuid], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data'});
    }
    res.json(rows);
  });
});

// ---------------------
app.get('/retrieveBondedIntentions', (req, res) => {
  const { uuid, intention } = req.query;

  db.get('SELECT * FROM bonds_per_user_intention WHERE user_id = ? AND intention = ?', [uuid, intention], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve data' });
    }

    if (!row) {
      return res.json({});
    }

    res.json(row);
  });
});

app.post('/storeBondedIntentions', (req, res) => {
  const { receiverId, bondedIntentionsJson } = req.body;
  console.log(receiverId);
  console.log(bondedIntentionsJson);

  const bondedIntentions = JSON.parse(bondedIntentionsJson);
  
  let userIntentionPairs = [];
  for (const [user, intentions] of Object.entries(bondedIntentions)) {
    for (const intention of intentions) {
      userIntentionPairs.push([user, intention]);
    }
  }

  let bondsPerUserIntention = {};

  for (const [user, intention] of userIntentionPairs) {
    const key = JSON.stringify([user, intention]);
  
    const bonds = userIntentionPairs.filter((element) => JSON.stringify(element) !== JSON.stringify([user, intention]));
  
    bondsPerUserIntention[key] = bonds;
  }

  let completedInserts = 0;
  const totalInserts = Object.entries(bondsPerUserIntention).length;
  
  for (const [key, bondedIntentions] of Object.entries(bondsPerUserIntention)) {
    const [userId, intention] = JSON.parse(key);
    const bondedIntentionsJson = JSON.stringify(bondedIntentions);
  
    console.log(`For user: ${userId}, intention: ${intention}, bonded intentions:`, bondedIntentions);
  
    db.run('INSERT OR IGNORE INTO bonds_per_user_intention (user_id, intention, bonded_intentions) VALUES (?, ?, ?)', [userId, intention, bondedIntentionsJson], function (err) {
      if (err) {
        console.log('Error storing bonded intentions:', err.message); // Log the error
        return res.status(500).json({ error: 'Failed to store data', details: err.message });
      }
  
      completedInserts++;

      if (completedInserts === totalInserts) {
        res.json({ message: 'Bonded intentions stored successfully' });
      }
    });
  }
  

});

// ---------------------

// db.run('CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY, owner TEXT NOT NULL, members TEXT, group_name TEXT, group_description TEXT)');

app.post('/storeGroup', (req, res) => {
  const { uuid, groupName, groupDescription } = req.body;

  db.run('INSERT OR IGNORE INTO groups (group_name, group_description, owner) VALUES (?, ?, ?)', [groupName, groupDescription, uuid], function (err) {
    if (err) {
      console.log('Error storing group:', err.message); // Log the specific error message
      return res.status(500).json({ error: 'Failed to store group', details: err.message });
    }

    if (this.changes === 0) {
      // If no rows were inserted (i.e., the group name already exists), send a prompt
      return res.status(409).json({
        error: 'Group name already exists',
        message: 'Please choose a different group name.'
      });
    }

    const newGroupId = this.lastID;  // `this.lastID` gives the generated `group_id`

    res.json({ message: 'Group stored successfully', group_id: newGroupId });
  });
});

// POST /storeGroupsPerUser: Insert relationship between user and group into groups_per_user table
app.post('/storeGroupsPerUser', (req, res) => {
  const { uuid, groupId } = req.body;

  // Step 2: Insert the relationship into the `groups_per_user` join table
  db.run('INSERT INTO groups_per_user (uuid, group_id) VALUES (?, ?)', [uuid, groupId], function(err) {
      if (err) {
          return res.status(500).json({ error: 'Failed to store group-user relationship', details: err.message });
      }

      res.json({ message: 'Group-user relationship stored successfully' });
  });
});

app.get('/retrieveGroupsForUser', (req, res) => {
  const { uuid } = req.query;

  if (!uuid) {
    return res.status(400).json({ error: 'UUID is required' });  // Handle missing UUID
  }

  const query = `
    SELECT groups.id, groups.group_name, groups.group_description, groups.owner
    FROM groups
    INNER JOIN groups_per_user ON groups.id = groups_per_user.group_id
    WHERE groups_per_user.uuid = ?
  `;

  db.all(query, [uuid], (err, rows) => {
    if (err) {
      console.error('Error retrieving groups:', err.message);  // Log the error for debugging
      return res.status(500).json({ error: 'Failed to retrieve groups', details: err.message });
    }
    res.json(rows);  // Send back the results as JSON
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://192.168.86.195:${port}`);
});

