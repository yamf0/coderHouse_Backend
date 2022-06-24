var express = require('express');
const logger = require('../loggers/loggers')
const encryptUtils = require("../utils/encryptPassword")
const userModel = require("../dbUtils/userSchema");
const passport = require('passport')

// Single routing
var router = express.Router()

router.post('/registerP', passport.authenticate('register', {
    successRedirect: '/login',
    failureRedirect: '/register/error'
}))

router.post('/loginP', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/login/error'
}))


//INACTIVE
//ENDPOINT WITHOUT PASSPORT
router.post('/user/login', async (req, res) => {
    
    const body = req.body;
    const user = await userModel.findOne({ username: body.username });
    if (user) {
        const validPwd = await encryptUtils.compare(body.password, user.password)
      // check user password with hashed password stored in the database
     
        if (validPwd) {
            return res.redirect("/home")
        } else {
            return res.status(400).json({ error: "Invalid Password" })
        }
    } else {
        return res.status(401).json({ error: "User does not exist" })
    }

    /* if(!req.session.name){
        req.body.username?
        (req.session.name = req.body.username):
        (req.session.name = "anonimo")
    } */
})

//ENDPOINT WITHOUT PASSPORT
router.post('/register', async (req, res) => {

    const body = req.body;

    if (!(body.username && body.password)) {
      return res.status(400).send({ error: "Data not formatted properly" });
    }

    const user = new userModel(req.body)

    user.password = await encryptUtils.encrypt(user.password)

    logger.logInfo.info(user.password)

    try {
        await user.save();
        res.send(user);
      } catch (error) {
        res.status(500).send(error);
      }
})

//Rutas Passport

module.exports = router