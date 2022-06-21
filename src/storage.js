const fs = require("fs")
const path = require("node:path")
const logger = require("./logger")

const FILE_NAME = "data"
const FILE_EXTENSION = ".json"
const FULL_FILE_NAME = FILE_NAME + FILE_EXTENSION

module.exports = class Storage {
  constructor() {
    this._data = {}
    this.readData()
  }

  readData() {
    if (fs.existsSync(FULL_FILE_NAME)) {
      this._data = JSON.parse(fs.readFileSync(FULL_FILE_NAME, { encoding: "utf-8" }))
    }
  }

  saveData(data) {
    this._data = data
    fs.writeFileSync(FULL_FILE_NAME, JSON.stringify(this._data), { encoding: "utf-8" })
  }

  backupData() {
    console.log(this._data)
    if (this._data) {
      fs.writeFileSync(path.join("backups", FILE_NAME + Date.now().toString()) + FILE_EXTENSION, JSON.stringify(this._data), { encodin: "utf-8" })
      logger.info("Backup done")
      return;
    }
    logger.warn("Can't backup. Data is empty")
  }

  getData() {
    return this._data
  }
}
