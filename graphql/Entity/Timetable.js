const baseEntity = require('./BaseEntity');

let Timetable = function () {}

Timetable.prototype = Object.assign(Timetable.prototype, baseEntity.prototype);

Timetable.prototype.getInstance = () => Timetable;

Timetable.prototype.fields = {
    id: null,
};

Timetable.prototype.createFrom = async function (data) {
    if (data.association_id) {
        const req = await this.db.select(this, '`association_id` = ?', [ data.association_id ]);
        if (req.length) {
            let models = [];
            req.map(el => {
                const model = this.newModel();
                const newData = Object.assign(el, data);
                model.fields = newData;
                models.push(model);
            });
            return models;
        }
        else
            return await this.baseCreateFrom(data);
    }
    return this.baseCreateFrom(data);
}

Timetable.prototype.table = "timetable";

module.exports = (new Timetable());
