const baseEntity = require('./BaseEntity');
const Rbac = require('../utils/Rbac');
const { crypt, compare } = require('../utils/Crypt');
const AppConfig = require('../config/AppConfig');
const EmailValidation = require('./EmailValidation');

const Jwt = require('../utils/Jwt');
const jwt = new Jwt();

let rbac = new Rbac();

let User = function () {  }

User.prototype = Object.assign(User.prototype, baseEntity.prototype);

User.prototype.createFrom = async function (data) {
    await this.baseCreateFrom(data);
    let { role, rules } = await rbac.auth(this.__get('id'));
    this.fields.__role = role;
    this.fields.__accessible = rules;
    this.fields.isConfirmed = await EmailValidation.checkConfirmation(this.__get('id'));
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
            return "failed";

        await this.encryptPassword();
        let usr = await this.save();

        EmailValidation.setOnConfirmation(usr.insertId);

        if (usr === false)
            return "failed";

        let res = rbac.addRoleToUser(usr.insertId, AppConfig.common_user_id);

        if (res === false)
            return "failed";

        return await jwt.sign({id: usr.insertId});
    }
}

User.prototype.getChildren = async function () {
    return await this.db.query('SELECT `child_id` FROM `user_child` WHERE `parent_id` = ?', [ this.__get('id') ])
    .then(data => data.map(el => el.child_id))
    .catch(err => { throw new Error('Internal server error.'); });
}

User.prototype.restorePasswordRequest = async function (email) {
    //Search for user
    let user = await this.db.select(this, '`email` = ?', [ email ]);
    if (user.length <= 0)
        return false;

    let user_id = user[0].id;
    // Code format XXX-XXX
    let code = Math.floor( Math.random() * (999999 - 100000) + 100000 );

    let query = await this.db.query('SELECT * FROM `restore_password` WHERE `user_id` = ?', [ user_id ]);

    // If already exists set new code and resend email
    if (query.length > 0) {
        query = await this.db.query('UPDATE `restore_password` SET `code` = ? WHERE `user_id` = ?', [ code, user_id ]);
        return (query !== null);
        //call send mail function
    }

    let res = await this.db.query('INSERT INTO `restore_password` (`user_id`, `code`) VALUES (?, ?)', [ user_id, code ]);
    //call send mail function
    return (res !== null);
}

User.prototype.checkRestoreCode = async function (email, code) {
    let user = await this.db.select(this, '`email` = ?', [ email ]);
    if (user.length <= 0)
        return false;

    let user_id = user[0].id;

    let query = await this.db.query('SELECT * FROM `restore_password` WHERE `user_id` = ?', [ user_id ]);
    if (query.length <= 0)
        return false;

    return (query[0].code == code);
}

User.prototype.restorePassword = async function (email, code, password) {
    if (!(await this.checkRestoreCode(email, code)))
        return false;

    let user = await this.db.select(this, '`email` = ?', [ email ]);
    let user_id = user[0].id;

    user = await this.createFrom({id: user_id});

    user.__set('password', password);
    await user.encryptPassword();

    let res = await user.update();

    if (res === false)
        return false;

    res = await this.db.query('DELETE FROM `restore_password` WHERE `user_id` = ?', [ user_id ]);

    return (res !== false);
}

User.prototype.table = 'user';

module.exports = (new User());
