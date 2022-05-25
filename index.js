const express = require('express')
const path = require('path')
const session = require("express-session")
const cookieParser = require('cookie-parser')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy

const MongoStore = require('connect-mongo')
const advancedOpts = {useNewUrlParser: true, useUnifiedTopology: true}
require('dotenv').config()

const db = require("./dbUtils/mongoConnection")
const userModel = require("./dbUtils/userSchema");
const encryptUtils = require("./utils/encryptPassword")


const app = express()

app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));



app.use(cookieParser())
app.use(session({
    secret: "hhhhhh",
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 10, ///10 mins,
        //maxAge: 10000, //10 sec
        sameSite: false
    },
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use('register',
    new localStrategy(
        {passReqToCallback: true},
        async (req, username, password, done) => {
            console.log(username)
            const userExists =  await userModel.findOne({ username: username })

            if(userExists){
                //User exists in DB no registration needed
                console.log("user already registered")
                return done(null, false)
            } else{
                //Encryt pwd and register user
                console.log("User is not registered")

                const user = new userModel({ username: username, password: password})

                user.password = await encryptUtils.encrypt(user.password)

                await user.save()
                //console.log(await userModel.find({}).count())
                return done(null, user.username)
            }
        }
    )
)

passport.use(
    'login',
    new localStrategy(async ( username, password, done) => {
        console.log("Login")
        const user = await userModel.findOne({ username: username });
        console.log(`user is ${user}`)
        if (user) {
            const validPwd = await encryptUtils.compare(password, user.password)
        // check user password with hashed password stored in the database
            if (validPwd) {
                console.log("pwd correct, logging in")
                return done(null, user)
            } 
        }
        console.log("login failed")
        return done(null, false)
    })
)

passport.serializeUser((username, done) => {
    done(null, username)
})

passport.deserializeUser((user, done) => {
    userModel.findOne({username: user.username}, function(err, user) {
        done(err, user);
    });
})

app.listen(8080,() => {
    console.log("server running")
})

//Rutas Passport
app.post('/user/registerP', passport.authenticate('register', {
    successRedirect: '/login',
    failureRedirect: '/register/error'
}))

app.post('/user/loginP', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/login/error'
}))

app.get("/register/error", (req, res) => {
    res.render('signupErr')
})
app.get("/login/error", (req, res) => {
    res.render('loginErr')
})


app.get('/home', (req, res)=> {
    const user = req.user
    if(!user){
        console.log("user not logged in")
        res.redirect('/login')
    }
    else{
        console.log("user is logged in")
        res.render('logged', {username: user.username})
    }
})

app.get('/login', (req, res) => {
    //make sure there is no session here
    req.logOut((err) => {
        if(err){console.log(err)}
    })
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})



app.post('/logout', (req, res) => {
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


//INACTIVE
//ENDPOINT WITHOUT PASSPORT
app.post('/user/login', async (req, res) => {
    
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
app.post('/user/register', async (req, res) => {

    const body = req.body;

    if (!(body.username && body.password)) {
      return res.status(400).send({ error: "Data not formatted properly" });
    }

    const user = new userModel(req.body)

    user.password = await encryptUtils.encrypt(user.password)

    console.log(user.password)

    try {
        await user.save();
        res.send(user);
      } catch (error) {
        res.status(500).send(error);
      }
})

