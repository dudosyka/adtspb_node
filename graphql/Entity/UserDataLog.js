const baseEntity = require('./BaseEntity');
const UserDataOnEdit = require('./UserDataOnEdit');

let UserDataLog = function () {}

UserDataLog.prototype = Object.assign(UserDataLog.prototype, baseEntity.prototype);

UserDataLog.prototype.getInstance = () => UserDataLog;

UserDataLog.prototype.fields = {
    id: null,
    edited_table: null,
    field: null,
    old_value: null,
    new_value: null,
    edit_timestamp: null,
    admin_id: null,
    target_id: null,
    confirm_timestamp: null
};

UserDataLog.prototype.table = "user_data_log";

UserDataLog.prototype.confirmEditRequest = async function (request_id, admin_id) {
    const request = await UserDataOnEdit.baseCreateFrom({id: request_id});
    this.fields = Object.assign(this.fields, request.fields);
    this.__set('id', null);
    this.__set('edit_timestamp', request.timestamp);
    this.__set('confirm_timestamp', Date.now());
    this.__set('admin_id', admin_id);
    return await this.save();
}

module.exports = (new UserDataLog());
