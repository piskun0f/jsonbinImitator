const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('node:path');
require('dotenv').config()

const FILE_NAME = "data.json";
const app = express()
const PORT = process.env.PORT

function saveData() {
  fs.writeFileSync(FILE_NAME, JSON.stringify(data), { encodin: 'utf-8' })
}

function backupData() {
  fs.writeFileSync(path.join("backups", FILE_NAME + Date.now().toString()), JSON.stringify(data), { encodin: 'utf-8' })
  console.log("Backed done")
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

app.use(bodyParser.json())

app.get('/', (req, res) => {
  console.log("GET request")
  res.send(data);
})

app.post('/', (req, res) => {
  console.log(`POST request with body: ${JSON.stringify(req.body)} headers: ${JSON.stringify(req.headers)}`)
  if (req.headers[AUTH_HEADER.toLowerCase()] !== API_TOKEN) {
    const err = new Error('Fobbiden');
    err.status = 403;
    res.send(err);
  }
  data = req.body;
  saveData();
  res.send(data);
});

app.put('/', (req, res) => {
  console.log(`PUT request with body: ${JSON.stringify(req.body)} headers: ${JSON.stringify(req.headers)}`)
  if (req.headers[AUTH_HEADER.toLowerCase()] !== API_TOKEN) {
    const err = new Error('Fobbiden');
    err.status = 403;
    res.send(err);
  }
  data = req.body;
  saveData();
  res.send(data);
});

setInterval(backupData, 60 * 60_000)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})