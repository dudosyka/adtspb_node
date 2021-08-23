const baseEntity = require('./BaseEntity');
const UserChildLog = require('./UserChildLog');


let UserChildOnDelete = function () {}

UserChildOnDelete.prototype = Object.assign(UserChildOnDelete.prototype, baseEntity.prototype);

UserChildOnDelete.prototype.getInstance = () => UserChildOnDelete;

UserChildOnDelete.prototype.fields = {
    id: null,
    user_child_id: null,
    remove_account: null,
    comment: null
};

UserChildOnDelete.prototype.setOnDelete = function (id, removeAccount, comment) {
    this.__set('user_child_id', id);
    this.__set('remove_account', removeAccount ? 1 : 0);
    this.__set('comment', comment);
    this.save();
}

UserChildOnDelete.prototype.confirmRemoveChild = async function (userChild, admin_id) {
    const userChildLog = await UserChildLog.createFromUserChild(userChild);
    await userChildLog.removeChild(admin_id, this.__get('comment'));
    userChild.delete();
    if (this.__get('remove_account') == 1)
        this.db.query('DELETE FROM `user` WHERE `id` = ?', [ userChild.__get('child_id') ]);
    this.delete();
    return true;
}

UserChildOnDelete.prototype.getList = async function (userModel) {
    const requests = await this.db.select(this, '`id` != ?', [ 0 ]);
    let range = this.db.createRangeQuery('user_child_id', requests, 'id');

    const userChild = await this.db.query('select * from `user_child` where ' + range.query, range.ids);
    let arr = [...new Set(userChild.map(el => el.child_id).concat(userChild.map(el => el.parent_id)))];
    range = this.db.createRangeQuery(false, arr, '`main`.`id`')
    const users = await userModel.getFullDataAsObject(false, {}, null, [], range.query, range.ids);
    let userChildObject = {};
    userChild.map(el => {
        el.child = users[el.child_id];
        el.parent = users[el.parent_id];
        userChildObject[el.id] = el;
    });

    return requests.map(request => {
        request.child = userChildObject[request.user_child_id].child;
        request.parent = userChildObject[request.user_child_id].parent;
        request.remove = request.remove_account;
        return request;
    });
}

UserChildOnDelete.prototype.table = "user_child_ondelete";

module.exports = (new UserChildOnDelete());
