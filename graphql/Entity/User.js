const Db = require('../utils/Db');
const baseEntity = require('./BaseEntity');
const Rbac = require('../utils/Rbac');
const { crypt, compare } = require('../utils/Crypt');

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

User.prototype._save = async function () {
    this.pass = crypt(this.pass);
    await this.save();
}

User.prototype.auth = async function (data) {
    return new Promise(async (resolve, reject) => {
        let res = await db.select(this, "`email` = ? OR `phone` = ?", [ data['user'], data['user'] ]);
        if (res.length)
        {
            let user = await res[0];
            resolve(await compare(data['pass'], user.password).catch(err => { console.error(err); }));

        }
        else
            resolve(false);
    });
};

User.prototype.table = 'user';


module.exports = (new User());
