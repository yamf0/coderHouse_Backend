const express = require("express")
const apiRouter = require("./routers/api")
const path = require("path");
const bodyParser = require('body-parser');

const PORT = 8080
const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}));
app.use("/api", apiRouter)


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./../html/form.html"))
})

app.listen(PORT, () => {
    console.log("express running")
})