'use strict'
const jwt = require('jwt-simple');
const moment = require('moment');

function createToken(user){
    const payload = {
        id: user.id,
        admin: user.admin,
        iat: moment().unix(),
        esp: moment().add(1, "hour").unix()
    }

    return jwt.encode(payload, "codigodetoken")
}

module.exports = createToken