const baseEntity = require('./BaseEntity');

let EditDataLogger = function () {}

EditDataLogger.prototype = Object.assign(EditDataLogger.prototype, baseEntity.prototype);

EditDataLogger.prototype.getInstance = () => EditDataLogger;

EditDataLogger.prototype.fields = {
    id: null,
    edited_table: null,
    field: null,
    old_value: null,
    new_value: null,
    timestamp: null,
    target_id: null,
    admin_id: null,
};

EditDataLogger.prototype.table = "edit_data_log";

EditDataLogger.prototype.buildLogRequest = function (onEdit) {
    let data = [];
    data.push(onEdit.edited_table, onEdit.field, onEdit.old_value, onEdit.new_value, onEdit.timestamp, onEdit.admin_id, onEdit.target_id);
    return {
        query: "INSERT INTO `" + this.table + "` (`edited_table`, `field`, `old_value`, `new_value`, `timestamp`, `admin_id`, `target_id`) VALUES (?, ?, ?, ?, ?, ?, ?);",
        data
    }
}

EditDataLogger.prototype.log = async function (data) {
    let fullQuery = "";
    let fullData = [];
    data.map(el => {
        const build = this.buildLogRequest(el);
        fullQuery += build.query;
        fullData = fullData.concat(build.data);
    });
    return await this.db.query(fullQuery, fullData);
}

EditDataLogger.prototype.logModel = async function (model, newData, admin_id) {
    let onLog = [];
    const table = model.table;
    Object.keys(newData).map(field => {
        if (field == 'id')
            return;
        onLog.push({
            edited_table: table,
            field,
            old_value: model.fields[field],
            new_value: newData[field],
            timestamp: Date.now(),
            admin_id,
            target_id: model.__get('id')
        });
    });
    return await this.log(onLog);
}

module.exports = (new EditDataLogger());
