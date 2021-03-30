const baseEntity = require('./BaseEntity');
const User = require('./User');
const Association = require('./Association');
const AppConfig = require('../config/AppConfig');

let Proposal = function () {}

Proposal.prototype = Object.assign(Proposal.prototype, baseEntity.prototype);

Proposal.prototype.getInstance = () => Proposal;

Proposal.prototype.fields = {
    id: null,
};

Proposal.prototype.aliases = {
    association: "association_id",
    child: "child_id",
    parent: "parent_id"
}

Proposal.prototype.table = "proposal";

Proposal.prototype.createFromInput = async function (proposal) {
    let data = {
        id: proposal["id"] ? proposal["id"] : null,
        association_id: proposal["association"] ? proposal["association"]["id"] ? parseInt(proposal["association"]["id"]) : null : null,
        parent_id: proposal["parent"] ? proposal["parent"]["id"] ? parseInt(proposal["parent"]["id"]) : null : null,
        child_id: proposal["child"] ? proposal["child"]["id"] ? parseInt(proposal["child"]["id"]) : null : null,
    };
    console.log("proposal", data);
    return await this.createFrom(data);
}

Proposal.prototype.selectByAssociation = async function (association) {
    return await this.db.select(this, "`association_id` = ?", [ association.id ]).then(data => data).catch(err => { console.error(err); });
};

Proposal.prototype.selectByUser = async function (user) {
    return (User.checkRole(AppConfig.parent_role_id, user.__role))
    ? await this.selectByParent(user)
    : await this.selectByChild(user);
}

Proposal.prototype.selectByChild = async function (child) {
    return await this.db.select(this, "`child_id` = ?", [ child.id ]).then(data => data).catch(err => { console.error(err); });
};

Proposal.prototype.selectByParent = async function (parent) {
    return await this.db.select(this, "`parent_id` = ?", [ parent.id ]).then(data => data).catch(err => { console.error(err); });
};

Proposal.prototype.createNew = async function () {
    if (this.__get('parent') == null || this.__get('child') == null || this.__get('association') == null)
        return false;

    let data = {
        id: this.__get('parent')
    };

    let parent = await User.createFrom(data);
    let children = await parent.getChildren();

    if (!children.includes(this.__get('child')))
        return false;

    // TODO: Check if proposal already created

    // TODO: Check can child join association

    return await this.save() !== false ? true : false;
};

module.exports = (new Proposal());
