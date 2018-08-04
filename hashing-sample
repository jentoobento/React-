/**
* password hashing sample
*/

const crypto = require('crypto')

export function hashString(item) {
    if (typeof item === 'object') {
        item = JSON.stringify(item)
    }
    return crypto.pbkdf2Sync(item, process.env.HASHER_VALUE, 10000, 16, 'sha256').toString('hex')
}

const hasher = require('../utils/hasher')

module.exports = authenticate

function authenticate(req, res, next) {
    req.auth = {}
    if (req.cookies.auth !== undefined) {
        let incomingHash = hasher.hashString(req.cookies.auth)
        let currentHash = req.cookies.authHash 
        if (incomingHash === currentHash) {
            req.auth = JSON.parse(req.cookies.auth)
            delete req.cookies.auth
        } else {
            res.status(401).send("Authorization could not be established for this user.")
        }
    }
    next()
}
