const express = require("express");
const cors = require("cors");
const app = express();

const pool = require('./sql/connection');

const PORT = 4000;



app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true  // Add this line
}));

app.use(express.json());

// app.get('/', (req, res) => {
// res.json("howdy world")
// })

app.get('/sessions', (req, res) => {
  pool.query("SELECT * FROM sessions", function(err, rows, fields) {
    console.log(rows)
    res.json(rows)
  });
});

app.get('/users', (req, res) => {
  pool.query("SELECT * FROM users", function(err, rows, fields) {
    console.log(rows)
    res.json(rows)
  });
});

app.get('/schedules', (req, res) => {
  pool.query("SELECT * FROM schedules", function(err, rows, fields) {
    console.log(rows)
    res.json(rows)
  });
});

// to show a users' schedule:

app.get('/schedules:/id', (req, res) => {
  pool.query(`SELECT * FROM schedules WHERE schedules_user_id = ${id}`, function(err, rows, fields) {
    console.log(rows)
    res.json(rows)
  });
});



app.get('/users/:id', (req, res) => {
  const { id } = req. params;
  pool.query(
    `SELECT * FROM users WHERE user_id = ${id}`,
    function (err, rows, fields) {
      res.json(rows);
    }
  );
});

//to show a users' sessions

app.get('/sessions/:id', (req, res) => {
  const { id } = req.params;
  console.log('Fetching sessions for user_id:', id); // Add this line
  
  pool.query(
    `SELECT * FROM sessions WHERE user_id = ${id}`, 
    function(err, rows, fields) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Found rows:', rows.length); // Add this line
      res.json(rows);
    }
  );
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  pool.query(
    'SELECT * FROM users WHERE login_id = ? AND login_pwd = ?',
    [username, password],
    function(err, rows, fields) {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, error: 'Database error' });
      }

      if (rows.length > 0) {
        // User found
        res.json({ 
          success: true, 
          user: {
            id: rows[0].user_id,
            username: rows[0].login_id
          }
        });
      } else {
        // No user found
        res.json({ success: false });
      }
    }
  );
});

app.post('/users', (req, res) => {
  pool.query(`INSERT INTO users (user_id, login_id, login_pwd, first_name, last_name, email) VALUES (?, ?, ?, ?, ?, ?)`,
    [null, req.body.login_id, req.body.login_pwd, req.body.first_name, req.body.last_name, req.body.email],
    function (err, row, fields) {
      res.json(row);
    }

  )
});

app.post('/sessions', (req, res) => {
  pool.query(`INSERT INTO sessions (user_id, session_id, pain, depth, notes, finish) VALUES (?, ?, ?, ?, ?, CONVERT_TZ(NOW(), 'UTC', 'America/Chicago'))`,
    [req.body.user_id, null, req.body.pain, req.body.depth, req.body.notes],
    function (err, row, fields) {
      res.json(row);
    }

  )
})

app.post('/schedules', (req, res) => {
  console.log('Received schedule data:', req.body); // Debug log
  
  pool.query(
    `INSERT INTO schedules (schedules_user_id, reminder_time, days, timer) VALUES (?, ?, ?, ?)`,
    [req.body.schedules_user_id, req.body.reminder_time, req.body.days, req.body.timer],
    function (err, row, fields) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      console.log('Insert successful:', row); // Debug log
      res.json(row);
    }
  );
});

// app.post('/users', (req, res) => {
//   pool.query(`INSERT INTO users (user_id, login_id, login_pwd, first_name, last_name, email) VALUES (?, ?, ?, ?, ?, ?)`,
// })

app.listen(PORT, () => console.log(`Listening @ http://localhost:${PORT}`));

