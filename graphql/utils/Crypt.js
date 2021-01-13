let bcrypt = require("bcrypt")

module.exports = {
    crypt: str => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function(err, salt) {
                if (err)
                    reject(err);
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err)
                        reject(err);
                    resolve(hash);
                });
            });
        });
    },
    compare: (pass, hashpass) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(pass, hashpass, function(err, isPasswordMatch) {
                if (err !== null)
                    reject(err);
                resolve(isPasswordMatch);
            });
        });
    }
}