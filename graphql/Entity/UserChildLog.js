const baseEntity = require('./BaseEntity');

let UserChildLog = function () {}

UserChildLog.prototype = Object.assign(UserChildLog.prototype, baseEntity.prototype);

UserChildLog.prototype.getInstance = () => UserChildLog;

UserChildLog.prototype.createFromUserChild = async function (userChild) {
    this.__set('child_id', userChild.__get('child_id'));
    this.__set('parent_id', userChild.__get('parent_id'));
    const range = this.db.createRangeQuery('id', [
        {
            id: this.__get('child_id'),
        },
        {
            id: this.__get('parent_id')
        }
    ]);
    const emails = await this.db.query('SELECT `id`, `email` FROM `user` WHERE ' + range.query, range.ids);
    emails.map(el => {
        if (el.id == this.__get('child_id'))
            this.__set('child_email', el.email);
        if (el.id == this.__get('parent_id'))
            this.__set('parent_email', el.email);
    });
    const instance = this.newModel();
    instance.fields = this.fields;
    return instance;
}

UserChildLog.prototype.fields = {
    id: null,
    child_id: null,
    child_email: null,
    parent_id: null,
    parent_email: null,
    description: null,
    confirmed: null,
    admin_id: null,
    timestamp: null
};

UserChildLog.prototype.log = async function (description, confirmed = 0, admin = null) {
    this.__set('description', description);
    this.__set('confirmed', confirmed);
    this.__set('timestamp', Date.now());
    this.__set('admin_id', admin);
    await this.save();
}

UserChildLog.prototype.removeChild = async function (admin_id) {
    return await this.log('remove', 1, admin_id);
}

UserChildLog.prototype.addChild = async function () {
    return await this.log('add', 1);
}

UserChildLog.prototype.table = "user_child_log";

module.exports = (new UserChildLog());
