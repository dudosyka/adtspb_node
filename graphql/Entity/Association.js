const baseEntity require('./BaseEntity');

let Association = function () {}

Association.prototype = Object.assign(Association.prototype, baseEntity.prototype);

Association.prototype.getInstance = () => Association;

Association.fields = {
    id: null,
};

Association.table = "association";
