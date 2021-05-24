const baseEntity = require('./BaseEntity');

let UserChild = function () {}

UserChild.prototype = Object.assign(UserChild.prototype, baseEntity.prototype);

// UserChild.prototype.createFrom = async function (data) {
//     if (data.id) {
//         return await this.baseCreateFrom(data);
//     }
// }

UserChild.prototype.getInstance = () => UserChild;

UserChild.prototype.fields = {
    id: null,
};

UserChild.prototype.addParentRequest = async function () {
    const check = await this.db.select(this, '`parent_id` = ? AND `child_id` = ?', [this.__get('parent_id'), this.__get('child_id')]);
    if (check.length) {
        return false;
    }
    return await this.save();
}

UserChild.prototype.parentRequestExists = async function () {
    const request = await this.db.select(this, '`id` = ?', [ this.__get('id') ]);
    if (request.length !== 0) {
         const data = request[0];
         if (data.agreed == 1)
            return 'Request had already agreed';
         let instance = this.getInstance();
         instance = (new instance());
         instance = await instance.baseCreateFrom(data);
         if (instance.__get('child_id') == this.__get('child_id'))
         {
             return true;
         }
         return 'Child (' + this.__get('child_id') + ') not found in this request (' + this.__get('id') + ')';
    }
    return 'Request not found';
}

UserChild.prototype.agreeParentRequest = async function () {
    this.__set('agreed', 1);
     // TODO: Put logs into user_edit_data (author - child or parent?)
     await this.update();
}

UserChild.prototype.getChildren = async function (child = true, agreed = 0) {
    let field = 'parent_id';
    let rangeField = 'child_id';
    if (!child)
    {
        field = 'child_id';
        rangeField = 'parent_id';
    }
    const res = await this.db.select(this, field + " = ? AND `agreed` = ?", [ this.__get(field), agreed ]);
    if (res.length) {
        const range = this.db.createRangeQuery(rangeField, res);
        return await this.db.query("SELECT * FROM `user` WHERE " + range.query, range.ids);
    } else {
        return [];
    }
}

UserChild.prototype.getChildRequests = async function () {
    return this.getChildren();
}

UserChild.prototype.getParentRequests = async function () {
    return this.getChildren(false);
}

UserChild.prototype.table = "user_child";


module.exports = (new UserChild());
