const baseEntity = require('./BaseEntity');
const Rbac = require('../utils/Rbac');
const { crypt, compare } = require('../utils/Crypt');
const AppConfig = require('../config/AppConfig');
const EmailValidation = require('./EmailValidation');

const Jwt = require('../utils/Jwt');
const jwt = new Jwt();

const UserChild = require('../Entity/UserChild');
const UserChildOnDelete = require('../Entity/UserChildOnDelete');
const UserExtraData = require('../Entity/UserExtraData');
const DataOnEdit = require('../Entity/DataOnEdit');
const UserDataLog = require('../Entity/UserDataLog');

const AssociationExtraData = require('./AssociationExraData');

let rbac = new Rbac();

let User = function () {  }

const Mail = require('../utils/Mail');
const mail = new Mail();

User.prototype = Object.assign(User.prototype, baseEntity.prototype);

User.prototype.createFrom = async function (data) {
    await this.baseCreateFrom(data);
    let { role, rules } = await rbac.auth(this.__get('id'));
    this.fields.__role = role;
    this.fields.__accessible = rules;
    this.fields.isConfirmed = await EmailValidation.checkConfirmation(this.__get('id'));
    return this;
}

User.prototype.createFromUnique = async function (data) {
    console.log("DATA", data);
    const usr = await this.db.select(this, '`phone` = ? OR `email` = ?', [ data, data ]);
    console.log(usr);
    if (usr.length)
    {
        const model = this.newModel();
        return await model.createFrom(usr[0]);
    }
    return null;
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

User.prototype.fields = {
    id: null,
    name: null,
    surname: null,
    lastname: null,
    email: null,
    phone: null,
    sex: null,
    password: null,
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
              resolve({status: true, res: user});
            else
             resolve({status: false, res: 'password incorrect'});
        }
        else
         resolve({status: false, res: 'login incorrect'});
    });
}

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
        let answ = {
            id: null,
            token: null,
            status: "success"
        }

        let pairs = await this.checkForPairs('email', this.__get('email'));

        if (pairs.length > 0)
            throw Error('Email must be unique');

        pairs = await this.checkForPairs('phone', this.__get('phone'));

        if (pairs.length > 0)
            throw Error('Phone must be unique');

        await this.encryptPassword();
        const usr = await this.save();
        const id = usr.insertId;

        const validation = await EmailValidation.setOnConfirmation(id);

        const fullname = this.__get('surname') + " " + this.__get("name") + " " + this.__get('lastname');
        console.log(this.__get('email'));
        console.log(fullname);
        console.log(validation.__get('code'));
        mail.sendEmail(this.__get('email'), "Код подтверждения" , "Здравствуйте, " + fullname + "Код подтверждения для вашего аккаунта в личном кабинете Академии Цифровых Технологий: " + validation.__get('code') + " (Никому не сообщайте его)");

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
    const fullname = user[0].surname + " " + user[0].name + " " + user[0].lastname;
    mail.sendEmail(user[0].email, "Код подтверждения" , "Здравствуйте, " + fullname + "Код восстановления для вашего аккаунта в личном кабинете Академии Цифровых Технологий: " + code + " (Никому не сообщайте его)");
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

User.prototype.addChild = async function (child_data) {
    if (this.hasAccess(11)) {
        const child = await this.createFromUnique(child_data);
        if (child == null)
            throw Error('Child not found')
        console.log(child.fields);
        // console.log(this.fields);
        if ((await child.checkRole(AppConfig.child_role_id)) === false)
            throw Error('You can`t send addChild request to user who is not a child');

        const usrChild = await UserChild.baseCreateFrom({ parent_id: this.__get('id'), child_id: child.__get('id') })
        const request = await usrChild.addParentRequest();
        if (request === false)
            throw Error('Request had already sent');

        return request.insertId;
    }
    else
        throw Error("Forbidden");
}

User.prototype.setChildData = async function (childId, data, deleteChild = false, entity = false, log = true, autoConfirm = false) {
    data.user_id = childId;
    const childExtraData = await UserExtraData.createFrom(data);
    createResult = await childExtraData.setChildData();

    if (createResult !== true) {
        if (deleteChild)
            entity.delete();
        if (createResult === false)
            throw Error('Saving data failed');
        else
            throw Error(createResult);
    }

    if (data.id)
        delete data.id;
    if (data.user_id)
        delete data.user_id;

    if (log) {
        const res = await this.setExtraDataOnEdit(data, childId, autoConfirm);
        if (autoConfirm)
            await UserDataLog.autoConfirm(res);
    }
}

