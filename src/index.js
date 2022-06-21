const express = require("express")
const bodyParser = require("body-parser")
require("dotenv").config()
const logger = require("./logger")
const Storage = require("./storage")

const storage = new Storage()

const app = express()
const PORT = process.env.PORT

const AUTH_HEADER = "X-Master-Key";
const API_TOKEN = process.env.API_TOKEN;

app.use(bodyParser.json())

app.get("/", (req, res) => {
  logger.info("GET request")
  res.send(storage.getData());
})

app.put("/", (req, res) => {
  logger.info(`PUT request with body: ${JSON.stringify(req.body)} headers: ${JSON.stringify(req.headers)}`)
  if (req.headers[AUTH_HEADER.toLowerCase()] !== API_TOKEN) {
    logger.warn(`Fobbiden request from ip ${req.ip}`)
    res.status(403).send("Fobbiden");
  }

  if (!JSON.stringify(req.body).includes(JSON.stringify(storage.getData()))) {
    logger.error(`Attempt to clear data request from ip ${req.ip}`)
    res.status(401).send("Wrong body");
  } else {
    storage.saveData(req.body)
    res.send(storage.getData());
  }
});

storage.backupData()
setInterval(storage.backupData, 60 * 60000)

app.listen(PORT, () => {
  logger.info(`App listening on port ${PORT}`)
})
