const baseEntity = require('./BaseEntity');

let Association = function () {}

Association.prototype = Object.assign(Association.prototype, baseEntity.prototype);

Association.prototype.getInstance = () => Association;

Association.prototype.fields = {
    id: null,
};

Association.prototype.table = "association";

module.exports = (new Association());
