const Db = require('../utils/Db');
const { construct } = require('./BaseEntity');

let db = new Db();

let User = function () {}

User.prototype.createFrom = async function (data)
{
    if (data === {})
        return;
    data = await construct(this, data);
    Object.assign(this.fields, data);
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
