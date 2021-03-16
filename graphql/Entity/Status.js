const baseEntity require('./BaseEntity');

let Status = function () {}

Status.prototype = Object.assign(Association.prototype, baseEntity.prototype);

Status.prototype.getInstance = () => Association;

Status.fields = {
    id: null,
};

Status.table = "association";
