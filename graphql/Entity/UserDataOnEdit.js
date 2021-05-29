const baseEntity = require('./BaseEntity');

let UserDataOnEdit = function () {}

UserDataOnEdit.prototype = Object.assign(UserDataOnEdit.prototype, baseEntity.prototype);

UserDataOnEdit.prototype.getInstance = () => UserDataOnEdit;

UserDataOnEdit.prototype.fields = {
    id: null,
    edited_table: null,
    field: null,
    old_value: null,
    new_value: null,
    timestamp: null,
    target_id: null,
};

UserDataOnEdit.prototype.table = "user_data_onedit";

UserDataOnEdit.prototype.checkAlreadyOnEdit = async function (table, field) {
    return (await this.db.select(this, '`edited_table` = ? AND `field` = ?', [ table, field ])).length > 0;
}

UserDataOnEdit.prototype.setOnEdit = async function (requester_id, target, data, table) {
    let query = "";
    let onEdit = [];
    Object.keys(data).map(key => {
        const el = data[key];
        query += "INSERT INTO `" + this.table + "` (`edited_table`, `field`, `old_value`, `new_value`, `timestamp`, `target_id`, `requester_id`) VALUES (?, ?, ?, ?, ?, ?, ?);";
        onEdit.push(table);
        onEdit.push(key);
        onEdit.push(target.__get(key));
        onEdit.push(el);
        onEdit.push(Date.now());
        onEdit.push(target.__get('id'));
        onEdit.push(requester_id);
    });

    return await this.db.query(query, onEdit).catch(err => {
        console.error(err);
    });
}

UserDataOnEdit.prototype.setUserMainOnEdit = async function (requester_id, target, data) {
    return await this.setOnEdit(requester_id, target, data, 'user');
}

module.exports = (new UserDataOnEdit());
