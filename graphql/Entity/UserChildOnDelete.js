const baseEntity = require('./BaseEntity');
const UserChildLog = require('./UserChildLog');


let UserChildOnDelete = function () {}

UserChildOnDelete.prototype = Object.assign(UserChildOnDelete.prototype, baseEntity.prototype);

UserChildOnDelete.prototype.getInstance = () => UserChildOnDelete;

UserChildOnDelete.prototype.fields = {
    id: null,
    user_child_id: null,
    remove_account: null
};

UserChildOnDelete.prototype.setOnDelete = function (id, removeAccount) {
    this.__set('user_child_id', id);
    this.__set('remove_account', removeAccount ? 1 : 0);
    this.save();
}

UserChildOnDelete.prototype.confirmRemoveChild = async function (userChild, admin_id) {
    const userChildLog = await UserChildLog.createFromUserChild(userChild);
    userChildLog.removeChild(admin_id);
    userChild.delete();
    if (this.__get('remove_account') == 1)
        this.db.query('DELETE FROM `user` WHERE `id` = ?', [ userChild.__get('child_id') ]);
    this.delete();
    return true;
}

UserChildOnDelete.prototype.table = "user_child_ondelete";

module.exports = (new UserChildOnDelete());
