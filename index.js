// console.log("welcome to bloomer backend")

const express = require("express");

const app = express();

const pool = require('./sql/connection');

const PORT = process.env.PORT || 4000;

// const port = process.env.DB_PORT || 4000;

// const port = 4000;

// const finishTime = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });

// const centralTime = new Date(finishTime);
// const formattedTime = `${centralTime.getFullYear()}-${String(centralTime.getMonth() + 1).padStart(2, '0')}-${String(centralTime.getDate()).padStart(2, '0')} ${String(centralTime.getHours()).padStart(2, '0')}:${String(centralTime.getMinutes()).padStart(2, '0')}:${String(centralTime.getSeconds()).padStart(2, '0')}`;

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

app.get('/users/:id', (req, res) => {
  const { id } = req. params;
  pool.query(
    `SELECT * FROM users WHERE user_id = ${id}`,
    function (err, rows, fields) {
      res.json(rows);
    }
  );
});

// app.get('/users/sessions/:id', (req, res) => {
//   const { id } = req. params;
//   pool.query(
//     `SELECT * FROM sessions WHERE user_id = ${id}`,
//     function (err, rows, fields) {
//       res.json(rows);
//     }
//   );
// });

app.get('/sessions/:id', (req, res) => {
  const { id } = req.params;
  pool.query(
    `SELECT * FROM sessions WHERE user_id = ${id}`, 
    function(err, rows, fields) {
    res.json(rows)
  }
);
});

// app.get('/sessions/:id', (req, res) => {
//   const { id } = req.params;
//   pool.query(
//     `SELECT * FROM sessions WHERE user_id = ${id}`, 
//     function(err, rows, fields) {
//     res.json(rows)
//   }
// );
// });

// app.post('/users/', (req, res) => {
//   console.log(req.body);
//   pool.query(
//     `INSERT INTO users (user_id, login_id, login_pwd, first_name, last_name, email) VALUES (null, ${req.body.login_id}, ${req.body.login_pwd}, ${req.body.first_name}, ${req.body.last_name}, ${req.body.email})`,
//     function (err, row, fields) {
//       res.json(row);
//     }
//   );

// });

app.post('/users', (req, res) => {
  pool.query(`INSERT INTO users (user_id, login_id, login_pwd, first_name, last_name, email) VALUES (?, ?, ?, ?, ?, ?)`,
    [null, req.body.login_id, req.body.login_pwd, req.body.first_name, req.body.last_name, req.body.email],
    function (err, row, fields) {
      res.json(row);
    }

  )
});

app.post('/sessions', (req, res) => {
  pool.query(`INSERT INTO sessions (user_id, session_id, pain, depth, notes, finish) VALUES (?, ?, ?, ?, ?, CONVERT_TZ(NOW(), '+00:00', '-10:00'))`,
    [req.body.user_id, null, req.body.pain, req.body.depth, req.body.notes],
    function (err, row, fields) {
      res.json(row);
    }

  )
})

app.post('/schedules', (req, res) => {
  pool.query(`INSERT INTO schedules (schedules_user_id, reminder_time, days, timer) VALUES (?, ?, ?, ?)`,
    [req.body.schedules_user_id, req.body.reminder_time, req.body.days, req.body.timer],
    function (err, row, fields) {
      res.json(row);
    }

  )
});

// app.post('/users', (req, res) => {
//   pool.query(`INSERT INTO users (user_id, login_id, login_pwd, first_name, last_name, email) VALUES (?, ?, ?, ?, ?, ?)`,
// })

app.listen(PORT, () => console.log(`Listening @ http://localhost:${PORT}`));
// app.listen(port, () => console.log(`Listening @ http://localhost:${port}`));