const baseEntity = require('./BaseEntity');
const UserChildLog = require('./UserChildLog');
const UserChildOnDelete = require('./UserChildOnDelete');
const Proposal = require('./Proposal');
const AppConfig = require('../config/AppConfig');

let UserChild = function () {}

UserChild.prototype = Object.assign(UserChild.prototype, baseEntity.prototype);

UserChild.prototype.getInstance = () => UserChild;

UserChild.prototype.fields = {
    id: null,
    child_id: null,
    parent_id: null,
    agreed: null,
};

UserChild.prototype.checkRelationship = async function () {
    const req = await this.db.select(this, '`child_id` = ? AND `parent_id` = ?', [ this.__get('child_id'), this.__get('parent_id') ]);
    if (req.length > 0) {
        this.fields['id'] = req[0].id;
        return true;
    } else {
        return false
    };
}

UserChild.prototype.removeChild = async function (removeAccount, comment) {
    UserChildOnDelete.setOnDelete(this.__get('id'), removeAccount, comment);
}

UserChild.prototype.addParentRequest = async function () {
    const check = await this.db.select(this, '`parent_id` = ? AND `child_id` = ?', [this.__get('parent_id'), this.__get('child_id')]);
    if (check.length) {
        return false;
    }
    return await this.save();
}

UserChild.prototype.removeRequest = async function () {
    if (Object.keys(this.fields).length < 4)
        throw Error('Request not found');

    const log = await UserChildLog.createFromUserChild(this);
    await log.log("cancel", 1);
    await this.delete();
    return true;
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
    const userChildLog = await UserChildLog.createFromUserChild(this);;
    this.fields.agreed = 1;
    userChildLog.addChild();

    await this.update();
}

UserChild.prototype.getChildren = async function (child = true, agreed = 0, selections = {}, userModel = null) {
    let field = 'parent_id';
    let rangeField = 'child_id';
    if (!child)
    {
        field = 'child_id';
        rangeField = 'parent_id';
    }
    const res = await this.db.select(this, field + " = ? AND `agreed` = ?", [ this.__get(field), agreed ]);
    const ids = res.map(el => el[rangeField]);

    if (res.length) {
        proposalModel = Proposal.newModel();
        return await userModel.getFullData(ids, selections, proposalModel, [AppConfig.parent_role_id]);
    } else {
        return [];
    }
}

UserChild.prototype.getParents = async function (children) {
    const { query, ids } = this.db.createRangeQuery(false, children, 'child_id');
    const data = await this.db.select(this, query, ids);

    return data.map(el =>({[el.parent_id]: el.child_id}));
}

UserChild.prototype.getChildRequests = async function () {
    return this.getChildren();
}

UserChild.prototype.getParentRequests = async function (selections = {}, userModel = null) {
    return this.getChildren(false, 0, selections, userModel);
}

UserChild.prototype.table = "user_child";


module.exports = (new UserChild());
