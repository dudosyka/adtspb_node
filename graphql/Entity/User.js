const Db = require('../utils/Db');
const baseEntity = require('./BaseEntity');
const Rbac = require('../utils/Rbac');

let db = new Db();
let rbac = new Rbac();

let User = function () {}

User.prototype = Object.assign(User.prototype, baseEntity.prototype);

User.prototype.createFrom = async function (data)
{
    if (data === {})
        return;
    data = await this.construct(data);
    Object.assign(this.fields, data);
    let { role, rules } = await rbac.auth(this.__get('id'));
    this.fields.__accessible = rules;
    this.fields.__role = role;
    return this;
}

User.prototype.getInstance = () => User;

User.prototype.fields = {
    id: null,
    login: null,
    pass: null,
    token: null
};

User.prototype.getRole = async function () {
    return db.query("SELECT `role_id` FROM `user_role` WHERE `user_id` = ?", [ this.__get('id') ])
        .then(data => {
            console.log(data);
        })
        .catch(err => {
            console.error(err);
        });
}

User.prototype.table = 'user';