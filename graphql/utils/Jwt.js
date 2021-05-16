const jwt = require("jsonwebtoken");

const { secret, alg } = require('../config/jwt.js');

let Jwt = function () { }

Jwt.prototype.parse = async function (token)
{
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decode) => {
            if (err) resolve(false);
            resolve(decode);
        });
    });
}

Jwt.prototype.sign = function (data)
{
    return jwt.sign(data, secret, {algorithm: alg});
}

module.exports = Jwt;
