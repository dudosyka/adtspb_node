const baseEntity = require('./BaseEntity');
const User = require('./User');
const AppConfig = require('../config/AppConfig');

let Proposal = function () {}

Proposal.prototype = Object.assign(Proposal.prototype, baseEntity.prototype);

Proposal.prototype.getInstance = () => Proposal;

Proposal.prototype.fields = {
    id: null,
};

Proposal.prototype.table = "proposal";

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

module.exports = (new Proposal());
