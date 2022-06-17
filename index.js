const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = 3000

let data = {};

const AUTH_HEADER = "X-Master-Key".toLowerCase();
const API_TOKEN = "$2b$10$UghmBJDa./wqWUTjc.B96e9Q1w7mMRChJAMCSnCFjQNwcVNyDq5QS";

app.use((req, res, next) => {
  if (req.headers[AUTH_HEADER] === API_TOKEN) {
    next();
  } else {
    const err = new Error('Fobbiden');
    err.status = 403;
    next(err);
  }
});

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send(data);
})

app.post('/', (req, res) => {
  data = req.body;
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})