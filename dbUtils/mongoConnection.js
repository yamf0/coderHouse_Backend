const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PWD}@cluster0.ii4wa.mongodb.net/desafioPassport?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

module.exports = db