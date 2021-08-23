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

UserDataOnEdit.prototype.setUserOnEdit = async function (requester_id, target, data, table, target_id = null, autoConfirm = false) {
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

UserDataOnEdit.prototype.getRequest = async function (request_id) {
    const model = this.newModel();
    const request = await this.db.select(this, '`id` = ?', [ request_id ]);
    if (request.length < 1)
        throw Error('Request not found');

    model.fields = Object.assign(model.fields, request[0]);

    return model;
}

UserDataOnEdit.prototype.getUserDataOnEdit = async function (requester_id, target_id = null) {
    target_id = target_id ?? requester_id;
    return await this.db.select(this, "`requester_id` = ? AND `target_id` = ?", [ requester_id, target_id ]);
}

UserDataOnEdit.prototype.getListByUser = async function (search, userModel) {
    search = "%" + search + "%";
    const users = await userModel.getFullData(false, {}, null, [], false, ' `main`.`surname` LIKE ?', [ search ]);
    let arr = [...new Set(users.map(el => el.id))];
    let range = this.db.createRangeQuery(false, arr, '');

    const whereQuery = "`target_id` " + range.query + " OR " + "`requester_id` " + range.query;
    const whereData = range.ids.concat(range.ids);

    const data = await this.db.select(this, whereQuery, whereData);
    arr = data.map(el => el.target_id).concat(data.map(el => el.requester_id));
    arr = [...new Set(arr)];
    range = this.db.createRangeQuery(false, arr, '`main`.`id`');
    const fullUsers = await userModel.getFullDataAsObject(false, {}, null, [], range.query, range.ids);

    const res = data.map(request => {
        request.target = fullUsers[request.target_id];
        request.requester = fullUsers[request.requester_id];
        return request;
    });

    return res;
}

module.exports = (new UserDataOnEdit());
