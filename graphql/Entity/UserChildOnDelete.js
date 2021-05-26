const baseEntity = require('./BaseEntity');
const User = require('./User');
const UserChildLog = require('./UserChildLog');


let UserChildOnDelete = function () {}

UserChildOnDelete.prototype = Object.assign(UserChildOnDelete.prototype, baseEntity.prototype);

UserChildOnDelete.prototype.getInstance = () => UserChildOnDelete;

UserChildOnDelete.prototype.fields = {
    id: null,
    user_child_id: null
};

UserChildOnDelete.prototype.setOnDelete = function (id) {
    this.__set('user_child_id', id);
    this.save();
}

UserChildOnDelete.prototype.confirmRemoveChild = async function (userChild, admin_id) {
    const userChildLog = await UserChildLog.createFromUserChild(userChild);
    userChildLog.removeChild(admin_id);
    userChild.delete();
    this.delete();
    return true;
}

UserChildOnDelete.prototype.table = "user_child_ondelete";

module.exports = (new UserChildOnDelete());
