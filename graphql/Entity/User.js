const Db = require('../utils/Db');

let User = function (data = {})
{
    Object.assign(this.fields, data);
}

User.prototype.getInstance = () => User;

User.prototype.fields = {
    id: null,
    name: null
};

User.prototype.table = 'mysql.user';

module.exports = User;