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
    const request = await UserDataOnEdit.getRequest(request_id);
    this.fields = Object.assign(this.fields, request.fields);
    this.__set('id', null);
    this.__set('edit_timestamp', request.__get('timestamp'));
    this.__set('confirm_timestamp', Date.now());
    this.__set('admin_id', admin_id);
    // console.log(request.fields);
    // console.log(this.fields);
    const res = await this.save();

    if (res === false)
        throw Error('Saving data error');

    return request;
}

module.exports = (new UserDataLog());
