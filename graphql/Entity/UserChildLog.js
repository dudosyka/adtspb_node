const baseEntity = require('./BaseEntity');

let UserChildLog = function () {}

UserChildLog.prototype = Object.assign(UserChildLog.prototype, baseEntity.prototype);

UserChildLog.prototype.getInstance = () => UserChildLog;

UserChildLog.prototype.createFromUserChild = async function (userChild) {
    // console.log(this.fields);
    this.__set('child_id', userChild.__get('child_id'));
    this.__set('parent_id', userChild.__get('parent_id'));
    const instance = this.newModel();
    instance.fields = this.fields;
    return instance;
}

UserChildLog.prototype.fields = {
    id: null,
    child_id: null,
    parent_id: null,
    description: null,
    confirmed: null,
    admin_id: null,
    timestamp: null
};

UserChildLog.prototype.log = function (description, confirmed = 0, admin = null) {
    this.__set('description', description);
    this.__set('confirmed', confirmed);
    this.__set('timestamp', Date.now());
    this.__set('admin_id', admin);
    this.save();
}

UserChildLog.prototype.removeChild = function (admin_id) {
    this.log('remove', 1, admin_id);
}

UserChildLog.prototype.addChild = function () {
    this.log('add', 1);
}

UserChildLog.prototype.table = "user_child_log";

module.exports = (new UserChildLog());
