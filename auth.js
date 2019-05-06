'use strict'

require('dotenv').config()
const crypto = require('crypto')
const globalConstants = require('./globalConstants')
const jwt = require('jsonwebtoken')

let auth = {}

auth.generateHash = function (password, salt) {
    let str = Buffer.concat([password, salt])

    let generator = crypto.createHash(globalConstants.CRYPTO_ALGOS.SHA512)
    generator.update(str)

    return generator.digest(globalConstants.STRING_FORMATS.HEX)
}

auth.genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString(globalConstants.STRING_FORMATS.HEX).slice(0, length)
}

auth.generateToken = function (email, password) {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // one day expiration
        data: {
            email: email,
            password: password
        }
    }, process.env.APP_SECRET)
}

auth.generateMeetingFileToken = function (roomId, userId, lobbyName) {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // one day expiration
        data: {
            roomId: roomId,
            userId: userId,
            lobbyName: lobbyName
        }
    }, process.env.APP_SECRET)
}

auth.decodeJWT = function(token) {
    // get the decoded payload and header
    var decoded = jwt.decode(token, {complete: true});
    // console.log(decoded.header);
    // console.log(decoded.payload)
    return decoded
}


module.exports = auth
