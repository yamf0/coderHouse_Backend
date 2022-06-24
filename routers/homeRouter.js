const logger = require('../loggers/loggers')
var express = require('express');
// Single routing
var router = express.Router()


router.get('/home', (req, res)=> {
    const user = req.user
    if(!user){
        logger.logInfo.info("user not logged in")
        res.redirect('/login')
    }
    else{
        logger.logInfo.info("user is logged in")
        res.render('logged', {username: user.username})
    }
})

router.get('/login', (req, res) => {
    //make sure there is no session here
    req.logOut((err) => {
        if(err){logger.logError.error(err)}
    })
    res.render('login')
})

router.get('/register', (req, res) => {
    res.render('register')
})



router.post('/logout', (req, res) => {
    const username = req.user.username
    req.logOut((err) => {
        if(err){
            res.render('logoutErr')
        }
        else{
            res.render('logout', {username: username})
        }
    })
    
})

router.get('/info', (req, res) => {
    
    res.json({
        args: process.argv,
        platform: process.platform,
        nodeVersion: process.version,
        rss: process.memoryUsage().rss,
        execPath: process.execPath,
        pid: process.pid,
        path: __dirname
    })
})


router.get("/register/error", (req, res) => {
    res.render('signupErr')
})
router.get("/login/error", (req, res) => {
    res.render('loginErr')
})



module.exports = router