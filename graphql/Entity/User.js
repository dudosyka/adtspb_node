const baseEntity = require('./BaseEntity');
const Rbac = require('../utils/Rbac');
const { crypt, compare } = require('../utils/Crypt');

let rbac = new Rbac();

let User = function () {  }

User.prototype = Object.assign(User.prototype, baseEntity.prototype);

User.prototype.createFrom = async function (data) {
    usr = await (new baseEntity()).createFrom(data, (new User()));
    if (usr === false)
        return;
    let { role, rules } = await rbac.auth(usr.__get('id'));
    usr.fields.__accessible = rules;
    usr.fields.__role = role;
    return usr;
}

//Light version of createFrom to load user data when we needn`t to know anything about user`s roles and rules
User.prototype._createFrom = async function (data) {
    usr = await (new baseEntity()).createFrom(data, (new User()));
    if (usr === false)
        return;
    return usr;
}

User.prototype.getInstance = () => User;

User.prototype.fields = {
    id: null
};

User.prototype.getRole = async function () {
    return this.db.query("SELECT `role_id` FROM `user_role` WHERE `user_id` = ?", [ this.__get('id') ])
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.error(err);
        });
}

User.prototype._save = async function () {
    this.pass = crypt(this.pass);
    await this.save();
}

User.prototype.auth = async function (data) {
    return new Promise(async (resolve, reject) => {
        let res = await this.db.select(this, "`email` = ? OR `phone` = ?", [ data['user'], data['user'] ]);
        if (res.length)
        {
            let user = await res[0];
            if (await compare(data['pass'], user.password).catch(err => { console.error(err); }))
              resolve(user);
            else
              resolve(false);
        }
        else
            resolve(false);
    });
};

User.prototype.checkRole = function (checkFor, target = false) {
    //If target not provided then check...
    //...if it called on mnodel with loaded roles...
    //...then check and returns result...
    //... in other situations - returns false.
    if (target === false) {
        if (this.__get('__role') == null)
            return false;
        else
            return this.__get('__role').includes(checkFor);
    }

    //Check if not object or array provided returns false
    if (typeof target == 'object')
        return target.includes(checkFor);
    else
        return false;

    //In any unpredictable situations returns false
    return false;
}

User.prototype.table = 'user';

module.exports = (new User());
