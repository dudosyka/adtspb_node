const baseEntity = require('./BaseEntity');
const Rbac = require('../utils/Rbac');
const { crypt, compare } = require('../utils/Crypt');
const AppConfig = require('../config/AppConfig');

let rbac = new Rbac();

let User = function () {  }

User.prototype = Object.assign(User.prototype, baseEntity.prototype);

User.prototype.createFrom = async function (data) {
    await this.baseCreateFrom(data);
    let { role, rules } = await rbac.auth(this.__get('id'));
    this.fields.__role = role;
    this.fields.__accessible = rules;
    return this;
}

User.prototype.getInstance = () => User;

User.prototype.validateRules = function () {
    return [
        this.validator(['name', 'surname', 'lastname', 'sex', 'email', 'phone', 'password'], 'Can`t be empty.').notNull(),
        this.validator(['phone'], 'Should be valid phone number.').phone(),
        this.validator(['email'], 'Should be valid email.').email(),
        this.validator(['sex'], 'Invalid format').match(/^[0-1]{1}$/),
    ];
}

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

User.prototype.encryptPassword = async function () {
    await this.__set('password', await crypt(this.__get('password')));
}

User.prototype.createNew = async function () {
    let validate = this.validate();
    if (validate !== true) {
        throw Error(JSON.stringify(validate));
    }
    else {
        let pairs = await this.checkForPairs('email', this.__get('email'));

        if (pairs.length > 0)
            return false;

        await this.encryptPassword();
        let usr = await this.save();

        if (usr === false)
            return false;

        let res = rbac.addRoleToUser(usr.insertId, AppConfig.common_user_id);

        if (res === false)
            return false;

        return true;
    }
}

User.prototype.getChildren = async function () {
    return await this.db.query('SELECT `child_id` FROM `user_child` WHERE `parent_id` = ?', [ this.__get('id') ])
    .then(data => data.map(el => el.child_id))
    .catch(err => { throw new Error('Internal server error.'); });
}

User.prototype.table = 'user';

module.exports = (new User());
