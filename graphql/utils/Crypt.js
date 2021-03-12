let bcrypt = require("bcrypt")

module.exports = {
    crypt: str => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function(err, salt) {
                if (err)
                    reject(err);
                bcrypt.hash(str, salt, function(err, hash) {
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

              //typeof check was added because of this dumb shit named bcrypt,
              //returning both null and Undefined in same situations... Why? I don`t know...

              if (err !== null && typeof err !== 'undefined') {
                    console.error(err);
                    reject(err);
              }
              resolve(isPasswordMatch);

            });
        }).catch(err => {console.error(err);});
    }
}
