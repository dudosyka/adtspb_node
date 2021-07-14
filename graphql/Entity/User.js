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

const Mail = require('../utils/Mail');
const mail = new Mail();

let rbac = new Rbac();

let User = function () {  }

User.prototype = Object.assign(User.prototype, baseEntity.prototype);

User.prototype.getInstance = () => User;

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

User.prototype.validateRules = async function () {
    return [
        this.validator(['name', 'surname', 'sex', 'email', 'phone', 'password'], 'Can`t be empty.').notNull(),
        await this.validator(['phone'], 'Should be valid phone number.').phone(),
        this.validator(['email'], 'Should be valid email.').email(),
        this.validator(['sex'], 'Invalid format').match(/^[0-1]{1}$/),
    ];
}

User.prototype.createFrom = async function (data, baseCreating = true, checkConfirmation = true) {
    if (baseCreating)
        await this.baseCreateFrom(data);
    let { role, rules } = await rbac.auth(this.__get('id'));
    this.fields.__role = role;
    this.fields.__accessible = rules;
    if (checkConfirmation)
        this.fields.isConfirmed = await EmailValidation.checkConfirmation(this.__get('id'));
    return this;
}

User.prototype.createFromUnique = async function (data) {
    const usr = await this.db.select(this, '`phone` = ? OR `email` = ?', [ data, data ]);

    if (usr.length)
    {
        const model = this.newModel();
        return await model.createFrom(usr[0]);
    }
    return null;
}

User.prototype.hasAccess = function (rule) {
    return this.__get('__accessible').indexOf(rule) != -1;
}

User.prototype.auth = async function (data) {
    return new Promise(async (resolve, reject) => {
        let res = await this.db.select(this, "`email` = ? OR `phone` = ?", [ data['user'], data['user'] ]);
        if (res.length)
        {
            let user = await res[0];
            if (await compare(data['pass'], user.password).catch(err => { console.error(err); })) {
                const confirmation = await EmailValidation.checkConfirmation(user.id);
                resolve({status: true, res: user, confirm: confirmation.__get('code') == null});
            }
            else
             resolve({status: false, res: 'password incorrect'});
        }
        else
         resolve({status: false, res: 'login incorrect'});
    });
}

User.prototype.checkRole = function (checkFor, target = false) {
    if (target === false) {
        if (this.__get('__role') == null)
            return false;
        else
            return this.__get('__role').includes(checkFor);
    }

    if (typeof target == 'object')
        return target.includes(checkFor);
    else
        return false;

    return false;
}

User.prototype.encryptPassword = async function () {
    await this.__set('password', await crypt(this.__get('password')));
}

User.prototype.fullname = function () { return this.__get('surname') + " " + this.__get("name") + " " + this.__get('lastname'); }

User.prototype.createNew = async function (roles = []) {
    let validate = await this.validate();
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

        const validation = await EmailValidation.setOnConfirmation(id, this.__get('email'), this.fullname());

        if (usr === false)
            throw Error('Saving data failed');

        let res = rbac.addRoleToUser(id, AppConfig.common_user_id);

        const dataRes = await UserExtraData.createNew({ user_id: id });

        if (res === false)
            throw Error('Saving data failed');

        roles.map(role_id => {
            rbac.addRoleToUser(id, role_id);
        });

        answ.id = id;
        answ.token = await jwt.sign({id: id, confirm: false});

        return answ;
    }
}

User.prototype.getChildrenIds = async function () {
    return await this.db.query('SELECT `child_id` FROM `user_child` WHERE `parent_id` = ?', [ this.__get('id') ])
    .then(data => data.map(el => el.child_id))
    .catch(err => { throw new Error('Internal server error.'); });
}

User.prototype.getFullData = async function (id = false, selections = {}, model = null, role = []) {
    if (id === false || id === null) {
        id = [this.__get('id')];
    }

    const {query, ids} = this.db.createRangeQuery(false, id);

    const data = (await this.db.query("SELECT * FROM `user` as `main` LEFT JOIN `user_extra_data` AS `data` ON `main`.`id` = `data`.`user_id` WHERE `main`." + query, ids));

    let proposals = null;
    if (selections.proposals) {
        let field = 'parent_id';
        let rangeIds = [id];
        if (role.includes(AppConfig.parent_role_id)) {
            field = 'child_id';
            rangeIds = data.map(el => el.user_id);
        }
        proposals = await model.selectProposalsList(field, rangeIds, selections.proposals);
    }

    data.map(user => {
        user.id = user.user_id;
        user.proposals = Object.keys(proposals ?? {}).length > 0 ? proposals[user.id] : null;
        return user;
    })

    return data;
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
    }
    else {
        query = await this.db.query('INSERT INTO `restore_password` (`user_id`, `code`) VALUES (?, ?)', [ user_id, code ]);
    }

    const fullname = user[0].surname + " " + user[0].name + " " + user[0].lastname;
    mail.sendEmail(user[0].email, "Код подтверждения" , "Здравствуйте, " + fullname + "! Код восстановления для вашего аккаунта в личном кабинете Академии Цифровых Технологий: " + code + " (Никому не сообщайте его)");
    return (query !== null);
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
    const childExtraData = await UserExtraData.createFrom({user_id: childId});
    childExtraData.load(data);

    createResult = await childExtraData.setChildData();

    if (createResult !== true) {
        console.log(createResult);
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

User.prototype.agreeParentRequest = async function (parent_id, newData) {
    if (this.__get('id') == null)
        throw Error('Token is gone');


    const request = await UserChild.baseCreateFrom({parent_id: parent_id, child_id: this.__get('id')});
    const checkRelationship = await request.checkRelationship();

    if (!checkRelationship)
        throw Error('Request not found');

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
    instance.fields = {...data};

    let createResult = await instance.createNew([ AppConfig.child_role_id ]);
    if (createResult.status != 'success')
        throw Error("User creating failed");

    instance.fields.id = createResult.id

    // const child = await instance.createFrom({id: createResult.id});
    const usrChild = await UserChild.baseCreateFrom({ parent_id: this.__get('id'), child_id: createResult.id });
    const request = await usrChild.addParentRequest();
    await this.setChildData(createResult.id, data, true, instance, true);

    return await instance.agreeParentRequest(this.__get('id'), data);
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

    const model = this.newModel();
    model.fields = {...data};
    const validateRes = await model.validate(Object.keys(data));

    if (validateRes !== true) {
        throw Error(JSON.stringify(validateRes));
    }

    let pairs = await model.checkForPairs('email', model.__get('email'));

    if (pairs.length > 0)
        throw Error('Email must be unique');

    pairs = await model.checkForPairs('phone', model.__get('phone'));

    if (pairs.length > 0)
        throw Error('Phone must be unique');

    if (target !== false) {
        target = await model.baseCreateFrom({ id: target_id });
    } else {
        target = this;
    }

    return DataOnEdit.setUserOnEdit(this.__get('id'), target, data, 'user');
}

User.prototype.setExtraDataOnEdit = async function (data, target_id, autoConfirm = false, child = true) {
    let target = await this.getTargetOfEditing(target_id);

    const model = UserExtraData.newModel();
    model.fields = {...data};
    let validateRes = {};
    if (child)
        validateRes = await model.checkChildData(Object.keys(data));
    else
        validateRes = await model.checkAdultData(Object.keys(data));


    if (validateRes !== true) {
        throw Error(JSON.stringify(validateRes));
    }

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
