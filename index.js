console.log("welcome to bloomer backend")

const express = require("express");

const app = express();

const pool = require('./sql/connection');


const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
res.json("howdy world")
})

app.get('/sessions', (req, res) => {
  pool.query("SELECT * FROM sessions", function(err, rows, fields) {
    console.log(rows)
    res.json(rows)
  });
});

app.listen(PORT, () => console.log(`Listening @ http://localhost:${PORT}`));