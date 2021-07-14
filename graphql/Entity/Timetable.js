const baseEntity = require('./BaseEntity');

let Timetable = function () {}

Timetable.prototype = Object.assign(Timetable.prototype, baseEntity.prototype);

Timetable.prototype.getInstance = () => Timetable;

Timetable.prototype.fields = {
    id: null,
};

Timetable.prototype.createFromField = "association_id";

Timetable.prototype.table = "timetable";

module.exports = (new Timetable());
