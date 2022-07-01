const express = require('express')
const path = require('path')
const session = require("express-session")
const cookieParser = require('cookie-parser')
const passport = require('passport')
const yargs = require('yargs');
const db = require("./dbUtils/mongoConnection")

const argv = yargs
  .option('port', {
    alias: 'p',
    description: 'port to run',
    type: 'String'
  })
  .option('mode', {
    alias: 'm',
    description: 'mode od run',
    type: 'String'
  })
  .help()
  .alias('help', 'h').argv;

//SET PORT TO -p or 8080
const port = argv.port || process.env.PORT || 8080

console.log(port)

const processRouter = require('./routers/processRouter')
const userRouter = require('./routers/userRouter')
const homeRouter = require('./routers/homeRouter')

require('dotenv').config()

const logger = require('./loggers/loggers')

//#DESAFIO NGINX#
const cluster = require('cluster')
const os = require('os')
const MODO = argv.mode || 'FORK'
if(MODO === 'CLUSTER' && cluster.isMaster){
    const numCpus = os.cpus().length
    logger.logInfo.info(`Cpus are ${numCpus}`)
    
    for(let i =0; i<numCpus; i++){
        cluster.fork()
    }
    cluster.on('exit', (worker) =>{
        logger.logInfo.info(
            'worker',
            worker.process.pid,
            'died',
            new Date().toLocaleString()
        )
        cluster.fork()
    })
}
else{
    logger.logInfo.info("Entering else")
    const app = express()
    
    app.use(express.urlencoded({extended:false}))
    app.use(express.json())

    app.set("view engine", "pug");
    app.set("views", path.join(__dirname, "views"));

    app.use(cookieParser())
    app.use(session({
        secret: process.env.SECRET,
        resave: true,
        rolling: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 10, ///10 mins,
            //maxAge: 10000, //10 sec
            sameSite: false
        },
    }))

    require('./utils/passportConfig')

    app.use(passport.initialize())
    app.use(passport.session())


    app.use("/api", processRouter)
    app.use("/user", userRouter)
    app.use("", homeRouter)

    app.listen(port,() => {
        logger.logInfo.info("server running")
    })
}
//#DESAFIO NGINX#
