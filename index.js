const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')

const FILE_NAME = "data";
const app = express()
const PORT = 3000

function saveData() {
  fs.writeFileSync(FILE_NAME, JSON.stringify(data), { encodin: 'utf-8' })
}

function readData() {
  if (fs.existsSync(FILE_NAME)) {
    data = JSON.parse(fs.readFileSync(FILE_NAME, { encoding: 'utf-8' }))
  }
}

let data = {};
readData();

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
  saveData();
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})