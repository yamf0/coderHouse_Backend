var express = require('express');
const { fork } = require("child_process");
  
// Single routing
var router = express.Router()

router.get("/randoms", (req, res) => {
    
    const num2Generate = req.query.count

    const forked = fork("./utils/randoms")

    forked.send(num2Generate? num2Generate: 100000000)

    forked.on("message", (randoms) =>{
        res.send(randoms)
    })

})

module.exports = router