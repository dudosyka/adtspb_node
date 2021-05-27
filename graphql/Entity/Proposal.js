const baseEntity = require('./BaseEntity');

const User = require('./User');
const UserExtraData = require('./UserExtraData');

const Association = require('./Association');
const AssociationExraData = require('./AssociationExraData');

const Status = require('./Status');

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
    // console.log("proposal", data);
    return await this.createFrom(data);
}

Proposal.prototype.selectByAssociation = async function (association) {
    return await this.db.select(this, "`association_id` = ?", [ association.id ]).then(data => data).catch(err => { console.error(err); });
};

Proposal.prototype.selectByUser = async function (user) {
    return (User.checkRole(AppConfig.parent_role_id, user.__role))
    ? await this.selectByParent(user)
    : await this.selectByChild(user.__get('id'));
}

Proposal.prototype.selectByChild = async function (child_id) {
    return await this.db.select(this, "`child_id` = ?", [ child_id ]).then(data => data).catch(err => { console.error(err); });
};

Proposal.prototype.selectByParent = async function (parent) {
    return await this.db.select(this, "`parent_id` = ?", [ parent.id ]).then(data => data).catch(err => { console.error(err); });
};

Proposal.prototype.checkProposalExists = async function () {
    return (await this.db.select(this, '`child_id` = ? AND `association_id` = ?', [ this.__get('child'), this.__get('association') ])).length > 0;
}

Proposal.prototype.checkStudyLoad = async function () {
    const proposals = await this.selectByChild(this.__get('child'));
    let association_ids = [];

    proposals.map(el => {
        association_ids.push({id: el.id});
    });

    const associations = await AssociationExraData.getList(association_ids);
    let hours = 0;

    associations.map(el => {
        hours += el.hours_week;
    });

    console.log(hours);

    return hours;
}

Proposal.prototype.createNew = async function () {
    if (this.__get('parent') == null || this.__get('child') == null || this.__get('association') == null)
        throw Error('Bad request');

    let data = {
        id: this.__get('parent')
    };

    const parent = await User.createFrom(data);
    const children = await parent.getChildren();

    //Check can parent create proposals
    if (!parent.hasAccess(13)) {
        throw Error('Forbidden');
    }

    //Check relation
    if (!children.includes(this.__get('child')))
        throw Error("Child not found");

    const child = await UserExtraData.createFrom({user_id: this.__get('child')});
    const age = child.calculateAge();

    //Check if proposal had already created
    if (await this.checkProposalExists())
        throw Error('Proposal had already created');

    const associationData = await AssociationExraData.createFrom({association_id: this.__get('association_id')});
    const canJoin = await associationData.canJoinAssociation();

    //Check does child pass by age
    if (canJoin !== true)
        throw Error(canJoin);

    //Check hours at week
    const loadCheck = await this.checkStudyLoad();

    if (age < 14) {
        if (loadCheck > 10)
            throw Error('Too many hours');
    } else {
        if (loadCheck > 12)
            throw Error('Too many hours')
    }

    const proposal = await this.save();

    if (proposal === false)
        throw Error('Saving data failed');

    const status = await Status.createFrom({ proposal_id: proposal.insertId });
    await status.setToCreate();

    return true;
};

module.exports = (new Proposal());
