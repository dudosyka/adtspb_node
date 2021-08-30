const baseEntity = require('./BaseEntity');
const AppConfig = require('../config/AppConfig');

let UserGroupLog = function () {}

UserGroupLog.prototype = Object.assign(UserGroupLog.prototype, baseEntity.prototype);

UserGroupLog.prototype.getInstance = () => UserGroupLog;

UserGroupLog.prototype.fields = {
    id: null,
    timestamp: null,
    action: null,
    user_id: null,
    group_id: null
};

UserGroupLog.prototype.table = "user_group_log";

UserGroupLog.prototype.log = async function (user, group) {
    this.__set("timestamp", Date.now());
    this.__set("user_id", user);
    this.__set('group_id', group);
    return await this.save();
}

UserGroupLog.prototype.logJoin = async function (user, group) {
    this.__set('action', 'join');
    return this.log(user, group);
}

UserGroupLog.prototype.logLeft = async function (user, group) {
    this.__set('action', 'left');
    return await this.log(user, group);
}

module.exports = (new UserGroupLog());
