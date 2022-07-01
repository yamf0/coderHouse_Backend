const mongoose = require('mongoose');
require('dotenv').config()
const logger = require('../loggers/loggers')

const USER = encodeURIComponent(process.env.USER)
const MONGOPWD = encodeURIComponent(process.env.PWD)

mongoose.connect(`mongodb+srv://${USER}:${MONGOPWD}@cluster0.ii4wa.mongodb.net/desafioPassport?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  logger.logInfo.info("Connected successfully");
});

module.exports = db