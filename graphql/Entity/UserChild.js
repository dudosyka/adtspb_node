const baseEntity = require('./BaseEntity');
const UserChildLog = require('./UserChildLog');
const UserChildOnDelete = require('./UserChildOnDelete');

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

UserChild.prototype.checkRelationship = async function () {
    // console.log(this.fields);
    const req = await this.db.select(this, '`child_id` = ? AND `parent_id` = ?', [ this.__get('child_id'), this.__get('parent_id') ]);
    if (req.length > 0) {
        this.fields['id'] = req[0].id;
        return true;
    } else {
        return false
    };
}

UserChild.prototype.removeChild = async function (removeAccount) {
    UserChildOnDelete.setOnDelete(this.__get('id'), removeAccount);
}

UserChild.prototype.addParentRequest = async function () {
    const check = await this.db.select(this, '`parent_id` = ? AND `child_id` = ?', [this.__get('parent_id'), this.__get('child_id')]);
    if (check.length) {
        return false;
    }
    return await this.save();
}

UserChild.prototype.parentRequestExists = async function (child_id) {
    //Check if parent_id is not null then request exists
    if (this.__get('parent_id') != null) {
         if (this.__get('agreed') == 1)
            return 'Request had already agreed';
         if (this.__get('child_id') == child_id)
         {
             return true;
         }
         return 'Child (' + child_id + ') not found in this request (' + this.__get('id') + ')';
    }
    return 'Request not found';
}

UserChild.prototype.agreeParentRequest = async function () {
    const userChildLog = await UserChildLog.createFromUserChild(this);
    this.__set('agreed', 1);
    userChildLog.addChild();
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
        const children = await this.db.query("SELECT * FROM `user` as `main` LEFT JOIN `user_extra_data` AS `data` ON `main`.`id` = `data`.`user_id` WHERE `main`." + range.query, range.ids);
        children.map(el => {
            el.id = el.user_id;
            return el;
        })
        return children;
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
