const baseEntity = require('./BaseEntity');

let Group = function () {}

Group.prototype = Object.assign(Group.prototype, baseEntity.prototype);

Group.prototype.getInstance = () => Group;

Group.prototype.fields = {
    id: null,
};

Group.prototype.table = "group";

module.exports = (new Group());
