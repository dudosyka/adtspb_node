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
const UserDataOnEdit = require('../Entity/UserDataOnEdit');
const UserDataLog = require('../Entity/UserDataLog');

const AssociationExtraData = require('./AssociationExraData');
const Association = require('./Association');

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
    else
        this.load(data);
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

User.prototype.hasRole = function (role) {
    return this.__get('__role').indexOf(role) != -1;
}

User.prototype.getSector = async function () {
    const sector = await this.db.query('SELECT `sector_id` as `id` FROM `user_sector` WHERE `id` = ?', [ this.__get('id') ]);
    if (sector.length > 0)
        return sector[0].id;
    else
        return false;
}

User.prototype.getAllowedAssociations = async function () {
    const sector_id = await this.getSector();

    let query = "select `association_id` as `id` from `association_teacher` where `user_id` = ?";
    let data = [ this.__get('id') ];

    if (sector_id !== false) {
        query = "select `association_id` as `id` from `association_sector` where `sector_id` = ?";
        data.push(sector_id);
    }

    if (this.hasRole(11) || this.hasRole(14)) { //If super admin or admission office allow to all
        query = "WHERE `main`.`id` != ?";
        data = [ -1 ];
        const association = Association.newModel();
        return await association.getAssociations(null, {}, null, query, data).then(data => data.map(association => association.id));
    }

    return (await this.db.query(query, data)).map(el => el.id);
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

User.prototype.createNew = async function (roles = [], sendEmail = true, child = false) {
    const fields = this.fields;
    if (child) {
        delete fields.email;
        delete fields.phone;
        delete fields.password;
    }
    let validate = await this.validate(Object.keys(fields));
    if (validate !== true) {
        throw Error(JSON.stringify(validate));
    }
    else {
        let answ = {
            id: null,
            token: null,
            status: "success"
        }


        const pairs = await this.checkForPairs(['email', 'phone'], [this.__get('email'),this.__get('phone')]);

        if (pairs.length) {
            if (pairs[0].email == this.__get('email'))
                throw Error('Email must be unique');
            if (pairs[0].phone == this.__get('phone'))
                throw Error('Phone must be unique');
        }

        if (!child)
            await this.encryptPassword();

        const usr = await this.save();
        const id = usr.insertId;

        if (sendEmail) {
            await EmailValidation.newUser(id, this.__get('email'), this.fullname());
        }

        if (usr === false)
            throw Error('Saving data failed');

        await rbac.addRoleToUser(id, AppConfig.common_user_id);
        for (role in roles) {
            const role_id = roles[role];
            await rbac.addRoleToUser(id, role_id);
        }

        const dataRes = await UserExtraData.createNew({ user_id: id });

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

User.prototype.getFullDataAsObject = async function (id = false, selections = {}, model = null, role = [], where = "", whereData = []) {
    return this.getFullData(id, selections, model, role, true, where, whereData);
}

User.prototype.getFullData = async function (id = false, selections = {}, model = null, role = [], asObject = false, where = "", whereData = []) {
    if (id === false || id === null) {
        id = [this.__get('id')];
    }

    let {query, ids} = this.db.createRangeQuery(false, id);
    query = "`main`."+query;

    if (where != "") {
        query = where;
        ids = whereData;
    }

    const data = (await this.db.query("SELECT * FROM `user` as `main` LEFT JOIN `user_extra_data` AS `data` ON `main`.`id` = `data`.`user_id` WHERE " + query, ids));

    let proposals = null;
    if (selections.proposals) {
        let field = 'parent_id';
        let rangeIds = [ id ];
        if (role.includes(AppConfig.parent_role_id)) {
            field = 'child_id';
            rangeIds = data.map(el => el.user_id);
        }
        proposals = await model.selectProposalsList(field, rangeIds, selections.proposals);
    }

    let parents = null;
    if (selections.parent) {
        let field = 'child_id';
        const userChild = UserChild.newModel();
        let rangeIds = await userChild.getParents(data.map(el => el.user_id));
        parents = await this.getFullDataAsObject(rangeIds.map(el => Object.keys(el)[0]), selections.parent, model, role);
        rangeIds.map(el => {
            parents[Object.values(el)[0]] = parents[Object.keys(el)[0]];
        });
    }

    const result = {};

    data.map(user => {
        user.id = user.user_id;
        user.proposals = Object.keys(proposals ?? {}).length > 0 ? proposals[user.id] : null;
        user.parent = Object.keys(parents ?? {}).length > 0 ? parents[user.id] : null;;
        result[user.id] = user;
        return user;
    })

    if (asObject)
        return result;
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

    let child = (instance.fields.phone == null || instance.fields.email == null || instance.fields.password == null);
    let createResult = await instance.createNew([ AppConfig.child_role_id ], false, child);
    if (createResult.status != 'success')
        throw Error("User creating failed");

    instance.fields.id = createResult.id

    const usrChild = await UserChild.newModel();
    usrChild.load({ parent_id: this.__get('id'), child_id: createResult.id, agreed: 1 });
    await usrChild.save(true);
    const res = await this.setChildData(createResult.id, data, true, instance, false);

    //const validation = await EmailValidation.newUser(instance.__get('id'), instance.__get('email'), instance.fullname());

    return true;
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

    if (model.__get('email') !== null || model.__get('phone') !== null) {
        const pairs = await model.checkForPairs(['email', 'phone'], [model.__get('email'),model.__get('phone')]);

        if (pairs.length) {
            if (pairs[0].email == model.__get('email'))
                throw Error('Email must be unique');
            if (pairs[0].phone == model.__get('phone'))
                throw Error('Phone must be unique');
        }
    }

    if (target !== false) {
        target = await model.baseCreateFrom({ id: target_id });
    } else {
        target = this;
    }

    return UserDataOnEdit.setUserOnEdit(this.__get('id'), target, data, 'user');
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

    return await UserDataOnEdit.setUserOnEdit(this.__get('id'), target, data, 'user_extra_data', target.__get('user_id'), autoConfirm);
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

//For administration
User.prototype.editData = async function (newValue, logger, extraModel, admin_id) {
    if (!newValue.id)
        throw Error('Must provide `id` field into `input`');

    const id = newValue.id;
    delete newValue.id;

    const model = this.newModel();
    const oldData = await model.db.select(this, "`id` = ?", [ Number(id) ]);
    model.load(oldData[0]);

    return await logger.logModel(model, newValue, admin_id, id).then(res => {

        if (newValue.ovz_type)
            newValue.ovz_type = newValue.ovz_type.id;

        if (newValue.disability_group)
            newValue.disability_group = newValue.disability_group.id;

        model.load(newValue);
        model.update();
        model.db.query('UPDATE `user` SET `name` = ?, `surname` = ?, `lastname` = ?, `email` = ?, phone = ?, sex = ? WHERE `id` = ?', [ model.__get('name'), model.__get('surname'), model.__get('lastname'), model.__get('email'), model.__get('phone'), model.__get('sex'), model.__get('id') ]);
        extraModel.load(newValue);
        extraModel.fields.user_id = model.__get('id');
        extraModel.update(false, "user_id");
    });
}

User.prototype.table = 'user';

module.exports = (new User());
