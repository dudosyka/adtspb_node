const baseEntity = require('./BaseEntity');
const DataOnEdit = require('./DataOnEdit');

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
    requester_id: null,
    confirm_timestamp: null
};

UserDataLog.prototype.table = "user_data_log";

UserDataLog.prototype.confirmEditRequest = async function (request_id, admin_id) {
    const request = await DataOnEdit.getRequest(request_id);
    this.fields = Object.assign(this.fields, request.fields);
    this.__set('id', null);
    this.__set('edit_timestamp', request.__get('timestamp'));
    this.__set('confirm_timestamp', Date.now());
    this.__set('admin_id', admin_id);

    const res = await this.save();

    if (res === false)
        throw Error('Saving data error');

    return request;
}

UserDataLog.prototype.autoConfirm = async function (inObj) {
    query = "";
    data = [];
    inObj.map(el => {
        el.confirm_timestamp = Date.now(),
        query += "INSERT INTO "+this.table+" (edited_table, field, old_value, new_value, edit_timestamp, target_id, requester_id) VALUES (?,?,?,?,?,?,?);"

        data.push(el.edited_table, el.field, el.old_value, el.new_value, el.edit_timestamp, el.target_id, el.requester_id);
    });
    const res = await this.db.query(query, data).catch(err => { console.error(err); });
}

module.exports = (new UserDataLog());
