const jwt = require('jsonwebtoken')
const CustomError = require('./custom_error')
const { TOKEN_KEY } = require("../module/config")

module.exports.tokenChecking = function (args) {
    return new Promise((resolve, reject) => {
        const { token } = args
        const data = jwt.verify(token, TOKEN_KEY, (err, value) => {
            if (err) return reject(new CustomError(400, "Token invalid"))
            return value
        })

        if (!data) return reject(new CustomError(400, "Token invalid"))
        else return resolve({ admin: data.user })
    })
}