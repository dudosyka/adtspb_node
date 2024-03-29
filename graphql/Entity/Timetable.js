const baseEntity = require('./BaseEntity');

let Timetable = function () {}

Timetable.prototype = Object.assign(Timetable.prototype, baseEntity.prototype);

Timetable.prototype.getInstance = () => Timetable;

Timetable.prototype.fields = {
    id: null,
};

Timetable.prototype.createFromField = "association_id";

Timetable.prototype.table = "timetable";

Timetable.prototype.newFromInput = async function (input) {
    this.load(input);
    const res = await this.save();
    if (res === false) {
        throw Error(JSON.stringify(await this.validate()));
    }
    return res.insertId;
}

Timetable.prototype.edit = async function (newValue, logger, admin_id) {
    if (!newValue.id)
        throw Error('Must provide `id` field into `input`');

    const id = newValue.id;
    delete newValue.id;

    const model = this.newModel();
    const oldValue = await this.db.query("SELECT * FROM `timetable` as `main` WHERE `main`.`id` = ?", [ Number(id) ]);
    model.load(oldValue[0]);

    return await logger.logModel(model, newValue, admin_id, id).then(res => {
        model.load(newValue);
        model.update();
    });
}

Timetable.prototype.getByGroup = async function (groups_id, selections) {
    const { ids, query } = this.db.createRangeQuery(false, groups_id, 'group_id');

    const timetables = await this.db.select(this, query, ids);

    let result = {};
    timetables.map(timetable => {
        if (result[timetable.group_id]) {
            result[timetable.group_id].push(timetable);
        }
        else {
            result[timetable.group_id] = [ timetable ];
        }
    });

    return result;
}

module.exports = (new Timetable());
