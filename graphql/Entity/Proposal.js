const baseEntity = require('./BaseEntity');

const User = require('./User');
const UserExtraData = require('./UserExtraData');

const Association = require('./Association');
const AssociationExraData = require('./AssociationExraData');

const Status = require('./Status');

const AppConfig = require('../config/AppConfig');
const Pdf = require('../utils/pdf/Pdf');

let Proposal = function () {}

Proposal.prototype = Object.assign(Proposal.prototype, baseEntity.prototype);

Proposal.prototype.getInstance = () => Proposal;

Proposal.prototype.fields = {
    id: null,
    association_id: null,
    parent_id: null,
    child_id: null,
    document_taken: null
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
    return await this.baseCreateFrom(data);
}

Proposal.prototype.selectByAssociation = async function (association, notRevoked = false) {
    const status = notRevoked ? -1 : 2;
    return await this.db.query("SELECT * FROM `proposal` as `main` LEFT JOIN `proposal_status` as `status` ON `main`.`id` = `status`.`proposal_id` WHERE `main`.`association_id` = ? AND `status`.id != ?", [ association.id, status ]).then(data => data).catch(err => { console.error(err); });
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

Proposal.prototype.canJoinAssociation = async function () {
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
        if (associationData.__get('min_age') === null)
            throw Error("Association not found");

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

        return true;
}

Proposal.prototype.createNew = async function () {
    await this.canJoinAssociation();

    const proposal = await this.save();

    if (proposal === false)
        throw Error('Saving data failed');

    const status = await Status.createFrom({ proposal_id: proposal.insertId });
    await status.setToCreate();

    return true;
};

Proposal.prototype.generatePdf = async function () {
    const pdf = new Pdf(this);
    return await pdf.generateProposal();
}

Proposal.prototype.recall = async function (requester) {
    if (this.__get('association_id') === null)
        throw Error('Proposal not found');

    if (requester !== this.__get('parent_id')) {
        // const user = User.createFrom({id: requester});
        // Проверять тут проавило позволяющее админам отзывыать любые заявления
        // if ()
        throw Error('Forbidden');
    }

    if (this.__get('document_taken') == 1) {
        throw Error('Document taken');
    }

    return await Status.setToRecall(this.__get('id'));
}
module.exports = (new Proposal());