User.prototype.agreeParentRequest = async function (request_id, newData) {
    if (this.__get('id') == null)
        throw Error('Token is gone');


    const request = await UserChild.baseCreateFrom({id: request_id});
    const requestExists = await request.parentRequestExists(this.__get('id'));
    if (requestExists !== true)
        throw Error(requestExists);

    await this.setChildData(this.__get('id'), newData);
    await request.agreeParentRequest();

    return true;
}

User.prototype.createChild = async function (data) {
    if (!this.hasAccess(11))
        throw Error('Forbidden');

    const instance = this.newModel();
    const childData = await instance.baseCreateFrom(data);

    let createResult = await childData.createNew([ AppConfig.child_role_id ]);
    if (createResult.status != 'success')
        throw Error("User creating failed");

    const child = await instance.createFrom({id: createResult.id});
    const request_id = await this.addChild(child.__get('email'));
    await this.setChildData(child.__get('id'), data, true, child, false);

    return await child.agreeParentRequest(request_id, data);
}

User.prototype.checkRelationship = async function (child_id) {
    const userChild = await UserChild.baseCreateFrom({ parent_id: this.__get('id'), child_id: child_id });
    const checkRelationship = await userChild.checkRelationship();
    return checkRelationship === false ? false : userChild;
}

User.prototype.removeChild = async function (child_id, removeAccount, comment) {
    if (!this.hasAccess(11))
        throw Error('Forbidden');

    const checkRelationship = await this.checkRelationship(child_id);
    if (checkRelationship === false)
        throw Error('Child not found');

    await checkRelationship.removeChild(removeAccount, comment).catch(err => {
        throw Error(err);
    });

    return true;
}

User.prototype.confirmRemoveChild = async function (link) {
    if (!this.hasAccess(12))
        throw Error('Forbidden');
    const userChildOnDelete = await UserChildOnDelete.baseCreateFrom({ id: link });
    if (userChildOnDelete.__get('user_child_id') == null)
        throw Error('Link not found');
    const userChild = await UserChild.baseCreateFrom({ id: userChildOnDelete.__get('user_child_id') });
    return await userChildOnDelete.confirmRemoveChild(userChild, this.__get('id'));
}

User.prototype.getTargetOfEditing = async function (target_id) {
    let target = false;

    if (target_id !== 0) {
        if (target_id == this.__get('id')) {
            return target;
        }
        if (!this.hasAccess(13))
            throw Error('Forbidden');
        const checkRelationship = await this.checkRelationship(target_id)
        if (checkRelationship === false)
            throw Error('Child not found');

        target = target_id;
        // const model = this.newModel();
        // target = await model.baseCreateFrom({ id: target_id });
    }

    return target;
}

User.prototype.setMainDataOnEdit = async function (data, target_id) {
    let target = await this.getTargetOfEditing(target_id);

    if (target !== false) {
        const model = this.newModel();
        target = await model.baseCreateFrom({ id: target_id });
    } else {
        target = this;
    }

    return DataOnEdit.setUserOnEdit(this.__get('id'), target, data, 'user');
}

User.prototype.setExtraDataOnEdit = async function (data, target_id, autoConfirm = false) {
    let target = await this.getTargetOfEditing(target_id);

    target = await UserExtraData.createFrom({ user_id: target === false ? this.__get('id') : target});

    return await DataOnEdit.setUserOnEdit(this.__get('id'), target, data, 'user_extra_data', target.__get('user_id'), autoConfirm);
}

User.prototype.confirEditData = async function (request_id) {
    if (!this.hasAccess(14))
        throw Error('Forbidden');

    const request = await UserDataLog.confirmEditRequest(request_id, this.__get('id'));

    const key = request.__get('edited_table') !== this.table
        ? 'user_id'
        : 'id';

    this.db.query('UPDATE `' + request.__get('edited_table') + '` SET `' + request.__get('field') + '` = ? WHERE `' + key + '` = ?', [ request.__get('new_value'), request.__get('target_id') ]);

    return (await request.delete()) !== false;
}

User.prototype.table = 'user';

module.exports = (new User());
