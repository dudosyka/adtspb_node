const Db = require('../utils/Db');
const { construct } = require('./BaseEntity');
const Rbac = require('../utils/Rbac');

let db = new Db();
let rbac = new Rbac();

let User = function () {}

User.prototype.createFrom = async function (data)
{
    if (data === {})
        return;
    data = await construct(this, data);
    Object.assign(this.fields, data);
    let { role, rules } = await rbac.auth(this.__get('id'));
    this.fields.__accessible = rules;
    this.fields.__role = role;
    console.log(this);
    console.log(this.fields);
    return this;
}

User.prototype.getInstance = () => User;

User.prototype.fields = {
    id: null,
    name: null
};

User.prototype.__get = function (field) {
    return this.fields[field];
}

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

module.exports = (new User());
