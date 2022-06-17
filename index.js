const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
require('dotenv').config()

const FILE_NAME = "data.json";
const app = express()
const PORT = process.env.PORT

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

const AUTH_HEADER = "X-Master-Key";
const API_TOKEN = process.env.API_TOKEN;

app.use((req, res, next) => {
  console.log(`Request with body: ${req.body} headers: ${req.headers}`)
})

app.use((req, res, next) => {
  if (req.headers[AUTH_HEADER] === API_TOKEN || req.headers[AUTH_HEADER.toLowerCase()] === API_TOKEN) {
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

app.put('/', (req, res) => {
  data = req.body;
  saveData();
  res.send(data);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})