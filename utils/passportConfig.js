const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const encryptUtils = require("../utils/encryptPassword")
const userModel = require("../dbUtils/userSchema");

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
