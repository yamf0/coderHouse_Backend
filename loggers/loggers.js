const log4js = require('log4js')

log4js.configure({
    appenders: {
        myLoggerConsole: {type: 'console'},
        myWarnFile: {type: 'file', filename: './loggers/warn.log'},
        myErrorFile: {type: 'file', filename: './loggers/error.log'}
    },
    categories: {
        default: {appenders: ['myLoggerConsole'], level: 'info'},
        logWarn: {appenders: ['myWarnFile'], level: 'warn'},
        logError: {appenders: ['myErrorFile'], level: 'error'}
    }
})

const logInfo = log4js.getLogger('default')
const logWarning = log4js.getLogger('logWarn')
const logError = log4js.getLogger('logError')

module.exports = {logInfo, logWarning, logError}
