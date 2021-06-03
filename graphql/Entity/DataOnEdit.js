const baseEntity = require('./BaseEntity');

let DataOnEdit = function () {}

DataOnEdit.prototype = Object.assign(DataOnEdit.prototype, baseEntity.prototype);

DataOnEdit.prototype.getInstance = () => DataOnEdit;

DataOnEdit.prototype.fields = {
    id: null,
    edited_table: null,
    field: null,
    old_value: null,
    new_value: null,
    timestamp: null,
    target_id: null,
};

DataOnEdit.prototype.table = "data_onedit";

DataOnEdit.prototype.checkAlreadyOnEdit = async function (table, field) {
    return (await this.db.select(this, '`edited_table` = ? AND `field` = ?', [ table, field ])).length > 0;
}

DataOnEdit.prototype.setOnEdit = async function (requester_id, target, data, table) {
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

DataOnEdit.prototype.setUserOnEdit = async function (requester_id, target, data, table, target_id = null, autoConfirm = false) {
    let query = "";
    let onEdit = [];
    let inObj = [];
    Object.keys(data).map(key => {
        const el = data[key];
        query += "INSERT INTO `" + this.table + "` (`edited_table`, `field`, `old_value`, `new_value`, `timestamp`, `target_id`, `requester_id`) VALUES (?, ?, ?, ?, ?, ?, ?);";
        onEdit.push(table);
        onEdit.push(key);
        onEdit.push(target.__get(key));
        onEdit.push(el);
        onEdit.push(Date.now());
        onEdit.push(target_id === null ? target.__get('id') : target_id);
        onEdit.push(requester_id);
        inObj.push({
            edited_table: table,
            field: key,
            old_value: target.__get(key),
            new_value: el,
            edit_timestamp: Date.now(),
            target_id: target_id === null ? target.__get('id') : target_id,
            requester_id: requester_id

        });
    });

    return (!autoConfirm)
        ? await this.db.query(query, onEdit).catch(err => { console.error(err); })
        : inObj;
}

// DataOnEdit.prototype.setUserMainOnEdit = async function (requester_id, target, data) {
//     return await this.setOnEdit(requester_id, target, data, 'user');
// }
//
// DataOnEdit.prototype.setUseExtraOnEdit = async function (requester_id, target, data) {
//     return await this.setOnEdit(requester_id, target, data, 'user_extra_data');
// }

DataOnEdit.prototype.getRequest = async function (request_id) {
    const model = this.newModel();
    const request = await this.db.select(this, '`id` = ?', [ request_id ]);
    if (request.length < 1)
        throw Error('Request not found');

    model.fields = Object.assign(model.fields, request[0]);

    return model;
}

module.exports = (new DataOnEdit());
