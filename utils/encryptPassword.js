const bcrypt = require('bcrypt')

const encrypt = async (pwd) => {

    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    return await bcrypt.hash(pwd, salt);
}
const compare = async (reqPassword, userPassword) => {
    const validPwd = await bcrypt.compare(reqPassword, userPassword)
    return validPwd
}

module.exports = {
    encrypt,
    compare
}