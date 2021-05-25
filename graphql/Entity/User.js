const baseEntity = require('./BaseEntity');
const Rbac = require('../utils/Rbac');
const { crypt, compare } = require('../utils/Crypt');
const AppConfig = require('../config/AppConfig');
const EmailValidation = require('./EmailValidation');

const Jwt = require('../utils/Jwt');
const jwt = new Jwt();

const UserChild = require('../Entity/UserChild');
const UserExtraData = require('../Entity/UserExtraData');

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

User.prototype.hasAccess = function (rule) {
    return this.__get('__accessible').indexOf(rule) != -1;
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
    //...if it called on model with loaded roles...
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

User.prototype.createNew = async function (roles = []) {
    let validate = this.validate();
    if (validate !== true) {
        throw Error(JSON.stringify(validate));
    }
    else {
        let pairs = await this.checkForPairs('email', this.__get('email'));

        let answ = {
            id: null,
            token: null,
            status: "success"
        }

        if (pairs.length > 0)
            throw Error('Email must be unique');

        await this.encryptPassword();
        const usr = await this.save();
        const id = usr.insertId;

        EmailValidation.setOnConfirmation(id);

        if (usr === false)
            throw Error('Saving data failed');

        let res = rbac.addRoleToUser(id, AppConfig.common_user_id);

        UserExtraData.createNew({ user_id: id });

        if (res === false)
            throw Error('Saving data failed');

        roles.map(role_id => {
            rbac.addRoleToUser(id, role_id);
        });

        answ.id = id;
        answ.token = await jwt.sign({id: id});

        return answ;
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

User.prototype.addChild = async function (child_id) {
    if (this.hasAccess(11)) {
        // console.log(child_id);
        const child = await this.getInstance().prototype.createFrom({id: child_id});
        // console.log(child.fields);
        // console.log(this.fields);
        if ((await child.checkRole(AppConfig.child_role_id)) === false)
            throw Error('You can`t send addChild request to user who is not a child');

        const usrChild = await UserChild.baseCreateFrom({ parent_id: this.__get('id'), child_id: child_id })
        const request = await usrChild.addParentRequest();
        if (request === false)
            throw Error('Request had already sent');

        return request.insertId;
    }
    else {
        throw Error(403);
    }
}

User.prototype.agreeParentRequest = async function (request_id, newData) {
    newData.user_id = this.__get('id');
    // console.log(newData);
    const request = await UserChild.baseCreateFrom({id: request_id, child_id: this.__get('id')});
    const requestExists = await request.parentRequestExists();
    if (requestExists !== true)
        throw Error(requestExists);

    const userData = await UserExtraData.createFrom(newData);
    if ((await userData.setChildData())) {
        await request.agreeParentRequest();
        return true;
    }
    else {
        throw Error("Saving data failed");
    }
}

User.prototype.createChild = async function (data) {
    const instance = this.newModel();
    const childData = await instance.baseCreateFrom(
        data
    // {
        // name: data.name,
        // surname: data.surname,
        // lastname: data.lastname,
        // email: data.email,
        // sex: data.sex,
        // phone: data.phone,
        // password: data.password
    // }
    );
    // console.log("OBJECT", childData);
    let createResult = await childData.createNew([ AppConfig.child_role_id ]);
    if (createResult.status != 'success')
        throw Error("User creating failed");
    const child = await instance.createFrom({id: createResult.id});

    data.user_id = child.__get('id');
    const childExtraData = await UserExtraData.createFrom(data);
    createResult = await childExtraData.setChildData();
    if (!createResult)
        throw Error("User extra data adding failed");

    const request_id = await this.addChild(child.__get('id'));
    return await child.agreeParentRequest(request_id, data);
}

User.prototype.removeChild = async function (child_id) {
    if (!this.hasAccess(11))
        throw Error('Forbidden');
    const userChild = await UserChild.baseCreateFrom({ parent_id: this.__get('id'), child_id: child_id });
    const checkRelationship = await userChild.checkRelationship();
    if (!checkRelationship)
        throw Error('Child not found');

    await userChild.removeChild().catch(err => {
        throw Error(err);
    });

    return true;
}

User.prototype.table = 'user';

module.exports = (new User());
